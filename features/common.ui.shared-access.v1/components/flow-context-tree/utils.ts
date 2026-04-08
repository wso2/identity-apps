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

/**
 * Get countable children — containers with no children don't block
 * parent auto-expose propagation.
 */
const countableChildren = (children: TreeNodeState[]): TreeNodeState[] =>
    children.filter((c: TreeNodeState) =>
        !Array.isArray(c.children) || c.children.length > 0
    );

// ── Propagation Engine ────────────────────────────────────────────────────────
// expose: two-way propagation
//   bottom-up: all countable children exposed → parent auto-exposed
//   top-down:  parent exposed → children inherit expose
//
// modify: LEAF-ONLY, no propagation.
//
// exposeEncrypted: same propagation as expose (two-way, cascades).
// modifyEncrypted: LEAF-ONLY, no propagation.

/**
 * Bottom-up pass: children → parent for EXPOSE and exposeEncrypted.
 */
const bottomUp = (nodes: TreeNodeState[]): TreeNodeState[] =>
    nodes.map((node: TreeNodeState) => {
        if (!Array.isArray(node.children)) return node;

        const children: TreeNodeState[] = bottomUp(node.children);

        if (!isContainer({ ...node, children }) || children.length === 0) {
            return { ...node, children };
        }

        const countable: TreeNodeState[] = countableChildren(children);

        if (countable.length === 0) return { ...node, children };

        const allExposed: boolean = countable.every((c: TreeNodeState) => c.exposed);
        const exposedChildren: TreeNodeState[] = children.filter((c: TreeNodeState) => c.exposed);
        const allExposeEncrypted: boolean =
            exposedChildren.length > 0 &&
            exposedChildren.every((c: TreeNodeState) => c.exposeEncrypted);

        return {
            ...node,
            children,
            exposeEncrypted: allExposeEncrypted,
            exposed: allExposed
        };
    });

/**
 * Top-down pass: no-op.
 * All expose cascade is handled explicitly by toggle handlers
 * (cascadeExposeOn / cascadeExposeOff / cascadeExposeEncrypted).
 */
const topDown = (nodes: TreeNodeState[]): TreeNodeState[] => nodes;

/**
 * Stabilize: alternate bottom-up and top-down until tree is stable (≤6 passes).
 */
export const stabilize = (tree: TreeNodeState[]): TreeNodeState[] => {
    let t: TreeNodeState[] = tree;

    for (let i: number = 0; i < 6; i++) {
        const snap: string = JSON.stringify(t);

        t = bottomUp(t);
        t = topDown(t);
        if (JSON.stringify(t) === snap) break;
    }

    return t;
};

// ── Encryption Cascade ────────────────────────────────────────────────────────

/**
 * Cascade exposeEncrypted state top-down (user-initiated toggle).
 */
export const cascadeExposeEncrypted = (
    children: TreeNodeState[] | undefined,
    val: boolean
): TreeNodeState[] | undefined =>
    children
        ? children.map((n: TreeNodeState) => ({
            ...n,
            children: cascadeExposeEncrypted(n.children, val),
            exposeEncrypted: val
        }))
        : undefined;

/**
 * Cascade expose=true to all descendants.
 * Used when a user explicitly exposes a container.
 */
export const cascadeExposeOn = (
    children: TreeNodeState[] | undefined
): TreeNodeState[] | undefined =>
    children
        ? children.map((n: TreeNodeState) => ({
            ...n,
            children: cascadeExposeOn(n.children),
            exposed: true
        }))
        : undefined;

/**
 * Cascade expose=false and exposeEncrypted=false to all descendants.
 * Used when a user explicitly un-exposes a container.
 */
export const cascadeExposeOff = (
    children: TreeNodeState[] | undefined
): TreeNodeState[] | undefined =>
    children
        ? children.map((n: TreeNodeState) => ({
            ...n,
            children: cascadeExposeOff(n.children),
            exposeEncrypted: false,
            exposed: false
        }))
        : undefined;

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
    claimDisplayNames?: Map<string, string>
): TreeNodeState[] => {
    const exposePaths: Map<string, boolean> = new Map();
    const modifyPaths: Map<string, boolean> = new Map();

    (accessConfig.expose ?? []).forEach((e: { path: string; encrypted: boolean }) => {
        exposePaths.set(normalisePath(e.path), e.encrypted);
    });
    (accessConfig.modify ?? []).forEach((m: { path: string; encrypted: boolean }) => {
        // Strip type-hint braces used in modify paths e.g. /properties/riskScore{Integer}
        const cleanPath: string = m.path.replace(/\{[^}]+\}$/, "");

        modifyPaths.set(normalisePath(cleanPath), m.encrypted);
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

            // Direct match in expose
            const directExpose: boolean = exposePaths.has(np);
            const directExposeEnc: boolean = directExpose ? exposePaths.get(np) : false;

            // Covered by ancestor
            const ancestor: { covered: boolean; encrypted: boolean } = isCoveredByAncestor(np);

            const exposed: boolean = directExpose || ancestor.covered || parentExposed;
            const exposeEncrypted: boolean = directExpose
                ? directExposeEnc
                : ancestor.covered
                    ? ancestor.encrypted
                    : parentEncrypted;

            // Modify (leaf-only in practice)
            const directModify: boolean = modifyPaths.has(np);
            const modifyEncrypted: boolean = directModify ? modifyPaths.get(np) : false;

            let children: TreeNodeState[] | undefined;

            if (node.children) {
                children = convert(node.children, exposed, exposeEncrypted);
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
                            existingChild.modify = true;
                            existingChild.modifyEncrypted = modifyPaths.get(synthPath) ?? false;
                        }

                        return;
                    }

                    const isExposed: boolean = exposePaths.has(synthPath);
                    const synthExEnc: boolean = exposePaths.get(synthPath) ?? false;
                    const isModify: boolean = modifyPaths.has(synthPath);
                    const synthModEnc: boolean = modifyPaths.get(synthPath) ?? false;
                    const displayName: string = claimDisplayNames?.get(key) ?? key;

                    children = children || [];
                    children.push({
                        allowedOperations: (node.readOnly ?? false)
                            ? [ "EXPOSE" ]
                            : [ "EXPOSE", "MODIFY" ],
                        canDelete: true,
                        children: undefined,
                        dataType: node.dynamicEntryType ?? "String",
                        dynamicEntryAllowed: false,
                        dynamicEntryType: "",
                        exposeEncrypted: synthExEnc,
                        exposed: isExposed,
                        key: `synth-${Date.now()}-${children.length}`,
                        modify: isModify,
                        modifyEncrypted: synthModEnc,
                        nodeType: NodeType.LEAF,
                        path: synthPath,
                        readOnly: node.readOnly ?? false,
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
// expose[]:  topmost EXPOSE nodes — exposed descendants under an already-exposed
//            ancestor are omitted.
//            If exposeEncrypted → { path, encrypted: true }, else plain string.
//
// modify[]:  leaf nodes with modify=true.
//            If modifyEncrypted → { path, encrypted: true }, else plain string.

/**
 * Build the access config output from the current tree state.
 */
export const buildAccessConfig = (
    nodes: TreeNodeState[]
): { accessConfig: AccessConfigOutput; encryption: EncryptionOutput } => {

    const expose: ContextPathOutput[] = [];
    const modify: ContextPathOutput[] = [];

    /**
     * Check if all exposed children of a container share the same encryption flag.
     * Returns { uniform: true, encrypted } if yes, { uniform: false } otherwise.
     */
    const childrenEncryptionUniform = (
        children: TreeNodeState[]
    ): { uniform: boolean; encrypted?: boolean } => {
        const exposedKids: TreeNodeState[] = children.filter(
            (c: TreeNodeState) => c.exposed
        );

        if (exposedKids.length === 0) return { uniform: true, encrypted: false };

        const firstEnc: boolean = !!exposedKids[0].exposeEncrypted;
        const allSame: boolean = exposedKids.every(
            (c: TreeNodeState) => !!c.exposeEncrypted === firstEnc
        );

        return allSame
            ? { encrypted: firstEnc, uniform: true }
            : { uniform: false };
    };

    const walk = (ns: TreeNodeState[], ancestorExposed: boolean): void => {
        ns.forEach((node: TreeNodeState) => {
            const isLeaf: boolean = node.nodeType === NodeType.LEAF;

            // Modify: leaf-only, independent of expose logic
            if (node.modify && isLeaf) {
                const modifyPath: string = node.canDelete &&
                    node.dataType &&
                    node.dataType !== "String"
                    ? `${node.path}{${node.dataType}}`
                    : node.path;

                modify.push({ encrypted: !!node.modifyEncrypted, path: modifyPath });
            }

            // Expose logic
            if (node.exposed && !ancestorExposed) {
                if (isLeaf) {
                    // Leaf → always add with its encryption flag
                    expose.push({ encrypted: !!node.exposeEncrypted, path: node.path });

                    return;
                }

                // Container: check if ALL children are exposed with uniform encryption
                if (node.children && node.children.length > 0) {
                    const allChildrenExposed: boolean = node.children.every(
                        (c: TreeNodeState) => c.exposed
                    );

                    if (allChildrenExposed) {
                        const encInfo: { uniform: boolean; encrypted?: boolean } =
                            childrenEncryptionUniform(node.children);

                        if (encInfo.uniform) {
                            // All children exposed with same enc flag → emit parent
                            expose.push({ encrypted: !!encInfo.encrypted, path: node.path });
                            // Still collect modify from descendants
                            collectModify(node.children);

                            return;
                        }
                    }

                    // Not all children exposed or mixed encryption → descend
                    walk(node.children, false);

                    return;
                }

                // Empty container that is exposed → add it
                expose.push({ encrypted: !!node.exposeEncrypted, path: node.path });

                return;
            }

            // Not exposed at this level, or already covered by ancestor → descend
            if (node.children) {
                walk(node.children, ancestorExposed || node.exposed);
            }
        });
    };

    const collectModify = (ns: TreeNodeState[]): void => {
        ns.forEach((node: TreeNodeState) => {
            if (node.modify && node.nodeType === NodeType.LEAF) {
                const modifyPath: string = node.canDelete &&
                    node.dataType &&
                    node.dataType !== "String"
                    ? `${node.path}{${node.dataType}}`
                    : node.path;

                modify.push({ encrypted: !!node.modifyEncrypted, path: modifyPath });
            }
            if (node.children) {
                collectModify(node.children);
            }
        });
    };

    walk(nodes, false);

    return {
        accessConfig: { expose, modify },
        encryption: {}
    };
};
