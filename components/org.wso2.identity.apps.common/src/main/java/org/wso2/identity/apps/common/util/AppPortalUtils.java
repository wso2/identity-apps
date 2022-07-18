/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import org.wso2.carbon.context.PrivilegedCarbonContext;
import org.wso2.carbon.identity.application.authentication.framework.util.FrameworkConstants;
import org.wso2.carbon.identity.application.common.IdentityApplicationManagementException;
import org.wso2.carbon.identity.application.common.model.*;
import org.wso2.carbon.identity.application.mgt.ApplicationManagementService;
import org.wso2.carbon.identity.core.util.IdentityUtil;
import org.wso2.carbon.identity.oauth.IdentityOAuthAdminException;
import org.wso2.carbon.identity.oauth.OAuthUtil;
import org.wso2.carbon.identity.oauth.dto.OAuthConsumerAppDTO;
import org.wso2.carbon.identity.oauth2.OAuth2Constants;
import org.wso2.carbon.registry.core.exceptions.RegistryException;
import org.wso2.carbon.user.core.UserRealm;
import org.wso2.carbon.user.core.UserStoreException;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;

import java.util.Arrays;
import java.util.List;

import static org.wso2.carbon.identity.oauth.common.OAuthConstants.GrantTypes.AUTHORIZATION_CODE;
import static org.wso2.carbon.identity.oauth.common.OAuthConstants.GrantTypes.REFRESH_TOKEN;
import static org.wso2.carbon.identity.oauth.common.OAuthConstants.OAuthVersions.VERSION_2;
import static org.wso2.carbon.utils.multitenancy.MultitenantConstants.SUPER_TENANT_DOMAIN_NAME;
import static org.wso2.identity.apps.common.util.AppPortalConstants.*;

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
            String consumerSecret, String appOwner, int tenantId, String tenantDomain, String bindingType,
            List<String> grantTypes) throws IdentityOAuthAdminException {

        OAuthConsumerAppDTO oAuthConsumerAppDTO = new OAuthConsumerAppDTO();
        oAuthConsumerAppDTO.setApplicationName(applicationName);
        oAuthConsumerAppDTO.setOAuthVersion(VERSION_2);
        oAuthConsumerAppDTO.setOauthConsumerKey(consumerKey);
        oAuthConsumerAppDTO.setOauthConsumerSecret(consumerSecret);
        String callbackUrl = IdentityUtil.getServerURL(portalPath, true, true);
        if (!SUPER_TENANT_DOMAIN_NAME.equals(tenantDomain)) {
            callbackUrl = callbackUrl.replace(portalPath, "/t/" + tenantDomain.trim() + portalPath);
        } else {
            callbackUrl = "regexp=(" + callbackUrl + "|" +
                    callbackUrl.replace(portalPath, "/t/(.*)" + portalPath) + ")";
        }
        if (StringUtils.equals(CONSOLE_APP, applicationName)) {
            callbackUrl = IdentityUtil.getServerURL(portalPath, true, true);
            callbackUrl = "regexp=(" + callbackUrl + "|" + callbackUrl.replace(portalPath, "/t/(.*)" +
                    portalPath) + "|" + callbackUrl.replace(portalPath, "/o/(.*)" + portalPath) + ")";
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
            String consumerSecret, String tenantDomain) throws IdentityApplicationManagementException {

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
     */
    public static void createApplication(String appName, String appOwner, String appDescription, String consumerKey,
                                         String consumerSecret, String tenantDomain, String portalPath)
            throws IdentityApplicationManagementException {

        ServiceProvider serviceProvider = new ServiceProvider();
        serviceProvider.setApplicationName(appName);
        serviceProvider.setDescription(appDescription);
        serviceProvider.setSaasApp(true);
        serviceProvider.setManagementApp(true);
        if (StringUtils.isNotEmpty(portalPath)) {
            serviceProvider.setAccessUrl(IdentityUtil.getServerURL(portalPath, true, true));
        }

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

        LocalAndOutboundAuthenticationConfig localAndOutboundAuthenticationConfig
                = new LocalAndOutboundAuthenticationConfig();
        localAndOutboundAuthenticationConfig.setUseUserstoreDomainInLocalSubjectIdentifier(true);
        localAndOutboundAuthenticationConfig.setUseTenantDomainInLocalSubjectIdentifier(true);
        localAndOutboundAuthenticationConfig.setSkipConsent(true);
        localAndOutboundAuthenticationConfig.setSkipLogoutConsent(true);

        if (StringUtils.equals(CONSOLE_APP, appName)) {
            AuthenticationStep authenticationStep1 = new AuthenticationStep();
            LocalAuthenticatorConfig identifierFirst = new LocalAuthenticatorConfig();
            identifierFirst.setName("IdentifierExecutor");
            identifierFirst.setDisplayName("identifier-first");
            authenticationStep1.setLocalAuthenticatorConfigs(new LocalAuthenticatorConfig[]{identifierFirst});
            authenticationStep1.setSubjectStep(false);
            authenticationStep1.setAttributeStep(false);
            authenticationStep1.setStepOrder(1);

            AuthenticationStep authenticationStep2 = new AuthenticationStep();
            LocalAuthenticatorConfig basic = new LocalAuthenticatorConfig();
            basic.setName("BasicAuthenticator");
            basic.setDisplayName("basic");
            authenticationStep2.setLocalAuthenticatorConfigs(new LocalAuthenticatorConfig[]{basic});
            authenticationStep2.setAttributeStep(true);
            authenticationStep2.setSubjectStep(true);
            authenticationStep2.setStepOrder(2);
            localAndOutboundAuthenticationConfig.setAuthenticationType("flow");
            localAndOutboundAuthenticationConfig
                    .setAuthenticationSteps(new AuthenticationStep[]{authenticationStep1, authenticationStep2});
        }

        serviceProvider.setLocalAndOutBoundAuthenticationConfig(localAndOutboundAuthenticationConfig);

        // Set requested claim mappings for the SP.
        ClaimConfig claimConfig = new ClaimConfig();
        claimConfig.setClaimMappings(getRequestedClaimMappings());
        claimConfig.setLocalClaimDialect(true);
        serviceProvider.setClaimConfig(claimConfig);

        AppsCommonDataHolder.getInstance().getApplicationManagementService()
                .createApplication(serviceProvider, tenantDomain, appOwner);
    }

    /**
     * Get requested claim mappings.
     *
     * @return array of claim mappings.
     */
    private static ClaimMapping[] getRequestedClaimMappings() {

        Claim emailClaim = new Claim();
        emailClaim.setClaimUri(EMAIL_CLAIM_URI);
        ClaimMapping emailClaimMapping = new ClaimMapping();
        emailClaimMapping.setRequested(true);
        emailClaimMapping.setLocalClaim(emailClaim);
        emailClaimMapping.setRemoteClaim(emailClaim);

        Claim roleClaim = new Claim();
        roleClaim.setClaimUri(DISPLAY_NAME_CLAIM_URI);
        ClaimMapping roleClaimMapping = new ClaimMapping();
        roleClaimMapping.setRequested(true);
        roleClaimMapping.setLocalClaim(roleClaim);
        roleClaimMapping.setRemoteClaim(roleClaim);

        return new ClaimMapping[] { emailClaimMapping, roleClaimMapping };
    }

    /**
     * Initiate portal applications.
     *
     * @param tenantDomain tenant domain.
     * @param tenantId     tenant id.
     * @throws IdentityApplicationManagementException in case of failure during application creation.
     * @throws IdentityOAuthAdminException            in case of failure during OAuth2 application creation.
     * @throws RegistryException                      in case of failure while getting the user realm.
     * @throws UserStoreException
     */
    public static void initiatePortals(String tenantDomain, int tenantId)
            throws IdentityApplicationManagementException, IdentityOAuthAdminException, RegistryException,
            UserStoreException {

        ApplicationManagementService applicationMgtService = AppsCommonDataHolder.getInstance()
                .getApplicationManagementService();

        UserRealm userRealm = AppsCommonDataHolder.getInstance().getRegistryService().getUserRealm(tenantId);
        String adminUsername = userRealm.getRealmConfiguration().getAdminUserName();

        for (AppPortalConstants.AppPortal appPortal : AppPortalConstants.AppPortal.values()) {
            if (applicationMgtService.getApplicationExcludingFileBasedSPs(appPortal.getName(), tenantDomain) == null) {
                // Initiate portal
                String consumerSecret = OAuthUtil.getRandomNumber();
                List<String> grantTypes = Arrays.asList(AUTHORIZATION_CODE, REFRESH_TOKEN, GRANT_TYPE_ACCOUNT_SWITCH);
                if (StringUtils.equals(appPortal.getName(), CONSOLE_APP)) {
                    grantTypes = Arrays.asList(AUTHORIZATION_CODE, REFRESH_TOKEN, GRANT_TYPE_ACCOUNT_SWITCH,
                            GRANT_TYPE_ORGANIZATION_SWITCH);
                }
                String consumerKey = appPortal.getConsumerKey();
                if (!SUPER_TENANT_DOMAIN_NAME.equals(tenantDomain)) {
                    consumerKey = consumerKey + "_" + tenantDomain;
                }
                try {
                    AppPortalUtils.createOAuth2Application(appPortal.getName(), appPortal.getPath(), consumerKey,
                            consumerSecret, adminUsername, tenantId, tenantDomain,
                            OAuth2Constants.TokenBinderType.COOKIE_BASED_TOKEN_BINDER, grantTypes);
                } catch (IdentityOAuthAdminException e) {
                    if ("Error when adding the application. An application with the same name already exists."
                            .equals(e.getMessage())) {
                        // Application is already created.
                        continue;
                    }
                    throw e;
                }
                AppPortalUtils.createApplication(appPortal.getName(), adminUsername, appPortal.getDescription(),
                        consumerKey, consumerSecret, tenantDomain, appPortal.getPath());
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
}
