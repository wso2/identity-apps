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

import cloneDeep from "lodash-es/cloneDeep";
import mergeWith from "lodash-es/mergeWith";
import { CimdConstants } from "./constants";
import { CimdKnownClientInterface, CimdTokenEndpointAuthMethods } from "./models";
import { CertificateTypeInterface, MainApplicationInterface } from "../../models/application";
import { OIDCDataInterface, SupportedAccessTokenBindingTypes } from "../../models/application-inbound";

/**
 * Finds the known CIMD client registered with the given OAuth client ID.
 *
 * @param clientId - OAuth client ID of an application.
 * @returns The known client, or undefined when the client ID is not one of them.
 */
export const getCimdKnownClient = (clientId: string): CimdKnownClientInterface | undefined => {
    return CimdConstants.KNOWN_CLIENTS.find((client: CimdKnownClientInterface) => client.clientId === clientId);
};

/**
 * Escapes a redirect URI so it matches only itself inside a `regexp=` callback. Loopback IP URIs stay as they are,
 * because IS finds the literal loopback address in the pattern to accept any port.
 *
 * @param redirectUri - Redirect URI.
 * @returns The redirect URI as a regular expression.
 */
const toCallbackPattern = (redirectUri: string): string => {
    if (CimdConstants.LOOPBACK_IP_HOSTS.includes(new URL(redirectUri).hostname)) {
        return redirectUri;
    }

    return redirectUri.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Builds the callback URL list in the format IS stores: a single URL as is, several as `regexp=(a|b)`.
 *
 * @param redirectUris - Redirect URIs.
 * @returns Callback URL list.
 */
export const buildCimdCallbackUrls = (redirectUris: string[]): string[] => {
    if (redirectUris.length > 1) {
        return [ `${ CimdConstants.CALLBACK_URL_REGEXP_PREFIX }(${ redirectUris.map(toCallbackPattern).join("|") })` ];
    }

    return [ ...redirectUris ];
};

const replaceArrays = (_target: unknown, source: unknown): unknown[] | undefined => {
    return Array.isArray(source) ? [ ...source ] : undefined;
};

/**
 * Builds the application create request body for a known CIMD client.
 *
 * @param reviewed - The known client.
 * @param base - Optional template payload to merge over, for example the MCP client template.
 * @returns Application create request body.
 */
export const buildCimdApplicationPayload = (
    reviewed: CimdKnownClientInterface,
    base?: MainApplicationInterface
): MainApplicationInterface => {
    const isPrivateKeyJwt: boolean =
        reviewed.tokenEndpointAuthMethod === CimdTokenEndpointAuthMethods.PRIVATE_KEY_JWT;
    const oidc: OIDCDataInterface = {
        // The client refreshes tokens from its own servers, without the browser's cookie, so tokens are not bound.
        accessToken: {
            bindingType: SupportedAccessTokenBindingTypes.NONE,
            revokeTokensWhenIDPSessionTerminated: false,
            validateTokenBinding: false
        },
        // CIMD clients call the token endpoint server-side, so no callback origin is allowed for CORS.
        allowedOrigins: [],
        callbackURLs: buildCimdCallbackUrls(reviewed.redirectUris),
        clientId: reviewed.clientId,
        grantTypes: [ ...reviewed.grantTypes ],
        pkce: {
            mandatory: true,
            supportPlainTransformAlgorithm: false
        },
        publicClient: !isPrivateKeyJwt
    };
    const cimdPayload: MainApplicationInterface = {
        inboundProtocolConfiguration: { oidc },
        name: reviewed.name
    };

    if (reviewed.clientUri) {
        cimdPayload.accessUrl = reviewed.clientUri;
    }

    if (isPrivateKeyJwt) {
        oidc.clientAuthentication = {
            // IS rejects the request unless the reuse setting is explicitly false.
            tokenEndpointAllowReusePvtKeyJwt: false,
            tokenEndpointAuthMethod: CimdTokenEndpointAuthMethods.PRIVATE_KEY_JWT
        };
        cimdPayload.advancedConfigurations = {
            certificate: {
                type: CertificateTypeInterface.JWKS,
                value: reviewed.jwksUri
            }
        };
    }

    const payload: MainApplicationInterface = mergeWith(
        cloneDeep(base ?? {}) as MainApplicationInterface,
        cimdPayload,
        replaceArrays
    );
    const mergedOidc: OIDCDataInterface = payload.inboundProtocolConfiguration.oidc;

    delete mergedOidc.clientSecret;
    delete mergedOidc.clientSecretExpiresAt;

    if (!isPrivateKeyJwt) {
        delete mergedOidc.clientAuthentication;
        delete payload.advancedConfigurations?.certificate;
    }

    return payload;
};
