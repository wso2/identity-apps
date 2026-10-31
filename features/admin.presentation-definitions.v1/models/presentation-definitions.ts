/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { RouteComponentProps } from "react-router-dom";

/**
 * Interface for a single claim constraint within a requested credential.
 */
export interface ClaimConstraintModelInterface {
    path?: string;
    mandatory?: boolean;
}

/**
 * Interface for a requested credential in a presentation definition.
 */
export interface RequestedCredentialModelInterface {
    /** User-defined alphanumeric identifier (DCQL credential query id). */
    id: string;
    type: string;
    format?: string;
    claims?: ClaimConstraintModelInterface[];
}

/**
 * Interface for a single trusted issuer configuration entry.
 * keySourceType is one of: x5c | jwks_uri | pem.
 * keySource is a base64-encoded PEM string (trusted root CA for x5c, leaf cert for pem).
 */
export interface IssuerConfigInterface {
    keySourceType: string;
    issuerUrl?: string;
    keySource?: string;
}

/**
 * Request/response wrapper for the issuer configs PUT/GET endpoints.
 */
export interface IssuerConfigListResponseInterface {
    issuerConfigs: IssuerConfigInterface[];
}

/**
 * Interface for a Presentation Definition (full object).
 */
export interface PresentationDefinitionInterface {
    /** Server-generated UUID. Used for internal API path operations. */
    id: string;
    /** Stable, user-facing slug. Immutable after creation. */
    identifier: string;
    /** Human-readable label. */
    displayName: string;
    description?: string;
    credentials: RequestedCredentialModelInterface[];
}

/**
 * Interface for a Presentation Definition list item (summary view).
 */
export interface PresentationDefinitionListItemInterface {
    /** Server-generated UUID. Used for internal API path operations. */
    id: string;
    /** Stable, user-facing slug. */
    identifier: string;
    /** Human-readable label. */
    displayName: string;
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
    /** Stable slug: alphanumeric, underscores, hyphens only. Immutable after creation. */
    identifier: string;
    /** Human-readable label. */
    displayName: string;
    description?: string;
    credentials: RequestedCredentialModelInterface[];
}

/**
 * Interface for updating an existing Presentation Definition.
 * identifier is intentionally omitted — it is immutable after creation.
 */
export interface PresentationDefinitionUpdateModelInterface {
    displayName?: string;
    description?: string;
    credentials?: RequestedCredentialModelInterface[];
}

/**
 * Interface for a single IDP referencing a presentation definition.
 */
export interface ConnectedIdpItemInterface {
    idpId: string;
    name: string;
    self: string;
}

/**
 * Interface for the connected IDPs API response.
 */
export interface ConnectedIdpsResponseInterface {
    totalResults: number;
    startIndex: number;
    count: number;
    connectedIdps: ConnectedIdpItemInterface[];
}

/**
 * Interface for a single claim mapping entry on an identity provider.
 */
export interface ConnectionClaimMappingItemInterface {
    idpClaim: string;
    localClaim: {
        uri: string;
    };
}

/**
 * Interface for the connection claim mappings API response.
 */
export interface ConnectionClaimMappingsResponseInterface {
    mappings: ConnectionClaimMappingItemInterface[];
}

/**
 * Props interface for the Add Presentation Definition wizard component.
 */
export interface AddPresentationDefinitionWizardPropsInterface {
    /** Callback invoked when the wizard should be closed. */
    closeWizard: () => void;
    /** Component identifier used for test and accessibility attributes. */
    "data-componentid"?: string;
}

/**
 * Props interface for the PresentationDefinitionList component.
 */
export interface PresentationDefinitionListPropsInterface extends IdentifiableComponentInterface {
    /** Whether the list data is currently being fetched. */
    isLoading: boolean;
    /** Array of presentation definition summaries to display. */
    list: PresentationDefinitionListItemInterface[];
    /** Callback to refetch / invalidate the list after a mutation. */
    mutateList: () => void;
    /** Callback invoked when the user clicks the add button. */
    onAddClick: () => void;
    /** Active search query string; undefined when no search is active. */
    searchQuery?: string;
    /** Callback invoked when the user clears the active search query. */
    onSearchQueryClear?: () => void;
}

/**
 * Props interface for the Presentation Definitions list page component.
 */
export interface PresentationDefinitionsPagePropsInterface extends IdentifiableComponentInterface {}

/**
 * Route parameters for the Presentation Definition edit page.
 */
interface RouteParamsInterface {
    /** UUID of the presentation definition to edit. */
    id: string;
}

/**
 * Props interface for the Presentation Definition edit page component.
 */
export interface PresentationDefinitionEditPagePropsInterface
    extends IdentifiableComponentInterface, RouteComponentProps<RouteParamsInterface> {}

/**
 * Props interface for the IssuerConfigModal component.
 */
export interface IssuerConfigModalPropsInterface extends IdentifiableComponentInterface {
    /** Whether the modal is currently open. */
    isOpen: boolean;
    /** Callback invoked when the modal should be closed. */
    onClose: () => void;
    /** Callback invoked with the constructed issuer config when the user saves. */
    onSave: (config: IssuerConfigInterface) => void;
    /** Existing config to pre-populate for editing; null or undefined for add mode. */
    existingConfig?: IssuerConfigInterface | null;
    /** Whether the save operation is currently in progress. */
    isSaving?: boolean;
}
