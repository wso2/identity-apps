/*
 * Copyright (c) 2023-2024, WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import org.apache.commons.lang.StringUtils;
import org.wso2.carbon.context.PrivilegedCarbonContext;
import org.wso2.carbon.identity.organization.management.service.exception.OrganizationManagementException;
import org.wso2.carbon.identity.organization.management.service.util.OrganizationManagementUtil;
import org.wso2.carbon.identity.role.v2.mgt.core.exception.IdentityRoleManagementException;
import org.wso2.carbon.identity.role.v2.mgt.core.listener.AbstractRoleManagementListener;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Permission;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Role;
import org.wso2.carbon.user.api.UserStoreException;
import org.wso2.carbon.user.core.UserRealm;
import org.wso2.carbon.user.core.UserStoreManager;
import org.wso2.carbon.user.core.common.AbstractUserStoreManager;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;

import java.util.List;

import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.ADMINISTRATOR;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.APPLICATION;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.Error.INVALID_REQUEST;
import static org.wso2.carbon.utils.multitenancy.MultitenantConstants.SUPER_TENANT_DOMAIN_NAME;
import static org.wso2.identity.apps.common.util.AppPortalConstants.CONSOLE_APP;

/**
 * App portal role management listener.
 */
public class AppPortalRoleManagementListener extends AbstractRoleManagementListener {

    private boolean isEnable;

    /**
     * Constructor for app portal role management listener with enable flag.
     *
     * @param isEnable Enable flag.
     */
    public AppPortalRoleManagementListener(boolean isEnable) {

        this.isEnable = isEnable;
    }

    @Override
    public int getExecutionOrderId() {

        return 50;
    }

    @Override
    public int getDefaultOrderId() {

        return 50;
    }

    @Override
    public boolean isEnable() {

        return this.isEnable;
    }

    @Override
    public void preUpdateRoleName(String roleId, String newRoleName, String tenantDomain)
        throws IdentityRoleManagementException {

        if (isAdministratorRole(roleId, tenantDomain)) {
            throw new IdentityRoleManagementException(INVALID_REQUEST.getCode(),
                "Updating name of the 'Administrator' role belongs to the 'Console' application is not allowed.");
        }
    }

    @Override
    public void preDeleteRole(String roleId, String tenantDomain) throws IdentityRoleManagementException {

        if (isAdministratorRole(roleId, tenantDomain)) {
            throw new IdentityRoleManagementException(INVALID_REQUEST.getCode(),
                "Deleting the 'Administrator' role belongs to the 'Console' application is not allowed.");
        }
    }

    @Override
    public void preUpdateUserListOfRole(String roleId, List<String> newUserIDList, List<String> deletedUserIDList,
                                        String tenantDomain) throws IdentityRoleManagementException {

        if (deletedUserIDList == null || !isAdministratorRole(roleId, tenantDomain)) {
            return;
        }

        try {
            if (OrganizationManagementUtil.isOrganization(tenantDomain)) {
                return;
            }
        } catch (OrganizationManagementException e) {
            throw new IdentityRoleManagementException("Failed to determine if the tenant is a sub-organization for " +
                "tenant domain: " + tenantDomain, e);
        }

        String adminUserId;
        try {
            UserRealm userRealm =
                (UserRealm) PrivilegedCarbonContext.getThreadLocalCarbonContext().getUserRealm();
            String adminUsername = userRealm.getRealmConfiguration().getAdminUserName();

            UserStoreManager userStoreManager = userRealm.getUserStoreManager();
            adminUserId = ((AbstractUserStoreManager) userStoreManager).getUserIDFromUserName(adminUsername);
        } catch (UserStoreException e) {
            throw new IdentityRoleManagementException("Failed to retrieve user id of the tenant admin.", e);
        }

        if (deletedUserIDList.contains(adminUserId)) {
            throw new IdentityRoleManagementException(INVALID_REQUEST.getCode(),
                "Deleting the tenant admin from 'Administrator' role belongs to the 'Console' application is " +
                    "not allowed.");
        }
    }

    @Override
    public void preUpdatePermissionsForRole(String roleId, List<Permission> addedPermissions,
                                            List<Permission> deletedPermissions, String audience, String audienceId,
                                            String tenantDomain) throws IdentityRoleManagementException {

        // Pre update permission check for the administrator role is not required when tenant creation.
        String requestInitiatedTenantDomain = PrivilegedCarbonContext.getThreadLocalCarbonContext().getTenantDomain();
        if (SUPER_TENANT_DOMAIN_NAME.equals(requestInitiatedTenantDomain) &&
                !StringUtils.equals(tenantDomain, requestInitiatedTenantDomain)) {
            return;
        }
        if (isAdministratorRole(roleId, tenantDomain)) {
            throw new IdentityRoleManagementException(INVALID_REQUEST.getCode(),
                "Updating permissions of the 'Administrator' role belongs to the 'Console' application is not " +
                    "allowed.");
        }
    }

    private boolean isAdministratorRole(String roleId, String tenantDomain) throws IdentityRoleManagementException {

        Role role = AppsCommonDataHolder.getInstance().getRoleManagementServiceV2().getRole(roleId, tenantDomain);

        return role != null && StringUtils.equalsIgnoreCase(ADMINISTRATOR, role.getName())
            && StringUtils.equalsIgnoreCase(APPLICATION, role.getAudience())
            && StringUtils.equalsIgnoreCase(CONSOLE_APP, role.getAudienceName());
    }
}
