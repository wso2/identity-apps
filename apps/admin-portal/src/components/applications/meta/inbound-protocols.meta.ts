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

export const InboundProtocolsMeta = [
    {
        displayName: "OpenID Connect",
        logo: "oidc",
        name: "oidc",
        type: "oauth2"
    },
    {
        displayName: "OpenID",
        logo: "openid",
        name: "openid",
        type: "openid"
    },
    {
        displayName: "SAML 2.0",
        logo: "saml",
        name: "saml",
        type: "samlsso"
    },
    {
        displayName: "WS-Federation",
        logo: "wsFed",
        name: "ws-federation",
        type: "passivests"
    },
    {
        displayName: "WS-Trust",
        logo: "wsTrust",
        name: "ws-trust",
        type: "wstrust"
    }
];
