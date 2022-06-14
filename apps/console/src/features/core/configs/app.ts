/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { getExtendedFeatureResourceEndpoints } from "../../../extensions/configs/endpoints";
import { getApplicationsResourceEndpoints } from "../../applications/configs";
import { getCertificatesResourceEndpoints } from "../../certificates";
import { getClaimResourceEndpoints } from "../../claims";
import { getEmailTemplatesResourceEndpoints } from "../../email-templates";
import { getGroupsResourceEndpoints } from "../../groups";
import { getIDPResourceEndpoints } from "../../identity-providers";
import { getScopesResourceEndpoints } from "../../oidc-scopes";
import { getRemoteFetchConfigResourceEndpoints } from "../../remote-repository-configuration";
import { getRolesResourceEndpoints } from "../../roles";
import { getSecretsManagementEndpoints } from "../../secrets/configs/endpoints";
import { getServerConfigurationsResourceEndpoints } from "../../server-configurations";
import { getUsersResourceEndpoints } from "../../users";
import { getUserstoreResourceEndpoints } from "../../userstores";
import { getApprovalsResourceEndpoints } from "../../workflow-approvals";
import { I18nConstants } from "../constants";
import { DeploymentConfigInterface, ServiceResourceEndpointsInterface, UIConfigInterface } from "../models";

/**
 * Class to handle application config operations.
 */
export class Config {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Get the deployment config.
     *
     * @return {DeploymentConfigInterface} Deployment config object.
     */
    public static getDeploymentConfig(): DeploymentConfigInterface {
        return {
            accountApp: window["AppUtils"]?.getConfig()?.accountApp,
            adminApp: window["AppUtils"]?.getConfig()?.adminApp,
            allowMultipleAppProtocols: window["AppUtils"]?.getConfig()?.allowMultipleAppProtocols,
            appBaseName: window["AppUtils"]?.getConfig()?.appBaseWithTenant,
            appBaseNameWithoutTenant: window["AppUtils"]?.getConfig()?.appBase,
            appHomePath: window["AppUtils"]?.getConfig()?.routes.home,
            appLoginPath: window["AppUtils"]?.getConfig()?.routes.login,
            appLogoutPath: window["AppUtils"]?.getConfig()?.routes.logout,
            clientHost: window["AppUtils"]?.getConfig()?.clientOriginWithTenant,
            clientID: window["AppUtils"]?.getConfig()?.clientID,
            clientOrigin: window["AppUtils"]?.getConfig()?.clientOrigin,
            customServerHost: window["AppUtils"]?.getConfig()?.customServerHost,
            developerApp: window[ "AppUtils" ]?.getConfig()?.developerApp,
            docSiteURL: window["AppUtils"]?.getConfig()?.docSiteUrl,
            documentation: {
                baseURL: window["AppUtils"]?.getConfig()?.documentation?.baseURL
                    ?? DocumentationConstants.GITHUB_API_BASE_URL,
                contentBaseURL: window["AppUtils"]?.getConfig()?.documentation?.contentBaseURL
                    ?? DocumentationConstants.DEFAULT_CONTENT_BASE_URL,
                githubOptions: {
                    branch: window["AppUtils"]?.getConfig()?.documentation?.githubOptions?.branch
                        ?? DocumentationConstants.DEFAULT_BRANCH
                },
                imagePrefixURL: window["AppUtils"]?.getConfig()?.documentation?.imagePrefixURL
                    ?? DocumentationConstants.DEFAULT_IMAGE_PREFIX_URL,
                provider: window["AppUtils"]?.getConfig()?.documentation?.provider
                    ?? DocumentationProviders.GITHUB,
                structureFileType: window["AppUtils"]?.getConfig()?.documentation?.structureFileType
                    ?? DocumentationStructureFileTypes.YAML,
                structureFileURL: window["AppUtils"]?.getConfig()?.documentation?.structureFileURL
                    ?? DocumentationConstants.DEFAULT_STRUCTURE_FILE_URL
            },
            extensions: window["AppUtils"]?.getConfig()?.extensions,
            idpConfigs: window["AppUtils"]?.getConfig()?.idpConfigs,
            loginCallbackUrl: window["AppUtils"]?.getConfig()?.loginCallbackURL,
            serverHost: window["AppUtils"]?.getConfig()?.serverOriginWithTenant,
            serverOrigin: window["AppUtils"]?.getConfig()?.serverOrigin,
            superTenant: window["AppUtils"]?.getConfig()?.superTenant,
            tenant: window["AppUtils"]?.getConfig()?.tenant,
            tenantPath: window["AppUtils"]?.getConfig()?.tenantPath,
            tenantPrefix: window["AppUtils"]?.getConfig()?.tenantPrefix
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
     * @param
     * @return {I18nModuleInitOptions} I18n init options.
     */
    public static generateModuleInitOptions(metaFile: MetaI18N): I18nModuleInitOptions {
        return {
            backend: {
                loadPath: (language, namespace) => generateBackendPaths(
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
                I18nConstants.EXTENSIONS_NAMESPACE
            ]
        };
    }

    /**
     * Get i18n module config.
     *
     * @param {MetaI18N} metaFile Meta file.
     *
     * @return {I18nModuleOptionsInterface} i18n config object.
     */
    public static getI18nConfig(metaFile?: MetaI18N): I18nModuleOptionsInterface {
        return {
            initOptions: this.generateModuleInitOptions(metaFile),
            langAutoDetectEnabled: window["AppUtils"]?.getConfig()?.ui.i18nConfigs.langAutoDetectEnabled
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
     * @return {ServiceResourceEndpointsInterface} Service resource endpoints as an object.
     */
    public static getServiceResourceEndpoints(): ServiceResourceEndpointsInterface {
        return {
            ...getApplicationsResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getApprovalsResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getClaimResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getCertificatesResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getIDPResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getEmailTemplatesResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getRolesResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getServerConfigurationsResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getUsersResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getUserstoreResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getScopesResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getGroupsResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getRemoteFetchConfigResourceEndpoints(this.getDeploymentConfig().serverHost),
            ...getSecretsManagementEndpoints(this.getDeploymentConfig().serverHost),
            ...getExtendedFeatureResourceEndpoints(this.getDeploymentConfig().serverHost),
            CORSOrigins: `${this.getDeploymentConfig().serverHost}/api/server/v1/cors/origins`,
            // TODO: Remove this endpoint and use ID token to get the details
            me: `${this.getDeploymentConfig().serverHost}/scim2/Me`,
            saml2Meta: `${this.getDeploymentConfig().serverHost}/identity/metadata/saml2`,
            wellKnown: `${this.getDeploymentConfig().serverHost}/oauth2/token/.well-known/openid-configuration`
        };
    }

    /**
     * Get UI config.
     *
     * @return {UIConfigInterface} UI config object.
     */
    public static getUIConfig(): UIConfigInterface {
        return {
            announcements: window["AppUtils"]?.getConfig()?.ui.announcements,
            appCopyright: window["AppUtils"]?.getConfig()?.ui.appCopyright
                .replace("${copyright}", "\u00A9")
                .replace("${year}", new Date().getFullYear()),
            appName: window["AppUtils"]?.getConfig()?.ui.appName,
            appTitle: window["AppUtils"]?.getConfig()?.ui.appTitle,
            applicationTemplateLoadingStrategy: window["AppUtils"]?.getConfig()?.ui.applicationTemplateLoadingStrategy,
            features: window["AppUtils"]?.getConfig()?.ui.features,
            gravatarConfig: window["AppUtils"]?.getConfig()?.ui.gravatarConfig,
            hiddenAuthenticators: window["AppUtils"]?.getConfig()?.ui.hiddenAuthenticators,
            hiddenUserStores: window["AppUtils"]?.getConfig()?.ui.hiddenUserStores,
            i18nConfigs: window["AppUtils"]?.getConfig()?.ui.i18nConfigs,
            identityProviderTemplateLoadingStrategy:
                window["AppUtils"]?.getConfig()?.ui.identityProviderTemplateLoadingStrategy,
            identityProviderTemplates: window["AppUtils"]?.getConfig()?.ui.identityProviderTemplates,
            isClientSecretHashEnabled: window["AppUtils"]?.getConfig()?.ui.isClientSecretHashEnabled,
            isCookieConsentBannerEnabled: window["AppUtils"]?.getConfig()?.ui.isCookieConsentBannerEnabled,
            isDefaultDialectEditingEnabled: window["AppUtils"]?.getConfig()?.ui.isDefaultDialectEditingEnabled,
            isDialectAddingEnabled: window["AppUtils"]?.getConfig()?.ui.isDialectAddingEnabled,
            isGroupAndRoleSeparationEnabled: window["AppUtils"]?.getConfig()?.ui.isGroupAndRoleSeparationEnabled,
            isHeaderAvatarLabelAllowed: window["AppUtils"]?.getConfig()?.ui.isHeaderAvatarLabelAllowed,
            isLeftNavigationCategorized: window["AppUtils"]?.getConfig()?.ui.isLeftNavigationCategorized,
            isRequestPathAuthenticationEnabled: window["AppUtils"]?.getConfig()?.ui.isRequestPathAuthenticationEnabled,
            isSignatureValidationCertificateAliasEnabled: window["AppUtils"]?.getConfig()?.ui
                .isSignatureValidationCertificateAliasEnabled,
            listAllAttributeDialects: window["AppUtils"]?.getConfig()?.ui.listAllAttributeDialects,
            privacyPolicyConfigs: window["AppUtils"]?.getConfig()?.ui.privacyPolicyConfigs,
            productName: window["AppUtils"]?.getConfig()?.ui.productName,
            productVersionConfig: window["AppUtils"]?.getConfig()?.ui.productVersionConfig,
            selfAppIdentifier: window["AppUtils"]?.getConfig()?.ui.selfAppIdentifier,
            showAppSwitchButton: window["AppUtils"]?.getConfig()?.ui.showAppSwitchButton,
            systemAppsIdentifiers: window["AppUtils"]?.getConfig()?.ui.systemAppsIdentifiers,
            theme: window["AppUtils"]?.getConfig()?.ui.theme
        };
    }
}
