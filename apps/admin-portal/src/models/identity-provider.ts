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
 * Available Identity Provider list.
 */
export interface IdentityProviderListResponseInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    links?: LinkInterface[];
    identityProviders?: IdentityProviderListItemInterface[];
}

interface LinkInterface {
    href: string;
    rel: string;
}

/**
 * Captures each Identity provider details from the list.
 */
export interface IdentityProviderListItemInterface {
    id?: string;
    name?: string;
    description?: string;
    isEnabled?: boolean;
    image?: string;
    self?: string;
}

export interface IdentityProviderInterface {
    id?: string;
    name?: string;
    description?: string;
    isEnabled?: boolean;
    isPrimary?: boolean;
    isFederationHub?: boolean;
    image?: string;
    homeRealmIdentifier?: string;
    alias?: string;
    claims?: IdentityProviderClaimsInterface;
    roles?: IdentityProviderRolesInterface;
    federatedAuthenticators?: FederatedAuthenticatorListResponseInterface;
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
    userIdClaim?: {
        uri?: string;
    };
    roleClaim?: {
        uri?: string;
    };
    provisioningClaims?: string[];
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

export interface FederatedAuthenticatorListItemInterface extends FederatedAuthenticatorInterface{
    self?: string;
}

export interface FederatedAuthenticatorInterface extends CommonPluggableComponentInterface {
    authenticatorId?: string;
    name?: string;
    isEnabled?: boolean;
    isDefault?: boolean;
}

export interface FederatedAuthenticatorInterface {
    id?: string;
    meta?: FederatedAuthenticatorMetaInterface;
    data?: FederatedAuthenticatorInterface;
}

export interface FederatedAuthenticatorListItemInterface {
    authenticatorId?: string;
    name?: string;
    isEnabled?: boolean;
    isDefault?: boolean;
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
 *  Captures IDPs name, logo and ID
 */

/* eslint-disable @typescript-eslint/interface-name-prefix */
export interface IDPNameInterface {
    authenticatorId: string;
    idp: string;
    image?: string;
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

enum SupportedJITProvisioningSchemes {
    PROVISION_SILENTLY = "PROVISION_SILENTLY"
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

export interface CommonPluggableComponentFormPropsInterface {
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

export const emptyIdentityProvider = (): IdentityProviderListItemInterface => ({
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
