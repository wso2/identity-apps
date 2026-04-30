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

import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { Claim, ClaimsGetParams } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import AddClaimModal from "./add-claim-modal";
import AddEntryModal from "./add-entry-modal";
import FlowContextTreeNode from "./flow-context-tree-node";
import "./flow-context-tree.scss";
import {
    AddEntryModalState,
    FlowContextTreeProps,
    NodeType,
    TreeNodeState
} from "./models";
import {
    addChild,
    buildAccessConfig,
    deleteNode,
    mapMetadataToState,
    mapMetadataToStateWithAccessConfig,
    updateNode
} from "./utils";

/**
 * Flow Context Tree — renders the metadata context tree with expose/modify/encryption controls.
 * Designed as a reusable component for creation wizard, update UI, and flow builder.
 */
const FlowContextTree: FunctionComponent<FlowContextTreeProps> = ({
    contextTree,
    onChange,
    initialAccessConfig,
    hasCertificate,
    readOnly,
    allowReadOnlyClaimsModification = true,
    "data-componentid": componentId = "flow-context-tree"
}: FlowContextTreeProps): ReactElement => {

    const [allClaims, setAllClaims] = useState<Claim[]>([]);

    // Build a map of claim URI → displayName for resolving titles of synthesised claim nodes.
    const claimDisplayNames: Map<string, string> = useMemo(() => {
        const map: Map<string, string> = new Map();

        allClaims.forEach((c: Claim) => {
            if (c.claimURI && c.displayName) {
                map.set(c.claimURI, c.displayName);
            }
        });

        return map;
    }, [allClaims]);

    // Map of claim URI → readOnly. Used when reconciling an existing access config so that
    // synthesised claim leaves inherit per-claim read-only status from the Claims API rather
    // than falling back to the parent container's flag.
    const claimReadOnlyMap: Map<string, boolean> = useMemo(() => {
        const map: Map<string, boolean> = new Map();

        allClaims.forEach((c: Claim) => {
            if (c.claimURI) {
                map.set(c.claimURI, !!c.readOnly);
            }
        });

        return map;
    }, [allClaims]);

    const [tree, setTree] = useState<TreeNodeState[]>(() =>
        initialAccessConfig
            ? mapMetadataToStateWithAccessConfig(contextTree, initialAccessConfig, undefined, {
                allowReadOnlyClaimsModification,
                claimReadOnlyMap: undefined  // claims not yet loaded on first render
            })
            : mapMetadataToState(contextTree)
    );

    const [modal, setModal] = useState<AddEntryModalState>({
        open: false,
        parentNode: null
    });

    const [claimModal, setClaimModal] = useState<AddEntryModalState>({
        open: false,
        parentNode: null
    });

    // Notify parent whenever tree state changes.
    useEffect(() => {
        const { accessConfig, encryption } = buildAccessConfig(tree);

        onChange(accessConfig, encryption);
    }, [tree]);

    // Fetch all local claims once on mount.
    useEffect(() => {
        const params: ClaimsGetParams = {
            "exclude-hidden-claims": true,
            "exclude-identity-claims": true,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };

        getAllLocalClaims(params)
            .then((response: Claim[]) => {
                setAllClaims(
                    (response || []).sort((a: Claim, b: Claim) =>
                        (a.displayName || "").localeCompare(b.displayName || "")
                    )
                );
            })
            .catch(() => {
                // Silently fail — claims are optional for display name resolution.
            });
    }, []);

    // Re-initialize tree once claims are loaded (to resolve display names + per-claim
    // read-only status) or if input changes.
    useEffect(() => {
        setTree(
            initialAccessConfig
                ? mapMetadataToStateWithAccessConfig(contextTree, initialAccessConfig, claimDisplayNames, {
                    allowReadOnlyClaimsModification,
                    claimReadOnlyMap
                })
                : mapMetadataToState(contextTree)
        );
    }, [contextTree, initialAccessConfig, claimDisplayNames, claimReadOnlyMap, allowReadOnlyClaimsModification]);

    const handleToggleExpose = useCallback((key: string): void => {
        setTree((prev: TreeNodeState[]) =>
            updateNode(prev, key, (n: TreeNodeState) => ({
                ...n,
                exposed: !n.exposed,
                // Clear encryption when un-exposing
                exposeEncrypted: !n.exposed ? n.exposeEncrypted : false
            }))
        );
    }, []);

    const handleToggleModify = useCallback((key: string): void => {
        setTree((prev: TreeNodeState[]) =>
            updateNode(prev, key, (n: TreeNodeState) => ({
                ...n,
                modify: !n.modify,
                modifyEncrypted: n.modify ? false : n.modifyEncrypted
            }))
        );
    }, []);

    const handleToggleExposeEncrypt = useCallback((key: string): void => {
        setTree((prev: TreeNodeState[]) =>
            updateNode(prev, key, (n: TreeNodeState) => ({
                ...n,
                exposeEncrypted: !n.exposeEncrypted
            }))
        );
    }, []);

    const handleToggleModifyEncrypt = useCallback((key: string): void => {
        setTree((prev: TreeNodeState[]) =>
            updateNode(prev, key, (n: TreeNodeState) => ({
                ...n,
                modifyEncrypted: !n.modifyEncrypted
            }))
        );
    }, []);

    const handleDelete = useCallback((key: string): void => {
        setTree((prev: TreeNodeState[]) => deleteNode(prev, key));
    }, []);

    const handleRename = useCallback((key: string, newTitle: string): void => {
        setTree((prev: TreeNodeState[]) =>
            updateNode(prev, key, (n: TreeNodeState) => ({
                ...n,
                title: newTitle
            }))
        );
    }, []);

    const handleAddChild = useCallback((node: TreeNodeState): void => {
        if (node.path === "/user/claims/") {
            setClaimModal({ open: true, parentNode: node });
        } else {
            setModal({ open: true, parentNode: node });
        }
    }, []);

    const handleModalSubmit = useCallback(({ keyName, objectStructure }: {
        keyName: string;
        objectStructure: string;
    }): void => {
        const { parentNode } = modal;

        if (!parentNode) return;

        // If the parent is read-only, dynamic entries must also be read-only (expose-only).
        const isParentReadOnly: boolean = !!parentNode.readOnly;

        const newEntry: TreeNodeState = {
            allowedOperations: isParentReadOnly ? [ "EXPOSE" ] : [ "EXPOSE", "MODIFY" ],
            canDelete: true,
            children: undefined,
            dataType: objectStructure || "String",
            dynamicEntryAllowed: false,
            dynamicEntryType: "",
            exposeEncrypted: false,
            exposed: false,
            key: `e-${Date.now()}`,
            modify: false,
            modifyEncrypted: false,
            nodeType: NodeType.LEAF,
            path: `${parentNode.path}${keyName}`,
            readOnly: isParentReadOnly,
            replaceable: false,
            title: keyName
        };

        setTree((prev: TreeNodeState[]) =>
            addChild(prev, parentNode.key, newEntry)
        );
        setModal({ open: false, parentNode: null });
    }, [modal]);

    const handleModalClose = useCallback((): void => {
        setModal({ open: false, parentNode: null });
    }, []);

    const handleClaimModalSubmit = useCallback((claims: Claim[]): void => {
        const { parentNode } = claimModal;

        if (!parentNode) return;

        setTree((prev: TreeNodeState[]) => {
            let updated: TreeNodeState[] = prev;

            claims.forEach((claim: Claim, idx: number) => {
                // Carry the per-claim readOnly flag through to the synthesised tree entry so
                // the modify-drop rule (and the `allowedOperations` gating below) can fire on
                // it. Read-only claims get only EXPOSE in their allowedOperations unless the
                // active flow type permits MODIFY on read-only claims.
                const claimReadOnly: boolean = !!claim.readOnly;
                const allowsModifyOnReadOnly: boolean = allowReadOnlyClaimsModification;
                const allowedOps: string[] = (claimReadOnly && !allowsModifyOnReadOnly)
                    ? [ "EXPOSE" ]
                    : [ "EXPOSE", "MODIFY" ];

                const newEntry: TreeNodeState = {
                    allowedOperations: allowedOps,
                    canDelete: true,
                    children: undefined,
                    dataType: "String",
                    dynamicEntryAllowed: false,
                    dynamicEntryType: "",
                    exposeEncrypted: false,
                    exposed: false,
                    isClaim: true,
                    key: `claim-${Date.now()}-${idx}`,
                    modify: false,
                    modifyEncrypted: false,
                    nodeType: NodeType.LEAF,
                    path: `${parentNode.path}${claim.claimURI}`,
                    readOnly: claimReadOnly,
                    replaceable: false,
                    title: claim.displayName
                };

                updated = addChild(updated, parentNode.key, newEntry);
            });

            return updated;
        });
        setClaimModal({ open: false, parentNode: null });
    }, [claimModal, allowReadOnlyClaimsModification]);

    const handleClaimModalClose = useCallback((): void => {
        setClaimModal({ open: false, parentNode: null });
    }, []);

    return (
        <Box className="flow-context-tree" data-componentid={componentId}>
            { /* ── Header bar ── */}
            <Box
                sx={{
                    alignItems: "center",
                    borderBottom: "1px solid",
                    borderColor: "grey.100",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: "space-between",
                    px: "14px",
                    py: "8px"
                }}
            >
                <Typography
                    sx={{
                        fontSize: 16,
                        fontWeight: 300,
                        letterSpacing: "0.07em"
                    }}
                >
                    Context Fields
                </Typography>
                <Box
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px"
                    }}
                >
                    <Box sx={{ alignItems: "center", display: "inline-flex", gap: "4px" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                            stroke="var(--tree-expose)" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <Typography sx={{ color: "text.disabled", fontSize: 10 }}>Exposing the value Encrypted</Typography>
                    </Box>
                    <Box sx={{ alignItems: "center", display: "inline-flex", gap: "4px" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                            stroke="var(--tree-modify)" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <Typography sx={{ color: "text.disabled", fontSize: 10 }}>Receiving Modifying value Encrypted</Typography>
                    </Box>
                    <Box sx={{ alignItems: "center", display: "inline-flex", gap: "4px" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                            stroke="var(--tree-green)" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <Typography sx={{ color: "text.disabled", fontSize: 10 }}>Both Encrypted</Typography>
                    </Box>
                </Box>
            </Box>

            { /* ── Tree ── */}
            <Box sx={{ pb: "14px", pt: "8px", px: "10px" }}>
                {tree.map((node: TreeNodeState) => (
                    <FlowContextTreeNode
                        key={node.key}
                        node={node}
                        depth={0}
                        hasCertificate={hasCertificate}
                        onToggleExpose={handleToggleExpose}
                        onToggleModify={handleToggleModify}
                        onToggleExposeEncrypt={handleToggleExposeEncrypt}
                        onToggleModifyEncrypt={handleToggleModifyEncrypt}
                        onDelete={handleDelete}
                        onRename={handleRename}
                        onAddChild={handleAddChild}
                        readOnly={readOnly}
                        data-componentid={`${componentId}-node`}
                    />
                ))}
            </Box>

            { /* ── Add Entry Modal ── */}
            <AddEntryModal
                open={modal.open}
                parentNode={modal.parentNode}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                data-componentid={`${componentId}-add-entry-modal`}
            />

            { /* ── Claim Selection Modal ── */}
            <AddClaimModal
                open={claimModal.open}
                parentNode={claimModal.parentNode}
                existingClaimURIs={
                    claimModal.parentNode?.children?.map(
                        (c: TreeNodeState) => c.path.replace(/^\/user\/claims\//, "")
                    ) || []
                }
                externalClaims={allClaims}
                allowReadOnlyClaimsModification={allowReadOnlyClaimsModification}
                onClose={handleClaimModalClose}
                onSubmit={handleClaimModalSubmit}
                data-componentid={`${componentId}-add-claim-modal`}
            />
        </Box>
    );
};

export default FlowContextTree;
