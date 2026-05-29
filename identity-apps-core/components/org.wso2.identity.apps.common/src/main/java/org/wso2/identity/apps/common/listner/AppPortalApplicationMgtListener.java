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

import org.wso2.carbon.identity.application.common.IdentityApplicationManagementClientException;
import org.wso2.carbon.identity.application.common.IdentityApplicationManagementException;
import org.wso2.carbon.identity.application.common.model.InboundAuthenticationConfig;
import org.wso2.carbon.identity.application.common.model.InboundAuthenticationRequestConfig;
import org.wso2.carbon.identity.application.common.model.ServiceProvider;
import org.wso2.carbon.identity.application.common.util.IdentityApplicationManagementUtil;
import org.wso2.carbon.identity.application.mgt.listener.AbstractApplicationMgtListener;
import org.wso2.carbon.identity.core.util.IdentityTenantUtil;
import org.wso2.carbon.identity.oauth.Error;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;

import java.util.Arrays;
import java.util.Optional;
import java.util.Set;

import static org.wso2.carbon.identity.application.authentication.framework.util.FrameworkConstants.StandardInboundProtocols.OAUTH2;

/**
 * App portal application management listener.
 */
public class AppPortalApplicationMgtListener extends AbstractApplicationMgtListener {

    private boolean enable;

    private Set<String> systemApplications;

    /**
     * Constructor for app portal application management listener with enable flag.
     *
     * @param enable Enable flag.
     */
    public AppPortalApplicationMgtListener(boolean enable) {

        this.enable = enable;
        systemApplications = AppsCommonDataHolder.getInstance().getSystemApplications();
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

        if (!isEnable()) {
            return true;
        }

        Optional<String> clientId = getOAuth2ClientId(serviceProvider);
        if (clientId.isPresent() && IdentityTenantUtil.isSystemApplication(tenantDomain, clientId.get()) &&
            serviceProvider.isEnhancedOrganizationAuthenticationEnabled()) {
            throw new IdentityApplicationManagementClientException(Error.INVALID_UPDATE.getErrorCode(),
                "Enabling enhanced organization authentication is not allowed for system applications.");
        }

        if (IdentityApplicationManagementUtil.getAllowUpdateSystemApplicationThreadLocal()) {
            return true;
        }

        ServiceProvider existingApplication = getApplicationByResourceId(serviceProvider.getApplicationResourceId(),
            tenantDomain);

        if (existingApplication == null || systemApplications.stream()
            .noneMatch(existingApplication.getApplicationName()::equalsIgnoreCase)) {
            return true;
        }

        throw new IdentityApplicationManagementClientException(Error.INVALID_UPDATE.getErrorCode(),
            "Update of system applications are not allowed. Application name: " + existingApplication
                .getApplicationName());
    }

    @Override
    public boolean doPreDeleteApplication(String applicationName, String tenantDomain, String userName)
        throws IdentityApplicationManagementException {

        if (!isEnable() || systemApplications.stream().noneMatch(applicationName::equalsIgnoreCase)) {
            return true;
        }

        throw new IdentityApplicationManagementClientException(Error.INVALID_DELETE.getErrorCode(),
            "Deletion of system applications are not allowed. Application name: " + applicationName);
    }

    private Optional<String> getOAuth2ClientId(ServiceProvider serviceProvider) {

        return Optional.ofNullable(serviceProvider.getInboundAuthenticationConfig())
            .map(InboundAuthenticationConfig::getInboundAuthenticationRequestConfigs)
            .map(Arrays::stream)
            .flatMap(stream -> stream
                .filter(cfg -> OAUTH2.equals(cfg.getInboundAuthType()))
                .findFirst())
            .map(InboundAuthenticationRequestConfig::getInboundAuthKey);
    }

    private ServiceProvider getApplicationByResourceId(String resourceId, String tenantDomain)
        throws IdentityApplicationManagementException {

        return AppsCommonDataHolder.getInstance().getApplicationManagementService()
            .getApplicationByResourceId(resourceId, tenantDomain);
    }
}
