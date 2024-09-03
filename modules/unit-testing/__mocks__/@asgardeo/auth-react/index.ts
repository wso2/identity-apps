/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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

import {
    AsgardeoSPAClient,
    AuthClientConfig,
    AuthContextInterface,
    Config,
    DecodedIDTokenPayload
} from "@asgardeo/auth-react";

const AsgardeoSPAClientMock: {
    getInstance: jest.Mock<AsgardeoSPAClient>
} = {
    getInstance: jest.fn().mockReturnValue({
        getOIDCServiceEndpoints: () => {
            return new Promise((resolve: any, _reject: any) => {
                resolve({
                    authorizeEndpoint: "https://localhost:9443/t/testorg/oauth2/authorize",
                    dynamicClientRegistrationEndpoint:
                        "https://localhost:9443/t/testorg/api/identity/oauth2/dcr/v1.1/register",
                    endSessionEndpoint: "https://localhost:9443/t/testorg/oidc/logout",
                    introspectionEndpoint: "https://localhost:9443/t/testorg/oauth2/introspect",
                    jwksEndpoint: "https://localhost:9443/t/testorg/oauth2/jwks",
                    mtlsPushedAuthorizationRequestEndpoint: "https://dev.mtls.asgardeo.io/t/testorg/oauth2/par",
                    mtlsTokenEndpoint: "https://dev.mtls.asgardeo.io/t/testorg/oauth2/token",
                    pushedAuthorizationRequestEndpoint: "https://localhost:9443/t/testorg/oauth2/par",
                    sessionIframeEndpoint: "https://localhost:9443/t/testorg/oidc/checksession",
                    tokenEndpoint: "https://localhost:9443/t/testorg/oauth2/token",
                    tokenRevocationEndpoint: "https://localhost:9443/t/testorg/oauth2/revoke",
                    userEndpoint: "https://localhost:9443/t/testorg/oauth2/userinfo",
                    webFingerEndpoint: "https://localhost:9443/t/testorg/.well-known/webfinger",
                    wellKnownEndpoint: "https://localhost:9443/t/testorg/oauth2/token/.well-known/openid-configuration"
                });
            });
        },
        httpRequest: jest.fn(),
        httpRequestAll: jest.fn()
    })
};

const getDecodedIDToken: jest.Mock<Promise<DecodedIDTokenPayload | undefined>> = jest.fn().mockResolvedValue({
    aud: "",
    email: "",
    iss: "",
    preferred_username: "",
    sub: "",
    tenant_domain: ""
});

const getOIDCServiceEndpoints = () => {
    return {
        "authorizationEndpoint": "",
        "checkSessionIframe": "",
        "endSessionEndpoint": "",
        "introspectionEndpoint": "",
        "issuer": "",
        "jwksUri": "",
        "registrationEndpoint": "",
        "revocationEndpoint": "",
        "tokenEndpoint": "",
        "userinfoEndpoint": ""
    };
};

const updateConfig = (_config: Partial<AuthClientConfig<Config>>) => {
    return new Promise(jest.fn());
};

enum ResponseMode {
    formPost = "form_post",
    query = "query"
}

const useAuthContext: jest.Mock<AuthContextInterface> = jest.fn().mockReturnValue({
    getDecodedIDToken,
    getOIDCServiceEndpoints,
    updateConfig
});

export {
    AsgardeoSPAClientMock as AsgardeoSPAClient,
    getDecodedIDToken,
    ResponseMode,
    useAuthContext
};
