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
    AccessConfigOutputInterface,
    ContextPathOutputInterface,
    ContextTreeNodeMetadataInterface,
    InitialAccessConfigInterface,
    NodeType,
    TreeNodeStateInterface
} from "./models";

/**
 * Check if a node is a container (OBJECT, MAP, or COMPLEX_MAP).
 */
const isContainer = (node: TreeNodeStateInterface): boolean =>
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

// ── Tree Mutation Helpers ─────────────────────────────────────────────────────

/**
 * Immutably update a node by key.
 */
export const updateNode = (
    nodes: TreeNodeStateInterface[],
    key: string,
    fn: (node: TreeNodeStateInterface) => TreeNodeStateInterface
): TreeNodeStateInterface[] =>
    nodes.map((n: TreeNodeStateInterface) =>
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
    nodes: TreeNodeStateInterface[],
    key: string
): TreeNodeStateInterface[] =>
    nodes
        .filter((n: TreeNodeStateInterface) => n.key !== key)
        .map((n: TreeNodeStateInterface) => ({
            ...n,
            children: n.children ? deleteNode(n.children, key) : undefined
        }));

/**
 * Immutably add a child node under the given parent key.
 */
export const addChild = (
    nodes: TreeNodeStateInterface[],
    parentKey: string,
    child: TreeNodeStateInterface
): TreeNodeStateInterface[] =>
    nodes.map((n: TreeNodeStateInterface) => {
        if (n.key === parentKey) {
            return { ...n, children: [ ...(n.children || []), child ] };
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
    nodes: ContextTreeNodeMetadataInterface[]
): TreeNodeStateInterface[] =>
    nodes.map((node: ContextTreeNodeMetadataInterface) => ({
        allowedOperations: node.allowedOperations || [],
        canDelete: node.canDelete ?? false,
        children: node.children ? mapMetadataToState(node.children) : undefined,
        dataType: node.dataType,
        dynamicEntryAllowed: node.dynamicEntryAllowed ?? false,
        dynamicEntryType: node.dynamicEntryType ?? "",
        exposed: false,
        // Path-derived key — backend metadata reuses bare names like "id" across
        // siblings (user.id, organization.id, application.id). Using node.key
        // verbatim makes updateNode match all of them at once.
        key: `node:${normalisePath(node.path)}`,
        modify: false,
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

// ── Claim path encoding ───────────────────────────────────────────────────────
//
// The backend encodes URI-keyed claim entries as a bracketed segment
// (`/user/claims[uri=<uri>]`), while the tree works with plain slash segments
// (`/user/claims/<uri>`) so claim entries share the same prefix/slice logic as every
// other dynamic container. These two helpers bridge that single difference at the
// tree's I/O boundary — ingest decodes, buildAccessConfig (and the path display) encodes.
// Any non-claim path passes through untouched. A trailing type hint (`{String}`) is
// preserved across both directions.

/**
 * Encode a tree path to the API form: bracket-encode a URI-keyed claim entry,
 * pass everything else through unchanged.
 *
 * @example `/user/claims/http://wso2.org/claims/email{String}`
 *          → `/user/claims[uri=http://wso2.org/claims/email]{String}`
 */
const encodeClaimPath = (path: string): string =>
    path.replace(/^\/user\/claims\/(.+?)(\{[^}]+\})?$/, "/user/claims[uri=$1]$2");

/**
 * Decode an API path to the tree form: unwrap a bracketed claim entry into a slash
 * segment, pass everything else through unchanged. Inverse of {@link encodeClaimPath}.
 */
const decodeClaimPath = (path: string): string =>
    path.replace(/^\/user\/claims\[uri=(.*)\](\{[^}]+\})?$/, "/user/claims/$1$2");

/**
 * Convert backend metadata nodes to UI state nodes, pre-populating the
 * expose/modify flags from an existing access config returned
 * by the GET action API.
 *
 * For each node the algorithm:
 *   1. Checks if the node's path appears in `expose[]` → set exposed.
 *   2. Checks if a *parent* path in `expose[]` covers this node → cascade exposed.
 *   3. Checks if the node's path appears in `modify[]` → set modify.
 *
 * Dynamic entries (e.g. claim keys under /user/claims/) that exist in the
 * access config but NOT in the metadata are synthesised as children.
 *
 * @param claimDisplayNames - Optional map of claim URI → display name for rendering
 *                            human-readable titles on synthesised claim entries.
 */
export const mapMetadataToStateWithAccessConfig = (
    nodes: ContextTreeNodeMetadataInterface[],
    accessConfig: InitialAccessConfigInterface,
    claimDisplayNames?: Map<string, string>,
    options: {
        /** Whether the active flow type permits MODIFY on read-only nodes. Defaults to true. */
        allowReadOnlyClaimsModification?: boolean;
        /** claimURI → readOnly map; used when synthesising claim leaves to inherit per-claim
         *  read-only status from the Claims API. Without this every synthesised claim is
         *  treated as not-readOnly and the modify-drop rule below cannot fire on it. */
        claimReadOnlyMap?: Map<string, boolean>;
    } = {}
): TreeNodeStateInterface[] => {

    const allowReadOnlyClaimsModification: boolean =
        options.allowReadOnlyClaimsModification !== false;
    const claimReadOnlyMap: Map<string, boolean> = options.claimReadOnlyMap ?? new Map();
    const exposePaths: Set<string> = new Set();
    const modifyPaths: Set<string> = new Set();
    // Preserve the type-hint string ("Integer", "[String]", "risk: String, …") keyed
    // by clean path so synthesised properties children get the correct dataType on
    // reload. Without this, the round-trip collapses every dynamic entry's type back
    // to the container's `dynamicEntryType` ("Object").
    const modifyTypeHints: Map<string, string> = new Map();

    (accessConfig.expose ?? []).forEach((e: { path: string }) => {
        exposePaths.add(normalisePath(decodeClaimPath(e.path)));
    });
    (accessConfig.modify ?? []).forEach((m: { path: string }) => {
        const decoded: string = decodeClaimPath(m.path);
        const typeHintMatch: RegExpMatchArray | null = decoded.match(/\{([^}]+)\}$/);
        const cleanPath: string = decoded.replace(/\{[^}]+\}$/, "");
        const norm: string = normalisePath(cleanPath);

        modifyPaths.add(norm);
        if (typeHintMatch) {
            modifyTypeHints.set(norm, typeHintMatch[1]);
        }
    });

    /**
     * Check if a path is covered by an ancestor path in the expose set.
     */
    const isCoveredByAncestor = (path: string): boolean => {
        const normalised: string = normalisePath(path);
        const parts: string[] = normalised.split("/").filter(Boolean);
        let current: string = "";

        for (const part of parts) {
            current += "/" + part;
            if (current !== normalised && exposePaths.has(current)) {
                return true;
            }
        }

        return false;
    };

    const convert = (
        metaNodes: ContextTreeNodeMetadataInterface[],
        parentExposed: boolean
    ): TreeNodeStateInterface[] => {
        const result: TreeNodeStateInterface[] = [];

        for (const node of metaNodes) {
            const np: string = normalisePath(node.path);
            const nodeIsContainer: boolean = isContainer({
                nodeType: node.nodeType
            } as TreeNodeStateInterface);

            // Direct match in expose (only meaningful for leaf nodes)
            const directExpose: boolean = exposePaths.has(np);

            // For leaf nodes: exposed if directly in expose paths or covered by ancestor
            // For container nodes: never exposed (expose is leaf-only)
            const ancestorCovered: boolean = isCoveredByAncestor(np);
            const exposed: boolean = nodeIsContainer
                ? false
                : (directExpose || ancestorCovered || parentExposed);

            // Modify (leaf-only in practice). When the flow type forbids modifying read-only
            // nodes, drop a previously-saved MODIFY mark on render. The cleanup commits on
            // the next save — the saved access config remains untouched until then.
            const nodeReadOnly: boolean = node.readOnly ?? false;
            let directModify: boolean = modifyPaths.has(np);

            if (nodeReadOnly && !allowReadOnlyClaimsModification) {
                directModify = false;
            }

            let children: TreeNodeStateInterface[] | undefined;

            if (node.children) {
                // Pass parent exposed state down so child leaves inherit coverage
                const childExposed: boolean = directExpose || ancestorCovered || parentExposed;

                children = convert(node.children, childExposed);
            }

            // Synthesise dynamic entries that exist in accessConfig but not in metadata
            if (node.dynamicEntryAllowed) {
                const existingChildPaths: Set<string> = new Set(
                    (children || []).map((c: TreeNodeStateInterface) => normalisePath(c.path))
                );

                const containerPrefix: string = normalisePath(node.path) + "/";

                // Collect unique dynamic keys from both expose and modify entries.
                // Use the full remaining path after the container prefix (not split("/")[0])
                // because claim URIs contain slashes (e.g. http://wso2.org/claims/displayName).
                const dynamicKeys: Set<string> = new Set<string>();

                exposePaths.forEach((ePath: string) => {
                    if (ePath.startsWith(containerPrefix)) {
                        const key: string = ePath.slice(containerPrefix.length);

                        if (key) {
                            dynamicKeys.add(key);
                        }
                    }
                });

                modifyPaths.forEach((mPath: string) => {
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
                        const existingChild: TreeNodeStateInterface | undefined = (children || []).find(
                            (c: TreeNodeStateInterface) => normalisePath(c.path) === synthPath
                        );

                        if (existingChild && modifyPaths.has(synthPath)) {
                            // Same drop rule as below — don't reinstate MODIFY on a read-only
                            // node when the flow type forbids it.
                            if (existingChild.readOnly && !allowReadOnlyClaimsModification) {
                                existingChild.modify = false;
                            } else {
                                existingChild.modify = true;
                            }
                        }

                        return;
                    }

                    const isExposed: boolean = exposePaths.has(synthPath);
                    let isModify: boolean = modifyPaths.has(synthPath);
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
                        exposed: isExposed,
                        isClaim: isUnderClaims,
                        // Path-derived key so two synthesised entries in different containers
                        // never collide (Date.now() collisions caused dual-row highlighting).
                        key: `synth:${synthPath}`,
                        modify: isModify,
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
                exposed,
                // Path-derived key — backend metadata reuses bare names like "id"
                // across siblings, which caused updateNode to toggle every node
                // sharing the same key at once.
                key: `node:${np}`,
                modify: directModify,
                nodeType: node.nodeType,
                path: node.path,
                readOnly: node.readOnly ?? false,
                replaceable: node.replaceable ?? false,
                title: node.title
            });
        }

        return result;
    };

    return convert(nodes, false);
};

// ── Access Config Builder ────────────────────────────────────────────────────
//
// expose[]:  LEAF nodes with exposed=true.
//            Container nodes are never exposed; only individual leaf paths appear.
//
// modify[]:  LEAF nodes with modify=true.

// ── Selection Helpers ────────────────────────────────────────────────────────

/**
 * Depth-first lookup for the first leaf node's key. Used to seed the default
 * selection in the field-configuration panel when the tree first renders.
 */
export const findFirstLeafKey = (nodes: TreeNodeStateInterface[]): string | null => {
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
    nodes: TreeNodeStateInterface[],
    key: string
): TreeNodeStateInterface | null => {
    for (const node of nodes) {
        if (node.key === key) {
            return node;
        }
        if (node.children) {
            const found: TreeNodeStateInterface | null = findNode(node.children, key);

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
    nodes: TreeNodeStateInterface[]
): AccessConfigOutputInterface => {

    const expose: ContextPathOutputInterface[] = [];
    const modify: ContextPathOutputInterface[] = [];

    const walk = (ns: TreeNodeStateInterface[]): void => {
        ns.forEach((node: TreeNodeStateInterface) => {
            const isLeaf: boolean = node.nodeType === NodeType.LEAF;

            if (isLeaf) {
                // Expose: leaf-only
                if (node.exposed) {
                    expose.push({ path: encodeClaimPath(node.path) });
                }

                // Modify: leaf-only
                if (node.modify) {
                    const modifyPath: string = node.canDelete &&
                        node.dataType &&
                        node.dataType !== "String"
                        ? `${node.path}{${node.dataType}}`
                        : node.path;

                    modify.push({ path: encodeClaimPath(modifyPath) });
                }
            }

            // Descend into children
            if (node.children) {
                walk(node.children);
            }
        });
    };

    walk(nodes);

    return { expose, modify };
};
