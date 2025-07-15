/*
 * Copyright (c) 2019-2024, WSO2 LLC. (http://www.wso2.com).
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
import org.wso2.carbon.identity.api.resource.mgt.APIResourceManager;
import org.wso2.carbon.identity.api.resource.mgt.APIResourceMgtException;
import org.wso2.carbon.identity.api.resource.mgt.constant.APIResourceManagementConstants;
import org.wso2.carbon.identity.application.authentication.framework.util.FrameworkConstants;
import org.wso2.carbon.identity.application.common.IdentityApplicationManagementException;
import org.wso2.carbon.identity.application.common.model.APIResource;
import org.wso2.carbon.identity.application.common.model.AssociatedRolesConfig;
import org.wso2.carbon.identity.application.common.model.AuthorizedAPI;
import org.wso2.carbon.identity.application.common.model.Claim;
import org.wso2.carbon.identity.application.common.model.ClaimConfig;
import org.wso2.carbon.identity.application.common.model.ClaimMapping;
import org.wso2.carbon.identity.application.common.model.InboundAuthenticationConfig;
import org.wso2.carbon.identity.application.common.model.InboundAuthenticationRequestConfig;
import org.wso2.carbon.identity.application.common.model.LocalAndOutboundAuthenticationConfig;
import org.wso2.carbon.identity.application.common.model.ServiceProvider;
import org.wso2.carbon.identity.application.common.model.ServiceProviderProperty;
import org.wso2.carbon.identity.application.common.util.IdentityApplicationManagementUtil;
import org.wso2.carbon.identity.application.mgt.ApplicationConstants;
import org.wso2.carbon.identity.application.mgt.ApplicationManagementService;
import org.wso2.carbon.identity.application.mgt.ApplicationMgtUtil;
import org.wso2.carbon.identity.application.mgt.AuthorizedAPIManagementService;
import org.wso2.carbon.identity.application.mgt.AuthorizedAPIManagementServiceImpl;
import org.wso2.carbon.identity.core.URLBuilderException;
import org.wso2.carbon.identity.core.util.IdentityTenantUtil;
import org.wso2.carbon.identity.core.util.IdentityUtil;
import org.wso2.carbon.identity.oauth.IdentityOAuthAdminException;
import org.wso2.carbon.identity.oauth.OAuthUtil;
import org.wso2.carbon.identity.oauth.common.OAuthConstants;
import org.wso2.carbon.identity.oauth.dto.OAuthConsumerAppDTO;
import org.wso2.carbon.identity.oauth2.OAuth2Constants;
import org.wso2.carbon.identity.organization.management.service.constant.OrganizationManagementConstants;
import org.wso2.carbon.identity.organization.management.service.exception.OrganizationManagementException;
import org.wso2.carbon.identity.role.mgt.core.RoleConstants;
import org.wso2.carbon.identity.role.v2.mgt.core.RoleManagementService;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static org.wso2.carbon.identity.application.common.util.IdentityApplicationConstants.IS_SYSTEM_RESERVED_APP_FLAG;
import static org.wso2.carbon.identity.oauth.common.OAuthConstants.GrantTypes.AUTHORIZATION_CODE;
import static org.wso2.carbon.identity.oauth.common.OAuthConstants.GrantTypes.REFRESH_TOKEN;
import static org.wso2.carbon.identity.oauth.common.OAuthConstants.OAuthVersions.VERSION_2;
import static org.wso2.carbon.identity.organization.management.application.constant.OrgApplicationMgtConstants.SHARE_WITH_ALL_CHILDREN;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.ADMINISTRATOR;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.APPLICATION;
import static org.wso2.carbon.utils.multitenancy.MultitenantConstants.SUPER_TENANT_DOMAIN_NAME;
import static org.wso2.identity.apps.common.util.AppPortalConstants.AppPortal.CONSOLE;
import static org.wso2.identity.apps.common.util.AppPortalConstants.CONSOLE_APP;
import static org.wso2.identity.apps.common.util.AppPortalConstants.CONSOLE_PORTAL_PATH;
import static org.wso2.identity.apps.common.util.AppPortalConstants.DISPLAY_NAME_CLAIM_URI;
import static org.wso2.identity.apps.common.util.AppPortalConstants.EMAIL_CLAIM_URI;
import static org.wso2.identity.apps.common.util.AppPortalConstants.GRANT_TYPE_ACCOUNT_SWITCH;
import static org.wso2.identity.apps.common.util.AppPortalConstants.GRANT_TYPE_ORGANIZATION_SWITCH;
import static org.wso2.identity.apps.common.util.AppPortalConstants.GRANT_TYPE_TOKEN_EXCHANGE;
import static org.wso2.identity.apps.common.util.AppPortalConstants.IMPERSONATE_ORG_SCOPE_NAME;
import static org.wso2.identity.apps.common.util.AppPortalConstants.IMPERSONATE_ROLE_NAME;
import static org.wso2.identity.apps.common.util.AppPortalConstants.IMPERSONATE_SCOPE_NAME;
import static org.wso2.identity.apps.common.util.AppPortalConstants.IMPERSONATION_API_RESOURCE;
import static org.wso2.identity.apps.common.util.AppPortalConstants.IMPERSONATION_ORG_API_RESOURCE;
import static org.wso2.identity.apps.common.util.AppPortalConstants.INBOUND_AUTH2_TYPE;
import static org.wso2.identity.apps.common.util.AppPortalConstants.INBOUND_CONFIG_TYPE;
import static org.wso2.identity.apps.common.util.AppPortalConstants.MYACCOUNT_APP;
import static org.wso2.identity.apps.common.util.AppPortalConstants.MYACCOUNT_PORTAL_PATH;
import static org.wso2.identity.apps.common.util.AppPortalConstants.PROFILE_CLAIM_URI;
import static org.wso2.identity.apps.common.util.AppPortalConstants.USERNAME_CLAIM_URI;
import static org.wso2.identity.apps.common.util.AppPortalConstants.USER_SESSION_IMPERSONATION;

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
        if (CONSOLE_APP.equals(applicationName) &&
            StringUtils.isNotEmpty(IdentityUtil.getProperty(CONSOLE_PORTAL_PATH))) {
            portalPath = IdentityUtil.getProperty(CONSOLE_PORTAL_PATH);
        }
        String consolePortalPathForMyAccount = portalPath;
        if (MYACCOUNT_APP.equals(applicationName) &&
            StringUtils.isNotEmpty(IdentityUtil.getProperty(MYACCOUNT_PORTAL_PATH))) {
            portalPath = IdentityUtil.getProperty(MYACCOUNT_PORTAL_PATH);
            consolePortalPathForMyAccount = IdentityUtil.getProperty(CONSOLE_PORTAL_PATH);
        }
        if (!portalPath.startsWith("/")) {
            portalPath = "/" + portalPath;
            consolePortalPathForMyAccount = "/" + consolePortalPathForMyAccount;
        }
        if (consolePortalPathForMyAccount.contains("(\\?fidp=PlatformIDP)?$")) {
            // This is needed to create impersonation callback URL regex.
            // Do not use this to create console callback URL.
            consolePortalPathForMyAccount = consolePortalPathForMyAccount.replace("(\\?fidp=PlatformIDP)?$", "");
        }
        String callbackUrl = IdentityUtil.getServerURL(portalPath, true, true);
        String consoleCallbackUrlForMyAccount = IdentityUtil.getServerURL(consolePortalPathForMyAccount,
            true, true);
        String appendedConsoleCallBackURLRegex = StringUtils.EMPTY;
        boolean isUserSessionImpersonationEnabled = Boolean.parseBoolean(IdentityUtil
            .getProperty(USER_SESSION_IMPERSONATION));
        try {
            // Update the callback URL properly if origin is configured for the portal app.
            callbackUrl = ApplicationMgtUtil.replaceUrlOriginWithPlaceholders(callbackUrl);
            callbackUrl = ApplicationMgtUtil.resolveOriginUrlFromPlaceholders(callbackUrl, applicationName);

            // Add console url when impersonation is enabled.
            if (isUserSessionImpersonationEnabled && MYACCOUNT_APP.equals(applicationName)) {
                consoleCallbackUrlForMyAccount = ApplicationMgtUtil.replaceUrlOriginWithPlaceholders(
                    consoleCallbackUrlForMyAccount);
                consoleCallbackUrlForMyAccount = ApplicationMgtUtil.resolveOriginUrlFromPlaceholders(
                    consoleCallbackUrlForMyAccount, CONSOLE_APP);
                appendedConsoleCallBackURLRegex = "|" + consoleCallbackUrlForMyAccount.replace(
                    consolePortalPathForMyAccount,
                    consolePortalPathForMyAccount + "/resources/users/init-impersonate.html");
            }
        } catch (URLBuilderException e) {
            throw new IdentityOAuthAdminException("Server encountered an error while building callback URL with " +
                "placeholders for the server URL", e);
        }
        if (SUPER_TENANT_DOMAIN_NAME.equals(tenantDomain)) {
            callbackUrl = "regexp=(" + callbackUrl
                + "|" + callbackUrl.replace(portalPath, "/t/carbon.super" + portalPath)
                + "|" + callbackUrl.replace(portalPath, "/t/carbon.super/o/(.*)" + portalPath)
                + appendedConsoleCallBackURLRegex
                + ")";
        } else {
            callbackUrl = "regexp=(" + callbackUrl.replace(portalPath, "/t/(.*)" + portalPath)
                + "|" + callbackUrl.replace(portalPath, "/t/(.*)/o/(.*)" + portalPath)
                + appendedConsoleCallBackURLRegex
                + ")";
        }
        oAuthConsumerAppDTO.setCallbackUrl(callbackUrl);
        // Enable subject token response type for my account.
        if (isUserSessionImpersonationEnabled && MYACCOUNT_APP.equals(applicationName)) {
            oAuthConsumerAppDTO.setSubjectTokenEnabled(true);
            oAuthConsumerAppDTO.setSubjectTokenExpiryTime(
                OAuthConstants.OIDCConfigProperties.SUBJECT_TOKEN_EXPIRY_TIME_VALUE);
        }
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

        if (!CarbonConstants.ENABLE_LEGACY_AUTHZ_RUNTIME && CONSOLE_APP.equals(appName)) {
            shareApplication(tenantDomain, tenantId, appId, appName, appOwner);
        }
        if (Boolean.parseBoolean(IdentityUtil.getProperty(USER_SESSION_IMPERSONATION)) &&
                MYACCOUNT_APP.equals(appName)) {
            addAPIResourceToApplication(appId, tenantDomain, IMPERSONATION_API_RESOURCE,
                APIResourceManagementConstants.APIResourceTypes.TENANT);
            addAPIResourceToApplication(appId, tenantDomain, IMPERSONATION_ORG_API_RESOURCE,
                APIResourceManagementConstants.APIResourceTypes.ORGANIZATION);
            addImpersonatorRole(appOwner, appId, tenantId, tenantDomain);
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
                // Enable token-exchange grant type for my account.
                boolean isUserSessionImpersonationEnabled = Boolean.parseBoolean(IdentityUtil
                        .getProperty(USER_SESSION_IMPERSONATION));
                if (isUserSessionImpersonationEnabled && MYACCOUNT_APP.equals(appPortal.getName())) {
                    grantTypes = Arrays.asList(AUTHORIZATION_CODE, REFRESH_TOKEN, GRANT_TYPE_ACCOUNT_SWITCH,
                    GRANT_TYPE_TOKEN_EXCHANGE);
                }
                List<String> allowedGrantTypes = Arrays.asList(AppsCommonDataHolder.getInstance()
                    .getOAuthAdminService().getAllowedGrantTypes());
                grantTypes = grantTypes.stream().filter(allowedGrantTypes::contains).collect(Collectors.toList());
                String consumerKey = resolveClientID(appPortal.getConsumerKey(), tenantInfoBean.getTenantDomain());
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
            privilegedCarbonContext.setUsername(appOwner);
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

    /**
     * Resolve tenant qualified client ID.
     *
     * @param consumerKey consumer key.
     * @param tenantDomain tenant domain.
     * @return client ID.
     */
    public static String resolveClientID(String consumerKey, String tenantDomain) {

        if (IdentityTenantUtil.isTenantQualifiedUrlsEnabled() || SUPER_TENANT_DOMAIN_NAME.equals(tenantDomain)) {
            return consumerKey;
        } else {
            return consumerKey + "_" + tenantDomain;
        }
    }

    private static void addImpersonatorRole(String appOwner, String appId, int tenantId, String tenantDomain)
        throws IdentityApplicationManagementException {

        List<Permission> permissions = new ArrayList<>();
        permissions.add(new Permission(IMPERSONATE_SCOPE_NAME));
        permissions.add(new Permission(IMPERSONATE_ORG_SCOPE_NAME));

        RoleManagementService roleManagementService = AppsCommonDataHolder.getInstance().getRoleManagementServiceV2();
        try {
            roleManagementService.addRole(IMPERSONATE_ROLE_NAME, Collections.emptyList(), Collections.emptyList(),
                permissions, APPLICATION, appId, tenantDomain);
        } catch (IdentityRoleManagementException e) {
            throw new IdentityApplicationManagementException("Error occurred while creating impersonator role.");
        }
    }

    private static void addAPIResourceToApplication(String appId, String tenantDomain, String apiResourceName,
        String apiResourceType) throws IdentityApplicationManagementException {

        APIResource apiResource = getImpersontionAPIResource(tenantDomain, apiResourceName);

        AuthorizedAPI authorizedAPI = new AuthorizedAPI(
                appId,
                apiResource.getId(),
                APIResourceManagementConstants.RBAC_AUTHORIZATION,
                apiResource.getScopes(),
                apiResourceType
        );
        try {
            AuthorizedAPIManagementService authorizedAPIManagementService = new AuthorizedAPIManagementServiceImpl();
            authorizedAPIManagementService.addAuthorizedAPI(appId, authorizedAPI, tenantDomain);
        } catch (IdentityApplicationManagementException e) {
            throw new IdentityApplicationManagementException("Error occurred while adding API resource.");
        }
    }

    private static APIResource getImpersontionAPIResource(String tenantDomain, String apiResourceName)
            throws IdentityApplicationManagementException {

        APIResourceManager apiResourceManager = AppsCommonDataHolder.getInstance().getAPIResourceManager();
        APIResource apiResource = null;
        try {
            apiResource = apiResourceManager.getAPIResourceByIdentifier(apiResourceName, tenantDomain);
        } catch (APIResourceMgtException e) {
            throw new IdentityApplicationManagementException("Error occurred while retrieving API resource.");
        }
        if (apiResource == null) {
            throw new IdentityApplicationManagementException("Impersonation API resource is not available.");
        }
        return apiResource;
    }

    private static void addAdministratorRole(String appOwner, String appId, int tenantId, String tenantDomain)
        throws IdentityApplicationManagementException {

        try {
            String userID = getUserId(appOwner, tenantId);
            String adminGroupId = getAdminGroupId(tenantId);
            List<String> groupIds = Collections.emptyList();
            if (StringUtils.isNotEmpty(adminGroupId)) {
                groupIds = Collections.singletonList(adminGroupId);
            }
            AppsCommonDataHolder.getInstance().getRoleManagementServiceV2().addRole(ADMINISTRATOR,
                Collections.singletonList(userID), groupIds, Collections.emptyList(), APPLICATION, appId,
                tenantDomain);
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

        List<ServiceProviderProperty> serviceProviderProperties = new ArrayList<>();
        // Mark as system reserved app.
        ServiceProviderProperty spProperty1 = new ServiceProviderProperty();
        spProperty1.setName(IS_SYSTEM_RESERVED_APP_FLAG);
        spProperty1.setValue("true");
        spProperty1.setDisplayName("Is System Reserved Application");
        serviceProviderProperties.add(spProperty1);

        // Share the console application with all child organizations.
        if (ApplicationConstants.CONSOLE_APPLICATION_NAME.equals(serviceProvider.getApplicationName())) {
            ServiceProviderProperty spProperty2 = new ServiceProviderProperty();
            spProperty2.setName(SHARE_WITH_ALL_CHILDREN);
            spProperty2.setValue("true");
            serviceProviderProperties.add(spProperty2);
        }

        serviceProvider.setSpProperties(serviceProviderProperties.toArray(new ServiceProviderProperty[0]));

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

    private static String getAdminGroupId(int tenantID) throws IdentityApplicationManagementException {

        try {
            RealmService realmService = AppsCommonDataHolder.getInstance().getRealmService();
            String adminGroupName = realmService.getTenantUserRealm(tenantID).getRealmConfiguration()
                .getAdminRoleName();
            if (adminGroupName == null) {
                return null;
            }
            if (adminGroupName.startsWith(RoleConstants.INTERNAL_DOMAIN + CarbonConstants.DOMAIN_SEPARATOR)) {
                adminGroupName = adminGroupName.replace(RoleConstants.INTERNAL_DOMAIN +
                    CarbonConstants.DOMAIN_SEPARATOR, "");
            }
            try {
                return ((AbstractUserStoreManager) realmService.getTenantUserRealm(tenantID).getUserStoreManager()).
                    getGroupIdByGroupName(adminGroupName);
            } catch (org.wso2.carbon.user.api.UserStoreException e) {
                // Default admin group is not found.
                return null;
            }

        } catch (org.wso2.carbon.user.api.UserStoreException e) {
            throw new IdentityApplicationManagementException("Fail to resolve the admin group ID of the tenant: " +
                tenantID, e);
        }
    }
}
