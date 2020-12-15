/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
            appBaseName: window["AppUtils"].getConfig().appBaseWithTenant,
            appBaseNameWithoutTenant: window["AppUtils"].getConfig().appBase,
            appHomePath: window["AppUtils"].getConfig().routes.home,
            appLoginPath: window["AppUtils"].getConfig().routes.login,
            appLogoutPath: window["AppUtils"].getConfig().routes.logout,
            clientHost: window["AppUtils"].getConfig().clientOriginWithTenant,
            clientID: window["AppUtils"].getConfig().clientID,
            clientOrigin: window["AppUtils"].getConfig().clientOrigin,
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
     * Get the the list of service resource endpoints.
     *
     * @return {ServiceResourceEndpointsInterface} Service resource endpoints as an object.
     */
    public static getServiceResourceEndpoints(): ServiceResourceEndpointsInterface {
        return {
            applications: `${this.getDeploymentConfig().serverHost}/api/users/v1/me/applications`,
            associations: `${this.getDeploymentConfig().serverHost}/api/users/v1/me/associations`,
            authorize: `${this.getDeploymentConfig().serverHost}/oauth2/authorize`,
            challengeAnswers: `${this.getDeploymentConfig().serverHost}/api/users/v1/me/challenge-answers`,
            challenges: `${this.getDeploymentConfig().serverHost}/api/users/v1/me/challenges`,
            federatedAssociations: `${this.getDeploymentConfig().serverHost}/api/users/v1/me/federated-associations`,
            fidoEnd: `${this.getDeploymentConfig().serverHost}/api/users/v2/me/webauthn/finish-registration`,
            fidoMetaData: `${this.getDeploymentConfig().serverHost}/api/users/v2/me/webauthn`,
            fidoStart: `${this.getDeploymentConfig().serverHost}/api/users/v2/me/webauthn/start-registration`,
            fidoStartUsernameless: `${
                this.getDeploymentConfig().serverHost
            }/api/users/v2/me/webauthn/start-usernameless-registration`,
            isReadOnlyUser:`${
                this.getDeploymentConfig().serverHost
            }/scim2/Me?attributes=urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.isReadOnlyUser`,
            issuer: `${this.getDeploymentConfig().serverHost}/oauth2/token`,
            jwks: `${this.getDeploymentConfig().serverHost}/oauth2/jwks`,
            logout: `${this.getDeploymentConfig().serverHost}/oidc/logout`,
            me: `${this.getDeploymentConfig().serverHost}/scim2/Me`,
            profileSchemas: `${this.getDeploymentConfig().serverHost}/scim2/Schemas`,
            revoke: `${this.getDeploymentConfig().serverHost}/oauth2/revoke`,
            sessions: `${this.getDeploymentConfig().serverHost}/api/users/v1/me/sessions`,
            smsOtpResend: `${this.getDeploymentConfig().serverHost}/api/identity/user/v1.0/me/resend-code`,
            smsOtpValidate: `${this.getDeploymentConfig().serverHost}/api/identity/user/v1.0/me/validate-code`,
            token: `${this.getDeploymentConfig().serverHost}/oauth2/token`,
            totp: `${this.getDeploymentConfig().serverHost}/api/users/v1/me/totp`,
            totpSecret: `${this.getDeploymentConfig().serverHost}/api/users/v1/me/totp/secret`,
            user: `${this.getDeploymentConfig().serverHost}/api/identity/user/v1.0/me`,
            wellKnown: `${this.getDeploymentConfig().serverHost}/oauth2/oidcdiscovery/.well-known/openid-configuration`,
            consentManagement: {
                consent: {
                    addConsent: `${this.getDeploymentConfig().serverHost}/api/identity/consent-mgt/v1.0/consents`,
                    consentReceipt: `${this.getDeploymentConfig().serverHost}/api/identity/consent-mgt/v1.0/consents/receipts`,
                    listAllConsents: `${this.getDeploymentConfig().serverHost}/api/identity/consent-mgt/v1.0/consents`
                },
                purpose: {
                    getPurpose: `${this.getDeploymentConfig().serverHost}/api/identity/consent-mgt/v1.0/consents/purposes`,
                    list: `${this.getDeploymentConfig().serverHost}/api/identity/consent-mgt/v1.0/consents/purposes`
                }
            },
            config: `${this.getDeploymentConfig().serverHost}/api/server/v1/configs`
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
            appName: window["AppUtils"].getConfig().ui.appName,
            authenticatorApp: window["AppUtils"].getConfig().ui.authenticatorApp,
            copyrightText: `${window["AppUtils"].getConfig().ui.appCopyright} \u00A9 ${new Date().getFullYear()}`,
            features: window["AppUtils"].getConfig().ui.features,
            productName: window["AppUtils"].getConfig().ui.productName,
            productVersionConfig: window["AppUtils"].getConfig().ui.productVersionConfig,
            theme: window["AppUtils"].getConfig().ui.theme,
            titleText: window["AppUtils"].getConfig().appTitle
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
}
