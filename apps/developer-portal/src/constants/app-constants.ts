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
     * Application Paths.
     * @constant
     * @type {Map<string, string>}
     */
    public static readonly PATHS: Map<string, string> = new Map<string, string>()
        .set("APPLICATIONS", "/applications")
        .set("APPLICATION_TEMPLATES", "/applications/templates")
        .set("APPLICATION_EDIT", "/applications/:id")
        .set("CUSTOMIZE", "/customize")
        .set("IDP", "/identity-providers")
        .set("IDP_TEMPLATES", "/identity-providers/templates")
        .set("IDP_EDIT", "/identity-providers/:id")
        .set("OIDC_SCOPES", "/oidc-scopes")
        .set("OIDC_SCOPES_EDIT", "/oidc-scopes/:id")
        .set("OVERVIEW", "/overview")
        .set("PAGE_NOT_FOUND", "/404")
        .set("PRIVACY", "/privacy")
        .set("UNAUTHORIZED", "/unauthorized")
        .set("REMOTE_REPO_CONFIG", "/remote-repository-config")
        .set("REMOTE_REPO_CONFIG_EDIT", "/remote-repository-config/:id");

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
