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

export class ServerConfigurationsConstants {

	/**
	 * Private constructor to avoid object instantiation from outside the class.
	 *
	 * @hideconstructor
	 */
	/* eslint-disable @typescript-eslint/no-empty-function */
	private constructor() { }

	/**
	 * UUID of the identity governance account management policies category.
	 *
	 * @constant
	 * @type {string}
	 */
	public static readonly IDENTITY_GOVERNANCE_ACCOUNT_MANAGEMENT_POLICIES_ID: string =
		"QWNjb3VudCBNYW5hZ2VtZW50IFBvbGljaWVz";

	/**
	 * UUID of the identity governance self sign up connector.
	 *
	 * @constant
	 * @type {string}
	 */
	public static readonly SELF_SIGN_UP_CONNECTOR_ID: string = "c2VsZi1zaWduLXVw";

	/**
	 * UUID of the identity governance account recovery connector.
	 *
	 * @constant
	 * @type {string}
	 */
	public static readonly ACCOUNT_RECOVERY_CONNECTOR_ID: string = "YWNjb3VudC1yZWNvdmVyeQ";

	/**
	 * UUID of the identity governance login policies category.
	 *
	 * @constant
	 * @type {string}
	 */

	public static readonly IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID: string = "TG9naW4gUG9saWNpZXM";

	/**
	 * UUID of the identity governance account locking connector.
	 *
	 * @constant
	 * @type {string}
	 */
	public static readonly ACCOUNT_LOCKING_CONNECTOR_ID: string = "YWNjb3VudC5sb2NrLmhhbmRsZXI";

	/**
	 * UUID of the identity governance account disabling connector.
	 *
	 * @constant
	 * @type {string}
	 */
	public static readonly ACCOUNT_DISABLING_CONNECTOR_ID: string = "YWNjb3VudC5kaXNhYmxlLmhhbmRsZXI";

	/**
	 * UUID of the identity governance captcha for sso login connector.
	 *
	 * @constant
	 * @type {string}
	 */
	public static readonly CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID: string = "c3NvLmxvZ2luLnJlY2FwdGNoYQ";

	/**
	 * Self registration API Keywords constants.
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
	 * Account recovery API Keywords constants.
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
	 * Login policies - account locking API Keywords constants.
	 */
	public static readonly ACCOUNT_LOCK_ENABLE: string = "account.lock.handler.enable";
	public static readonly MAX_FAILED_LOGIN_ATTEMPTS_TO_ACCOUNT_LOCK: string =
		"account.lock.handler.On.Failure.Max.Attempts";
	public static readonly ACCOUNT_LOCK_TIME: string = "account.lock.handler.Time";
	public static readonly ACCOUNT_LOCK_TIME_INCREMENT_FACTOR: string = "account.lock.handler.login.fail.timeout.ratio";
	public static readonly ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT: string =
		"account.lock.handler.notification.manageInternally";

	/**
	 * Login policies - account disabling API Keywords constants.
	 */
	public static readonly ACCOUNT_DISABLING_ENABLE: string = "account.disable.handler.enable";
	public static readonly ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT: string =
		"account.disable.handler.notification.manageInternally";

	/**
	 * Login policies - captcha for sso login API Keywords constants.
	 */
	public static readonly RE_CAPTCHA_ALWAYS_ENABLE: string = "sso.login.recaptcha.enable.always";
	public static readonly RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE: string =
		"sso.login.recaptcha.enable";
	public static readonly MAX_FAILED_LOGIN_ATTEMPTS_TO_RE_CAPTCHA: string =
		"sso.login.recaptcha.on.max.failed.attempts";
}
