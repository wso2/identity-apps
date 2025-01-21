/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { createRef } from "react";

export default function useInboundOidcForm() {
    const refNames: string[] = [
        "clientSecret",
        "grant",
        "url",
        "allowedOrigin",
        "supportPublicClients",
        "pkce",
        "hybridFlowEnableConfig",
        "hybridFlow",
        "bindingType",
        "type",
        "validateTokenBinding",
        "revokeAccessToken",
        "userAccessTokenExpiryInSeconds",
        "applicationAccessTokenExpiryInSeconds",
        "refreshToken",
        "expiryInSeconds",
        "audience",
        "encryption",
        "algorithm",
        "method",
        "idTokenSignedResponseAlg",
        "idExpiryInSeconds",
        "backChannelLogoutUrl",
        "frontChannelLogoutUrl",
        "enableRequestObjectSignatureValidation",
        "scopeValidator",
        "formRef",
        "updateRef",
        "tokenEndpointAuthMethod",
        "tokenEndpointAllowReusePvtKeyJwt",
        "tokenEndpointAuthSigningAlg",
        "tlsClientAuthSubjectDn",
        "requirePushedAuthorizationRequests",
        "requestObjectSigningAlg",
        "requestObjectEncryptionAlgorithm",
        "requestObjectEncryptionMethod",
        "subjectToken",
        "applicationSubjectTokenExpiryInSeconds"
    ];

    // Create refs individually and store them in an object
    const refs: Record<string, any> =
        refNames.reduce(
            (acc: Record<string, any>, name: string) => {
                acc[name] = createRef<HTMLElement | null>();

                return acc;
            }, {});

    return { refs };
}
