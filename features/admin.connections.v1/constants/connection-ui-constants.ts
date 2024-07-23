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
}
