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

import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AvailableCustomAuthentications } from "../models/connection";

/**
 * This class contains the constants for the Connections feature UIs.
 */
export class ConnectionUIConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    /**
     * Key for the URL search param for IDP create wizard trigger.
     */
    public static readonly IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY: string = "open";

    /**
     * Key for the URL search param for IDP state.
     */
    public static readonly IDP_STATE_URL_SEARCH_PARAM_KEY: string = "state";

    /**
     * URL Search param for newly created IDPs.
     */
    public static readonly NEW_IDP_URL_SEARCH_PARAM: string = `?${
        this.IDP_STATE_URL_SEARCH_PARAM_KEY }=new`;

    // Tab IDs for the connection edit page
    public static readonly TabIds: Readonly<{
        ADVANCED: string;
        ATTRIBUTES: string;
        CONNECTED_APPS: string;
        GENERAL: string;
        JIT_PROVISIONING: string;
        OUTBOUND_PROVISIONING: string;
        SETTINGS: string;
        IDENTITY_PROVIDER_GROUPS: string;
    }>= {
        ADVANCED: "advanced",
        ATTRIBUTES: "attributes",
        CONNECTED_APPS: "connected-apps",
        GENERAL: "general",
        IDENTITY_PROVIDER_GROUPS: "identity-provider-groups",
        JIT_PROVISIONING: "jit-provisioning",
        OUTBOUND_PROVISIONING: "outbound-provisioning",
        SETTINGS: "settings"
    } as const;

    /**
     * General Form element constraints.
     */
    public static readonly GENERAL_FORM_CONSTRAINTS: Record<string, string | number> = {
        IMAGE_URL_MAX_LENGTH: 2048,
        IMAGE_URL_MIN_LENGTH: 3
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

    /**
     * SMS OTP Authenticator Settings Form element constraints.
     */
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
     * Map of Apple authenticator secret regenerative fields.
     */
    private static readonly APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY: Record<string, string> = {
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
        this.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.CLIENT_ID,
        this.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.KEY_ID,
        this.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.PRIVATE_KEY,
        this.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.SECRET_VALIDITY_PERIOD,
        this.APPLE_SECRET_REGENERATIVE_FIELDS_DICTIONARY.TEAM_ID
    ];

    /* eslint-disable max-len */
    // TODO: These error messages need to be localized.
    public static readonly ERROR_MESSAGES: {
        AUTHENTICATORS_FETCH_ERROR: string;
        AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR: string;
        COMBINED_AUTHENTICATOR_FETCH_ERROR: string;
        CONNECTIONS_FETCH_ERROR: string;
        CONNECTIONS_FETCH_INVALID_STATUS_CODE_ERROR: string;
        CONNECTION_CERTIFICATE_UPDATE_ERROR: string;
        CONNECTION_CLAIMS_UPDATE_ERROR: string;
        CONNECTION_IMPLICIT_ASSOCIATION_UPDATE_ERROR: string;
        CONNECTION_JIT_PROVISIONING_UPDATE_ERROR: string;
        FIDO_AUTHENTICATOR_CONFIG_UPDATE_ERROR: string;
        FIDO_AUTHENTICATOR_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR: string;
        IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_ERROR: string;
        IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR: string;
        LOCAL_AUTHENTICATORS_FETCH_ERROR: string;
        LOCAL_AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR: string;
        LOCAL_AUTHENTICATOR_FETCH_ERROR: string;
        LOCAL_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR: string;
        MULTI_FACTOR_AUTHENTICATOR_FETCH_ERROR: string;
        MULTI_FACTOR_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR: string;
        MULTI_FACTOR_AUTHENTICATOR_UPDATE_ERROR: string;
        MULTI_FACTOR_AUTHENTICATOR_UPDATE_INVALID_STATUS_CODE_ERROR: string;
    } = {
            AUTHENTICATORS_FETCH_ERROR: "An error occurred while fetching the authenticators.",
            AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR: "Received an invalid status code while fetching the authenticators.",
            COMBINED_AUTHENTICATOR_FETCH_ERROR: "An error occurred while fetching the local and federated authenticators.",
            CONNECTIONS_FETCH_ERROR: "An error occurred while fetching connections.",
            CONNECTIONS_FETCH_INVALID_STATUS_CODE_ERROR: "Received an invalid status code while fetching connections.",
            CONNECTION_CERTIFICATE_UPDATE_ERROR: "An error occurred while updating the certificate of the connection.",
            CONNECTION_CLAIMS_UPDATE_ERROR: "An error occurred while updating claims configurations of the identity provider.",
            CONNECTION_IMPLICIT_ASSOCIATION_UPDATE_ERROR: "An error occurred while updating implicit association configurations of the identity provider.",
            CONNECTION_JIT_PROVISIONING_UPDATE_ERROR: "An error occurred while updating the JIT provisioning configurations of the connection.",
            FIDO_AUTHENTICATOR_CONFIG_UPDATE_ERROR: "An error occurred while updating the Passkey connector configs.",
            FIDO_AUTHENTICATOR_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR: "Received an invalid status code while updating the Passkey connector configs.",
            IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_ERROR: "An error occurred while fetching the required connection templates list.",
            IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR: "Received an invalid status code while fetching connection templates list.",
            LOCAL_AUTHENTICATORS_FETCH_ERROR: "An error occurred while fetching the local authenticators.",
            LOCAL_AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR: "Received an invalid status code while fetching local authenticators.",
            LOCAL_AUTHENTICATOR_FETCH_ERROR: "An error occurred while fetching the local authenticator.",
            LOCAL_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR: "Received an invalid status code while fetching the local authenticator.",
            MULTI_FACTOR_AUTHENTICATOR_FETCH_ERROR: "An error occurred while fetching the multi-factor authenticator.",
            MULTI_FACTOR_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR:"Received an invalid status code while fetching the multi-factor authenticator.",
            MULTI_FACTOR_AUTHENTICATOR_UPDATE_ERROR: "An error occurred while fetching the multi-factor authenticator.",
            MULTI_FACTOR_AUTHENTICATOR_UPDATE_INVALID_STATUS_CODE_ERROR: "Received an invalid status code while updating the multi-factor authenticator."
        };
    /* eslint-enable max-len */

    public static readonly ERROR_CODES: {
        FIDO_CONNECTOR_CONFIGS_NOT_CONFIGURED_ERROR_CODE: string;
    } = {
            FIDO_CONNECTOR_CONFIGS_NOT_CONFIGURED_ERROR_CODE: "CONFIGM_00017"
        };

    /**
     * Identity provider create limit reached error.
    **/
    public static readonly ERROR_CREATE_LIMIT_REACHED: IdentityAppsError = new IdentityAppsError(
        "IDP-60035",
        "idp:notifications.apiLimitReachedError.error.description",
        "idp:notifications.apiLimitReachedError.error.message",
        "cec1f247-32fd-4624-9915-f469195a53ac"
    );

    public static readonly IDP_NAME_LENGTH: {
        min: number;
        max: number;
    } = {
            max: 120,
            min: 3
        };

    public static readonly JWKS_URL_LENGTH: {
        min: number;
        max: number;
    } = {
            max: 2048,
            min: 0
        };

    public static readonly GROUP_CLAIM_LENGTH: {
        min: number;
        max: number;
    } = {
            max: 100,
            min: 1
        };

    /**
     * Set of Connection setup guide links.
     */
    public static readonly DOC_LINK_DICTIONARY: Map<string, string> = new Map<string, string>([
        [ "apple-idp", "develop.connections.newConnection.apple.learnMore" ],
        [ "duo-idp", "develop.connections.newConnection.duo.learnMore" ],
        [ "enterprise-protocols", "develop.connections.newConnection.learnMore" ],
        [ "facebook-idp", "develop.connections.newConnection.facebook.learnMore" ],
        [ "github-idp", "develop.connections.newConnection.github.learnMore" ],
        [ "google-idp", "develop.connections.newConnection.google.learnMore" ],
        [ "hypr-idp", "develop.connections.newConnection.hypr.learnMore" ],
        [ "iproov-idp", "develop.connections.newConnection.iProov.learnMore" ],
        [ "microsoft-idp", "develop.connections.newConnection.microsoft.learnMore" ],
        [ "enterprise-oidc-idp", "develop.connections.newConnection.enterprise.oidcLearnMore.learnMore" ],
        [ "enterprise-saml-idp", "develop.connections.newConnection.enterprise.samlLearnMore.learnMore" ],
        [ "swe-idp", "develop.connections.newConnection.siwe.learnMore" ],
        [ "trusted-token-issuer", "develop.connections.newConnection.trustedTokenIssuer.learnMore" ]
    ]);

    /**
     * Set of connection template group Ids.
     */
    public static readonly CONNECTION_TEMPLATE_GROUPS: {
        CUSTOM_AUTHENTICATION: string;
        ENTERPRISE_PROTOCOLS: string;
    } = {
            CUSTOM_AUTHENTICATION: "custom-authentication",
            ENTERPRISE_PROTOCOLS: "enterprise-protocols"
        };

    public static readonly IMPLICIT_ACCOUNT_LINKING_ATTRIBUTES: string[] = [
        ClaimManagementConstants.USER_NAME_CLAIM_URI,
        ClaimManagementConstants.EMAIL_CLAIM_URI,
        ClaimManagementConstants.MOBILE_CLAIM_URI
    ];

    /**
     * Attribute key for Private Key in Google Outbound Provisioning connector.
     */
    public static readonly GOOGLE_PRIVATE_KEY: string = "google_prov_private_key";

    /**
     * Attribute key for Passive STS User ID Location.
     */
    public static readonly USER_ID_IN_CLAIMS: string = "IsUserIdInClaims";

    public static readonly SHOW_PREDEFINED_TEMPLATES_IN_EXPERT_MODE_SETUP: boolean = false;

    /**
     * Custom authentication constants.
     */
    public static readonly CUSTOM_AUTHENTICATION_CONSTANTS: {
        EMPTY_STRING: string,
        EXTERNAL_AUTHENTICATOR: AvailableCustomAuthentications,
        INTERNAL_AUTHENTICATOR: AvailableCustomAuthentications,
        TWO_FACTOR_AUTHENTICATOR: AvailableCustomAuthentications,
        EXTERNAL_CUSTOM_AUTHENTICATOR_ID: string,
        INTERNAL_CUSTOM_AUTHENTICATOR_ID: string,
        TWO_FACTOR_CUSTOM_AUTHENTICATOR_ID: string,
    } = {
            EMPTY_STRING: "",
            EXTERNAL_AUTHENTICATOR: "external",
            EXTERNAL_CUSTOM_AUTHENTICATOR_ID: "external-custom-authentication",
            INTERNAL_AUTHENTICATOR: "internal",
            INTERNAL_CUSTOM_AUTHENTICATOR_ID: "internal-user-custom-authentication",
            TWO_FACTOR_AUTHENTICATOR: "two-factor",
            TWO_FACTOR_CUSTOM_AUTHENTICATOR_ID: "two-factor-custom-authentication"
        };
}
