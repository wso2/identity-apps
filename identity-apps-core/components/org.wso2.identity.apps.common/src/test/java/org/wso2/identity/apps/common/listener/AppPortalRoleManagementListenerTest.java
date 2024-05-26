package org.wso2.identity.apps.common.listener;

import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.testng.MockitoTestNGListener;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.openMocks;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotNull;

import org.mockito.Mock;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Listeners;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.wso2.carbon.context.CarbonContext;
import org.wso2.carbon.context.PrivilegedCarbonContext;
import org.wso2.carbon.context.internal.CarbonContextDataHolder;
import org.wso2.carbon.identity.organization.management.service.util.OrganizationManagementUtil;
import org.wso2.carbon.identity.role.v2.mgt.core.RoleManagementService;
import org.wso2.carbon.identity.role.v2.mgt.core.exception.IdentityRoleManagementException;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Role;
import org.wso2.carbon.user.core.UserRealm;
import org.wso2.carbon.user.core.common.AbstractUserStoreManager;
import org.wso2.carbon.user.core.config.RealmConfiguration;
import org.wso2.carbon.utils.CarbonUtils;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;
import org.wso2.identity.apps.common.listner.AppPortalRoleManagementListener;

import java.util.Arrays;
import java.util.List;

@Listeners(MockitoTestNGListener.class)
public class AppPortalRoleManagementListenerTest {

    @Mock
    private UserRealm mockUserRealm;

    @Mock
    private AbstractUserStoreManager mockAbstractUserStoreManager;

    @Mock
    private RealmConfiguration mockRealmConfiguration;

    @Mock
    private RoleManagementService mockRoleManagementService;

    @Mock
    private Role mockRole;

    private static final String ADMINISTRATOR = "Administrator";
    private static final String APPLICATION = "application";
    private static final String CONSOLE_APP = "Console";
    private static final String carbonContext = "Console";
    private static final String adminUsername = "admin";

    @BeforeMethod
    public void setUp() throws Exception {

        openMocks(this);

        mockStatic(AppsCommonDataHolder.class);
        AppsCommonDataHolder mockAppsCommonDataHolder = mock(AppsCommonDataHolder.class);
        when(AppsCommonDataHolder.getInstance()).thenReturn(mockAppsCommonDataHolder);
        when(mockAppsCommonDataHolder.getRoleManagementServiceV2()).thenReturn(mockRoleManagementService);

        mockCarbonContextForTenant();

        when(mockUserRealm.getRealmConfiguration()).thenReturn(mockRealmConfiguration);
        when(mockUserRealm.getUserStoreManager()).thenReturn(mockAbstractUserStoreManager);

        mockStatic(OrganizationManagementUtil.class);

    }

    private void mockCarbonContextForTenant() {

        try (MockedStatic<PrivilegedCarbonContext> privilegedCarbonContext = mockStatic(PrivilegedCarbonContext.class)) {

            PrivilegedCarbonContext mockPrivilegedCarbonContext = mock(PrivilegedCarbonContext.class);
            privilegedCarbonContext.when(PrivilegedCarbonContext::getThreadLocalCarbonContext)
                .thenReturn(mockPrivilegedCarbonContext);
            when(PrivilegedCarbonContext.getThreadLocalCarbonContext().getUserRealm()).thenReturn(mockUserRealm);
        }
    }

    @DataProvider(name = "preUpdateUserListOfRoleDataProvider")
    public Object[][] preUpdateUserListOfRoleDataProvider() {
        return new Object[][]{
            // Test case where deletedUserIDList == null
            {"roleId", Arrays.asList("newUser"), null, "tenantDomain", true, false, null},

            // Test case where !isAdministratorRole(roleId, tenantDomain)
            {"roleId", Arrays.asList("newUser"), Arrays.asList("deletedUser"), "tenantDomain", false, false, null},

            // Test case where both deletedUserIDList == null and !isAdministratorRole(roleId, tenantDomain)
            {"roleId", Arrays.asList("newUser"), null, "tenantDomain", false, false, null},

            // Test case where both deletedUserIDList != null and isAdministratorRole(roleId, tenantDomain)
            {"roleId", Arrays.asList("newUser"), Arrays.asList("deletedUser"), "tenantDomain", true, false, null},

            // Test case where isOrganization == true
            {"roleId", Arrays.asList("newUser"), Arrays.asList("deletedUser"), "tenantDomain", true, true, null},

            // Test case where isOrganization == false
            {"roleId", Arrays.asList("newUser"), Arrays.asList("deletedUser"), "tenantDomain", true, false, null},

            // Test case where deletedUserIDList contains adminUserId
            {"roleId", Arrays.asList("newUser"), Arrays.asList("adminUserId"), "tenantDomain", true, false, "adminUserId"}
        };
    }

    @Test(dataProvider = "preUpdateUserListOfRoleDataProvider")
    public void testPreUpdateUserListOfRole(String roleId, List<String> newUserIDList, List<String> deletedUserIDList,
                                String tenantDomain, boolean isAdminRole, boolean isOrganization, String adminUserId)
        throws Exception {

        //Create AppPortalRoleManagementListener Instance
        AppPortalRoleManagementListener appPortalRoleManagementListener =
            new AppPortalRoleManagementListener(true);

        // Mock the behavior of isAdministratorRole
        when(mockRoleManagementService.getRole(roleId, tenantDomain)).thenReturn(mockRole);
        when(mockRole.getName()).thenReturn(ADMINISTRATOR);
        when(mockRole.getAudience()).thenReturn(APPLICATION);
        when(mockRole.getAudienceName()).thenReturn(CONSOLE_APP);

        // Mock the behavior of OrganizationManagementUtil
        when(OrganizationManagementUtil.isOrganization(tenantDomain)).thenReturn(isOrganization);

        if (adminUserId != null) {
            when(mockRealmConfiguration.getAdminUserName()).thenReturn(adminUsername);
            when(mockAbstractUserStoreManager.getUserIDFromUserName(adminUsername)).thenReturn(adminUserId);
        }

        if (adminUserId != null && deletedUserIDList != null && deletedUserIDList.contains(adminUserId)) {
            IdentityRoleManagementException thrownException = null;
            try {
                appPortalRoleManagementListener.preUpdateUserListOfRole(
                    roleId, newUserIDList, deletedUserIDList, tenantDomain);
            } catch (IdentityRoleManagementException e) {
                thrownException = e;
            }
            assertNotNull(thrownException);
            assertEquals(thrownException.getMessage(), "Deleting the tenant admin from 'Administrator' " +
                "role belongs to the 'Console' application is not allowed.");
        } else {
            appPortalRoleManagementListener.preUpdateUserListOfRole(
                roleId, newUserIDList, deletedUserIDList, tenantDomain);

            // Verify that the appPortalRoleManagementListener method is called when it should be
            if (deletedUserIDList != null && isAdminRole && !isOrganization) {
                verify(appPortalRoleManagementListener).preUpdateUserListOfRole(
                    roleId, newUserIDList, deletedUserIDList, tenantDomain);
            } else {
                verify(appPortalRoleManagementListener, never()).preUpdateUserListOfRole(
                    roleId, newUserIDList, deletedUserIDList, tenantDomain);
            }
        }
    }
}

