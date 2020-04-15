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

import { RuntimeConfigInterface, ServiceResourceEndpointsInterface } from "../models";
import { I18nConstants } from "../constants";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";

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

    private static RUNTIME_CONFIG = window["runConfig"];

    /**
     * Get the application runtime config.
     *
     * @return {RuntimeConfigInterface} Runtime configurations object./
     */
    public static getRuntimeConfig(): RuntimeConfigInterface {
        return {
            appBaseName: (this.RUNTIME_CONFIG) ? (this.RUNTIME_CONFIG.appBaseName || APP_BASENAME) : APP_BASENAME,
            appBaseNameWithoutTenant: (this.RUNTIME_CONFIG)
                ? (this.RUNTIME_CONFIG.appBaseNameWithoutTenant || APP_BASENAME)
                : APP_BASENAME,
            appHomePath: (this.RUNTIME_CONFIG) ? (this.RUNTIME_CONFIG.appHomePath || APP_HOME_PATH) : APP_HOME_PATH,
            appLoginPath: (this.RUNTIME_CONFIG)
                ? (this.RUNTIME_CONFIG.appLoginPath || APP_LOGIN_PATH)
                : APP_LOGIN_PATH,
            applicationName: (this.RUNTIME_CONFIG) ? (this.RUNTIME_CONFIG.applicationName || APP_NAME) : APP_NAME,
            clientHost: (this.RUNTIME_CONFIG)
                ? (this.RUNTIME_CONFIG.clientHost || CLIENT_HOST_DEFAULT)
                : CLIENT_HOST_DEFAULT,
            clientID: (this.RUNTIME_CONFIG) ? (this.RUNTIME_CONFIG.clientID || CLIENT_ID_DEFAULT) : CLIENT_ID_DEFAULT,
            clientOrigin: (this.RUNTIME_CONFIG)
                ? (this.RUNTIME_CONFIG.clientOrigin || CLIENT_ORIGIN_DEFAULT)
                : CLIENT_ORIGIN_DEFAULT,
            copyrightText: (this.RUNTIME_CONFIG)
                ? (this.RUNTIME_CONFIG.copyrightText || COPYRIGHT_TEXT_DEFAULT)
                : COPYRIGHT_TEXT_DEFAULT,
            debug: (this.RUNTIME_CONFIG) ? (this.RUNTIME_CONFIG.debug || DEBUG_MODE) : DEBUG_MODE,
            doNotDeleteApplications: (this.RUNTIME_CONFIG) ? (this.RUNTIME_CONFIG.doNotDeleteApplications || []) : [],
            doNotDeleteIdentityProviders: (this.RUNTIME_CONFIG)
                ? (this.RUNTIME_CONFIG.doNotDeleteIdentityProviders || [])
                : [],
            i18nModuleOptions: {
                initOptions: this.RUNTIME_CONFIG?.i18nModuleOptions?.initOptions
                    ? this.RUNTIME_CONFIG.i18nModuleOptions.initOptions
                    : I18nConstants.MODULE_INIT_OPTIONS,
                langAutoDetectEnabled: this.RUNTIME_CONFIG?.i18nModuleOptions?.langAutoDetectEnabled
                    ? this.RUNTIME_CONFIG.i18nModuleOptions.langAutoDetectEnabled
                    : I18nConstants.LANG_AUTO_DETECT_ENABLED,
                namespaceDirectories: this.RUNTIME_CONFIG?.i18nModuleOptions?.namespaceDirectories
                    ? this.RUNTIME_CONFIG?.i18nModuleOptions?.namespaceDirectories
                    : I18nConstants.BUNDLE_NAMESPACE_DIRECTORIES,
                overrideOptions: this.RUNTIME_CONFIG?.i18nModuleOptions?.overrideOptions
                    ? this.RUNTIME_CONFIG.i18nModuleOptions.overrideOptions
                    : I18nConstants.INIT_OPTIONS_OVERRIDE,
                resourcePath: this.RUNTIME_CONFIG?.i18nModuleOptions?.resourcePath
                    ? this.RUNTIME_CONFIG.i18nModuleOptions.resourcePath
                    : I18N_RESOURCE_PATH,
                xhrBackendPluginEnabled: this.RUNTIME_CONFIG?.i18nModuleOptions?.xhrBackendPluginEnabled
                    ? this.RUNTIME_CONFIG.i18nModuleOptions.xhrBackendPluginEnabled
                    : I18nConstants.XHR_BACKEND_PLUGIN_ENABLED
            },
            loginCallbackUrl: (this.RUNTIME_CONFIG)
                ? (
                    (this.RUNTIME_CONFIG.clientHost || CLIENT_HOST_DEFAULT) +
                    (this.RUNTIME_CONFIG.loginCallbackUrl || LOGIN_CALLBACK_URL)
                )
                : LOGIN_CALLBACK_URL,
            serverHost: (this.RUNTIME_CONFIG)
                ? (this.RUNTIME_CONFIG.serverHost || SERVER_HOST_DEFAULT)
                : SERVER_HOST_DEFAULT,
            serverOrigin: (this.RUNTIME_CONFIG)
                ? (this.RUNTIME_CONFIG.serverOrigin || SERVER_ORIGIN_DEFAULT)
                : SERVER_ORIGIN_DEFAULT,
            tenant: (this.RUNTIME_CONFIG)
                ? (this.RUNTIME_CONFIG.tenant || TENANT_DEFAULT)
                : TENANT_DEFAULT,
            tenantPath: (this.RUNTIME_CONFIG)
                ? (this.RUNTIME_CONFIG.tenantPath || TENANT_PATH_DEFAULT)
                : TENANT_PATH_DEFAULT,
            titleText: (this.RUNTIME_CONFIG)
                ? (this.RUNTIME_CONFIG.copyrightText || TITLE_TEXT_DEFAULT)
                : TITLE_TEXT_DEFAULT,
            userPortalBaseName: (this.RUNTIME_CONFIG) ?
                (this.RUNTIME_CONFIG.userPortalBaseName || USER_PORTAL_BASENAME) : USER_PORTAL_BASENAME,
            userPortalClientHost: (this.RUNTIME_CONFIG) ?
                (this.RUNTIME_CONFIG.userPortalClientHost || USER_PORTAL_CLIENT_HOST_DEFAULT)
                : USER_PORTAL_CLIENT_HOST_DEFAULT
        };
    }

    /**
     * Get the the list of service resource endpoints.
     *
     * @return {ServiceResourceEndpointsInterface} Service resource endpoints as an object.
     */
    public static getServiceResourceEndpoints(): ServiceResourceEndpointsInterface {
        return {
            accountDisabling: `${this.getRuntimeConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID}/connectors/${
                ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID}`,
            accountLocking: `${this.getRuntimeConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID}/connectors/${
                ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID}`,
            accountRecovery: `${this.getRuntimeConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_ACCOUNT_MANAGEMENT_POLICIES_ID}/connectors/${
                ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID}`,
            applications: `${this.getRuntimeConfig().serverHost}/api/server/v1/applications`,
            associations: `${this.getRuntimeConfig().serverHost}/api/users/v1/me/associations`,
            authorize: `${this.getRuntimeConfig().serverHost}/oauth2/authorize`,
            bulk: `${this.getRuntimeConfig().serverHost}/scim2/Bulk`,
            captchaForSSOLogin: `${this.getRuntimeConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID}/connectors/${
                ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID}`,
            challengeAnswers: `${this.getRuntimeConfig().serverHost}/api/users/v1/me/challenge-answers`,
            challenges: `${this.getRuntimeConfig().serverHost}/api/users/v1/me/challenges`,
            claims: `${this.getRuntimeConfig().serverHost}/api/server/v1/claim-dialects`,
            consents: `${this.getRuntimeConfig()}/api/identity/consent-mgt/v1.0/consents`,
            externalClaims:`${this.getRuntimeConfig().serverHost}/api/server/v1/claim-dialects/{}/claims`,
            emailTemplateType: `${this.getRuntimeConfig().serverHost}/api/server/v1/email/template-types`,
            groups: `${this.getRuntimeConfig().serverHost}/scim2/Groups`,
            identityProviders: `${this.getRuntimeConfig().serverHost}/api/server/v1/identity-providers`,
            issuer: `${this.getRuntimeConfig().serverHost}/oauth2/token`,
            jwks: `${this.getRuntimeConfig().serverHost}/oauth2/jwks`,
            localClaims: `${this.getRuntimeConfig().serverHost}/api/server/v1/claim-dialects/local/claims`,
            loginPolicies: `${this.getRuntimeConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID}`,
            logout: `${this.getRuntimeConfig().serverHost}/oidc/logout`,
            // TODO: Remove this endpoint and use ID token to get the details
            me: `${this.getRuntimeConfig().serverHost}/scim2/Me`,
            passwordHistory: `${this.getRuntimeConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID}/connectors/${
                ServerConfigurationsConstants.PASSWORD_HISTORY_CONNECTOR_ID}`,
            passwordPolicies: `${this.getRuntimeConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID}`,
            passwordPolicy: `${this.getRuntimeConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID}/connectors/${
                ServerConfigurationsConstants.PASSWORD_POLICY_CONNECTOR_ID}`,
            permission: `${this.getRuntimeConfig().serverHost}/api/server/v1/permission-management/permissions`,
            profileSchemas: `${this.getRuntimeConfig().serverHost}/scim2/Schemas`,
            revoke: `${this.getRuntimeConfig().serverHost}/oauth2/revoke`,
            selfSignUp: `${this.getRuntimeConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_ACCOUNT_MANAGEMENT_POLICIES_ID}/connectors/${
                ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID}`,
            sessions: `${this.getRuntimeConfig().serverHost}/api/users/v1/me/sessions`,
            token: `${this.getRuntimeConfig().serverHost}/oauth2/token`,
            user: `${this.getRuntimeConfig().serverHost}/api/identity/user/v1.0/me`,
            userStores: `${this.getRuntimeConfig().serverHost}/api/server/v1/userstores`,
            users: `${this.getRuntimeConfig().serverHost}/scim2/Users`,
            wellKnown: `${this.getRuntimeConfig().serverHost}/oauth2/oidcdiscovery/.well-known/openid-configuration`
        }
    }
}
