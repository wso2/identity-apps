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

import { I18nModuleOptionsInterface } from "@wso2is/i18n";
import { I18nConstants, ServerConfigurationsConstants } from "../constants";
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
            appBaseName: window["AppUtils"].getConfig().appBaseWithTenant,
            appBaseNameWithoutTenant: window["AppUtils"].getConfig().appBase,
            appHomePath: window["AppUtils"].getConfig().routes.home,
            appLoginPath: window["AppUtils"].getConfig().routes.login,
            applicationName: window["AppUtils"].getConfig().ui.appName,
            clientHost: window["AppUtils"].getConfig().clientOriginWithTenant,
            clientID: window["AppUtils"].getConfig().clientID,
            clientOrigin: window["AppUtils"].getConfig().clientOrigin,
            developerApp: window["AppUtils"].getConfig().developerApp,
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
            accountDisabling: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID
                }/connectors/${ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID}`,
            accountLocking: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID
                }/connectors/${ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID}`,
            accountRecovery: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_ACCOUNT_MANAGEMENT_POLICIES_ID
                }/connectors/${ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID}`,
            bulk: `${this.getDeploymentConfig().serverHost}/scim2/Bulk`,
            captchaForSSOLogin: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID
                }/connectors/${ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID}`,
            certificates: `${this.getDeploymentConfig().serverHost}/api/server/v1/keystores/certs`,
            claims: `${this.getDeploymentConfig().serverHost}/api/server/v1/claim-dialects`,
            clientCertificates: `${this.getDeploymentConfig().serverHost}/api/server/v1/keystores/client-certs`,
            emailTemplateType: `${this.getDeploymentConfig().serverHost}/api/server/v1/email/template-types`,
            externalClaims:`${this.getDeploymentConfig().serverHost}/api/server/v1/claim-dialects/{}/claims`,
            governanceConnectorCategories: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance`,
            groups: `${this.getDeploymentConfig().serverHost}/scim2/Groups`,
            localClaims: `${this.getDeploymentConfig().serverHost}/api/server/v1/claim-dialects/local/claims`,
            loginPolicies: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID
                }`,
            // TODO: Remove this endpoint and use ID token to get the details
            me: `${this.getDeploymentConfig().serverHost}/scim2/Me`,
            passwordHistory: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID
                }/connectors/${ServerConfigurationsConstants.PASSWORD_HISTORY_CONNECTOR_ID}`,
            passwordPolicies: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID
                }`,
            passwordPolicy: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID
                }/connectors/${ServerConfigurationsConstants.PASSWORD_POLICY_CONNECTOR_ID}`,
            permission: `${this.getDeploymentConfig().serverHost}/api/server/v1/permission-management/permissions`,
            publicCertificates: `${this.getDeploymentConfig().serverHost}/api/server/v1/keystores/certs/public`,
            requestPathAuthenticators:
                `${this.getDeploymentConfig().serverHost}/api/server/v1/configs/authenticators?type=REQUEST_PATH`,
            selfSignUp: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_ACCOUNT_MANAGEMENT_POLICIES_ID
                }/connectors/${ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID}`,
            serverConfigurations: `${this.getDeploymentConfig().serverHost}/api/server/v1/configs`,
            userStores: `${this.getDeploymentConfig().serverHost}/api/server/v1/userstores`,
            users: `${this.getDeploymentConfig().serverHost}/scim2/Users`
        };
    }

    /**
     * Get UI config.
     *
     * @return {UIConfigInterface} UI config object.
     */
    public static getUIConfig(): UIConfigInterface {
        return {
            appCopyright: `${window["AppUtils"].getConfig().ui.appCopyright} \u00A9 ${ new Date().getFullYear() }`,
            appTitle: window["AppUtils"].getConfig().ui.appTitle,
            features: window["AppUtils"].getConfig().ui.features,
            gravatarConfig: window["AppUtils"].getConfig().ui.gravatarConfig
        };
    }
}
