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

    public static readonly BASIC_AUTHENTICATOR_ID: string = "QmFzaWNBdXRoZW50aWNhdG9y";

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
