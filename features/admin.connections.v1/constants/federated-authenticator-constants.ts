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

/**
 * This class contains the constants for the Federated Authenticators.
 */
export class FederatedAuthenticatorConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    public static readonly AUTHENTICATOR_IDS: {
        APPLE_AUTHENTICATOR_ID: string;
        DUO_AUTHENTICATOR_ID: string;
        EMAIL_OTP_AUTHENTICATOR_ID: string;
        FACEBOOK_AUTHENTICATOR_ID: string;
        GITHUB_AUTHENTICATOR_ID: string;
        GOOGLE_OIDC_AUTHENTICATOR_ID: string;
        HYPR_AUTHENTICATOR_ID: string;
        IPROOV_AUTHENTICATOR_ID: string;
        IWA_KERBEROS_AUTHENTICATOR_ID: string;
        MICROSOFT_AUTHENTICATOR_ID: string;
        MS_LIVE_AUTHENTICATOR_ID: string;
        OFFICE_365_AUTHENTICATOR_ID: string;
        OIDC_AUTHENTICATOR_ID: string;
        ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID: string;
        SAML_AUTHENTICATOR_ID: string;
        SIWE_AUTHENTICATOR_ID: string;
        SMS_OTP_AUTHENTICATOR_ID: string;
        TWITTER_AUTHENTICATOR_ID: string;
        YAHOO_AUTHENTICATOR_ID: string;
        PASSWORD_RESET_ENFORCER_AUTHENTICATOR_ID: string;
    } = {
        APPLE_AUTHENTICATOR_ID: "QXBwbGVPSURDQXV0aGVudGljYXRvcg",
        DUO_AUTHENTICATOR_ID: "RHVvQXV0aGVudGljYXRvcg",
        EMAIL_OTP_AUTHENTICATOR_ID: "RW1haWxPVFA",
        FACEBOOK_AUTHENTICATOR_ID: "RmFjZWJvb2tBdXRoZW50aWNhdG9y",
        GITHUB_AUTHENTICATOR_ID: "R2l0aHViQXV0aGVudGljYXRvcg",
        GOOGLE_OIDC_AUTHENTICATOR_ID: "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
        HYPR_AUTHENTICATOR_ID: "SFlQUkF1dGhlbnRpY2F0b3I",
        IPROOV_AUTHENTICATOR_ID: "SXByb292QXV0aGVudGljYXRvcg",
        IWA_KERBEROS_AUTHENTICATOR_ID: "SVdBS2VyYmVyb3NBdXRoZW50aWNhdG9y",
        MICROSOFT_AUTHENTICATOR_ID: "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I",
        MS_LIVE_AUTHENTICATOR_ID: "TWljcm9zb2Z0V2luZG93c0xpdmVBdXRoZW50aWNhdG9y",
        OFFICE_365_AUTHENTICATOR_ID: "T2ZmaWNlMzY1QXV0aGVudGljYXRvcg",
        OIDC_AUTHENTICATOR_ID: "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I",
        ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID: "T3JnYW5pemF0aW9uQXV0aGVudGljYXRvcg",
        SAML_AUTHENTICATOR_ID: "U0FNTFNTT0F1dGhlbnRpY2F0b3I",
        SIWE_AUTHENTICATOR_ID: "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I",
        SMS_OTP_AUTHENTICATOR_ID: "U01TT1RQ",
        TWITTER_AUTHENTICATOR_ID: "VHdpdHRlckF1dGhlbnRpY2F0b3I",
        YAHOO_AUTHENTICATOR_ID: "WWFob29PQXV0aDJBdXRoZW50aWNhdG9y",
        PASSWORD_RESET_ENFORCER_AUTHENTICATOR_ID: "WWFob29PQXV0aDJBdXRoZW50aWNhdG9y"
    };

    public static readonly AUTHENTICATOR_NAMES: {
        APPLE_AUTHENTICATOR_NAME: string;
        DUO_AUTHENTICATOR_NAME: string;
        EMAIL_OTP_AUTHENTICATOR_NAME: string;
        FACEBOOK_AUTHENTICATOR_NAME: string;
        GITHUB_AUTHENTICATOR_NAME: string;
        GOOGLE_OIDC_AUTHENTICATOR_NAME: string;
        IPROOV_AUTHENTICATOR_NAME: string;
        IWA_KERBEROS_AUTHENTICATOR_NAME: string;
        MICROSOFT_AUTHENTICATOR_NAME: string;
        MS_LIVE_AUTHENTICATOR_NAME: string;
        TWITTER_AUTHENTICATOR_NAME: string;
        SAML_AUTHENTICATOR_NAME: string;
        SMS_OTP_AUTHENTICATOR_NAME: string;
        OFFICE_365_AUTHENTICATOR_NAME: string;
        OIDC_AUTHENTICATOR_NAME: string;
        ORGANIZATION_ENTERPRISE_AUTHENTICATOR_NAME: string;
        YAHOO_AUTHENTICATOR_NAME: string;
        PASSWORD_RESET_ENFORCER_AUTHENTICATOR_NAME: string;
    } = {
        APPLE_AUTHENTICATOR_NAME: "AppleOIDCAuthenticator",
        DUO_AUTHENTICATOR_NAME: "DuoAuthenticator",
        EMAIL_OTP_AUTHENTICATOR_NAME: "EmailOTP",
        FACEBOOK_AUTHENTICATOR_NAME: "FacebookAuthenticator",
        GITHUB_AUTHENTICATOR_NAME: "GithubAuthenticator",
        GOOGLE_OIDC_AUTHENTICATOR_NAME: "GoogleOIDCAuthenticator",
        IPROOV_AUTHENTICATOR_NAME: "IproovAuthenticator",
        IWA_KERBEROS_AUTHENTICATOR_NAME: "IWAKerberosAuthenticator",
        MICROSOFT_AUTHENTICATOR_NAME: "MicrosoftAuthenticator",
        MS_LIVE_AUTHENTICATOR_NAME: "MicrosoftWindowsLiveAuthenticator",
        OFFICE_365_AUTHENTICATOR_NAME: "Office365Authenticator",
        OIDC_AUTHENTICATOR_NAME: "OpenIDConnectAuthenticator",
        ORGANIZATION_ENTERPRISE_AUTHENTICATOR_NAME: "OrganizationAuthenticator",
        SAML_AUTHENTICATOR_NAME: "SAMLSSOAuthenticator",
        SMS_OTP_AUTHENTICATOR_NAME: "SMSOTP",
        TWITTER_AUTHENTICATOR_NAME: "TwitterAuthenticator",
        YAHOO_AUTHENTICATOR_NAME: "YahooOAuth2Authenticator",
        PASSWORD_RESET_ENFORCER_AUTHENTICATOR_NAME: "password-reset-enforcer"
    };

    public static readonly AUTHENTICATOR_DISPLAY_NAMES: {
        APPLE_AUTHENTICATOR_DISPLAY_NAME: string;
        FACEBOOK_AUTHENTICATOR_DISPLAY_NAME: string;
        GITHUB_AUTHENTICATOR_DISPLAY_NAME: string;
        GOOGLE_OIDC_AUTHENTICATOR_DISPLAY_NAME: string;
        MICROSOFT_AUTHENTICATOR_DISPLAY_NAME: string;
    } = {
        APPLE_AUTHENTICATOR_DISPLAY_NAME: "Apple",
        FACEBOOK_AUTHENTICATOR_DISPLAY_NAME: "Facebook",
        GITHUB_AUTHENTICATOR_DISPLAY_NAME: "GitHub",
        GOOGLE_OIDC_AUTHENTICATOR_DISPLAY_NAME: "Google",
        MICROSOFT_AUTHENTICATOR_DISPLAY_NAME: "Microsoft"
    };

    /**
     * Google One Tap enabling request parameter.
     */
    public static readonly GOOGLE_ONE_TAP_ENABLED_PARAM: string = "IsGoogleOneTapEnabled";

    /**
     * Google Scope mappings.
     */
    public static readonly GOOGLE_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        OPENID: "openid",
        PROFILE: "profile"
    };

    /**
     * Microsoft Scope mappings.
     */
    public static readonly MICROSOFT_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        OPENID: "openid",
        PROFILE: "profile"
    };

    /**
     * GitHub Scope mappings.
     */
    public static readonly GITHUB_SCOPE_DICTIONARY: Record<string, string> = {
        USER_EMAIL: "user:email",
        USER_READ: "read:user"
    };

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
     * Key of the Apple client secret regenerate attribute.
     */
    public static readonly APPLE_SECRET_REGENERATE_ATTRIBUTE_KEY: string = "RegenerateClientSecret";

    /**
     * SIWE Scope mappings.
     */
    public static readonly SIWE_SCOPE_DICTIONARY: Record<string, string> = {
        OPENID: "openid",
        PROFILE: "profile"
    };

    /**
     * @deprecated Use `ORGANIZATION_ENTERPRISE_AUTHENTICATOR_NAME` from
     * `FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES` instead.
     * Hardcoded name for SSO authenticator.
     * TODO: This should be removed once the `getOrganizationAuthenticator()` util function is cleaned up.
     */
    public static readonly ORGANIZATION_AUTHENTICATOR: string = "SSO";
}
