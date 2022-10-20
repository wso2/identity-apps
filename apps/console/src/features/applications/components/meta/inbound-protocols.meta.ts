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

import { ApplicationManagementConstants } from "../../constants";
import { AuthProtocolMetaListItemInterface, SAMLConfigModes, SupportedAuthProtocolTypes } from "../../models";

export const InboundProtocolDefaultFallbackTemplates = new Map<string, string>([
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
    }
];

/**
 * Supported auth protocol type display name mapping.
 */
export const SupportedAuthProtocolTypeDisplayNames = {
    [ SupportedAuthProtocolTypes.SAML ]: "SAML",
    [ SupportedAuthProtocolTypes.OIDC ]: "OpenID Connect",
    [ SupportedAuthProtocolTypes.OAUTH2_OIDC ]: "OAuth2.0/OpenID Connect",
    [ SupportedAuthProtocolTypes.CUSTOM ]: "Custom"
};

/**
 * Supported auth protocol type description mapping.
 */
export const SupportedAuthProtocolTypeDescriptions = {
    [ SupportedAuthProtocolTypes.SAML ]: "Open-standard for authentication and authorization.",
    [ SupportedAuthProtocolTypes.OIDC ]: "Authentication layer on top of OAuth 2.0",
    [ SupportedAuthProtocolTypes.CUSTOM ]: "Custom protocol."
};


/**
 * SAML configuration mode display name mapping.
 */
export const SAMLConfigurationDisplayNames = {
    [ SAMLConfigModes.MANUAL ]: "Manual",
    [ SAMLConfigModes.META_FILE ]: "File Based",
    [ SAMLConfigModes.META_URL ]: "URL Based"
};
