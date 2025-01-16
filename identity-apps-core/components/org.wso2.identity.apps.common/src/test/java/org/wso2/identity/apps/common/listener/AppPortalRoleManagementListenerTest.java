/*
 * Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com).
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
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.wso2.carbon.base.CarbonBaseConstants;
import org.wso2.carbon.context.PrivilegedCarbonContext;
import org.wso2.carbon.identity.organization.management.service.util.OrganizationManagementUtil;
import org.wso2.carbon.identity.role.v2.mgt.core.RoleManagementService;
import org.wso2.carbon.identity.role.v2.mgt.core.exception.IdentityRoleManagementException;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Role;
import org.wso2.carbon.user.core.UserRealm;
import org.wso2.carbon.user.core.common.AbstractUserStoreManager;
import org.wso2.carbon.user.core.config.RealmConfiguration;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;
import org.wso2.identity.apps.common.listner.AppPortalRoleManagementListener;

import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotNull;
import static org.testng.Assert.fail;
import static org.wso2.carbon.base.CarbonBaseConstants.CARBON_HOME;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.ADMINISTRATOR;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.APPLICATION;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.ORGANIZATION;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.RoleTableColumns.ROLE_NAME;
import static org.wso2.identity.apps.common.util.AppPortalConstants.CONSOLE_APP;

/**
 * Test class for AppPortalRoleManagementListener test cases.
 */
public class AppPortalRoleManagementListenerTest {

    private final String roleId = "roleId";
    private final String deletedUserId = "deletedUserId";
    private final String adminUserId = "adminUserId";
    private final String tenantDomain = "abc.com";
    private final boolean isAdminRole = true;
    private final boolean isOrganization = true;

    private AutoCloseable closeable;

    private MockedStatic<PrivilegedCarbonContext> privilegedCarbonContext;
    private MockedStatic<OrganizationManagementUtil> organizationManagementUtil;
    private MockedStatic<AppsCommonDataHolder> appsCommonDataHolder;

    @Mock
    private UserRealm mockUserRealm;

    @Mock
    private RoleManagementService roleManagementService;

    @Mock
    private Role role;

    @BeforeMethod
    public void setUp() {

        setUpCarbonHome();
        privilegedCarbonContext = mockStatic(PrivilegedCarbonContext.class);
        organizationManagementUtil = mockStatic(OrganizationManagementUtil.class);
        appsCommonDataHolder = mockStatic(AppsCommonDataHolder.class);
        mockCarbonContext(privilegedCarbonContext);
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterMethod
    public void tearDown() throws Exception {

        privilegedCarbonContext.close();
        organizationManagementUtil.close();
        appsCommonDataHolder.close();
        closeable.close();
    }

    @DataProvider(name = "preUpdateUserListOfRoleDataProvider")
    public Object[][] preUpdateUserListOfRoleDataProvider() {
        return new Object[][]{
            // Test case where deletedUserIDList == null.
            {roleId, Collections.emptyList(), null, tenantDomain, isAdminRole, !isOrganization, adminUserId},

            // Test case where !isAdministratorRole.
            {roleId, Collections.emptyList(), Collections.singletonList(deletedUserId), tenantDomain, !isAdminRole,
                !isOrganization, adminUserId},

            // Test case where isOrganization == true.
            {roleId, Collections.emptyList(), Collections.singletonList(deletedUserId), tenantDomain, isAdminRole,
                isOrganization, adminUserId},

            // Test case where deletedUserIDList contains adminUserId.
            {roleId, Collections.emptyList(), Collections.singletonList(adminUserId), tenantDomain, isAdminRole,
                !isOrganization, adminUserId}
        };
    }

    @Test(dataProvider = "preUpdateUserListOfRoleDataProvider")
    public void testPreUpdateUserListOfRole(String roleId, List<String> newUserIDList, List<String> deletedUserIDList,
                                String tenantDomain, boolean isAdminRole, boolean isOrganization, String adminUserId)
        throws Exception {

        AppPortalRoleManagementListener appPortalRoleManagementListener = spy(
            new AppPortalRoleManagementListener(true));

        // Set up the mock behaviors.
        organizationManagementUtil.when(() ->
            OrganizationManagementUtil.isOrganization(tenantDomain)).thenReturn(isOrganization);
        AbstractUserStoreManager mockUserStoreManager = mock(AbstractUserStoreManager.class);
        when(mockUserRealm.getRealmConfiguration()).thenReturn(mock(RealmConfiguration.class));
        when(mockUserRealm.getRealmConfiguration().getAdminUserName()).thenReturn(ADMINISTRATOR);
        when(mockUserRealm.getUserStoreManager()).thenReturn(mockUserStoreManager);
        when(mockUserStoreManager.getUserIDFromUserName(anyString())).thenReturn(adminUserId);
        mockAppsCommonDataHolder(appsCommonDataHolder);
        when(roleManagementService.getRole(roleId, tenantDomain)).thenReturn(role);
        setRoleAttributes(isAdminRole);

        // Call the method.
        if (!isAdminRole || deletedUserIDList == null || isOrganization || !deletedUserIDList.contains(adminUserId)) {
            appPortalRoleManagementListener.preUpdateUserListOfRole(roleId, newUserIDList, deletedUserIDList,
                tenantDomain);
        } else {
            Exception exception = null;
            try {
                appPortalRoleManagementListener.preUpdateUserListOfRole(roleId, newUserIDList, deletedUserIDList,
                    tenantDomain);
                fail("Expected IdentityRoleManagementException was not thrown");
            } catch (IdentityRoleManagementException e) {
                exception = e;
            }
            assertNotNull(exception);
            assertEquals(exception.getMessage(), "Deleting the tenant admin from 'Administrator' role " +
                "belongs to the 'Console' application is not allowed.");
        }

        if (deletedUserIDList == null || !isAdminRole) {
            organizationManagementUtil.verify(() -> OrganizationManagementUtil.isOrganization(tenantDomain), never());
        } else if (isOrganization) {
            organizationManagementUtil.verify(() -> OrganizationManagementUtil.isOrganization(tenantDomain));
        }
    }

    private void setRoleAttributes(boolean isAdminRole) {

        if (isAdminRole) {
            when(role.getName()).thenReturn(ADMINISTRATOR);
            when(role.getAudience()).thenReturn(APPLICATION);
            when(role.getAudienceName()).thenReturn(CONSOLE_APP);
        } else {
            when(role.getName()).thenReturn(ROLE_NAME);
            when(role.getAudience()).thenReturn(ORGANIZATION);
            when(role.getAudienceName()).thenReturn("org1");
        }
    }

    private static void setUpCarbonHome() {

        String carbonHome = Paths.get(System.getProperty("user.dir"), "target", "test-classes").toString();
        System.setProperty(CARBON_HOME, carbonHome);
        System.setProperty(CarbonBaseConstants.CARBON_CONFIG_DIR_PATH, Paths.get(carbonHome,
            "repository/conf").toString());
    }

    @SuppressWarnings("ResultOfMethodCallIgnored")
    private void mockAppsCommonDataHolder(MockedStatic<AppsCommonDataHolder> appsCommonDataHolder) {

        AppsCommonDataHolder mockAppsCommonDataHolder = mock(AppsCommonDataHolder.class);
        appsCommonDataHolder.when(AppsCommonDataHolder::getInstance).thenReturn(mockAppsCommonDataHolder);
        when(mockAppsCommonDataHolder.getRoleManagementServiceV2()).thenReturn(roleManagementService);
    }

    private void mockCarbonContext(MockedStatic<PrivilegedCarbonContext> privilegedCarbonContext) {

        PrivilegedCarbonContext mockPrivilegedCarbonContext = mock(PrivilegedCarbonContext.class);
        privilegedCarbonContext.when(
            PrivilegedCarbonContext::getThreadLocalCarbonContext).thenReturn(mockPrivilegedCarbonContext);
            when(PrivilegedCarbonContext.getThreadLocalCarbonContext().getUserRealm()).thenReturn(mockUserRealm);
    }
}
