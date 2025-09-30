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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Avatar from "@oxygen-ui/react/Avatar";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import IconButton from "@oxygen-ui/react/IconButton";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Menu from "@oxygen-ui/react/Menu/Menu";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Paper from "@oxygen-ui/react/Paper";
import Stack from "@oxygen-ui/react/Stack";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { EllipsisVerticalIcon, EyeIcon } from "@oxygen-ui/react-icons";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Edge, Node } from "@xyflow/react";
import moment from "moment";
import React, { FunctionComponent, HTMLAttributes, ReactNode, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import FlowPreview from "./flow-preview";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import { FlowsHistoryInterface } from "../../models/flows";

/**
 * Props interface of {@link VersionHistoryItem}
 */
export interface VersionHistoryItemPropsInterface
    extends IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {
    /**
     * The history item to be displayed.
     */
    historyItem: FlowsHistoryInterface;
    /**
     * If the version is current or not.
     */
    isCurrentVersion: boolean;
    /**
     * Whether to show the author who did the change or not.
     */
    showAuthorInfo?: boolean;
}

interface MenuActionInterface {
    /**
     * Unique identifier of the Action.
     */
    id: string;
    /**
     * Action Label.
     */
    label: ReactNode;
    /**
     * Action callback.
     */
    onClick: () => void;
}

/**
 * Component to render individual history item card with menu.
 *
 * @param props - Props injected to the component.
 * @returns The VersionHistoryItem component.
 */
const VersionHistoryItem: FunctionComponent<VersionHistoryItemPropsInterface> = ({
    "data-componentid": componentId = "version-history-item",
    historyItem,
    isCurrentVersion,
    showAuthorInfo = false,
    ...rest
}: VersionHistoryItemPropsInterface) => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const {
        restoreFromHistory,
        setIsVersionHistoryPanelOpen,
        triggerLocalHistoryAutoSave,
        flowNodeTypes,
        flowEdgeTypes
    } = useAuthenticationFlowBuilderCore();
    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
    const [ showRestoreDialog, setShowRestoreDialog ] = useState<boolean>(false);
    const [ isRestoring, setIsRestoring ] = useState<boolean>(false);
    const open: boolean = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const handleRestoreClick = (): void => {
        handleClose();
        setShowRestoreDialog(true);
    };

    const handleRestoreConfirm = async (): Promise<void> => {
        if (!restoreFromHistory) {
            return;
        }

        setIsRestoring(true);

        try {
            const success: boolean = await restoreFromHistory(historyItem);

            if (success) {
                setShowRestoreDialog(false);

                // Trigger auto-save after successful restore to create a new history entry
                if (triggerLocalHistoryAutoSave) {
                    // Wait a bit for the flow to be fully updated before saving
                    setTimeout(() => {
                        triggerLocalHistoryAutoSave();
                    }, 500);
                }

                // Close the version history panel after successful restore
                if (setIsVersionHistoryPanelOpen) {
                    setTimeout(() => {
                        setIsVersionHistoryPanelOpen(false);
                    }, 1000);
                }
            }
        } catch (error) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("flows:core.notifications.restoreFromHistory.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flows:core.notifications.restoreFromHistory.genericError.message")
                })
            );
        } finally {
            setIsRestoring(false);
        }
    };

    const handleRestoreCancel = (): void => {
        setShowRestoreDialog(false);
    };

    const previewNodes: Node[] = useMemo(() => {
        if (!historyItem.flowData || !historyItem.flowData.nodes) {
            return [];
        }

        return historyItem.flowData.nodes as Node[];
    }, [ historyItem.flowData ]);

    const previewEdges: Edge[] = useMemo(() => {
        if (!historyItem.flowData || !historyItem.flowData.edges) {
            return [];
        }

        return historyItem.flowData.edges as Edge[];
    }, [ historyItem.flowData ]);

    const menuActions: MenuActionInterface[] = [
        {
            id: "restore",
            label: t("flows:core.versionHistory.restoreVersion"),
            onClick: handleRestoreClick
        }
    ];

    return (
        <>
            <Card
                variant="outlined"
                sx={ {
                    "&:hover": {
                        backgroundColor: "action.hover"
                    },
                    backgroundColor: isCurrentVersion ? "action.selected" : "background.paper",
                    cursor: "pointer",
                    padding: 0,
                    position: "relative"
                } }
                data-componentid={ componentId }
                { ...rest }
            >
                <CardContent
                    sx={ {
                        "&:last-child": {
                            paddingBottom: 2
                        },
                        padding: 2
                    } }
                >
                    <Box sx={ { alignItems: "center", display: "flex", justifyContent: "space-between" } }>
                        <Box sx={ { flex: 1 } }>
                            <Typography
                                variant="body2"
                                sx={ {
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    marginBottom: "4px"
                                } }
                            >
                                { moment(Number(historyItem.timestamp)).format("MMMM DD, h:mm A") }
                            </Typography>
                            { isCurrentVersion && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={ {
                                        display: "block",
                                        fontSize: "11px",
                                        marginBottom: "4px"
                                    } }
                                >
                                    { t("flows:core.versionHistory.currentVersion") }
                                </Typography>
                            ) }
                            { showAuthorInfo && (
                                <Box sx={ { alignItems: "center", display: "flex", gap: "5px", marginTop: "4px" } }>
                                    <Avatar
                                        randomBackgroundColor
                                        backgroundColorRandomizer={ historyItem.author?.userName || t("flows:core.versionHistory.unknownAuthor") }
                                        sx={ {
                                            fontSize: "0.5em",
                                            height: "12px",
                                            width: "12px"
                                        } }
                                    >
                                        { (historyItem.author?.userName).charAt(0).toUpperCase() }
                                    </Avatar>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={ {
                                            fontSize: "11px"
                                        } }
                                    >
                                        { historyItem.author?.userName || t("flows:core.versionHistory.unknownAuthor") }
                                    </Typography>
                                </Box>
                            ) }
                        </Box>
                        { !isCurrentVersion && (
                            <Box>
                                { menuActions.length === 1 ? (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="secondary"
                                        onClick={ menuActions[0].onClick }
                                        sx={ { fontSize: "0.8rem", padding: "4px 8px !important" } }
                                    >
                                        { t("flows:core.versionHistory.restoreAction") }
                                    </Button>
                                ) : (
                                    <>
                                        <Tooltip title={ t("flows:core.versionHistory.moreActions") }>
                                            <IconButton
                                                aria-label="more"
                                                id={ `more-${historyItem.timestamp}` }
                                                aria-controls={ open ? `more-menu-${
                                                    historyItem.timestamp
                                                }` : undefined }
                                                aria-expanded={ open ? "true" : undefined }
                                                aria-haspopup="true"
                                                onClick={ handleClick }
                                                size="small"
                                                sx={ {
                                                    "&:hover": {
                                                        opacity: 1
                                                    },
                                                    opacity: 0.7,
                                                    padding: "4px"
                                                } }
                                            >
                                                <EllipsisVerticalIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            id={ `more-menu-${historyItem.timestamp}` }
                                            MenuListProps={ {
                                                "aria-labelledby": `more-${historyItem.timestamp}`
                                            } }
                                            anchorEl={ anchorEl }
                                            open={ open }
                                            onClose={ handleClose }
                                            className="version-history-dropdown"
                                        >
                                            { menuActions.map((action: MenuActionInterface) => (
                                                <MenuItem
                                                    key={ action.id }
                                                    className="version-history-dropdown-item"
                                                    onClick={ action.onClick }
                                                >
                                                    <ListItemText>{ action.label }</ListItemText>
                                                </MenuItem>
                                            )) }
                                        </Menu>
                                    </>
                                ) }
                            </Box>
                        ) }
                    </Box>
                </CardContent>
            </Card>

            { /* Restore Confirmation Dialog with Preview */ }
            <Dialog
                fullWidth
                maxWidth="md"
                open={ showRestoreDialog }
                onClose={ handleRestoreCancel }
                aria-labelledby="restore-dialog-title"
            >
                <DialogTitle id="restore-dialog-title" sx={ { paddingX: 3, paddingY: 2 } }>
                    <Typography variant="h5">{ t("flows:core.versionHistory.restoreDialog.title") }</Typography>
                </DialogTitle>
                <DialogContent sx={ { display: "flex", flexDirection: "column", gap: 2, padding: 4 } } dividers>
                    <Alert severity="warning">
                        <AlertTitle>{ t("flows:core.versionHistory.restoreDialog.warningAlert.title") }</AlertTitle>
                        <Typography>
                            <Trans
                                i18nKey="flows:core.versionHistory.restoreDialog.warningAlert.description"
                                tOptions={ {
                                    timestamp: moment(Number(historyItem.timestamp)).format("MMMM DD [at] h:mm A")
                                } }
                            >
                                { /* eslint-disable max-len */ }
                                If you proceed, the current flow will be replaced with version from
                                <strong>{ moment(Number(historyItem.timestamp)).format("MMMM DD [at] h:mm A") }</strong>.
                                Please take a moment to review the flow preview below before confirming since this action cannot be undone.
                                { /* eslint-enable max-len */ }
                            </Trans>
                        </Typography>
                    </Alert>

                    <Stack direction="column" alignItems="left" spacing={ 1 }>
                        <Box sx={ { alignItems: "center", display: "flex", gap: 1 } }>
                            <EyeIcon size="small" />
                            <Typography variant="h5" color="text.primary" fontWeight="medium">
                                { t("flows:core.versionHistory.restoreDialog.previewContainer.title") }
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            { t("flows:core.versionHistory.restoreDialog.previewContainer.description") }
                        </Typography>
                    </Stack>

                    <Paper
                        variant="outlined"
                        sx={ {
                            border: "2px solid var(--oxygen-palette-divider)",
                            height: "450px",
                            overflow: "hidden",
                            position: "relative",
                            transition: "all 0.2s ease-in-out",
                            width: "100%"
                        } }
                    >
                        <FlowPreview
                            initialNodes={ previewNodes }
                            initialEdges={ previewEdges }
                            nodeTypes={ flowNodeTypes }
                            edgeTypes={ flowEdgeTypes }
                            data-componentid="history-preview-flow"
                        />
                    </Paper>
                </DialogContent>
                <DialogActions sx={ { paddingX: 3, paddingY: 2 } }>
                    <Stack direction="row" spacing={ 2 }>
                        <Button variant="text" color="primary" onClick={ handleRestoreCancel }>
                            { t("flows:core.versionHistory.restoreDialog.cancel") }
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={ handleRestoreConfirm }
                            disabled={ isRestoring }
                            autoFocus
                        >
                            { isRestoring
                                ? t("flows:core.versionHistory.restoreDialog.restoring")
                                : t("flows:core.versionHistory.restoreDialog.restore") }
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VersionHistoryItem;
