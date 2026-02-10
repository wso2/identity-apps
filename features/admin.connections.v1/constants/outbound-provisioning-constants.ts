/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
 * Authentication mode enum for outbound provisioning connectors.
 * These values correspond to the authentication mode options in the SCIM2 connector.
 */
export enum OutboundProvisioningAuthenticationMode {
    BASIC = "basic",
    BEARER = "bearer",
    API_KEY = "apiKey",
    NONE = "none"
}

/**
 * SCIM2 outbound provisioning connector authentication property keys.
 * These keys match the property names defined in the backend SCIM2ProvisioningConnectorConstants.
 */
export const SCIM2_AUTH_PROPERTIES: Record<string, string> = {
    ACCESS_TOKEN: "scim2-access-token",
    API_KEY_HEADER: "scim2-api-key-header",
    API_KEY_VALUE: "scim2-api-key-value",
    AUTHENTICATION_MODE: "scim2-authentication-mode",
    PASSWORD: "scim2-password",
    USERNAME: "scim2-username"
};

/**
 * SCIM2 outbound provisioning connector endpoint property keys.
 * These keys identify URL fields that require validation and HTTP/HTTPS checks.
 */
export const SCIM2_URL_PROPERTIES: Record<string, string> = {
    GROUP_ENDPOINT: "scim2-group-ep",
    USER_ENDPOINT: "scim2-user-ep"
};
