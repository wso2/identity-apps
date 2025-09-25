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

import { usePastelColorGenerator } from "@oxygen-ui/react";
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
import Stack from "@oxygen-ui/react/Stack";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { EllipsisVerticalIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import moment from "moment";
import React, { FunctionComponent, HTMLAttributes, useMemo, useState } from "react";
import { FlowsHistoryInterface } from "../../models/flows";

/**
 * Props interface of {@link VersionHistoryItem}
 */
export interface VersionHistoryItemPropsInterface
    extends IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {
    historyItem: FlowsHistoryInterface;
    isCurrentVersion: boolean;
}

/**
 * Component to render the versioning history panel.
 *
 * @param props - Props injected to the component.
 * @returns The VersionHistoryPanel component.
 */
/**
 * Component to render author info with colored dot.
 */
const AuthorInfo: FunctionComponent<{ userName: string }> = ({ userName }) => {
    const colorRandomizer: string = useMemo(() => {
        return userName || "";
    }, [ userName ]);

    const { color } = usePastelColorGenerator(colorRandomizer);

    return (
        <Box sx={ { display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" } }>
            <Box
                sx={ {
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    flexShrink: 0
                } }
            />
            <Typography
                variant="caption"
                color="text.secondary"
                sx={ {
                    fontSize: "11px"
                } }
            >
                { userName }
            </Typography>
        </Box>
    );
};

/**
 * Component to render individual history item card with menu.
 */
const VersionHistoryItem: FunctionComponent<VersionHistoryItemPropsInterface> = ({
    "data-componentid": componentId = "version-history-panel",
    historyItem,
    isCurrentVersion,
    ...rest
}: VersionHistoryItemPropsInterface) => {
    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
    const [ showRestoreDialog, setShowRestoreDialog ] = useState<boolean>(false);
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

    const handleRestoreConfirm = (): void => {
        // TODO: Implement restore functionality
        console.log("Restore version:", historyItem.timestamp);
        setShowRestoreDialog(false);
    };

    const handleRestoreCancel = (): void => {
        setShowRestoreDialog(false);
    };

    return (
        <>
            <Card
                variant="outlined"
                sx={ {
                    cursor: "pointer",
                    backgroundColor: isCurrentVersion ? "action.selected" : "background.paper",
                    "&:hover": {
                        backgroundColor: "action.hover"
                    },
                    padding: 0,
                    position: "relative"
                } }
                data-componentid={ componentId }
                { ...rest }
            >
            <CardContent
                sx={ {
                    padding: 2,
                    "&:last-child": {
                        paddingBottom: 2
                    }
                } }
            >
                <Box sx={ { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }>
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
                                    fontSize: "11px",
                                    display: "block",
                                    marginBottom: "4px"
                                } }
                            >
                                Current version
                            </Typography>
                        ) }
                        <AuthorInfo userName={ historyItem.author?.userName || "Unknown" } />
                    </Box>
                    { !isCurrentVersion && (
                        <Box>
                            <Tooltip title="More actions">
                                <IconButton
                                    aria-label="more"
                                    id={ `more-${historyItem.timestamp}` }
                                    aria-controls={ open ? `more-menu-${historyItem.timestamp}` : undefined }
                                    aria-expanded={ open ? "true" : undefined }
                                    aria-haspopup="true"
                                    onClick={ handleClick }
                                    size="small"
                                    sx={ {
                                        padding: "4px",
                                        opacity: 0.7,
                                        "&:hover": {
                                            opacity: 1
                                        }
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
                                <MenuItem className="version-history-dropdown-item" onClick={ handleRestoreClick }>
                                    <ListItemText>Restore this version</ListItemText>
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) }
                </Box>
            </CardContent>
        </Card>
        
        {/* Restore Confirmation Dialog */}
        <Dialog
            open={ showRestoreDialog }
            onClose={ handleRestoreCancel }
            aria-labelledby="restore-dialog-title"
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="restore-dialog-title">
                <Typography variant="h6">Restore this version?</Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary">
                    Your current document will revert to the version from { " " }
                    { moment(Number(historyItem.timestamp)).format("MMMM DD [at] h:mm A") }.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" spacing={ 2 }>
                    <Button
                        variant="text"
                        color="primary"
                        onClick={ handleRestoreCancel }
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={ handleRestoreConfirm }
                        autoFocus
                    >
                        Restore
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default VersionHistoryItem;
