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

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Tabs from "@mui/material/Tabs";
import Badge from "@oxygen-ui/react/Badge";
import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Menu from "@oxygen-ui/react/Menu";
import Tab from "@oxygen-ui/react/Tab";
import TabPanel from "@oxygen-ui/react/TabPanel";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import useVisualEditorNotifications from "../hooks/use-visual-editor-notifications";
import { NotificationSeverity, VisualEditorNotification } from "../models/visual-editor-notification";

/**
 * Props interface for VisualEditorNotificationPanel.
 */
export interface VisualEditorNotificationPanelPropsInterface extends IdentifiableComponentInterface {}

/**
 * Component to render the visual editor notification panel with tabbed notifications.
 *
 * @param props - Props injected to the component.
 * @returns The VisualEditorNotificationPanel component.
 */
const VisualEditorNotificationPanel: FunctionComponent<VisualEditorNotificationPanelPropsInterface> = (
    props: VisualEditorNotificationPanelPropsInterface
): ReactElement => {
    const { "data-componentid": componentId = "visual-editor-notification-panel" } = props;

    const { warnings, errors, dismissNotification } = useVisualEditorNotifications();

    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
    const [ activeTab, setActiveTab ] = useState<number>(0);

    const totalNotifications: number = warnings.length + errors.length;
    const open: boolean = Boolean(anchorEl);

    /**
     * Handle notification bell click.
     */
    const handleBellClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Handle menu close.
     */
    const handleClose = (): void => {
        setAnchorEl(null);
    };

    /**
     * Handle tab change.
     */
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
        setActiveTab(newValue);
    };

    /**
     * Render a notification item.
     */
    const renderNotificationItem = (notification: VisualEditorNotification): ReactElement => {
        const isWarning: boolean = notification.severity === NotificationSeverity.WARNING;

        return (
            <Box
                key={ notification.id }
                sx={ {
                    "&:hover": {
                        backgroundColor: isWarning ? "#FFF0D9" : "#FBE5E5"
                    },
                    alignItems: "flex-start",
                    backgroundColor: isWarning ? "#FFF4E5" : "#FDEDED",
                    display: "flex",
                    gap: 1.5,
                    marginBottom: 0.7,
                    padding: "12px 16px"
                } }
                data-componentid={ `${componentId}-notification-item-${notification.id}` }
            >
                <Box sx={ { flex: 1 } }>
                    <Typography variant="body2" fontWeight={ 500 } sx={ { mb: 0.5 } }>
                        { notification.title }
                        { notification.stepNumber && (
                            <Typography
                                variant="caption"
                                sx={ {
                                    backgroundColor: "rgba(0,0,0,0.08)",
                                    borderRadius: "4px",
                                    display: "inline-block",
                                    marginLeft: "8px",
                                    mt: 1,
                                    padding: "2px 8px"
                                } }
                            >
                            Step { notification.stepNumber }
                            </Typography>
                        ) }
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={ { display: "block" } }>
                        { notification.description }
                    </Typography>
                </Box>
                <IconButton
                    size="small"
                    onClick={ () => dismissNotification(notification.id) }
                    sx={ { padding: "4px" } }
                    data-componentid={ `${componentId}-dismiss-${notification.id}` }
                >
                    <Typography sx={ { fontSize: "1rem", lineHeight: 1 } }>&times;</Typography>
                </IconButton>
            </Box>
        );
    };

    /**
     * Render empty state.
     */
    const renderEmptyState = (type: "warnings" | "errors"): ReactElement => (
        <Box
            sx={ {
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "32px 16px"
            } }
        >
            { type === "warnings" ? (
                <ReportProblemOutlinedIcon sx={ { color: "text.disabled", fontSize: "2.5rem", mb: 1 } } />
            ) : (
                <ErrorOutlineIcon sx={ { color: "text.disabled", fontSize: "2.5rem", mb: 1 } } />
            ) }
            <Typography variant="body2" color="text.secondary">
                No { type } found
            </Typography>
        </Box>
    );

    return (
        <>
            <Badge
                badgeContent={ totalNotifications }
                color={ errors.length > 0 ? "error" : "warning" }
                data-componentid={ `${componentId}-badge` }
                sx={ { height: "30px", marginRight: "6px", width: "30px" } }
            >
                <IconButton
                    onClick={ handleBellClick }
                    sx={ {
                        backgroundColor: "var(--oxygen-palette-background-paper)",
                        border: "1px solid var(--oxygen-palette-divider)",
                        borderRadius: "var(--oxygen-shape-borderRadius)",
                        padding: "8px"
                    } }
                    data-componentid={ `${componentId}-bell-button` }
                >
                    <NotificationsIcon color={ totalNotifications > 0 ? "primary" : "inherit" } />
                </IconButton>
            </Badge>
            <Menu
                anchorEl={ anchorEl }
                open={ open }
                onClose={ handleClose }
                PaperProps={ {
                    sx: {
                        maxHeight: 400,
                        minWidth: 350,
                        width: 380
                    }
                } }
                data-componentid={ `${componentId}-menu` }
            >
                <Box sx={ { borderBottom: "1px solid var(--oxygen-palette-divider)" } }>
                    <Tabs
                        value={ activeTab }
                        onChange={ handleTabChange }
                        variant="fullWidth"
                        sx={ {
                            "& .MuiTab-root": {
                                minHeight: 42,
                                textTransform: "none"
                            },
                            minHeight: 42
                        } }
                    >
                        <Tab
                            label={ (
                                <Box display="flex" alignItems="center" gap={ 0.5 }>
                                    <ReportProblemOutlinedIcon sx={ { fontSize: "1rem" } } />
                                    <Typography variant="body2">
                                        Warnings ({ warnings.length })
                                    </Typography>
                                </Box>
                            ) }
                        />
                        <Tab
                            label={ (
                                <Box display="flex" alignItems="center" gap={ 0.5 }>
                                    <ErrorOutlineIcon sx={ { fontSize: "1rem" } } />
                                    <Typography variant="body2">
                                        Errors ({ errors.length })
                                    </Typography>
                                </Box>
                            ) }
                        />
                    </Tabs>
                </Box>
                <TabPanel value={ activeTab } index={ 0 } sx={ { padding: 0 } }>
                    <Box sx={ { maxHeight: 300, overflowY: "auto" } }>
                        { warnings.length > 0 ? (
                            warnings.map((notification: VisualEditorNotification) =>
                                renderNotificationItem(notification)
                            )
                        ) : (
                            renderEmptyState("warnings")
                        ) }
                    </Box>
                </TabPanel>
                <TabPanel value={ activeTab } index={ 1 } sx={ { padding: 0 } }>
                    <Box sx={ { maxHeight: 300, overflowY: "auto" } }>
                        { errors.length > 0 ? (
                            errors.map((notification: VisualEditorNotification) =>
                                renderNotificationItem(notification)
                            )
                        ) : (
                            renderEmptyState("errors")
                        ) }
                    </Box>
                </TabPanel>
            </Menu>
        </>
    );
};

export default VisualEditorNotificationPanel;
