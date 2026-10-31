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

import { ContextTreeNodeMetadataInterface, NodeType } from "../components/flow-context-tree/models";
import {
    OrganizationAttributeEntryInterface
} from "../components/flow-context-tree/organization-attributes";

/**
 * Class containing the Organization branch of the Flow Extension context tree.
 *
 * `FlowExtensionContextTreeBuilder` does not emit an Organization node yet, so the branch is
 * merged into the metadata client-side. Paths mirror `FlowExtensionConstants.FlowContextPaths`
 * so nothing has to be renamed once the backend node is switched on.
 */
export class OrganizationContextConstants {

    /**
     * Private constructor to avoid object instantiation.
     */
    private constructor() { }

    /**
     * Flow scanned for the organization attributes it already collects. Registration is the only
     * flow that onboards an organization, and the access config editor is not scoped to a flow.
     */
    public static readonly SOURCE_FLOW_TYPE: string = "REGISTRATION";

    /**
     * `config.identifierType` marking a flow input as bound to an organization attribute.
     */
    public static readonly ORGANIZATION_IDENTIFIER_TYPE: string = "ORGANIZATION";

    /**
     * Allowed shape of a custom attribute key. Keys become path segments under the attributes
     * container, and a `/` inside one would make the resulting path ambiguous to parse.
     */
    public static readonly KEY_PATTERN: RegExp = /^[a-zA-Z][a-zA-Z0-9_]*$/;

    public static readonly ORGANIZATION_PATH_PREFIX: string = "/organization/";

    public static readonly ORGANIZATION_ATTRIBUTES_PATH: string = "/organization/attributes";

    /**
     * Fields every organization carries, offered alongside the keys scanned from the published
     * flow. Their keys are the identifiers the flow binds, so a flow that collects one of them
     * and this list agree on a single key.
     */
    public static readonly CORE_ATTRIBUTE_OPTIONS: OrganizationAttributeEntryInterface[] = [
        { key: "organizationName", label: "Organization Name" },
        { key: "organizationHandle", label: "Organization Handle", readOnly: true },
        { key: "organizationDescription", label: "Organization Description" }
    ];

    /**
     * Keys of the core options, used to drop them from the flow scan: they are already offered
     * as constants, so scanning them would list the same attribute twice in the dropdown.
     *
     * Derived rather than listed again, and declared after `CORE_ATTRIBUTE_OPTIONS` because
     * static initialisers run in declaration order.
     */
    public static readonly CORE_ATTRIBUTE_IDENTIFIERS: string[] =
        OrganizationContextConstants.CORE_ATTRIBUTE_OPTIONS.map(
            (attribute: OrganizationAttributeEntryInterface) => attribute.key
        );

    /**
     * Container the custom organization attributes hang off. Modelled on the `/user/claims` node:
     * a dynamic MAP, so the tree renders an ADD ENTRY chip for it.
     */
    public static readonly ORGANIZATION_ATTRIBUTES_NODE: ContextTreeNodeMetadataInterface = {
        allowedOperations: [ "EXPOSE", "MODIFY" ],
        children: [],
        dataType: "Map<String, String>",
        dynamicEntryAllowed: true,
        dynamicEntryType: "String",
        key: "attributes",
        nodeType: NodeType.MAP,
        path: OrganizationContextConstants.ORGANIZATION_ATTRIBUTES_PATH,
        title: "Attributes"
    };
}
