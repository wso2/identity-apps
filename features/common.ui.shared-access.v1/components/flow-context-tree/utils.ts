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

import {
    AccessConfigOutput,
    ContextPathOutput,
    ContextTreeNodeMetadata,
    EncryptionOutput,
    InitialAccessConfig,
    NodeType,
    TreeNodeState
} from "./models";

/**
 * Check if a node is a container (OBJECT, MAP, or COMPLEX_MAP).
 */
const isContainer = (node: TreeNodeState): boolean =>
    node.nodeType === NodeType.OBJECT ||
    node.nodeType === NodeType.MAP ||
    node.nodeType === NodeType.COMPLEX_MAP;

// ── Propagation Engine ────────────────────────────────────────────────────────
// expose: LEAF-ONLY, no propagation.
//   Non-leaf (container) nodes never hold an expose flag. Only leaf nodes can be
//   marked as exposed. This prevents parent-level paths like /user/claims/ from
//   appearing in the access config, which would cause the backend to expose ALL
//   runtime entries in the map rather than only the ones the user configured.
//
// modify: LEAF-ONLY, no propagation.
//
// exposeEncrypted: LEAF-ONLY, no propagation.
// modifyEncrypted: LEAF-ONLY, no propagation.

// ── Tree Mutation Helpers ─────────────────────────────────────────────────────

/**
 * Immutably update a node by key.
 */
export const updateNode = (
    nodes: TreeNodeState[],
    key: string,
    fn: (node: TreeNodeState) => TreeNodeState
): TreeNodeState[] =>
    nodes.map((n: TreeNodeState) =>
        n.key === key
            ? fn(n)
            : {
                ...n,
                children: n.children ? updateNode(n.children, key, fn) : undefined
            }
    );

/**
 * Immutably delete a node by key.
 */
export const deleteNode = (
    nodes: TreeNodeState[],
    key: string
): TreeNodeState[] =>
    nodes
        .filter((n: TreeNodeState) => n.key !== key)
        .map((n: TreeNodeState) => ({
            ...n,
            children: n.children ? deleteNode(n.children, key) : undefined
        }));

/**
 * Immutably add a child node under the given parent key.
 */
export const addChild = (
    nodes: TreeNodeState[],
    parentKey: string,
    child: TreeNodeState
): TreeNodeState[] =>
    nodes.map((n: TreeNodeState) => {
        if (n.key === parentKey) {
            return { ...n, children: [...(n.children || []), child] };
        }

        return {
            ...n,
            children: n.children ? addChild(n.children, parentKey, child) : undefined
        };
    });

// ── Metadata → State Conversion ──────────────────────────────────────────────

/**
 * Convert backend metadata nodes to UI state nodes.
 * All selection flags start as false.
 */
export const mapMetadataToState = (
    nodes: ContextTreeNodeMetadata[]
): TreeNodeState[] =>
    nodes.map((node: ContextTreeNodeMetadata) => ({
        allowedOperations: node.allowedOperations || [],
        canDelete: node.canDelete ?? false,
        children: node.children ? mapMetadataToState(node.children) : undefined,
        dataType: node.dataType,
        dynamicEntryAllowed: node.dynamicEntryAllowed ?? false,
        dynamicEntryType: node.dynamicEntryType ?? "",
        exposeEncrypted: false,
        exposed: false,
        key: node.key,
        modify: false,
        modifyEncrypted: false,
        nodeType: node.nodeType,
        path: node.path,
        readOnly: node.readOnly ?? false,
        replaceable: node.replaceable ?? false,
        title: node.title
    }));

// ── Metadata → State Conversion (with existing Access Config) ────────────────

/**
 * Normalise a path for prefix matching.
 * Ensures container-style paths end with "/" while leaf paths do not.
 */
const normalisePath = (p: string): string => p.replace(/\/+$/, "");

/**
 * Convert backend metadata nodes to UI state nodes, pre-populating the
 * expose/modify/encryption flags from an existing access config returned
 * by the GET action API.
 *
 * For each node the algorithm:
 *   1. Checks if the node's path appears in `expose[]` → set exposed + exposeEncrypted.
 *   2. Checks if a *parent* path in `expose[]` covers this node → cascade exposed.
 *   3. Checks if the node's path appears in `modify[]` → set modify + modifyEncrypted.
 *
 * Dynamic entries (e.g. claim keys under /user/claims/) that exist in the
 * access config but NOT in the metadata are synthesised as children.
 *
 * @param claimDisplayNames - Optional map of claim URI → display name for rendering
 *                            human-readable titles on synthesised claim entries.
 */
export const mapMetadataToStateWithAccessConfig = (
    nodes: ContextTreeNodeMetadata[],
    accessConfig: InitialAccessConfig,
    claimDisplayNames?: Map<string, string>,
    options: {
        /** Whether the active flow type permits MODIFY on read-only nodes. Defaults to true. */
        allowReadOnlyClaimsModification?: boolean;
        /** claimURI → readOnly map; used when synthesising claim leaves to inherit per-claim
         *  read-only status from the Claims API. Without this every synthesised claim is
         *  treated as not-readOnly and the modify-drop rule below cannot fire on it. */
        claimReadOnlyMap?: Map<string, boolean>;
    } = {}
): TreeNodeState[] => {

    const allowReadOnlyClaimsModification: boolean =
        options.allowReadOnlyClaimsModification !== false;
    const claimReadOnlyMap: Map<string, boolean> = options.claimReadOnlyMap ?? new Map();
    const exposePaths: Map<string, boolean> = new Map();
    const modifyPaths: Map<string, boolean> = new Map();
    // Preserve the type-hint string ("Integer", "[String]", "risk: String, …") keyed
    // by clean path so synthesised properties children get the correct dataType on
    // reload. Without this, the round-trip collapses every dynamic entry's type back
    // to the container's `dynamicEntryType` ("Object").
    const modifyTypeHints: Map<string, string> = new Map();

    (accessConfig.expose ?? []).forEach((e: { path: string; encrypted: boolean }) => {
        exposePaths.set(normalisePath(e.path), e.encrypted);
    });
    (accessConfig.modify ?? []).forEach((m: { path: string; encrypted: boolean }) => {
        const typeHintMatch: RegExpMatchArray | null = m.path.match(/\{([^}]+)\}$/);
        const cleanPath: string = m.path.replace(/\{[^}]+\}$/, "");
        const norm: string = normalisePath(cleanPath);

        modifyPaths.set(norm, m.encrypted);
        if (typeHintMatch) {
            modifyTypeHints.set(norm, typeHintMatch[1]);
        }
    });

    /**
     * Check if a path is covered by an ancestor path in the expose set.
     */
    const isCoveredByAncestor = (path: string): { covered: boolean; encrypted: boolean } => {
        const normalised: string = normalisePath(path);
        const parts: string[] = normalised.split("/").filter(Boolean);
        let current: string = "";

        for (const part of parts) {
            current += "/" + part;
            if (current !== normalised && exposePaths.has(current)) {
                return { covered: true, encrypted: exposePaths.get(current) };
            }
        }

        return { covered: false, encrypted: false };
    };

    const convert = (
        metaNodes: ContextTreeNodeMetadata[],
        parentExposed: boolean,
        parentEncrypted: boolean
    ): TreeNodeState[] => {
        const result: TreeNodeState[] = [];

        for (const node of metaNodes) {
            const np: string = normalisePath(node.path);
            const nodeIsContainer: boolean = isContainer({
                nodeType: node.nodeType
            } as TreeNodeState);

            // Direct match in expose (only meaningful for leaf nodes)
            const directExpose: boolean = exposePaths.has(np);
            const directExposeEnc: boolean = directExpose ? exposePaths.get(np) : false;

            // For leaf nodes: exposed if directly in expose paths or covered by ancestor
            // For container nodes: never exposed (expose is leaf-only)
            const ancestor: { covered: boolean; encrypted: boolean } = isCoveredByAncestor(np);
            const exposed: boolean = nodeIsContainer
                ? false
                : (directExpose || ancestor.covered || parentExposed);
            const exposeEncrypted: boolean = nodeIsContainer
                ? false
                : (directExpose
                    ? directExposeEnc
                    : ancestor.covered
                        ? ancestor.encrypted
                        : parentEncrypted);

            // Modify (leaf-only in practice). When the flow type forbids modifying read-only
            // nodes, drop a previously-saved MODIFY mark on render. The cleanup commits on
            // the next save — the saved access config remains untouched until then.
            const nodeReadOnly: boolean = node.readOnly ?? false;
            let directModify: boolean = modifyPaths.has(np);
            let modifyEncrypted: boolean = directModify ? modifyPaths.get(np) : false;

            if (nodeReadOnly && !allowReadOnlyClaimsModification) {
                directModify = false;
                modifyEncrypted = false;
            }

            let children: TreeNodeState[] | undefined;

            if (node.children) {
                // Pass parent exposed state down so child leaves inherit coverage
                const childExposed: boolean = directExpose || ancestor.covered || parentExposed;
                const childEncrypted: boolean = directExpose
                    ? directExposeEnc
                    : ancestor.covered
                        ? ancestor.encrypted
                        : parentEncrypted;

                children = convert(node.children, childExposed, childEncrypted);
            }

            // Synthesise dynamic entries that exist in accessConfig but not in metadata
            if (node.dynamicEntryAllowed) {
                const existingChildPaths: Set<string> = new Set(
                    (children || []).map((c: TreeNodeState) => normalisePath(c.path))
                );

                const containerPrefix: string = normalisePath(node.path) + "/";

                // Collect unique dynamic keys from both expose and modify entries.
                // Use the full remaining path after the container prefix (not split("/")[0])
                // because claim URIs contain slashes (e.g. http://wso2.org/claims/displayName).
                const dynamicKeys: Set<string> = new Set<string>();

                exposePaths.forEach((_enc: boolean, ePath: string) => {
                    if (ePath.startsWith(containerPrefix)) {
                        const key: string = ePath.slice(containerPrefix.length);

                        if (key) {
                            dynamicKeys.add(key);
                        }
                    }
                });

                modifyPaths.forEach((_enc: boolean, mPath: string) => {
                    if (mPath.startsWith(containerPrefix)) {
                        const key: string = mPath.slice(containerPrefix.length);

                        if (key) {
                            dynamicKeys.add(key);
                        }
                    }
                });

                // Create or update children for each unique dynamic key.
                dynamicKeys.forEach((key: string) => {
                    const synthPath: string = containerPrefix + key;

                    if (existingChildPaths.has(synthPath)) {
                        // Already exists from metadata children — update its modify flags.
                        const existingChild: TreeNodeState | undefined = (children || []).find(
                            (c: TreeNodeState) => normalisePath(c.path) === synthPath
                        );

                        if (existingChild && modifyPaths.has(synthPath)) {
                            // Same drop rule as below — don't reinstate MODIFY on a read-only
                            // node when the flow type forbids it.
                            if (existingChild.readOnly && !allowReadOnlyClaimsModification) {
                                existingChild.modify = false;
                                existingChild.modifyEncrypted = false;
                            } else {
                                existingChild.modify = true;
                                existingChild.modifyEncrypted = modifyPaths.get(synthPath) ?? false;
                            }
                        }

                        return;
                    }

                    const isExposed: boolean = exposePaths.has(synthPath);
                    const synthExEnc: boolean = exposePaths.get(synthPath) ?? false;
                    let isModify: boolean = modifyPaths.has(synthPath);
                    let synthModEnc: boolean = modifyPaths.get(synthPath) ?? false;
                    const displayName: string = claimDisplayNames?.get(key) ?? key;
                    // For dynamic entries under a claims map, prefer the per-claim readOnly
                    // status (from the Claims API) over the parent container's flag. Falls
                    // back to the parent's flag if the map doesn't carry the URI.
                    const claimReadOnly: boolean | undefined = claimReadOnlyMap.get(key);
                    const synthReadOnly: boolean = claimReadOnly ?? (node.readOnly ?? false);

                    // Drop a previously-saved MODIFY when this flow type forbids modifying
                    // read-only nodes (e.g., PASSWORD_RECOVERY). The saved access config still
                    // carries it; the cleanup commits on the next save.
                    if (synthReadOnly && !allowReadOnlyClaimsModification) {
                        isModify = false;
                        synthModEnc = false;
                    }

                    const isUnderClaims: boolean = containerPrefix === "/user/claims/";
                    // Prefer the type hint extracted from the modify path (e.g. "Integer"
                    // from /properties/riskScore{Integer}) so dataType round-trips correctly
                    // and the edit modal pre-populates with the actual configured type.
                    const synthDataType: string =
                        modifyTypeHints.get(synthPath) ?? node.dynamicEntryType ?? "String";

                    children = children || [];
                    children.push({
                        allowedOperations: synthReadOnly
                            ? [ "EXPOSE" ]
                            : [ "EXPOSE", "MODIFY" ],
                        canDelete: true,
                        children: undefined,
                        dataType: synthDataType,
                        dynamicEntryAllowed: false,
                        dynamicEntryType: "",
                        exposeEncrypted: synthExEnc,
                        exposed: isExposed,
                        isClaim: isUnderClaims,
                        // Path-derived key so two synthesised entries in different containers
                        // never collide (Date.now() collisions caused dual-row highlighting).
                        key: `synth:${synthPath}`,
                        modify: isModify,
                        modifyEncrypted: synthModEnc,
                        nodeType: NodeType.LEAF,
                        path: synthPath,
                        readOnly: synthReadOnly,
                        replaceable: false,
                        title: displayName
                    });
                    existingChildPaths.add(synthPath);
                });
            }

            result.push({
                allowedOperations: node.allowedOperations || [],
                canDelete: node.canDelete ?? false,
                children,
                dataType: node.dataType,
                dynamicEntryAllowed: node.dynamicEntryAllowed ?? false,
                dynamicEntryType: node.dynamicEntryType ?? "",
                exposeEncrypted,
                exposed,
                key: node.key,
                modify: directModify,
                modifyEncrypted,
                nodeType: node.nodeType,
                path: node.path,
                readOnly: node.readOnly ?? false,
                replaceable: node.replaceable ?? false,
                title: node.title
            });
        }

        return result;
    };

    return convert(nodes, false, false);
};

// ── Access Config Builder ────────────────────────────────────────────────────
//
// expose[]:  LEAF nodes with exposed=true.
//            Container nodes are never exposed; only individual leaf paths appear.
//            If exposeEncrypted → { path, encrypted: true }, else { path, encrypted: false }.
//
// modify[]:  LEAF nodes with modify=true.
//            If modifyEncrypted → { path, encrypted: true }, else { path, encrypted: false }.

// ── Selection Helpers ────────────────────────────────────────────────────────

/**
 * Depth-first lookup for the first leaf node's key. Used to seed the default
 * selection in the field-configuration panel when the tree first renders.
 */
export const findFirstLeafKey = (nodes: TreeNodeState[]): string | null => {
    for (const node of nodes) {
        if (node.nodeType === NodeType.LEAF) {
            return node.key;
        }
        if (node.children) {
            const found: string | null = findFirstLeafKey(node.children);

            if (found) {
                return found;
            }
        }
    }

    return null;
};

/**
 * Find a node by key anywhere in the tree.
 */
export const findNode = (
    nodes: TreeNodeState[],
    key: string
): TreeNodeState | null => {
    for (const node of nodes) {
        if (node.key === key) {
            return node;
        }
        if (node.children) {
            const found: TreeNodeState | null = findNode(node.children, key);

            if (found) {
                return found;
            }
        }
    }

    return null;
};

/**
 * Build the access config output from the current tree state.
 * Only leaf nodes contribute to the output — containers are never exposed.
 */
export const buildAccessConfig = (
    nodes: TreeNodeState[]
): { accessConfig: AccessConfigOutput; encryption: EncryptionOutput } => {

    const expose: ContextPathOutput[] = [];
    const modify: ContextPathOutput[] = [];

    const walk = (ns: TreeNodeState[]): void => {
        ns.forEach((node: TreeNodeState) => {
            const isLeaf: boolean = node.nodeType === NodeType.LEAF;

            if (isLeaf) {
                // Expose: leaf-only
                if (node.exposed) {
                    expose.push({ encrypted: !!node.exposeEncrypted, path: node.path });
                }

                // Modify: leaf-only
                if (node.modify) {
                    const modifyPath: string = node.canDelete &&
                        node.dataType &&
                        node.dataType !== "String"
                        ? `${node.path}{${node.dataType}}`
                        : node.path;

                    modify.push({ encrypted: !!node.modifyEncrypted, path: modifyPath });
                }
            }

            // Descend into children
            if (node.children) {
                walk(node.children);
            }
        });
    };

    walk(nodes);

    return {
        accessConfig: { expose, modify },
        encryption: {}
    };
};
