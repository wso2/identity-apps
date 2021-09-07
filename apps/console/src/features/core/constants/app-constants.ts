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
     * Base path for Admin features.
     * @type {string}
     */
    public static readonly ADMIN_VIEW_BASE_PATH: string = window["AppUtils"].getConfig().adminApp.basePath;

    /**
     * Base path for Developer features.
     * @type {string}
     */
    public static readonly DEVELOPER_VIEW_BASE_PATH: string = window["AppUtils"].getConfig().developerApp.basePath;

    /**
     * App routing paths.
     * @constant
     * @type {Map<string, string>}
     */
    public static readonly PATHS: Map<string, string> = new Map<string, string>()
        .set("ADMIN_OVERVIEW", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/overview`)
        .set("APPLICATIONS", `${ AppConstants.DEVELOPER_VIEW_BASE_PATH }/applications`)
        .set("APPLICATION_TEMPLATES", `${ AppConstants.DEVELOPER_VIEW_BASE_PATH }/applications/templates`)
        .set("APPLICATION_EDIT", `${ AppConstants.DEVELOPER_VIEW_BASE_PATH }/applications/:id`)
        .set("CERTIFICATES", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/certificates`)
        .set("CLAIM_DIALECTS", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/claim-dialects`)
        .set("CUSTOMIZE", "/customize")
        .set("DEVELOPER_OVERVIEW", `${ AppConstants.DEVELOPER_VIEW_BASE_PATH }/overview`)
        .set("EMAIL_TEMPLATES", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/email-templates`)
        .set("EMAIL_TEMPLATE", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/email-templates/:id`)
        .set("EMAIL_TEMPLATE_ADD", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/email-templates/:id/add-template`)
        .set("EMAIL_TEMPLATE_LOCALE_ADD", `${
            AppConstants.ADMIN_VIEW_BASE_PATH }/email-templates/:type/add-template/:id`)
        .set("EXTERNAL_DIALECT_EDIT", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/edit-external-dialect/:id`)
        .set("GROUPS", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/groups`)
        .set("GROUP_EDIT", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/groups/:id`)
        .set("IDP", `${ AppConstants.DEVELOPER_VIEW_BASE_PATH }/identity-providers`)
        .set("IDP_TEMPLATES", `${ AppConstants.DEVELOPER_VIEW_BASE_PATH }/identity-providers/templates`)
        .set("IDP_EDIT", `${ AppConstants.DEVELOPER_VIEW_BASE_PATH }/identity-providers/:id`)
        .set("LOCAL_CLAIMS", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/local-claims`)
        .set("LOCAL_CLAIMS_EDIT", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/edit-local-claims/:id`)
        .set("OIDC_SCOPES", `${ AppConstants.DEVELOPER_VIEW_BASE_PATH }/oidc-scopes`)
        .set("OIDC_SCOPES_EDIT", `${ AppConstants.DEVELOPER_VIEW_BASE_PATH }/oidc-scopes/:id`)
        .set("PAGE_NOT_FOUND", "/404")
        .set("PRIVACY", "/privacy")
        .set("REMOTE_REPO_CONFIG", `${ AppConstants.DEVELOPER_VIEW_BASE_PATH }/remote-repository-config`)
        .set("REMOTE_REPO_CONFIG_EDIT", `${ AppConstants.DEVELOPER_VIEW_BASE_PATH }/remote-repository-config/:id`)
        .set("ROLES", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/roles`)
        .set("ROLE_EDIT", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/roles/:id`)
        .set("GOVERNANCE_CONNECTORS", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/governance-connectors/:id`)
        .set("UNAUTHORIZED", "/unauthorized")
        .set("USERS", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/users`)
        .set("USER_EDIT", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/users/:id`)
        .set("ORGANISATIONS", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/organisations`)
        .set("ORGANISATION_EDIT", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/organisation/:id`)
        .set("USERSTORES", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/user-stores`)
        .set("USERSTORES_EDIT", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/edit-user-store/:id`)
        .set("USERSTORE_TEMPLATES", `${ AppConstants.ADMIN_VIEW_BASE_PATH }/userstore-templates`);

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
