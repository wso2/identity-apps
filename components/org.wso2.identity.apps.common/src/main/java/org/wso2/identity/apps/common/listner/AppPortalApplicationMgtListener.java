/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.identity.apps.common.listner;

import org.wso2.carbon.identity.application.authentication.framework.util.FrameworkConstants;
import org.wso2.carbon.identity.application.common.IdentityApplicationManagementClientException;
import org.wso2.carbon.identity.application.common.IdentityApplicationManagementException;
import org.wso2.carbon.identity.application.common.model.InboundAuthenticationRequestConfig;
import org.wso2.carbon.identity.application.common.model.ServiceProvider;
import org.wso2.carbon.identity.application.mgt.ApplicationMgtSystemConfig;
import org.wso2.carbon.identity.application.mgt.dao.ApplicationDAO;
import org.wso2.carbon.identity.application.mgt.listener.AbstractApplicationMgtListener;
import org.wso2.carbon.identity.oauth.Error;
import org.wso2.carbon.utils.multitenancy.MultitenantConstants;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;

import java.util.Set;

/**
 * App portal application management listener.
 */
public class AppPortalApplicationMgtListener extends AbstractApplicationMgtListener {

    private boolean enable;

    private Set<String> systemAppConsumerKeys;

    public AppPortalApplicationMgtListener(boolean enable) {

        this.enable = enable;
        systemAppConsumerKeys = AppsCommonDataHolder.getInstance().getSystemAppConsumerKeys();
    }

    @Override
    public int getDefaultOrderId() {
        return 30;
    }

    @Override
    public boolean isEnable() {

        return enable;
    }

    @Override
    public boolean doPreUpdateApplication(ServiceProvider serviceProvider, String tenantDomain, String userName)
            throws IdentityApplicationManagementException {

        if (!isEnable() || !MultitenantConstants.SUPER_TENANT_DOMAIN_NAME.equals(tenantDomain)) {
            return true;
        }

        ServiceProvider existingApplication = getApplicationByResourceId(serviceProvider.getApplicationResourceId(),
                tenantDomain);
        InboundAuthenticationRequestConfig inboundOAuthConfig = getOAuthInboundAuthenticationRequestConfig(
                existingApplication);

        if (inboundOAuthConfig == null || !systemAppConsumerKeys.contains(inboundOAuthConfig.getInboundAuthKey())) {
            return true;
        }

        InboundAuthenticationRequestConfig updatedInboundOAuthConfig = getOAuthInboundAuthenticationRequestConfig(
                serviceProvider);

        if (updatedInboundOAuthConfig == null) {
            throw new IdentityApplicationManagementClientException(Error.INVALID_DELETE.getErrorCode(),
                    "Deletion of system applications are not allowed.");
        }

        return true;
    }

    @Override
    public boolean doPreDeleteApplication(String applicationName, String tenantDomain, String userName)
            throws IdentityApplicationManagementException {

        ServiceProvider application = getApplicationByName(applicationName, tenantDomain);
        InboundAuthenticationRequestConfig inboundOAuthConfig = getOAuthInboundAuthenticationRequestConfig(application);

        if (inboundOAuthConfig == null || !systemAppConsumerKeys.contains(inboundOAuthConfig.getInboundAuthKey())) {
            return true;
        }

        throw new IdentityApplicationManagementClientException(Error.INVALID_DELETE.getErrorCode(),
                "Deletion of system applications are not allowed.");
    }

    private ServiceProvider getApplicationByResourceId(String resourceId, String tenantDomain)
            throws IdentityApplicationManagementException {

        ApplicationDAO appDAO = ApplicationMgtSystemConfig.getInstance().getApplicationDAO();
        return appDAO.getApplicationByResourceId(resourceId, tenantDomain);
    }

    private ServiceProvider getApplicationByName(String applicationName, String tenantDomain)
            throws IdentityApplicationManagementException {

        ApplicationDAO appDAO = ApplicationMgtSystemConfig.getInstance().getApplicationDAO();
        return appDAO.getApplication(applicationName, tenantDomain);
    }

    private InboundAuthenticationRequestConfig getOAuthInboundAuthenticationRequestConfig(ServiceProvider application) {

        if (application == null || application.getInboundAuthenticationConfig() == null
                || application.getInboundAuthenticationConfig().getInboundAuthenticationRequestConfigs() == null
                || application.getInboundAuthenticationConfig().getInboundAuthenticationRequestConfigs().length == 0) {

            return null;
        }

        for (InboundAuthenticationRequestConfig inboundAuthenticationRequestConfig : application
                .getInboundAuthenticationConfig().getInboundAuthenticationRequestConfigs()) {
            if (FrameworkConstants.OAUTH2.equals(inboundAuthenticationRequestConfig.getInboundAuthType())) {

                return inboundAuthenticationRequestConfig;
            }
        }

        return null;
    }
}
