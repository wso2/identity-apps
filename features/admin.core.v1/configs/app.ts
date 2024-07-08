/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { getAPIResourceEndpoints } from "@wso2is/admin.api-resources.v2/configs/endpoint";
import { getApplicationsResourceEndpoints } from "@wso2is/admin.applications.v1/configs/endpoints";
import { getBrandingResourceEndpoints } from "@wso2is/admin.branding.v1/configs/endpoints";
import { getCertificatesResourceEndpoints } from "@wso2is/admin.certificates.v1";
import { getClaimResourceEndpoints } from "@wso2is/admin.claims.v1/configs/endpoints";
import { getConnectionResourceEndpoints } from "@wso2is/admin.connections.v1";
import { getConsoleSettingsResourceEndpoints } from "@wso2is/admin.console-settings.v1/configs/endpoints";
import { getEmailTemplatesResourceEndpoints } from "@wso2is/admin.email-templates.v1";
import { getFeatureGateResourceEndpoints } from "@wso2is/admin.extensions.v1/components/feature-gate/configs";
import { getExtendedFeatureResourceEndpoints } from "@wso2is/admin.extensions.v1/configs/endpoints";
import { getExtendedFeatureResourceEndpointsV2 } from "@wso2is/admin.extensions.v2/config/endpoints";
import { getGroupsResourceEndpoints } from "@wso2is/admin.groups.v1";
import { getIDVPResourceEndpoints } from "@wso2is/admin.identity-verification-providers.v1";
import { getScopesResourceEndpoints } from "@wso2is/admin.oidc-scopes.v1";
import { getInsightsResourceEndpoints } from "@wso2is/admin.org-insights.v1/config/org-insights";
import { getOrganizationsResourceEndpoints } from "@wso2is/admin.organizations.v1/configs";
import { OrganizationUtils } from "@wso2is/admin.organizations.v1/utils";
import { getJWTAuthenticationServiceEndpoints } from "@wso2is/admin.private-key-jwt.v1/configs";
import { getRemoteFetchConfigResourceEndpoints } from "@wso2is/admin.remote-repository-configuration.v1";
import { getRolesResourceEndpoints } from "@wso2is/admin.roles.v2/configs/endpoints";
import { getSecretsManagementEndpoints } from "@wso2is/admin.secrets.v1/configs/endpoints";
import { getServerConfigurationsResourceEndpoints } from "@wso2is/admin.server-configurations.v1";
import { getTenantResourceEndpoints } from "@wso2is/admin.tenants.v1/configs/endpoints";
import { getUsersResourceEndpoints } from "@wso2is/admin.users.v1/configs/endpoints";
import { getUserstoreResourceEndpoints } from "@wso2is/admin.userstores.v1/configs/endpoints";
import { getValidationServiceEndpoints } from "@wso2is/admin.validation.v1/configs";
import { getApprovalsResourceEndpoints } from "@wso2is/admin.workflow-approvals.v1";
import { DocumentationConstants } from "@wso2is/core/constants";
import { DocumentationProviders, DocumentationStructureFileTypes } from "@wso2is/core/models";
import { I18nModuleInitOptions, I18nModuleOptionsInterface, MetaI18N, generateBackendPaths } from "@wso2is/i18n";
import { I18nConstants, UIConstants } from "../constants";
import { DeploymentConfigInterface, ServiceResourceEndpointsInterface, UIConfigInterface } from "../models";
import { store } from "../store";

/**
 * Class to handle application config operations.
 */
export class Config {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    /**
     * This method adds organization path to the server host if an organization is selected.
     *
     * @param enforceOrgPath - Enforces the organization path
     *
     * @returns Server host.
     */
    public static resolveServerHost(enforceOrgPath?: boolean, skipAuthzRuntimePath?: boolean): string {
        const serverOriginWithTenant: string = window[ "AppUtils" ]?.getConfig()?.serverOriginWithTenant;

        if (skipAuthzRuntimePath && serverOriginWithTenant?.slice(-2) === "/o") {
            return serverOriginWithTenant.substring(0,serverOriginWithTenant.lastIndexOf("/o"));
        }

        return window[ "AppUtils" ]?.getConfig()?.serverOriginWithTenant;
    }

    /**
     * This method adds organization path (t/org_uuid) to the server host if a sub-org is selected.
     *
     * @param enforceOrgPath - Enforces the organization path
     *
     * @returns Server host.
     */
    public static resolveServerHostforFG(enforceOrgPath?: boolean): string {
        if ((OrganizationUtils.isSuperOrganization(store.getState().organization.organization)
            || store.getState().organization.isFirstLevelOrganization) && !enforceOrgPath) {
            return window[ "AppUtils" ]?.getConfig()?.serverOriginWithTenant;
        } else {
            return `${
                window[ "AppUtils" ]?.getConfig()?.serverOrigin }/t/${ store.getState().organization.organization.id
            }`;
        }
    }

    /**
     * Get the deployment config.
     *
     * @returns Deployment config object.
     */
    public static getDeploymentConfig(): DeploymentConfigInterface {
        return {
            __experimental__platformIdP: window[ "AppUtils" ]?.getConfig()?.__experimental__platformIdP,
            accountApp: window[ "AppUtils" ]?.getConfig()?.accountApp,
            adminApp: window[ "AppUtils" ]?.getConfig()?.adminApp,
            allowMultipleAppProtocols: window[ "AppUtils" ]?.getConfig()?.allowMultipleAppProtocols,
            appBaseName: window[ "AppUtils" ]?.getConfig()?.appBaseWithTenant,
            appBaseNameWithoutTenant: window[ "AppUtils" ]?.getConfig()?.appBase,
            appHomePath: window[ "AppUtils" ]?.getConfig()?.routes?.home,
            appLoginPath: window[ "AppUtils" ]?.getConfig()?.routes?.login,
            appLogoutPath: window[ "AppUtils" ]?.getConfig()?.routes?.logout,
            clientHost: window[ "AppUtils" ]?.getConfig()?.clientOriginWithTenant,
            clientID: window[ "AppUtils" ]?.getConfig()?.clientID,
            clientOrigin: window[ "AppUtils" ]?.getConfig()?.clientOrigin,
            clientOriginWithTenant: window[ "AppUtils" ]?.getConfig()?.clientOriginWithTenant,
            customServerHost: window[ "AppUtils" ]?.getConfig()?.customServerHost,
            developerApp: window[ "AppUtils" ]?.getConfig()?.developerApp,
            docSiteURL: window[ "AppUtils" ]?.getConfig()?.docSiteUrl,
            documentation: {
                baseURL: window[ "AppUtils" ]?.getConfig()?.documentation?.baseURL
                    ?? DocumentationConstants.GITHUB_API_BASE_URL,
                contentBaseURL: window[ "AppUtils" ]?.getConfig()?.documentation?.contentBaseURL
                    ?? DocumentationConstants.DEFAULT_CONTENT_BASE_URL,
                githubOptions: {
                    branch: window[ "AppUtils" ]?.getConfig()?.documentation?.githubOptions?.branch
                        ?? DocumentationConstants.DEFAULT_BRANCH
                },
                imagePrefixURL: window[ "AppUtils" ]?.getConfig()?.documentation?.imagePrefixURL
                    ?? DocumentationConstants.DEFAULT_IMAGE_PREFIX_URL,
                provider: window[ "AppUtils" ]?.getConfig()?.documentation?.provider
                    ?? DocumentationProviders.GITHUB,
                structureFileType: window[ "AppUtils" ]?.getConfig()?.documentation?.structureFileType
                    ?? DocumentationStructureFileTypes.YAML,
                structureFileURL: window[ "AppUtils" ]?.getConfig()?.documentation?.structureFileURL
                    ?? DocumentationConstants.DEFAULT_STRUCTURE_FILE_URL
            },
            extensions: window[ "AppUtils" ]?.getConfig()?.extensions,
            idpConfigs: window[ "AppUtils" ]?.getConfig()?.idpConfigs,
            loginCallbackUrl: window[ "AppUtils" ]?.getConfig()?.loginCallbackURL,
            organizationPrefix: window["AppUtils"]?.getConfig()?.organizationPrefix,
            serverHost: window[ "AppUtils" ]?.getConfig()?.serverOriginWithTenant,
            serverOrigin: window[ "AppUtils" ]?.getConfig()?.serverOrigin,
            superTenant: window[ "AppUtils" ]?.getConfig()?.superTenant,
            tenant: window[ "AppUtils" ]?.getConfig()?.tenant,
            tenantPath: window[ "AppUtils" ]?.getConfig()?.tenantPath,
            tenantPrefix: window[ "AppUtils" ]?.getConfig()?.tenantPrefix
        };
    }

    /**
     * I18n init options.
     *
     * @remarks
     * Since the portals are not deployed per tenant, looking for static resources in tenant qualified URLs will fail.
     * Using `appBaseNameWithoutTenant` will create a path without the tenant. Therefore, `loadPath()` function will
     * look for resource files in `https://localhost:9443/<PORTAL>/resources/i18n` rather than looking for the
     * files in `https://localhost:9443/t/wso2.com/<PORTAL>/resources/i18n`.
     *
     * @param metaFile - Meta File.
     * @returns I18n init options.
     */
    public static generateModuleInitOptions(metaFile: MetaI18N): I18nModuleInitOptions {
        return {
            backend: {
                loadPath: (language: string[], namespace: string[]) => generateBackendPaths(
                    language,
                    namespace,
                    window[ "AppUtils" ]?.getConfig()?.appBase,
                    Config.getI18nConfig() ?? {
                        langAutoDetectEnabled: I18nConstants.LANG_AUTO_DETECT_ENABLED,
                        namespaceDirectories: I18nConstants.BUNDLE_NAMESPACE_DIRECTORIES,
                        overrideOptions: I18nConstants.INIT_OPTIONS_OVERRIDE,
                        resourcePath: "/resources/i18n",
                        xhrBackendPluginEnabled: I18nConstants.XHR_BACKEND_PLUGIN_ENABLED
                    },
                    metaFile
                )
            },
            load: "currentOnly", // lookup only current lang key(en-US). Prevents 404 from `en`.
            ns: [
                I18nConstants.COMMON_NAMESPACE,
                I18nConstants.CONSOLE_PORTAL_NAMESPACE,
                I18nConstants.EXTENSIONS_NAMESPACE,
                I18nConstants.USERSTORES_NAMESPACE,
                I18nConstants.VALIDATION_NAMESPACE,
                I18nConstants.JWT_PRIVATE_KEY_CONFIGURATION_NAMESPACE,
                I18nConstants.TRANSFER_LIST_NAMESPACE,
                I18nConstants.USER_NAMESPACE,
                I18nConstants.USERS_NAMESPACE,
                I18nConstants.PAGES_NAMESPACE,
                I18nConstants.IDVP_NAMESPACE,
                I18nConstants.INVITE_NAMESPACE,
                I18nConstants.PARENT_ORG_INVITATIONS_NAMESPACE,
                I18nConstants.OIDC_SCOPES_NAMESPACE,
                I18nConstants.ONBOARDED_NAMESPACE,
                I18nConstants.ORGANIZATION_DISCOVERY_NAMESPACE,
                I18nConstants.ORGANIZATIONS_NAMESPACE,
                I18nConstants.AUTHENTICATION_FLOW_NAMESPACE,
                I18nConstants.REMOTE_FETCH_NAMESPACE,
                I18nConstants.ROLES_NAMESPACE,
                I18nConstants.SERVER_CONFIGS_NAMESPACE,
                I18nConstants.SAML2_CONFIG_NAMESPACE,
                I18nConstants.SESSION_MANAGEMENT_NAMESPACE,
                I18nConstants.WS_FEDERATION_CONFIG_NAMESPACE,
                I18nConstants.INSIGHTS_NAMESPACE,
                I18nConstants.SMS_PROVIDERS_NAMESPACE,
                I18nConstants.CLAIMS_NAMESPACE,
                I18nConstants.EMAIL_LOCALE_NAMESPACE,
                I18nConstants.HELP_PANEL_NAMESPACE,
                I18nConstants.SUBORGANIZATIONS_NAMESPACE,
                I18nConstants.CONSOLE_SETTINGS_NAMESPACE,
                I18nConstants.SECRETS_NAMESPACE,
                I18nConstants.BRANDING_NAMESPACE,
                I18nConstants.EMAIL_TEMPLATES_NAMESPACE,
                I18nConstants.AUTHENTICATION_PROVIDER_NAMESPACE,
                I18nConstants.CERTIFICATES_NAMESPACE,
                I18nConstants.GOVERNANCE_CONNECTORS_NAMESPACE,
                I18nConstants.GROUPS_NAMESPACE,
                I18nConstants.APPLICATIONS_NAMESPACE,
                I18nConstants.IDP_NAMESPACE,
                I18nConstants.API_RESOURCES_NAMESPACE,
                I18nConstants.AI_NAMESPACE
            ],
            preload: []
        };
    }

    /**
     * Get i18n module config.
     *
     * @param metaFile - Meta file.
     * @returns i18n config object.
     */
    public static getI18nConfig(metaFile?: MetaI18N): I18nModuleOptionsInterface {
        return {
            initOptions: this.generateModuleInitOptions(metaFile),
            langAutoDetectEnabled: window[ "AppUtils" ]?.getConfig()?.ui?.i18nConfigs?.langAutoDetectEnabled
                ?? I18nConstants.LANG_AUTO_DETECT_ENABLED,
            namespaceDirectories: I18nConstants.BUNDLE_NAMESPACE_DIRECTORIES,
            overrideOptions: I18nConstants.INIT_OPTIONS_OVERRIDE,
            resourcePath: "/resources/i18n",
            xhrBackendPluginEnabled: I18nConstants.XHR_BACKEND_PLUGIN_ENABLED
        };
    }

    /**
     * Get the the list of service resource endpoints.
     *
     * @returns Service resource endpoints as an object.
     */
    public static getServiceResourceEndpoints(): ServiceResourceEndpointsInterface {
        return {
            ...getAPIResourceEndpoints(this.resolveServerHost()),
            ...getApplicationsResourceEndpoints(this.resolveServerHost()),
            ...getApprovalsResourceEndpoints(this.getDeploymentConfig()?.serverHost),
            ...getBrandingResourceEndpoints(this.resolveServerHost()),
            ...getClaimResourceEndpoints(this.getDeploymentConfig()?.serverHost, this.resolveServerHost()),
            ...getCertificatesResourceEndpoints(this.getDeploymentConfig()?.serverHost),
            ...getIDVPResourceEndpoints(this.resolveServerHost()),
            ...getEmailTemplatesResourceEndpoints(this.resolveServerHost()),
            ...getConnectionResourceEndpoints(this.resolveServerHost()),
            ...getRolesResourceEndpoints(this.resolveServerHost(), this.getDeploymentConfig().serverHost),
            ...getServerConfigurationsResourceEndpoints(this.resolveServerHost()),
            ...getUsersResourceEndpoints(this.resolveServerHost()),
            ...getUserstoreResourceEndpoints(this.resolveServerHost()),
            ...getScopesResourceEndpoints(this.getDeploymentConfig()?.serverHost),
            ...getGroupsResourceEndpoints(this.resolveServerHost()),
            ...getValidationServiceEndpoints(this.resolveServerHost()),
            ...getJWTAuthenticationServiceEndpoints(this.resolveServerHost()),
            ...getRemoteFetchConfigResourceEndpoints(this.getDeploymentConfig()?.serverHost),
            ...getSecretsManagementEndpoints(this.getDeploymentConfig()?.serverHost),
            ...getExtendedFeatureResourceEndpoints(this.resolveServerHost(), this.getDeploymentConfig()),
            ...getExtendedFeatureResourceEndpointsV2(this.resolveServerHost()),
            ...getOrganizationsResourceEndpoints(this.resolveServerHost(true), this.getDeploymentConfig().serverHost),
            ...getTenantResourceEndpoints(this.getDeploymentConfig().serverOrigin),
            ...getFeatureGateResourceEndpoints(this.resolveServerHostforFG(false)),
            ...getInsightsResourceEndpoints(this.getDeploymentConfig()?.serverHost),
            ...getConsoleSettingsResourceEndpoints(this.getDeploymentConfig()?.serverHost),
            CORSOrigins: `${ this.getDeploymentConfig()?.serverHost }/api/server/v1/cors/origins`,
            // TODO: Remove this endpoint and use ID token to get the details
            me: `${ this.getDeploymentConfig()?.serverHost }/scim2/Me`,
            saml2Meta: `${ this.resolveServerHost(false, true) }/identity/metadata/saml2`,
            wellKnown: `${ this.resolveServerHost(false, true) }/oauth2/token/.well-known/openid-configuration`
        };
    }

    /**
     * Get UI config.
     *
     * @returns UI config object.
     */
    public static getUIConfig(): UIConfigInterface {
        return {
            administratorRoleDisplayName: window[ "AppUtils" ]?.getConfig()?.ui?.administratorRoleDisplayName ??
                UIConstants.ADMINISTRATOR_ROLE_DISPLAY_NAME,
            announcements: window[ "AppUtils" ]?.getConfig()?.ui?.announcements,
            appCopyright: window[ "AppUtils" ]?.getConfig()?.ui?.appCopyright
                .replace("${copyright}", "\u00A9")
                .replace("${year}", new Date().getFullYear()),
            appLogo: {
                defaultLogoPath: window[ "AppUtils" ]?.getConfig()?.ui?.appLogo?.defaultLogoPath
                    ?? window[ "AppUtils" ]?.getConfig()?.ui?.appLogoPath,
                defaultWhiteLogoPath: window[ "AppUtils" ]?.getConfig()?.ui?.appLogo?.defaultWhiteLogoPath
                    ?? window[ "AppUtils" ]?.getConfig()?.ui?.appWhiteLogoPath
            },
            appName: window[ "AppUtils" ]?.getConfig()?.ui?.appName,
            appTitle: window[ "AppUtils" ]?.getConfig()?.ui?.appTitle,
            applicationTemplateLoadingStrategy:
                window[ "AppUtils" ]?.getConfig()?.ui?.applicationTemplateLoadingStrategy,
            connectionResourcesUrl: window[ "AppUtils" ]?.getConfig()?.ui?.connectionResourcesUrl,
            cookiePolicyUrl: window[ "AppUtils" ]?.getConfig()?.ui?.cookiePolicyUrl,
            emailTemplates: {
                defaultLogoUrl: window[ "AppUtils" ]?.getConfig()?.ui?.emailTemplates?.defaultLogoUrl,
                defaultWhiteLogoUrl: window[ "AppUtils" ]?.getConfig()?.ui?.emailTemplates?.defaultWhiteLogoUrl
            },
            enableCustomEmailTemplates: window[ "AppUtils" ]?.getConfig()?.ui?.enableCustomEmailTemplates,
            enableEmailDomain: window[ "AppUtils" ]?.getConfig()?.ui?.enableEmailDomain ?? false,
            enableIdentityClaims: window[ "AppUtils" ]?.getConfig()?.ui?.enableIdentityClaims ?? true,
            features: window[ "AppUtils" ]?.getConfig()?.ui?.features,
            googleOneTapEnabledTenants: window["AppUtils"]?.getConfig()?.ui?.googleOneTapEnabledTenants,
            governanceConnectors: window["AppUtils"]?.getConfig()?.ui?.governanceConnectors,
            gravatarConfig: window[ "AppUtils" ]?.getConfig()?.ui?.gravatarConfig,
            hiddenAuthenticators: window[ "AppUtils" ]?.getConfig()?.ui?.hiddenAuthenticators,
            hiddenConnectionTemplates: window[ "AppUtils" ]?.getConfig()?.ui?.hiddenConnectionTemplates,
            hiddenUserStores: window[ "AppUtils" ]?.getConfig()?.ui?.hiddenUserStores,
            i18nConfigs: window[ "AppUtils" ]?.getConfig()?.ui?.i18nConfigs,
            identityProviderTemplateLoadingStrategy:
                window[ "AppUtils" ]?.getConfig()?.ui?.identityProviderTemplateLoadingStrategy,
            identityProviderTemplates: window[ "AppUtils" ]?.getConfig()?.ui?.identityProviderTemplates,
            isClientSecretHashEnabled: window[ "AppUtils" ]?.getConfig()?.ui?.isClientSecretHashEnabled,
            isCookieConsentBannerEnabled: window[ "AppUtils" ]?.getConfig()?.ui?.isCookieConsentBannerEnabled,
            isCustomClaimMappingEnabled: window[ "AppUtils" ]?.getConfig()?.ui?.isCustomClaimMappingEnabled,
            isCustomClaimMappingMergeEnabled: window[ "AppUtils" ]?.getConfig()?.ui?.isCustomClaimMappingMergeEnabled,
            isDefaultDialectEditingEnabled: window[ "AppUtils" ]?.getConfig()?.ui?.isDefaultDialectEditingEnabled,
            isDialectAddingEnabled: window[ "AppUtils" ]?.getConfig()?.ui?.isDialectAddingEnabled,
            isEditingSystemRolesAllowed:  window[ "AppUtils" ]?.getConfig()?.ui?.isEditingSystemRolesAllowed,
            isFeatureGateEnabled: window[ "AppUtils" ]?.getConfig()?.ui?.isFeatureGateEnabled,
            isGroupAndRoleSeparationEnabled: window[ "AppUtils" ]?.getConfig()?.ui?.isGroupAndRoleSeparationEnabled,
            isHeaderAvatarLabelAllowed: window[ "AppUtils" ]?.getConfig()?.ui?.isHeaderAvatarLabelAllowed,
            isLeftNavigationCategorized: window[ "AppUtils" ]?.getConfig()?.ui?.isLeftNavigationCategorized,
            isMarketingConsentBannerEnabled: window[ "AppUtils" ]?.getConfig()?.ui?.isMarketingConsentBannerEnabled,
            isPasswordInputValidationEnabled: window["AppUtils"]?.getConfig()?.ui?.isPasswordInputValidationEnabled,
            isRequestPathAuthenticationEnabled:
                window[ "AppUtils" ]?.getConfig()?.ui?.isRequestPathAuthenticationEnabled,
            isSAASDeployment: window[ "AppUtils" ]?.getConfig()?.ui?.isSAASDeployment,
            isSignatureValidationCertificateAliasEnabled:
                window[ "AppUtils" ]?.getConfig()?.ui?.isSignatureValidationCertificateAliasEnabled,
            isXacmlConnectorEnabled: window[ "AppUtils" ]?.getConfig()?.ui?.isXacmlConnectorEnabled,
            legacyMode: window[ "AppUtils" ]?.getConfig()?.ui?.legacyMode,
            listAllAttributeDialects: window[ "AppUtils" ]?.getConfig()?.ui?.listAllAttributeDialects,
            privacyPolicyConfigs: window[ "AppUtils" ]?.getConfig()?.ui?.privacyPolicyConfigs,
            productName: window[ "AppUtils" ]?.getConfig()?.ui?.productName,
            productVersionConfig: window[ "AppUtils" ]?.getConfig()?.ui?.productVersionConfig,
            selfAppIdentifier: window[ "AppUtils" ]?.getConfig()?.ui?.selfAppIdentifier,
            showAppSwitchButton: window[ "AppUtils" ]?.getConfig()?.ui?.showAppSwitchButton,
            showSmsOtpPwdRecoveryFeatureStatusChip:
                window[ "AppUtils" ]?.getConfig()?.ui?.showSmsOtpPwdRecoveryFeatureStatusChip,
            showStatusLabelForNewAuthzRuntimeFeatures:
                window[ "AppUtils" ]?.getConfig()?.ui?.showStatusLabelForNewAuthzRuntimeFeatures,
            systemAppsIdentifiers: window[ "AppUtils" ]?.getConfig()?.ui?.systemAppsIdentifiers,
            theme: window[ "AppUtils" ]?.getConfig()?.ui?.theme,
            useRoleClaimAsGroupClaim: window[ "AppUtils" ]?.getConfig()?.ui?.useRoleClaimAsGroupClaim
        };
    }
}
