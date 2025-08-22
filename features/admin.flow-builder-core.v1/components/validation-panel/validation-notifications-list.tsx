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
import Box from "@oxygen-ui/react/Box";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import Notification, { NotificationType } from "../../models/notification";

/**
 * Props interface of {@link ValidationNotificationsList}
 */
export interface ValidationNotificationsListPropsInterface
    extends IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {
    /**
     * Array of notifications to display.
     */
    notifications: Notification[];
    /**
     * Message to display when no notifications are available.
     */
    emptyMessage?: string;
    /**
     * Callback fired when a notification is clicked.
     */
    onNotificationClick?: (notification: Notification) => void;
}

/**
 * Get the severity level for Material-UI Alert component based on notification type.
 *
 * @param type - Notification type.
 * @returns Alert severity level.
 */
const getAlertSeverity = (type: NotificationType): "error" | "warning" | "info" | "success" => {
    switch (type) {
        case NotificationType.ERROR:
            return "error";
        case NotificationType.INFO:
            return "info";
        case NotificationType.WARNING:
            return "warning";
        default:
            return "warning";
    }
};

/**
 * Component to render a list of validation notifications.
 *
 * @param props - Props injected to the component.
 * @returns The ValidationNotificationsList component.
 */
const ValidationNotificationsList: FunctionComponent<ValidationNotificationsListPropsInterface> = ({
    "data-componentid": componentId = "validation-notifications-list",
    notifications,
    emptyMessage = "No notifications available.",
    onNotificationClick,
    ...rest
}: ValidationNotificationsListPropsInterface): ReactElement => {

    if (!notifications || notifications.length === 0) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
                data-componentid={ componentId }
                { ...rest }
            >
                <Typography variant="body2" color="textSecondary">
                    { emptyMessage }
                </Typography>
            </Box>
        );
    }

    return (
        <Box data-componentid={ componentId } { ...rest }>
            <List className="validation-notifications-list">
                { notifications.map((notification: Notification, index: number) => (
                    <ListItem
                        key={ notification.getId() || index }
                        className="validation-notification-item"
                        onClick={ () => onNotificationClick?.(notification) }
                        style={ { cursor: onNotificationClick ? "pointer" : "default" } }
                    >
                        <ListItemText
                            primary={
                                (
                                    <Alert
                                        severity={ getAlertSeverity(notification.getType()) }
                                        variant="outlined"
                                        className="validation-notification-alert"
                                    >
                                        <Typography variant="body2">
                                            { notification.getMessage() }
                                        </Typography>
                                        { notification.getResource() && (
                                            <Typography variant="caption" display="block" color="textSecondary">
                                                Resource: { notification.getResource().id }
                                            </Typography>
                                        ) }
                                    </Alert>
                                )
                            }
                        />
                    </ListItem>
                )) }
            </List>
        </Box>
    );
};

export default ValidationNotificationsList;
