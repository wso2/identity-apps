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

import { MandatoryArray } from "@wso2is/core/models";

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

export interface GrantTypeInterface {
    name?: string;
    displayName?: string;
}

export interface GrantTypeMetaDataInterface {
    options?: GrantTypeInterface[];
}

/**
 * OIDC related metadata.
 */
export interface OIDCMetadataInterface {
    allowedGrantTypes?: GrantTypeMetaDataInterface;
    defaultUserAccessTokenExpiryTime?: string;
    defaultApplicationAccessTokenExpiryTime?: string;
    defaultRefreshTokenExpiryTime?: string;
    defaultIdTokenExpiryTime?: string;
    idTokenEncryptionAlgorithm?: MetadataPropertyInterface;
    idTokenEncryptionMethod?: MetadataPropertyInterface;
    scopeValidators?: MetadataPropertyInterface;
    accessTokenType?: MetadataPropertyInterface;
    accessTokenBindingType?: MetadataPropertyInterface;
    accessTokenBindingValidation?: boolean;
    revokeTokensWhenIDPSessionTerminated?: boolean;
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
    bindingType?: SupportedAccessTokenBindingTypes | string;
    revokeTokensWhenIDPSessionTerminated?: boolean;
    validateTokenBinding?: boolean;
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

/**
 * Enum for the supported auth protocol types.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedAuthProtocolTypes {
    SAML = "saml",
    OIDC = "oidc",
    OAUTH2_OIDC = "oauth2-oidc",
    WS_FEDERATION = "passive-sts",
    WS_TRUST = "ws-trust",
    CUSTOM= "custom"
}

/**
 * Enum for the supported auth protocol names.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedAuthProtocolName {
    SAML = "saml",
    OIDC = "oidc",
    WS_FEDERATION = "ws-federation",
    WS_TRUST = "ws-trust"
}

/**
 * Enum for the default protocol template ids.
 *
 * @readonly
 * @enum {string}
 */
export enum DefaultProtocolTemplate {
    SAML = "default-saml",
    OIDC = "default-oidc",
    WS_FEDERATION = "default-ws-federation",
    WS_TRUST = "default-ws-trust"
}

/**
 * Enum for the supported quick start template types.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedQuickStartTemplateTypes {
    SPA = "spa",
    OAUTH_WEB_APP = "oauthWebApp"
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

interface AssertionEncryptionConfigurationInterface {
    enabled?: boolean;
    assertionEncryptionAlgorithm?: string;
    keyEncryptionAlgorithm?: string;
}

interface SAMLAssertionConfigurationInterface {
    nameIdFormat?: string;
    audiences?: string[];
    recipients?: string[];
    digestAlgorithm?: string;
    encryption?: AssertionEncryptionConfigurationInterface;
}

export enum SAML2BindingTypes {
    HTTP_POST= "HTTP_POST",
    HTTP_REDIRECT= "HTTP_REDIRECT",
    ARTIFACT= "ARTIFACT"
}

interface SingleSignOnProfileInterface {
    bindings?: SAML2BindingTypes[];
    enableSignatureValidationForArtifactBinding?: boolean;
    attributeConsumingServiceIndex?: string;
    enableIdpInitiatedSingleSignOn?: boolean;
    assertion?: SAMLAssertionConfigurationInterface;
}

export interface SAMLAttributeProfileInterface {
    enabled?: boolean;
    alwaysIncludeAttributesInResponse?: boolean;
}

export enum LogoutMethods {
    BACK_CHANNEL= "BACKCHANNEL",
    FRONT_CHANNEL_HTTP_REDIRECT= "FRONTCHANNEL_HTTP_REDIRECT",
    FRONT_CHANNEL_HTTP_POST= "FRONTCHANNEL_HTTP_POST"
}

interface IdpInitiatedSingleLogoutInterface {
    enabled?: boolean;
    returnToUrls?: string[];
}
interface SingleLogoutProfileInterface {
    enabled?: boolean;
    logoutRequestUrl?: string;
    logoutResponseUrl?: string;
    logoutMethod?: LogoutMethods;
    idpInitiatedSingleLogout?: IdpInitiatedSingleLogoutInterface;
}

interface SAMLRequestValidationInterface {
    enableSignatureValidation?: boolean;
    signatureValidationCertAlias?: string;
}

interface SAMLResponseSigningInterface {
    enabled?: boolean;
    signingAlgorithm?: string;
}

/**
 * SAML configuration for an application.
 */
export interface SAML2ServiceProviderInterface {
    issuer: string;
    serviceProviderQualifier?: string;
    /**
     *  At least one assertion consumerURL should be passed
     */
    assertionConsumerUrls: MandatoryArray<string>;
    /**
     * If not provided, the first assertion consumer URL on the assertionConsumerUrls
     * will be picked as the default assertion consumer URL.
     */
    defaultAssertionConsumerUrl?: string;
    idpEntityIdAlias?: string;
    singleSignOnProfile?: SingleSignOnProfileInterface;
    attributeProfile?: SAMLAttributeProfileInterface;
    singleLogoutProfile?: SingleLogoutProfileInterface;
    requestValidation?: SAMLRequestValidationInterface;
    responseSigning?: SAMLResponseSigningInterface;
    enableAssertionQueryProfile?: boolean;
}

/**
 * SAML template configurations for an application.
 */
export interface SAML2TemplateServiceProviderInterface {
    issuer: string;
    assertionConsumerUrls?: Array<string>;
}

/**
 * SAML configuration interface.
 */
export interface SAML2ConfigurationInterface {
    metadataFile?: string;
    metadataURL?: string;
    manualConfiguration?: SAML2ServiceProviderInterface;
    templateConfiguration?: SAML2TemplateServiceProviderInterface;
}

/**
 * SAML metadata interface.
 */
export interface SAMLMetaDataInterface {
    defaultNameIdFormat?: string;
    certificateAlias?: MetadataPropertyInterface;
    responseSigningAlgorithm?: MetadataPropertyInterface;
    responseDigestAlgorithm?: MetadataPropertyInterface;
    assertionEncryptionAlgorithm?: MetadataPropertyInterface;
    keyEncryptionAlgorithm?: MetadataPropertyInterface;
}

/**
 * WS Trust configuration interface.
 */
export interface WSTrustConfigurationInterface {
    audience: string;
    certificateAlias: string;
}

/**
 * WS Trust metadata interface.
 */
export interface WSTrustMetaDataInterface {
    certificateAlias: MetadataPropertyInterface;
}

/**
 * Passive Sts interface.
 */
export interface PassiveStsConfigurationInterface {
    realm: string;
    replyTo: string;
}

export enum CustomTypeEnum {
    STRING = "STRING",
    BOOLEAN = "BOOLEAN",
    INTEGER = "INTEGER"
}

export interface CustomInboundProtocolPropertyInterface {
    name: string;
    displayName: string;
    type: CustomTypeEnum;
    required: boolean;
    availableValues: string[];
    defaultValue: string;
    validationRegex: string;
    displayOrder: number;
    isConfidential: boolean;
}

/**
 *  Custom protocol meta data interface.
 */
export interface CustomInboundProtocolMetaDataInterface {
    displayName: string;
    properties: CustomInboundProtocolPropertyInterface[];
}

export interface PropertyModelInterface {
    key: string;
    value: string;
    friendlyName: string;
}

/**
 * Custom Inbound protocol configurations
 */
export interface CustomInboundProtocolConfigurationInterface {
    name: string;
    configName: string;
    properties: PropertyModelInterface[];
}

/**
 * Interface to hold config values.
 */
export interface SubmitFormCustomPropertiesInterface {
    /**
     * Config name.
     */
    key: string;
    /**
     * Config value.
     */
    value: string | boolean | number | string[];
    /**
     * Friendly name of the config.
     */
    friendlyName?: string;
}

/**
 * OIDC service endpoints.
 */
export interface OIDCEndpointsInterface {
    /**
     * Authorization endpoint.
     */
    authorize?: string;
    /**
     * JWKS endpoint.
     */
    jwks?: string;
    /**
     * Logout endpoint.
     */
    logout?: string;
    /**
     * OIDC session IFrame endpoint.
     */
    oidcSessionIFrame?: string;
    /**
     * Revocation endpoint.
     */
    revoke?: string;
    /**
     * Token endpoint.
     */
    token?: string;
    /**
     * WellKnown endpoint.
     */
    wellKnown?: string;
}

/**
 * Enum for the access token binding types.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedAccessTokenBindingTypes {
    NONE = "None"
}

/**
 * Enum for the SAML configuration modes.
 *
 * @readonly
 * @enum {string}
 */
export enum SAMLConfigModes {
    MANUAL = "manualConfiguration",
    META_FILE = "metadataFile",
    META_URL = "metadataURL"
}
