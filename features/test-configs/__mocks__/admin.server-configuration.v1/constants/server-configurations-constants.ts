/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

/* eslint-disable sort-keys */

export const ServerConfigurationsConstants: any = {
    IDENTITY_GOVERNANCE_ACCOUNT_MANAGEMENT_POLICIES_ID: "QWNjb3VudCBNYW5hZ2VtZW50IFBvbGljaWVz",

    DEPRECATION_MATCHER: "[Deprecated]",

    SELF_SIGN_UP_CONNECTOR_ID: "c2VsZi1zaWduLXVw",

    LITE_USER_REGISTRATION_CONNECTOR_ID: "bGl0ZS11c2VyLXNpZ24tdXA",

    ACCOUNT_RECOVERY_CONNECTOR_ID: "YWNjb3VudC1yZWNvdmVyeQ",

    PASSWORD_RESET_CONNECTOR_ID: "YWRtaW4tZm9yY2VkLXBhc3N3b3JkLXJlc2V0",

    CONSENT_INFO_CONNECTOR_ID: "cGlpLWNvbnRyb2xsZXI",

    ANALYTICS_ENGINE_CONNECTOR_ID: "ZWxhc3RpYy1hbmFseXRpY3MtZW5naW5l",

    USER_CLAIM_UPDATE_CONNECTOR_ID: "dXNlci1jbGFpbS11cGRhdGU",

    IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID: "TG9naW4gUG9saWNpZXM",

    ACCOUNT_LOCKING_CONNECTOR_ID: "YWNjb3VudC5sb2NrLmhhbmRsZXI",

    ACCOUNT_DISABLING_CONNECTOR_ID: "YWNjb3VudC5kaXNhYmxlLmhhbmRsZXI",

    CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID: "c3NvLmxvZ2luLnJlY2FwdGNoYQ",

    IDLE_ACCOUNT_SUSPEND_CONNECTOR_ID: "c3VzcGVuc2lvbi5ub3RpZmljYXRpb24",

    ACCOUNT_DISABLE_CONNECTOR_ID: "YWNjb3VudC5kaXNhYmxlLmhhbmRsZXI",

    IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID: "UGFzc3dvcmQgUG9saWNpZXM",

    PASSWORD_HISTORY_CONNECTOR_ID: "cGFzc3dvcmRIaXN0b3J5",

    PASSWORD_EXPIRY_CONNECTOR_ID: "cGFzc3dvcmRFeHBpcnk",

    PASSWORD_POLICY_CONNECTOR_ID: "cGFzc3dvcmRQb2xpY3k",

    MULTI_ATTRIBUTE_CLAIM_LIST_REGEX_PATTERN: new RegExp("^(?:[a-zA-Z0-9:./]+,)*[a-zA-Z0-9:./]+$"),

    USER_ONBOARDING_CONNECTOR_ID: "VXNlciBPbmJvYXJkaW5n",

    USER_EMAIL_VERIFICATION_CONNECTOR_ID: "dXNlci1lbWFpbC12ZXJpZmljYXRpb24",

    OTHER_SETTINGS_CONNECTOR_CATEGORY_ID: "T3RoZXIgU2V0dGluZ3M",

    ELK_ANALYTICS_CONNECTOR_ID: "ZWxhc3RpYy1hbmFseXRpY3MtZW5naW5l",

    LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID: "TG9naW4gQXR0ZW1wdHMgU2VjdXJpdHk",

    ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID: "QWNjb3VudCBNYW5hZ2VtZW50",

    MFA_CONNECTOR_CATEGORY_ID: "TXVsdGkgRmFjdG9yIEF1dGhlbnRpY2F0b3Jz",

    WSO2_ANALYTICS_ENGINE_CONNECTOR_CATEGORY_ID: "YW5hbHl0aWNzLWVuZ2luZQ",

    EMAIL_VERIFICATION_ENABLED: "EmailVerification.Enable",

    SELF_REGISTRATION_ENABLE: "SelfRegistration.Enable",

    ACCOUNT_LOCK_ON_CREATION: "SelfRegistration.LockOnCreation",

    SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED: "SelfRegistration.Notification.InternallyManage",

    ACCOUNT_CONFIRMATION: "SelfRegistration.SendConfirmationOnCreation",

    RE_CAPTCHA: "SelfRegistration.ReCaptcha",

    VERIFICATION_CODE_EXPIRY_TIME: "SelfRegistration.VerificationCode.ExpiryTime",

    SMS_OTP_EXPIRY_TIME: "SelfRegistration.VerificationCode.SMSOTP.ExpiryTime",

    CALLBACK_REGEX: "SelfRegistration.CallbackRegex",

    USERNAME_RECOVERY_ENABLE: "Recovery.Notification.Username.Enable",

    USERNAME_RECOVERY_RE_CAPTCHA: "Recovery.ReCaptcha.Username.Enable",

    PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE: "Recovery.Notification.Password.Enable",

    PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA: "Recovery.ReCaptcha.Password.Enable",

    PASSWORD_RECOVERY_QUESTION_BASED_ENABLE: "Recovery.Question.Password.Enable",

    PASSWORD_RECOVERY_QUESTION_BASED_MIN_ANSWERS: "Recovery.Question.Password.MinAnswers",

    PASSWORD_RECOVERY_QUESTION_BASED_RE_CAPTCHA_ENABLE: "Recovery.Question.Password.ReCaptcha.Enable",

    RE_CAPTCHA_MAX_FAILED_ATTEMPTS: "Recovery.Question.Password.ReCaptcha.MaxFailedAttempts",

    ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED: "Recovery.Notification.InternallyManage",

    NOTIFY_RECOVERY_START: "Recovery.Question.Password.NotifyStart",

    NOTIFY_SUCCESS: "Recovery.NotifySuccess",

    RECOVERY_LINK_EXPIRY_TIME: "Recovery.ExpiryTime",

    RECOVERY_SMS_EXPIRY_TIME: "Recovery.Notification.Password.ExpiryTime.smsOtp",

    RECOVERY_CALLBACK_REGEX: "Recovery.CallbackRegex",

    PASSWORD_RECOVERY_QUESTION_FORCED_ENABLE: "Recovery.Question.Password.Forced.Enable",

    ACCOUNT_LOCK_ENABLE: "account.lock.handler.lock.on.max.failed.attempts.enable",

    ANALYTICS_ENGINE_ENABLE: "adaptive_authentication.analytics.basicAuth.enabled",

    MAX_FAILED_LOGIN_ATTEMPTS_TO_ACCOUNT_LOCK: "account.lock.handler.On.Failure.Max.Attempts",

    ACCOUNT_LOCK_TIME: "account.lock.handler.Time",

    ACCOUNT_LOCK_TIME_INCREMENT_FACTOR: "account.lock.handler.login.fail.timeout.ratio",

    ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT: "account.lock.handler.notification.manageInternally",

    NOTIFY_USER_ON_ACCOUNT_LOCK_INCREMENT: "account.lock.handler.notification.notifyOnLockIncrement",

    ACCOUNT_DISABLING_ENABLE: "account.disable.handler.enable",

    ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT:
                    "account.disable.handler.notification.manageInternally",

    RE_CAPTCHA_ALWAYS_ENABLE: "sso.login.recaptcha.enable.always",

    RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE: "sso.login.recaptcha.enable",

    MAX_FAILED_LOGIN_ATTEMPTS_TO_RE_CAPTCHA: "sso.login.recaptcha.on.max.failed.attempts",

    PASSWORD_EXPIRY_ENABLE: "passwordExpiry.enablePasswordExpiry",

    PASSWORD_EXPIRY_TIME: "passwordExpiry.passwordExpiryInDays",

    PASSWORD_HISTORY_ENABLE: "passwordHistory.enable",

    PASSWORD_HISTORY_COUNT: "passwordHistory.count",

    PASSWORD_POLICY_ENABLE: "passwordPolicy.enable",

    PASSWORD_POLICY_MIN_LENGTH: "passwordPolicy.min.length",

    PASSWORD_POLICY_MAX_LENGTH: "passwordPolicy.max.length",

    PASSWORD_POLICY_PATTERN: "passwordPolicy.pattern",

    PASSWORD_POLICY_ERROR_MESSAGE: "passwordPolicy.errorMsg",

    HOME_REALM_IDENTIFIER: "homeRealmIdentifiers",

    IDLE_SESSION_TIMEOUT_PERIOD: "idleSessionTimeoutPeriod",

    REMEMBER_ME_PERIOD: "rememberMePeriod",

    CONFIGS_FETCH_REQUEST_INVALID_STATUS_CODE_ERROR:
                    "Received an invalid status code while retrieving the configurations.",

    CONFIGS_FETCH_REQUEST_ERROR: "An error occurred while retrieving the configurations.",

    CONFIGS_UPDATE_REQUEST_INVALID_STATUS_CODE_ERROR:
                    "Received an invalid status code while updating the configurations.",

    CONFIGS_UPDATE_REQUEST_ERROR: "An error occurred while updating the configurations.",

    ADMIN_ADVISORY_BANNER_CONFIGS_UPDATE_REQUEST_ERROR:
                    "An error occurred while updating the admin advisory banner configurations.",

    ADMIN_ADVISORY_BANNER_CONFIGS_INVALID_INPUT_ERROR: "An invalid input value in the request.",

    ALLOWED_IDLE_TIME_SPAN_IN_DAYS: "suspension.notification.account.disable.delay",

    ALERT_SENDING_TIME_PERIODS_IN_DAYS: "suspension.notification.delays",

    ACCOUNT_MANAGEMENT_CATEGORY_ID: "QWNjb3VudCBNYW5hZ2VtZW50",

    ADMIN_FORCE_PASSWORD_RESET_CONNECTOR_ID: "YWRtaW4tZm9yY2VkLXBhc3N3b3JkLXJlc2V0",

    RECOVERY_LINK_PASSWORD_RESET: "Recovery.AdminPasswordReset.RecoveryLink",

    OTP_PASSWORD_RESET: "Recovery.AdminPasswordReset.OTP",

    OFFLINE_PASSWORD_RESET: "Recovery.AdminPasswordReset.Offline",

    ADMIN_FORCED_PASSWORD_RESET_EXPIRY_TIME: "Recovery.AdminPasswordReset.ExpiryTime",

    MULTI_ATTRIBUTE_CLAIM_LIST: "account-multiattributelogin-handler-allowedattributes",

    ANALYTICS_HOST: "adaptive_authentication.elastic.receiver",

    ANALYTICS_BASIC_AUTH_ENABLE: "adaptive_authentication.elastic.basicAuth.enabled",

    ANALYTICS_BASIC_AUTH_USERNAME: "adaptive_authentication.elastic.basicAuth.username",

    ANALYTICS_BASIC_AUTH_PASSWORD: "__secret__adaptive_authentication.elastic.basicAuth.password",

    ANALYTICS_HTTP_CONNECTION_TIMEOUT: "adaptive_authentication.elastic.HTTPConnectionTimeout",

    ANALYTICS_HTTP_READ_TIMEOUT: "adaptive_authentication.elastic.HTTPReadTimeout",

    ANALYTICS_HTTP_CONNECTION_REQUEST_TIMEOUT:
                    "adaptive_authentication.elastic.HTTPConnectionRequestTimeout",

    ANALYTICS_HOSTNAME_VERIFICATION: "adaptive_authentication.elastic.hostnameVerfier",

    ALL: "all",

    SAML2_SSO_CONNECTOR_ID: "saml2-sso",

    SESSION_MANAGEMENT_CONNECTOR_ID: "session-management",

    WS_FEDERATION_CONNECTOR_ID: "ws-fed",

    SSO_SETTINGS_CATEGORY_ID: "sso-settings",

    LOGIN_SECURITY_SETTINGS_CATEGORY_ID: "login-security",

    PROVISIONING_SETTINGS_CATEGORY_ID: "provider-settings",

    OUTBOUND_PROVISIONING_SETTINGS_CONNECTOR_ID: "outbound-provisioning-settings",

    MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID: "bXVsdGlhdHRyaWJ1dGUubG9naW4uaGFuZGxlcg",

    MULTI_ATTRIBUTE_LOGIN_ENABLE: "account.multiattributelogin.handler.enable",

    ALTERNATIVE_LOGIN_IDENTIFIER: "alternative-login-identifier",

    USERNAME_VALIDATION: "username-validation",

    PASSWORD_RECOVERY: "password-recovery",

    USERNAME_RECOVERY: "username-recovery",

    ORGANIZATION_SELF_SERVICE_CONNECTOR_ID: "b3JnYW5pemF0aW9uLXNlbGYtc2VydmljZQ",

    ORGANIZATION_SELF_SERVICE_ENABLE: "Organization.SelfService.Enable",

    ASK_PASSWORD_CONNECTOR_ID: "dXNlci1lbWFpbC12ZXJpZmljYXRpb24",

    ASK_PASSWORD_ENABLE: "EmailVerification.Enable",

    ADMIN_FORCED_PASSWORD_RESET: "YWRtaW4tZm9yY2VkLXBhc3N3b3JkLXJlc2V0",

    PRIVATE_KEY_JWT_CLIENT_AUTH: "private-key-jwt-configuration",

    LOGIN_ATTEMPT_SECURITY: "login-attempt-security",

    ORGANIZATION_SETTINGS_CATEGORY_ID: "organization-settings",

    EMAIL_DOMAIN_DISCOVERY: "ZW1haWwtZG9tYWluLWRpc2NvdmVyeQ=="
};
