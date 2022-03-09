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
import org.wso2.carbon.identity.application.common.model.ServiceProvider;
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

        if (!isEnable() || !MultitenantConstants.SUPER_TENANT_DOMAIN_NAME.equals(tenantDomain)) {
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

        if (!isEnable() || !MultitenantConstants.SUPER_TENANT_DOMAIN_NAME.equals(tenantDomain) || systemApplications
                .stream().noneMatch(applicationName::equalsIgnoreCase)) {
            return true;
        }

        throw new IdentityApplicationManagementClientException(Error.INVALID_DELETE.getErrorCode(),
                "Deletion of system applications are not allowed. Application name: " + applicationName);
    }

    private ServiceProvider getApplicationByResourceId(String resourceId, String tenantDomain)
            throws IdentityApplicationManagementException {

        return AppsCommonDataHolder.getInstance().getApplicationManagementService()
                .getApplicationByResourceId(resourceId, tenantDomain);
    }
}
