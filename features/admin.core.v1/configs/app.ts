/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { getActionsResourceEndpoints } from "@wso2is/admin.actions.v1/configs/endpoints";
import { getAdministratorsResourceEndpoints } from "@wso2is/admin.administrators.v1/config/endpoints";
import { getAgentsResourceEndpoints } from "@wso2is/admin.agents.v1/configs/endpoints";
import { getAPIResourceEndpoints } from "@wso2is/admin.api-resources.v2/configs/endpoint";
import { getApplicationTemplatesResourcesEndpoints } from "@wso2is/admin.application-templates.v1/configs/endpoints";
import { getApplicationsResourceEndpoints } from "@wso2is/admin.applications.v1/configs/endpoints";
import {
    getWorkflowAssociationsResourceEndpoints,
    getWorkflowsResourceEndpoints
} from "@wso2is/admin.approval-workflows.v1/configs/endpoints";
import {
    getAskPasswordFlowBuilderResourceEndpoints
} from "@wso2is/admin.ask-password-flow-builder.v1/configs/endpoints";
import { getBrandingResourceEndpoints } from "@wso2is/admin.branding.v1/configs/endpoints";
import { getCertificatesResourceEndpoints } from "@wso2is/admin.certificates.v1";
import { getClaimResourceEndpoints } from "@wso2is/admin.claims.v1/configs/endpoints";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { getConnectionResourceEndpoints } from "@wso2is/admin.connections.v1";
import { getEmailTemplatesResourceEndpoints } from "@wso2is/admin.email-templates.v1";
import { getExtendedFeatureResourceEndpoints } from "@wso2is/admin.extensions.v1/configs/endpoints";
import { getFeatureGateResourceEndpoints } from "@wso2is/admin.feature-gate.v1/configs/endpoints";
import { getFlowBuilderCoreResourceEndpoints } from "@wso2is/admin.flow-builder-core.v1/config/endpoints";
import { getFlowsResourceEndpoints } from "@wso2is/admin.flows.v1/configs/endpoints";
import { getGroupsResourceEndpoints } from "@wso2is/admin.groups.v1/configs/endpoints";
import { getIDVPResourceEndpoints } from "@wso2is/admin.identity-verification-providers.v1/configs/endpoints";
import { getRemoteLoggingEndpoints } from "@wso2is/admin.logs.v1/configs/endpoints";
import { getScopesResourceEndpoints } from "@wso2is/admin.oidc-scopes.v1";
import { getInsightsResourceEndpoints } from "@wso2is/admin.org-insights.v1/config/org-insights";
import { getOrganizationsResourceEndpoints } from "@wso2is/admin.organizations.v1/configs";
import { OrganizationUtils } from "@wso2is/admin.organizations.v1/utils";
import {
    getPasswordRecoveryFlowBuilderResourceEndpoints
} from "@wso2is/admin.password-recovery-flow-builder.v1/config/endpoints";
import { getPolicyAdministrationResourceEndpoints } from "@wso2is/admin.policy-administration.v1/configs/endpoints";
import {
    getPushProviderResourceEndpoints, getPushProviderTemplateEndpoints
} from "@wso2is/admin.push-providers.v1/configs/endpoints";
import {
    getRegistrationFlowBuilderResourceEndpoints
} from "@wso2is/admin.registration-flow-builder.v1/config/endpoints";
import { getRemoteFetchConfigResourceEndpoints } from "@wso2is/admin.remote-repository-configuration.v1";
import { getRolesResourceEndpoints } from "@wso2is/admin.roles.v2/configs/endpoints";
import { getRulesEndpoints } from "@wso2is/admin.rules.v1/configs/endpoints";
import { getSecretsManagementEndpoints } from "@wso2is/admin.secrets.v1/configs/endpoints";
import { getServerConfigurationsResourceEndpoints } from "@wso2is/admin.server-configurations.v1";
import { getSmsTemplateResourceEndpoints } from "@wso2is/admin.sms-templates.v1/configs/endpoints";
import { getExtensionTemplatesEndpoints } from "@wso2is/admin.template-core.v1/configs/endpoints";
import { getTenantResourceEndpoints } from "@wso2is/admin.tenants.v1/configs/endpoints";
import { getUsersResourceEndpoints } from "@wso2is/admin.users.v1/configs/endpoints";
import { getUserstoreResourceEndpoints } from "@wso2is/admin.userstores.v1/configs/endpoints";
import { PRIMARY_USERSTORE } from "@wso2is/admin.userstores.v1/constants";
import { getValidationServiceEndpoints } from "@wso2is/admin.validation.v1/configs";
import { getWebhooksResourceEndpoints } from "@wso2is/admin.webhooks.v1/configs/endpoints";
import { getApprovalsResourceEndpoints } from "@wso2is/admin.workflow-approvals.v1";
import { I18nModuleInitOptions, I18nModuleOptionsInterface, MetaI18N, generateBackendPaths } from "@wso2is/i18n";
import { AppConstants } from "../constants/app-constants";
import { I18nConstants } from "../constants/i18n-constants";
import { UIConstants } from "../constants/ui-constants";
import { DeploymentConfigInterface, ServiceResourceEndpointsInterface, UIConfigInterface } from "../models/config";
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
        // If tenant qualified URLs are disabled, return the server origin.
        if (!this.isTenantQualifiedURLsEnabled()) {
            return this.getDeploymentConfig()?.serverOrigin;
        }

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
     * This method directly returns the server host read from the deployment config.
     *
     * @returns server host.
     */
    public static resolveServerHostFromConfig() {
        if (!this.isTenantQualifiedURLsEnabled()) {
            return this.getDeploymentConfig()?.serverOrigin;
        } else {
            return this.getDeploymentConfig()?.serverHost;
        }
    }

    /**
     * This method checks if tenant qualified URLs are enabled.
     *
     * @returns true if tenant qualified URLs are enabled.
     */
    private static isTenantQualifiedURLsEnabled() {
        return this.getDeploymentConfig()?.tenantContext?.enableTenantQualifiedUrls;
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
            centralDeploymentEnabled: window[ "AppUtils" ]?.getConfig()?.centralDeploymentEnabled,
            clientHost: window[ "AppUtils" ]?.getConfig()?.clientOriginWithTenant,
            clientID: window[ "AppUtils" ]?.getConfig()?.clientID,
            clientOrigin: window[ "AppUtils" ]?.getConfig()?.clientOrigin,
            clientOriginWithTenant: window[ "AppUtils" ]?.getConfig()?.clientOriginWithTenant,
            customServerHost: window[ "AppUtils" ]?.getConfig()?.customServerHost,
            developerApp: window[ "AppUtils" ]?.getConfig()?.developerApp,
            docSiteURL: window[ "AppUtils" ]?.getConfig()?.docSiteUrl,
            extensions: window[ "AppUtils" ]?.getConfig()?.extensions,
            idpConfigs: window[ "AppUtils" ]?.getConfig()?.idpConfigs,
            loginCallbackUrl: window[ "AppUtils" ]?.getConfig()?.loginCallbackURL,
            organizationPrefix: window["AppUtils"]?.getConfig()?.organizationPrefix,
            regionSelectionEnabled: window[ "AppUtils" ]?.getConfig()?.regionSelectionEnabled,
            serverHost: window[ "AppUtils" ]?.getConfig()?.serverOriginWithTenant,
            serverOrigin: window[ "AppUtils" ]?.getConfig()?.serverOrigin,
            superTenant: window[ "AppUtils" ]?.getConfig()?.superTenant,
            tenant: window[ "AppUtils" ]?.getConfig()?.tenant,
            tenantContext: window[ "AppUtils" ]?.getConfig()?.tenantContext,
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
                I18nConstants.APPLICATION_ROLES_NAMESPACE,
                I18nConstants.COMMON_NAMESPACE,
                I18nConstants.CONSOLE_PORTAL_NAMESPACE,
                I18nConstants.EXTENSIONS_NAMESPACE,
                I18nConstants.USERSTORES_NAMESPACE,
                I18nConstants.VALIDATION_NAMESPACE,
                I18nConstants.IMPERSONATION_CONFIGURATION_NAMESPACE,
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
                I18nConstants.SMS_TEMPLATES_NAMESPACE,
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
                I18nConstants.AI_NAMESPACE,
                I18nConstants.TEMPLATE_CORE_NAMESPACE,
                I18nConstants.APPLICATION_TEMPLATES_NAMESPACE,
                I18nConstants.ACTIONS_NAMESPACE,
                I18nConstants.TENANTS_NAMESPACE,
                I18nConstants.CUSTOM_AUTHENTICATOR_NAMESPACE,
                I18nConstants.POLICY_ADMINISTRATION_NAMESPACE,
                I18nConstants.REMOTE_USER_STORES_NAMESPACE,
                I18nConstants.RULES_NAMESPACE,
                I18nConstants.PUSH_PROVIDERS_NAMESPACE,
                I18nConstants.EMAIL_PROVIDERS_NAMESPACE,
                I18nConstants.WEBHOOKS_NAMESPACE,
                I18nConstants.APPROVAL_WORKFLOWS_NAMESPACE,
                I18nConstants.AGENTS_NAMESPACE,
                I18nConstants.FLOWS_NAMESPACE
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
            ...getAdministratorsResourceEndpoints(this.resolveServerHost()),
            ...getApplicationsResourceEndpoints(this.resolveServerHost()),
            ...getApprovalsResourceEndpoints(this.resolveServerHostFromConfig()),
            ...getBrandingResourceEndpoints(this.resolveServerHost()),
            ...getClaimResourceEndpoints(this.resolveServerHostFromConfig(), this.resolveServerHost()),
            ...getCertificatesResourceEndpoints(this.resolveServerHostFromConfig()),
            ...getIDVPResourceEndpoints(this.resolveServerHost()),
            ...getEmailTemplatesResourceEndpoints(this.resolveServerHost()),
            ...getConnectionResourceEndpoints(this.resolveServerHost()),
            ...getRolesResourceEndpoints(this.resolveServerHost(), this.resolveServerHostFromConfig()),
            ...getServerConfigurationsResourceEndpoints(this.resolveServerHost()),
            ...getUsersResourceEndpoints(this.resolveServerHost()),
            ...getUserstoreResourceEndpoints(this.resolveServerHost()),
            ...getScopesResourceEndpoints(this.resolveServerHostFromConfig()),
            ...getGroupsResourceEndpoints(this.resolveServerHost()),
            ...getValidationServiceEndpoints(this.resolveServerHost()),
            ...getRemoteFetchConfigResourceEndpoints(this.resolveServerHostFromConfig()),
            ...getSecretsManagementEndpoints(this.resolveServerHostFromConfig()),
            ...getExtendedFeatureResourceEndpoints(this.resolveServerHost(), this.getDeploymentConfig()),
            ...getOrganizationsResourceEndpoints(this.resolveServerHost(true), this.resolveServerHostFromConfig()),
            ...getTenantResourceEndpoints(this.getDeploymentConfig().serverOrigin),
            ...getFeatureGateResourceEndpoints(this.resolveServerHostforFG(false)),
            ...getInsightsResourceEndpoints(this.resolveServerHostFromConfig()),
            ...getExtensionTemplatesEndpoints(this.resolveServerHost()),
            ...getApplicationTemplatesResourcesEndpoints(this.resolveServerHost()),
            ...getActionsResourceEndpoints(this.resolveServerHost()),
            ...getRulesEndpoints(this.resolveServerHost()),
            ...getSmsTemplateResourceEndpoints(this.resolveServerHost()),
            ...getPolicyAdministrationResourceEndpoints(this.resolveServerHost()),
            ...getPushProviderResourceEndpoints(this.resolveServerHost()),
            ...getPushProviderTemplateEndpoints(this.resolveServerHost()),
            ...getRemoteLoggingEndpoints(this.resolveServerHost()),
            ...getWorkflowsResourceEndpoints(this.resolveServerHost()),
            ...getWorkflowAssociationsResourceEndpoints(this.resolveServerHost()),
            ...getRegistrationFlowBuilderResourceEndpoints(this.resolveServerHost()),
            ...getPasswordRecoveryFlowBuilderResourceEndpoints(this.resolveServerHost()),
            ...getAskPasswordFlowBuilderResourceEndpoints(this.resolveServerHost()),
            ...getFlowsResourceEndpoints(this.resolveServerHost()),
            ...getWebhooksResourceEndpoints(this.resolveServerHost()),
            ...getAgentsResourceEndpoints(this.resolveServerHost()),
            ...getFlowBuilderCoreResourceEndpoints(this.resolveServerHost()),
            CORSOrigins: `${ this.resolveServerHostFromConfig() }/api/server/v1/cors/origins`,
            asyncStatus: `${ this.resolveServerHost(false, true) }/api/server/v1/async-operations`,
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
            asyncOperationStatusPollingInterval:
                window[ "AppUtils" ]?.getConfig()?.ui?.asyncOperationStatusPollingInterval,
            connectionResourcesUrl: window[ "AppUtils" ]?.getConfig()?.ui?.connectionResourcesUrl,
            cookiePolicyUrl: window[ "AppUtils" ]?.getConfig()?.ui?.cookiePolicyUrl,
            customContent: window[ "AppUtils" ]?.getConfig()?.ui?.customContent ??
                UIConstants.DEFAULT_CUSTOM_CONTENT_CONFIGS,
            emailTemplates: {
                defaultLogoUrl: window[ "AppUtils" ]?.getConfig()?.ui?.emailTemplates?.defaultLogoUrl,
                defaultWhiteLogoUrl: window[ "AppUtils" ]?.getConfig()?.ui?.emailTemplates?.defaultWhiteLogoUrl
            },
            enableCustomEmailTemplates: window[ "AppUtils" ]?.getConfig()?.ui?.enableCustomEmailTemplates,
            enableEmailDomain: window[ "AppUtils" ]?.getConfig()?.ui?.enableEmailDomain ?? false,
            enableIdentityClaims: window[ "AppUtils" ]?.getConfig()?.ui?.enableIdentityClaims ?? true,
            enableOldUIForEmailProvider: window[ "AppUtils" ]?.getConfig()?.ui?.enableOldUIForEmailProvider,
            features: window[ "AppUtils" ]?.getConfig()?.ui?.features,
            googleOneTapEnabledTenants: window["AppUtils"]?.getConfig()?.ui?.googleOneTapEnabledTenants,
            governanceConnectors: window["AppUtils"]?.getConfig()?.ui?.governanceConnectors,
            gravatarConfig: window[ "AppUtils" ]?.getConfig()?.ui?.gravatarConfig,
            hiddenApplicationTemplates: window[ "AppUtils" ]?.getConfig()?.ui?.hiddenApplicationTemplates ?? [],
            hiddenAuthenticators: window[ "AppUtils" ]?.getConfig()?.ui?.hiddenAuthenticators,
            hiddenConnectionTemplates: window[ "AppUtils" ]?.getConfig()?.ui?.hiddenConnectionTemplates,
            hiddenUserStores: window[ "AppUtils" ]?.getConfig()?.ui?.hiddenUserStores,
            i18nConfigs: window[ "AppUtils" ]?.getConfig()?.ui?.i18nConfigs,
            identityProviderTemplates: window[ "AppUtils" ]?.getConfig()?.ui?.identityProviderTemplates,
            isAdminDataSeparationNoticeEnabled:
                window[ "AppUtils" ]?.getConfig()?.ui?.isAdminDataSeparationNoticeEnabled,
            isClaimUniquenessValidationEnabled:
                window[ "AppUtils" ]?.getConfig()?.ui?.isClaimUniquenessValidationEnabled ?? false,
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
            isMarketingConsentBannerEnabled: window["AppUtils"]?.getConfig()?.ui?.isMarketingConsentBannerEnabled,
            isMultipleEmailsAndMobileNumbersEnabled:
                window["AppUtils"]?.getConfig()?.ui?.isMultipleEmailsAndMobileNumbersEnabled,
            isPasswordInputValidationEnabled: window["AppUtils"]?.getConfig()?.ui?.isPasswordInputValidationEnabled,
            isRequestPathAuthenticationEnabled:
                window[ "AppUtils" ]?.getConfig()?.ui?.isRequestPathAuthenticationEnabled,
            isSAASDeployment: window[ "AppUtils" ]?.getConfig()?.ui?.isSAASDeployment,
            isSignatureValidationCertificateAliasEnabled:
                window[ "AppUtils" ]?.getConfig()?.ui?.isSignatureValidationCertificateAliasEnabled,
            isTrustedAppConsentRequired: window[ "AppUtils" ]?.getConfig()?.ui?.isTrustedAppConsentRequired ?? false,
            isXacmlConnectorEnabled: window[ "AppUtils" ]?.getConfig()?.ui?.isXacmlConnectorEnabled,
            legacyMode: window[ "AppUtils" ]?.getConfig()?.ui?.legacyMode,
            listAllAttributeDialects: window[ "AppUtils" ]?.getConfig()?.ui?.listAllAttributeDialects,
            multiTenancy: window[ "AppUtils" ]?.getConfig()?.ui?.multiTenancy,
            passwordPolicyConfigs: window[ "AppUtils" ]?.getConfig()?.ui?.passwordPolicyConfigs,
            primaryUserStoreDomainName: window[ "AppUtils" ]?.getConfig()?.ui?.primaryUserStoreDomainName?.toUpperCase()
                ?? PRIMARY_USERSTORE,
            privacyPolicyConfigs: window[ "AppUtils" ]?.getConfig()?.ui?.privacyPolicyConfigs,
            privacyPolicyUrl: window[ "AppUtils" ]?.getConfig()?.ui?.privacyPolicyUrl,
            productName: window[ "AppUtils" ]?.getConfig()?.ui?.productName,
            productVersionConfig: window[ "AppUtils" ]?.getConfig()?.ui?.productVersionConfig,
            routes: window[ "AppUtils" ]?.getConfig()?.ui?.routes ?? {
                organizationEnabledRoutes: AppConstants.ORGANIZATION_ENABLED_ROUTES
            },
            selfAppIdentifier: window[ "AppUtils" ]?.getConfig()?.ui?.selfAppIdentifier,
            showAppSwitchButton: window[ "AppUtils" ]?.getConfig()?.ui?.showAppSwitchButton,
            showSmsOtpPwdRecoveryFeatureStatusChip:
                window[ "AppUtils" ]?.getConfig()?.ui?.showSmsOtpPwdRecoveryFeatureStatusChip,
            showStatusLabelForNewAuthzRuntimeFeatures:
                window[ "AppUtils" ]?.getConfig()?.ui?.showStatusLabelForNewAuthzRuntimeFeatures,
            systemAppsIdentifiers: window[ "AppUtils" ]?.getConfig()?.ui?.systemAppsIdentifiers,
            systemReservedUserStores: window[ "AppUtils" ]?.getConfig()?.ui?.systemReservedUserStores,
            termsOfUseUrl: window[ "AppUtils" ]?.getConfig()?.ui?.termsOfUseURL,
            theme: window[ "AppUtils" ]?.getConfig()?.ui?.theme,
            useRoleClaimAsGroupClaim: window[ "AppUtils" ]?.getConfig()?.ui?.useRoleClaimAsGroupClaim,
            userSchemaURI: window[ "AppUtils" ]?.getConfig()?.ui?.customUserSchemaURI
                ?? ClaimManagementConstants.DEFAULT_SCIM2_CUSTOM_USER_SCHEMA_URI
        };
    }
}
