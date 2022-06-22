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

import { AppThemeConfigInterface } from "@wso2is/core/models";
import { StringUtils } from "@wso2is/core/utils";
import { identityProviderConfig } from "../../../extensions/configs";

/**
 * Class containing app constants.
 */
export class AppConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Get the admin view base path.
     *
     * @return {string}
     */
    public static getAdminViewBasePath(): string {
        return window["AppUtils"].getConfig().adminApp.basePath;
    }

    /**
     * Get the admin view home path.
     *
     * @return {string}
     */
    public static getAdminViewHomePath(): string {
        return window["AppUtils"].getConfig().adminApp.path;
    }

    /**
     * Get the full screen view base path.
     *
     * @return {string}
     */
    public static getFullScreenViewBasePath(): string {
        return this.getMainViewBasePath() + "/fullscreen";
    }

    /**
     * Get the developer view base path.
     *
     * @return {string}
     */
    public static getDeveloperViewBasePath(): string {
        return window["AppUtils"].getConfig().developerApp.basePath;
    }

    /**
     * Get the developer view home path.
     *
     * @return {string}
     */
    public static getDeveloperViewHomePath(): string {
        return window["AppUtils"].getConfig().developerApp.path;
    }

    /**
     * Get the main view base path.
     * If `this.getTenantQualifiedAppBasePath()` returns with just "/",
     * return empty string.
     *
     * @return {string}
     */
    public static getMainViewBasePath(): string {
        return this.getTenantQualifiedAppBasePath() !== "/"
            ? this.getTenantQualifiedAppBasePath()
            : "";
    }

    /**
     * Get tenant qualified app base name. ex: `t/<BASENAME>`
     *
     * @return {string}
     */
    public static getTenantQualifiedAppBasename(): string {
        return window["AppUtils"].getConfig().appBaseWithTenant;
    }

    /**
     * Get tenant qualified app base path. ex: `/t/<BASENAME>`
     *
     * @return {string}
     */
    public static getTenantQualifiedAppBasePath(): string {
        return "/" + StringUtils.removeSlashesFromPath(this.getTenantQualifiedAppBasename());
    }

    /**
     * Get app base name. ex: `<BASENAME>`
     *
     * @return {string}
     */
    public static getAppBasename(): string {
        return window["AppUtils"].getConfig().appBase;
    }

    /**
     * Get tenant qualified app base path. ex: `/<BASENAME>`
     *
     * @return {string}
     */
    public static getAppBasePath(): string {
        return "/" + StringUtils.removeSlashesFromPath(this.getAppBasename());
    }

    /**
     * Get the app home path.
     *
     * @return {string}
     */
    public static getAppHomePath(): string {
        return window["AppUtils"].getConfig().routes.home;
    }

    /**
     * Get the app login path.
     *
     * @return {string}
     */
    public static getAppLoginPath(): string {
        return window[ "AppUtils" ].getConfig().routes.login;
    }

    /**
     * Get the app login path.
     *
     * @return {string}
     */
    public static getAppLogoutPath(): string {
        return window[ "AppUtils" ].getConfig().routes.logout;
    }

    /**
     * Get the app Client ID.
     *
     * @return {string}
     */
    public static getClientID(): string {
        return window["AppUtils"].getConfig().clientID;
    }

    /**
     * Get app theme configs.
     *
     * @return {AppThemeConfigInterface}
     */
    public static getAppTheme(): AppThemeConfigInterface {
        return window["AppUtils"].getConfig().ui?.theme;
    }

    /**
     * Get the My Account path.
     *
     * @return {string}
     */
    public static getMyAccountPath(): string {

        return window[ "AppUtils" ].getConfig().accountApp.path;
    }

    /**
     * Get the tenant path. ex: `/t/wso2.com`.
     *
     * @return {string}
     */
    public static getTenantPath(): string {
        return window["AppUtils"].getConfig().tenantPath;
    }

    /**
     * Get the tenant. ex: `abc.com`.
     *
     * @return {string}
     */
    public static getTenant(): string {
        return window["AppUtils"].getConfig().tenant;
    }

    /**
     * Get the super tenant. ex: `carbon.super`.
     *
     * @return {string}
     */
    public static getSuperTenant(): string {
        return window["AppUtils"].getConfig().superTenant;
    }

    /**
     * Get the client origin. ex: `https://localhost:9443`.
     *
     * @return {string}
     */
    public static getClientOrigin(): string {
        return window["AppUtils"].getConfig().clientOrigin;
    }

    /**
     * Get the client origin with tenant. ex: `https://localhost:9443/t/wso2.comn`.
     *
     * @return {string}
     */
    public static getClientOriginWithTenant(): string {
        return window["AppUtils"].getConfig().clientOriginWithTenant;
    }

    /**
     * URL param for email template add state.
     * NOTE: Not needed if the same component is not used for edit and add,
     * @type {string}
     */
    public static readonly EMAIL_TEMPLATE_ADD_URL_PARAM: string = "add-template";

    /**
     * Get all the app paths as a map.
     *
     * @return {Map<string, string>}
     */
    public static getPaths(): Map<string, string> {

        const useNewConnectionsView: boolean = identityProviderConfig?.useNewConnectionsView;

        return new Map<string, string>()
            .set("ADMIN_OVERVIEW", `${ AppConstants.getAdminViewBasePath() }/overview`)
            .set("APPLICATIONS", `${ AppConstants.getDeveloperViewBasePath() }/applications`)
            .set("APPLICATION_TEMPLATES", `${ AppConstants.getDeveloperViewBasePath() }/applications/templates`)
            .set("APPLICATION_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/applications/:id`)
            .set("APPROVALS", `${ AppConstants.getAdminViewBasePath() }/approvals`)
            .set("CERTIFICATES", `${ AppConstants.getAdminViewBasePath() }/certificates`)
            .set("CLAIM_DIALECTS", `${ AppConstants.getAdminViewBasePath() }/attributes-and-mappings`)
            .set("CONNECTIONS", `${ AppConstants.getDeveloperViewBasePath() }/connections`)
            .set("CONNECTION_TEMPLATES", `${ AppConstants.getDeveloperViewBasePath() }/connections/templates`)
            .set("CONNECTION_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/connections/:id`)
            .set("CUSTOMIZE", `${ AppConstants.getMainViewBasePath() }/customize`)
            .set("DEVELOPER_OVERVIEW", `${ AppConstants.getDeveloperViewBasePath() }/overview`)
            .set("EMAIL_TEMPLATE_TYPES", `${ AppConstants.getAdminViewBasePath() }/email-templates`)
            .set("EMAIL_TEMPLATES", `${ AppConstants.getAdminViewBasePath() }/email-templates/:templateTypeId`)
            .set("EMAIL_TEMPLATE", `${
                AppConstants.getAdminViewBasePath() }/email-templates/:templateTypeId/:templateId`)
            .set("EMAIL_TEMPLATE_ADD", `${
                AppConstants.getAdminViewBasePath() }/email-templates/:templateTypeId/${
                AppConstants.EMAIL_TEMPLATE_ADD_URL_PARAM }`)
            .set("EXTERNAL_DIALECT_EDIT", `${ AppConstants.getAdminViewBasePath() }/edit-attribute-mappings/:id`)
            .set("GROUPS", `${ AppConstants.getAdminViewBasePath() }/groups`)
            .set("GROUP_EDIT", `${ AppConstants.getAdminViewBasePath() }/groups/:id`)
            .set("IDP",
                useNewConnectionsView
                    ? `${ AppConstants.getDeveloperViewBasePath() }/connections`
                    : `${ AppConstants.getDeveloperViewBasePath() }/identity-providers`
            )
            .set("IDP_TEMPLATES",
                useNewConnectionsView
                    ? `${ AppConstants.getDeveloperViewBasePath() }/connections/templates`
                    : `${ AppConstants.getDeveloperViewBasePath() }/identity-providers/templates`
            )
            .set("IDP_EDIT",
                useNewConnectionsView
                    ?`${ AppConstants.getDeveloperViewBasePath() }/identity-providers/:id`
                    :`${ AppConstants.getDeveloperViewBasePath() }/connections/:id`
            )
            .set("LOCAL_CLAIMS", `${ AppConstants.getAdminViewBasePath() }/attributes`)
            .set("LOCAL_CLAIMS_EDIT", `${ AppConstants.getAdminViewBasePath() }/edit-attributes/:id`)
            .set("LOGIN",  window[ "AppUtils" ].getConfig().routes.login)
            .set("SCIM_MAPPING", `${ AppConstants.getAdminViewBasePath() }/attribute-mappings/scim`)
            .set("LOGOUT",  window[ "AppUtils" ].getConfig().routes.logout)
            .set("OIDC_SCOPES", `${ AppConstants.getAdminViewBasePath() }/oidc-scopes`)
            .set("OIDC_SCOPES_EDIT", `${ AppConstants.getAdminViewBasePath() }/oidc-scopes/:id`)
            .set("PAGE_NOT_FOUND", `${ AppConstants.getMainViewBasePath() }/404`)
            .set("PRIVACY", `${ AppConstants.getMainViewBasePath() }/privacy`)
            .set("REMOTE_REPO_CONFIG", `${ AppConstants.getAdminViewBasePath() }/remote-repository-config`)
            .set("ROLES", `${ AppConstants.getAdminViewBasePath() }/roles`)
            .set("ROLE_EDIT", `${ AppConstants.getAdminViewBasePath() }/roles/:id`)
            .set("ROOT", "/")
            .set("GOVERNANCE_CONNECTORS", `${AppConstants.getAdminViewBasePath()}/governance-connectors/:id`)
            .set("UNAUTHORIZED", `${AppConstants.getMainViewBasePath()}/unauthorized`)
            .set("USERS", `${AppConstants.getAdminViewBasePath()}/users`)
            .set("USER_EDIT", `${AppConstants.getAdminViewBasePath()}/users/:id`)
            .set("USERSTORES", `${AppConstants.getAdminViewBasePath()}/user-stores`)
            .set("USERSTORES_EDIT", `${AppConstants.getAdminViewBasePath()}/edit-user-store/:id`)
            .set("USERSTORE_TEMPLATES", `${AppConstants.getAdminViewBasePath()}/userstore-templates`)
            .set("STORING_DATA_DISABLED", `${AppConstants.getMainViewBasePath()}/storing_data_disabled`)
            .set("GOVERNANCE_CONNECTOR", `${AppConstants.getAdminViewBasePath()}/connector/:id`)
            .set(
                "GOVERNANCE_CONNECTOR_EDIT",
                `${AppConstants.getAdminViewBasePath()}/connector/:categoryId/:connectorId`
            )
            .set("SECRETS", `${AppConstants.getDeveloperViewBasePath()}/secrets`)
            .set("SECRET_EDIT", `${AppConstants.getDeveloperViewBasePath()}/secrets/:type/:name`)
            .set("ATTRIBUTE_MAPPINGS", `${AppConstants.getAdminViewBasePath()}/attribute-mappings/:type`)
            .set("CREATE_TENANT", `${AppConstants.getMainViewBasePath()}/create-tenant`)
            .set("ORGANIZATIONS", `${AppConstants.getAdminViewBasePath()}/organizations`)
            .set("ORGANIZATION_UPDATE", `${AppConstants.getAdminViewBasePath()}/organizations/:id`);
    }

    /**
     * Name of the app config file for the admin portal.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly APP_CONFIG_FILE_NAME: string = "app.config.json";

    /**
     * Error given by server when the user has denied consent.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly USER_DENIED_CONSENT_SERVER_ERROR = "User denied the consent";

    /**
     * Set of login errors to be used as search params to toggle unauthorized page appearance.
     * @constant
     * @type {Map<string, string>}
     * @default
     */
    public static readonly LOGIN_ERRORS: Map<string, string> = new Map<string, string>()
        .set("NO_LOGIN_PERMISSION", "no_login_permission")
        .set("ACCESS_DENIED", "access_denied")
        .set("USER_DENIED_CONSENT", "consent_denied");
}
