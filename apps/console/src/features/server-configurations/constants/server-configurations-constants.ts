/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
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

export class ServerConfigurationsConstants {

    /**
	 * Private constructor to avoid object instantiation from outside the class.
	 *
	 */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
	 * UUID of the identity governance account management policies category.
	 *
	 */
	public static readonly IDENTITY_GOVERNANCE_ACCOUNT_MANAGEMENT_POLICIES_ID: string =
    "QWNjb3VudCBNYW5hZ2VtZW50IFBvbGljaWVz";

	/**
	 * Regex matcher to identify if the connector is deprecated.
	 *
	 */
	public static readonly DEPRECATION_MATCHER: string = "[Deprecated]";

	/**
	 * UUID of the identity governance self sign up connector.
	 *
	 */
	public static readonly SELF_SIGN_UP_CONNECTOR_ID: string = "c2VsZi1zaWduLXVw";

	/**
	 * UUID of the identity governance light user registration connector.
	 *
	 */
	public static readonly LITE_USER_REGISTRATION_CONNECTOR_ID: string = "bGl0ZS11c2VyLXNpZ24tdXA";

	/**
	 * UUID of the identity governance account recovery connector.
	 *
	 */
	public static readonly ACCOUNT_RECOVERY_CONNECTOR_ID: string = "YWNjb3VudC1yZWNvdmVyeQ";

	/**
	 * UUID of the identity governance password reset connector.
	 *
	 */
	public static readonly PASSWORD_RESET_CONNECTOR_ID: string = "YWRtaW4tZm9yY2VkLXBhc3N3b3JkLXJlc2V0";

	/**
	 * UUID of the identity governance consent information connector.
	 *
	 */
	public static readonly CONSENT_INFO_CONNECTOR_ID: string = "cGlpLWNvbnRyb2xsZXI";

	/**
	 * UUID of the identity governance analytics engine connector.
	 *
	 */
	public static readonly ANALYTICS_ENGINE_CONNECTOR_ID: string = "YW5hbHl0aWNzLWVuZ2luZQ";

	/**
	 * UUID of the identity governance user claim update connector.
	 *
	 */
	public static readonly USER_CLAIM_UPDATE_CONNECTOR_ID: string = "dXNlci1jbGFpbS11cGRhdGU";

	/**
	 * UUID of the identity governance login policies category.
	 *
	 */

	public static readonly IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID: string = "TG9naW4gUG9saWNpZXM";

	/**
	 * UUID of the identity governance account locking connector.
	 *
	 */
	public static readonly ACCOUNT_LOCKING_CONNECTOR_ID: string = "YWNjb3VudC5sb2NrLmhhbmRsZXI";

	/**
	 * UUID of the identity governance account disabling connector.
	 *
	 */
	public static readonly ACCOUNT_DISABLING_CONNECTOR_ID: string = "YWNjb3VudC5kaXNhYmxlLmhhbmRsZXI";

	/**
	 * UUID of the identity governance captcha for sso login connector.
	 *
	 */
	public static readonly CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID: string = "c3NvLmxvZ2luLnJlY2FwdGNoYQ";

	/**
	 * UUID of the identity governance idle account suspend connector.
	 *
	 */
	public static readonly IDLE_ACCOUNT_SUSPEND_CONNECTOR_ID: string = "c3VzcGVuc2lvbi5ub3RpZmljYXRpb24";

	/**
	 * UUID of the identity governance account disable connector.
	 *
	 */
	public static readonly ACCOUNT_DISABLE_CONNECTOR_ID: string = "YWNjb3VudC5kaXNhYmxlLmhhbmRsZXI";

	/**
	 * UUID of the identity governance login policies category.
	 *
	 */
	public static readonly IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID: string = "UGFzc3dvcmQgUG9saWNpZXM";

	/**
	 * UUID of the identity governance captcha for sso login connector.
	 *
	 */
	public static readonly PASSWORD_HISTORY_CONNECTOR_ID: string = "cGFzc3dvcmRIaXN0b3J5";

	/**
	 * UUID of the identity governance captcha for sso login connector.
	 *
	 */
	public static readonly PASSWORD_POLICY_CONNECTOR_ID: string = "cGFzc3dvcmRQb2xpY3k";

    /**
     * Multi Attribute Login Claim List pattern regex.
     *
     */
    public static readonly MULTI_ATTRIBUTE_CLAIM_LIST_REGEX_PATTERN: RegExp =
        new RegExp("^(?:[a-zA-Z0-9:./]+,)+[a-zA-Z0-9:./]+$");

	/**
	 * UUID of the user on boarding connector.
	 */
	public static readonly USER_ONBOARDING_CONNECTOR_ID: string = "VXNlciBPbmJvYXJkaW5n";

	/**
	 * UUID of the email verification category.
	 */
	public static readonly USER_EMAIL_VERIFICATION_CONNECTOR_ID: string = "dXNlci1lbWFpbC12ZXJpZmljYXRpb24";

	/**
	 * UUID of the Other Sttings governance connector category.
	 */
	public static readonly OTHER_SETTINGS_CONNECTOR_CATEGORY_ID: string = "T3RoZXIgU2V0dGluZ3M";

	/**
	 * UUID of the Login Attempt Security governance connector category.
	 */
	public static readonly LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID: string = "TG9naW4gQXR0ZW1wdHMgU2VjdXJpdHk";

	/**
	 * UUID of the Account Management governance connector category.
	 */
	public static readonly ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID: string = "QWNjb3VudCBNYW5hZ2VtZW50";

	/**
	 * UUID of the Multi-Factor Authenticators governance connector category.
	 */
	public static readonly MFA_CONNECTOR_CATEGORY_ID: string = "TXVsdGkgRmFjdG9yIEF1dGhlbnRpY2F0b3Jz";

    /**
     * UUID of the WSO2 Analytics Engine governance connector category.
     */
    public static readonly WSO2_ANALYTICS_ENGINE_CONNECTOR_CATEGORY_ID: string = "YW5hbHl0aWNzLWVuZ2luZQ";

    /**
     * User email verification API Keyword constants.
     */
    public static readonly EMAIL_VERIFICATION_ENABLED: string = "EmailVerification.Enable";

	/**
	 * Self registration API Keyword constants.
	 */
	public static readonly SELF_REGISTRATION_ENABLE: string = "SelfRegistration.Enable";
	public static readonly ACCOUNT_LOCK_ON_CREATION: string = "SelfRegistration.LockOnCreation";
	public static readonly SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED: string =
		"SelfRegistration.Notification.InternallyManage";

	public static readonly RE_CAPTCHA: string = "SelfRegistration.ReCaptcha";
	public static readonly VERIFICATION_CODE_EXPIRY_TIME: string = "SelfRegistration.VerificationCode.ExpiryTime";
	public static readonly SMS_OTP_EXPIRY_TIME: string = "SelfRegistration.VerificationCode.SMSOTP.ExpiryTime";
	public static readonly CALLBACK_REGEX: string = "SelfRegistration.CallbackRegex";

	/**
	 * Account recovery API Keyword constants.
	 */
	public static readonly USERNAME_RECOVERY_ENABLE: string = "Recovery.Notification.Username.Enable";
	public static readonly USERNAME_RECOVERY_RE_CAPTCHA: string = "Recovery.ReCaptcha.Username.Enable";
	public static readonly PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE: string =
		"Recovery.Notification.Password.Enable";

	public static readonly PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA: string =
		"Recovery.ReCaptcha.Password.Enable";

	public static readonly PASSWORD_RECOVERY_QUESTION_BASED_ENABLE: string = "Recovery.Question.Password.Enable";
	public static readonly PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS: string =
		"Recovery.Question.Password.MinAnswers";

	public static readonly PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE: string =
		"Recovery.Question.Password.ReCaptcha.Enable";

	public static readonly RE_CAPTCHA_MAX_FAILED_ATTEMPTS: string =
		"Recovery.Question.Password.ReCaptcha.MaxFailedAttempts";

	public static readonly ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED: string =
		"Recovery.Notification.InternallyManage";

	public static readonly NOTIFY_RECOVERY_START: string = "Recovery.Question.Password.NotifyStart";
	public static readonly NOTIFY_SUCCESS: string = "Recovery.NotifySuccess";
	public static readonly RECOVERY_LINK_EXPIRY_TIME: string = "Recovery.ExpiryTime";
	public static readonly RECOVERY_SMS_EXPIRY_TIME: string = "Recovery.Notification.Password.ExpiryTime.smsOtp";
	public static readonly RECOVERY_CALLBACK_REGEX: string = "Recovery.CallbackRegex";
	public static readonly PASSWORD_RECOVERY_QUESTION_FORCED_ENABLE: string =
		"Recovery.Question.Password.Forced.Enable";

	/**
	 * Login policies - account locking API Keyword constants.
	 */
	public static readonly ACCOUNT_LOCK_ENABLE: string = "account.lock.handler.lock.on.max.failed.attempts.enable";
	public static readonly MAX_FAILED_LOGIN_ATTEMPTS_TO_ACCOUNT_LOCK: string =
		"account.lock.handler.On.Failure.Max.Attempts";

	public static readonly ACCOUNT_LOCK_TIME: string = "account.lock.handler.Time";
	public static readonly ACCOUNT_LOCK_TIME_INCREMENT_FACTOR: string = "account.lock.handler.login.fail.timeout.ratio";
	public static readonly ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT: string =
		"account.lock.handler.notification.manageInternally";

	public static readonly NOTIFY_USER_ON_ACCOUNT_LOCK_INCREMENT: string =
		"account.lock.handler.notification.notifyOnLockIncrement";

	/**
	 * Login policies - account disabling API Keyword constants.
	 */
	public static readonly ACCOUNT_DISABLING_ENABLE: string = "account.disable.handler.enable";
	public static readonly ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT: string =
		"account.disable.handler.notification.manageInternally";

	/**
	 * Login policies - captcha for sso login API Keyword constants.
	 */
	public static readonly RE_CAPTCHA_ALWAYS_ENABLE: string = "sso.login.recaptcha.enable.always";
	public static readonly RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE: string =
		"sso.login.recaptcha.enable";

	public static readonly MAX_FAILED_LOGIN_ATTEMPTS_TO_RE_CAPTCHA: string =
		"sso.login.recaptcha.on.max.failed.attempts";

	/**
	 * Login policies - API Keyword constants.
	 */
	public static readonly PASSWORD_HISTORY_ENABLE: string = "passwordHistory.enable";
	public static readonly PASSWORD_HISTORY_COUNT: string = "passwordHistory.count";
	public static readonly PASSWORD_POLICY_ENABLE: string = "passwordPolicy.enable";
	public static readonly PASSWORD_POLICY_MIN_LENGTH: string = "passwordPolicy.min.length";
	public static readonly PASSWORD_POLICY_MAX_LENGTH: string = "passwordPolicy.max.length";
	public static readonly PASSWORD_POLICY_PATTERN: string = "passwordPolicy.pattern";
	public static readonly PASSWORD_POLICY_ERROR_MESSAGE: string = "passwordPolicy.errorMsg";

	/**
	 * Real Configurations constants.
	 */
	public static readonly HOME_REALM_IDENTIFIER: string = "homeRealmIdentifiers";
	public static readonly IDLE_SESSION_TIMEOUT_PERIOD: string = "idleSessionTimeoutPeriod";
	public static readonly REMEMBER_ME_PERIOD: string = "rememberMePeriod";

	// API Errors.
	public static readonly CONFIGS_FETCH_REQUEST_INVALID_STATUS_CODE_ERROR: string = "Received an invalid status " +
		"code while retrieving the configurations.";

	public static readonly CONFIGS_FETCH_REQUEST_ERROR: string = "An error occurred while retrieving the " +
		"configurations.";

	public static readonly CONFIGS_UPDATE_REQUEST_INVALID_STATUS_CODE_ERROR: string = "Received an invalid status " +
		"code while updating the configurations.";

	public static readonly CONFIGS_UPDATE_REQUEST_ERROR: string = "An error occurred while updating the " +
		"configurations.";

	// Idle account suspend names.
	public static readonly ALLOWED_IDLE_TIME_SPAN_IN_DAYS: string = "suspension.notification.account.disable.delay";
	public static readonly ALERT_SENDING_TIME_PERIODS_IN_DAYS: string = "suspension.notification.delays";

	/**
   * Account Management Connector Constants.
   */
	public static readonly ACCOUNT_MANAGEMENT_CATEGORY_ID: string = "QWNjb3VudCBNYW5hZ2VtZW50";
	public static readonly ADMIN_FORCE_PASSWORD_RESET_CONNECTOR_ID: string = "YWRtaW4tZm9yY2VkLXBhc3N3b3JkLXJlc2V0";
	public static readonly RECOVERY_LINK_PASSWORD_RESET: string = "Recovery.AdminPasswordReset.RecoveryLink";
	public static readonly OTP_PASSWORD_RESET: string = "Recovery.AdminPasswordReset.OTP";
	public static readonly OFFLINE_PASSWORD_RESET: string = "Recovery.AdminPasswordReset.Offline";
	public static readonly ADMIN_FORCED_PASSWORD_RESET_EXPIRY_TIME: string = "Recovery.AdminPasswordReset.ExpiryTime";

    public static readonly MULTI_ATTRIBUTE_CLAIM_LIST: string = "account-multiattributelogin-handler-allowedattributes";

	/**
	 * Extensions Constants.
	 */
	public  static  readonly ALL: string = "all";
}
