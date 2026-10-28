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

import { CHATGPT_CLIENT_ID, CLAUDE_CLIENT_ID, VSCODE_CLIENT_ID } from "./fixtures";
import { CertificateTypeInterface, MainApplicationInterface } from "../../../models/application";
import {
    buildCimdApplicationPayload,
    buildCimdCallbackUrls,
    getCimdKnownClient
} from "../build-cimd-application-payload";
import { CimdKnownClientInterface } from "../models";

const known = (clientId: string): CimdKnownClientInterface => structuredClone(getCimdKnownClient(clientId));

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
            .toEqual([ "regexp=(http://127.0.0.1:33418/|https://vscode.dev/redirect)" ]);
    });

    it("does not modify the input", () => {
        const uris: string[] = [ "https://claude.ai/cb" ];

        expect(buildCimdCallbackUrls(uris)).not.toBe(uris);
    });
});

describe("buildCimdApplicationPayload", () => {
    it("builds a public client for Claude", () => {
        expect(buildCimdApplicationPayload(known(CLAUDE_CLIENT_ID))).toEqual({
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
        expect(buildCimdApplicationPayload(known(CHATGPT_CLIENT_ID))).toEqual({
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
            known(VSCODE_CLIENT_ID));

        expect(payload.inboundProtocolConfiguration.oidc.callbackURLs)
            .toEqual([ "regexp=(http://127.0.0.1:33418/|https://vscode.dev/redirect)" ]);
        expect(payload.inboundProtocolConfiguration.oidc.publicClient).toBe(true);
        expect(payload.inboundProtocolConfiguration.oidc.allowedOrigins).toEqual([]);
        expect(payload.name).toBe("Visual Studio Code");
        expect(payload.accessUrl).toBe("https://vscode.dev/product");
    });

    it("omits accessUrl when there is no client URI", () => {
        const reviewed: CimdKnownClientInterface = known(CLAUDE_CLIENT_ID);

        delete reviewed.clientUri;

        expect(buildCimdApplicationPayload(reviewed)).not.toHaveProperty("accessUrl");
    });

    it("merges a public client over a template, replacing lists and dropping secrets and keys", () => {
        const base: MainApplicationInterface = structuredClone(MCP_TEMPLATE_PAYLOAD);
        const payload: MainApplicationInterface = buildCimdApplicationPayload(
            known(VSCODE_CLIENT_ID), base);

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
                    callbackURLs: [ "regexp=(http://127.0.0.1:33418/|https://vscode.dev/redirect)" ],
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
            known(CHATGPT_CLIENT_ID), MCP_TEMPLATE_PAYLOAD);
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
            buildCimdApplicationPayload(known(CLAUDE_CLIENT_ID)),
            buildCimdApplicationPayload(known(CHATGPT_CLIENT_ID), MCP_TEMPLATE_PAYLOAD)
        ];

        payloads.forEach((payload: MainApplicationInterface) => {
            expect(JSON.stringify(payload)).not.toContain("clientSecret");
        });
    });
});

describe("getCimdKnownClient", () => {
    it("finds a known client by its exact client ID", () => {
        expect(getCimdKnownClient(CLAUDE_CLIENT_ID)?.key).toBe("claude");
    });

    it("returns undefined for any other client ID", () => {
        expect(getCimdKnownClient(CLAUDE_CLIENT_ID + "/")).toBeUndefined();
        expect(getCimdKnownClient("A1b2C3d4E5f6G7h8")).toBeUndefined();
    });
});
