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
import { I18nModuleOptionsInterface } from "@wso2is/i18n";
import { getApplicationsResourceEndpoints } from "../../applications";
import { getCertificatesResourceEndpoints } from "../../certificates";
import { getClaimResourceEndpoints } from "../../claims";
import { getEmailTemplatesResourceEndpoints } from "../../email-templates";
import { getGroupsResourceEndpoints } from "../../groups";
import { getIDPResourceEndpoints } from "../../identity-providers";
import { getScopesResourceEndpoints } from "../../oidc-scopes";
import { getRemoteFetchConfigResourceEndpoints } from "../../remote-repository-configuration";
import { getRolesResourceEndpoints } from "../../roles";
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
            accountApp: window["AppUtils"].getConfig().accountApp,
            adminApp: window["AppUtils"].getConfig().adminApp,
            appBaseName: window["AppUtils"].getConfig().appBaseWithTenant,
            appBaseNameWithoutTenant: window["AppUtils"].getConfig().appBase,
            appHomePath: window["AppUtils"].getConfig().routes.home,
            appLoginPath: window["AppUtils"].getConfig().routes.login,
            appLogoutPath: window["AppUtils"].getConfig().routes.logout,
            clientHost: window["AppUtils"].getConfig().clientOriginWithTenant,
            clientID: window["AppUtils"].getConfig().clientID,
            clientOrigin: window["AppUtils"].getConfig().clientOrigin,
            developerApp: window["AppUtils"].getConfig().developerApp,
            documentation: {
                baseURL: window["AppUtils"].getConfig().documentation?.baseURL
                    ?? DocumentationConstants.GITHUB_API_BASE_URL,
                contentBaseURL: window["AppUtils"].getConfig().documentation?.contentBaseURL
                    ?? DocumentationConstants.DEFAULT_CONTENT_BASE_URL,
                githubOptions: {
                    branch: window["AppUtils"].getConfig().documentation?.githubOptions?.branch
                        ?? DocumentationConstants.DEFAULT_BRANCH
                },
                imagePrefixURL: window["AppUtils"].getConfig().documentation?.imagePrefixURL
                    ?? DocumentationConstants.DEFAULT_IMAGE_PREFIX_URL,
                provider: window["AppUtils"].getConfig().documentation?.provider
                    ?? DocumentationProviders.GITHUB,
                structureFileType: window["AppUtils"].getConfig().documentation?.structureFileType
                    ?? DocumentationStructureFileTypes.YAML,
                structureFileURL: window["AppUtils"].getConfig().documentation?.structureFileURL
                    ?? DocumentationConstants.DEFAULT_STRUCTURE_FILE_URL
            },
            idpConfigs: window["AppUtils"].getConfig().idpConfigs,
            loginCallbackUrl: window["AppUtils"].getConfig().loginCallbackURL,
            productVersion: window["AppUtils"].getConfig().productVersion,
            serverHost: window["AppUtils"].getConfig().serverOriginWithTenant,
            serverOrigin: window["AppUtils"].getConfig().serverOrigin,
            tenant: window["AppUtils"].getConfig().tenant,
            tenantPath: window["AppUtils"].getConfig().tenantPath
        };
    }

    /**
     * Get i18n module config.
     *
     * @return {I18nModuleOptionsInterface} i18n config object.
     */
    public static getI18nConfig(): I18nModuleOptionsInterface {
        return {
            initOptions: I18nConstants.MODULE_INIT_OPTIONS,
            langAutoDetectEnabled: I18nConstants.LANG_AUTO_DETECT_ENABLED,
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
            CORSOrigins: `${this.getDeploymentConfig().serverHost}/api/server/v1/cors/origins`,
            documentationContent: this.getDeploymentConfig().documentation.contentBaseURL,
            documentationStructure: this.getDeploymentConfig().documentation.structureFileURL,
            // TODO: Remove this endpoint and use ID token to get the details
            me: `${this.getDeploymentConfig().serverHost}/scim2/Me`,
            saml2Meta: `${this.getDeploymentConfig().serverHost}/identity/metadata/saml2`,
            wellKnown: `${this.getDeploymentConfig().serverHost}/oauth2/oidcdiscovery/.well-known/openid-configuration`
        };
    }

    /**
     * Get UI config.
     *
     * @return {UIConfigInterface} UI config object.
     */
    public static getUIConfig(): UIConfigInterface {
        return {
            announcements: window["AppUtils"].getConfig().ui.announcements,
            appCopyright: `${window["AppUtils"].getConfig().ui.appCopyright} \u00A9 ${ new Date().getFullYear() }`,
            appName: window["AppUtils"].getConfig().ui.appName,
            applicationTemplateLoadingStrategy: window["AppUtils"].getConfig().ui.applicationTemplateLoadingStrategy,
            appTitle: window["AppUtils"].getConfig().ui.appTitle,
            features: window["AppUtils"].getConfig().ui.features,
            gravatarConfig: window["AppUtils"].getConfig().ui.gravatarConfig,
            isClientSecretHashEnabled: window["AppUtils"].getConfig().ui.isClientSecretHashEnabled,
            isGroupAndRoleSeparationEnabled: window["AppUtils"].getConfig().ui.isGroupAndRoleSeparationEnabled,
            productName: window["AppUtils"].getConfig().ui.productName,
            productVersionConfig: window["AppUtils"].getConfig().ui.productVersionConfig,
            selfAppIdentifier: window["AppUtils"].getConfig().ui.selfAppIdentifier,
            systemAppsIdentifiers: window["AppUtils"].getConfig().ui.systemAppsIdentifiers,
            theme: window["AppUtils"].getConfig().ui.theme
        };
    }
}
