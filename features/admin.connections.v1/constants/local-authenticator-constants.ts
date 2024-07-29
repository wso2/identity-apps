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
 * This class contains the constants for the Local Authenticators.
 */
export class LocalAuthenticatorConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    /**
     * Identifier for the local IDP.
     */
    public static readonly LOCAL_IDP_IDENTIFIER: string = "LOCAL";

    /**
     * Authenticator IDs for the local authenticators.
     */
    public static readonly AUTHENTICATOR_IDS: {
        ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID: string;
        BACKUP_CODE_AUTHENTICATOR_ID: string;
        BASIC_AUTHENTICATOR_ID: string;
        EMAIL_OTP_AUTHENTICATOR_ID: string;
        FIDO_AUTHENTICATOR_ID: string;
        IDENTIFIER_FIRST_AUTHENTICATOR_ID: string;
        JWT_BASIC_AUTHENTICATOR_ID: string;
        MAGIC_LINK_AUTHENTICATOR_ID: string;
        TOTP_AUTHENTICATOR_ID: string;
        X509_CERTIFICATE_AUTHENTICATOR_ID: string;
    } = {
            ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID: "U2Vzc2lvbkV4ZWN1dG9y",
            BACKUP_CODE_AUTHENTICATOR_ID: "YmFja3VwLWNvZGUtYXV0aGVudGljYXRvcg",
            BASIC_AUTHENTICATOR_ID: "QmFzaWNBdXRoZW50aWNhdG9y",
            EMAIL_OTP_AUTHENTICATOR_ID: "ZW1haWwtb3RwLWF1dGhlbnRpY2F0b3I",
            FIDO_AUTHENTICATOR_ID: "RklET0F1dGhlbnRpY2F0b3I",
            IDENTIFIER_FIRST_AUTHENTICATOR_ID: "SWRlbnRpZmllckV4ZWN1dG9y",
            JWT_BASIC_AUTHENTICATOR_ID: "SldUQmFzaWNBdXRoZW50aWNhdG9y",
            MAGIC_LINK_AUTHENTICATOR_ID: "TWFnaWNMaW5rQXV0aGVudGljYXRvcg",
            TOTP_AUTHENTICATOR_ID: "dG90cA",
            X509_CERTIFICATE_AUTHENTICATOR_ID: "eDUwOUNlcnRpZmljYXRlQXV0aGVudGljYXRvcg"
        };

    // FIDO authenticator constants.
    /**
     * Separator for the FIDO trusted apps.
     */
    public static readonly FIDO_TRUSTED_APPS_SHA_SEPARATOR: string = "|";

    /**
     * Name of the FIDO connector configuration.
     */
    public static readonly FIDO_CONNECTOR_CONFIG_NAME: string = "fido-connector";

    /**
     * Attribute key for the trusted origins in the FIDO connector configuration.
     */
    public static readonly FIDO_TRUSTED_ORIGINS_ATTRIBUTE_KEY: string = "FIDO2TrustedOrigins";
}
