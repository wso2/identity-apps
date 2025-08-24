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

import React, { PropsWithChildren, ReactElement, useCallback, useMemo, useState } from "react";
import { ValidationContext } from "../context/validation-context";
import Notification, { NotificationType } from "../models/notification";

const ValidationProvider = ({
    children
}: PropsWithChildren): ReactElement => {
    const [ notifications, setNotifications ] = useState<Map<string, Notification>>(new Map());
    const [ selectedNotification, setSelectedNotification ] = useState<Notification>(null);
    const [ openValidationPanel, setOpenValidationPanel ] = useState<boolean>(false);
    const [ currentActiveTab, setCurrentActiveTab ] = useState<number>(0);

    /**
     * Get the list of notifications.
     */
    const notificationList: Notification[] = useMemo(() => {
        return Array.from(notifications.values());
    }, [ notifications ]);

    /**
     * Indicates whether the current state of the flow is valid.
     */
    const isValid: boolean = useMemo(() => {
        return notificationList.every((notification: Notification) =>
            notification.getType() !== NotificationType.ERROR);
    }, [ notificationList ]);

    /**
     * Add a notification.
     * @param notification - The notification to add.
     */
    const addNotification: (notification: Notification) => void = useCallback((notification: Notification): void => {
        setNotifications((prev: Map<string, Notification>) => new Map(prev).set(notification.getId(), notification));
        setSelectedNotification((prev: Notification) => {
            if (notification.getId() === prev?.getId()) {
                return notification;
            }

            return prev;
        });
    }, []);

    /**
     * Remove a notification.
     * @param id - The ID of the notification to remove.
     */
    const removeNotification: (id: string) => void = useCallback((id: string): void => {
        setNotifications((prev: Map<string, Notification>) => {
            const updated: Map<string, Notification> = new Map(prev);

            updated.delete(id);

            return updated;
        });
        setSelectedNotification((prev: Notification) => {
            if (prev?.getId() === id) {
                return null;
            }

            return prev;
        });
    }, []);

    /**
     * Gets a notification by its ID.
     * @param id - The ID of the notification to retrieve.
     * @returns The notification with the specified ID, or null if not found.
     */
    const getNotification: (id: string) => Notification = useCallback((id: string): Notification => {
        return notifications.get(id) || null;
    }, [ notifications ]);

    return (
        <ValidationContext.Provider
            value={ {
                addNotification,
                currentActiveTab,
                getNotification,
                isValid,
                notifications: notificationList,
                openValidationPanel,
                removeNotification,
                selectedNotification,
                setCurrentActiveTab,
                setOpenValidationPanel,
                setSelectedNotification
            } }
        >
            { children }
        </ValidationContext.Provider>
    );
};

export default ValidationProvider;
