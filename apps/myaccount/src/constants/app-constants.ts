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

/**
 * Class containing app constants.
 */
export class ApplicationConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Set of keys used to enable/disable features.
     * @constant
     * @type {Map<string, string>}
     * @default
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("OVERVIEW_ACCOUNT_STATUS", "overview.accountStatus")
        .set("OVERVIEW_ACCOUNT_ACTIVITY", "overview.accountActivity")
        .set("OVERVIEW_ACCOUNT_SECURITY", "overview.accountSecurity")
        .set("OVERVIEW_CONSENTS", "overview.consents")
        .set("PROFILEINFO_PROFILE", "profileInfo.profile")
        .set("PROFILEINFO_LINKED_ACCOUNTS", "profileInfo.linkedAccounts")
        .set("PROFILEINFO_EXTERNAL_LOGINS", "profileInfo.externalLogins")
        .set("PROFILEINFO_EXPORT_PROFILE", "profileInfo.exportProfile")
        .set("SECURITY_CHANGE_PASSWORD", "security.changePassword")
        .set("SECURITY_ACCOUNT_RECOVERY", "security.accountRecovery")
        .set("SECURITY_ACCOUNT_RECOVERY_CHALLENGE_QUESTIONS", "security.accountRecovery.challengeQuestions")
        .set("SECURITY_ACCOUNT_RECOVERY_EMAIL_RECOVERY", "security.accountRecovery.emailRecovery")
        .set("SECURITY_MFA", "security.mfa")
        .set("SECURITY_MFA_SMS", "security.mfa.sms")
        .set("SECURITY_MFA_FIDO", "security.mfa.fido")
        .set("SECURITY_MFA_TOTP", "security.mfa.totp")
        .set("SECURITY_ACTIVE_SESSIONS", "security.activeSessions")
        .set("SECURITY_CONSENTS", "security.manageConsents")
        .set("OPERATIONS", "operations");

    /**
     * Application Paths.
     * @constant
     * @type {Map<string, string>}
     */
    public static readonly PATHS: Map<string, string> = new Map<string, string>()
        .set("404", "/404")
        .set("PROFILE_INFO", "/personal-info")
        .set("UNAUTHORIZED", "/unauthorized");

    /**
     * Name of the app config file for the portal.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly APP_CONFIG_FILE_NAME: string = "app.config.json";

    /**
     * Application settings key in local storage.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly APPLICATION_SETTINGS_STORAGE_KEY: string = "application_settings";

    /**
     * Primary user store identifier.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly PRIMARY_USER_STORE_IDENTIFIER: string = "PRIMARY";

    /**
     * Path to the login error page.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly LOGIN_ERROR_PAGE_PATH: string = "/login-error";

    /**
     * Path to the 404 page.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly PAGE_NOT_FOUND_PATH: string = "/404";

    /**
     * Path to the applications page.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly APPLICATIONS_PAGE_PATH: string = "/applications";

    /**
     * Portal SP description.
     * Should be same as the description defined in AppPortalConstants.java in components/common.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly PORTAL_SP_DESCRIPTION: string = "This is the my account application.";

    /**
     * Error description when the user selects no in the logout prompt
     * @constant
     * @type {string}
     * @default
     */
    public static readonly USER_DENIED_LOGOUT_REQUEST: string = "End User denied the logout request";

    /**
     * Error description when the user denies consent to the app
     * @constant
     * @type {string}
     * @default
     */
    public static readonly USER_DENIED_CONSENT: string = "User denied the consent";

    /**
     * Key of the time at which an auth error occurred in the session storage
     * @constant
     * @type {string}
     * @default
     */
    public static readonly AUTH_ERROR_TIME: string = "authErrorTime";
}
