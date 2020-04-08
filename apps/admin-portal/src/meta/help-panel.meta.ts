/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { HelpPanelMetadataInterface } from "../models";

/* eslint-disable max-len, sort-keys */
export const helpPanelMetadata: HelpPanelMetadataInterface = {
    applications: {
        docs: {
            adaptiveAuthentication: {
                introduction: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/adaptive-authentication.md",
                configure: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-a-service-provider-for-adaptive-authentication.md",
                scenarios: {
                    introduction: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/adaptive-authentication-scenarios.md",
                    roleBased: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-role-based-adaptive-authentication.md",
                    userAgeBased: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-user-age-based-adaptive-authentication.md",
                    tenantBased: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-tenant-based-adaptive-authentication.md",
                    userStoreBased: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-user-store-based-adaptive-authentication.md",
                    ipBased: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-ip-based-adaptive-authentication.md",
                    newDeviceBased: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-new-device-based-adaptive-authentication.md",
                    acrBased: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-acr-based-adaptive-authentication.md",
                    riskBased: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-risk-based-adaptive-authentication.md",
                    withFunctionLibrary: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/adaptive-authentication-with-function-library.md"
                }
            },
            general: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/adding-and-configuring-a-service-provider.md",
            claimMapping: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-claims-for-a-service-provider.md",
            inbound: {
                oidc: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-oauth2-openid-connect-single-sign-on.md",
                saml: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-saml2-web-single-sign-on.md",
                wsFed: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-ws-federation-single-sign-on.md",
                wsTrust: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-ws-trust-security-token-service.md"
            },
            roleMapping: "https://raw.githubusercontent.com/wso2/docs-is/5.10.0/en/docs/learn/configuring-roles-and-permissions-for-a-service-provider.md"
        },
        samples: {
            oidc: [
                {
                    name: "html",
                    displayName: "HTML",
                    image: "html",
                    repo: {
                        owner: {
                            login: "wso2/samples-is",
                            avatar: "https://avatars3.githubusercontent.com/u/533043?v=4"
                        },
                        name: "spa_html_app",
                        description: "HTML SPA Application Sample for WSO2 IS",
                        topics: [
                            "html",
                            "spa",
                            "oidc",
                            "client",
                            "wso2",
                            "wso2is",
                            "samples",
                            "iam"
                        ],
                        stars: 13,
                        watchers: 65,
                        forks: 88,
                        url: "https://github.com/wso2/samples-is/tree/master/client-samples/oidc-client-app-samples/browser-client-app-sample/SPA_HTML_app"
                    },
                    docs: "https://raw.githubusercontent.com/wso2/samples-is/master/client-samples/oidc-client-app-samples/browser-client-app-sample/README.md"
                },
                {
                    name: "react",
                    displayName: "React",
                    image: "react",
                    repo: {
                        owner: {
                            login: "wso2/samples-is",
                            avatar: "https://avatars3.githubusercontent.com/u/533043?v=4"
                        },
                        name: "spa_react_app",
                        description: "React SPA Application Sample for WSO2 IS",
                        topics: [
                            "react",
                            "spa",
                            "oidc",
                            "client",
                            "wso2",
                            "wso2is",
                            "samples",
                            "iam"
                        ],
                        stars: 13,
                        watchers: 65,
                        forks: 88,
                        url: "https://github.com/wso2/samples-is/tree/master/client-samples/oidc-client-app-samples/browser-client-app-sample/SPA_React_app"
                    },
                    docs: "https://raw.githubusercontent.com/wso2/samples-is/master/client-samples/oidc-client-app-samples/browser-client-app-sample/README.md"
                },
                {
                    name: "dotnet",
                    displayName: ".NET",
                    image: "dotNet",
                    repo: {
                        owner: {
                            login: "wso2-extensions",
                            avatar: "https://avatars0.githubusercontent.com/u/17171218?v=4"
                        },
                        name: "identity-samples-dotnet",
                        description: "Samples related to the identity written using .NET technologies.",
                        topics: [
                            ".net",
                            "oidc",
                            "sdk",
                            "wso2",
                            "wso2is",
                            "samples",
                            "iam"
                        ],
                        stars: 0,
                        watchers: 0,
                        forks: 3,
                        url: "https://github.com/wso2-extensions/identity-samples-dotnet"
                    },
                    docs: "https://raw.githubusercontent.com/wso2-extensions/identity-samples-dotnet/master/README.md"
                },
                {
                    name: "android",
                    displayName: "Android",
                    image: "android",
                    repo: {
                        owner: {
                            login: "wso2/samples-is",
                            avatar: "https://avatars3.githubusercontent.com/u/533043?v=4"
                        },
                        name: "android-client-app-sample",
                        description: "Android Client Application Sample for WSO2 IS",
                        topics: [
                            "android",
                            "oidc",
                            "client",
                            "wso2",
                            "wso2is",
                            "samples",
                            "iam"
                        ],
                        stars: 13,
                        watchers: 65,
                        forks: 88,
                        url: "https://github.com/wso2/samples-is/tree/master/client-samples/oidc-client-app-samples/android-client-app-sample"
                    },
                    docs: "https://raw.githubusercontent.com/wso2/samples-is/master/client-samples/oidc-client-app-samples/android-client-app-sample/README.md"
                },
                {
                    name: "cordova",
                    displayName: "Cordova",
                    image: "cordova",
                    repo: {
                        owner: {
                            login: "wso2/samples-is",
                            avatar: "https://avatars3.githubusercontent.com/u/533043?v=4"
                        },
                        name: "cordova-client-app-sample",
                        description: "Cordova Client Application Sample for WSO2 IS",
                        topics: [
                            "cordova",
                            "oidc",
                            "client",
                            "wso2",
                            "wso2is",
                            "samples",
                            "iam"
                        ],
                        stars: 13,
                        watchers: 65,
                        forks: 88,
                        url: "https://github.com/wso2/samples-is/tree/master/client-samples/oidc-client-app-samples/cordova-client-app-sample"
                    },
                    docs: "https://raw.githubusercontent.com/wso2/samples-is/master/client-samples/oidc-client-app-samples/cordova-client-app-sample/README.md"
                },
                {
                    name: "ios",
                    displayName: "iOS",
                    image: "apple",
                    repo: {
                        owner: {
                            login: "wso2/samples-is",
                            avatar: "https://avatars3.githubusercontent.com/u/533043?v=4"
                        },
                        name: "ios-client-app-sample",
                        description: "iOS Client Application Sample for WSO2 IS",
                        topics: [
                            "ios",
                            "apple",
                            "oidc",
                            "client",
                            "wso2",
                            "wso2is",
                            "samples",
                            "iam"
                        ],
                        stars: 13,
                        watchers: 65,
                        forks: 88,
                        url: "https://github.com/wso2/samples-is/tree/master/client-samples/oidc-client-app-samples/ios-client-app-sample"
                    },
                    docs: null
                }
            ],
            saml: [
                {
                    name: "dotnet",
                    displayName: ".NET",
                    image: "dotNet",
                    repo: {
                        owner: {
                            login: "wso2/samples-is",
                            avatar: "https://avatars3.githubusercontent.com/u/533043?v=4"
                        },
                        name: "dotnet-agent-saml-sso",
                        description: "SAML SSO .NET agent for WSO2 IS",
                        topics: [
                            ".net",
                            "saml",
                            "client",
                            "wso2",
                            "wso2is",
                            "samples",
                            "iam"
                        ],
                        stars: 13,
                        watchers: 65,
                        forks: 88,
                        url: "https://github.com/wso2/samples-is/tree/master/client-samples/dotnet/dotnet-agent-saml-sso"
                    },
                    docs: null
                }
            ]
        },
        sdks: {
            oidc: [
                {
                    owner: {
                        login: "wso2/identity-apps",
                        avatar: "https://avatars3.githubusercontent.com/u/533043?v=4"
                    },
                    name: "authenticate",
                    description: "Provide OpenID Connect (OIDC) and OAuth2 protocol support for JavaScript client applications.",
                    topics: [
                        "wso2",
                        "javascript",
                        "sdk",
                        "identityserver",
                        "iam"
                    ],
                    stars: 7,
                    watchers: 62,
                    forks: 39,
                    url: "https://github.com/wso2/identity-apps/tree/master/modules/authentication"
                },
                {
                    owner: {
                        login: "wso2-extensions",
                        avatar: "https://avatars0.githubusercontent.com/u/17171218?v=4"
                    },
                    name: "identity-sdks-dotnet",
                    description: "SDKs related to the identity written using .NET technologies.",
                    topics: [
                        ".net",
                        "sdk",
                        "oidc",
                        "wso2",
                        "iam"
                    ],
                    stars: 0,
                    watchers: 51,
                    forks: 2,
                    url: "https://github.com/wso2-extensions/identity-sdks-dotnet"
                }
            ]
        }
    }
};
/* eslint-enable max-len, sort-keys */
