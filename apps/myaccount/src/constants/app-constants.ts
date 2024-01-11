/**
 * Copyright (c) 2019-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Get the client origin. ex: `https://localhost:9443`.
     *
     * @returns The client origin.
     */
    public static getClientOrigin(): string {
        return window["AppUtils"]?.getConfig()?.clientOrigin;
    }

    /**
     * Get the main view base path.
     * If `this.getTenantQualifiedAppBasePath()` returns with just "/",
     * return empty string.
     *
     * @returns The main view base path.
     */
    public static getMainViewBasePath(): string {
        return this.getTenantQualifiedAppBasePath() !== "/"
            ? this.getTenantQualifiedAppBasePath()
            : "";
    }

    /**
     * Get tenant qualified app base name. ex: `t/<BASENAME>`
     *
     * @returns The tenant qualified app base name.
     */
    public static getTenantQualifiedAppBasename(): string {
        return window["AppUtils"].getConfig().appBaseWithTenant;
    }

    /**
     * Get tenant qualified app base path. ex: `/t/<BASENAME>`
     *
     * @returns The tenant qualified app base path.
     */
    public static getTenantQualifiedAppBasePath(): string {
        return "/" + StringUtils.removeSlashesFromPath(this.getTenantQualifiedAppBasename());
    }

    /**
     * Get app base name. ex: `<BASENAME>`
     *
     * @returns The app base name.
     */
    public static getAppBasename(): string {
        return window["AppUtils"].getConfig().appBase;
    }

    /**
     * Get tenant qualified app base path. ex: `/<BASENAME>`
     *
     * @returns The tenant qualified app base path.
     */
    public static getAppBasePath(): string {
        return "/" + StringUtils.removeSlashesFromPath(this.getAppBasename());
    }

    /**
     * Get the app home path.
     *
     * @returns The app home path.
     */
    public static getAppHomePath(): string {
        return window["AppUtils"].getConfig().routes.home;
    }

    /**
     * Get the app login path.
     *
     * @returns The app login path.
     */
    public static getAppLoginPath(): string {
        return window[ "AppUtils" ].getConfig().routes.login;
    }

    /**
     * Get the app login path.
     *
     * @returns The app login path.
     */
    public static getAppLogoutPath(): string {
        return window[ "AppUtils" ].getConfig().routes.logout;
    }

    /**
     * Get the app Client ID.
     *
     * @returns The app Client ID.
     */
    public static getClientID(): string {
        return window["AppUtils"].getConfig().clientID;
    }

    /**
     * Get app theme configs.
     *
     * @returns App theme configs.
     */
    public static getAppTheme(): AppThemeConfigInterface {
        return window["AppUtils"].getConfig().ui?.theme;
    }

    /**
     * Get the tenant path. ex: `/t/wso2.com`.
     *
     * @returns The tenant path.
     */
    public static getTenantPath(): string {
        return window["AppUtils"].getConfig().tenantPath;
    }

    /**
     * Get the super tenant. ex: `carbon.super`.
     *
     * @returns The super tenant domain.
     */
    public static getSuperTenant(): string {
        return window["AppUtils"].getConfig().superTenant;
    }

    /**
     * Get the tenant. ex: `abc.com`.
     *
     * @returns The tenant domain.
     */
    public static getTenant(): string {
        return window["AppUtils"].getConfig().tenant;
    }

    /**
     * Set of keys used to enable/disable features.
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
     * @returns App paths map.
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
     */
    public static readonly APP_CONFIG_FILE_NAME: string = "app.config.json";

    /**
     * Application settings key in local storage.
     */
    public static readonly APPLICATION_SETTINGS_STORAGE_KEY: string = "application_settings";

    /**
     * Primary user store identifier.
     */
    public static readonly PRIMARY_USER_STORE_IDENTIFIER: string = "PRIMARY";

    /**
     * Portal SP description.
     * Should be same as the description defined in AppPortalConstants.java in components/common.
     */
    public static readonly PORTAL_SP_DESCRIPTION: string = "This is the my account application.";

    /**
     * Error description when the user selects no in the logout prompt.
     */
    public static readonly USER_DENIED_LOGOUT_REQUEST: string = "End User denied the logout request";

    /**
     * Error description when the user denies consent to the app.
     */
    public static readonly USER_DENIED_CONSENT: string = "User denied the consent";

    /**
     * Key of the time at which an auth error occurred in the session storage.
     */
    public static readonly AUTH_ERROR_TIME: string = "authErrorTime";
}
