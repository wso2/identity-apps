/*
 *  Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package org.wso2.identity.apps.common.internal;

import org.wso2.carbon.identity.application.mgt.ApplicationManagementService;
import org.wso2.carbon.identity.oauth.OAuthAdminServiceImpl;
import org.wso2.carbon.identity.organization.management.service.OrganizationManagementInitialize;

import java.util.HashSet;
import java.util.Set;

/**
 * This class holds the service instances consumed by the common component.
 */
public class AppsCommonDataHolder {

    private static AppsCommonDataHolder instance = new AppsCommonDataHolder();

    private ApplicationManagementService applicationManagementService;

    private OAuthAdminServiceImpl oAuthAdminService;

    private Set<String> systemAppConsumerKeys = new HashSet<>();

    private Set<String> systemApplications = new HashSet<>();

    private boolean isOrganizationManagementEnabled;

    private AppsCommonDataHolder() {

    }

    public static AppsCommonDataHolder getInstance() {

        return instance;
    }

    public ApplicationManagementService getApplicationManagementService() {

        return applicationManagementService;
    }

    public void setApplicationManagementService(ApplicationManagementService applicationManagementService) {

        this.applicationManagementService = applicationManagementService;
    }

    public OAuthAdminServiceImpl getOAuthAdminService() {

        return oAuthAdminService;
    }

    public void setOAuthAdminService(OAuthAdminServiceImpl oAuthAdminService) {

        this.oAuthAdminService = oAuthAdminService;
    }

    public Set<String> getSystemAppConsumerKeys() {

        return systemAppConsumerKeys;
    }

    /**
     * Set system app consumer keys.
     *
     * @param systemAppConsumerKeys System app consumer keys.
     */
    public void setSystemAppConsumerKeys(Set<String> systemAppConsumerKeys) {

        if (systemAppConsumerKeys != null && !systemAppConsumerKeys.isEmpty()) {
            this.systemAppConsumerKeys.addAll(systemAppConsumerKeys);
        }
    }

    public Set<String> getSystemApplications() {

        return systemApplications;
    }

    /**
     * Set system applications.
     *
     * @param systemApplications System applications.
     */
    public void setSystemApplications(Set<String> systemApplications) {

        if (systemApplications != null && !systemApplications.isEmpty()) {
            this.systemApplications.addAll(systemApplications);
        }
    }

    /**
     * Get is organization management enabled.
     *
     * @return True if organization management is enabled.
     */
    public boolean isOrganizationManagementEnabled() {

        return isOrganizationManagementEnabled;
    }

    /**
     * Set organization management enable/disable state.
     *
     * @param organizationManagementInitializeService OrganizationManagementInitializeInstance.
     */
    public void setOrganizationManagementEnabled(
            OrganizationManagementInitialize organizationManagementInitializeService) {

        if (organizationManagementInitializeService != null) {
            isOrganizationManagementEnabled = organizationManagementInitializeService.isOrganizationManagementEnabled();
        }
    }
}
