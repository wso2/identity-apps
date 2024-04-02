/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsError } from "@wso2is/core/errors";

/**
 * Class containing authenticator management constants.
 */
export class AuthenticatorManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    // Local Authenticator IDS.
    public static readonly BASIC_AUTHENTICATOR_ID: string = "QmFzaWNBdXRoZW50aWNhdG9y";
    public static readonly IDENTIFIER_FIRST_AUTHENTICATOR_ID: string = "SWRlbnRpZmllckV4ZWN1dG9y";
    public static readonly JWT_BASIC_AUTHENTICATOR_ID: string = "SldUQmFzaWNBdXRoZW50aWNhdG9y";
    public static readonly FIDO_AUTHENTICATOR_ID: string = "RklET0F1dGhlbnRpY2F0b3I";
    public static readonly SMS_OTP_AUTHENTICATOR_ID: string = "c21zLW90cC1hdXRoZW50aWNhdG9y";
    public static readonly LEGACY_SMS_OTP_AUTHENTICATOR_ID: string = "U01TT1RQ";
    public static readonly TOTP_AUTHENTICATOR_ID: string = "dG90cA";
    public static readonly ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID: string = "U2Vzc2lvbkV4ZWN1dG9y";
    public static readonly X509_CERTIFICATE_AUTHENTICATOR_ID: string = "eDUwOUNlcnRpZmljYXRlQXV0aGVudGljYXRvcg";
    public static readonly BASIC_AUTH_AUTHENTICATOR_ID: string = "QmFzaWNBdXRoUmVxdWVzdFBhdGhBdXRoZW50aWNhdG9y";
    public static readonly OAUTH_BEARER_AUTHENTICATOR_ID: string = "T0F1dGhSZXF1ZXN0UGF0aEF1dGhlbnRpY2F0b3I";
    public static readonly EMAIL_OTP_AUTHENTICATOR_ID: string = "ZW1haWwtb3RwLWF1dGhlbnRpY2F0b3I";
    public static readonly LEGACY_EMAIL_OTP_AUTHENTICATOR_ID: string = "RW1haWxPVFA";
    public static readonly BACKUP_CODE_AUTHENTICATOR_ID: string = "YmFja3VwLWNvZGUtYXV0aGVudGljYXRvcg";
    public static readonly MAGIC_LINK_AUTHENTICATOR_ID: string = "TWFnaWNMaW5rQXV0aGVudGljYXRvcg";

    public static readonly OIDC_AUTHENTICATOR_ID: string = "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I";
    public static readonly SAML_AUTHENTICATOR_ID: string = "U0FNTFNTT0F1dGhlbnRpY2F0b3I";
    public static readonly PASSIVE_STS_AUTHENTICATOR_ID: string = "UGFzc2l2ZVNUU0F1dGhlbnRpY2F0b3I";
    public static readonly ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID: string = "T3JnYW5pemF0aW9uQXV0aGVudGljYXRvcg";

    public static readonly PASSIVE_STS_AUTHENTICATOR_NAME: string = "PassiveSTSAuthenticator";
    public static readonly SAML_AUTHENTICATOR_NAME: string = "SAMLSSOAuthenticator";
    public static readonly OIDC_AUTHENTICATOR_NAME: string = "OpenIDConnectAuthenticator";
    public static readonly LEGACY_EMAIL_OTP_AUTHENTICATOR_NAME: string = "EmailOTP";
    public static readonly SMS_OTP_AUTHENTICATOR_NAME: string = "SMSOTP";
    public static readonly ORGANIZATION_SSO_AUTHENTICATOR_NAME: string = "OrganizationAuthenticator";

    // Federated Authenticators
    public static readonly IPROOV_AUTHENTICATOR_NAME: string = "IproovAuthenticator";

    // Keys for the initial values of SMS OTP Authenticator
    public static readonly AUTHENTICATOR_INIT_VALUES_SMS_OTP_EXPIRY_TIME_KEY: string = "SmsOTP_ExpiryTime";

    // Keys for the initial values of Email OTP Authenticator
    public static readonly AUTHENTICATOR_INIT_VALUES_EMAIL_OTP_EXPIRY_TIME_KEY: string = "EmailOTP_ExpiryTime";

    /**
	 * UUID of the Multi-Factor Authenticators governance connector category.
	 */
	public static readonly MFA_CONNECTOR_CATEGORY_ID: string = "TXVsdGkgRmFjdG9yIEF1dGhlbnRpY2F0b3Jz";

    /**
     * Set of internal idps which are forbidden from deleting.
     * // TODO: Remove this once validating is available from the backend level.
     */
    public static readonly DELETING_FORBIDDEN_IDPS: string[] = [];

    /**
     * Authenticator Settings Form element constraints.
     */
    public static readonly AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS: Record<string, string | number> = {
        CALLBACK_URL_MIN_LENGTH: 3,
        CLIENT_ID_MAX_LENGTH: 100,
        CLIENT_ID_MIN_LENGTH: 3,
        CLIENT_SECRET_MAX_LENGTH: 100,
        CLIENT_SECRET_MIN_LENGTH: 3,
        IDP_DESCRIPTION_MAX_LENGTH: 50,
        IDP_DESCRIPTION_MIN_LENGTH: 3,
        IDP_NAME_MAX_LENGTH: 50,
        IDP_NAME_MIN_LENGTH: 3
    };

    /**
     * General Form element constraints.
     */
    public static readonly GENERAL_FORM_CONSTRAINTS: Record<string, string | number> = {
        IMAGE_URL_MAX_LENGTH: 2048,
        IMAGE_URL_MIN_LENGTH: 3
    };

    /**
     * Email OTP Authenticator Settings Form element constraints.
     */
    public static readonly EMAIL_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS: {
        EXPIRY_TIME_MAX_LENGTH: number;
        EXPIRY_TIME_MAX_VALUE: number;
        EXPIRY_TIME_MIN_LENGTH: number;
        EXPIRY_TIME_MIN_VALUE: number;
        OTP_LENGTH_MAX_LENGTH: number;
        OTP_LENGTH_MAX_VALUE: number;
        OTP_LENGTH_MIN_LENGTH: number;
        OTP_LENGTH_MIN_VALUE: number;
    } = {

        EXPIRY_TIME_MAX_LENGTH: 10000,
        EXPIRY_TIME_MAX_VALUE: 1440,
        EXPIRY_TIME_MIN_LENGTH: 1,
        EXPIRY_TIME_MIN_VALUE: 1,
        OTP_LENGTH_MAX_LENGTH: 2,
        OTP_LENGTH_MAX_VALUE: 10,
        OTP_LENGTH_MIN_LENGTH: 1,
        OTP_LENGTH_MIN_VALUE: 4
    };

    public static readonly SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS: {
        EXPIRY_TIME_MAX_LENGTH: number;
        EXPIRY_TIME_MAX_VALUE: number;
        EXPIRY_TIME_MIN_LENGTH: number;
        EXPIRY_TIME_MIN_VALUE: number;
        OTP_LENGTH_MAX_LENGTH: number;
        OTP_LENGTH_MAX_VALUE: number;
        OTP_LENGTH_MIN_LENGTH: number;
        OTP_LENGTH_MIN_VALUE: number;
        ALLOWED_RESEND_ATTEMPT_COUNT_MIN_LENGTH: number;
        ALLOWED_RESEND_ATTEMPT_COUNT_MAX_LENGTH: number;
        ALLOWED_RESEND_ATTEMPT_COUNT_MIN_VALUE: number;
        ALLOWED_RESEND_ATTEMPT_COUNT_MAX_VALUE: number;
    } = {

        ALLOWED_RESEND_ATTEMPT_COUNT_MAX_LENGTH: 10000,
        ALLOWED_RESEND_ATTEMPT_COUNT_MAX_VALUE: 100,
        ALLOWED_RESEND_ATTEMPT_COUNT_MIN_LENGTH: 1,
        ALLOWED_RESEND_ATTEMPT_COUNT_MIN_VALUE: 0,
        EXPIRY_TIME_MAX_LENGTH: 4,
        EXPIRY_TIME_MAX_VALUE: 1440,
        EXPIRY_TIME_MIN_LENGTH: 1,
        EXPIRY_TIME_MIN_VALUE: 1,
        OTP_LENGTH_MAX_LENGTH: 2,
        OTP_LENGTH_MAX_VALUE: 10,
        OTP_LENGTH_MIN_LENGTH: 1,
        OTP_LENGTH_MIN_VALUE: 4
    };

    /**
     * Apple Authenticator Settings Form element constraints.
     */
    public static readonly APPLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS: {
        ADDITIONAL_QUERY_PARAMS_MAX_LENGTH: number,
        ADDITIONAL_QUERY_PARAMS_MIN_LENGTH: number,
        KEY_ID_MAX_LENGTH: number,
        KEY_ID_MIN_LENGTH: number,
        PRIVATE_KEY_MAX_LENGTH: number,
        PRIVATE_KEY_MIN_LENGTH: number,
        SECRET_VALIDITY_PERIOD_MAX_LENGTH: number,
        SECRET_VALIDITY_PERIOD_MIN_LENGTH: number,
        TEAM_ID_MAX_LENGTH: number,
        TEAM_ID_MIN_LENGTH: number
    } = {
        ADDITIONAL_QUERY_PARAMS_MAX_LENGTH: 1000,
        ADDITIONAL_QUERY_PARAMS_MIN_LENGTH: 0,
        KEY_ID_MAX_LENGTH: 10,
        KEY_ID_MIN_LENGTH: 10,
        PRIVATE_KEY_MAX_LENGTH: 1000,
        PRIVATE_KEY_MIN_LENGTH: 100,
        SECRET_VALIDITY_PERIOD_MAX_LENGTH: 8,
        SECRET_VALIDITY_PERIOD_MIN_LENGTH: 2,
        TEAM_ID_MAX_LENGTH: 10,
        TEAM_ID_MIN_LENGTH: 10
    };

    /**
     * Google Authenticator Settings Form element constraints.
     */
    public static readonly GOOGLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS: Record<string, number> = {
        ADDITIONAL_QUERY_PARAMS_MAX_LENGTH: 1000,
        ADDITIONAL_QUERY_PARAMS_MIN_LENGTH: 0
    };

    /**
     * Google Scope mappings.
     */
    public static readonly GOOGLE_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        OPENID: "openid",
        PROFILE: "profile"
    };

    /**
     * Google One Tap enabling request parameter
     */
    public static readonly GOOGLE_ONE_TAP_ENABLED: string = "IsGoogleOneTapEnabled";

    /**
     * Microsoft Scope mappings.
     */
    public static readonly MICROSOFT_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        OPENID: "openid",
        PROFILE: "profile"
    };

    /**
     * Scopes to request from GitHub.
     */
    public static readonly MICROSOFT_AUTHENTICATOR_REQUESTED_SCOPES: string[] = [
        AuthenticatorManagementConstants.MICROSOFT_SCOPE_DICTIONARY.OPENID,
        AuthenticatorManagementConstants.MICROSOFT_SCOPE_DICTIONARY.EMAIL,
        AuthenticatorManagementConstants.MICROSOFT_SCOPE_DICTIONARY.PROFILE
    ];

    /**
     * GitHub Scope mappings.
     */
    public static readonly GITHUB_SCOPE_DICTIONARY: Record<string, string> = {
        USER_EMAIL: "user:email",
        USER_READ: "read:user"
    };

    /**
     * Scopes to request from GitHub.
     */
    public static readonly GITHUB_AUTHENTICATOR_REQUESTED_SCOPES: string[] = [
        AuthenticatorManagementConstants.GITHUB_SCOPE_DICTIONARY.USER_EMAIL,
        AuthenticatorManagementConstants.GITHUB_SCOPE_DICTIONARY.USER_READ
    ];

    /**
     * Facebook Scope mappings.
     */
    public static readonly FACEBOOK_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        PUBLIC_PROFILE: "public_profile"
    };

    /**
     * Facebook Scope mappings.
    **/
    public static readonly FACEBOOK_PUBLIC_PROFILE_FIELD_DICTIONARY: Record<string, string> = {
        AGE_RANGE: "age_range",
        EMAIL: "email",
        FIRST_NAME: "first_name",
        GENDER: "gender",
        ID: "id",
        LAST_NAME: "last_name",
        LINK: "link",
        NAME: "name"
    };

    /**
     * Scopes to request from Facebook.
     **/
    public static readonly FACEBOOK_AUTHENTICATOR_REQUESTED_SCOPES: string[] = [
        AuthenticatorManagementConstants.FACEBOOK_SCOPE_DICTIONARY.EMAIL,
        AuthenticatorManagementConstants.FACEBOOK_SCOPE_DICTIONARY.PUBLIC_PROFILE
    ];

    /**
     * Profile fields to request from Facebook.
    **/
    public static readonly FACEBOOK_AUTHENTICATOR_REQUESTED_PROFILE_FIELDS: string[] = [
        "id",
        "name",
        "gender",
        "email",
        "first_name",
        "last_name",
        "age_range",
        "link"
    ];

    /**
     * Apple scope mappings.
     */
    public static readonly APPLE_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        NAME: "name"
    };

    /**
     * Scopes to request from Apple.
     */
    public static readonly APPLE_AUTHENTICATOR_REQUESTED_SCOPES: string[] = [
        AuthenticatorManagementConstants.APPLE_SCOPE_DICTIONARY.EMAIL,
        AuthenticatorManagementConstants.APPLE_SCOPE_DICTIONARY.NAME
    ];

    /**
     * Default Apple client secret validity period.
     */
    public static readonly APPLE_AUTHENTICATOR_CLIENT_SECRET_VALIDITY_PERIOD: string = "15777000";

    /**
     * Key of the Apple client secret regenerate attribute.
     */
    public static readonly APPLE_SECRET_REGENERATE_ATTRIBUTE_KEY: string = "RegenerateClientSecret";

    /**
     * Map of Apple authenticator secret regenerative fields.
     */
    public static readonly APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY: Record<string, string> = {
        CLIENT_ID: "ClientId",
        KEY_ID: "KeyId",
        PRIVATE_KEY: "PrivateKey",
        SECRET_VALIDITY_PERIOD: "SecretValidityPeriod",
        TEAM_ID: "TeamId"
    };

    /**
     * Secret regenerative fields of Apple authenticator.
     * Upon updating the value of any of these fields, a new client secret should be generated.
     */
    public static readonly APPLE_AUTHENTICATOR_SECRET_REGENERATIVE_FIELDS: string[] = [
        AuthenticatorManagementConstants.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.CLIENT_ID,
        AuthenticatorManagementConstants.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.KEY_ID,
        AuthenticatorManagementConstants.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.PRIVATE_KEY,
        AuthenticatorManagementConstants.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.SECRET_VALIDITY_PERIOD,
        AuthenticatorManagementConstants.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.TEAM_ID
    ];

    public static readonly SIWE_REGISTRATION_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-CON-SIWE-00001";
    public static readonly SIWE_REGISTRATION_ERROR_CODE: string = "ASG-CON-SIWE-00002";

    public static readonly SIWE_CLIENT_REGISTRATION_DOCS_URL: string = "https://docs.login.xyz/servers/" +
        "oidc-provider/hosted-oidc-provider#openid-connect-client-registration";

    // eslint-disable-next-line max-len
    public static readonly SIWE_CLIENT_REGISTRATION_CURL_COMMAND: string = "curl -X POST https://oidc.signinwithethereum.org/register -H 'Content-Type: application/json' -d '{\"redirect_uris\": [ \"${commonauth}\" ]}'";

    /**
     * SIWE Scope mappings.
     */
    public static readonly SIWE_SCOPE_DICTIONARY: Record<string, string> = {
        OPENID: "openid",
        PROFILE: "profile"
    };

    public static readonly ERROR_IN_CREATING_SMS_NOTIFICATION_SENDER: string = "An error occurred while adding SMS " +
        "Notification Sender";

    public static readonly ERROR_IN_DELETING_SMS_NOTIFICATION_SENDER: string = "An error occurred while deleting " +
        "SMS Notification Sender";

    public static readonly ERROR_IN_FETCHING_FEDERATED_AUTHENTICATOR_META_DATA: string = "Failed to get " +
        "federated authenticator meta details";

    public static ErrorMessages: {
        SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS: IdentityAppsError;
        SMS_NOTIFICATION_SENDER_DELETION_ERROR_CONNECTED_APPS: IdentityAppsError;
    } = {
        SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS: new IdentityAppsError(
            "NSM-65015",
            "Failed to delete SMS notification sender due to the existence of active subscriptions"
        ),
        SMS_NOTIFICATION_SENDER_DELETION_ERROR_CONNECTED_APPS: new IdentityAppsError(
            "NSM-60008",
            "There are applications using this connection."
        )
    }

    public static readonly DEPRECATED_SCIM1_PROVISIONING_CONNECTOR_ID: string = "c2NpbQ";
}
