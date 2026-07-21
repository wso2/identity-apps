/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
 * Issuer certificate configuration type for a requested credential.
 */
export enum IssuerCertType {
    NONE = "NONE",
    JWKS = "JWKS",
    PEM = "PEM"
}

/**
 * Interface for a single claim constraint within a requested credential.
 *
 * `id` and `path` map directly to the DCQL spec fields. `name` is kept for
 * backward compatibility: when `path` is absent the backend treats `name` as
 * a single-element path. `allowedValues` maps to the DCQL `values` field and
 * is also enforced server-side.
 */
export interface ClaimConstraintModel {
    /** DCQL claim id — used to reference this claim in claim_sets. */
    id?: string;
    /** DCQL path array, e.g. ["address", "street_address"]. */
    path?: string[];
    /** Backward-compat: single flat claim name used when path is absent. */
    name?: string;
    mandatory?: boolean;
    /** Communicated to the wallet via DCQL `values` and enforced server-side. */
    allowedValues?: string[];
}

/**
 * Interface for a DCQL credential_sets entry.
 *
 * Each entry describes one group of acceptable credential combinations.
 * `options` is a list of alternatives; at least one option (inner list of
 * credential IDs) must be fully satisfied. When `required` is false the whole
 * group is optional.
 */
export interface CredentialSetModel {
    /** When false the set is optional. Defaults to true. */
    required?: boolean;
    /** Each inner array is one acceptable combination of credential IDs. */
    options: string[][];
}

/**
 * Interface for a requested credential in a presentation definition.
 */
export interface RequestedCredentialModel {
    credentialQueryId: string;
    type: string;
    purpose?: string;
    issuer?: string;
    issuerCertPem?: string;
    jwksUri?: string;
    claims?: ClaimConstraintModel[];
    /** DCQL claim_sets: alternative groups of claim IDs; at least one must be satisfied. */
    claimSets?: string[][];
    enforceTrustedIssuers?: boolean;
    trustedIssuers?: string[];
}

/**
 * Interface for a Presentation Definition (full object).
 */
export interface PresentationDefinition {
    id: string;
    name: string;
    description?: string;
    credentials: RequestedCredentialModel[];
    /** DCQL credential_sets: required/optional combinations of credential IDs. */
    credentialSets?: CredentialSetModel[];
}

/**
 * Interface for a Presentation Definition list item (summary view).
 */
export interface PresentationDefinitionListItem {
    id: string;
    name: string;
    description?: string;
}

/**
 * Interface for the Presentation Definition list API response.
 */
export interface PresentationDefinitionList {
    totalResults?: number;
    presentationDefinitions: PresentationDefinitionListItem[];
}

/**
 * Interface for creating a new Presentation Definition.
 */
export interface PresentationDefinitionCreationModel {
    name: string;
    description?: string;
    credentials: RequestedCredentialModel[];
    credentialSets?: CredentialSetModel[];
}

/**
 * Interface for updating an existing Presentation Definition.
 */
export interface PresentationDefinitionUpdateModel {
    name?: string;
    description?: string;
    credentials?: RequestedCredentialModel[];
    credentialSets?: CredentialSetModel[];
}
