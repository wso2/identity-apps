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
import SweIdpTemplate from "@wso2is/admin.extensions.v1/identity-provider-templates/templates/swe/swe.json";
import TrustedTokenIssuerTemplate from
    "@wso2is/admin.extensions.v1/identity-provider-templates/templates/trusted-token-issuer/trusted-token-issuer.json";
import { IdentityAppsError } from "@wso2is/core/errors";
import { DocumentationConstants } from "./documentation-constants";
import AppleIdPTemplate from "../data/identity-provider-templates/templates/apple/apple.json";
import EnterpriseIdPTemplate from
    "../data/identity-provider-templates/templates/enterprise-identity-provider/enterprise-identity-provider.json";
import ExpertModeIdPTemplate from "../data/identity-provider-templates/templates/expert-mode/expert-mode.json";
import FacebookIdPTemplate from "../data/identity-provider-templates/templates/facebook/facebook.json";
import GitHubIdPTemplate from "../data/identity-provider-templates/templates/github/github.json";
import GoogleIdPTemplate from "../data/identity-provider-templates/templates/google/google.json";
import HYPRIdPTemplate from "../data/identity-provider-templates/templates/hypr/hypr.json";
import IProovIdPTemplate from "../data/identity-provider-templates/templates/iproov/iproov.json";
import MicrosoftIDPTemplate from "../data/identity-provider-templates/templates/microsoft/microsoft.json";
import EnterpriseOIDCIdPTemplate from
    "../data/identity-provider-templates/templates/oidc-identity-provider/enterprise-oidc-identity-provider.json";
// eslint-disable-next-line max-len
import EnterpriseOrganizationIdPTemplate from "../data/identity-provider-templates/templates/organization-enterprise-identity-provider/organization-enterprise-identity-provider.json";
import EnterpriseSAMLIdPTemplate from
    "../data/identity-provider-templates/templates/saml-identity-provider/enterprise-saml-identity-provider.json";
import { IdentityProviderTemplateLoadingStrategies } from "../models";

/**
 * Class containing identity provider management constants.
 */
export class IdentityProviderManagementConstants {

    public static readonly MAXIMUM_NUMBER_OF_LIST_ITEMS_TO_SHOW_INSIDE_CALLOUTS: number = 3;

    /**
     * Identifier for the local IDP.
     */
    public static readonly LOCAL_IDP_IDENTIFIER: string = "LOCAL";

    /**
     * Doc key for the IDP overview page.
     */
    public static readonly IDP_OVERVIEW_DOCS_KEY: string = `${
        DocumentationConstants.PORTAL_DOCS_KEY }["Identity Providers"]["Overview"]`;

    /**
     * Doc key for the IDP edit page.
     */
    public static readonly IDP_EDIT_OVERVIEW_DOCS_KEY: string = `${
        DocumentationConstants.PORTAL_DOCS_KEY }["Identity Providers"]["Edit Identity Provider"]["Overview"]`;

    /**
     * Set of internal idps which are forbidden from deleting.
     * // TODO: Remove this once validating is available from the backend level.
     */
    public static readonly DELETING_FORBIDDEN_IDPS: string[] = [];

    /**
     * Key for the URL search param for IDP state.
     */
    public static readonly IDP_STATE_URL_SEARCH_PARAM_KEY: string = "state";

    /**
     * URL Search param for newly created IDPs.
     */
    public static readonly NEW_IDP_URL_SEARCH_PARAM: string = `?${
        IdentityProviderManagementConstants.IDP_STATE_URL_SEARCH_PARAM_KEY }=new`;

    /**
     * Key for the URL search param for IDP create wizard trigger.
     */
    public static readonly IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY: string = "open";

    /**
     * Set of IDP template Ids.
     */
    public static readonly IDP_TEMPLATE_IDS: {
        APPLE: string;
        ENTERPRISE: string;
        EXPERT_MODE: string;
        FACEBOOK: string;
        GITHUB: string;
        GOOGLE: string;
        HYPR: string;
        IPROOV: string;
        MICROSOFT: string;
        OIDC: string;
        ORGANIZATION_ENTERPRISE_IDP: string;
        SAML: string;
        TRUSTED_TOKEN_ISSUER: string;
        SWE: string;
    } = {
        APPLE: AppleIdPTemplate.id,
        ENTERPRISE: EnterpriseIdPTemplate.id,
        EXPERT_MODE: ExpertModeIdPTemplate.id,
        FACEBOOK: FacebookIdPTemplate.id,
        GITHUB: GitHubIdPTemplate.id,
        GOOGLE: GoogleIdPTemplate.id,
        HYPR: HYPRIdPTemplate.id,
        IPROOV: IProovIdPTemplate.id,
        MICROSOFT: MicrosoftIDPTemplate.id,
        OIDC: EnterpriseOIDCIdPTemplate.id,
        ORGANIZATION_ENTERPRISE_IDP: EnterpriseOrganizationIdPTemplate.id,
        SAML: EnterpriseSAMLIdPTemplate.id,
        SWE: SweIdpTemplate.id,
        TRUSTED_TOKEN_ISSUER: TrustedTokenIssuerTemplate.id
    };

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
        IdentityProviderManagementConstants.MICROSOFT_SCOPE_DICTIONARY.OPENID,
        IdentityProviderManagementConstants.MICROSOFT_SCOPE_DICTIONARY.EMAIL,
        IdentityProviderManagementConstants.MICROSOFT_SCOPE_DICTIONARY.PROFILE
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
        IdentityProviderManagementConstants.GITHUB_SCOPE_DICTIONARY.USER_EMAIL,
        IdentityProviderManagementConstants.GITHUB_SCOPE_DICTIONARY.USER_READ
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
        IdentityProviderManagementConstants.FACEBOOK_SCOPE_DICTIONARY.EMAIL,
        IdentityProviderManagementConstants.FACEBOOK_SCOPE_DICTIONARY.PUBLIC_PROFILE
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
        IdentityProviderManagementConstants.APPLE_SCOPE_DICTIONARY.EMAIL,
        IdentityProviderManagementConstants.APPLE_SCOPE_DICTIONARY.NAME
    ];

    /**
     * Default Apple client secret validity period.
     */
    public static readonly APPLE_AUTHENTICATOR_CLIENT_SECRET_VALIDITY_PERIOD: string = "15777000";

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

    /**
     * Default IDP template loading strategy.
    **/
    public static readonly DEFAULT_IDP_TEMPLATE_LOADING_STRATEGY: IdentityProviderTemplateLoadingStrategies =
        IdentityProviderTemplateLoadingStrategies.LOCAL;

    /**
     * Doc key for the IDP create page.
    **/
    public static readonly IDP_TEMPLATES_CREATE_DOCS_KEY: string = `${
        DocumentationConstants.PORTAL_DOCS_KEY }["Identity Providers"]["Create New Identity Provider"]`;

    public static readonly IDENTITY_PROVIDER_TEMPLATE_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while fetching connection template.";

    public static readonly IDENTITY_PROVIDER_TEMPLATE_FETCH_ERROR: string = "An error occurred while fetching " +
        "the required connection template.";

    public static readonly IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while fetching connection templates list.";

    public static readonly IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_ERROR: string = "An error occurred while fetching " +
        "the required connection templates list.";

    public static readonly IDENTITY_PROVIDER_JIT_PROVISIONING_UPDATE_ERROR: string = "An error occurred while" +
        " updating the JIT provisioning configurations of the connection.";

    public static readonly LOCAL_AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching local authenticators.";

    public static readonly LOCAL_AUTHENTICATORS_FETCH_ERROR: string = "An error occurred while fetching the local" +
        "authenticators.";

    public static readonly LOCAL_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching the local authenticator.";

    public static readonly LOCAL_AUTHENTICATOR_FETCH_ERROR: string = "An error occurred while fetching the " +
        "local authenticator.";

    public static readonly AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching the authenticators.";

    public static readonly AUTHENTICATORS_FETCH_ERROR: string = "An error occurred while fetching the " +
        "authenticators.";

    public static readonly AUTHENTICATOR_TAGS_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching the authenticator tags.";

    public static readonly AUTHENTICATOR_TAGS_FETCH_ERROR: string = "An error occurred while fetching the " +
        "authenticator tags.";

    public static readonly MULTI_FACTOR_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching the multi-factor authenticator.";

    public static readonly MULTI_FACTOR_AUTHENTICATOR_FETCH_ERROR: string = "An error occurred while fetching the " +
        "multi-factor authenticator.";

    public static readonly MULTI_FACTOR_AUTHENTICATOR_UPDATE_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while updating the multi-factor authenticator.";

    public static readonly MULTI_FACTOR_AUTHENTICATOR_UPDATE_ERROR: string = "An error occurred while updating the " +
        "multi-factor authenticator.";

    public static readonly COMBINED_AUTHENTICATOR_FETCH_ERROR: string = "An error occurred while fetching the local" +
        "and federated authenticators.";

    public static readonly IDENTITY_PROVIDER_CLAIMS_UPDATE_ERROR: string = "An error occurred while updating claims " +
        "configurations of the connection.";

    public static readonly IDENTITY_PROVIDER_CERTIFICATE_UPDATE_ERROR: string = "An error occurred while updating " +
        "the certificate of the connection.";

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

    public static readonly BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR: string = "BasicAuthRequestPathAuthenticator";
    public static readonly OAUTH_REQUEST_PATH_AUTHENTICATOR: string = "OAuthRequestPathAuthenticator";
    public static readonly PROVISIONING_CONNECTOR_DISPLAY_NAME: string = "displayName";
    public static readonly PROVISIONING_CONNECTOR_GOOGLE: string = "googleapps";
    public static readonly X509_AUTHENTICATOR: string = "x509CertificateAuthenticator";
    public static readonly SESSION_EXECUTOR_AUTHENTICATOR: string = "SessionExecutor";
    public static readonly TOTP_AUTHENTICATOR: string = "totp";
    public static readonly IPROOV_AUTHENTICATOR: string = "IproovAuthenticator";
    public static readonly EMAIL_OTP_AUTHENTICATOR: string = "email-otp-authenticator";
    public static readonly FIDO_AUTHENTICATOR: string = "FIDOAuthenticator";
    public static readonly BASIC_AUTHENTICATOR: string = "BasicAuthenticator";
    public static readonly IDENTIFIER_FIRST_AUTHENTICATOR: string = "IdentifierExecutor";
    public static readonly ORGANIZATION_AUTHENTICATOR: string = "SSO";
    public static readonly SMS_OTP_AUTHENTICATOR: string = authenticatorConfig?.overriddenAuthenticatorNames?.
        SMS_OTP_AUTHENTICATOR ?? "sms-otp";

    public static readonly BACKUP_CODE_AUTHENTICATOR: string = "backup-code-authenticator";
    public static readonly MAGIC_LINK_AUTHENTICATOR: string = "MagicLinkAuthenticator";

    // Known IS Predefined/Protocols authenticator IDs
    public static readonly OIDC_AUTHENTICATOR_ID: string = "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I";
    public static readonly SAML_AUTHENTICATOR_ID: string = "U0FNTFNTT0F1dGhlbnRpY2F0b3I";
    public static readonly PASSIVE_STS_AUTHENTICATOR_ID: string = "UGFzc2l2ZVNUU0F1dGhlbnRpY2F0b3I";
    public static readonly ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID: string = "T3JnYW5pemF0aW9uQXV0aGVudGljYXRvcg";

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
    public static readonly BASIC_AUTH_AUTHENTICATOR_ID: string = "QmFzaWNBdXRoUmVxdWVzdFBhdGhBdXRoZW50aWNhdG9y";
    public static readonly OAUTH_BEARER_AUTHENTICATOR_ID: string = "T0F1dGhSZXF1ZXN0UGF0aEF1dGhlbnRpY2F0b3I";
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

    // Authenticator Endpoints
    public static readonly MICROSOFT_AUTHENTICATION_ENDPOINT_URL: string =
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

    // Token Endpoints
    public static readonly MICROSOFT_TOKEN_ENDPOINT_URL: string =
    "https://login.microsoftonline.com/common/oauth2/v2.0/token";

    // Keys for the initial values of SMS OTP Authenticator
    public static readonly AUTHENTICATOR_INIT_VALUES_SMS_OTP_EXPIRY_TIME_KEY: string = "SmsOTP_ExpiryTime";

    /**
     * Identity provider create limit reached error.
    **/
    public static readonly ERROR_CREATE_LIMIT_REACHED: IdentityAppsError = new IdentityAppsError(
        "IDP-60035",
        "idp:notifications.apiLimitReachedError.error.description",
        "idp:notifications.apiLimitReachedError.error.message",
        "cec1f247-32fd-4624-9915-f469195a53ac"
    )

    /**
     * AuthenticationProvider Connections create limit reached error.
    **/
     public static readonly ERROR_CREATE_LIMIT_REACHED_IDP: IdentityAppsError = new IdentityAppsError(
         "IDP-60035",
         "authenticationProvider:notifications.apiLimitReachedError.error.description",
         "authenticationProvider:notifications.apiLimitReachedError.error.message",
         "cec1f247-32fd-4624-9915-f469195a53ac"
     )

     public static readonly SHOW_PREDEFINED_TEMPLATES_IN_EXPERT_MODE_SETUP: boolean = false;

    /**
     * Name of the FIDO connector configuration.
     */
    public static readonly FIDO_CONNECTOR_CONFIG_NAME: string = "fido-connector";

    /**
     * Attribute key for the trusted origins in the FIDO connector configuration.
     */
    public static readonly FIDO_TRUSTED_ORIGINS_ATTRIBUTE_KEY: string = "FIDO2TrustedOrigins";
}
