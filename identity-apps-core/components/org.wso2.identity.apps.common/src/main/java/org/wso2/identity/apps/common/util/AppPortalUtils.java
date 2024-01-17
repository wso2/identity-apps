/*
 * Copyright (c) 2019-2023, WSO2 LLC. (http://www.wso2.com).
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

package org.wso2.identity.apps.common.util;

import org.apache.commons.lang.StringUtils;
import org.wso2.carbon.CarbonConstants;
import org.wso2.carbon.context.PrivilegedCarbonContext;
import org.wso2.carbon.identity.api.resource.mgt.APIResourceMgtException;
import org.wso2.carbon.identity.application.authentication.framework.util.FrameworkConstants;
import org.wso2.carbon.identity.application.common.IdentityApplicationManagementException;
import org.wso2.carbon.identity.application.common.model.AssociatedRolesConfig;
import org.wso2.carbon.identity.application.common.model.Claim;
import org.wso2.carbon.identity.application.common.model.ClaimConfig;
import org.wso2.carbon.identity.application.common.model.ClaimMapping;
import org.wso2.carbon.identity.application.common.model.InboundAuthenticationConfig;
import org.wso2.carbon.identity.application.common.model.InboundAuthenticationRequestConfig;
import org.wso2.carbon.identity.application.common.model.LocalAndOutboundAuthenticationConfig;
import org.wso2.carbon.identity.application.common.model.Scope;
import org.wso2.carbon.identity.application.common.model.ServiceProvider;
import org.wso2.carbon.identity.application.common.model.ServiceProviderProperty;
import org.wso2.carbon.identity.application.common.util.IdentityApplicationManagementUtil;
import org.wso2.carbon.identity.application.mgt.ApplicationManagementService;
import org.wso2.carbon.identity.core.util.IdentityUtil;
import org.wso2.carbon.identity.oauth.IdentityOAuthAdminException;
import org.wso2.carbon.identity.oauth.OAuthUtil;
import org.wso2.carbon.identity.oauth.dto.OAuthConsumerAppDTO;
import org.wso2.carbon.identity.oauth2.OAuth2Constants;
import org.wso2.carbon.identity.organization.management.service.constant.OrganizationManagementConstants;
import org.wso2.carbon.identity.organization.management.service.exception.OrganizationManagementException;
import org.wso2.carbon.identity.role.v2.mgt.core.exception.IdentityRoleManagementException;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Permission;
import org.wso2.carbon.identity.role.v2.mgt.core.model.RoleBasicInfo;
import org.wso2.carbon.stratos.common.beans.TenantInfoBean;
import org.wso2.carbon.user.core.UserRealm;
import org.wso2.carbon.user.core.UserStoreException;
import org.wso2.carbon.user.core.UserStoreManager;
import org.wso2.carbon.user.core.common.AbstractUserStoreManager;
import org.wso2.carbon.user.core.service.RealmService;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static org.wso2.carbon.identity.oauth.common.OAuthConstants.GrantTypes.AUTHORIZATION_CODE;
import static org.wso2.carbon.identity.oauth.common.OAuthConstants.GrantTypes.REFRESH_TOKEN;
import static org.wso2.carbon.identity.oauth.common.OAuthConstants.OAuthVersions.VERSION_2;
import static org.wso2.carbon.identity.organization.management.application.constant.OrgApplicationMgtConstants.SHARE_WITH_ALL_CHILDREN;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.ADMINISTRATOR;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.APPLICATION;
import static org.wso2.carbon.utils.multitenancy.MultitenantConstants.SUPER_TENANT_DOMAIN_NAME;
import static org.wso2.identity.apps.common.util.AppPortalConstants.AppPortal.CONSOLE;
import static org.wso2.identity.apps.common.util.AppPortalConstants.CONSOLE_APP;
import static org.wso2.identity.apps.common.util.AppPortalConstants.DISPLAY_NAME_CLAIM_URI;
import static org.wso2.identity.apps.common.util.AppPortalConstants.EMAIL_CLAIM_URI;
import static org.wso2.identity.apps.common.util.AppPortalConstants.GRANT_TYPE_ACCOUNT_SWITCH;
import static org.wso2.identity.apps.common.util.AppPortalConstants.GRANT_TYPE_ORGANIZATION_SWITCH;
import static org.wso2.identity.apps.common.util.AppPortalConstants.INBOUND_AUTH2_TYPE;
import static org.wso2.identity.apps.common.util.AppPortalConstants.INBOUND_CONFIG_TYPE;
import static org.wso2.identity.apps.common.util.AppPortalConstants.PROFILE_CLAIM_URI;
import static org.wso2.identity.apps.common.util.AppPortalConstants.USERNAME_CLAIM_URI;

/**
 * App portal utils.
 */
public class AppPortalUtils {

    private AppPortalUtils() {

    }

    /**
     * Create OAuth2 application.
     *
     * @param applicationName application name.
     * @param portalPath      portal path.
     * @param consumerKey     consumer key.
     * @param consumerSecret  consumer secret.
     * @param appOwner        application owner.
     * @param tenantId        tenant id.
     * @param tenantDomain    tenant domain.
     * @param grantTypes      grant types.
     * @throws IdentityOAuthAdminException in case of failure.
     */
    public static void createOAuth2Application(String applicationName, String portalPath, String consumerKey,
                                               String consumerSecret, String appOwner, int tenantId,
                                               String tenantDomain, String bindingType, List<String> grantTypes)
        throws IdentityOAuthAdminException {

        OAuthConsumerAppDTO oAuthConsumerAppDTO = new OAuthConsumerAppDTO();
        oAuthConsumerAppDTO.setApplicationName(applicationName);
        oAuthConsumerAppDTO.setOAuthVersion(VERSION_2);
        oAuthConsumerAppDTO.setOauthConsumerKey(consumerKey);
        oAuthConsumerAppDTO.setOauthConsumerSecret(consumerSecret);
        String callbackUrl = IdentityUtil.getServerURL(portalPath, true, true);
        if (CarbonConstants.ENABLE_LEGACY_AUTHZ_RUNTIME) {
            if (SUPER_TENANT_DOMAIN_NAME.equals(tenantDomain)) {
                if (StringUtils.equals(CONSOLE_APP, applicationName) &&
                    AppsCommonDataHolder.getInstance().isOrganizationManagementEnabled()) {
                    callbackUrl = "regexp=(" + callbackUrl
                        + "|" + callbackUrl.replace(portalPath, "/t/(.*)" + portalPath)
                        + "|" + callbackUrl.replace(portalPath, "/o/(.*)" + portalPath)
                        + ")";
                } else {
                    callbackUrl = "regexp=(" + callbackUrl
                        + "|" + callbackUrl.replace(portalPath, "/t/(.*)" + portalPath)
                        + ")";
                }
            }
        } else {
            if (SUPER_TENANT_DOMAIN_NAME.equals(tenantDomain)) {
                callbackUrl = "regexp=(" + callbackUrl
                    + "|" + callbackUrl.replace(portalPath, "/o/(.*)" + portalPath)
                    + "|" + callbackUrl.replace(portalPath, "/t/carbon.super" + portalPath)
                    + "|" + callbackUrl.replace(portalPath, "/t/carbon.super/o/(.*)" + portalPath)
                    + ")";
            } else {
                callbackUrl = "regexp=(" + callbackUrl.replace(portalPath, "/t/(.*)" + portalPath)
                    + "|" + callbackUrl.replace(portalPath, "/t/(.*)/o/(.*)" + portalPath)
                    + ")";
            }
        }
        oAuthConsumerAppDTO.setCallbackUrl(callbackUrl);
        oAuthConsumerAppDTO.setBypassClientCredentials(true);
        if (grantTypes != null && !grantTypes.isEmpty()) {
            oAuthConsumerAppDTO.setGrantTypes(String.join(" ", grantTypes));
        }
        oAuthConsumerAppDTO.setPkceMandatory(true);
        oAuthConsumerAppDTO.setTokenBindingType(bindingType);
        oAuthConsumerAppDTO.setTokenBindingValidationEnabled(true);
        oAuthConsumerAppDTO.setTokenRevocationWithIDPSessionTerminationEnabled(true);

        try {
            PrivilegedCarbonContext.startTenantFlow();
            PrivilegedCarbonContext privilegedCarbonContext = PrivilegedCarbonContext.getThreadLocalCarbonContext();
            privilegedCarbonContext.setTenantId(tenantId);
            privilegedCarbonContext.setTenantDomain(tenantDomain);
            privilegedCarbonContext.setUsername(appOwner);
            AppsCommonDataHolder.getInstance().getOAuthAdminService().registerOAuthApplicationData(oAuthConsumerAppDTO);
        } finally {
            PrivilegedCarbonContext.endTenantFlow();
        }
    }

    /**
     * Create portal SaaS application.
     *
     * @param appName        Application name.
     * @param appOwner       Application owner.
     * @param appDescription Application description.
     * @param consumerKey    Consumer key.
     * @param consumerSecret Consumer secret.
     * @throws IdentityApplicationManagementException IdentityApplicationManagementException.
     * @deprecated use {@link #createApplication(String, String, String, String, String, String, String)}} instead.
     */
    @Deprecated
    public static void createApplication(String appName, String appOwner, String appDescription, String consumerKey,
                                         String consumerSecret, String tenantDomain)
        throws IdentityApplicationManagementException {

        createApplication(appName, appOwner, appDescription,
            consumerKey, consumerSecret, tenantDomain, StringUtils.EMPTY);
    }

    /**
     * Create portal SaaS application.
     *
     * @param appName        Application name.
     * @param appOwner       Application owner.
     * @param appDescription Application description.
     * @param consumerKey    Consumer key.
     * @param consumerSecret Consumer secret.
     * @param portalPath     Portal path.
     * @throws IdentityApplicationManagementException IdentityApplicationManagementException.
     * @deprecated use {@link #createApplication(String, String, String, String, String, String, int, String)}} instead.
     */
    public static void createApplication(String appName, String appOwner, String appDescription, String consumerKey,
                                         String consumerSecret, String tenantDomain, String portalPath)
        throws IdentityApplicationManagementException {

        RealmService realmService = AppsCommonDataHolder.getInstance().getRealmService();
        int tenantId;
        try {
            tenantId = realmService.getTenantManager().getTenantId(tenantDomain);
        } catch (org.wso2.carbon.user.api.UserStoreException e) {
            throw new IdentityApplicationManagementException("Failed to retrieve tenant id for tenant domain: "
                + tenantDomain, e);
        }
        createApplication(appName, appOwner, appDescription, consumerKey, consumerSecret, tenantDomain, tenantId,
            portalPath);
    }

    /**
     * Create portal SaaS application.
     *
     * @param appName        Application name.
     * @param appOwner       Application owner.
     * @param appDescription Application description.
     * @param consumerKey    Consumer key.
     * @param consumerSecret Consumer secret.
     * @param portalPath     Portal path.
     * @throws IdentityApplicationManagementException IdentityApplicationManagementException.
     */
    public static void createApplication(String appName, String appOwner, String appDescription, String consumerKey,
                                         String consumerSecret, String tenantDomain, int tenantId, String portalPath)
        throws IdentityApplicationManagementException {

        ServiceProvider serviceProvider = new ServiceProvider();
        serviceProvider.setApplicationName(appName);
        serviceProvider.setDescription(appDescription);

        if (CarbonConstants.ENABLE_LEGACY_AUTHZ_RUNTIME) {
            enableLegacyBehaviour(serviceProvider, portalPath);
        } else {
            enableNewBehaviour(serviceProvider, portalPath, tenantDomain);
        }

        updateInboundConfiguration(consumerKey, serviceProvider);

        updateLocalAndOutboundConfiguration(serviceProvider);

        updateClaimConfigs(serviceProvider);

        // Create Application
        String appId = AppsCommonDataHolder.getInstance().getApplicationManagementService()
            .createApplication(serviceProvider, tenantDomain, appOwner);

        if (!CarbonConstants.ENABLE_LEGACY_AUTHZ_RUNTIME) {
            shareApplication(tenantDomain, tenantId, appId, appName, appOwner);
        }
    }

    /**
     * Initiate portals.
     *
     * @param tenantDomain tenant domain.
     * @param tenantId     tenant id.
     * @throws IdentityApplicationManagementException      IdentityApplicationManagementException.
     * @throws IdentityOAuthAdminException                 IdentityOAuthAdminException.
     * @throws org.wso2.carbon.user.api.UserStoreException UserStoreException.
     */
    public static void initiatePortals(String tenantDomain, int tenantId)
        throws IdentityApplicationManagementException, IdentityOAuthAdminException,
        UserStoreException {

        TenantInfoBean tenantInfoBean = new TenantInfoBean();
        tenantInfoBean.setTenantDomain(tenantDomain);
        tenantInfoBean.setTenantId(tenantId);
        UserRealm userRealm = (UserRealm) PrivilegedCarbonContext.getThreadLocalCarbonContext().getUserRealm();
        String adminUsername = userRealm.getRealmConfiguration().getAdminUserName();
        tenantInfoBean.setAdmin(adminUsername);
        initiatePortals(tenantInfoBean);
    }

    /**
     * Initiate portals.
     *
     * @param tenantInfoBean tenant info bean.
     * @throws IdentityApplicationManagementException      IdentityApplicationManagementException.
     * @throws IdentityOAuthAdminException                 IdentityOAuthAdminException.
     * @throws org.wso2.carbon.user.api.UserStoreException UserStoreException.
     */
    public static void initiatePortals(TenantInfoBean tenantInfoBean)
        throws IdentityApplicationManagementException, IdentityOAuthAdminException {

        ApplicationManagementService applicationMgtService = AppsCommonDataHolder.getInstance()
            .getApplicationManagementService();

        for (AppPortalConstants.AppPortal appPortal : AppPortalConstants.AppPortal.values()) {
            // Skip if the portal is not Console and not included as a default application.
            if (!StringUtils.equalsIgnoreCase(CONSOLE_APP, appPortal.getName()) &&
                !AppsCommonDataHolder.getInstance().getDefaultApplications().contains(appPortal.getName())) {
                continue;
            }

            if (applicationMgtService.getApplicationExcludingFileBasedSPs(appPortal.getName(),
                tenantInfoBean.getTenantDomain()) == null) {
                // Initiate portal
                String consumerSecret = OAuthUtil.getRandomNumber();
                List<String> grantTypes = Arrays.asList(AUTHORIZATION_CODE, REFRESH_TOKEN, GRANT_TYPE_ACCOUNT_SWITCH);
                if (CONSOLE_APP.equals(appPortal.getName())) {
                    grantTypes = Arrays.asList(AUTHORIZATION_CODE, REFRESH_TOKEN, GRANT_TYPE_ACCOUNT_SWITCH,
                        GRANT_TYPE_ORGANIZATION_SWITCH);
                }
                List<String> allowedGrantTypes = Arrays.asList(AppsCommonDataHolder.getInstance()
                    .getOAuthAdminService().getAllowedGrantTypes());
                grantTypes = grantTypes.stream().filter(allowedGrantTypes::contains).collect(Collectors.toList());
                String consumerKey = appPortal.getConsumerKey();
                try {
                    AppPortalUtils.createOAuth2Application(appPortal.getName(), appPortal.getPath(), consumerKey,
                        consumerSecret, tenantInfoBean.getAdmin(), tenantInfoBean.getTenantId(),
                        tenantInfoBean.getTenantDomain(),
                        OAuth2Constants.TokenBinderType.COOKIE_BASED_TOKEN_BINDER, grantTypes);
                } catch (IdentityOAuthAdminException e) {
                    if ("Error when adding the application. An application with the same name already exists."
                        .equals(e.getMessage())) {
                        // Application is already created.
                        continue;
                    }
                    throw e;
                }
                AppPortalUtils.createApplication(appPortal.getName(), tenantInfoBean.getAdmin(),
                    appPortal.getDescription(), consumerKey, consumerSecret, tenantInfoBean.getTenantDomain(),
                    tenantInfoBean.getTenantId(), appPortal.getPath());
            } else if (!CarbonConstants.ENABLE_LEGACY_AUTHZ_RUNTIME &&
                StringUtils.equalsIgnoreCase(CONSOLE_APP, appPortal.getName())) {
                try {
                    String userId = getUserId(tenantInfoBean.getAdmin(), tenantInfoBean.getTenantId());
                    List<RoleBasicInfo> assignedRoles = AppsCommonDataHolder.getInstance().getRoleManagementServiceV2()
                        .getRoleListOfUser(userId, tenantInfoBean.getTenantDomain());
                    String audienceId = AppsCommonDataHolder.getInstance().getApplicationManagementService()
                        .getApplicationResourceIDByInboundKey(CONSOLE.getConsumerKey(), INBOUND_AUTH2_TYPE,
                            tenantInfoBean.getTenantDomain());

                    for (RoleBasicInfo roleBasicInfo : assignedRoles) {
                        if (ADMINISTRATOR.equalsIgnoreCase(roleBasicInfo.getName())
                            && APPLICATION.equalsIgnoreCase(roleBasicInfo.getAudience())
                            && audienceId.equals(roleBasicInfo.getAudienceId())) {
                            return;
                        }
                    }
                    //Assign administrator role to the admin user in case of admin username got changed.
                    String roleId = getAdministratorRoleId(ADMINISTRATOR, APPLICATION, audienceId,
                        tenantInfoBean.getTenantDomain());
                    assignAdministratorRole(userId, roleId, tenantInfoBean.getTenantId(),
                        tenantInfoBean.getTenantDomain());
                } catch (org.wso2.carbon.user.api.UserStoreException | IdentityRoleManagementException e) {
                    throw new IdentityApplicationManagementException("Error occured while assigning administrator " +
                        "role to the admin user.", e);
                }
            }
        }
    }

    /**
     * Get OAuth InboundAuthenticationRequestConfig of the application.
     *
     * @param application application.
     * @return OAuth InboundAuthenticationRequestConfig if exists.
     */
    public static InboundAuthenticationRequestConfig getOAuthInboundAuthenticationRequestConfig(
        ServiceProvider application) {

        if (application == null || application.getInboundAuthenticationConfig() == null
            || application.getInboundAuthenticationConfig().getInboundAuthenticationRequestConfigs() == null
            || application.getInboundAuthenticationConfig().getInboundAuthenticationRequestConfigs().length == 0) {

            return null;
        }

        for (InboundAuthenticationRequestConfig inboundAuthenticationRequestConfig : application
            .getInboundAuthenticationConfig().getInboundAuthenticationRequestConfigs()) {
            if (FrameworkConstants.OAUTH2.equals(inboundAuthenticationRequestConfig.getInboundAuthType())) {

                return inboundAuthenticationRequestConfig;
            }
        }

        return null;
    }

    private static List<Permission> getAllPermissions(String tenantDomain)
        throws IdentityApplicationManagementException {

        try {
            List<Scope> scopes = AppsCommonDataHolder.getInstance().getAPIResourceManager()
                .getSystemAPIScopes(tenantDomain);
            return scopes.stream().map(scope -> new Permission(scope.getName())).collect(Collectors.toList());
        } catch (APIResourceMgtException e) {
            throw new IdentityApplicationManagementException("Error while retrieving internal scopes for tenant " +
                "domain : " + tenantDomain, e);
        }
    }

    private static void shareApplication(String tenantDomain, int tenantId, String appId, String appName,
                                         String appOwner)
        throws IdentityApplicationManagementException {

        RealmService realmService = AppsCommonDataHolder.getInstance().getRealmService();
        String organizationId;
        if (SUPER_TENANT_DOMAIN_NAME.equals(tenantDomain)) {
            organizationId = OrganizationManagementConstants.SUPER_ORG_ID;
        } else {
            try {
                organizationId = realmService.getTenantManager().getTenant(tenantId)
                    .getAssociatedOrganizationUUID();
            } catch (org.wso2.carbon.user.api.UserStoreException e) {
                throw new IdentityApplicationManagementException("Failed to organization id for tenant domain: "
                    + tenantDomain, e);
            }
        }
        try {
            PrivilegedCarbonContext.startTenantFlow();
            PrivilegedCarbonContext privilegedCarbonContext = PrivilegedCarbonContext.getThreadLocalCarbonContext();
            privilegedCarbonContext.setTenantId(tenantId);
            privilegedCarbonContext.setTenantDomain(tenantDomain);
            IdentityApplicationManagementUtil.setAllowUpdateSystemApplicationThreadLocal(true);
            AppsCommonDataHolder.getInstance().getOrgApplicationManager()
                .shareOrganizationApplication(organizationId, appId, true,
                    Collections.emptyList());
            if (StringUtils.equalsIgnoreCase(CONSOLE_APP, appName)) {
                addAdministratorRole(appOwner, appId, tenantId, tenantDomain);
            }
        } catch (OrganizationManagementException e) {
            throw new IdentityApplicationManagementException("Failed to share system application.", e);
        } finally {
            IdentityApplicationManagementUtil.removeAllowUpdateSystemApplicationThreadLocal();
            PrivilegedCarbonContext.endTenantFlow();
        }
    }

    private static void addAdministratorRole(String appOwner, String appId, int tenantId, String tenantDomain)
        throws IdentityApplicationManagementException {

        try {
            String userID = getUserId(appOwner, tenantId);
            AppsCommonDataHolder.getInstance().getRoleManagementServiceV2().addRole(ADMINISTRATOR,
                Collections.singletonList(userID), Collections.emptyList(), getAllPermissions(tenantDomain),
                APPLICATION, appId, tenantDomain);
        } catch (IdentityRoleManagementException e) {
            throw new IdentityApplicationManagementException("Failed to add Administrator role for the " +
                "console", e);
        } catch (org.wso2.carbon.user.api.UserStoreException e) {
            throw new RuntimeException(e);
        }
    }

    private static String getAdministratorRoleId(String roleName, String audience, String audienceId,
                                                 String tenantDomain) throws IdentityRoleManagementException {

            return AppsCommonDataHolder.getInstance().getRoleManagementServiceV2().getRoleIdByName(roleName, audience,
                audienceId, tenantDomain);
    }

    private static void assignAdministratorRole(String userId, String roleId, int tenantId, String tenantDomain)
        throws IdentityApplicationManagementException {

        try {
            AppsCommonDataHolder.getInstance().getRoleManagementServiceV2().updateUserListOfRole(roleId,
                Collections.singletonList(userId), Collections.emptyList(), tenantDomain);
        } catch (IdentityRoleManagementException e) {
            throw new IdentityApplicationManagementException("Failed to assign Administrator role of the console to :" +
                userId, e);
        }
    }

    private static String getUserId(String appOwner, int tenantId) throws org.wso2.carbon.user.api.UserStoreException {

        UserRealm userRealm =
            (UserRealm) AppsCommonDataHolder.getInstance().getRealmService().getTenantUserRealm(tenantId);
        UserStoreManager userStoreManager = userRealm.getUserStoreManager();
        return ((AbstractUserStoreManager) userStoreManager).getUserIDFromUserName(appOwner);
    }

    private static void updateClaimConfigs(ServiceProvider serviceProvider) {

        ClaimConfig claimConfig = new ClaimConfig();
        claimConfig.setClaimMappings(getRequestedClaimMappings());
        claimConfig.setLocalClaimDialect(true);
        serviceProvider.setClaimConfig(claimConfig);
    }

    private static void updateLocalAndOutboundConfiguration(ServiceProvider serviceProvider) {

        LocalAndOutboundAuthenticationConfig localAndOutboundAuthenticationConfig
            = new LocalAndOutboundAuthenticationConfig();
        localAndOutboundAuthenticationConfig.setUseUserstoreDomainInLocalSubjectIdentifier(true);
        localAndOutboundAuthenticationConfig.setUseTenantDomainInLocalSubjectIdentifier(true);
        localAndOutboundAuthenticationConfig.setSkipConsent(true);
        localAndOutboundAuthenticationConfig.setSkipLogoutConsent(true);
        serviceProvider.setLocalAndOutBoundAuthenticationConfig(localAndOutboundAuthenticationConfig);
    }

    private static void updateInboundConfiguration(String consumerKey, ServiceProvider serviceProvider) {

        InboundAuthenticationRequestConfig inboundAuthenticationRequestConfig
            = new InboundAuthenticationRequestConfig();
        inboundAuthenticationRequestConfig.setInboundAuthKey(consumerKey);
        inboundAuthenticationRequestConfig.setInboundAuthType(INBOUND_AUTH2_TYPE);
        inboundAuthenticationRequestConfig.setInboundConfigType(INBOUND_CONFIG_TYPE);
        List<InboundAuthenticationRequestConfig> inboundAuthenticationRequestConfigs = Arrays
            .asList(inboundAuthenticationRequestConfig);
        InboundAuthenticationConfig inboundAuthenticationConfig = new InboundAuthenticationConfig();
        inboundAuthenticationConfig.setInboundAuthenticationRequestConfigs(
            inboundAuthenticationRequestConfigs.toArray(new InboundAuthenticationRequestConfig[0]));
        serviceProvider.setInboundAuthenticationConfig(inboundAuthenticationConfig);
    }

    private static void enableNewBehaviour(ServiceProvider serviceProvider, String portalPath, String tenantDomain) {

        if (StringUtils.isNotEmpty(portalPath)) {
            String accessUrl = IdentityUtil.getServerURL(portalPath, true, true);
            if (!SUPER_TENANT_DOMAIN_NAME.equals(tenantDomain)) {
                accessUrl = accessUrl.replace(portalPath, "/t/" + tenantDomain.trim() + portalPath);
            }
            serviceProvider.setAccessUrl(accessUrl);
        }

        // Make system applications shareable.
        ServiceProviderProperty spProperty = new ServiceProviderProperty();
        spProperty.setName(SHARE_WITH_ALL_CHILDREN);
        spProperty.setValue("true");
        ServiceProviderProperty[] serviceProviderProperties = {spProperty};
        serviceProvider.setSpProperties(serviceProviderProperties);

        // Set role audience as 'application'
        AssociatedRolesConfig associatedRolesConfig = new AssociatedRolesConfig();
        associatedRolesConfig.setAllowedAudience(APPLICATION);
        serviceProvider.setAssociatedRolesConfig(associatedRolesConfig);
    }

    private static void enableLegacyBehaviour(ServiceProvider serviceProvider, String portalPath) {

        serviceProvider.setManagementApp(true);
        serviceProvider.setSaasApp(true);
        if (StringUtils.isNotEmpty(portalPath)) {
            serviceProvider.setAccessUrl(IdentityUtil.getServerURL(portalPath, true, true));
        }
    }

    private static ClaimMapping[] getRequestedClaimMappings() {

        Claim emailClaim = new Claim();
        emailClaim.setClaimUri(EMAIL_CLAIM_URI);
        ClaimMapping emailClaimMapping = new ClaimMapping();
        emailClaimMapping.setRequested(true);
        emailClaimMapping.setLocalClaim(emailClaim);
        emailClaimMapping.setRemoteClaim(emailClaim);

        Claim displayNameClaim = new Claim();
        displayNameClaim.setClaimUri(DISPLAY_NAME_CLAIM_URI);
        ClaimMapping displayNameClaimMapping = new ClaimMapping();
        displayNameClaimMapping.setRequested(true);
        displayNameClaimMapping.setLocalClaim(displayNameClaim);
        displayNameClaimMapping.setRemoteClaim(displayNameClaim);

        Claim usernameClaim = new Claim();
        usernameClaim.setClaimUri(USERNAME_CLAIM_URI);
        ClaimMapping usernameClaimMapping = new ClaimMapping();
        usernameClaimMapping.setRequested(true);
        usernameClaimMapping.setLocalClaim(usernameClaim);
        usernameClaimMapping.setRemoteClaim(usernameClaim);

        Claim profileUrlClaim = new Claim();
        profileUrlClaim.setClaimUri(PROFILE_CLAIM_URI);
        ClaimMapping profileUrlClaimMapping = new ClaimMapping();
        profileUrlClaimMapping.setRequested(true);
        profileUrlClaimMapping.setLocalClaim(profileUrlClaim);
        profileUrlClaimMapping.setRemoteClaim(profileUrlClaim);

        return new ClaimMapping[]{emailClaimMapping, displayNameClaimMapping, usernameClaimMapping,
            profileUrlClaimMapping};
    }
}
