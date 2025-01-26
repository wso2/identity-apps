package org.wso2.identity.apps.common.listner;

import org.apache.commons.lang.StringUtils;
import org.wso2.carbon.identity.api.resource.collection.mgt.APIResourceCollectionManagerImpl;
import org.wso2.carbon.identity.api.resource.collection.mgt.exception.APIResourceCollectionMgtException;
import org.wso2.carbon.identity.api.resource.collection.mgt.internal.APIResourceCollectionMgtServiceDataHolder;
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
import java.util.List;
import java.util.Optional;
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

        if (isConsoleApp(audience, audienceId, tenantDomain)) {
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

        boolean isConsolePermissionsContains = isConsolePermissionsContains(permissions);
        boolean isConsoleFeaturePermissionsContains = isConsoleFeaturePermissionsContains(permissions);
        if (isConsolePermissionsContains || isConsoleFeaturePermissionsContains) {
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

        if (isConsoleApp(audience, audienceId, tenantDomain)) {
            List<Permission> consoleFeaturePermissions = getConsoleFeaturePermissions(addedPermissions);
            if (consoleFeaturePermissions != null && !consoleFeaturePermissions.isEmpty()) {
                // If console features are added to the role, then we need to we only need to persist the console
                // permissions.
                addedPermissions.retainAll(consoleFeaturePermissions);
            }
        }
    }

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
            consoleFeaturePermissions.forEach(permission -> {
                apiResourceCollections.forEach(apiResourceCollection -> {
                    // If the role has the edit feature scope, then we add all the write and read scopes.
                    if (apiResourceCollection.getEditFeatureScope() != null &&
                        apiResourceCollection.getEditFeatureScope().equals(permission.getName())) {
                        apiResourceCollection.getWriteScopes().forEach(writeScope -> {
                            Optional<Permission> newPermission = systemPermissions.stream()
                                .filter(permission1 -> permission1.getName().equals(writeScope))
                                .findFirst();
                            newPermission.ifPresent(rolePermissions::add);
                        });
                    }
                    if (apiResourceCollection.getViewFeatureScope() != null &&
                        apiResourceCollection.getViewFeatureScope().equals(permission.getName())) {
                        apiResourceCollection.getReadScopes().forEach(readScope -> {
                            Optional<Permission> newPermission = systemPermissions.stream()
                                .filter(permission1 -> permission1.getName().equals(readScope))
                                .findFirst();
                            newPermission.ifPresent(rolePermissions::add);
                        });
                    }
                });
            });
        } else {
            // This is where we handle the initial console roles (console roles created in 7.0.0) permissions.
            // Here we assume these role only contains legacy feature scope not the new feature scopes.
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
                            newPermission.ifPresent(rolePermissions::add);
                        });
                        List<String> legacyWriteScopes = apiResourceCollection.getLegacyWriteScopes();
                        // if all the writeScopes are in the role's permission list, then add new write scopes.
                        if (rolePermissions.stream().anyMatch(rolePermission ->
                            legacyWriteScopes.contains(rolePermission.getName()))) {
                            apiResourceCollection.getWriteScopes().forEach(newWriteScope -> {
                                Optional<Permission> newPermission = systemPermissions.stream()
                                    .filter(permission1 -> permission1.getName().equals(newWriteScope))
                                    .findFirst();
                                newPermission.ifPresent(rolePermissions::add);
                            });
                        }
                    }
                });
            });
        }
        return rolePermissions;
    }

    private boolean isConsoleRole(String roleId, String tenantDomain) throws IdentityRoleManagementException {

        RoleManagementService roleManagementService = AppsCommonDataHolder.getInstance()
            .getRoleManagementServiceV2();
        RoleBasicInfo role = roleManagementService.getRoleBasicInfoById(roleId, tenantDomain);
        return !RoleConstants.ADMINISTRATOR.equals(role.getName()) &&
            role.getAudienceName().equals(CONSOLE_APP_AUDIENCE_NAME);
    }

    private boolean isConsoleApp(String audience, String audienceId, String tenantDomain)
        throws IdentityRoleManagementException {

        if (!RoleConstants.APPLICATION.equals(audience)) {
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

    private List<APIResourceCollection> getAPIResourceCollections(String tenantDomain)
        throws IdentityRoleManagementException {

        try {
            List<String> requiredAttributes = new ArrayList<>();
            requiredAttributes.add("apiResources");
            APIResourceCollectionSearchResult apiResourceCollectionSearchResult = APIResourceCollectionManagerImpl
                .getInstance().getAPIResourceCollections("", requiredAttributes, tenantDomain);
            return apiResourceCollectionSearchResult.getAPIResourceCollections();

        } catch (APIResourceCollectionMgtException e) {
            throw new IdentityRoleManagementException("Error while retrieving api collection for tenant : " +
                tenantDomain, e);
        }
    }

    private List<Permission> getConsoleFeaturePermissions(List<Permission> rolePermissions) {

        return rolePermissions.stream().filter(permission -> permission != null &&
                permission.getName() != null && (permission.getName().startsWith(CONSOLE_SCOPE_PREFIX)
                || permission.getName().startsWith(CONSOLE_ORG_SCOPE_PREFIX)) &&
                (permission.getName().endsWith(VIEW_FEATURE_SCOPE_SUFFIX) ||
                    permission.getName().endsWith(EDIT_FEATURE_SCOPE_SUFFIX)))
            .collect(Collectors.toList());
    }

    private List<Permission> getConsolePermissions(List<Permission> rolePermissions) {

        return rolePermissions.stream().filter(permission -> permission != null &&
                permission.getName() != null && (permission.getName().startsWith(CONSOLE_SCOPE_PREFIX)
                || permission.getName().startsWith(CONSOLE_ORG_SCOPE_PREFIX)) &&
                !(permission.getName().endsWith(VIEW_FEATURE_SCOPE_SUFFIX) ||
                    permission.getName().endsWith(EDIT_FEATURE_SCOPE_SUFFIX)))
            .collect(Collectors.toList());
    }

    private boolean isConsoleFeaturePermissionsContains(List<String> rolePermissions) {

        return rolePermissions.stream().anyMatch(permission -> StringUtils.isNotBlank(permission) &&
            (permission.startsWith(CONSOLE_SCOPE_PREFIX) || permission.startsWith(CONSOLE_ORG_SCOPE_PREFIX)) &&
            (permission.endsWith(VIEW_FEATURE_SCOPE_SUFFIX) || permission.endsWith(EDIT_FEATURE_SCOPE_SUFFIX)));
    }

    private boolean isConsolePermissionsContains(List<String> rolePermissions) {

        return rolePermissions.stream().anyMatch(permission -> StringUtils.isNotBlank(permission) &&
            (permission.startsWith(CONSOLE_SCOPE_PREFIX) || permission.startsWith(CONSOLE_ORG_SCOPE_PREFIX)) &&
            !(permission.endsWith(VIEW_FEATURE_SCOPE_SUFFIX) || permission.endsWith(EDIT_FEATURE_SCOPE_SUFFIX)));
    }

    private List<Permission> getSystemPermission(String tenantDomain) throws IdentityRoleManagementException {
        List<Scope> systemScopes;
        try {
            systemScopes = APIResourceCollectionMgtServiceDataHolder.getInstance()
                .getAPIResourceManagementService().getSystemAPIScopes(tenantDomain);
        } catch (APIResourceMgtException e) {
            throw new IdentityRoleManagementException("Error while retrieving internal scopes for tenant " +
                "domain : " + tenantDomain, e);
        }
        return systemScopes.stream().map(scope -> new Permission(scope.getName(), scope.getDisplayName(),
            scope.getApiID())).collect(Collectors.toList());
    }
}

