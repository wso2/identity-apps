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
 */
export interface ClaimConstraintModel {
    name: string;
    mandatory?: boolean;
    allowedValues?: string[];
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
}

/**
 * Interface for updating an existing Presentation Definition.
 */
export interface PresentationDefinitionUpdateModel {
    name?: string;
    description?: string;
    credentials?: RequestedCredentialModel[];
}
