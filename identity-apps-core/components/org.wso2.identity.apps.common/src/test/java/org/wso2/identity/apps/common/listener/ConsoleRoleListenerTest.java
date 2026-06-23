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
package org.wso2.identity.apps.common.listener;

import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.wso2.carbon.identity.api.resource.collection.mgt.APIResourceCollectionManager;
import org.wso2.carbon.identity.api.resource.collection.mgt.model.APIResourceCollection;
import org.wso2.carbon.identity.api.resource.collection.mgt.model.APIResourceCollectionSearchResult;
import org.wso2.carbon.identity.api.resource.mgt.APIResourceManager;
import org.wso2.carbon.identity.application.common.model.Scope;
import org.wso2.carbon.identity.core.util.IdentityUtil;
import org.wso2.carbon.identity.role.v2.mgt.core.RoleManagementService;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Permission;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Role;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;
import org.wso2.identity.apps.common.listner.ConsoleRoleListener;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.ADMINISTRATOR;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.CONSOLE_APP_AUDIENCE_NAME;

/**
 * Test class for {@link ConsoleRoleListener}.
 * <p>
 * Covers the public {@code postGetRole} entry point (which funnels through the private
 * {@code getUpgradedPermissions}) for both the new-roles branch and the legacy (7.0.0) branch, plus direct
 * reflection-based tests for the {@code resolveWriteFeatureScopes} / {@code addResolvedScope} consolidation helpers
 * that keep the edit (write) feature scope and the granular create/update/delete feature scopes consistent.
 */
public class ConsoleRoleListenerTest {

    private static final String TENANT_DOMAIN = "carbon.super";

    // Feature scope markers for the "users" collection.
    private static final String USERS_VIEW = "console:users_view";
    private static final String USERS_EDIT = "console:users_edit";
    private static final String USERS_CREATE = "console:users_create";
    private static final String USERS_UPDATE = "console:users_update";
    private static final String USERS_DELETE = "console:users_delete";

    // Internal API scopes resolved from the feature markers.
    private static final String INTERNAL_USER_VIEW = "internal_user_view";
    private static final String INTERNAL_USER_LIST = "internal_user_list";
    private static final String INTERNAL_USER_CREATE = "internal_user_create";
    private static final String INTERNAL_USER_UPDATE = "internal_user_update";
    private static final String INTERNAL_USER_DELETE = "internal_user_delete";

    // Write is the combination of the create, update and delete internal scopes.
    private static final List<String> INTERNAL_USER_WRITE_SCOPES = Arrays.asList(INTERNAL_USER_CREATE,
        INTERNAL_USER_UPDATE, INTERNAL_USER_DELETE);

    // Legacy (7.0.0) console scopes that don't carry the feature-scope suffixes.
    private static final String LEGACY_VIEW = "console:userMgt:view";
    private static final String LEGACY_WRITE = "console:userMgt:create";

    private ConsoleRoleListener consoleRoleListener;
    private AutoCloseable closeable;

    private MockedStatic<AppsCommonDataHolder> appsCommonDataHolder;
    private MockedStatic<IdentityUtil> identityUtil;

    @Mock
    private APIResourceManager apiResourceManager;
    @Mock
    private APIResourceCollectionManager apiResourceCollectionManager;

    @BeforeMethod
    public void setUp() {

        consoleRoleListener = new ConsoleRoleListener();
        appsCommonDataHolder = mockStatic(AppsCommonDataHolder.class);
        identityUtil = mockStatic(IdentityUtil.class);
        identityUtil.when(() -> IdentityUtil.getProperty(anyString())).thenReturn("true");
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterMethod
    public void tearDown() throws Exception {

        identityUtil.close();
        appsCommonDataHolder.close();
        closeable.close();
    }

    /**
     * Switch the granular console permission flag off for an off-mode test.
     */
    private void disableGranularConsolePermissions() {

        identityUtil.when(() -> IdentityUtil.getProperty(anyString())).thenReturn("false");
    }

    @Test
    public void testGetDefaultOrderId() {

        assertEquals(consoleRoleListener.getDefaultOrderId(), 87);
    }

    @Test
    public void testIsEnable() {

        assertTrue(consoleRoleListener.isEnable());
    }

    @Test
    public void testPostGetRoleSkipsAdministratorRole() throws Exception {

        Role role = buildRole(ADMINISTRATOR, CONSOLE_APP_AUDIENCE_NAME, Collections.singletonList(perm(USERS_VIEW)));
        consoleRoleListener.postGetRole(role, "roleId", TENANT_DOMAIN);

        // Administrator already has all permissions; the listener must not touch them.
        assertEquals(names(role.getPermissions()), new HashSet<>(Collections.singletonList(USERS_VIEW)));
    }

    @Test
    public void testPostGetRoleSkipsNonConsoleAudience() throws Exception {

        Role role = buildRole("editor", "Some Business App", Collections.singletonList(perm(USERS_VIEW)));
        consoleRoleListener.postGetRole(role, "roleId", TENANT_DOMAIN);

        assertEquals(names(role.getPermissions()), new HashSet<>(Collections.singletonList(USERS_VIEW)));
    }

    @Test
    public void testPostGetRoleNewRoleViewFeatureScopeResolvesReadScopes() throws Exception {

        mockDataHolder(allSystemScopes(), Collections.singletonList(usersCollection()));
        Role role = buildRole("viewer", CONSOLE_APP_AUDIENCE_NAME, Collections.singletonList(perm(USERS_VIEW)));

        consoleRoleListener.postGetRole(role, "roleId", TENANT_DOMAIN);

        assertEquals(names(role.getPermissions()), new HashSet<>(Arrays.asList(INTERNAL_USER_VIEW,
            INTERNAL_USER_LIST)));
    }

    @Test
    public void testPostGetRoleNewRoleEditFeatureScopeResolvesWriteScopes() throws Exception {

        mockDataHolder(allSystemScopes(), Collections.singletonList(usersCollection()));
        Role role = buildRole("editor", CONSOLE_APP_AUDIENCE_NAME, Collections.singletonList(perm(USERS_EDIT)));

        consoleRoleListener.postGetRole(role, "roleId", TENANT_DOMAIN);

        Set<String> resolved = names(role.getPermissions());
        assertTrue(resolved.containsAll(Arrays.asList(INTERNAL_USER_CREATE, INTERNAL_USER_UPDATE,
            INTERNAL_USER_DELETE)), "Edit feature scope must resolve to all write scopes.");
    }

    @Test
    public void testPostGetRoleNewRoleGranularScopesResolved() throws Exception {

        mockDataHolder(allSystemScopes(), Collections.singletonList(usersCollection()));
        Role role = buildRole("granular", CONSOLE_APP_AUDIENCE_NAME,
            Arrays.asList(perm(USERS_CREATE), perm(USERS_UPDATE), perm(USERS_DELETE)));

        consoleRoleListener.postGetRole(role, "roleId", TENANT_DOMAIN);

        Set<String> resolved = names(role.getPermissions());
        assertTrue(resolved.containsAll(Arrays.asList(INTERNAL_USER_CREATE, INTERNAL_USER_UPDATE,
            INTERNAL_USER_DELETE)), "Granular feature scopes must resolve to their internal scopes.");
    }

    @Test
    public void testPostGetRoleGranularDisabledIgnoresGranularScopes() throws Exception {

        // Granular off + a role carrying only granular create/update/delete feature scopes: the granular scopes are
        // inert. They are neither resolved to their internal scopes nor derived into the edit feature scope.
        disableGranularConsolePermissions();
        mockDataHolder(allSystemScopes(), Collections.singletonList(collectionWithEditInWriteScopes()));
        Role role = buildRole("granular", CONSOLE_APP_AUDIENCE_NAME,
            Arrays.asList(perm(USERS_CREATE), perm(USERS_UPDATE), perm(USERS_DELETE)));

        consoleRoleListener.postGetRole(role, "roleId", TENANT_DOMAIN);

        Set<String> resolved = names(role.getPermissions());
        assertFalse(resolved.contains(USERS_EDIT),
            "Granular feature scopes must not be derived into the edit feature scope when granular is off.");
        assertFalse(resolved.contains(INTERNAL_USER_CREATE) || resolved.contains(INTERNAL_USER_UPDATE)
            || resolved.contains(INTERNAL_USER_DELETE), "Granular feature scopes must not be resolved when off.");
        assertFalse(resolved.contains(USERS_CREATE) || resolved.contains(USERS_UPDATE)
            || resolved.contains(USERS_DELETE), "Granular feature scopes must not be returned when off.");
    }

    @Test
    public void testPostGetRoleGranularDisabledDoesNotDeriveGranularFromEdit() throws Exception {

        // Granular off + an edit role: the edit feature scope is returned, but it must NOT expand into the granular
        // create/update/delete feature scopes (forward derivation is skipped).
        disableGranularConsolePermissions();
        mockDataHolder(allSystemScopes(), Collections.singletonList(collectionWithEditInWriteScopes()));
        Role role = buildRole("editor", CONSOLE_APP_AUDIENCE_NAME, Collections.singletonList(perm(USERS_EDIT)));

        consoleRoleListener.postGetRole(role, "roleId", TENANT_DOMAIN);

        Set<String> resolved = names(role.getPermissions());
        assertTrue(resolved.contains(USERS_EDIT), "The edit feature scope must be returned when off.");
        assertFalse(resolved.contains(USERS_CREATE) || resolved.contains(USERS_UPDATE)
            || resolved.contains(USERS_DELETE), "Granular feature scopes must not be derived from edit when off.");
    }

    @Test
    public void testPostGetRoleLegacyRoleForwardConsolidationAddsEditFeatureScope() throws Exception {

        /* Legacy role holding read + legacy-write scopes. The collection's writeScopes carry the create/update/delete
           feature markers but NOT the edit marker, so the consolidation must add the edit (write) feature scope. */
        APIResourceCollection collection = legacyCollection(
            withInternalWriteScopes(USERS_CREATE, USERS_UPDATE, USERS_DELETE));
        mockDataHolder(allSystemScopes(), Collections.singletonList(collection));
        Role role = buildRole("legacy", CONSOLE_APP_AUDIENCE_NAME,
            Arrays.asList(perm(LEGACY_VIEW), perm(LEGACY_WRITE)));

        consoleRoleListener.postGetRole(role, "roleId", TENANT_DOMAIN);

        Set<String> resolved = names(role.getPermissions());
        assertTrue(resolved.contains(USERS_EDIT),
            "All granular write feature scopes present must add the edit feature scope.");
    }

    @Test
    public void testPostGetRoleLegacyRoleReverseConsolidationAddsGranularFeatureScopes() throws Exception {

        /* The collection's writeScopes carry the edit marker but NOT the create/update/delete markers, so the
           consolidation must add the granular create/update/delete feature scopes. */
        APIResourceCollection collection = legacyCollection(withInternalWriteScopes(USERS_EDIT));
        mockDataHolder(allSystemScopes(), Collections.singletonList(collection));
        Role role = buildRole("legacy", CONSOLE_APP_AUDIENCE_NAME,
            Arrays.asList(perm(LEGACY_VIEW), perm(LEGACY_WRITE)));

        consoleRoleListener.postGetRole(role, "roleId", TENANT_DOMAIN);

        Set<String> resolved = names(role.getPermissions());
        assertTrue(resolved.containsAll(Arrays.asList(USERS_CREATE, USERS_UPDATE, USERS_DELETE)),
            "Edit feature scope present must add the granular create/update/delete feature scopes.");
    }

    @Test
    public void testResolveWriteFeatureScopesForwardAddsEdit() throws Exception {

        List<Permission> resolved = new ArrayList<>(Arrays.asList(perm(USERS_CREATE), perm(USERS_UPDATE),
            perm(USERS_DELETE)));
        invokeResolveWriteFeatureScopes(resolved, Collections.singletonList(usersCollection()),
            permissions(allScopeNames()));

        assertTrue(names(resolved).contains(USERS_EDIT));
    }

    @Test
    public void testResolveWriteFeatureScopesReverseAddsGranular() throws Exception {

        List<Permission> resolved = new ArrayList<>(Collections.singletonList(perm(USERS_EDIT)));
        invokeResolveWriteFeatureScopes(resolved, Collections.singletonList(usersCollection()),
            permissions(allScopeNames()));

        assertTrue(names(resolved).containsAll(Arrays.asList(USERS_CREATE, USERS_UPDATE, USERS_DELETE)));
    }

    @Test
    public void testResolveWriteFeatureScopesNoChangeWhenAllPresent() throws Exception {

        List<Permission> resolved = new ArrayList<>(Arrays.asList(perm(USERS_EDIT), perm(USERS_CREATE),
            perm(USERS_UPDATE), perm(USERS_DELETE)));
        invokeResolveWriteFeatureScopes(resolved, Collections.singletonList(usersCollection()),
            permissions(allScopeNames()));

        assertEquals(resolved.size(), 4, "Nothing should be added when all feature scopes are already present.");
    }

    @Test
    public void testResolveWriteFeatureScopesNoChangeWhenGranularIncomplete() throws Exception {

        // Missing the delete feature scope, so the forward consolidation must NOT add the edit feature scope.
        List<Permission> resolved = new ArrayList<>(Arrays.asList(perm(USERS_CREATE), perm(USERS_UPDATE)));
        invokeResolveWriteFeatureScopes(resolved, Collections.singletonList(usersCollection()),
            permissions(allScopeNames()));

        assertFalse(names(resolved).contains(USERS_EDIT));
        assertEquals(resolved.size(), 2);
    }

    @Test
    public void testAddResolvedScopeResolvesAndAdds() throws Exception {

        List<Permission> resolved = new ArrayList<>();
        Set<String> resolvedNames = new HashSet<>();
        invokeAddResolvedScope(USERS_EDIT, permissions(allScopeNames()), resolved, resolvedNames);

        assertEquals(names(resolved), new HashSet<>(Collections.singletonList(USERS_EDIT)));
        assertTrue(resolvedNames.contains(USERS_EDIT));
    }

    @Test
    public void testAddResolvedScopeNullScopeIsNoOp() throws Exception {

        List<Permission> resolved = new ArrayList<>();
        Set<String> resolvedNames = new HashSet<>();
        invokeAddResolvedScope(null, permissions(allScopeNames()), resolved, resolvedNames);

        assertTrue(resolved.isEmpty());
    }

    @Test
    public void testAddResolvedScopeDuplicateIsNoOp() throws Exception {

        List<Permission> resolved = new ArrayList<>(Collections.singletonList(perm(USERS_EDIT)));
        Set<String> resolvedNames = new HashSet<>(Collections.singletonList(USERS_EDIT));
        invokeAddResolvedScope(USERS_EDIT, permissions(allScopeNames()), resolved, resolvedNames);

        assertEquals(resolved.size(), 1, "An already-resolved scope must not be added twice.");
    }

    @Test
    public void testAddResolvedScopeUnknownScopeNotAdded() throws Exception {

        List<Permission> resolved = new ArrayList<>();
        Set<String> resolvedNames = new HashSet<>();
        invokeAddResolvedScope("console:unknown_edit", permissions(allScopeNames()), resolved, resolvedNames);

        assertTrue(resolved.isEmpty(), "A scope absent from system permissions must not be added.");
    }

    private void mockDataHolder(List<Scope> systemScopes, List<APIResourceCollection> collections) throws Exception {

        AppsCommonDataHolder dataHolder = mock(AppsCommonDataHolder.class);
        appsCommonDataHolder.when(AppsCommonDataHolder::getInstance).thenReturn(dataHolder);
        when(dataHolder.getAPIResourceManager()).thenReturn(apiResourceManager);
        when(dataHolder.getApiResourceCollectionManager()).thenReturn(apiResourceCollectionManager);
        RoleManagementService roleManagementService = mock(RoleManagementService.class);
        when(dataHolder.getRoleManagementServiceV2()).thenReturn(roleManagementService);
        when(roleManagementService.getSystemRoles()).thenReturn(Collections.emptySet());
        when(apiResourceManager.getSystemAPIScopes(anyString())).thenReturn(systemScopes);
        APIResourceCollectionSearchResult searchResult = new APIResourceCollectionSearchResult(collections);
        when(apiResourceCollectionManager.getAPIResourceCollections(anyString(), anyList(), anyString()))
            .thenReturn(searchResult);
    }

    private static Role buildRole(String name, String audienceName, List<Permission> permissions) {

        Role role = new Role();
        role.setName(name);
        role.setAudienceName(audienceName);
        role.setPermissions(new ArrayList<>(permissions));
        return role;
    }

    private APIResourceCollection usersCollection() {

        APIResourceCollection collection = new APIResourceCollection();
        collection.setViewFeatureScope(USERS_VIEW);
        collection.setEditFeatureScope(USERS_EDIT);
        collection.setCreateFeatureScope(USERS_CREATE);
        collection.setUpdateFeatureScope(USERS_UPDATE);
        collection.setDeleteFeatureScope(USERS_DELETE);
        collection.setReadScopes(Arrays.asList(INTERNAL_USER_VIEW, INTERNAL_USER_LIST));
        collection.setWriteScopes(Arrays.asList(INTERNAL_USER_CREATE, INTERNAL_USER_UPDATE, INTERNAL_USER_DELETE));
        collection.setCreateScopes(Collections.singletonList(INTERNAL_USER_CREATE));
        collection.setUpdateScopes(Collections.singletonList(INTERNAL_USER_UPDATE));
        collection.setDeleteScopes(Collections.singletonList(INTERNAL_USER_DELETE));
        return collection;
    }

    /**
     * A users collection whose write scopes also carry the edit feature scope, mirroring the runtime config builder
     * which places the edit feature scope in the write scope set. Used by the off-mode tests so resolving the edit
     * feature scope yields the edit marker in the response.
     */
    private APIResourceCollection collectionWithEditInWriteScopes() {

        APIResourceCollection collection = usersCollection();
        collection.setWriteScopes(Arrays.asList(USERS_EDIT, INTERNAL_USER_CREATE, INTERNAL_USER_UPDATE,
            INTERNAL_USER_DELETE));
        return collection;
    }

    /**
     * A collection shaped like a 7.0.0 (legacy) collection: read matching is done against a legacy console scope and
     * a legacy write marker, while the supplied {@code writeScopes} drive what feature markers get resolved.
     *
     * @param writeScopes Write scopes the collection exposes (used to seed the resolved set before consolidation).
     */
    private APIResourceCollection legacyCollection(List<String> writeScopes) {

        APIResourceCollection collection = usersCollection();
        collection.setReadScopes(Arrays.asList(LEGACY_VIEW, INTERNAL_USER_VIEW));
        collection.setLegacyReadScopes(Collections.singletonList(LEGACY_VIEW));
        collection.setLegacyWriteScopes(Collections.singletonList(LEGACY_WRITE));
        collection.setWriteScopes(writeScopes);
        return collection;
    }

    private static List<String> allScopeNames() {

        return Arrays.asList(INTERNAL_USER_VIEW, INTERNAL_USER_LIST, INTERNAL_USER_CREATE, INTERNAL_USER_UPDATE,
            INTERNAL_USER_DELETE, USERS_VIEW, USERS_EDIT, USERS_CREATE, USERS_UPDATE, USERS_DELETE);
    }

    /**
     * Build a write-scope list out of the given feature markers plus the internal write scopes (create, update,
     * delete), since "write" is the combination of those three internal scopes.
     */
    private static List<String> withInternalWriteScopes(String... featureMarkers) {

        List<String> scopes = new ArrayList<>(Arrays.asList(featureMarkers));
        scopes.addAll(INTERNAL_USER_WRITE_SCOPES);
        return scopes;
    }

    private static List<Scope> allSystemScopes() {

        return allScopeNames().stream().map(name -> new Scope(name, name, name, name))
            .collect(Collectors.toList());
    }

    private static List<Permission> permissions(Collection<String> names) {

        return names.stream().map(ConsoleRoleListenerTest::perm).collect(Collectors.toList());
    }

    private static Permission perm(String name) {

        return new Permission(name, name, name);
    }

    private static Set<String> names(List<Permission> permissions) {

        return permissions.stream().map(Permission::getName).collect(Collectors.toSet());
    }

    private void invokeResolveWriteFeatureScopes(List<Permission> resolvedRolePermissions,
                                                 List<APIResourceCollection> collections,
                                                 List<Permission> systemPermissions) throws Exception {

        Method method = ConsoleRoleListener.class.getDeclaredMethod("resolveWriteFeatureScopes", List.class,
            List.class, List.class);
        method.setAccessible(true);
        method.invoke(consoleRoleListener, resolvedRolePermissions, collections, systemPermissions);
    }

    private void invokeAddResolvedScope(String scope, List<Permission> systemPermissions,
                                        List<Permission> resolvedRolePermissions, Set<String> resolvedPermissionNames)
        throws Exception {

        Method method = ConsoleRoleListener.class.getDeclaredMethod("addResolvedScope", String.class, List.class,
            List.class, Set.class);
        method.setAccessible(true);
        method.invoke(consoleRoleListener, scope, systemPermissions, resolvedRolePermissions, resolvedPermissionNames);
    }
}
