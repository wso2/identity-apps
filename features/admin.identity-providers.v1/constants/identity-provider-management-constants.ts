/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { authenticatorConfig } from "@wso2is/admin.extensions.v1/configs/authenticator";

/**
 * Class containing identity provider management constants.
 * @deprecated Use the constants in the `@wso2is/admin.connections.v1` package.
 */
export class IdentityProviderManagementConstants {

    /**
     * Facebook Scope mappings.
     */
    public static readonly FACEBOOK_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        PUBLIC_PROFILE: "public_profile"
    };

    /**
     * Apple scope mappings.
     */
    public static readonly APPLE_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        NAME: "name"
    };

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
        IdentityProviderManagementConstants.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.CLIENT_ID,
        IdentityProviderManagementConstants.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.KEY_ID,
        IdentityProviderManagementConstants.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.PRIVATE_KEY,
        IdentityProviderManagementConstants.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.SECRET_VALIDITY_PERIOD,
        IdentityProviderManagementConstants.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.TEAM_ID
    ];

    /**
     * Key of the Apple client secret regenerate attribute.
     */
    public static readonly APPLE_SECRET_REGENERATE_ATTRIBUTE_KEY: string = "RegenerateClientSecret";

    public static readonly IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while fetching connection templates list.";

    public static readonly IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_ERROR: string = "An error occurred while fetching " +
        "the required connection templates list.";

    public static readonly LOCAL_AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching local authenticators.";

    public static readonly LOCAL_AUTHENTICATORS_FETCH_ERROR: string = "An error occurred while fetching the local" +
        "authenticators.";

    public static readonly AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching the authenticators.";

    public static readonly AUTHENTICATORS_FETCH_ERROR: string = "An error occurred while fetching the " +
        "authenticators.";

    public static readonly COMBINED_AUTHENTICATOR_FETCH_ERROR: string = "An error occurred while fetching the local" +
        "and federated authenticators.";

    public static readonly FIDO_AUTHENTICATOR_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while updating the Passkey connector configs.";

    public static readonly FIDO_AUTHENTICATOR_CONFIG_UPDATE_ERROR: string = "An error occurred while updating the " +
        "Passkey connector configs.";

    public static readonly FIDO_CONNECTOR_CONFIGS_NOT_CONFIGURED_ERROR_CODE: string = "CONFIGM_00017";

    public static readonly FIDO_TRUSTED_APPS_UPDATE_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while updating the Passkey trusted apps.";

    public static readonly FIDO_TRUSTED_APPS_UPDATE_ERROR: string = "An error occurred while updating the " +
        "Passkey trusted apps.";

    public static readonly FIDO_TRUSTED_APPS_SHA_SEPARATOR: string = "|";

    public static readonly SESSION_EXECUTOR_AUTHENTICATOR: string = "SessionExecutor";
    public static readonly TOTP_AUTHENTICATOR: string = "totp";
    public static readonly IPROOV_AUTHENTICATOR: string = "IproovAuthenticator";
    public static readonly EMAIL_OTP_AUTHENTICATOR: string = "email-otp-authenticator";
    public static readonly FIDO_AUTHENTICATOR: string = "FIDOAuthenticator";
    public static readonly BASIC_AUTHENTICATOR: string = "BasicAuthenticator";
    public static readonly IDENTIFIER_FIRST_AUTHENTICATOR: string = "IdentifierExecutor";
    public static readonly SMS_OTP_AUTHENTICATOR: string = authenticatorConfig?.overriddenAuthenticatorNames?.
        SMS_OTP_AUTHENTICATOR ?? "sms-otp";

    public static readonly BACKUP_CODE_AUTHENTICATOR: string = "backup-code-authenticator";
    public static readonly MAGIC_LINK_AUTHENTICATOR: string = "MagicLinkAuthenticator";

    // Known IS Predefined/Protocols authenticator IDs
    public static readonly OIDC_AUTHENTICATOR_ID: string = "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I";

    // Known Local Authenticator IDS.
    public static readonly BASIC_AUTHENTICATOR_ID: string = "QmFzaWNBdXRoZW50aWNhdG9y";
    public static readonly IDENTIFIER_FIRST_AUTHENTICATOR_ID: string = "SWRlbnRpZmllckV4ZWN1dG9y";
    public static readonly JWT_BASIC_AUTHENTICATOR_ID: string = "SldUQmFzaWNBdXRoZW50aWNhdG9y";
    public static readonly FIDO_AUTHENTICATOR_ID: string = "RklET0F1dGhlbnRpY2F0b3I";
    public static readonly SMS_OTP_AUTHENTICATOR_ID: string = authenticatorConfig?.overriddenAuthenticatorIds?.
        SMS_OTP_AUTHENTICATOR_ID ?? "U01TT1RQ";

    public static readonly TOTP_AUTHENTICATOR_ID: string = "dG90cA";
    public static readonly ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID: string = "U2Vzc2lvbkV4ZWN1dG9y";
    public static readonly X509_CERTIFICATE_AUTHENTICATOR_ID: string = "eDUwOUNlcnRpZmljYXRlQXV0aGVudGljYXRvcg";
    public static readonly EMAIL_OTP_AUTHENTICATOR_ID: string = "ZW1haWwtb3RwLWF1dGhlbnRpY2F0b3I";
    public static readonly LEGACY_EMAIL_OTP_AUTHENTICATOR_ID: string = "RW1haWxPVFA";
    public static readonly BACKUP_CODE_AUTHENTICATOR_ID: string = "YmFja3VwLWNvZGUtYXV0aGVudGljYXRvcg";
    public static readonly MAGIC_LINK_AUTHENTICATOR_ID: string = "TWFnaWNMaW5rQXV0aGVudGljYXRvcg";

    // Known Social/Enterprise authenticator IDs.
    public static readonly GOOGLE_OIDC_AUTHENTICATOR_ID: string = "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I";
    public static readonly FACEBOOK_AUTHENTICATOR_ID: string = "RmFjZWJvb2tBdXRoZW50aWNhdG9y";
    public static readonly TWITTER_AUTHENTICATOR_ID: string = "VHdpdHRlckF1dGhlbnRpY2F0b3I";
    public static readonly GITHUB_AUTHENTICATOR_ID: string = "R2l0aHViQXV0aGVudGljYXRvcg";
    public static readonly YAHOO_AUTHENTICATOR_ID: string = "WWFob29PQXV0aDJBdXRoZW50aWNhdG9y";
    public static readonly OFFICE_365_AUTHENTICATOR_ID: string = "T2ZmaWNlMzY1QXV0aGVudGljYXRvcg";
    public static readonly MS_LIVE_AUTHENTICATOR_ID: string = "TWljcm9zb2Z0V2luZG93c0xpdmVBdXRoZW50aWNhdG9y";
    public static readonly IWA_KERBEROS_AUTHENTICATOR_ID: string = "SVdBS2VyYmVyb3NBdXRoZW50aWNhdG9y";
    public static readonly MICROSOFT_AUTHENTICATOR_ID: string = "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I";
    public static readonly APPLE_AUTHENTICATOR_ID: string = "QXBwbGVPSURDQXV0aGVudGljYXRvcg";
    public static readonly HYPR_AUTHENTICATOR_ID: string = "SFlQUkF1dGhlbnRpY2F0b3I";
    public static readonly IPROOV_AUTHENTICATOR_ID: string = "SXByb292QXV0aGVudGljYXRvcg";

    // Known IS Predefined/Protocols authenticator IDs
    public static readonly PASSIVE_STS_AUTHENTICATOR_NAME: string = "PassiveSTSAuthenticator";
    public static readonly SAML_AUTHENTICATOR_NAME: string = "SAMLSSOAuthenticator";
    public static readonly OIDC_AUTHENTICATOR_NAME: string = "OpenIDConnectAuthenticator";
    public static readonly LEGACY_EMAIL_OTP_AUTHENTICATOR_NAME: string = "EmailOTP";
    public static readonly SMS_OTP_AUTHENTICATOR_NAME: string = "SMSOTP";

    // Known Social/Enterprise authenticator names;
    public static readonly GOOGLE_OIDC_AUTHENTICATOR_NAME: string = "GoogleOIDCAuthenticator";
    public static readonly FACEBOOK_AUTHENTICATOR_NAME: string = "FacebookAuthenticator";
    public static readonly GITHUB_AUTHENTICATOR_NAME: string = "GithubAuthenticator";
    public static readonly YAHOO_AUTHENTICATOR_NAME: string = "YahooOAuth2Authenticator";
    public static readonly TWITTER_AUTHENTICATOR_NAME: string = "TwitterAuthenticator";
    public static readonly OFFICE_365_AUTHENTICATOR_NAME: string = "Office365Authenticator";
    public static readonly MS_LIVE_AUTHENTICATOR_NAME: string = "MicrosoftWindowsLiveAuthenticator";
    public static readonly IWA_KERBEROS_AUTHENTICATOR_NAME: string = "IWAKerberosAuthenticator";
    public static readonly MICROSOFT_AUTHENTICATOR_NAME: string = "MicrosoftAuthenticator";
    public static readonly APPLE_AUTHENTICATOR_NAME: string = "AppleOIDCAuthenticator";

    // Known Social authenticator display names;
    public static readonly GOOGLE_OIDC_AUTHENTICATOR_DISPLAY_NAME: string = "Google";
    public static readonly FACEBOOK_AUTHENTICATOR_DISPLAY_NAME: string = "Facebook";
    public static readonly GITHUB_AUTHENTICATOR_DISPLAY_NAME: string = "GitHub";
    public static readonly MICROSOFT_AUTHENTICATOR_DISPLAY_NAME: string = "Microsoft";
    public static readonly APPLE_AUTHENTICATOR_DISPLAY_NAME: string = "Apple";

    // Keys for the initial values of Email OTP Authenticator
    public static readonly AUTHENTICATOR_INIT_VALUES_EMAIL_OTP_EXPIRY_TIME_KEY: string = "EmailOTP_ExpiryTime";

    // Keys for the initial values of SMS OTP Authenticator
    public static readonly AUTHENTICATOR_INIT_VALUES_SMS_OTP_EXPIRY_TIME_KEY: string = "SmsOTP_ExpiryTime";

    /**
     * Name of the FIDO connector configuration.
     */
    public static readonly FIDO_CONNECTOR_CONFIG_NAME: string = "fido-connector";

    /**
     * Attribute key for the trusted origins in the FIDO connector configuration.
     */
    public static readonly FIDO_TRUSTED_ORIGINS_ATTRIBUTE_KEY: string = "FIDO2TrustedOrigins";
}
