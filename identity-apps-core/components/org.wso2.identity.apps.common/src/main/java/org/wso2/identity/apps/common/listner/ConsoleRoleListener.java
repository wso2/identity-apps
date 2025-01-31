/*
 * Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com).
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

import org.wso2.carbon.identity.api.resource.collection.mgt.exception.APIResourceCollectionMgtException;
import org.wso2.carbon.identity.api.resource.collection.mgt.model.APIResourceCollection;
import org.wso2.carbon.identity.api.resource.collection.mgt.model.APIResourceCollectionSearchResult;
import org.wso2.carbon.identity.api.resource.mgt.APIResourceMgtException;
import org.wso2.carbon.identity.application.common.IdentityApplicationManagementException;
import org.wso2.carbon.identity.application.common.model.ApplicationBasicInfo;
import org.wso2.carbon.identity.application.common.model.Scope;
import org.wso2.carbon.identity.application.mgt.ApplicationManagementService;
import org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants;
import org.wso2.carbon.identity.role.v2.mgt.core.RoleManagementService;
import org.wso2.carbon.identity.role.v2.mgt.core.exception.IdentityRoleManagementException;
import org.wso2.carbon.identity.role.v2.mgt.core.listener.AbstractRoleManagementListener;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Permission;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Role;
import org.wso2.carbon.identity.role.v2.mgt.core.model.RoleBasicInfo;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.wso2.carbon.identity.api.resource.collection.mgt.constant.APIResourceCollectionManagementConstants.APIResourceCollectionConfigBuilderConstants.EDIT_FEATURE_SCOPE_SUFFIX;
import static org.wso2.carbon.identity.api.resource.collection.mgt.constant.APIResourceCollectionManagementConstants.APIResourceCollectionConfigBuilderConstants.VIEW_FEATURE_SCOPE_SUFFIX;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.CONSOLE_APP_AUDIENCE_NAME;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.CONSOLE_ORG_SCOPE_PREFIX;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.CONSOLE_SCOPE_PREFIX;

/**
 * Console role listener to populate organization console application roles permissions.
 */
public class ConsoleRoleListener extends AbstractRoleManagementListener {

    @Override
    public int getDefaultOrderId() {

        return 87;
    }

    @Override
    public boolean isEnable() {

        return true;
    }

    @Override
    public void preAddRole(String roleName, List<String> userList, List<String> groupList, List<Permission> permissions,
                           String audience, String audienceId, String tenantDomain)
        throws IdentityRoleManagementException {

        if (isConsoleApp(audience, audienceId, tenantDomain) && !RoleConstants.ADMINISTRATOR.equals(roleName)) {
            List<Permission> consoleFeaturePermissions = getConsoleFeaturePermissions(permissions);
            if (consoleFeaturePermissions != null && !consoleFeaturePermissions.isEmpty()) {
                // If console features are added to the role, then we need to we only need to persist the console
                // permissions.
                permissions.retainAll(consoleFeaturePermissions);
            }
        }
    }

    @Override
    public void postGetRole(Role role, String roleId, String tenantDomain) throws IdentityRoleManagementException {


        if (!RoleConstants.ADMINISTRATOR.equals(role.getName()) &&
            role.getAudienceName().equals(CONSOLE_APP_AUDIENCE_NAME)) {
            // Get updated console role permissions with newly added read and write scopes from API resource collection.
            List<Permission> rolePermissions = getUpgradedPermissions(role.getPermissions(), tenantDomain);
            role.setPermissions(rolePermissions);
        }
    }

    @Override
    public void postGetPermissionListOfRole(List<Permission> permissionListOfRole, String roleId, String tenantDomain)
        throws IdentityRoleManagementException {

        if (isConsoleRole(roleId, tenantDomain)) {
            List<Permission> rolePermissions = getUpgradedPermissions(permissionListOfRole, tenantDomain);
            permissionListOfRole.clear();
            permissionListOfRole.addAll(rolePermissions);
        }
    }

    @Override
    public void postGetPermissionListOfRoles(List<String> permissions, List<String> roleIds, String tenantDomain)
        throws IdentityRoleManagementException {

        boolean isConsoleRole = false;
        for (String roleId : roleIds) {
            if (isConsoleRole(roleId, tenantDomain)) {
                isConsoleRole = true;
                break;
            }
        }
        if (isConsoleRole) {
            List<Permission> resolvedRolePermissions = new ArrayList<>();
            List<Permission> systemPermissions = getSystemPermission(tenantDomain);
            permissions.forEach(permission -> {
                Optional<Permission> newPermission = systemPermissions.stream()
                    .filter(permission1 -> permission1.getName().equals(permission))
                    .findFirst();
                newPermission.ifPresent(resolvedRolePermissions::add);
            });
            List<Permission> rolePermissions = getUpgradedPermissions(resolvedRolePermissions, tenantDomain);
            permissions.clear();
            permissions.addAll(rolePermissions.stream().map(Permission::getName).collect(Collectors.toList()));
        }
    }

    @Override
    public void preUpdatePermissionsForRole(String roleId, List<Permission> addedPermissions,
                                            List<Permission> deletedPermissions, String audience, String audienceId,
                                            String tenantDomain) throws IdentityRoleManagementException {

        if (isConsoleRole(roleId, tenantDomain)) {
            List<Permission> consoleFeaturePermissions = getConsoleFeaturePermissions(addedPermissions);
            if (consoleFeaturePermissions != null && !consoleFeaturePermissions.isEmpty()) {
                // If console features are added to the role, then we need to we only need to persist the console
                // permissions.
                addedPermissions.retainAll(consoleFeaturePermissions);
            }
        }
    }

    /**
     * This method resolves the new permissions for the console roles. In this method, we resolve two type of console
     * roles. 1. Console roles created after 7.0.0. 2. Console roles created in 7.0.0.
     *
     * @param rolePermissions List of permissions of the role.
     * @param tenantDomain    Tenant domain.
     * @return List of resolved permissions.
     * @throws IdentityRoleManagementException If an error occurs while resolving the permissions.
     */
    private List<Permission> getUpgradedPermissions(List<Permission> rolePermissions, String tenantDomain)
        throws IdentityRoleManagementException {

        // Fetch all system scopes to resolve permission details from permission name.
        List<Permission> systemPermissions = getSystemPermission(tenantDomain);
        List<APIResourceCollection> apiResourceCollections = getAPIResourceCollections(tenantDomain);
        List<Permission> consoleFeaturePermissions = getConsoleFeaturePermissions(rolePermissions);
        if (!consoleFeaturePermissions.isEmpty()) {
            // This is where we handle the new console roles (console roles created after 7.0.0) permissions.
            // We check whether the role has the view feature scope or edit feature scope. If the role has the
            // view feature scope, then we add all the read scopes. If the role has the edit feature scope, then we
            // add all the write scopes.
            List<Permission> resolvedRolePermissions = new ArrayList<>();
            consoleFeaturePermissions.forEach(permission -> {
                apiResourceCollections.forEach(apiResourceCollection -> {
                    // If the role has the edit feature scope, then we add all the write and read scopes.
                    if (apiResourceCollection.getEditFeatureScope() != null &&
                        apiResourceCollection.getEditFeatureScope().equals(permission.getName())) {
                        apiResourceCollection.getWriteScopes().forEach(writeScope -> {
                            Optional<Permission> newPermission = systemPermissions.stream()
                                .filter(permission1 -> permission1.getName().equals(writeScope))
                                .findFirst();
                            newPermission.ifPresent(resolvedRolePermissions::add);
                        });
                    }
                    if (apiResourceCollection.getViewFeatureScope() != null &&
                        apiResourceCollection.getViewFeatureScope().equals(permission.getName())) {
                        apiResourceCollection.getReadScopes().forEach(readScope -> {
                            Optional<Permission> newPermission = systemPermissions.stream()
                                .filter(permission1 -> permission1.getName().equals(readScope))
                                .findFirst();
                            newPermission.ifPresent(resolvedRolePermissions::add);
                        });
                    }
                });
            });
            return resolvedRolePermissions;
        } else {
            // This is where we handle the initial console roles (console roles created in 7.0.0) permissions.
            // Here we assume these role only contains legacy feature scope not the new feature scopes.
            Set<Permission> resolvedRolePermissions = new HashSet<>(new ArrayList<>(rolePermissions));
            List<Permission> consolePermissions = getConsolePermissions(rolePermissions);
            consolePermissions.forEach(permission -> {
                apiResourceCollections.forEach(apiResourceCollection -> {
                    // Match the permission with the collection.
                    if (apiResourceCollection.getReadScopes().contains(permission.getName())) {
                        // Add new read scopes since we have the feature scope.
                        apiResourceCollection.getReadScopes().forEach(newReadScope -> {
                            Optional<Permission> newPermission = systemPermissions.stream()
                                .filter(permission1 -> permission1.getName().equals(newReadScope))
                                .findFirst();
                            newPermission.ifPresent(resolvedRolePermissions::add);
                        });
                        List<String> legacyWriteScopes = apiResourceCollection.getLegacyWriteScopes();
                        // if all the writeScopes are in the role's permission list, then add new write scopes.
                        if (rolePermissions.stream().anyMatch(rolePermission ->
                            legacyWriteScopes.contains(rolePermission.getName()))) {
                            apiResourceCollection.getWriteScopes().forEach(newWriteScope -> {
                                Optional<Permission> newPermission = systemPermissions.stream()
                                    .filter(permission1 -> permission1.getName().equals(newWriteScope))
                                    .findFirst();
                                newPermission.ifPresent(resolvedRolePermissions::add);
                            });
                        }
                    }
                });
            });
            return new ArrayList<>(resolvedRolePermissions);
        }
    }

    /**
     * Check whether the role is a console role. We consider all the console roles except the administrator role.
     *
     * @param roleId       Role id.
     * @param tenantDomain Tenant domain.
     * @return True if the role is a console role.
     * @throws IdentityRoleManagementException If an error occurs while checking the role.
     */
    private boolean isConsoleRole(String roleId, String tenantDomain) throws IdentityRoleManagementException {

        RoleManagementService roleManagementService = AppsCommonDataHolder.getInstance()
            .getRoleManagementServiceV2();
        RoleBasicInfo role = roleManagementService.getRoleBasicInfoById(roleId, tenantDomain);
        return !RoleConstants.ADMINISTRATOR.equals(role.getName()) &&
            role.getAudienceName().equals(CONSOLE_APP_AUDIENCE_NAME);
    }

    /**
     * Check whether the app is a console application based in audience.
     *
     * @param audience     Audience.
     * @param audienceId   Audience id.
     * @param tenantDomain Tenant domain.
     * @return True if the app is a console application.
     * @throws IdentityRoleManagementException If an error occurs while checking the app.
     */
    private boolean isConsoleApp(String audience, String audienceId, String tenantDomain)
        throws IdentityRoleManagementException {

        if (!RoleConstants.APPLICATION.equalsIgnoreCase(audience)) {
            return false;
        }
        ApplicationManagementService applicationManagementService = AppsCommonDataHolder.getInstance()
            .getApplicationManagementService();
        try {
            ApplicationBasicInfo applicationBasicInfo = applicationManagementService
                .getApplicationBasicInfoByResourceId(audienceId, tenantDomain);
            return applicationBasicInfo != null && CONSOLE_APP_AUDIENCE_NAME
                .equals(applicationBasicInfo.getApplicationName());
        } catch (IdentityApplicationManagementException e) {
            throw new IdentityRoleManagementException("Error while retrieving application basic info for application " +
                "id : " + audienceId, e);
        }
    }

    /**
     * Get API resource collections for the tenant. This will return all the tenant and organization specific API
     * collections.
     *
     * @param tenantDomain Tenant domain.
     * @return List of API resource collections.
     * @throws IdentityRoleManagementException If an error occurs while retrieving the API resource collections.
     */
    private List<APIResourceCollection> getAPIResourceCollections(String tenantDomain)
        throws IdentityRoleManagementException {

        try {
            List<String> requiredAttributes = new ArrayList<>();
            requiredAttributes.add("apiResources");
            APIResourceCollectionSearchResult apiResourceCollectionSearchResult = AppsCommonDataHolder
                .getInstance().getApiResourceCollectionManager()
                .getAPIResourceCollections("", requiredAttributes, tenantDomain);
            return apiResourceCollectionSearchResult.getAPIResourceCollections();

        } catch (APIResourceCollectionMgtException e) {
            throw new IdentityRoleManagementException("Error while retrieving api collection for tenant : " +
                tenantDomain, e);
        }
    }

    /**
     * Get console feature permissions from the role permissions.
     *
     * @param rolePermissions Role permissions.
     * @return List of console feature permissions.
     */
    private List<Permission> getConsoleFeaturePermissions(List<Permission> rolePermissions) {

        return rolePermissions.stream().filter(permission -> permission != null &&
                permission.getName() != null && (permission.getName().startsWith(CONSOLE_SCOPE_PREFIX)
                || permission.getName().startsWith(CONSOLE_ORG_SCOPE_PREFIX)) &&
                (permission.getName().endsWith(VIEW_FEATURE_SCOPE_SUFFIX) ||
                    permission.getName().endsWith(EDIT_FEATURE_SCOPE_SUFFIX)))
            .collect(Collectors.toList());
    }

    /**
     * Get console permissions (old ones) from the role permissions.
     *
     * @param rolePermissions Role permissions.
     * @return List of console permissions.
     */
    private List<Permission> getConsolePermissions(List<Permission> rolePermissions) {

        return rolePermissions.stream().filter(permission -> permission != null &&
                permission.getName() != null && (permission.getName().startsWith(CONSOLE_SCOPE_PREFIX)
                || permission.getName().startsWith(CONSOLE_ORG_SCOPE_PREFIX)) &&
                !(permission.getName().endsWith(VIEW_FEATURE_SCOPE_SUFFIX) ||
                    permission.getName().endsWith(EDIT_FEATURE_SCOPE_SUFFIX)))
            .collect(Collectors.toList());
    }

    /**
     * Get system permissions for the tenant.
     *
     * @param tenantDomain Tenant domain.
     * @return List of system permissions.
     * @throws IdentityRoleManagementException If an error occurs while retrieving the system permissions.
     */
    private List<Permission> getSystemPermission(String tenantDomain) throws IdentityRoleManagementException {
        List<Scope> systemScopes;

        try {
            systemScopes = AppsCommonDataHolder.getInstance()
                .getAPIResourceManager().getSystemAPIScopes(tenantDomain);
        } catch (APIResourceMgtException e) {
            throw new IdentityRoleManagementException("Error while retrieving internal scopes for tenant " +
                "domain : " + tenantDomain, e);
        }
        return systemScopes.stream().map(scope -> new Permission(scope.getName(), scope.getDisplayName(),
            scope.getApiID())).collect(Collectors.toList());
    }
}

