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
     * App routing paths.
     * @constant
     * @type {Map<string, string>}
     */
    public static readonly PATHS: Map<string, string> = new Map<string, string>()
        .set("CERTIFICATES", "/certificates")
        .set("CLAIM_DIALECTS", "/claim-dialects")
        .set("EMAIL_TEMPLATES", "/email-templates")
        .set("EMAIL_TEMPLATE", "/email-templates/:typeId")
        .set("EMAIL_TEMPLATE_ADD", "/email-templates/:typeId/add-template")
        .set("EMAIL_TEMPLATE_LOCALE_ADD", "/email-templates/:typeId/add-template/:templateId")
        .set("EXTERNAL_DIALECT_EDIT", "/edit-external-dialect/:id")
        .set("GROUPS", "/groups")
        .set("GROUP_EDIT", "/groups/:id")
        .set("LOCAL_CLAIMS", "/local-claims")
        .set("LOCAL_CLAIMS_EDIT", "/edit-local-claims/:id")
        .set("OVERVIEW", "/overview")
        .set("PAGE_NOT_FOUND", "/404")
        .set("PRIVACY", "/privacy")
        .set("ROLES", "/roles")
        .set("ROLE_EDIT", "/roles/:id")
        .set("SERVER_CONFIGS", "/server-configurations/:id")
        .set("UNAUTHORIZED", "/unauthorized")
        .set("USERS", "/users")
        .set("USER_EDIT", "/users/:id")
        .set("USERSTORES", "/user-stores")
        .set("USERSTORES_EDIT", "/edit-user-store/:id")
        .set("USERSTORE_TEMPLATES", "/userstore-templates");

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
