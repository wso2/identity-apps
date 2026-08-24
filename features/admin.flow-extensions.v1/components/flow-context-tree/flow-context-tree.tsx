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

import { Theme, styled } from "@mui/material/styles";
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import IconButton from "@oxygen-ui/react/IconButton";
import Switch from "@oxygen-ui/react/Switch";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { Claim, ClaimsGetParams } from "@wso2is/core/models";
import { ContentLoader } from "@wso2is/react-components";
import classNames from "classnames";
import React, {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { FlowExtensionConstants } from "../../constants/flow-extension-constants";
import { ReactComponent as LockIcon } from "../../resources/assets/images/icons/lock.svg";
import AddClaimModal from "./add-claim-modal";
import FlowContextTreeNode from "./flow-context-tree-node";
import {
    AddEntryModalStateInterface,
    ContextPathOutputInterface,
    FlowContextTreePropsInterface,
    FlowExtensionAccessConfigInterface,
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

/**
 * Container of the encryption configuration card. The `disabled` class dims the
 * whole card while keeping its layout stable.
 */
const EncryptionCardRoot: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    "&.disabled": {
        opacity: 0.55
    },
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    gap: theme.spacing(1.5),
    minHeight: 64,
    padding: theme.spacing(1, 1.5)
}));

interface EncryptionCardProps {
    title: string;
    color: string;
    checked: boolean;
    disabled: boolean;
    disabledReason: string;
    enabledDescription: string;
    onToggle: () => void;
    "data-componentid"?: string;
}

/**
 * Encryption configuration card for the field-configuration panel.
 * Shows an explanatory line both when disabled (why it can't be enabled) and
 * when active (what enabling means) so the height stays stable across states.
 */
const EncryptionCard: FunctionComponent<EncryptionCardProps> = ({
    title,
    color,
    checked,
    disabled,
    disabledReason,
    enabledDescription,
    onToggle,
    "data-componentid": componentId = "encryption-card"
}: EncryptionCardProps): ReactElement => (
    <Tooltip title={ disabled ? disabledReason : "" } placement="top" arrow>
        <EncryptionCardRoot
            className={ classNames({ disabled }) }
            data-componentid={ componentId }
        >
            <Box
                component="span"
                sx={ { color: disabled ? "action.disabled" : color, display: "inline-flex", flexShrink: 0 } }
            >
                <LockIcon width={ 13 } height={ 13 } />
            </Box>
            <Box sx={ { flex: "1 1 auto", minWidth: 0 } }>
                <Typography variant="body2" sx={ { fontWeight: 600, lineHeight: 1.2 } }>
                    { title }
                </Typography>
                <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={ { display: "block", lineHeight: 1.3, mt: 0.3 } }
                >
                    { disabled ? disabledReason : enabledDescription }
                </Typography>
            </Box>
            <Switch
                checked={ checked }
                disabled={ disabled }
                onChange={ disabled ? undefined : onToggle }
            />
        </EncryptionCardRoot>
    </Tooltip>
);

interface FieldConfigPanelProps {
    selectedNode: TreeNodeStateInterface | null;
    readOnly: boolean;
    hasCertificate: boolean;
    onToggleExposeEncrypt: (key: string) => void;
    onToggleModifyEncrypt: (key: string) => void;
    onDelete: (key: string) => void;
    "data-componentid"?: string;
}

/**
 * Right-side panel that surfaces details of the currently-selected leaf and lets the
 * user delete it.
 */
const FieldConfigPanel: FunctionComponent<FieldConfigPanelProps> = ({
    selectedNode,
    readOnly,
    hasCertificate,
    onToggleExposeEncrypt,
    onToggleModifyEncrypt,
    onDelete,
    "data-componentid": componentId = "field-config-panel"
}: FieldConfigPanelProps): ReactElement => {

    const { t } = useTranslation();

    const isLeaf: boolean = selectedNode?.nodeType === NodeType.LEAF;

    const displayDataType: string = selectedNode?.dataType ?? "";

    const canDeleteNode: boolean = !readOnly && !!selectedNode?.canDelete;

    const canExposeOp: boolean = !!selectedNode?.allowedOperations.includes("EXPOSE") && isLeaf;
    const canModifyOp: boolean = !!selectedNode?.allowedOperations.includes("MODIFY")
        && isLeaf
        && !selectedNode?.readOnly;

    const claimURI: string = selectedNode?.isClaim
        ? selectedNode?.path?.replace(/^\/user\/claims\//, "")
        : "";

    const isUsernameClaim: boolean = claimURI === ClaimManagementConstants.USER_NAME_CLAIM_URI;
    const showUsernameWriteWarning: boolean = isUsernameClaim && !!selectedNode?.modify;

    const isIdentityClaim: boolean = claimURI.startsWith(ClaimManagementConstants.IDENTITY_CLAIM_URI_PREFIX);
    const showIdentityClaimWriteWarning: boolean = isIdentityClaim && !!selectedNode?.modify;

    const getExposeEncryptionDisabledReason: () => string = (): string => {
        if (!canExposeOp) {
            return t("flowExtension:contextTree.fieldConfig.encryption.read.notAllowed");
        }

        if (!selectedNode?.exposed) {
            return t("flowExtension:contextTree.fieldConfig.encryption.read.markFirst");
        }

        if (!hasCertificate) {
            return t("flowExtension:contextTree.fieldConfig.encryption.read.needCertificate");
        }

        return t("flowExtension:contextTree.fieldConfig.encryption.formReadOnly");
    };

    const getModifyEncryptionDisabledReason: () => string = (): string => {
        if (!canModifyOp) {
            return t("flowExtension:contextTree.fieldConfig.encryption.write.notAllowed");
        }

        if (!selectedNode?.modify) {
            return t("flowExtension:contextTree.fieldConfig.encryption.write.markFirst");
        }

        return t("flowExtension:contextTree.fieldConfig.encryption.formReadOnly");
    };

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

                    { showUsernameWriteWarning && (
                        <Alert
                            severity="info"
                            sx={ { mt: 2 } }
                            data-componentid={ `${componentId}-username-write-warning` }
                        >
                            { t("flowExtension:contextTree.fieldConfig.usernameWriteWarning") }
                        </Alert>
                    ) }

                    { showIdentityClaimWriteWarning && (
                        <Alert
                            severity="warning"
                            sx={ { mt: 2 } }
                            data-componentid={ `${componentId}-identity-claim-write-warning` }
                        >
                            { t("flowExtension:contextTree.fieldConfig.identityClaimWriteWarning") }
                        </Alert>
                    ) }

                    { /* ── Encryption section ── */ }
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={ { display: "block", fontWeight: 600, mt: 2.5 } }
                    >
                        { t("flowExtension:contextTree.fieldConfig.encryption.title") }
                    </Typography>
                    <Box sx={ { display: "flex", flexDirection: "column", gap: 1.5, mt: 1 } }>
                        <EncryptionCard
                            title={ t("flowExtension:contextTree.fieldConfig.encryption.read.title") }
                            color="var(--tree-expose)"
                            checked={ !!selectedNode.exposeEncrypted }
                            disabled={ !canExposeOp || readOnly || !selectedNode.exposed || !hasCertificate }
                            disabledReason={ getExposeEncryptionDisabledReason() }
                            enabledDescription={
                                t("flowExtension:contextTree.fieldConfig.encryption.read.enabledDescription")
                            }
                            onToggle={ () => onToggleExposeEncrypt(selectedNode.key) }
                            data-componentid={ `${componentId}-expose-encryption` }
                        />
                        <EncryptionCard
                            title={ t("flowExtension:contextTree.fieldConfig.encryption.write.title") }
                            color="var(--tree-modify)"
                            checked={ !!selectedNode.modifyEncrypted }
                            disabled={ !canModifyOp || readOnly || !selectedNode.modify }
                            disabledReason={ getModifyEncryptionDisabledReason() }
                            enabledDescription={
                                t("flowExtension:contextTree.fieldConfig.encryption.write.enabledDescription")
                            }
                            onToggle={ () => onToggleModifyEncrypt(selectedNode.key) }
                            data-componentid={ `${componentId}-modify-encryption` }
                        />
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
    hasCertificate,
    allowReadOnlyClaimsModification = true,
    "data-componentid": componentId = "flow-context-tree"
}: FlowContextTreePropsInterface): ReactElement => {

    const [ allClaims, setAllClaims ] = useState<Claim[]>([]);
    const [ isClaimsLoading, setIsClaimsLoading ] = useState<boolean>(true);

    const claimDisplayNames: Map<string, string> = useMemo(() => {
        const map: Map<string, string> = new Map();

        allClaims.forEach((c: Claim) => {
            if (c.claimURI && c.displayName) {
                map.set(c.claimURI, c.displayName);
            }
        });

        return map;
    }, [ allClaims ]);

    const [ tree, setTree ] = useState<TreeNodeStateInterface[]>(() =>
        initialAccessConfig
            ? mapMetadataToStateWithAccessConfig(contextTree, initialAccessConfig, undefined, {
                allowReadOnlyClaimsModification
            })
            : mapMetadataToState(contextTree)
    );

    const [ selectedKey, setSelectedKey ] = useState<string | null>(null);

    const [ claimModal, setClaimModal ] = useState<AddEntryModalStateInterface>({
        open: false,
        parentNode: null
    });

    const builtConfig: FlowExtensionAccessConfigInterface = useMemo(
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
            })
            .finally(() => {
                setIsClaimsLoading(false);
            });
    }, []);

    // Re-initialise tree when input changes / once claims load.
    useEffect(() => {
        setTree(
            initialAccessConfig
                ? mapMetadataToStateWithAccessConfig(contextTree, initialAccessConfig, claimDisplayNames, {
                    allowReadOnlyClaimsModification
                })
                : mapMetadataToState(contextTree)
        );
    }, [ contextTree, initialAccessConfig, claimDisplayNames, allowReadOnlyClaimsModification ]);

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
            updateNode(prev, key, (node: TreeNodeStateInterface) => ({
                ...node,
                // Clear the encryption mark when un-exposing — an unexposed field cannot be encrypted.
                exposeEncrypted: node.exposed ? false : node.exposeEncrypted,
                exposed: !node.exposed
            }))
        );
    }, []);

    const handleToggleModify = useCallback((key: string): void => {
        setTree((prev: TreeNodeStateInterface[]) =>
            updateNode(prev, key, (node: TreeNodeStateInterface) => ({
                ...node,
                modify: !node.modify,
                // Clear the encryption mark when un-marking modify.
                modifyEncrypted: node.modify ? false : node.modifyEncrypted
            }))
        );
    }, []);

    const handleToggleExposeEncrypt = useCallback((key: string): void => {
        setTree((prev: TreeNodeStateInterface[]) =>
            updateNode(prev, key, (node: TreeNodeStateInterface) => ({
                ...node,
                exposeEncrypted: !node.exposeEncrypted
            }))
        );
    }, []);

    const handleToggleModifyEncrypt = useCallback((key: string): void => {
        setTree((prev: TreeNodeStateInterface[]) =>
            updateNode(prev, key, (node: TreeNodeStateInterface) => ({
                ...node,
                modifyEncrypted: !node.modifyEncrypted
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
                const isReadOnlyClaim: boolean = FlowExtensionConstants.isReadOnlyClaim(claim.claimURI);
                const allowedOps: string[] = isReadOnlyClaim
                    ? [ "EXPOSE" ]
                    : [ "EXPOSE", "MODIFY" ];

                const newEntry: TreeNodeStateInterface = {
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
                    // Join with a single slash regardless of whether the container path carries a
                    // trailing one, so the internal form is always `/user/claims/<uri>` — the shape
                    // the access-config serialiser expects to bracket-encode.
                    path: `${parentNode.path.replace(/\/+$/, "")}/${claim.claimURI}`,
                    readOnly: isReadOnlyClaim,
                    replaceable: false,
                    title: claim.displayName
                };

                updated = addChild(updated, parentNode.key, newEntry);
            });

            return updated;
        });
        setClaimModal({ open: false, parentNode: null });
    }, [ claimModal ]);

    const handleClaimModalClose = useCallback((): void => {
        setClaimModal({ open: false, parentNode: null });
    }, []);

    const hasConfiguredClaims: boolean = useMemo(
        () => [ ...initialAccessConfig?.expose ?? [], ...initialAccessConfig?.modify ?? [] ]
            .some((entry: ContextPathOutputInterface) => entry.path?.startsWith("/user/claims[")),
        [ initialAccessConfig ]
    );

    if (isClaimsLoading && hasConfiguredClaims) {
        return <ContentLoader data-componentid={ `${componentId}-loader` } />;
    }

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
                        hasCertificate={ !!hasCertificate }
                        onToggleExposeEncrypt={ handleToggleExposeEncrypt }
                        onToggleModifyEncrypt={ handleToggleModifyEncrypt }
                        onDelete={ handleDelete }
                        data-componentid={ `${componentId}-field-config-panel` }
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
                onClose={ handleClaimModalClose }
                onSubmit={ handleClaimModalSubmit }
                data-componentid={ `${componentId}-add-claim-modal` }
            />
        </Box>
    );
};

export default FlowContextTree;
