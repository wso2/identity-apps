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
    claims?: string;
    roles?: string;
    federatedAuthenticators?: FederatedAuthenticatorListResponseInterface;
    certificate?: CertificateConfigInterface;
    provisioning?: any;
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

export interface FederatedAuthenticatorListItemInterface {
    authenticatorId?: string;
    name?: string;
    isEnabled?: boolean;
    isDefault?: boolean;
    properties?: AuthenticatorProperty[];
    self?: string;
}

export interface AuthenticatorProperty {
    key: string;
    value: string;
}

export interface FederatedAuthenticatorListResponseInterface {
    defaultAuthenticatorId?: string;
    authenticators?: FederatedAuthenticatorListItemInterface[];
}

export interface FederatedAuthenticatorMetaPropertyInterface {
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
    subProperties?: FederatedAuthenticatorMetaPropertyInterface[];
}

export interface FederatedAuthenticatorMetaInterface {
    authenticatorId?: string;
    name?: string;
    displayName?: string;
    properties?: FederatedAuthenticatorMetaPropertyInterface[];
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
 *  Identity provider template list item interface.
 */
export interface IdentityProviderTemplateListItemInterface {
    description: string;
    displayName: string;
    id: SupportedQuickStartTemplates;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    image: any;
    authenticators: SupportedAuthenticators;
    provisioningConnectors: SupportedProvisioningConnectors;
    services: SupportedServicesInterface[];
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
    TWITTER = "twitter"
}

/**
 * Enum for the supported authenticator types.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedAuthenticators {
    NONE ="none",
    FACEBOOK = "facebook",
    GOOGLE = "google",
    TWITTER = "twitter"
}

/**
 * Enum for the supported provisioning connector types.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedProvisioningConnectors {
    NONE ="none",
    GOOGLE = "google"
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
    [ key: string ]: IdentityProviderTemplateListItemInterface[];
}

export const emptyIdentityProvider = (): IdentityProviderListItemInterface => ({
    isEnabled: false,
    description: "",
    id: "",
    image: "",
    name: ""
});
