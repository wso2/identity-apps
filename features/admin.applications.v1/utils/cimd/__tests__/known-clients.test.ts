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

import { CHATGPT_DOCUMENT, CLAUDE_DOCUMENT, VSCODE_DOCUMENT } from "./fixtures";
import { CimdConstants } from "../constants";
import { CimdKnownClientInterface } from "../models";

interface PublishedDocumentInterface {
    client_id: string;
    client_name: string;
    client_uri: string;
    redirect_uris: string[];
    token_endpoint_auth_method: string;
    jwks_uri?: string;
    grant_types: string[];
}

const SUPPORTED_GRANTS: string[] = [ "authorization_code", "refresh_token" ];
const LOOPBACK_HOSTS: string[] = [ "127.0.0.1", "[::1]" ];

describe("CimdConstants.KNOWN_CLIENTS", () => {
    it.each([
        [ "claude", CLAUDE_DOCUMENT ],
        [ "chatgpt", CHATGPT_DOCUMENT ],
        [ "vscode", VSCODE_DOCUMENT ]
    ])("matches the published document of %s", (key: string, json: string) => {
        const doc: PublishedDocumentInterface = JSON.parse(json);
        const client: CimdKnownClientInterface = CimdConstants.KNOWN_CLIENTS
            .find((known: CimdKnownClientInterface) => known.key === key);

        expect(client.clientId).toBe(doc.client_id);
        expect(client.name).toBe(doc.client_name);
        expect(client.clientUri).toBe(doc.client_uri);
        expect(client.redirectUris).toEqual(doc.redirect_uris);
        expect(client.tokenEndpointAuthMethod).toBe(doc.token_endpoint_auth_method);
        expect(client.jwksUri).toBe(doc.jwks_uri);
        expect(client.grantTypes)
            .toEqual(SUPPORTED_GRANTS.filter((grant: string) => doc.grant_types.includes(grant)));
    });

    it.each(CimdConstants.KNOWN_CLIENTS.map((client: CimdKnownClientInterface) => [ client.key, client ]))(
        "keeps %s within what IS can store and match", (_key: string, client: CimdKnownClientInterface) => {
            const origin: string = new URL(client.clientId).origin;

            // IS stores the client ID and the JWKS URI in VARCHAR(255) columns.
            expect(client.clientId.length).toBeLessThanOrEqual(255);
            expect(client.jwksUri?.length ?? 0).toBeLessThanOrEqual(255);
            if (client.jwksUri) {
                expect(new URL(client.jwksUri).origin).toBe(origin);
            }
            client.redirectUris.forEach((uri: string) => {
                const parsed: URL = new URL(uri);
                const isLoopback: boolean = parsed.protocol === "http:" && LOOPBACK_HOSTS.includes(parsed.hostname);

                expect(isLoopback || parsed.origin === origin).toBe(true);
                // Several URIs are stored as `regexp=(a|b)`.
                expect(uri).not.toMatch(/[|()?*+[\]{}^$\\]/);
            });
        });

    it("has unique keys and client IDs", () => {
        const clients: CimdKnownClientInterface[] = CimdConstants.KNOWN_CLIENTS;

        expect(new Set(clients.map((client: CimdKnownClientInterface) => client.key)).size).toBe(clients.length);
        expect(new Set(clients.map((client: CimdKnownClientInterface) => client.clientId)).size)
            .toBe(clients.length);
    });
});
