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

interface FederatedAuthenticatorListItemInterface {
    authenticatorId?: string;
    name?: string;
    isEnabled?: boolean;
    self?: string;
}
export interface FederatedAuthenticatorListResponseInterface {
    defaultAuthenticatorId?: string;
    authenticators?: FederatedAuthenticatorListItemInterface[];
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

export enum IdentityProviderTypes {
    LOCAL = "LOCAL",
    FEDERATED = "FEDERATED"
}

/**
 *  Captures IDPs name, logo and ID
 */
export interface IDPNameInterface {
    authenticatorId: string;
    idp: string;
    image?: string;
}
