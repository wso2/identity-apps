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
import Chip from "@oxygen-ui/react/Chip";
import IconButton from "@oxygen-ui/react/IconButton";
import Switch from "@oxygen-ui/react/Switch";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { Claim, ClaimsGetParams } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    LazyExoticComponent,
    ReactElement,
    Suspense,
    lazy,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
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
    findFirstLeafKey,
    findNode,
    mapMetadataToState,
    mapMetadataToStateWithAccessConfig,
    updateNode
} from "./utils";

const MonacoEditor: LazyExoticComponent<any> = lazy(() =>
    import("@monaco-editor/react" /* webpackChunkName: "FCTMonacoEditor" */)
);

/**
 * Small lock SVG used in the encryption rows of the field-configuration panel.
 */
const PanelLockIcon = ({ color }: { color: string }): ReactElement => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke={ color } strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round"
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

/**
 * Returns the parent path for a node (everything up to and including the trailing slash
 * before the last segment). Used when renaming nodes — the path's last segment is replaced
 * with the new title to keep `path` and `title` in sync for dynamic entries.
 */
const getParentPath = (path: string): string => {
    const trimmed: string = path.replace(/\/$/, "");
    const idx: number = trimmed.lastIndexOf("/");

    return idx >= 0 ? trimmed.substring(0, idx + 1) : "/";
};

interface EncryptionCardProps {
    title: string;
    color: string;
    checked: boolean;
    disabled: boolean;
    disabledReason: string;
    onToggle: () => void;
    "data-componentid"?: string;
}

/**
 * One of two side-by-side encryption cards in the field configuration panel.
 * Uses fixed flex-basis so the panel height stays constant when switching between
 * a leaf that supports both expose+modify and one that only supports expose.
 */
const EncryptionCard: FunctionComponent<EncryptionCardProps> = ({
    title,
    color,
    checked,
    disabled,
    disabledReason,
    onToggle,
    "data-componentid": componentId
}: EncryptionCardProps): ReactElement => (
    <Tooltip title={ disabled ? disabledReason : "" } placement="top" arrow>
        <Box
            sx={ {
                alignItems: "center",
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: "8px",
                display: "flex",
                flex: "1 1 0",
                gap: 1.5,
                minHeight: 64,
                opacity: disabled ? 0.55 : 1,
                px: 1.5,
                py: 1
            } }
            data-componentid={ componentId }
        >
            <PanelLockIcon color={ disabled ? "#A0A0A0" : color } />
            <Box sx={ { flex: "1 1 auto", minWidth: 0 } }>
                <Typography variant="body2" sx={ { fontWeight: 600, lineHeight: 1.2 } }>
                    { title }
                </Typography>
                { disabled && (
                    <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={ { display: "block", lineHeight: 1.3, mt: 0.3 } }
                    >
                        { disabledReason }
                    </Typography>
                ) }
            </Box>
            <Switch
                size="small"
                checked={ checked }
                disabled={ disabled }
                onChange={ disabled ? undefined : onToggle }
                sx={ {
                    "& .MuiSwitch-switchBase.Mui-checked": { color },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: color }
                } }
            />
        </Box>
    </Tooltip>
);

interface FieldConfigPanelProps {
    selectedNode: TreeNodeState | null;
    hasCertificate: boolean;
    readOnly: boolean;
    onToggleExposeEncrypt: (key: string) => void;
    onToggleModifyEncrypt: (key: string) => void;
    onRename: (key: string, newTitle: string) => void;
    onDelete: (key: string) => void;
    onEditPropertiesEntry: (node: TreeNodeState) => void;
}

/**
 * Right-side panel that surfaces details of the currently-selected leaf and lets the
 * user rename, delete, and configure encryption flags for it.
 */
const FieldConfigPanel: FunctionComponent<FieldConfigPanelProps> = ({
    selectedNode,
    hasCertificate,
    readOnly,
    onToggleExposeEncrypt,
    onToggleModifyEncrypt,
    onRename,
    onDelete,
    onEditPropertiesEntry
}: FieldConfigPanelProps): ReactElement => {

    const [ editing, setEditing ] = useState<boolean>(false);
    const [ editValue, setEditValue ] = useState<string>("");

    // Reset inline-edit state whenever the selection changes.
    useEffect(() => {
        setEditing(false);
        setEditValue(selectedNode?.title ?? "");
    }, [ selectedNode?.key ]);

    const isLeaf: boolean = selectedNode?.nodeType === NodeType.LEAF;
    const isPropertiesEntry: boolean = !!selectedNode?.path?.startsWith("/properties/")
        && selectedNode?.path !== "/properties/";

    const canRename: boolean = !readOnly
        && !!selectedNode?.canDelete
        && !selectedNode?.isClaim
        && !selectedNode?.readOnly;
    const canDeleteNode: boolean = !readOnly && !!selectedNode?.canDelete;

    const canExposeOp: boolean = !!selectedNode?.allowedOperations.includes("EXPOSE") && isLeaf;
    const canModifyOp: boolean = !!selectedNode?.allowedOperations.includes("MODIFY")
        && isLeaf
        && !selectedNode?.readOnly;

    const handleStartEdit = (): void => {
        if (!selectedNode) return;

        if (isPropertiesEntry) {
            onEditPropertiesEntry(selectedNode);

            return;
        }
        setEditValue(selectedNode.title);
        setEditing(true);
    };

    const handleSaveEdit = (): void => {
        if (!selectedNode) return;
        const next: string = editValue.trim() || selectedNode.title;

        if (next !== selectedNode.title) {
            onRename(selectedNode.key, next);
        }
        setEditing(false);
    };

    return (
        <Box
            className="field-config-panel"
            sx={ {
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: "8px",
                p: 2
            } }
        >
            <Typography variant="subtitle2" sx={ { fontWeight: 600, mb: 1.5 } }>
                Field Configuration
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
                        No field selected
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                        Select a leaf field from the tree to configure it.
                    </Typography>
                </Box>
            ) : (
                <>
                    { /* ── Header: name (or rename input), datatype label, actions ── */ }
                    <Box sx={ { alignItems: "flex-start", display: "flex", gap: 1.5 } }>
                        <Box sx={ { flex: "1 1 auto", minWidth: 0 } }>
                            <Box sx={ { alignItems: "center", display: "flex", gap: 1 } }>
                                { editing ? (
                                    <TextField
                                        size="small"
                                        autoFocus
                                        value={ editValue }
                                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                            setEditValue(e.target.value)
                                        }
                                        onBlur={ handleSaveEdit }
                                        onKeyDown={ (e: React.KeyboardEvent) => {
                                            if (e.key === "Enter") handleSaveEdit();
                                            if (e.key === "Escape") setEditing(false);
                                        } }
                                        sx={ { flex: "1 1 auto" } }
                                    />
                                ) : (
                                    <Typography
                                        variant="body2"
                                        sx={ {
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontWeight: 600,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        } }
                                    >
                                        { selectedNode.title }
                                    </Typography>
                                ) }
                                { !editing && selectedNode.dataType && (
                                    <Chip
                                        label={ selectedNode.dataType }
                                        size="small"
                                        sx={ {
                                            "& .MuiChip-label": { px: "6px" },
                                            bgcolor: "grey.100",
                                            color: "text.secondary",
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: "9px",
                                            height: 16
                                        } }
                                    />
                                ) }
                                { !editing && selectedNode.readOnly && (
                                    <Chip
                                        label="Read-Only"
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
                                    fontFamily: "'JetBrains Mono', monospace",
                                    mt: 0.3,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                } }
                            >
                                { selectedNode.path }
                            </Typography>
                        </Box>
                        { (canRename || canDeleteNode) && !editing && (
                            <Box sx={ { display: "flex", flexShrink: 0, gap: 0.5 } }>
                                { canRename && (
                                    <Tooltip title="Edit" placement="top">
                                        <IconButton
                                            size="small"
                                            onClick={ handleStartEdit }
                                            sx={ {
                                                "&:hover": {
                                                    bgcolor: "var(--tree-expose-faint)",
                                                    color: "var(--tree-expose)"
                                                },
                                                color: "grey.500"
                                            } }
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor"
                                                strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </IconButton>
                                    </Tooltip>
                                ) }
                                { canDeleteNode && (
                                    <Tooltip title="Delete" placement="top">
                                        <IconButton
                                            size="small"
                                            onClick={ () => onDelete(selectedNode.key) }
                                            sx={ {
                                                "&:hover": { color: "error.main" },
                                                color: "grey.500"
                                            } }
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor"
                                                strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path
                                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1
                                                        2-2h4a2 2 0 0 1 2 2v2"
                                                />
                                            </svg>
                                        </IconButton>
                                    </Tooltip>
                                ) }
                            </Box>
                        ) }
                    </Box>

                    { /* ── Encryption section ── */ }
                    <Typography
                        variant="overline"
                        color="text.secondary"
                        sx={ { display: "block", fontWeight: 600, mt: 2.5 } }
                    >
                        Encryption
                    </Typography>
                    <Box sx={ { display: "flex", flexDirection: "column", gap: 1.5, mt: 1 } }>
                        <EncryptionCard
                            title="Expose encrypted"
                            color="var(--tree-expose)"
                            checked={ !!selectedNode.exposeEncrypted }
                            disabled={ !canExposeOp || readOnly || !selectedNode.exposed || !hasCertificate }
                            disabledReason={
                                !canExposeOp
                                    ? "Expose is not allowed for this field."
                                    : !selectedNode.exposed
                                        ? "Mark this field as EXPOSE in the tree to enable encryption."
                                        : !hasCertificate
                                            ? "Add a certificate to enable encryption."
                                            : "Read only."
                            }
                            onToggle={ () => onToggleExposeEncrypt(selectedNode.key) }
                            data-componentid="field-config-panel-expose-enc"
                        />
                        <EncryptionCard
                            title="Modify encrypted"
                            color="var(--tree-modify)"
                            checked={ !!selectedNode.modifyEncrypted }
                            disabled={ !canModifyOp || readOnly || !selectedNode.modify }
                            disabledReason={
                                !canModifyOp
                                    ? "Modify is not allowed for this field."
                                    : !selectedNode.modify
                                        ? "Mark this field as MODIFY in the tree to enable encryption."
                                        : "Read only."
                            }
                            onToggle={ () => onToggleModifyEncrypt(selectedNode.key) }
                            data-componentid="field-config-panel-modify-enc"
                        />
                    </Box>
                </>
            ) }
        </Box>
    );
};

interface AccessConfigMonacoProps {
    accessConfig: { expose: { path: string; encrypted: boolean }[]; modify: { path: string; encrypted: boolean }[] };
}

/**
 * Read-only Monaco editor showing the access config payload (the slice that
 * gets sent to the backend). Lazy-loaded the same way as branding's CustomText.
 */
const AccessConfigMonaco: FunctionComponent<AccessConfigMonacoProps> = ({
    accessConfig
}: AccessConfigMonacoProps): ReactElement => {

    const value: string = useMemo(
        () => JSON.stringify({ accessConfig }, null, 4),
        [ accessConfig ]
    );

    return (
        <Box
            className="access-config-monaco"
            sx={ {
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: "8px",
                overflow: "hidden"
            } }
        >
            <Box
                sx={ {
                    alignItems: "baseline",
                    borderBottom: "1px solid",
                    borderColor: "grey.200",
                    display: "flex",
                    gap: 1,
                    px: 2,
                    py: 1
                } }
            >
                <Typography variant="subtitle2" sx={ { fontWeight: 600 } }>
                    Access configuration payload
                </Typography>
                <Typography variant="caption" color="text.disabled">
                    JSON sent to the backend on update
                </Typography>
            </Box>
            <Box className="access-config-monaco__editor" sx={ { height: 300 } }>
                <Suspense fallback={ null }>
                    <MonacoEditor
                        loading={ null }
                        width="100%"
                        height="300px"
                        language="json"
                        theme="vs-dark"
                        value={ value }
                        options={ {
                            automaticLayout: true,
                            lineNumbers: "off",
                            minimap: { enabled: false },
                            readOnly: true,
                            scrollBeyondLastLine: false
                        } }
                    />
                </Suspense>
            </Box>
        </Box>
    );
};

/**
 * Flow Context Tree — renders the metadata context tree with expose/modify/encryption
 * controls on the left and a field-configuration panel + read-only access-config JSON
 * preview on the right.
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

    const [ tree, setTree ] = useState<TreeNodeState[]>(() =>
        initialAccessConfig
            ? mapMetadataToStateWithAccessConfig(contextTree, initialAccessConfig, undefined, {
                allowReadOnlyClaimsModification,
                claimReadOnlyMap: undefined
            })
            : mapMetadataToState(contextTree)
    );

    const [ selectedKey, setSelectedKey ] = useState<string | null>(null);

    const [ modal, setModal ] = useState<AddEntryModalState & {
        mode?: "create" | "edit";
        editingKey?: string | null;
        initialKeyName?: string;
        initialDataType?: string;
    }>({
        editingKey: null,
        initialDataType: "",
        initialKeyName: "",
        mode: "create",
        open: false,
        parentNode: null
    });

    const [ claimModal, setClaimModal ] = useState<AddEntryModalState>({
        open: false,
        parentNode: null
    });

    const builtConfig: ReturnType<typeof buildAccessConfig> = useMemo(
        () => buildAccessConfig(tree),
        [ tree ]
    );

    // Notify parent whenever tree state changes.
    useEffect(() => {
        onChange(builtConfig.accessConfig, builtConfig.encryption);
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

    const selectedNode: TreeNodeState | null = useMemo(
        () => (selectedKey ? findNode(tree, selectedKey) : null),
        [ tree, selectedKey ]
    );

    const handleToggleExpose = useCallback((key: string): void => {
        setTree((prev: TreeNodeState[]) =>
            updateNode(prev, key, (n: TreeNodeState) => ({
                ...n,
                exposeEncrypted: !n.exposed ? n.exposeEncrypted : false,
                exposed: !n.exposed
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
            updateNode(prev, key, (n: TreeNodeState) => {
                const parentPath: string = getParentPath(n.path);

                return {
                    ...n,
                    path: `${parentPath}${newTitle}`,
                    title: newTitle
                };
            })
        );
    }, []);

    const handleAddChild = useCallback((node: TreeNodeState): void => {
        if (node.path === "/user/claims/") {
            setClaimModal({ open: true, parentNode: node });
        } else {
            setModal({
                editingKey: null,
                initialDataType: "",
                initialKeyName: "",
                mode: "create",
                open: true,
                parentNode: node
            });
        }
    }, []);

    const handleEditPropertiesEntry = useCallback((node: TreeNodeState): void => {
        // The /properties/ container is always the direct parent for these entries.
        const parent: TreeNodeState | null = findNode(tree, "properties");

        // Fall back to a synthesised parent node carrying the path; only `path` is
        // read by the modal's `isPropertiesParent` check.
        const parentNode: TreeNodeState = parent ?? ({
            ...node,
            path: "/properties/"
        });

        setModal({
            editingKey: node.key,
            initialDataType: node.dataType ?? "",
            initialKeyName: node.title,
            mode: "edit",
            open: true,
            parentNode
        });
    }, [ tree ]);

    const handleModalSubmit = useCallback(({ keyName, objectStructure }: {
        keyName: string;
        objectStructure: string;
    }): void => {
        const { parentNode, mode, editingKey } = modal;

        if (!parentNode) return;

        if (mode === "edit" && editingKey) {
            setTree((prev: TreeNodeState[]) =>
                updateNode(prev, editingKey, (n: TreeNodeState) => {
                    const parentPath: string = getParentPath(n.path);

                    return {
                        ...n,
                        dataType: objectStructure || n.dataType,
                        path: `${parentPath}${keyName}`,
                        title: keyName
                    };
                })
            );
            setModal({
                editingKey: null,
                initialDataType: "",
                initialKeyName: "",
                mode: "create",
                open: false,
                parentNode: null
            });

            return;
        }

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

        setTree((prev: TreeNodeState[]) => addChild(prev, parentNode.key, newEntry));
        setModal({
            editingKey: null,
            initialDataType: "",
            initialKeyName: "",
            mode: "create",
            open: false,
            parentNode: null
        });
    }, [ modal ]);

    const handleModalClose = useCallback((): void => {
        setModal({
            editingKey: null,
            initialDataType: "",
            initialKeyName: "",
            mode: "create",
            open: false,
            parentNode: null
        });
    }, []);

    const handleClaimModalSubmit = useCallback((claims: Claim[]): void => {
        const { parentNode } = claimModal;

        if (!parentNode) return;

        setTree((prev: TreeNodeState[]) => {
            let updated: TreeNodeState[] = prev;

            claims.forEach((claim: Claim, idx: number) => {
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
    }, [ claimModal, allowReadOnlyClaimsModification ]);

    const handleClaimModalClose = useCallback((): void => {
        setClaimModal({ open: false, parentNode: null });
    }, []);

    const initialModalValues: { keyName: string; dataType: string } | undefined =
        modal.mode === "edit"
            ? {
                dataType: modal.initialDataType ?? "",
                keyName: modal.initialKeyName ?? ""
            }
            : undefined;

    return (
        <Box
            className="flow-context-tree"
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
                    { tree.map((node: TreeNodeState) => (
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
                        hasCertificate={ !!hasCertificate }
                        readOnly={ !!readOnly }
                        onToggleExposeEncrypt={ handleToggleExposeEncrypt }
                        onToggleModifyEncrypt={ handleToggleModifyEncrypt }
                        onRename={ handleRename }
                        onDelete={ handleDelete }
                        onEditPropertiesEntry={ handleEditPropertiesEntry }
                    />
                </Box>
            </Box>

            { /* ── Bottom row: monaco editor full width ── */ }
            <AccessConfigMonaco accessConfig={ builtConfig.accessConfig } />

            <AddEntryModal
                open={ modal.open }
                parentNode={ modal.parentNode }
                mode={ modal.mode }
                initialValues={ initialModalValues }
                onClose={ handleModalClose }
                onSubmit={ handleModalSubmit }
                data-componentid={ `${componentId}-add-entry-modal` }
            />

            <AddClaimModal
                open={ claimModal.open }
                parentNode={ claimModal.parentNode }
                existingClaimURIs={
                    claimModal.parentNode?.children?.map(
                        (c: TreeNodeState) => c.path.replace(/^\/user\/claims\//, "")
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
