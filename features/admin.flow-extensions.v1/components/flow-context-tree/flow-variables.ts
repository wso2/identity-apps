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

import {
    ContextPathOutputInterface,
    ContextTreeNodeMetadataInterface,
    NodeType,
    TreeNodeStateInterface
} from "./models";

// Runtime values and request headers are defined by each flow, so their entries carry the flow
// type they apply to. The tree lists every one the flows define, under one row per flow type,
// and only those marked READ or WRITE go into the access config. The flow type row is a UI-only
// node: it has no path of its own and adds nothing to the access config.

const RUNTIME_VALUES_PATH: string = "/runtimeValues";
const REQUEST_HEADERS_PATH: string = "/request/additionalHeaders";

/**
 * Flow types in the order their rows are shown.
 */
const FLOW_TYPE_ORDER: string[] = [ "REGISTRATION", "PASSWORD_RECOVERY", "INVITED_USER_REGISTRATION" ];

/**
 * Saved state of a runtime value or request header entry.
 */
export type FlowVariableEntryStateInterface = Pick<
    TreeNodeStateInterface,
    "path" | "flowType" | "exposed" | "exposeEncrypted" | "modify" | "modifyEncrypted"
>;

const normalise = (path: string): string => (path ?? "").replace(/\/+$/, "");

/**
 * Whether the node is the runtime values or the request headers container.
 *
 * @param path - Path of the node.
 * @returns `true` for a flow variable container.
 */
export const isFlowVariableContainerPath = (path: string): boolean =>
    normalise(path) === RUNTIME_VALUES_PATH || normalise(path) === REQUEST_HEADERS_PATH;

/**
 * Whether the access config entry belongs to the container at the given path.
 *
 * @param entry - Access config entry.
 * @param containerPath - Path of a flow variable container.
 * @returns `true` when the entry addresses an item of the container.
 */
export const belongsToContainer = (entry: { path: string }, containerPath: string): boolean =>
    !!entry?.path?.startsWith(`${normalise(containerPath)}[`);

/**
 * Whether an access config entry is a runtime value or request header entry of a flow.
 *
 * @param entry - Access config entry.
 * @returns `true` when the entry carries a flow type.
 */
export const isFlowScopedEntry = (entry: ContextPathOutputInterface): boolean => !!entry?.flowType
    && (belongsToContainer(entry, RUNTIME_VALUES_PATH) || belongsToContainer(entry, REQUEST_HEADERS_PATH));

const flowTypeRank = (flowType: string): number => {
    const index: number = FLOW_TYPE_ORDER.indexOf(flowType);

    return index === -1 ? FLOW_TYPE_ORDER.length : index;
};

const getEntryKey = (path: string, flowType: string): string => `${path}#${flowType}`;

/**
 * Build the row holding the entries of one flow type.
 */
const buildFlowTypeGroup = (
    container: Pick<TreeNodeStateInterface, "path" | "readOnly">,
    flowType: string,
    children: TreeNodeStateInterface[]
): TreeNodeStateInterface => ({
    allowedOperations: [],
    canDelete: false,
    children,
    dataType: "",
    dynamicEntryAllowed: false,
    dynamicEntryType: "",
    exposeEncrypted: false,
    exposed: false,
    flowType,
    key: `group:${normalise(container.path)}#${flowType}`,
    modify: false,
    modifyEncrypted: false,
    nodeType: NodeType.OBJECT,
    path: normalise(container.path),
    readOnly: container.readOnly,
    replaceable: false,
    title: flowType
});

/**
 * Build an entry row from what the flow defines, or, when the flow no longer defines it, from the saved
 * entry alone. Only such a saved entry can be deleted, so the admin can clean it up.
 */
const buildFlowVariableEntry = (
    option: ContextTreeNodeMetadataInterface | undefined,
    path: string,
    flowType: string,
    state: Omit<FlowVariableEntryStateInterface, "path" | "flowType">
): TreeNodeStateInterface => {
    // Headers are only read. Without an option, the entry's path tells which kind it is.
    const allowedOperations: string[] = option?.allowedOperations
        ?? (belongsToContainer({ path }, REQUEST_HEADERS_PATH) ? [ "EXPOSE" ] : [ "EXPOSE", "MODIFY" ]);
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
        key: `node:${getEntryKey(path, flowType)}`,
        modify: canModify && state.modify,
        modifyEncrypted: canModify && state.modify && state.modifyEncrypted,
        nodeType: NodeType.LEAF,
        notInFlow: !option,
        path,
        readOnly: option?.readOnly ?? false,
        replaceable: false,
        title: option?.title ?? path.replace(/^.*\[name=(.*)\]$/, "$1")
    };
};

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
export const buildFlowVariableRows = (
    container: Pick<TreeNodeStateInterface, "path" | "readOnly">,
    options: ContextTreeNodeMetadataInterface[],
    savedEntries: FlowVariableEntryStateInterface[]
): TreeNodeStateInterface[] => {
    const saved: Map<string, FlowVariableEntryStateInterface> = new Map(
        savedEntries.map((entry: FlowVariableEntryStateInterface) =>
            [ getEntryKey(entry.path, entry.flowType), entry ])
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
            const key: string = getEntryKey(option.path, flowType);

            entries.push(buildFlowVariableEntry(option, option.path, flowType, saved.get(key) ?? notSelected));
            saved.delete(key);
        });
    });
    saved.forEach((entry: FlowVariableEntryStateInterface) => {
        entries.push(buildFlowVariableEntry(undefined, entry.path, entry.flowType, entry));
    });

    const byFlowType: Map<string, TreeNodeStateInterface[]> = new Map();

    entries.forEach((entry: TreeNodeStateInterface) => {
        byFlowType.set(entry.flowType, [ ...(byFlowType.get(entry.flowType) ?? []), entry ]);
    });

    return [ ...byFlowType.keys() ]
        .sort((a: string, b: string) => flowTypeRank(a) - flowTypeRank(b))
        .map((flowType: string) => buildFlowTypeGroup(container, flowType, [ ...byFlowType.get(flowType) ]
            .sort((a: TreeNodeStateInterface, b: TreeNodeStateInterface) => a.title.localeCompare(b.title))));
};

/**
 * Immutably remove flow type rows left without entries.
 *
 * @param nodes - Tree state.
 * @returns The new tree state.
 */
export const pruneEmptyFlowTypeGroups = (nodes: TreeNodeStateInterface[]): TreeNodeStateInterface[] =>
    nodes
        .filter((node: TreeNodeStateInterface) =>
            !(node.nodeType !== NodeType.LEAF && node.flowType && (node.children ?? []).length === 0))
        .map((node: TreeNodeStateInterface) => ({
            ...node,
            children: node.children ? pruneEmptyFlowTypeGroups(node.children) : undefined
        }));
