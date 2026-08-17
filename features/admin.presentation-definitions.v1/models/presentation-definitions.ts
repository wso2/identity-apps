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
 * Interface for a single claim constraint within a requested credential.
 *
 * `id` and `path` map directly to the DCQL spec fields. `name` is kept for
 * backward compatibility: when `path` is absent the backend treats `name` as
 * a single-element path. `allowedValues` maps to the DCQL `values` field and
 * is also enforced server-side.
 */
export interface ClaimConstraintModelInterface {
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
 * Interface for a requested credential in a presentation definition.
 */
export interface RequestedCredentialModelInterface {
    /** User-defined alphanumeric identifier (DCQL credential query id). */
    id: string;
    type: string;
    purpose?: string;
    issuer?: string;
    enforceTrustedIssuer?: boolean;
    /** Base64-encoded PEM root CA certificates trusted for x5c chain validation. */
    trustedCaPems?: string[];
    /** Key resolution method: x5c | jwks_uri | pem. Default: x5c. */
    keyResolutionMethod?: string;
    /** JWKS endpoint URL (used when keyResolutionMethod is 'jwks_uri'). */
    jwksUri?: string;
    /** PEM-encoded issuer certificate (used when keyResolutionMethod is 'pem'). */
    issuerPem?: string;
    claims?: ClaimConstraintModelInterface[];
}

/**
 * Patch operation for trusted CA certificates.
 */
interface CertificatePatchInterface {
    operation: "ADD" | "REMOVE" | "REPLACE";
    certificateIndex?: number;
    certificate?: string;
}

/**
 * Interface for a Presentation Definition (full object).
 */
export interface PresentationDefinitionInterface {
    id: string;
    name: string;
    description?: string;
    credentials: RequestedCredentialModelInterface[];
}

/**
 * Interface for a Presentation Definition list item (summary view).
 */
export interface PresentationDefinitionListItemInterface {
    id: string;
    name: string;
    description?: string;
}

/**
 * Interface for a pagination link in a list response.
 */
export interface PaginationLinkInterface {
    rel: string;
    href: string;
}

/**
 * Interface for the Presentation Definition list API response.
 */
export interface PresentationDefinitionListInterface {
    totalResults?: number;
    links?: PaginationLinkInterface[];
    presentationDefinitions: PresentationDefinitionListItemInterface[];
}

/**
 * Interface for creating a new Presentation Definition.
 */
export interface PresentationDefinitionCreationModelInterface {
    name: string;
    description?: string;
    credentials: RequestedCredentialModelInterface[];
}

/**
 * Interface for updating an existing Presentation Definition.
 */
export interface PresentationDefinitionUpdateModelInterface {
    name?: string;
    description?: string;
    credentials?: RequestedCredentialModelInterface[];
}

/**
 * Interface for a single connection (IDP) referencing a presentation definition.
 */
interface ConnectedConnectionItemInterface {
    connectionId: string;
    name: string;
    self: string;
}

/**
 * Interface for the connected connections API response.
 */
export interface ConnectedConnectionsResponseInterface {
    totalResults: number;
    startIndex: number;
    count: number;
    connectedConnections: ConnectedConnectionItemInterface[];
}
