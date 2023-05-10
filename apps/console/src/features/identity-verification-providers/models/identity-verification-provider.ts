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

export interface IDVPResourceEndpointsInterface {
    identityVerificationProviders: string;
}


export interface IDVPLocalClaimInterface {
    id?: string;
    uri: string;
    displayName?: string;
}

export interface IDVPClaimsInterface {
    localClaim: string;
    idvpClaim: string;
}

export interface IDVPClaimMappingInterface {
    localClaim: IDVPLocalClaimInterface;
    idvpClaim: string;
}

interface IDVPConfigPropertiesInterface {
    key: string;
    value: string;
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
