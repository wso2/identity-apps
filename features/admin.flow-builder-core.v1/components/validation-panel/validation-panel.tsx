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

import Tabs from "@mui/material/Tabs";
import Box from "@oxygen-ui/react/Box";
import Drawer from "@oxygen-ui/react/Drawer";
import IconButton from "@oxygen-ui/react/IconButton";
import Tab from "@oxygen-ui/react/Tab";
import TabPanel from "@oxygen-ui/react/TabPanel";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import ValidationNotificationsList from "./validation-notifications-list";
import useValidationStatus from "../../hooks/use-validation-status";
import Notification, { NotificationType } from "../../models/notification";
import "./validation-panel.scss";

/**
 * Props interface of {@link ValidationPanel}
 */
export interface ValidationPanelPropsInterface extends IdentifiableComponentInterface {}

const ChevronsRight = ({ size = 16 }: { size: number }): ReactElement => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ size }
        height={ size }
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-chevrons-right-icon lucide-chevrons-right"
    >
        <path d="m6 17 5-5-5-5"/>
        <path d="m13 17 5-5-5-5"/>
    </svg>
);

const ErrorIcon = ({ size = 16 }: { size?: number }): ReactElement => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ size }
        height={ size }
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c01616"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-circle-x-icon lucide-circle-x"
    >
        <circle cx="12" cy="12" r="10"/>
        <path d="m15 9-6 6"/>
        <path d="m9 9 6 6"/>
    </svg>
);

const WarningIcon = ({ size = 16 }: { size?: number }): ReactElement => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ size }
        height={ size }
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ff8e24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-triangle-alert-icon lucide-triangle-alert"
    >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
        <path d="M12 9v4"/>
        <path d="M12 17h.01"/>
    </svg>
);

const InfoIcon = ({ size = 16 }: { size?: number }): ReactElement => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ size }
        height={ size }
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2ea4ff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-info-icon lucide-info"
    >
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
    </svg>
);

/**
 * Get the icon for a notification type.
 *
 * @param type - Notification type.
 * @returns Icon component for the notification type.
 */
const getNotificationIcon = (type: NotificationType): ReactElement => {
    switch (type) {
        case NotificationType.ERROR:
            return <ErrorIcon size={ 20 } />;
        case NotificationType.INFO:
            return <InfoIcon size={ 20 } />;
        case NotificationType.WARNING:
            return <WarningIcon size={ 20 } />;
        default:
            return null;
    }
};

/**
 * Component to render the notification panel with tabbed notifications.
 *
 * @param props - Props injected to the component.
 * @returns The ValidationPanel component.
 */
const ValidationPanel: FunctionComponent<ValidationPanelPropsInterface> = ({
    "data-componentid": componentId = "validation-panel"
}: ValidationPanelPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const {
        notifications,
        openValidationPanel: open,
        setOpenValidationPanel,
        setSelectedNotification
    } = useValidationStatus();
    const [ activeTab, setActiveTab ] = useState<number>(0);

    const errorNotifications: Notification[] = notifications.filter(
        (notification: Notification) => notification.getType() === NotificationType.ERROR
    );
    const infoNotifications: Notification[] = notifications.filter(
        (notification: Notification) => notification.getType() === NotificationType.INFO
    );
    const warningNotifications: Notification[] = notifications.filter(
        (notification: Notification) => notification.getType() === NotificationType.WARNING
    );

    /**
     * Handle tab change event.
     *
     * @param event - Tab change event.
     * @param newValue - New tab value.
     */
    const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
        setActiveTab(newValue);
    };

    /**
     * Handle close event.
     */
    const handleClose = (): void => {
        setOpenValidationPanel(false);
    };

    /**
     * Handle notification click event.
     *
     * @param notification - The notification that was clicked.
     */
    const handleNotificationClick = (notification: Notification): void => {
        setSelectedNotification(notification);
    };

    return (
        <Drawer
            open={ open }
            anchor="right"
            onClose={ () => {} }
            elevation={ 5 }
            PaperProps={ {
                className: classNames("flow-builder-validation-panel", { open })
            } }
            hideBackdrop={ true }
            className={ classNames("flow-builder-validation-panel", { open }) }
            variant="permanent"
            data-componentid={ componentId }
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                className="flow-builder-validation-panel-header"
            >
                <Typography variant="h6">
                    { t("flows:core.notificationPanel.header") }
                </Typography>
                <IconButton onClick={ handleClose }>
                    <ChevronsRight size={ 20 } />
                </IconButton>
            </Box>
            <Box className="flow-builder-validation-panel-content">
                <Tabs
                    value={ activeTab }
                    onChange={ handleTabChange }
                    className="validation-tabs"
                    variant="fullWidth"
                >
                    <Tab
                        label={
                            (
                                <Box display="flex" alignItems="center" gap={ 1 }>
                                    { getNotificationIcon(NotificationType.ERROR) }
                                    <Typography variant="body2">
                                        { t("flows:core.notificationPanel.tabs.errors") }
                                    </Typography>
                                </Box>
                            )
                        }
                    />
                    <Tab
                        label={
                            (
                                <Box display="flex" alignItems="center" gap={ 1 }>
                                    { getNotificationIcon(NotificationType.WARNING) }
                                    <Typography variant="body2">
                                        { t("flows:core.notificationPanel.tabs.warnings") }
                                    </Typography>
                                </Box>
                            )
                        }
                    />
                    <Tab
                        label={
                            (
                                <Box display="flex" alignItems="center" gap={ 1 }>
                                    { getNotificationIcon(NotificationType.INFO) }
                                    <Typography variant="body2">
                                        { t("flows:core.notificationPanel.tabs.info") }
                                    </Typography>
                                </Box>
                            )
                        }
                    />
                </Tabs>
                <TabPanel value={ activeTab } index={ 0 } className="validation-tab-panel">
                    <ValidationNotificationsList
                        notifications={ errorNotifications }
                        emptyMessage={ t("flows:core.notificationPanel.emptyMessages.errors") }
                        onNotificationClick={ handleNotificationClick }
                    />
                </TabPanel>
                <TabPanel value={ activeTab } index={ 1 } className="validation-tab-panel">
                    <ValidationNotificationsList
                        notifications={ warningNotifications }
                        emptyMessage={ t("flows:core.notificationPanel.emptyMessages.warnings") }
                        onNotificationClick={ handleNotificationClick }
                    />
                </TabPanel>
                <TabPanel value={ activeTab } index={ 2 } className="validation-tab-panel">
                    <ValidationNotificationsList
                        notifications={ infoNotifications }
                        emptyMessage={ t("flows:core.notificationPanel.emptyMessages.info") }
                        onNotificationClick={ handleNotificationClick }
                    />
                </TabPanel>
            </Box>
        </Drawer>
    );
};

export default ValidationPanel;
