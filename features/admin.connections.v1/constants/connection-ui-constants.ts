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
        FIDO_AUTHENTICATOR_CONFIG_UPDATE_ERROR: string;
        FIDO_AUTHENTICATOR_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR: string;
        FIDO_TRUSTED_APPS_UPDATE_ERROR: string;
        FIDO_TRUSTED_APPS_UPDATE_INVALID_STATUS_CODE_ERROR: string;
        IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_ERROR: string;
        IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR: string;
        LOCAL_AUTHENTICATORS_FETCH_ERROR: string;
        LOCAL_AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR: string;
    } = {
            AUTHENTICATORS_FETCH_ERROR: "An error occurred while fetching the authenticators.",
            AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR: "Received an invalid status code while fetching the authenticators.",
            COMBINED_AUTHENTICATOR_FETCH_ERROR: "An error occurred while fetching the local and federated authenticators.",
            FIDO_AUTHENTICATOR_CONFIG_UPDATE_ERROR: "An error occurred while updating the Passkey connector configs.",
            FIDO_AUTHENTICATOR_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR: "Received an invalid status code while updating the Passkey connector configs.",
            FIDO_TRUSTED_APPS_UPDATE_ERROR: "An error occurred while updating the Passkey trusted apps.",
            FIDO_TRUSTED_APPS_UPDATE_INVALID_STATUS_CODE_ERROR: "Received an invalid status code while updating the Passkey trusted apps.",
            IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_ERROR: "An error occurred while fetching the required connection templates list.",
            IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR: "Received an invalid status code while fetching connection templates list.",
            LOCAL_AUTHENTICATORS_FETCH_ERROR: "An error occurred while fetching the local authenticators.",
            LOCAL_AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR: "Received an invalid status code while fetching local authenticators."
        };
    /* eslint-enable max-len */

    public static readonly ERROR_CODES: {
        FIDO_CONNECTOR_CONFIGS_NOT_CONFIGURED_ERROR_CODE: string;
    } = {
            FIDO_CONNECTOR_CONFIGS_NOT_CONFIGURED_ERROR_CODE: "CONFIGM_00017"
        };
}
