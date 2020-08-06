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

import { LinkInterface, TestableComponentInterface } from "@wso2is/core/models";

/**
 * Available Identity Provider list.
 */
export interface IdentityProviderListResponseInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    links?: LinkInterface[];
    identityProviders?: StrictIdentityProviderInterface[];
}

/**
 * Captures each Identity provider details from the list.
 */
export interface StrictIdentityProviderInterface {
    id?: string;
    name?: string;
    description?: string;
    isEnabled?: boolean;
    image?: string;
    self?: string;
    federatedAuthenticators?: FederatedAuthenticatorListResponseInterface;
}

export interface IdentityProviderInterface extends StrictIdentityProviderInterface {
    isPrimary?: boolean;
    isFederationHub?: boolean;
    homeRealmIdentifier?: string;
    alias?: string;
    claims?: IdentityProviderClaimsInterface;
    roles?: IdentityProviderRolesInterface;
    certificate?: CertificateConfigInterface;
    provisioning?: ProvisioningInterface;
}

export interface IdentityProviderRolesInterface {
    mappings?: IdentityProviderRoleMappingInterface[];
    outboundProvisioningRoles?: string[];
}

export interface IdentityProviderRoleMappingInterface {
    idpRole?: string;
    localRole?: string;
}

export interface IdentityProviderClaimsInterface {
    userIdClaim?: IdentityProviderClaimInterface;
    roleClaim?: IdentityProviderClaimInterface;
    mappings?: IdentityProviderClaimMappingInterface[];
    provisioningClaims?: IdentityProviderProvisioningClaimInterface[];
}

export interface IdentityProviderClaimMappingInterface {
    idpClaim: string;
    localClaim: IdentityProviderClaimInterface;
}

export interface IdentityProviderCommonClaimMappingInterface {
    mappedValue: string;
    claim: IdentityProviderClaimInterface;
}

export interface IdentityProviderProvisioningClaimInterface {
    claim: IdentityProviderClaimInterface;
    defaultValue: string;
}

export interface IdentityProviderClaimInterface {
    id?: string;
    uri: string;
    displayName?: string;
}

export interface IdentityProviderAdvanceInterface {
    isFederationHub?: boolean;
    homeRealmIdentifier?: string;
    alias?: string;
    certificate?: CertificateConfigInterface;
}

export interface CertificateConfigInterface {
    certificates?: string[];
    jwksUri?: string; // TODO  Check for upload option.
}

export interface FederatedAuthenticatorMetaDataInterface {
    authenticatorId: string;
    icon: any;
    name: string;
    displayName: string;
}

export interface FederatedAuthenticatorListItemInterface extends FederatedAuthenticatorInterface {
    self?: string;
}

export interface FederatedAuthenticatorInterface extends CommonPluggableComponentInterface {
    authenticatorId?: string;
    name?: string;
    isEnabled?: boolean;
    isDefault?: boolean;
}

export interface FederatedAuthenticatorWithMetaInterface {
    id?: string;
    meta?: FederatedAuthenticatorMetaInterface;
    data?: FederatedAuthenticatorInterface;
}

export interface AuthenticatorPropertyInterface {
    key: string;
    value: string;
}

export interface FederatedAuthenticatorListResponseInterface {
    defaultAuthenticatorId?: string;
    authenticators?: FederatedAuthenticatorListItemInterface[];
}

export interface FederatedAuthenticatorMetaInterface extends CommonPluggableComponentMetaInterface {
    authenticatorId?: string;
    name?: string;
    displayName?: string;
}

/**
 * Captures the Identity provider details.
 */
export interface IdentityProviderResponseInterface {
    id?: string;
    name?: string;
    image?: string;
    isEnabled?: string;
    federatedAuthenticators?: FederatedAuthenticatorListResponseInterface;
}

/**
 *  Identity provider template list interface.
 */
export interface IdentityProviderTemplateListInterface {
    templates: IdentityProviderTemplateListItemInterface[];
}

/**
 *  Identity provider template list response interface.
 */
export interface IdentityProviderTemplateListResponseInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    links?: number;
    templates?: IdentityProviderTemplateListItemResponseInterface[];
}

/**
 *  Identity provider template item interface.
 */
export interface IdentityProviderTemplateItemInterface {
    id: string;
    name: string;
    description: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    image: any;
    category: string;
    displayOrder: number;
    idp: IdentityProviderInterface;
}

/**
 *  Identity provider template list item interface.
 */
export interface IdentityProviderTemplateListItemInterface extends IdentityProviderTemplateItemInterface {
    services?: SupportedServicesInterface[];
}

/**
 *  Identity provider template list item response interface.
 */
export interface IdentityProviderTemplateListItemResponseInterface extends IdentityProviderTemplateItemInterface {
    services?: string[];
}

/**
 * Enum for the supported quick start template types.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedQuickStartTemplates {
    FACEBOOK = "facebook",
    GOOGLE = "google",
    TWITTER = "twitter",
    OIDC = "oidc",
    SAML = "saml",
    EXPERT = "expert"
}

/**
 * Enum for the supported authenticator types.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedAuthenticators {
    NONE = "none",
    FACEBOOK = "FacebookAuthenticator",
    GOOGLE = "GoogleOIDCAuthenticator",
    TWITTER = "TwitterAuthenticator",
    OIDC = "OpenIDConnectAuthenticator",
    SAML = "SAMLSSOAuthenticator",
}

/**
 * Enum for the supported provisioning connector types.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedProvisioningConnectors {
    NONE = "none",
    GOOGLE = "google"
}

/**
 *  Provisioning list response interface.
 */
export interface ProvisioningResponseInterface {
    jit?: JITProvisioningResponseInterface;
    outboundConnectors?: OutboundProvisioningConnectorsListResponseInterface;
}

export interface ProvisioningInterface {
    jit?: JITProvisioningResponseInterface;
    outboundConnectors?: OutboundProvisioningConnectorsInterface;
}

export interface JITProvisioningResponseInterface {
    isEnabled?: boolean;
    scheme?: SupportedJITProvisioningSchemes;
    userstore?: string;
}

export enum SupportedJITProvisioningSchemes {
    PROVISION_SILENTLY = "PROVISION_SILENTLY",
    PROMPT_CONSENT = "PROMPT_CONSENT",
    PROMPT_PASSWORD_CONSENT = "PROMPT_PASSWORD_CONSENT",
    PROMPT_USERNAME_PASSWORD_CONSENT = "PROMPT_USERNAME_PASSWORD_CONSENT"
}

export interface OutboundProvisioningConnectorsInterface {
    defaultConnectorId?: string;
    connectors?: OutboundProvisioningConnectorInterface[];
}

export interface OutboundProvisioningConnectorsListResponseInterface {
    defaultConnectorId?: string;
    connectors?: OutboundProvisioningConnectorListItemInterface[];
}

export interface OutboundProvisioningConnectorListItemInterface {
    connectorId?: string;
    name?: string;
    isEnabled?: boolean;
    self?: string;
}

export interface OutboundProvisioningConnectorInterface extends CommonPluggableComponentInterface{
    name?: string;
    connectorId?: string;
    isEnabled?: boolean;
    isDefault?: boolean;
    blockingEnabled?: boolean;
    rulesEnabled?: boolean;
}

export interface OutboundProvisioningConnectorMetaInterface extends CommonPluggableComponentMetaInterface{
    connectorId?: string;
    name?: string;
    displayName?: string;
    blockingEnabled?: boolean;
    rulesEnabled?: boolean;
}

export interface OutboundProvisioningConnectorWithMetaInterface {
    id?: string;
    meta?: FederatedAuthenticatorMetaInterface;
    data?: FederatedAuthenticatorInterface;
}

export interface CommonPluggableComponentFormPropsInterface extends TestableComponentInterface {
    metadata?: CommonPluggableComponentMetaInterface;
    initialValues: CommonPluggableComponentInterface;
    onSubmit: (values: CommonPluggableComponentInterface) => void;
    triggerSubmit?: boolean;
    enableSubmitButton?: boolean;
}

export interface CommonPluggableComponentInterface {
    properties?: CommonPluggableComponentPropertyInterface[];
}

export interface CommonPluggableComponentMetaInterface {
    properties?: CommonPluggableComponentMetaPropertyInterface[];
}

export interface CommonPluggableComponentPropertyInterface {
    key?: string;
    value?: string;
}

export interface CommonPluggableComponentMetaPropertyInterface {
    key?: string;
    displayName?: string;
    description?: string;
    type?: string;
    displayOrder?: number;
    regex?: string;
    isMandatory?: boolean;
    isConfidential?: boolean;
    options?: string[];
    defaultValue?: string;
    subProperties?: CommonPluggableComponentMetaPropertyInterface[];
}

/**
 * Identity provider supported services interface.
 */
export interface SupportedServicesInterface {
    name: string;
    displayName: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    logo: any;
}

/**
 * Enum for supported services.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedServices {
    AUTHENTICATION = "authentication",
    PROVISIONING = "provisioning"
}

/**
 * Enum for supported identity provider template categories.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedIdentityProviderTemplateCategories {
    QUICK_START = "quick_start"
}

/**
 *  Identity provider templates interface.
 */
export interface IdentityProviderTemplatesInterface {
    [key: string]: IdentityProviderTemplateListItemInterface[];
}

export const emptyIdentityProvider = (): StrictIdentityProviderInterface => ({
    description: "",
    id: "",
    image: "",
    isEnabled: false,
    name: ""
});

/**
 * Interface for the identity provider reducer state.
 */
export interface IdentityProviderReducerStateInterface {
    meta: IdentityProviderMetaInterface;
}

/**
 * Interface for the identity provider meta for the redux store.
 */
interface IdentityProviderMetaInterface {
    authenticators: FederatedAuthenticatorListItemInterface[];
}

/**
 * Interface for Local authenticator list response mapping.
 */
export interface LocalAuthenticatorInterface extends CommonPluggableComponentInterface {
    /**
     * ID of the local authenticator.
     */
    id: string;
    /**
     * Name of the local authenticator.
     */
    name: string;
    /**
     * Display name of the local authenticator.
     */
    displayName?: string;
    /**
     * Is authenticator enabled.
     */
    isEnabled?: boolean;
    /**
     * Details endpoint.
     */
    self?: string;
}

/**
 * Generic interface for authenticators local/federated.
 */
export interface GenericAuthenticatorInterface extends StrictGenericAuthenticatorInterface {
    /**
     * Identity provider name. ex: LOCAL, Facebook etc.
     */
    idp: string;
    /**
     * Display name of the authenticator.
     */
    displayName: string;
    /**
     * Is authenticator enabled.
     */
    isEnabled: boolean;
    /**
     * Default authenticator info.
     */
    defaultAuthenticator: FederatedAuthenticatorInterface;
    /**
     * Set of authenticators(federated).
     */
    authenticators: FederatedAuthenticatorInterface[];
}

/**
 * Interface  for strict attributes for the generic authenticator.
 */
export interface StrictGenericAuthenticatorInterface {
    /**
     * ID of the local authenticator.
     */
    id: string;
    /**
     * Name of the local authenticator.
     */
    name: string;
    /**
     * Image for the authenticator.
     */
    image: any;
}
