/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

/**
 * Interface that represent the response returned by the list IDVPs GET request.
 */
export interface IDVPListResponseInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    identityVerificationProviders?: IdentityVerificationProviderInterface[];
}

/**
 * Interface for representing an identity verification provider.
 */
export interface IdentityVerificationProviderInterface {
    id?: string;
    Name?: string;
    Type?: string;
    description?: string;
    isEnabled?: boolean;
    image?: string;
    templateId?: string;
    claims?: IDVPClaimsInterface[];
    configProperties?: IDVPConfigPropertiesInterface[];
}

/**
 * Interface for representing the resource endpoints of an identity verification provider.
 */
export interface IDVPResourceEndpointsInterface {
    identityVerificationProviders: string;
    IDVPExtensionEndpoint: string;
}

/**
 * Interface that represent a local claim in the IDVP context.
 */
export interface IDVPLocalClaimInterface {
    id?: string;
    uri: string;
    displayName?: string;
}

/**
 * Interface that represent a claim (attribute) mapping in the IDVP context. This is
 * the claims mapping format expected by the IDVP backend APIs.This is mostly used
 * outside the attribute management components
 */
export interface IDVPClaimsInterface {
    localClaim: string;
    idvpClaim: string;
}

/**
 * Like the {@link IDVPClaimsInterface} this represents a claim mapping, but this model
 * contains a bit more information about the local claim and used in attribute management components.
 */
export interface IDVPClaimMappingInterface {
    localClaim: IDVPLocalClaimInterface;
    idvpClaim: string;
}

/**
 * Interface that represent a config property in the IDVP.
 */
export interface IDVPConfigPropertiesInterface {
    key: string;
    value: string | boolean;
    isSecret: boolean;
}

export interface IDVPTemplateItemInterface {
    id?: string;
    name?: string;
    description?: string;
    image?: any;
    category?: string;
    displayOrder?: number;
    idvp?: IdentityVerificationProviderInterface;
    disabled?: boolean;
    type?: string;
    templateGroup?: string;
    /**
     * Template identifier.
     */
    templateId?: string;
}

/**
 * Enum for Identity Verification Provider Tab types
 */
export enum IdentityVerificationProviderTabTypes {
    SETTINGS ="settings",
    USER_ATTRIBUTES = "user-attributes",
}
