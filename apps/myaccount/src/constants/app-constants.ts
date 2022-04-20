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

import { AppThemeConfigInterface } from "@wso2is/core/models";
import { StringUtils } from "@wso2is/core/utils";

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
     * Get the tenant path. ex: `/t/wso2.com`.
     *
     * @return {string}
     */
    public static getTenantPath(): string {
        return window["AppUtils"].getConfig().tenantPath;
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
     * Get the tenant. ex: `abc.com`.
     *
     * @return {string}
     */
    public static getTenant(): string {
        return window["AppUtils"].getConfig().tenant;
    }

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
        .set("PROFILEINFO_MOBILE_VERIFICATION", "profileInfo.mobileVerification")
        .set("SECURITY_CHANGE_PASSWORD", "security.changePassword")
        .set("SECURITY_CREATE_PASSWORD", "security.createPassword")
        .set("SECURITY_ACCOUNT_RECOVERY", "security.accountRecovery")
        .set("SECURITY_ACCOUNT_RECOVERY_CHALLENGE_QUESTIONS", "security.accountRecovery.challengeQuestions")
        .set("SECURITY_ACCOUNT_RECOVERY_EMAIL_RECOVERY", "security.accountRecovery.emailRecovery")
        .set("SECURITY_MFA", "security.mfa")
        .set("SECURITY_MFA_SMS", "security.mfa.sms")
        .set("SECURITY_MFA_FIDO", "security.mfa.fido")
        .set("SECURITY_MFA_TOTP", "security.mfa.totp")
        .set("SECURITY_MFA_BACKUP_CODE", "security.mfa.backupCode")
        .set("SECURITY_ACTIVE_SESSIONS", "security.activeSessions")
        .set("SECURITY_CONSENTS", "security.manageConsents")
        .set("SECURITY_LOGIN_VERIFY_DATA", "security.loginVerifyData")
        .set("SECURITY_LOGIN_VERIFY_DATA_TYPINGDNA", "security.loginVerifyData.typingDNA");

    /**
     * Get all the app paths as a map.
     *
     * @return {Map<string, string>}
     */
    public static getPaths(): Map<string, string> {

        return new Map<string, string>()
            .set("ACCESS_DENIED_ERROR", `${ this.getMainViewBasePath() }/access-denied-error`)
            .set("APPLICATIONS", `${ this.getMainViewBasePath() }/applications`)
            .set("LOGIN", window[ "AppUtils" ].getConfig().routes.login)
            .set("LOGOUT", window[ "AppUtils" ].getConfig().routes.logout)
            .set("LOGIN_ERROR", `${ this.getMainViewBasePath() }/login-error`)
            .set("OVERVIEW", `${ this.getMainViewBasePath() }/overview`)
            .set("PAGE_NOT_FOUND", `${ this.getMainViewBasePath() }/404`)
            .set("PROFILE_INFO", `${ this.getMainViewBasePath() }/personal-info`)
            .set("PERSONAL_INFO", `${ this.getMainViewBasePath() }/personal-info`)
            .set("SECURITY", `${ this.getMainViewBasePath() }/security`)
            .set("PRIVACY", `${ this.getMainViewBasePath() }/privacy`)
            .set("ROOT", "/")
            .set("UNAUTHORIZED", `${ this.getMainViewBasePath() }/unauthorized`)
            .set("STORING_DATA_DISABLED",`${ this.getMainViewBasePath() }/storing_data_disabled`);
    }

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
