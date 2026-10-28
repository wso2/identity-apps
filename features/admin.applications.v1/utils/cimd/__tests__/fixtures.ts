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

// Client metadata documents as the vendors serve them.

export const CLAUDE_CLIENT_ID: string = "https://claude.ai/oauth/mcp-oauth-client-metadata";

export const CLAUDE_DOCUMENT: string = "{\"client_id\":\"https://claude.ai/oauth/mcp-oauth-client-metadata\","
    + "\"client_name\":\"Claude\",\"client_uri\":\"https://claude.ai\","
    + "\"redirect_uris\":[\"https://claude.ai/api/mcp/auth_callback\"],"
    + "\"grant_types\":[\"authorization_code\",\"refresh_token\","
    + "\"urn:ietf:params:oauth:grant-type:jwt-bearer\"],"
    + "\"response_types\":[\"code\"],\"token_endpoint_auth_method\":\"none\"}";

export const CHATGPT_CLIENT_ID: string = "https://chatgpt.com/oauth/client.json";

export const CHATGPT_DOCUMENT: string = "{\"client_id\":\"https://chatgpt.com/oauth/client.json\","
    + "\"client_uri\":\"https://chatgpt.com/\","
    + "\"redirect_uris\":[\"https://chatgpt.com/connector_platform_oauth_redirect\"],"
    + "\"token_endpoint_auth_method\":\"private_key_jwt\","
    + "\"token_endpoint_auth_methods_supported\":[\"none\",\"private_key_jwt\"],"
    + "\"grant_types\":[\"authorization_code\",\"refresh_token\"],\"response_types\":[\"code\"],"
    + "\"client_name\":\"ChatGPT\",\"logo_uri\":\"https://persistent.oaistatic.com/sonic/misc/openai-logo.png\","
    + "\"token_endpoint_auth_signing_alg\":\"RS256\",\"jwks_uri\":\"https://chatgpt.com/oauth/jwks.json\"}";

export const VSCODE_CLIENT_ID: string = "https://vscode.dev/oauth/client-metadata.json";

export const VSCODE_DOCUMENT: string = "{\"client_name\":\"Visual Studio Code\","
    + "\"logo_uri\":\"https://code.visualstudio.com/assets/branding/code-stable.png\","
    + "\"grant_types\":[\"authorization_code\",\"refresh_token\","
    + "\"urn:ietf:params:oauth:grant-type:device_code\"],"
    + "\"response_types\":[\"code\"],\"token_endpoint_auth_method\":\"none\",\"application_type\":\"native\","
    + "\"client_id\":\"https://vscode.dev/oauth/client-metadata.json\",\"client_uri\":\"https://vscode.dev/product\","
    + "\"redirect_uris\":[\"http://127.0.0.1:33418/\",\"https://vscode.dev/redirect\"]}";
