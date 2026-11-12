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

import FlowExtensionAccessConstants from "@wso2is/admin.flow-builder-core.v1/constants/flow-extension-access-constants";
import { TFunction } from "i18next";
import {
    ContextPathOutputInterface,
    ContextTreeNodeMetadataInterface,
    FlowVariableEntryStateInterface,
    NodeType,
    TreeNodeStateInterface
} from "./models";

/**
 * Utilities for the runtime values, request headers and subject organization in the access config of a
 * flow extension.
 *
 * Runtime values and request headers are defined by each flow, so their entries carry the flow type they
 * apply to. The tree lists every one the flows define, under one row per flow type, and only those marked
 * READ or WRITE go into the access config. The flow type row is a UI-only node: it has no path of its own
 * and adds nothing to the access config.
 */
class FlowExtensionAccessUtils {
    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() { }

    /**
     * Key of a runtime value or request header entry, which is configured once per path and flow type.
     *
     * @param path - Path of the entry.
     * @param flowType - Flow type of the entry.
     * @returns The key.
     */
    public static getFlowScopedEntryKey(path: string, flowType: string): string {
        return `${path}#${flowType}`;
    }

    /**
     * Display name of a flow type.
     *
     * @param t - Translation function.
     * @param flowType - Flow type, such as `REGISTRATION`.
     * @returns The translated name, or the flow type when it has none.
     */
    public static getFlowTypeLabel(t: TFunction, flowType: string): string {
        return t(`flowExtension:contextTree.flowTypes.${flowType}`, { defaultValue: flowType });
    }

    /**
     * Whether the access config entry belongs to the container at the given path.
     *
     * @param entry - Access config entry.
     * @param containerPath - Path of a flow variable container.
     * @returns `true` when the entry addresses an item of the container.
     */
    public static belongsToContainer(entry: { path: string }, containerPath: string): boolean {
        return !!entry?.path?.startsWith(`${FlowExtensionAccessUtils.normalise(containerPath)}[`);
    }

    /**
     * Whether an access config entry is a runtime value or request header entry of a flow.
     *
     * @param entry - Access config entry.
     * @returns `true` when the entry carries a flow type and addresses a runtime value or request header.
     */
    public static isFlowScopedEntry(entry: ContextPathOutputInterface): boolean {
        return !!entry?.flowType
            && (FlowExtensionAccessUtils.belongsToContainer(entry, FlowExtensionAccessConstants.RUNTIME_VALUES_PATH)
                || FlowExtensionAccessUtils.belongsToContainer(
                    entry, FlowExtensionAccessConstants.REQUEST_HEADERS_PATH));
    }

    /**
     * Immutably remove the hidden flow types from the runtime values and request headers of the metadata.
     *
     * @param nodes - Context tree metadata.
     * @param isFlowTypeHidden - Whether a flow type is hidden.
     * @returns The metadata without the hidden flow types.
     */
    public static omitHiddenFlowTypes(
        nodes: ContextTreeNodeMetadataInterface[],
        isFlowTypeHidden: (flowType: string) => boolean
    ): ContextTreeNodeMetadataInterface[] {
        return nodes.map((node: ContextTreeNodeMetadataInterface) => {
            if (!node.children) {
                return node;
            }

            if (!FlowExtensionAccessUtils.isFlowVariableContainerPath(node.path)) {
                return {
                    ...node,
                    children: FlowExtensionAccessUtils.omitHiddenFlowTypes(node.children, isFlowTypeHidden)
                };
            }

            return {
                ...node,
                children: node.children
                    .map((child: ContextTreeNodeMetadataInterface) => ({
                        ...child,
                        applicableFlowTypes: (child.applicableFlowTypes ?? [])
                            .filter((flowType: string) => !isFlowTypeHidden(flowType))
                    }))
                    .filter((child: ContextTreeNodeMetadataInterface) => child.applicableFlowTypes.length > 0)
            };
        });
    }

    /**
     * Whether the node is the runtime values or the request headers container.
     *
     * @param path - Path of the node.
     * @returns `true` for a flow variable container.
     */
    public static isFlowVariableContainerPath(path: string): boolean {
        const normalisedPath: string = FlowExtensionAccessUtils.normalise(path);

        return normalisedPath === FlowExtensionAccessConstants.RUNTIME_VALUES_PATH
            || normalisedPath === FlowExtensionAccessConstants.REQUEST_HEADERS_PATH;
    }

    /**
     * Build the rows of a runtime value or request header container: one entry per runtime value or header
     * and flow type that defines it, grouped by flow type, with the saved READ, WRITE and encryption marks.
     * A saved entry the flows no longer define is listed too, so it can be seen and removed.
     *
     * @param container - The flow variable container.
     * @param options - Runtime values or headers the flows define, as the metadata lists them.
     * @param savedEntries - Saved entries of the container.
     * @returns The flow type rows.
     */
    public static buildFlowVariableRows(
        container: Pick<TreeNodeStateInterface, "path" | "readOnly">,
        options: ContextTreeNodeMetadataInterface[],
        savedEntries: FlowVariableEntryStateInterface[]
    ): TreeNodeStateInterface[] {
        const saved: Map<string, FlowVariableEntryStateInterface> = new Map(
            savedEntries.map((entry: FlowVariableEntryStateInterface) =>
                [ FlowExtensionAccessUtils.getFlowScopedEntryKey(entry.path, entry.flowType), entry ])
        );
        const notSelected: Omit<FlowVariableEntryStateInterface, "path" | "flowType"> = {
            exposeEncrypted: false,
            exposed: false,
            modify: false,
            modifyEncrypted: false
        };
        const entries: TreeNodeStateInterface[] = [];

        (options ?? []).forEach((option: ContextTreeNodeMetadataInterface) => {
            (option.applicableFlowTypes ?? []).forEach((flowType: string) => {
                const key: string = FlowExtensionAccessUtils.getFlowScopedEntryKey(option.path, flowType);

                entries.push(FlowExtensionAccessUtils.buildFlowVariableEntry(
                    option, option.path, flowType, saved.get(key) ?? notSelected));
                saved.delete(key);
            });
        });
        saved.forEach((entry: FlowVariableEntryStateInterface) => {
            entries.push(FlowExtensionAccessUtils.buildFlowVariableEntry(
                undefined, entry.path, entry.flowType, entry));
        });

        const byFlowType: Map<string, TreeNodeStateInterface[]> = new Map();

        entries.forEach((entry: TreeNodeStateInterface) => {
            byFlowType.set(entry.flowType, [ ...(byFlowType.get(entry.flowType) ?? []), entry ]);
        });

        return [ ...byFlowType.keys() ]
            .sort((first: string, second: string) =>
                FlowExtensionAccessUtils.flowTypeRank(first) - FlowExtensionAccessUtils.flowTypeRank(second))
            .map((flowType: string) => FlowExtensionAccessUtils.buildFlowTypeGroup(
                container,
                flowType,
                [ ...byFlowType.get(flowType) ]
                    .sort((first: TreeNodeStateInterface, second: TreeNodeStateInterface) =>
                        first.title.localeCompare(second.title))
            ));
    }

    /**
     * Immutably remove flow type rows left without entries.
     *
     * @param nodes - Tree state.
     * @returns The new tree state.
     */
    public static pruneEmptyFlowTypeGroups(nodes: TreeNodeStateInterface[]): TreeNodeStateInterface[] {
        return nodes
            .filter((node: TreeNodeStateInterface) =>
                !(node.nodeType !== NodeType.LEAF && node.flowType && (node.children ?? []).length === 0))
            .map((node: TreeNodeStateInterface) => ({
                ...node,
                children: node.children
                    ? FlowExtensionAccessUtils.pruneEmptyFlowTypeGroups(node.children)
                    : undefined
            }));
    }

    /**
     * The flow types a node applies to, when it does not apply to all of them.
     *
     * @param applicableFlowTypes - Flow types the server lists for the node.
     * @returns The flow types, or `undefined` when the node applies to every flow.
     */
    public static getLimitedFlowTypes(applicableFlowTypes?: string[]): string[] | undefined {
        return applicableFlowTypes?.length
            && !applicableFlowTypes.includes(FlowExtensionAccessConstants.ALL_FLOW_TYPES)
            ? applicableFlowTypes
            : undefined;
    }

    /**
     * Rows for the organization attributes saved in the access config that the registration flow no
     * longer collects, so they can be seen and removed.
     *
     * @param listedPaths - Paths of the attributes the server lists.
     * @param exposePaths - Saved expose paths, with their encrypted flag.
     * @param applicableFlowTypes - Flow types the attributes container applies to.
     * @returns The rows, marked as not in the flow.
     */
    public static buildMissingAttributeRows(
        listedPaths: Set<string>,
        exposePaths: Map<string, boolean>,
        applicableFlowTypes?: string[]
    ): TreeNodeStateInterface[] {
        const prefix: string = FlowExtensionAccessConstants.SUBJECT_ORGANIZATION_ATTRIBUTE_PATH_PREFIX;
        const suffix: string = FlowExtensionAccessConstants.NAME_SELECTOR_SUFFIX;
        const rows: TreeNodeStateInterface[] = [];

        exposePaths.forEach((encrypted: boolean, path: string) => {
            if (!path.startsWith(prefix) || !path.endsWith(suffix) || listedPaths.has(path)) {
                return;
            }

            rows.push({
                allowedOperations: [ "EXPOSE" ],
                applicableFlowTypes: FlowExtensionAccessUtils.getLimitedFlowTypes(applicableFlowTypes),
                canDelete: true,
                children: undefined,
                dataType: FlowExtensionAccessConstants.STRING_DATA_TYPE,
                dynamicEntryAllowed: false,
                dynamicEntryType: "",
                exposeEncrypted: encrypted,
                exposed: true,
                key: `synth:${path}`,
                modify: false,
                modifyEncrypted: false,
                nodeType: NodeType.LEAF,
                notInFlow: true,
                path,
                readOnly: true,
                replaceable: false,
                title: path.slice(prefix.length, -suffix.length)
            });
        });

        return rows;
    }

    private static normalise(path: string): string {
        return (path ?? "").replace(/\/+$/, "");
    }

    private static flowTypeRank(flowType: string): number {
        const index: number = FlowExtensionAccessConstants.FLOW_TYPE_ORDER.indexOf(flowType);

        return index === -1 ? FlowExtensionAccessConstants.FLOW_TYPE_ORDER.length : index;
    }

    /**
     * Build the row holding the entries of one flow type.
     */
    private static buildFlowTypeGroup(
        container: Pick<TreeNodeStateInterface, "path" | "readOnly">,
        flowType: string,
        children: TreeNodeStateInterface[]
    ): TreeNodeStateInterface {
        const path: string = FlowExtensionAccessUtils.normalise(container.path);

        return {
            allowedOperations: [],
            canDelete: false,
            children,
            dataType: "",
            dynamicEntryAllowed: false,
            dynamicEntryType: "",
            exposeEncrypted: false,
            exposed: false,
            flowType,
            key: `group:${path}#${flowType}`,
            modify: false,
            modifyEncrypted: false,
            nodeType: NodeType.OBJECT,
            path,
            readOnly: container.readOnly,
            replaceable: false,
            title: flowType
        };
    }

    /**
     * Build an entry row from what the flow defines, or, when the flow no longer defines it, from the saved
     * entry alone. Only such a saved entry can be deleted, so the admin can clean it up.
     */
    private static buildFlowVariableEntry(
        option: ContextTreeNodeMetadataInterface | undefined,
        path: string,
        flowType: string,
        state: Omit<FlowVariableEntryStateInterface, "path" | "flowType">
    ): TreeNodeStateInterface {
        // Headers are only read. Without an option, the entry's path tells which kind it is.
        const allowedOperations: string[] = option?.allowedOperations
            ?? (FlowExtensionAccessUtils.belongsToContainer({ path }, FlowExtensionAccessConstants.REQUEST_HEADERS_PATH)
                ? [ "EXPOSE" ]
                : [ "EXPOSE", "MODIFY" ]);
        const canModify: boolean = allowedOperations.includes("MODIFY") && !option?.readOnly;

        return {
            allowedOperations,
            canDelete: !option,
            children: undefined,
            dataType: option?.dataType ?? "",
            dynamicEntryAllowed: false,
            dynamicEntryType: "",
            exposeEncrypted: state.exposed && state.exposeEncrypted,
            exposed: state.exposed,
            flowType,
            key: `node:${FlowExtensionAccessUtils.getFlowScopedEntryKey(path, flowType)}`,
            modify: canModify && state.modify,
            modifyEncrypted: canModify && state.modify && state.modifyEncrypted,
            nodeType: NodeType.LEAF,
            notInFlow: !option,
            path,
            readOnly: option?.readOnly ?? false,
            replaceable: false,
            title: option?.title ?? path.replace(/^.*\[name=(.*)\]$/, "$1")
        };
    }
}

export default FlowExtensionAccessUtils;
