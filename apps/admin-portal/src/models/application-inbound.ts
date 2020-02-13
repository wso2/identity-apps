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

/**
 * Captures the auth protocols
 */
export interface AuthProtocolMetaListItemInterface {
    name: string;
    displayName: string;
    enabled?: boolean;
    id?: string;
    logo?: string;
    type?: string;
}

export interface MetadataPropertyInterface {
    options?: string[];
    defaultValue?: string;
}

/**
 * OIDC related metadata.
 */
export interface OIDCMetadataInterface {
    allowedGrantTypes?: MetadataPropertyInterface;
    defaultUserAccessTokenExpiryTime?: string;
    defaultApplicationAccessTokenExpiryTime?: string;
    defaultRefreshTokenExpiryTime?: string;
    defaultIdTokenExpiryTime?: string;
    idTokenEncryptionAlgorithm?: MetadataPropertyInterface;
    idTokenEncryptionMethod?: MetadataPropertyInterface;
    scopeValidators?: MetadataPropertyInterface;
    accessTokenType?: MetadataPropertyInterface;
}

export enum State {
    ACTIVE = "ACTIVE",
    REVOKED = "REVOKED"
}

export interface OAuth2PKCEConfigurationInterface {
    mandatory?: boolean;
    supportPlainTransformAlgorithm?: boolean;
}

interface AccessTokenConfigurationInterface {
    type?: string;
    userAccessTokenExpiryInSeconds?: number;
    applicationAccessTokenExpiryInSeconds?: number;
}

interface RefreshTokenConfigurationInterface {
    expiryInSeconds?: number;
    renewRefreshToken?: boolean;
}

interface IdTokenEncryptionConfigurationInterface {
    enabled?: boolean;
    algorithm?: string;
    method?: string;
}

interface IdTokenConfigurationInterface {
    expiryInSeconds?: number;
    audience?: string[];
    encryption?: IdTokenEncryptionConfigurationInterface;
}

interface OIDCLogoutConfigurationInterface {
    backChannelLogoutUrl?: string;
    frontChannelLogoutUrl?: string;
}

/**
 * Captures OIDC properties
 */
export interface OIDCDataInterface {
    clientId?: string;
    clientSecret?: string;
    state?: State;
    grantTypes: string[];
    callbackURLs?: string[];
    allowedOrigins?: string[];
    publicClient?: boolean;
    pkce?: OAuth2PKCEConfigurationInterface;
    accessToken?: AccessTokenConfigurationInterface;
    refreshToken?: RefreshTokenConfigurationInterface;
    idToken?: IdTokenConfigurationInterface;
    logout?: OIDCLogoutConfigurationInterface;
    validateRequestObjectSignature?: boolean;
    scopeValidators?: string[];
}

export const emptyOIDCConfig: OIDCDataInterface = ({
    clientId: "",
    clientSecret: "",
    state: undefined,
    grantTypes: [],
    callbackURLs: [],
    allowedOrigins: [],
    publicClient: false,
    pkce: {
        mandatory: false,
        supportPlainTransformAlgorithm: false
    },
    accessToken: undefined
});

/**
 * Enum for the supported auth protocol types.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedAuthProtocolTypes {
    SAML = "saml",
    OIDC = "oidc",
    WS_FEDERATION = "passive-sts",
    WS_TRUST = "ws-trust"
}

/**
 * Enum for the supported auth protocol meta types.
 *
 * @remarks
 * Currently, the application meta endpoint only supports fetching
 * metadata for the following auth protocols.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedAuthProtocolMetaTypes {
    SAML = "saml",
    OIDC = "oidc",
    WS_TRUST = "ws-trust"
}
