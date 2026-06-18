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

/**
 * Node types matching the backend ContextTreeNode.NodeType enum.
 */
export enum NodeType {
    OBJECT = "OBJECT",
    MAP = "MAP",
    COMPLEX_MAP = "COMPLEX_MAP",
    LEAF = "LEAF"
}

/**
 * Metadata for a single node in the context tree, matching the backend JSON shape.
 */
export interface ContextTreeNodeMetadataInterface {
    key: string;
    title: string;
    path: string;
    dataType: string;
    nodeType: NodeType;
    allowedOperations?: string[];
    readOnly?: boolean;
    replaceable?: boolean;
    canDelete?: boolean;
    dynamicEntryAllowed?: boolean;
    dynamicEntryType?: string;
    children?: ContextTreeNodeMetadataInterface[];
}

/**
 * Response shape for `GET /flow/extension/meta`.
 *
 * The tree itself is filtered server-side by the deployment.toml whitelist —
 * disabled fields are omitted entirely. The two policy flags drive UI behaviour
 * that depends on the active flow type (REDIRECT op gating, MODIFY-on-read-only
 * claim permission).
 */
export interface FlowExtensionContextTreeResponseInterface {
    /** Echoed flow type, or null when the default tree was requested. */
    flowType?: string | null;
    /** Filtered context tree. Disabled fields are absent, not flagged. */
    context: ContextTreeNodeMetadataInterface[];
    /** Whether REDIRECT is advertised in `allowedOperations` for this flow type. */
    redirectionEnabled: boolean;
    /**
     * Whether the Console UI may permit MODIFY on read-only claims for this flow type.
     * Hardcoded enumerative mapping in the engine — see FlowExtensionContextTreeBuilder.
     */
    allowReadOnlyClaimsModification: boolean;
}

/**
 * UI state for a single tree node. Extends metadata with selection flags.
 */
export interface TreeNodeStateInterface {
    key: string;
    title: string;
    path: string;
    dataType: string;
    nodeType: NodeType;
    allowedOperations: string[];
    readOnly: boolean;
    replaceable: boolean;
    canDelete: boolean;
    dynamicEntryAllowed: boolean;
    dynamicEntryType: string;
    exposed: boolean;
    modify: boolean;
    isClaim?: boolean;
    children?: TreeNodeStateInterface[];
}

/**
 * Props for the FlowContextTree component.
 */
export interface FlowContextTreePropsInterface extends IdentifiableComponentInterface {
    contextTree: ContextTreeNodeMetadataInterface[];
    onChange: (accessConfig: AccessConfigOutputInterface) => void;
    initialAccessConfig?: InitialAccessConfigInterface;
    readOnly?: boolean;
    /**
     * Whether the active flow type permits MODIFY on read-only claims (and other read-only
     * leaves). When false:
     *   - The add-claim modal does not allow adding read-only claims with the MODIFY flag.
     *   - Existing access configs with MODIFY on a read-only claim render with the flag dropped.
     * Defaults to true (matches the historical permissive behaviour).
     */
    allowReadOnlyClaimsModification?: boolean;
    /**
     * Whether REDIRECT is advertised in `allowedOperations` for this flow type. Surfaced as
     * a prop so the embedding screen can render an informational banner. The tree component
     * itself does not gate any controls on this — it is purely presentational.
     */
    redirectionEnabled?: boolean;
}

/**
 * Initial access config shape for populating tree state from an existing action.
 * Matches the AccessConfigInterface from the Actions API models.
 */
export interface InitialAccessConfigInterface {
    expose: ContextPathOutputInterface[];
    modify: ContextPathOutputInterface[];
}

/**
 * Access config output shape — matches the existing AccessConfigInterface.
 */
export interface AccessConfigOutputInterface {
    expose: ContextPathOutputInterface[];
    modify: ContextPathOutputInterface[];
}

/**
 * A single path entry.
 */
export interface ContextPathOutputInterface {
    path: string;
}

/**
 * State for the add-entry modal.
 */
export interface AddEntryModalStateInterface {
    open: boolean;
    parentNode: TreeNodeStateInterface | null;
}
