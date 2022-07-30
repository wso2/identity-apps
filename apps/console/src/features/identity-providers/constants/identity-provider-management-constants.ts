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

import { IdentityAppsError } from "@wso2is/core/errors";
import { DocumentationConstants } from "./documentation-constants";
import EnterpriseIdPTemplate from
    "../data/identity-provider-templates/templates/enterprise-identity-provider/enterprise-identity-provider.json";
import ExpertModeIdPTemplate from "../data/identity-provider-templates/templates/expert-mode/expert-mode.json";
import FacebookIdPTemplate from "../data/identity-provider-templates/templates/facebook/facebook.json";
import GitHubIdPTemplate from "../data/identity-provider-templates/templates/github/github.json";
import GoogleIdPTemplate from "../data/identity-provider-templates/templates/google/google.json";
import EnterpriseOIDCIdPTemplate from
    "../data/identity-provider-templates/templates/oidc-identity-provider/enterprise-oidc-identity-provider.json";
import EnterpriseOrganizationIdPTemplate from
    "../data/identity-provider-templates/templates/organization-enterprise-identity-provider/organization-enterprise-identity-provider.json";
import EnterpriseSAMLIdPTemplate from
    "../data/identity-provider-templates/templates/saml-identity-provider/enterprise-saml-identity-provider.json";
import { IdentityProviderTemplateLoadingStrategies } from "../models";

/**
 * Class containing identity provider management constants.
 */
export class IdentityProviderManagementConstants {

    public static readonly MAXIMUM_NUMBER_OF_LIST_ITEMS_TO_SHOW_INSIDE_CALLOUTS = 3;

    /**
     * Identifier for the local IDP.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly LOCAL_IDP_IDENTIFIER: string = "LOCAL";

    /**
     * Doc key for the IDP overview page.
     * @constant
     * @type {string}
     */
    public static readonly IDP_OVERVIEW_DOCS_KEY = `${
        DocumentationConstants.PORTAL_DOCS_KEY }["Identity Providers"]["Overview"]`;

    /**
     * Doc key for the IDP edit page.
     * @constant
     * @type {string}
     */
    public static readonly IDP_EDIT_OVERVIEW_DOCS_KEY = `${
        DocumentationConstants.PORTAL_DOCS_KEY }["Identity Providers"]["Edit Identity Provider"]["Overview"]`;

    /**
     * Set of internal idps which are forbidden from deleting.
     * // TODO: Remove this once validating is available from the backend level.
     * @type {string[]}
     */
    public static readonly DELETING_FORBIDDEN_IDPS: string[] = [];

    /**
     * Key for the URL search param for IDP state.
     * @constant
     * @type {string}
     */
    public static readonly IDP_STATE_URL_SEARCH_PARAM_KEY = "state";

    /**
     * URL Search param for newly created IDPs.
     * @constant
     * @type {string}
     */
    public static readonly NEW_IDP_URL_SEARCH_PARAM = `?${
        IdentityProviderManagementConstants.IDP_STATE_URL_SEARCH_PARAM_KEY }=new`;

    /**
     * Key for the URL search param for IDP create wizard trigger.
     * @constant
     * @type {string}
     */
    public static readonly IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY = "open";

    /**
     * Set of IDP template Ids.
     * @type {object}
     */
    public static readonly IDP_TEMPLATE_IDS: {
        ENTERPRISE: string;
        EXPERT_MODE: string;
        FACEBOOK: string;
        GITHUB: string;
        GOOGLE: string;
        OIDC: string;
        ORGANIZATION_ENTERPRISE_IDP: string;
        SAML: string;
    } = {
        ENTERPRISE: EnterpriseIdPTemplate.id,
        EXPERT_MODE: ExpertModeIdPTemplate.id,
        FACEBOOK: FacebookIdPTemplate.id,
        GITHUB: GitHubIdPTemplate.id,
        GOOGLE: GoogleIdPTemplate.id,
        OIDC: EnterpriseOIDCIdPTemplate.id,
        ORGANIZATION_ENTERPRISE_IDP: EnterpriseOrganizationIdPTemplate.id,
        SAML: EnterpriseSAMLIdPTemplate.id
    };

    /**
     * Authenticator Settings Form element constraints.
     * @type {Record<string, string | number>}
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
     * @type {Record<string, string | number>}
     */
    public static readonly GENERAL_FORM_CONSTRAINTS: Record<string, string | number> = {
        IMAGE_URL_MAX_LENGTH: 2048,
        IMAGE_URL_MIN_LENGTH: 3
    };

    /**
     * Email OTP Authenticator Settings Form element constraints.
     * @type {Record<string, string | number>}
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
        EXPIRY_TIME_MAX_VALUE: 86400,
        EXPIRY_TIME_MIN_LENGTH: 1,
        EXPIRY_TIME_MIN_VALUE: 1,
        OTP_LENGTH_MAX_LENGTH: 2,
        OTP_LENGTH_MAX_VALUE: 10,
        OTP_LENGTH_MIN_LENGTH: 1,
        OTP_LENGTH_MIN_VALUE: 4
    };

    /**
     * Google Authenticator Settings Form element constraints.
     * @type {Record<string, number>}
     */
    public static readonly GOOGLE_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS: Record<string, number> = {
        ADDITIONAL_QUERY_PARAMS_MIN_LENGTH: 0,
        ADDITIONAL_QUERY_PARAMS_MAX_LENGTH: 1000
    };

    /**
     * Google Scope mappings.
     * @type {Record<string, string>}
     */
    public static readonly GOOGLE_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        OPENID: "openid",
        PROFILE: "profile"
    };

    /**
     * GitHub Scope mappings.
     * @type {Record<string, string>}
     */
    public static readonly GITHUB_SCOPE_DICTIONARY: Record<string, string> = {
        USER_EMAIL: "user:email",
        USER_READ: "read:user"
    };

    /**
     * Scopes to request from GitHub.
     * @type {string[]}
     */
    public static readonly GITHUB_AUTHENTICATOR_REQUESTED_SCOPES: string[] = [
        IdentityProviderManagementConstants.GITHUB_SCOPE_DICTIONARY.USER_EMAIL,
        IdentityProviderManagementConstants.GITHUB_SCOPE_DICTIONARY.USER_READ
    ];

    /**
     * Facebook Scope mappings.
     * @type {Record<string, string>}
     */
    public static readonly FACEBOOK_SCOPE_DICTIONARY: Record<string, string> = {
        EMAIL: "email",
        PUBLIC_PROFILE: "public_profile"
    };

    /**
     * Facebook Scope mappings.
     * @type {Record<string, string>}
     */
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
     * @type {string[]}
     */
    public static readonly FACEBOOK_AUTHENTICATOR_REQUESTED_SCOPES: string[] = [
        IdentityProviderManagementConstants.FACEBOOK_SCOPE_DICTIONARY.EMAIL,
        IdentityProviderManagementConstants.FACEBOOK_SCOPE_DICTIONARY.PUBLIC_PROFILE
    ];

    /**
     * Profile fields to request from Facebook.
     * @type {string[]}
     */
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
     * Default IDP template loading strategy.
     * @constant
     * @type {IdentityProviderTemplateLoadingStrategies}
     */
    public static readonly DEFAULT_IDP_TEMPLATE_LOADING_STRATEGY: IdentityProviderTemplateLoadingStrategies =
        IdentityProviderTemplateLoadingStrategies.LOCAL;

    /**
     * Doc key for the IDP create page.
     * @constant
     * @type {string}
     */
    public static readonly IDP_TEMPLATES_CREATE_DOCS_KEY = `${
        DocumentationConstants.PORTAL_DOCS_KEY }["Identity Providers"]["Create New Identity Provider"]`;

    public static readonly IDENTITY_PROVIDER_TEMPLATE_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while fetching identity provider template.";

    public static readonly IDENTITY_PROVIDER_TEMPLATE_FETCH_ERROR: string = "An error occurred while fetching " +
        "the required identity provider template.";

    public static readonly IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while fetching identity provider templates list.";

    public static readonly IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_ERROR: string = "An error occurred while fetching " +
        "the required identity provider templates list.";

    public static readonly IDENTITY_PROVIDER_JIT_PROVISIONING_UPDATE_ERROR: string = "An error occurred while" +
        " updating the JIT provisioning configurations of the identity provider.";

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
        "configurations of the identity provider.";

    public static readonly IDENTITY_PROVIDER_CERTIFICATE_UPDATE_ERROR: string = "An error occurred while updating " +
        "the certificate of the identity provider.";

    public static readonly BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR: string = "BasicAuthRequestPathAuthenticator";
    public static readonly OAUTH_REQUEST_PATH_AUTHENTICATOR: string = "OAuthRequestPathAuthenticator";
    public static readonly PROVISIONING_CONNECTOR_DISPLAY_NAME: string = "displayName";
    public static readonly PROVISIONING_CONNECTOR_GOOGLE: string = "googleapps";
    public static readonly X509_AUTHENTICATOR: string = "x509CertificateAuthenticator";
    public static readonly SESSION_EXECUTOR_AUTHENTICATOR: string = "SessionExecutor";
    public static readonly TOTP_AUTHENTICATOR: string = "totp";
    public static readonly EMAIL_OTP_AUTHENTICATOR: string = "email-otp-authenticator";
    public static readonly FIDO_AUTHENTICATOR: string = "FIDOAuthenticator";
    public static readonly BASIC_AUTHENTICATOR: string = "BasicAuthenticator";
    public static readonly IDENTIFIER_FIRST_AUTHENTICATOR: string = "IdentifierExecutor";
    public static readonly SMS_OTP_AUTHENTICATOR: string = "sms-otp";
    public static readonly BACKUP_CODE_AUTHENTICATOR: string = "backup-code-authenticator";
    public static readonly MAGIC_LINK_AUTHENTICATOR: string = "MagicLinkAuthenticator";

    // Known Enterprise authenticator IDs
    public static readonly OIDC_AUTHENTICATOR_ID: string = "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I";
    public static readonly SAML_AUTHENTICATOR_ID: string = "U0FNTFNTT0F1dGhlbnRpY2F0b3I";
    public static readonly ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID: string = "T3JnYW5pemF0aW9uQXV0aGVudGljYXRvcg";

    // Known Local Authenticator IDS.
    public static readonly BASIC_AUTHENTICATOR_ID: string = "QmFzaWNBdXRoZW50aWNhdG9y";
    public static readonly IDENTIFIER_FIRST_AUTHENTICATOR_ID: string = "SWRlbnRpZmllckV4ZWN1dG9y";
    public static readonly JWT_BASIC_AUTHENTICATOR_ID: string = "SldUQmFzaWNBdXRoZW50aWNhdG9y";
    public static readonly FIDO_AUTHENTICATOR_ID: string = "RklET0F1dGhlbnRpY2F0b3I";
    public static readonly SMS_OTP_AUTHENTICATOR_ID: string = "U01TT1RQ";
    public static readonly TOTP_AUTHENTICATOR_ID: string = "dG90cA";
    public static readonly ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID: string = "U2Vzc2lvbkV4ZWN1dG9y";
    public static readonly X509_CERTIFICATE_AUTHENTICATOR_ID: string = "eDUwOUNlcnRpZmljYXRlQXV0aGVudGljYXRvcg";
    public static readonly BASIC_AUTH_AUTHENTICATOR_ID: string = "QmFzaWNBdXRoUmVxdWVzdFBhdGhBdXRoZW50aWNhdG9y";
    public static readonly OAUTH_BEARER_AUTHENTICATOR_ID: string = "T0F1dGhSZXF1ZXN0UGF0aEF1dGhlbnRpY2F0b3I";
    public static readonly EMAIL_OTP_AUTHENTICATOR_ID: string = "ZW1haWwtb3RwLWF1dGhlbnRpY2F0b3I";
    public static readonly LEGACY_EMAIL_OTP_AUTHENTICATOR_ID: string = "RW1haWxPVFA";
    public static readonly BACKUP_CODE_AUTHENTICATOR_ID: string = "YmFja3VwLWNvZGUtYXV0aGVudGljYXRvcgo=";
    public static readonly MAGIC_LINK_AUTHENTICATOR_ID: string = "TWFnaWNMaW5rQXV0aGVudGljYXRvcg";

    // Known Social authenticator IDs.
    public static readonly GOOGLE_OIDC_AUTHENTICATOR_ID: string = "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I";
    public static readonly FACEBOOK_AUTHENTICATOR_ID: string = "RmFjZWJvb2tBdXRoZW50aWNhdG9y";
    public static readonly TWITTER_AUTHENTICATOR_ID: string = "VHdpdHRlckF1dGhlbnRpY2F0b3I";
    public static readonly GITHUB_AUTHENTICATOR_ID: string = "R2l0aHViQXV0aGVudGljYXRvcg";

    // Known Social authenticator names;
    public static readonly GOOGLE_OIDC_AUTHENTICATOR_NAME: string = "GoogleOIDCAuthenticator";
    public static readonly FACEBOOK_AUTHENTICATOR_NAME: string = "FacebookAuthenticator";
    public static readonly GITHUB_AUTHENTICATOR_NAME: string = "GithubAuthenticator";
    public static readonly TWITTER_AUTHENTICATOR_NAME: string = "TwitterAuthenticator";

    // Known Social authenticator display names;
    public static readonly GOOGLE_OIDC_AUTHENTICATOR_DISPLAY_NAME: string = "Google";
    public static readonly FACEBOOK_AUTHENTICATOR_DISPLAY_NAME: string = "Facebook";
    public static readonly GITHUB_AUTHENTICATOR_DISPLAY_NAME: string = "GitHub";

    /**
     * Identity provider create limit reached error.
     * @constant
     * @type IdentityAppsError
     * @default
     */
    public static readonly ERROR_CREATE_LIMIT_REACHED = new IdentityAppsError(
        "IDP-60035",
        "console:develop.features.idp.notifications.apiLimitReachedError.error.description",
        "console:develop.features.idp.notifications.apiLimitReachedError.error.message",
        "cec1f247-32fd-4624-9915-f469195a53ac"
    )

    /**
     * AuthenticationProvider Connections create limit reached error.
     * @constant
     * @type IdentityAppsError
     * @default
     */
     public static readonly ERROR_CREATE_LIMIT_REACHED_IDP = new IdentityAppsError(
         "IDP-60035",
         "console:develop.features.authenticationProvider.notifications.apiLimitReachedError.error.description",
         "console:develop.features.authenticationProvider.notifications.apiLimitReachedError.error.message",
         "cec1f247-32fd-4624-9915-f469195a53ac"
     )
}
