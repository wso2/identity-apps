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

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.identity.api.resource.collection.mgt.exception.APIResourceCollectionMgtException;
import org.wso2.carbon.identity.api.resource.collection.mgt.model.APIResourceCollection;
import org.wso2.carbon.identity.api.resource.collection.mgt.model.APIResourceCollectionSearchResult;
import org.wso2.carbon.identity.api.resource.mgt.APIResourceMgtException;
import org.wso2.carbon.identity.application.common.IdentityApplicationManagementException;
import org.wso2.carbon.identity.application.common.model.ApplicationBasicInfo;
import org.wso2.carbon.identity.application.common.model.Scope;
import org.wso2.carbon.identity.application.mgt.ApplicationConstants;
import org.wso2.carbon.identity.application.mgt.ApplicationManagementService;
import org.wso2.carbon.identity.core.util.IdentityUtil;
import org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants;
import org.wso2.carbon.identity.role.v2.mgt.core.RoleManagementService;
import org.wso2.carbon.identity.role.v2.mgt.core.exception.IdentityRoleManagementClientException;
import org.wso2.carbon.identity.role.v2.mgt.core.exception.IdentityRoleManagementException;
import org.wso2.carbon.identity.role.v2.mgt.core.listener.AbstractRoleManagementListener;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Permission;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Role;
import org.wso2.carbon.identity.role.v2.mgt.core.model.RoleBasicInfo;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.wso2.carbon.identity.api.resource.collection.mgt.constant.APIResourceCollectionManagementConstants.APIResourceCollectionConfigBuilderConstants.EDIT_FEATURE_SCOPE_SUFFIX;
import static org.wso2.carbon.identity.api.resource.collection.mgt.constant.APIResourceCollectionManagementConstants.APIResourceCollectionConfigBuilderConstants.VIEW_FEATURE_SCOPE_SUFFIX;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.ADMINISTRATOR;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.CONSOLE_APP_AUDIENCE_NAME;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.CONSOLE_ORG_SCOPE_PREFIX;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.CONSOLE_SCOPE_PREFIX;

/**
 * Console role listener to populate organization console application roles permissions.
 */
public class ConsoleRoleListener extends AbstractRoleManagementListener {

    private static final Log LOG = LogFactory.getLog(ConsoleRoleListener.class);
    private static final String SYSTEM = "system";
    private static final String EVERYONE = "everyone";
    public static final String REQUIRE_FEATURE_PERMISSIONS = "SCIM2.ConsoleRoles.RequireFeaturePermissions";
    public static final String IS_CUSTOM_CONSOLE_ROLES_ENABLED = "SCIM2.ConsoleRoles.EnableCustomRoles";

    @Override
    public int getDefaultOrderId() {

        return 87;
    }

    @Override
    public boolean isEnable() {

        return isCustomConsoleRoleEnabled();
    }

    @Override
    public void preAddRole(String roleName, List<String> userList, List<String> groupList, List<Permission> permissions,
                           String audience, String audienceId, String tenantDomain)
        throws IdentityRoleManagementException {

        if (!isConsoleApp(audience, audienceId, tenantDomain) || ADMINISTRATOR.equals(roleName)) {
            return;
        }

        if (permissions == null || permissions.isEmpty()) {
            // Create the role with no permissions.
            return;
        }

        List<Permission> consoleFeaturePermissions = getConsoleFeaturePermissions(permissions);
        if (consoleFeaturePermissions != null && !consoleFeaturePermissions.isEmpty()) {
            // If console features are added to the role, then we only need to persist the console permissions.
            permissions.retainAll(consoleFeaturePermissions);
        } else if (isFeaturePermissionsRequired()) {
            LOG.debug("At least one feature permission is required to assign permissions to console role : "
                + roleName + " in tenant : " + tenantDomain + ". Hence creating role without any permissions.");
            permissions.clear();
        }
    }

    @Override
    public void postGetRole(Role role, String roleId, String tenantDomain) throws IdentityRoleManagementException {

        if (ADMINISTRATOR.equals(role.getName()) || !CONSOLE_APP_AUDIENCE_NAME.equals(role.getAudienceName())) {
            return;
        }

        if (getSystemRoles().contains(role.getName())) {
            // If the role is a system role, we resolve the permissions from the static configuration.
            List<Permission> systemRolePermissions = getSystemRolePermissions(role.getName(), tenantDomain);
            role.setPermissions(systemRolePermissions);
            return;
        }

        // Get updated console role permissions with newly added read and write scopes from API resource collection.
        List<Permission> rolePermissions = getUpgradedPermissions(role.getPermissions(), tenantDomain);
        role.setPermissions(rolePermissions);
    }

    @Override
    public void postGetPermissionListOfRole(List<Permission> permissionListOfRole, String roleId, String tenantDomain)
        throws IdentityRoleManagementException {

        RoleBasicInfo role = getRoleBasicInfo(roleId, tenantDomain);
        if (!isConsoleRole(role)) {
            return;
        }

        List<Permission> rolePermissions;
        if (getSystemRoles().contains(role.getName())) {
            // If the role is a system role, we resolve the permissions from the static configuration.
            rolePermissions = getSystemRolePermissions(role.getName(), tenantDomain);
        } else {
            rolePermissions = getUpgradedPermissions(permissionListOfRole, tenantDomain);
        }

        permissionListOfRole.clear();
        permissionListOfRole.addAll(rolePermissions);
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
            Map<String, Permission> systemPermissionsMap = getSystemPermissionsMap(tenantDomain);
            permissions.forEach(permission -> {
                Permission systemPermission = systemPermissionsMap.get(permission);
                if (systemPermission != null) {
                    resolvedRolePermissions.add(systemPermission);
                }
            });
            List<Permission> rolePermissions = getUpgradedPermissions(resolvedRolePermissions, tenantDomain);
            permissions.clear();
            permissions.addAll(rolePermissions.stream().map(Permission::getName).collect(Collectors.toList()));
        }
        // System console roles permissions needs to be populated from the static configuration.
        populateSystemConsoleRolesPermissions(permissions, roleIds, tenantDomain);
    }

    @Override
    public void preUpdatePermissionsForRole(String roleId, List<Permission> addedPermissions,
                                            List<Permission> deletedPermissions, String audience, String audienceId,
                                            String tenantDomain) throws IdentityRoleManagementException {

        RoleBasicInfo role = getRoleBasicInfo(roleId, tenantDomain);
        if (!isConsoleRole(role)) {
            return;
        }

        if (getSystemRoles().contains(role.getName())) {
            // Permissions of system roles cannot be updated.
            throw new IdentityRoleManagementClientException("Role with id: " + roleId + " name : " + role.getName() +
                " is a system role. Hence its permissions cannot be updated.");
        }

        if (addedPermissions == null || addedPermissions.isEmpty()) {
            // No permissions to be added.
            return;
        }

        List<Permission> consoleFeaturePermissions = getConsoleFeaturePermissions(addedPermissions);
        if (consoleFeaturePermissions != null && !consoleFeaturePermissions.isEmpty()) {
            // If console features are added to the role, then we only need to persist the console permissions.
            addedPermissions.retainAll(consoleFeaturePermissions);
        } else if (isFeaturePermissionsRequired()) {
            LOG.debug("At least one feature permission is required to assign permissions to console role : "
                + role.getName() + " in tenant : " + tenantDomain + ". Hence no permissions will be added.");
            addedPermissions.clear();
        }
    }

    /**
     * This method resolves the permissions for the system console roles.
     *
     * @param roleName     Role name.
     * @param tenantDomain Tenant domain.
     * @return List of resolved permissions.
     * @throws IdentityRoleManagementException If an error occurs while resolving the permissions.
     */
    private List<Permission> getSystemRolePermissions(String roleName, String tenantDomain)
        throws IdentityRoleManagementException {

        Set<String> featurePermissionsOfRole = IdentityUtil.getSystemRolesWithScopesInOriginalCase().get(roleName);
        if (featurePermissionsOfRole == null || featurePermissionsOfRole.isEmpty()) {
            return Collections.emptyList();
        }

        // Fetch console feature scopes and its mapped permissions.
        Map<String, Set<String>> consoleFeaturePermissionsMap = getConsoleFeaturePermissionsMap(tenantDomain);
        Set<String> addedPermissionNames = new HashSet<>();
        List<Permission> resolvedRolePermissions = new ArrayList<>();

        featurePermissionsOfRole.forEach(featurePermission -> {
            Set<String> scopes = consoleFeaturePermissionsMap.get(featurePermission);
            if (scopes != null) {
                addedPermissionNames.addAll(scopes);
            }
        });

        if (!addedPermissionNames.isEmpty()) {
            // Fetch all system permissions.
            Map<String, Permission> systemPermissionsMap = getSystemPermissionsMap(tenantDomain);
            addedPermissionNames.forEach(permissionName -> {
                Permission permission = systemPermissionsMap.get(permissionName);
                if (permission != null) {
                    resolvedRolePermissions.add(permission);
                }
            });
        }

        return resolvedRolePermissions;
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

        // Fetch all system permissions.
        Map<String, Permission> systemPermissionsMap = getSystemPermissionsMap(tenantDomain);
        List<Permission> consoleFeaturePermissions = getConsoleFeaturePermissions(rolePermissions);
        Set<String> addedPermissionNames = new HashSet<>();
        if (!consoleFeaturePermissions.isEmpty()) {
            // This is where we handle the new console roles (console roles created after 7.0.0) permissions.
            // We check whether the role has the view feature scope or edit feature scope. If the role has the
            // view feature scope, then we add all the read scopes. If the role has the edit feature scope, then we
            // add all the write scopes.
            // Fetch console feature scopes and its mapped permissions.
            Map<String, Set<String>> consoleFeaturePermissionsMap = getConsoleFeaturePermissionsMap(tenantDomain);
            List<Permission> resolvedRolePermissions = new ArrayList<>();
            consoleFeaturePermissions.forEach(featurePermission -> {
                Set<String> scopes = consoleFeaturePermissionsMap.get(featurePermission.getName());
                if (scopes != null) {
                    addedPermissionNames.addAll(scopes);
                }
            });
            if (!addedPermissionNames.isEmpty()) {
                addedPermissionNames.forEach(permissionName -> {
                    Permission permission = systemPermissionsMap.get(permissionName);
                    if (permission != null) {
                        resolvedRolePermissions.add(permission);
                    }
                });
            }
            return resolvedRolePermissions;
        } else {
            // This is where we handle the initial console roles (console roles created in 7.0.0) permissions.
            // Here we assume these role only contains legacy feature scope not the new feature scopes.
            // Fetch all system scopes to resolve permission details from permission name.
            List<APIResourceCollection> apiResourceCollections = getAPIResourceCollections(tenantDomain);
            Set<Permission> resolvedRolePermissions = new HashSet<>(new ArrayList<>(rolePermissions));
            List<Permission> consolePermissions = getConsolePermissions(rolePermissions);
            consolePermissions.forEach(permission -> {
                apiResourceCollections.forEach(apiResourceCollection -> {
                    // Match the permission with the collection.
                    if (apiResourceCollection.getReadScopes().contains(permission.getName())) {
                        // Add new read scopes since we have the feature scope.
                        apiResourceCollection.getReadScopes().forEach(newReadScope -> {
                            Permission newPermission = systemPermissionsMap.get(newReadScope);
                            if (newPermission != null && addedPermissionNames.add(newPermission.getName())) {
                                resolvedRolePermissions.add(newPermission);
                            }
                        });
                        List<String> legacyWriteScopes = apiResourceCollection.getLegacyWriteScopes();
                        // if all the writeScopes are in the role's permission list, then add new write scopes.
                        if (rolePermissions.stream().anyMatch(rolePermission ->
                            legacyWriteScopes.contains(rolePermission.getName()))) {
                            apiResourceCollection.getWriteScopes().forEach(newWriteScope -> {
                                Permission newPermission = systemPermissionsMap.get(newWriteScope);
                                if (newPermission != null && addedPermissionNames.add(newPermission.getName())) {
                                    resolvedRolePermissions.add(newPermission);
                                }
                            });
                        }
                    }
                });
            });
            return new ArrayList<>(resolvedRolePermissions);
        }
    }

    private void populateSystemConsoleRolesPermissions(List<String> permissions, List<String> roleIds,
                                                       String tenantDomain) throws IdentityRoleManagementException {

        Set<String> systemRoleNames = getSystemRoles();
        String consoleAppId = getConsoleAppId(tenantDomain);
        for (String systemRoleName : systemRoleNames) {
            if (ADMINISTRATOR.equalsIgnoreCase(systemRoleName) || SYSTEM.equalsIgnoreCase(systemRoleName) ||
                EVERYONE.equalsIgnoreCase(systemRoleName)) {
                continue;
            }
            try {
                String systemRoleId = AppsCommonDataHolder.getInstance().getRoleManagementServiceV2()
                    .getRoleIdByName(systemRoleName, RoleConstants.APPLICATION, consoleAppId, tenantDomain);
                if (roleIds.contains(systemRoleId)) {
                    List<Permission> systemRolePermissions = getSystemRolePermissions(systemRoleName, tenantDomain);
                    for (Permission permission : systemRolePermissions) {
                        if (!permissions.contains(permission.getName())) {
                            permissions.add(permission.getName());
                        }
                    }
                }
            } catch (IdentityRoleManagementClientException e) {
                // Role does not exist, continue.
            }
        }
    }

    private RoleBasicInfo getRoleBasicInfo(String roleId, String tenantDomain)
        throws IdentityRoleManagementException {

        RoleManagementService roleManagementService = AppsCommonDataHolder.getInstance().getRoleManagementServiceV2();
        return roleManagementService.getRoleBasicInfoById(roleId, tenantDomain);
    }

    private boolean isConsoleRole(RoleBasicInfo role) {

        return !ADMINISTRATOR.equals(role.getName()) && CONSOLE_APP_AUDIENCE_NAME.equals(role.getAudienceName());
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

        RoleManagementService roleManagementService = AppsCommonDataHolder.getInstance().getRoleManagementServiceV2();
        RoleBasicInfo role = roleManagementService.getRoleBasicInfoById(roleId, tenantDomain);
        return !ADMINISTRATOR.equals(role.getName()) && role.getAudienceName().equals(CONSOLE_APP_AUDIENCE_NAME);
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
     * Get console feature permissions map for the tenant.
     *
     * @param tenantDomain Tenant domain.
     * @return Map of console feature permissions.
     * @throws IdentityRoleManagementException If an error occurs while retrieving the console feature permissions.
     */
    private Map<String, Set<String>> getConsoleFeaturePermissionsMap(String tenantDomain)
        throws IdentityRoleManagementException {

        Map<String, Set<String>> featurePermissions = new HashMap<>();
        List<APIResourceCollection> apiResources = getAPIResourceCollections(tenantDomain);
        Map<String, APIResourceCollection> scopeToResourceMap = new HashMap<>();
        for (APIResourceCollection resource : apiResources) {
            if (resource.getViewFeatureScope() != null) {
                scopeToResourceMap.put(resource.getViewFeatureScope(), resource);
            }
            if (resource.getEditFeatureScope() != null) {
                scopeToResourceMap.put(resource.getEditFeatureScope(), resource);
            }
        }

        // Resolve permissions for each feature scope recursively.
        for (APIResourceCollection apiResource : apiResources) {
            if (apiResource.getViewFeatureScope() != null) {
                Set<String> viewPermissions = resolveScopes(apiResource.getReadScopes(),
                    apiResource.getViewFeatureScope(), scopeToResourceMap, new HashSet<>());
                featurePermissions.put(apiResource.getViewFeatureScope(), viewPermissions);
            }

            if (apiResource.getEditFeatureScope() != null) {
                Set<String> editPermissions = resolveScopes(apiResource.getWriteScopes(),
                    apiResource.getEditFeatureScope(), scopeToResourceMap, new HashSet<>());
                featurePermissions.put(apiResource.getEditFeatureScope(), editPermissions);
            }
        }

        return featurePermissions;
    }

    private Set<String> resolveScopes(List<String> scopes, String currentFeatureScope,
                                      Map<String, APIResourceCollection> scopeToResourceMap, Set<String> visited) {

        Set<String> resolvedScopes = new HashSet<>(scopes);
        if (visited.contains(currentFeatureScope)) {
            return resolvedScopes;
        }
        visited.add(currentFeatureScope);

        // Process each scope to find and resolve nested feature scopes
        for (String scope : scopes) {
            if (scope.equals(currentFeatureScope)) {
                continue;
            }

            // Check if this is a console feature scope
            if (scope.startsWith(CONSOLE_SCOPE_PREFIX) &&
                (scope.endsWith(VIEW_FEATURE_SCOPE_SUFFIX) || scope.endsWith(EDIT_FEATURE_SCOPE_SUFFIX))) {

                APIResourceCollection nestedResource = scopeToResourceMap.get(scope);
                if (nestedResource != null) {
                    // Get the appropriate scopes based on feature scope type
                    List<String> nestedScopes;
                    if (scope.equals(nestedResource.getViewFeatureScope())) {
                        nestedScopes = nestedResource.getReadScopes();
                    } else if (scope.equals(nestedResource.getEditFeatureScope())) {
                        nestedScopes = nestedResource.getWriteScopes();
                    } else {
                        nestedScopes = new ArrayList<>();
                    }

                    // Recursively resolve nested scopes
                    Set<String> deeplyResolvedScopes = resolveScopes(nestedScopes, scope, scopeToResourceMap, visited);
                    resolvedScopes.addAll(deeplyResolvedScopes);
                }
            }
        }

        return resolvedScopes;
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
     * Get system permissions map for the tenant.
     *
     * @param tenantDomain Tenant domain.
     * @return Map of system permissions.
     * @throws IdentityRoleManagementException If an error occurs while retrieving the system permissions.
     */
    private Map<String, Permission> getSystemPermissionsMap(String tenantDomain)
        throws IdentityRoleManagementException {

        Map<String, Permission> permissionsMap = new HashMap<>();
        try {
            List<Scope> systemScopes = AppsCommonDataHolder.getInstance().getAPIResourceManager()
                .getSystemAPIScopes(tenantDomain);
            for (Scope scope : systemScopes) {
                permissionsMap.put(scope.getName(), new Permission(scope.getName(), scope.getDisplayName(),
                    scope.getApiID()));
            }
            return permissionsMap;
        } catch (APIResourceMgtException e) {
            throw new IdentityRoleManagementException("Error while retrieving internal scopes for tenant " +
                "domain : " + tenantDomain, e);
        }
    }

    private String getConsoleAppId(String tenantDomain) throws IdentityRoleManagementException {

        try {
            return AppsCommonDataHolder.getInstance().getApplicationManagementService()
                .getApplicationUUIDByName(ApplicationConstants.CONSOLE_APPLICATION_NAME, tenantDomain);
        } catch (IdentityApplicationManagementException e) {
            throw new IdentityRoleManagementException("Error while retrieving console application id for " +
                "tenant domain : " + tenantDomain, e);
        }
    }

    private Set<String> getSystemRoles() {

        return AppsCommonDataHolder.getInstance().getRoleManagementServiceV2().getSystemRoles();
    }

    private boolean isCustomConsoleRoleEnabled() {

        String isCustomConsoleRoleEnabledValue = IdentityUtil.getProperty(IS_CUSTOM_CONSOLE_ROLES_ENABLED);
        if (StringUtils.isBlank(isCustomConsoleRoleEnabledValue)) {
            return true;
        }
        return Boolean.parseBoolean(isCustomConsoleRoleEnabledValue);
    }

    /**
     * Check whether at least one feature permission is required to create/update console roles.
     * This configuration is to preserve backward compatibility in console role creation in IS 7.0.
     *
     * @return True if at least one feature permission is required.
     */
    private boolean isFeaturePermissionsRequired() {

        String isFeaturePermissionsRequiredValue = IdentityUtil.getProperty(REQUIRE_FEATURE_PERMISSIONS);
        if (StringUtils.isBlank(isFeaturePermissionsRequiredValue)) {
            return false;
        }
        return Boolean.parseBoolean(isFeaturePermissionsRequiredValue);
    }
}
