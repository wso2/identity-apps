/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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
 *  Captures claim management properties.
 */
export interface Claim {
    id?: string;
    claimURI: string;
    dialectURI?: string;
    description: string;
    displayOrder: number;
    displayName: string;
    readOnly: boolean;
    regEx: string;
    required: boolean;
    supportedByDefault: boolean;
    uniquenessScope?: UniquenessScope;
    attributeMapping?: AttributeMapping[];
    properties?: Property[];
}

/**
 * Type of userstore-attribute mapping
 */
export interface AttributeMapping {
    mappedAttribute: string;
    userstore: string;
}

/**
 * Type of additional property key-value pair
 */
export interface Property{
    key: string;
    value: string;
}

/**
 * Type of claim dialect
 */
export interface ClaimDialect {
    id: string;
    dialectURI: string;
    link: Link;
}

/**
 * Type of link attribute found in claim dialect objects
 */
interface Link {
    href: string;
    rel: string;
}

/**
 *  Dialect other than local dialect.
 */
export interface ExternalClaim {
    id: string;
    claimURI: string;
    claimDialectURI: string;
    mappedLocalClaimURI: string;
    localClaimDisplayName: string;
    properties?: Property[];
}

/**
 * Type of query params passed when fetching a list
 */
export interface ClaimsGetParams {
    limit: number;
    offset: number;
    filter: string;
    sort: string;
    attributes?: string;
    "exclude-identity-claims"?: boolean;
}

/**
 * Type of query params passed when fetching claim dialects.
 */
export interface ClaimDialectsGetParams {
    limit?: number;
    offset?: number;
    filter?: string;
    sort?: string;
}

/**
 * Type of SCIM resource schema extension.
 */
export interface SCIMSchemaExtension {
    schema: string;
    required?: boolean;
}

/**
 * Type of SCIM resource.
 */
export interface SCIMResource {
    schemas: string[];
    meta: {
        location: string;
        resourceType: string;
    };
    id: string;
    name: string;
    endpoint: string;
    description: string;
    schema: string;
    schemaExtensions?: SCIMSchemaExtension[];
}

/**
 * Enum representing the scope of uniqueness validation for the claim.
 * - NONE: The claim value doesn't need to be unique
 * - WITHIN_USERSTORE: The claim value must be unique within a single userstore
 * - ACROSS_USERSTORES: The claim value must be unique across all userstores
 */
export enum UniquenessScope {
    NONE = "NONE",
    WITHIN_USERSTORE = "WITHIN_USERSTORE",
    ACROSS_USERSTORES = "ACROSS_USERSTORES"
}
