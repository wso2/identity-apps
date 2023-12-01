/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { ReactNode } from "react";
import {
    CommonPluggableComponentInterface,
    CommonPluggableComponentMetaInterface,
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "./connection";

/**
 * Interface for Multi-factor Authenticators.
 */
export type MultiFactorAuthenticatorInterface = GovernanceConnectorInterface;

/**
 * Interface to map response list item from Authenticators API.
 */
export interface AuthenticatorInterface {

    /**
     * Authenticator ID.
     */
    id: string;
    /**
     * Authenticator Name.
     */
    name: string;
    /**
     * Authenticator Description.
     */
    description?: string;
    /**
     * Authenticator Display Name.
     */
    displayName: string;
    /**
     * Is authenticator enabled.
     */
    isEnabled: boolean;
    /**
     * Authenticator type.
     * @example [ LOCAL, FEDERATED ]
     */
    type: AuthenticatorTypes;
    /**
     * Authenticator Image.
     */
    image?: string;
    /**
     * Authenticator meta tags.
     */
    tags: string[];
    /**
     * Details endpoint.
     */
    self: string;
}

/**
 * Enum for Authenticator Types.
 * @readonly
 */
export enum AuthenticatorTypes {
    FEDERATED = "FEDERATED",
    LOCAL = "LOCAL"
}

/**
 * Interface for authenticator extensions config.
 */
export interface AuthenticatorExtensionsConfigInterface {
    content?: {
        quickStart: ReactNode | any;
    };
    /**
     * Show authenticator as a coming soon feature.
     */
    isComingSoon: boolean;
    /**
     * Is authenticator enabled. Only these authenticators will be shown on the grid.
     */
    isEnabled: boolean;
    /**
     * Flag to decide whether the details of the authenticator should be fetched from the authenticators API.
     */
    useAuthenticatorsAPI?: boolean;
}

/**
 * Authenticator Labels.
 * @readonly
 */
export enum AuthenticatorLabels {
    SOCIAL = "Social-Login",
    FIRST_FACTOR = "First Factor",
    SECOND_FACTOR = "2FA",
    MULTI_FACTOR = "MFA",
    OIDC = "OIDC",
    SAML = "SAML",
    PASSWORDLESS = "Passwordless",
    HANDLERS = "Handlers",
    USERNAMELESS = "Usernameless",
    PASSKEY = "Passkey",
    API_AUTHENTICATION = "APIAuth"
}

export interface ConnectorPropertyInterface {
	name: string;
	value: string;
	displayName: string;
	description: string;
}

export interface GovernanceConnectorInterface {
	id: string;
	name: string;
	category: string;
	categoryId?: string;
	friendlyName: string;
	description?: string;
	order: string;
	subCategory: string;
	properties: ConnectorPropertyInterface[];
	displayName: string;
}

export interface FederatedAuthenticatorMetaDataInterface {
    authenticatorId: string;
    description: string;
    icon: any;
    name: string;
    displayName: string;
}

/**
 * Authenticator Categories.
 * @readonly
 */
export enum AuthenticatorCategories {
    ENTERPRISE = "ENTERPRISE",
    LOCAL = "LOCAL",
    SECOND_FACTOR = "SECOND_FACTOR",
    SOCIAL = "SOCIAL",
    RECOVERY = "RECOVERY"
}

export enum AuthenticatorSettingsFormModes {
    CREATE = "CREATE",
    EDIT = "EDIT"
}

/**
 * Interface for Authenticator Form metadata.
 * @remarks Use this interface in manually defined Authenticator to resolve form meta.
 */
export type CommonAuthenticatorFormMetaInterface = CommonPluggableComponentMetaInterface;

/**
 * Interface for Authenticator Form initial values..
 * @remarks Use this interface in manually defined Authenticator to resolve form initial values.
 */
export type CommonAuthenticatorFormInitialValuesInterface = CommonPluggableComponentInterface;

/**
 * Interface for Authenticator Form field meta.
 * @remarks Use this interface in manually defined Authenticator to resolve form field meta.
 */
export type CommonAuthenticatorFormFieldMetaInterface = CommonPluggableComponentMetaPropertyInterface;

/**
 * Interface for Authenticator Form property interface.
 * @remarks Use this interface in manually defined Authenticator to resolve form property.
 */
export type CommonAuthenticatorFormPropertyInterface = CommonPluggableComponentPropertyInterface;

export interface CommonAuthenticatorFormFieldInterface extends CommonAuthenticatorFormPropertyInterface {
    meta: CommonPluggableComponentMetaPropertyInterface;
}

/**
 * Interface for SMS Notification Sender Details.
 **/
export interface NotificationSenderSMSInterface {
    name: string;
    provider: string;
    providerURL: string;
    contentType: string;
    properties?: {
        key: string;
        value: string;
    }[];
}
