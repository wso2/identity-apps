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

import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { Claim, ClaimsGetParams } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import AddClaimModal from "./add-claim-modal";
import FlowContextTreeNode from "./flow-context-tree-node";
import {
    AddEntryModalStateInterface,
    FlowContextTreePropsInterface,
    NodeType,
    TreeNodeStateInterface
} from "./models";
import {
    addChild,
    buildAccessConfig,
    deleteNode,
    findFirstLeafKey,
    findNode,
    mapMetadataToState,
    mapMetadataToStateWithAccessConfig,
    updateNode
} from "./utils";

/**
 * Whether a node is the URI-keyed claims container, i.e. its dynamic entries are local claims
 * selected from a dropdown rather than free-form map keys. The backend may report the path with
 * or without a trailing slash, so the trailing slash is normalised before matching.
 *
 * @param node - Tree node to test.
 * @returns `true` when the node is the URI-keyed claims container.
 */
const isClaimContainer = (node: TreeNodeStateInterface): boolean =>
    node.path.replace(/\/+$/, "") === "/user/claims";

interface FieldConfigPanelProps {
    selectedNode: TreeNodeStateInterface | null;
    readOnly: boolean;
    onDelete: (key: string) => void;
}

/**
 * Right-side panel that surfaces details of the currently-selected leaf and lets the
 * user delete it.
 */
const FieldConfigPanel: FunctionComponent<FieldConfigPanelProps> = ({
    selectedNode,
    readOnly,
    onDelete
}: FieldConfigPanelProps): ReactElement => {

    const { t } = useTranslation();

    const isLeaf: boolean = selectedNode?.nodeType === NodeType.LEAF;

    const displayDataType: string = selectedNode?.dataType ?? "";

    const canDeleteNode: boolean = !readOnly && !!selectedNode?.canDelete;

    return (
        <Box
            sx={ {
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: "8px",
                // Fixed min-height so switching between fields with different op shapes does
                // not change the panel size.
                display: "flex",
                flexDirection: "column",
                minHeight: 100,
                p: 2
            } }
        >
            <Typography variant="subtitle2" sx={ { fontWeight: 600, mb: 1.5 } }>
                { t("flowExtension:contextTree.fieldConfig.title") }
            </Typography>

            { !selectedNode || !isLeaf ? (
                <Box
                    sx={ {
                        alignItems: "center",
                        display: "flex",
                        flex: "1 1 auto",
                        flexDirection: "column",
                        gap: 1,
                        justifyContent: "center",
                        py: 4
                    } }
                >
                    <Typography variant="body2" color="text.secondary">
                        { t("flowExtension:contextTree.fieldConfig.emptyTitle") }
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                        { t("flowExtension:contextTree.fieldConfig.emptyHint") }
                    </Typography>
                </Box>
            ) : (
                <>
                    { /* ── Header: name (or rename input), datatype label, actions ── */ }
                    <Box sx={ { alignItems: "flex-start", display: "flex", gap: 1.5 } }>
                        <Box sx={ { flex: "1 1 auto", minWidth: 0 } }>
                            <Box sx={ { alignItems: "center", display: "flex", gap: 1 } }>
                                <Typography
                                    variant="body2"
                                    sx={ {
                                        fontFamily: "monospace",
                                        fontWeight: 600,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    } }
                                >
                                    { selectedNode.title }
                                </Typography>
                                { displayDataType && (
                                    <Chip
                                        label={ displayDataType }
                                        size="small"
                                        sx={ {
                                            "& .MuiChip-label": { px: "6px" },
                                            bgcolor: "grey.100",
                                            color: "text.secondary",
                                            fontFamily: "monospace",
                                            fontSize: "9px",
                                            height: 16
                                        } }
                                    />
                                ) }
                                { selectedNode.readOnly && (
                                    <Chip
                                        label={ t("flowExtension:contextTree.fieldConfig.readOnlyBadge") }
                                        size="small"
                                        sx={ {
                                            "& .MuiChip-label": { px: "6px" },
                                            bgcolor: "grey.100",
                                            color: "text.disabled",
                                            fontSize: "9px",
                                            fontWeight: 600,
                                            height: 16
                                        } }
                                    />
                                ) }
                            </Box>
                            <Typography
                                variant="caption"
                                color="text.disabled"
                                sx={ {
                                    display: "block",
                                    fontFamily: "monospace",
                                    mt: 0.3,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                } }
                            >
                                { selectedNode.isClaim
                                    ? selectedNode.path.replace(/^\/user\/claims\//, "")
                                    : selectedNode.path }
                            </Typography>
                        </Box>
                        { canDeleteNode && (
                            <Box sx={ { display: "flex", flexShrink: 0, gap: 0.5 } }>
                                <Tooltip
                                    title={ t("flowExtension:contextTree.fieldConfig.deleteTooltip") }
                                    placement="top"
                                >
                                    <IconButton
                                        size="small"
                                        onClick={ () => onDelete(selectedNode.key) }
                                        sx={ {
                                            "&:hover": { color: "error.main" },
                                            color: "grey.500"
                                        } }
                                    >
                                        <TrashIcon size={ 14 } />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ) }
                    </Box>
                </>
            ) }
        </Box>
    );
};

/**
 * Flow Context Tree — renders the metadata context tree with expose/modify
 * controls on the left and a field-configuration panel on the right.
 */
const FlowContextTree: FunctionComponent<FlowContextTreePropsInterface> = ({
    contextTree,
    onChange,
    initialAccessConfig,
    readOnly,
    allowReadOnlyClaimsModification = true,
    "data-componentid": componentId = "flow-context-tree"
}: FlowContextTreePropsInterface): ReactElement => {

    const [ allClaims, setAllClaims ] = useState<Claim[]>([]);

    const claimDisplayNames: Map<string, string> = useMemo(() => {
        const map: Map<string, string> = new Map();

        allClaims.forEach((c: Claim) => {
            if (c.claimURI && c.displayName) {
                map.set(c.claimURI, c.displayName);
            }
        });

        return map;
    }, [ allClaims ]);

    const claimReadOnlyMap: Map<string, boolean> = useMemo(() => {
        const map: Map<string, boolean> = new Map();

        allClaims.forEach((c: Claim) => {
            if (c.claimURI) {
                map.set(c.claimURI, !!c.readOnly);
            }
        });

        return map;
    }, [ allClaims ]);

    const [ tree, setTree ] = useState<TreeNodeStateInterface[]>(() =>
        initialAccessConfig
            ? mapMetadataToStateWithAccessConfig(contextTree, initialAccessConfig, undefined, {
                allowReadOnlyClaimsModification,
                claimReadOnlyMap: undefined
            })
            : mapMetadataToState(contextTree)
    );

    const [ selectedKey, setSelectedKey ] = useState<string | null>(null);

    const [ claimModal, setClaimModal ] = useState<AddEntryModalStateInterface>({
        open: false,
        parentNode: null
    });

    const builtConfig: ReturnType<typeof buildAccessConfig> = useMemo(
        () => buildAccessConfig(tree),
        [ tree ]
    );

    // Notify parent whenever tree state changes.
    useEffect(() => {
        onChange(builtConfig);
    }, [ builtConfig ]);

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

    // Re-initialise tree when input changes / once claims load.
    useEffect(() => {
        setTree(
            initialAccessConfig
                ? mapMetadataToStateWithAccessConfig(contextTree, initialAccessConfig, claimDisplayNames, {
                    allowReadOnlyClaimsModification,
                    claimReadOnlyMap
                })
                : mapMetadataToState(contextTree)
        );
    }, [ contextTree, initialAccessConfig, claimDisplayNames, claimReadOnlyMap, allowReadOnlyClaimsModification ]);

    // Default-select the first leaf once the tree is populated, and re-target if
    // the current selection no longer resolves (e.g. after a delete).
    useEffect(() => {
        if (selectedKey && findNode(tree, selectedKey)) {
            return;
        }
        const fallback: string | null = findFirstLeafKey(tree);

        if (fallback !== selectedKey) {
            setSelectedKey(fallback);
        }
    }, [ tree, selectedKey ]);

    const selectedNode: TreeNodeStateInterface | null = useMemo(
        () => (selectedKey ? findNode(tree, selectedKey) : null),
        [ tree, selectedKey ]
    );

    const handleToggleExpose = useCallback((key: string): void => {
        setTree((prev: TreeNodeStateInterface[]) =>
            updateNode(prev, key, (n: TreeNodeStateInterface) => ({
                ...n,
                exposed: !n.exposed
            }))
        );
    }, []);

    const handleToggleModify = useCallback((key: string): void => {
        setTree((prev: TreeNodeStateInterface[]) =>
            updateNode(prev, key, (n: TreeNodeStateInterface) => ({
                ...n,
                modify: !n.modify
            }))
        );
    }, []);

    const handleDelete = useCallback((key: string): void => {
        setTree((prev: TreeNodeStateInterface[]) => deleteNode(prev, key));
    }, []);

    const handleAddChild = useCallback((node: TreeNodeStateInterface): void => {
        if (isClaimContainer(node)) {
            setClaimModal({ open: true, parentNode: node });
        }
    }, []);

    const handleClaimModalSubmit = useCallback((claims: Claim[]): void => {
        const { parentNode } = claimModal;

        if (!parentNode) return;

        setTree((prev: TreeNodeStateInterface[]) => {
            let updated: TreeNodeStateInterface[] = prev;

            claims.forEach((claim: Claim, idx: number) => {
                // When the flow type permits modifying read-only claims, the claim's
                // read-only flag is ignored entirely — it's treated as a normal writable
                // entry. Only when modification is disallowed do we honour the flag.
                const treatAsReadOnly: boolean = !!claim.readOnly && !allowReadOnlyClaimsModification;
                const allowedOps: string[] = treatAsReadOnly
                    ? [ "EXPOSE" ]
                    : [ "EXPOSE", "MODIFY" ];

                const newEntry: TreeNodeStateInterface = {
                    allowedOperations: allowedOps,
                    canDelete: true,
                    children: undefined,
                    dataType: "String",
                    dynamicEntryAllowed: false,
                    dynamicEntryType: "",
                    exposed: false,
                    isClaim: true,
                    key: `claim-${Date.now()}-${idx}`,
                    modify: false,
                    nodeType: NodeType.LEAF,
                    // Join with a single slash regardless of whether the container path carries a
                    // trailing one, so the internal form is always `/user/claims/<uri>` — the shape
                    // the access-config serialiser expects to bracket-encode.
                    path: `${parentNode.path.replace(/\/+$/, "")}/${claim.claimURI}`,
                    readOnly: treatAsReadOnly,
                    replaceable: false,
                    title: claim.displayName
                };

                updated = addChild(updated, parentNode.key, newEntry);
            });

            return updated;
        });
        setClaimModal({ open: false, parentNode: null });
    }, [ claimModal, allowReadOnlyClaimsModification ]);

    const handleClaimModalClose = useCallback((): void => {
        setClaimModal({ open: false, parentNode: null });
    }, []);

    return (
        <Box
            data-componentid={ componentId }
            sx={ { display: "flex", flexDirection: "column", gap: 2 } }
        >
            { /* ── Top row: tree (left, 50%) + field config (right, 50%) ── */ }
            <Box sx={ { alignItems: "stretch", display: "flex", gap: 2 } }>
                <Box
                    sx={ {
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "grey.200",
                        borderRadius: "8px",
                        flex: "1 1 0",
                        minWidth: 0,
                        overflow: "auto",
                        pb: "14px",
                        pt: "10px",
                        px: "10px"
                    } }
                >
                    { tree.map((node: TreeNodeStateInterface) => (
                        <FlowContextTreeNode
                            key={ node.key }
                            node={ node }
                            depth={ 0 }
                            selectedKey={ selectedKey }
                            onSelect={ setSelectedKey }
                            onToggleExpose={ handleToggleExpose }
                            onToggleModify={ handleToggleModify }
                            onAddChild={ handleAddChild }
                            readOnly={ readOnly }
                            data-componentid={ `${componentId}-node` }
                        />
                    )) }
                </Box>

                <Box sx={ { display: "flex", flex: "1 1 0", flexDirection: "column", minWidth: 0 } }>
                    <FieldConfigPanel
                        selectedNode={ selectedNode }
                        readOnly={ !!readOnly }
                        onDelete={ handleDelete }
                    />
                </Box>
            </Box>

            <AddClaimModal
                open={ claimModal.open }
                parentNode={ claimModal.parentNode }
                existingClaimURIs={
                    claimModal.parentNode?.children?.map(
                        (c: TreeNodeStateInterface) => c.path.replace(/^\/user\/claims\//, "")
                    ) || []
                }
                externalClaims={ allClaims }
                allowReadOnlyClaimsModification={ allowReadOnlyClaimsModification }
                onClose={ handleClaimModalClose }
                onSubmit={ handleClaimModalSubmit }
                data-componentid={ `${componentId}-add-claim-modal` }
            />
        </Box>
    );
};

export default FlowContextTree;
