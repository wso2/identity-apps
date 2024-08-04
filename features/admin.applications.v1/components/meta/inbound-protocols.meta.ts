/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { ApplicationManagementConstants } from "../../constants";
import {
    AuthProtocolMetaListItemInterface,
    SAMLConfigModes,
    SAMLConfigurationInterface,
    SupportedAuthProtocolTypes,
    SupportedAuthProtocolTypesInterface,
    SupportedCustomAuthProtocolTypes
} from "../../models";

export const InboundProtocolDefaultFallbackTemplates: Map<string, string> = new Map<string, string>([
    [ "passivests", ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS ],
    [ "openid", ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ],
    [ "oauth2", ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ],
    [ "samlsso", ApplicationManagementConstants.CUSTOM_APPLICATION_SAML ]
]);

export const InboundProtocolsMeta: AuthProtocolMetaListItemInterface[] = [
    {
        displayName: "OpenID Connect",
        enabled: true,
        id: "oidc",
        logo: "oidc",
        name: "oidc",
        type: "oauth2"
    },
    {
        displayName: "OpenID",
        enabled: false,
        id: "openid",
        logo: "openid",
        name: "openid",
        type: "openid"
    },
    {
        displayName: "SAML 2.0",
        enabled: true,
        id: "saml",
        logo: "saml",
        name: "saml",
        type: "samlsso"
    },
    {
        displayName: "WS-Federation",
        enabled: true,
        id: "passive-sts",
        logo: "wsFed",
        name: "ws-federation",
        type: "passivests"
    },
    {
        displayName: "WS-Trust",
        enabled: true,
        id: "ws-trust",
        logo: "wsTrust",
        name: "ws-trust",
        type: "wstrust"
    }
];

/**
 * Supported auth protocol type display name mapping.
 */
export const SupportedAuthProtocolTypeDisplayNames: SupportedAuthProtocolTypesInterface = {
    [ SupportedAuthProtocolTypes.SAML ]: "SAML",
    [ SupportedAuthProtocolTypes.OIDC ]: "OpenID Connect",
    [ SupportedAuthProtocolTypes.OAUTH2_OIDC ]: "OAuth2.0/OpenID Connect",
    [ SupportedAuthProtocolTypes.WS_FEDERATION ]: "WS-Federation",
    [ SupportedAuthProtocolTypes.WS_TRUST ]: "WS-Trust",
    [ SupportedAuthProtocolTypes.CUSTOM ]: "Custom",
    [ SupportedAuthProtocolTypes.OAUTH2 ]: "OAuth 2.0",
    [ SupportedCustomAuthProtocolTypes.CAS ]: "CAS Authenticator",
    [ SupportedCustomAuthProtocolTypes.JWT_SSO ]: "JWT SSO Authenticator"
};

/**
 * Supported auth protocol type description mapping.
 */
export const SupportedAuthProtocolTypeDescriptions: SupportedAuthProtocolTypesInterface = {
    [ SupportedAuthProtocolTypes.SAML ]: "Open-standard for authentication and authorization.",
    [ SupportedAuthProtocolTypes.OIDC ]: "Authentication layer on top of OAuth 2.0",
    [ SupportedAuthProtocolTypes.WS_FEDERATION ]: "Enable STS in a web browser.",
    [ SupportedAuthProtocolTypes.WS_TRUST ]: "Standard that provides extensions to WS-Security.",
    [ SupportedAuthProtocolTypes.CUSTOM ]: "Custom protocol."
};


/**
 * SAML configuration mode display name mapping.
 */
export const SAMLConfigurationDisplayNames: SAMLConfigurationInterface = {
    [ SAMLConfigModes.MANUAL ]: "Manual",
    [ SAMLConfigModes.META_FILE ]: "File Based",
    [ SAMLConfigModes.META_URL ]: "URL Based"
};
