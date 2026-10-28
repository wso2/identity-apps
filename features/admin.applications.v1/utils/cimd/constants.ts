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

import { CimdKnownClientInterface, CimdTokenEndpointAuthMethods } from "./models";
import { ApplicationManagementConstants } from "../../constants/application-management";

/**
 * Constants for OAuth Client ID Metadata Document (CIMD) clients.
 */
export class CimdConstants {

    private constructor() { }

    public static readonly CALLBACK_URL_REGEXP_PREFIX: string = "regexp=";

    public static readonly LOOPBACK_IP_HOSTS: string[] = [ "127.0.0.1", "[::1]" ];

    /**
     * MCP clients that can be registered from the MCP client template. Each entry copies the client's
     * published metadata document, with grants narrowed to the authorization code and refresh token grants.
     */
    public static readonly KNOWN_CLIENTS: CimdKnownClientInterface[] = [
        {
            clientId: "https://claude.ai/oauth/mcp-oauth-client-metadata",
            clientUri: "https://claude.ai",
            grantTypes: [
                ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
                ApplicationManagementConstants.REFRESH_TOKEN_GRANT
            ],
            key: "claude",
            name: "Claude",
            redirectUris: [ "https://claude.ai/api/mcp/auth_callback" ],
            tokenEndpointAuthMethod: CimdTokenEndpointAuthMethods.NONE
        },
        {
            clientId: "https://chatgpt.com/oauth/client.json",
            clientUri: "https://chatgpt.com/",
            grantTypes: [
                ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
                ApplicationManagementConstants.REFRESH_TOKEN_GRANT
            ],
            jwksUri: "https://chatgpt.com/oauth/jwks.json",
            key: "chatgpt",
            name: "ChatGPT",
            redirectUris: [ "https://chatgpt.com/connector_platform_oauth_redirect" ],
            tokenEndpointAuthMethod: CimdTokenEndpointAuthMethods.PRIVATE_KEY_JWT
        },
        {
            clientId: "https://vscode.dev/oauth/client-metadata.json",
            clientUri: "https://vscode.dev/product",
            grantTypes: [
                ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
                ApplicationManagementConstants.REFRESH_TOKEN_GRANT
            ],
            key: "vscode",
            name: "Visual Studio Code",
            redirectUris: [ "http://127.0.0.1:33418/", "https://vscode.dev/redirect" ],
            tokenEndpointAuthMethod: CimdTokenEndpointAuthMethods.NONE
        }
    ];
}
