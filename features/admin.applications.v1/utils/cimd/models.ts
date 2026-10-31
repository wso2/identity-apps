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
 * Token endpoint authentication methods of CIMD clients.
 */
export enum CimdTokenEndpointAuthMethods {
    NONE = "none",
    PRIVATE_KEY_JWT = "private_key_jwt"
}

/**
 * A known MCP client offered in the MCP client template, read from the deployment configuration.
 */
export interface CimdKnownClientInterface {
    name: string;
    /**
     * The Client Identifier URL.
     */
    clientId: string;
}

/**
 * The values IS reads from a client's Client ID Metadata Document (CIMD) and checks before the client is created.
 */
export interface CimdClientMetadataInterface {
    /**
     * The Client Identifier URL. Stored as the OAuth client ID, byte for byte.
     */
    clientId: string;
    clientName: string;
    clientUri?: string;
    redirectUris: string[];
    tokenEndpointAuthMethod: CimdTokenEndpointAuthMethods;
    /**
     * Only for `private_key_jwt`.
     */
    jwksUri?: string;
    grantTypes: string[];
}

/**
 * The part of the organization's OAuth2 inbound configuration that turns on CIMD.
 */
export interface CimdOAuth2InboundConfigInterface {
    enableClientIdMetadataDocument?: boolean;
}
