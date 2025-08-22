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
import Drawer from "@oxygen-ui/react/Drawer";
import IconButton from "@oxygen-ui/react/IconButton";
import Tab from "@oxygen-ui/react/Tab";
import TabPanel from "@oxygen-ui/react/TabPanel";
import Tabs from "@oxygen-ui/react/Tabs";
import Typography from "@oxygen-ui/react/Typography";
import { CircleInfoIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useState } from "react";
import ValidationNotificationsList from "./validation-notifications-list";
import useValidationStatus from "../../hooks/use-validation-status";
import Notification, { NotificationType } from "../../models/notification";
import "./validation-panel.scss";

/**
 * Props interface of {@link ValidationPanel}
 */
export interface ValidationPanelPropsInterface extends IdentifiableComponentInterface {
    // No additional props needed - everything comes from context
}

// TODO: Move this to Oxygen UI.
const ChevronsLeft = ({ width = 16, height = 16 }: { width: number; height: number }): ReactElement => (
    <svg width={ width } height={ height } viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            // eslint-disable-next-line max-len
            d="M8.11896 8.3622L8.19499 8.45153L13.5283 13.5529C13.6459 13.6659 13.8035 13.7327 13.97 13.74C14.1364 13.7474 14.2998 13.6949 14.4278 13.5928C14.5558 13.4907 14.6391 13.3464 14.6614 13.1884C14.6838 13.0304 14.6434 12.8702 14.5483 12.7393L14.4723 12.65L9.60967 8.00005L14.4723 3.35C14.5825 3.2444 14.6505 3.1051 14.6644 2.9564C14.6783 2.8077 14.6372 2.659 14.5483 2.5363L14.4723 2.4471C14.3618 2.3416 14.2162 2.2766 14.0607 2.2634C13.9053 2.2501 13.7499 2.2894 13.6216 2.3744L13.5283 2.4471L8.19499 7.54857C8.08473 7.65424 8.01677 7.79351 8.00285 7.94224C7.98901 8.0909 8.03005 8.23956 8.11896 8.3622ZM1.45229 8.3622L1.52832 8.45153L6.86164 13.5529C6.9792 13.6659 7.13677 13.7327 7.3033 13.74C7.46977 13.7474 7.63311 13.6949 7.76111 13.5928C7.88911 13.4907 7.97245 13.3464 7.99472 13.1884C8.01704 13.0304 7.9767 12.8702 7.88167 12.7393L7.80564 12.65L2.943 8.00005L7.80564 3.35C7.9159 3.2444 7.98386 3.1051 7.99777 2.9564C8.01162 2.8077 7.97057 2.659 7.88167 2.5363L7.80564 2.4471C7.69517 2.3416 7.5495 2.2766 7.39409 2.2634C7.23861 2.2501 7.08327 2.2894 6.95498 2.3744L6.86164 2.4471L1.52832 7.54857C1.41806 7.65424 1.3501 7.79351 1.33619 7.94224C1.32227 8.0909 1.36332 8.23956 1.45229 8.3622Z"
            fill="black"
        />
    </svg>
);

// Custom Error Icon (Circle with X)
const ErrorIcon = ({ size = 16 }: { size?: number }): ReactElement => (
    <svg width={ size } height={ size } viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="8" fill="#d32f2f"/>
        <path
            d="M10.5 5.5L5.5 10.5M5.5 5.5L10.5 10.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const WarningIcon = ({ size = 16 }: { size?: number }): ReactElement => (
    <svg width={ size } height={ size } viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="warningGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff9800" />
                <stop offset="100%" stopColor="#ed6c02" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.1"/>
            </filter>
        </defs>
        <path
            d="M8 1.5a1 1 0 0 1 .866.5l6.5 11.5A1 1 0 0 1 14.5 15h-13a1 1 0 0 1-.866-1.5L7.134 2a1 1 0 0 1 .866-.5z"
            fill="url(#warningGradient)"
            filter="url(#shadow)"
        />
        <path
            d="M8 2.5L13.8 13H2.2L8 2.5z"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
        />
        <rect
            x="7.5"
            y="5.5"
            width="1"
            height="4"
            rx="0.5"
            fill="white"
        />
        <circle
            cx="8"
            cy="11"
            r="0.75"
            fill="white"
        />
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
            return <ErrorIcon size={ 16 } />;
        case NotificationType.INFO:
            return <CircleInfoIcon size={ 16 } />;
        case NotificationType.WARNING:
            return <WarningIcon size={ 16 } />;
        default:
            return null;
    }
};

/**
 * Component to render the validation panel with tabbed notifications.
 *
 * @param props - Props injected to the component.
 * @returns The ValidationPanel component.
 */
const ValidationPanel: FunctionComponent<ValidationPanelPropsInterface> = ({
    "data-componentid": componentId = "validation-panel"
}: ValidationPanelPropsInterface): ReactElement => {
    const {
        notifications,
        openValidationPanel: open,
        setOpenValidationPanel
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

    const errorCount: number = errorNotifications.length;
    const infoCount: number = infoNotifications.length;
    const warningCount: number = warningNotifications.length;

    const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
        setActiveTab(newValue);
    };

    const handleClose = (): void => {
        setOpenValidationPanel?.(false);
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
                <Typography variant="h6" component="h2">
                    Validation Status
                </Typography>
                <IconButton onClick={ handleClose }>
                    <ChevronsLeft height={ 16 } width={ 16 } />
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
                                        Errors ({ errorCount })
                                    </Typography>
                                </Box>
                            )
                        }
                        className={ classNames("validation-tab", {
                            "error-tab": true,
                            "has-notifications": errorCount > 0
                        }) }
                    />
                    <Tab
                        label={
                            (
                                <Box display="flex" alignItems="center" gap={ 1 }>
                                    { getNotificationIcon(NotificationType.INFO) }
                                    <Typography variant="body2">
                                        Info ({ infoCount })
                                    </Typography>
                                </Box>
                            )
                        }
                        className={ classNames("validation-tab", {
                            "has-notifications": infoCount > 0,
                            "info-tab": true
                        }) }
                    />
                    <Tab
                        label={
                            (
                                <Box display="flex" alignItems="center" gap={ 1 }>
                                    { getNotificationIcon(NotificationType.WARNING) }
                                    <Typography variant="body2">
                                        Warnings ({ warningCount })
                                    </Typography>
                                </Box>
                            )
                        }
                        className={ classNames("validation-tab", {
                            "has-notifications": warningCount > 0,
                            "warning-tab": true
                        }) }
                    />
                </Tabs>
                <TabPanel value={ activeTab } index={ 0 } className="validation-tab-panel">
                    <ValidationNotificationsList
                        notifications={ errorNotifications }
                        emptyMessage="No validation errors found."
                    />
                </TabPanel>
                <TabPanel value={ activeTab } index={ 1 } className="validation-tab-panel">
                    <ValidationNotificationsList
                        notifications={ infoNotifications }
                        emptyMessage="No informational messages found."
                    />
                </TabPanel>
                <TabPanel value={ activeTab } index={ 2 } className="validation-tab-panel">
                    <ValidationNotificationsList
                        notifications={ warningNotifications }
                        emptyMessage="No warning messages found."
                    />
                </TabPanel>
            </Box>
        </Drawer>
    );
};

export default ValidationPanel;
