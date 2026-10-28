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

import { CertificateTypeInterface, MainApplicationInterface } from "../../../models/application";
import {
    buildCimdApplicationPayload,
    buildCimdCallbackUrls,
    isCimdClientId
} from "../build-cimd-application-payload";
import { CimdClientMetadataInterface, CimdTokenEndpointAuthMethods } from "../models";

const CLAUDE_CLIENT_ID: string = "https://claude.ai/oauth/mcp-oauth-client-metadata";
const CHATGPT_CLIENT_ID: string = "https://chatgpt.com/oauth/client.json";
const VSCODE_CLIENT_ID: string = "https://vscode.dev/oauth/client-metadata.json";

// Preview responses, as IS returns them after reading each client's metadata document.
const PREVIEWS: Record<string, CimdClientMetadataInterface> = {
    [ CHATGPT_CLIENT_ID ]: {
        clientId: CHATGPT_CLIENT_ID,
        clientName: "ChatGPT",
        clientUri: "https://chatgpt.com/",
        grantTypes: [ "authorization_code", "refresh_token" ],
        jwksUri: "https://chatgpt.com/oauth/jwks.json",
        redirectUris: [ "https://chatgpt.com/connector_platform_oauth_redirect" ],
        tokenEndpointAuthMethod: CimdTokenEndpointAuthMethods.PRIVATE_KEY_JWT
    },
    [ CLAUDE_CLIENT_ID ]: {
        clientId: CLAUDE_CLIENT_ID,
        clientName: "Claude",
        clientUri: "https://claude.ai",
        grantTypes: [ "authorization_code", "refresh_token" ],
        redirectUris: [ "https://claude.ai/api/mcp/auth_callback" ],
        tokenEndpointAuthMethod: CimdTokenEndpointAuthMethods.NONE
    },
    [ VSCODE_CLIENT_ID ]: {
        clientId: VSCODE_CLIENT_ID,
        clientName: "Visual Studio Code",
        clientUri: "https://vscode.dev/product",
        grantTypes: [ "authorization_code", "refresh_token" ],
        redirectUris: [ "http://127.0.0.1:33418/", "https://vscode.dev/redirect" ],
        tokenEndpointAuthMethod: CimdTokenEndpointAuthMethods.NONE
    }
};

const preview = (clientId: string): CimdClientMetadataInterface => structuredClone(PREVIEWS[clientId]);

const MCP_TEMPLATE_PAYLOAD: MainApplicationInterface = {
    advancedConfigurations: {
        certificate: { type: CertificateTypeInterface.PEM, value: "-----BEGIN CERTIFICATE-----" },
        discoverableByEndUsers: false,
        skipLogoutConsent: true
    },
    associatedRoles: { allowedAudience: "APPLICATION", roles: [] },
    inboundProtocolConfiguration: {
        oidc: {
            accessToken: {
                applicationAccessTokenExpiryInSeconds: 3600,
                bindingType: "cookie",
                revokeTokensWhenIDPSessionTerminated: true,
                type: "JWT",
                validateTokenBinding: true
            },
            allowedOrigins: [ "https://template.example" ],
            callbackURLs: [ "https://template.example/a", "https://template.example/b" ],
            clientAuthentication: { tokenEndpointAuthMethod: "client_secret_basic" },
            clientId: "template-client",
            clientSecret: "template-secret",
            clientSecretExpiresAt: 0,
            grantTypes: [ "authorization_code", "client_credentials", "refresh_token" ],
            pkce: { mandatory: false, supportPlainTransformAlgorithm: true },
            publicClient: false
        }
    },
    name: "MCP client",
    templateId: "mcp-client-application",
    templateVersion: "1.0.0"
} as MainApplicationInterface;

describe("buildCimdCallbackUrls", () => {
    it("keeps a single URI as is", () => {
        expect(buildCimdCallbackUrls([ "https://claude.ai/cb" ])).toEqual([ "https://claude.ai/cb" ]);
    });

    it("combines several URIs into a regexp", () => {
        expect(buildCimdCallbackUrls([ "http://127.0.0.1:33418/", "https://vscode.dev/redirect" ]))
            .toEqual([ "regexp=(http://127.0.0.1:33418/|https://vscode\\.dev/redirect)" ]);
    });

    it("escapes every URI, keeping only the http://127.0.0.1 prefix literal for IS's loopback port matching", () => {
        expect(buildCimdCallbackUrls([ "http://127.0.0.1/x)?(.*", "https://a.example/cb?x=1" ]))
            .toEqual([ "regexp=(http://127.0.0.1/x\\)\\?\\(\\.\\*|https://a\\.example/cb\\?x=1)" ]);
        expect(new RegExp("^(" + buildCimdCallbackUrls([ "http://127.0.0.1:1/", "https://vscode.dev/r" ])[0]
            .slice("regexp=(".length)).test("https://vscode-dev/r")).toBe(false);
    });

    it("does not modify the input", () => {
        const uris: string[] = [ "https://claude.ai/cb" ];

        expect(buildCimdCallbackUrls(uris)).not.toBe(uris);
    });
});

describe("buildCimdApplicationPayload", () => {
    it("builds a public client for Claude", () => {
        expect(buildCimdApplicationPayload(preview(CLAUDE_CLIENT_ID))).toEqual({
            accessUrl: "https://claude.ai",
            inboundProtocolConfiguration: {
                oidc: {
                    accessToken: {
                        bindingType: "None",
                        revokeTokensWhenIDPSessionTerminated: false,
                        validateTokenBinding: false
                    },
                    allowedOrigins: [],
                    callbackURLs: [ "https://claude.ai/api/mcp/auth_callback" ],
                    clientId: CLAUDE_CLIENT_ID,
                    grantTypes: [ "authorization_code", "refresh_token" ],
                    pkce: { mandatory: true, supportPlainTransformAlgorithm: false },
                    publicClient: true
                }
            },
            name: "Claude"
        });
    });

    it("builds a confidential client with a JWKS certificate for ChatGPT", () => {
        expect(buildCimdApplicationPayload(preview(CHATGPT_CLIENT_ID))).toEqual({
            accessUrl: "https://chatgpt.com/",
            advancedConfigurations: {
                certificate: { type: "JWKS", value: "https://chatgpt.com/oauth/jwks.json" }
            },
            inboundProtocolConfiguration: {
                oidc: {
                    accessToken: {
                        bindingType: "None",
                        revokeTokensWhenIDPSessionTerminated: false,
                        validateTokenBinding: false
                    },
                    allowedOrigins: [],
                    callbackURLs: [ "https://chatgpt.com/connector_platform_oauth_redirect" ],
                    clientAuthentication: {
                        tokenEndpointAllowReusePvtKeyJwt: false,
                        tokenEndpointAuthMethod: "private_key_jwt"
                    },
                    clientId: CHATGPT_CLIENT_ID,
                    grantTypes: [ "authorization_code", "refresh_token" ],
                    pkce: { mandatory: true, supportPlainTransformAlgorithm: false },
                    publicClient: false
                }
            },
            name: "ChatGPT"
        });
    });

    it("builds a regexp callback for VS Code's two redirect URIs", () => {
        const payload: MainApplicationInterface = buildCimdApplicationPayload(
            preview(VSCODE_CLIENT_ID));

        expect(payload.inboundProtocolConfiguration.oidc.callbackURLs)
            .toEqual([ "regexp=(http://127.0.0.1:33418/|https://vscode\\.dev/redirect)" ]);
        expect(payload.inboundProtocolConfiguration.oidc.publicClient).toBe(true);
        expect(payload.inboundProtocolConfiguration.oidc.allowedOrigins).toEqual([]);
        expect(payload.name).toBe("Visual Studio Code");
        expect(payload.accessUrl).toBe("https://vscode.dev/product");
    });

    it("omits accessUrl when there is no client URI", () => {
        const reviewed: CimdClientMetadataInterface = preview(CLAUDE_CLIENT_ID);

        delete reviewed.clientUri;

        expect(buildCimdApplicationPayload(reviewed)).not.toHaveProperty("accessUrl");
    });

    it("merges a public client over a template, replacing lists and dropping secrets and keys", () => {
        const base: MainApplicationInterface = structuredClone(MCP_TEMPLATE_PAYLOAD);
        const payload: MainApplicationInterface = buildCimdApplicationPayload(
            preview(VSCODE_CLIENT_ID), base);

        expect(payload).toEqual({
            accessUrl: "https://vscode.dev/product",
            advancedConfigurations: { discoverableByEndUsers: false, skipLogoutConsent: true },
            associatedRoles: { allowedAudience: "APPLICATION", roles: [] },
            inboundProtocolConfiguration: {
                oidc: {
                    accessToken: {
                        applicationAccessTokenExpiryInSeconds: 3600,
                        bindingType: "None",
                        revokeTokensWhenIDPSessionTerminated: false,
                        type: "JWT",
                        validateTokenBinding: false
                    },
                    allowedOrigins: [],
                    callbackURLs: [ "regexp=(http://127.0.0.1:33418/|https://vscode\\.dev/redirect)" ],
                    clientId: VSCODE_CLIENT_ID,
                    grantTypes: [ "authorization_code", "refresh_token" ],
                    pkce: { mandatory: true, supportPlainTransformAlgorithm: false },
                    publicClient: true
                }
            },
            name: "Visual Studio Code",
            templateId: "mcp-client-application",
            templateVersion: "1.0.0"
        });
        expect(base).toEqual(MCP_TEMPLATE_PAYLOAD);
    });

    it("merges a private_key_jwt client over a template", () => {
        const payload: MainApplicationInterface = buildCimdApplicationPayload(
            preview(CHATGPT_CLIENT_ID), MCP_TEMPLATE_PAYLOAD);
        const oidc: MainApplicationInterface["inboundProtocolConfiguration"]["oidc"] =
            payload.inboundProtocolConfiguration.oidc;

        expect(oidc.clientAuthentication).toEqual({
            tokenEndpointAllowReusePvtKeyJwt: false,
            tokenEndpointAuthMethod: "private_key_jwt"
        });
        expect(oidc).not.toHaveProperty("clientSecret");
        expect(oidc).not.toHaveProperty("clientSecretExpiresAt");
        expect(oidc.publicClient).toBe(false);
        expect(oidc.grantTypes).toEqual([ "authorization_code", "refresh_token" ]);
        expect(payload.advancedConfigurations).toEqual({
            certificate: { type: "JWKS", value: "https://chatgpt.com/oauth/jwks.json" },
            discoverableByEndUsers: false,
            skipLogoutConsent: true
        });
        expect(payload.templateId).toBe("mcp-client-application");
    });

    it("never sets a client secret", () => {
        const payloads: MainApplicationInterface[] = [
            buildCimdApplicationPayload(preview(CLAUDE_CLIENT_ID)),
            buildCimdApplicationPayload(preview(CHATGPT_CLIENT_ID), MCP_TEMPLATE_PAYLOAD)
        ];

        payloads.forEach((payload: MainApplicationInterface) => {
            expect(JSON.stringify(payload)).not.toContain("clientSecret");
        });
    });
});

describe("isCimdClientId", () => {
    it("accepts an https URL", () => {
        expect(isCimdClientId(CLAUDE_CLIENT_ID)).toBe(true);
        expect(isCimdClientId("https://client.example")).toBe(true);
    });

    it("rejects other schemes", () => {
        expect(isCimdClientId("http://client.example/metadata.json")).toBe(false);
        expect(isCimdClientId("urn:client:example")).toBe(false);
    });

    it("rejects a client ID that is not a URL", () => {
        expect(isCimdClientId("A1b2C3d4E5f6G7h8")).toBe(false);
        expect(isCimdClientId("")).toBe(false);
        expect(isCimdClientId(undefined)).toBe(false);
    });
});
