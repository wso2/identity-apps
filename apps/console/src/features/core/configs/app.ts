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

import { DocumentationConstants } from "@wso2is/core/constants";
import { DocumentationProviders, DocumentationStructureFileTypes } from "@wso2is/core/models";
import { I18nModuleInitOptions, I18nModuleOptionsInterface, MetaI18N, generateBackendPaths } from "@wso2is/i18n";
import { getFeatureGateResourceEndpoints } from "../../../extensions/components/feature-gate/configs";
import { getExtendedFeatureResourceEndpoints } from "../../../extensions/configs/endpoints";
import { getAPIResourceEndpoints } from "../../api-resources/configs/endpoint";
import { getApplicationsResourceEndpoints } from "../../applications/configs/endpoints";
import isLegacyAuthzRuntime from "../../authorization/utils/get-legacy-authz-runtime";
import { getBrandingResourceEndpoints } from "../../branding/configs/endpoints";
import { getCertificatesResourceEndpoints } from "../../certificates";
import { getClaimResourceEndpoints } from "../../claims/configs/endpoints";
import { getConnectionResourceEndpoints } from "../../connections";
import { getConsoleSettingsResourceEndpoints } from "../../console-settings/configs/endpoints";
import { getEmailTemplatesResourceEndpoints } from "../../email-templates";
import { getGroupsResourceEndpoints } from "../../groups";
import { getIDPResourceEndpoints } from "../../identity-providers/configs/endpoints";
import { getIDVPResourceEndpoints } from "../../identity-verification-providers";
import { getScopesResourceEndpoints } from "../../oidc-scopes";
import { getInsightsResourceEndpoints } from "../../org-insights/config/org-insights";
import { getOrganizationsResourceEndpoints } from "../../organizations/configs";
import { OrganizationUtils } from "../../organizations/utils";
import { getJWTAuthenticationServiceEndpoints } from "../../private-key-jwt/configs";
import { getRemoteFetchConfigResourceEndpoints } from "../../remote-repository-configuration";
import { getRolesResourceEndpoints } from "../../roles/configs/endpoints";
import { getSecretsManagementEndpoints } from "../../secrets/configs/endpoints";
import { getServerConfigurationsResourceEndpoints } from "../../server-configurations";
import { getTenantResourceEndpoints } from "../../tenants/configs/endpoints";
import { getUsersResourceEndpoints } from "../../users/configs/endpoints";
import { getUserstoreResourceEndpoints } from "../../userstores/configs/endpoints";
import { getValidationServiceEndpoints } from "../../validation/configs";
import { getApprovalsResourceEndpoints } from "../../workflow-approvals";
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
        if (isLegacyAuthzRuntime()) {
            if ((OrganizationUtils.isSuperOrganization(store.getState().organization.organization)
                || store.getState().organization.isFirstLevelOrganization) && !enforceOrgPath) {
                return window[ "AppUtils" ]?.getConfig()?.serverOriginWithTenant;
            } else {
                return `${
                    window[ "AppUtils" ]?.getConfig()?.serverOrigin }/o/${ store.getState().organization.organization.id
                }`;
            }
        }

        if (skipAuthzRuntimePath) {
            return window[ "AppUtils" ]?.getConfig()?.serverOriginWithTenant?.replace("/o", "");
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
                "approvals",
                "businessGroups",
                "urlInput"
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
            ...getIDPResourceEndpoints(this.resolveServerHost()),
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
                    ?? window[ "AppUtils" ]?.getConfig()?.ui?.defaultWhiteLogoPath
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
            systemAppsIdentifiers: window[ "AppUtils" ]?.getConfig()?.ui?.systemAppsIdentifiers,
            theme: window[ "AppUtils" ]?.getConfig()?.ui?.theme,
            useRoleClaimAsGroupClaim: window[ "AppUtils" ]?.getConfig()?.ui?.useRoleClaimAsGroupClaim
        };
    }
}
