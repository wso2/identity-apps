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

import { Context, createContext } from "react";
import Notification from "../models/notification";

/**
 * Context for managing validation state and notifications.
 */
export interface ValidationContextProps {
    /**
     * Indicates whether the current state of the flow is valid.
     */
    isValid: boolean;
    /**
     * List of notifications related to the validation state.
     */
    notifications: Notification[];
    /**
     * Adds a notification to the list of notifications.
     *
     * @param notification - The notification to add.
     * @returns The updated list of notifications.
     */
    addNotification?: (notification: Notification) => void;
    /**
     * Removes a notification from the list of notifications.
     *
     * @param notificationId - The ID of the notification to remove.
     * @returns The updated list of notifications.
     */
    removeNotification?: (notificationId: string) => void;
    /**
     * The currently selected notification.
     */
    selectedNotification?: Notification;
    /**
     * Sets the currently selected notification.
     *
     * @param notification - The notification to select.
     */
    setSelectedNotification?: (notification: Notification) => void;
    /**
     * Indicates whether the validation panel is open.
     */
    openValidationPanel?: boolean;
    /**
     * Sets the visibility of the validation panel.
     *
     * @param open - Whether the validation panel should be open.
     */
    setOpenValidationPanel?: (open: boolean) => void;
    /**
     * The currently active tab index.
     */
    currentActiveTab?: number;
    /**
     * Sets the currently active tab index.
     *
     * @param tab - The index of the tab to set as active.
     */
    setCurrentActiveTab?: (tab: number) => void;
    /**
     * Gets a notification by its ID.
     * @param id - The ID of the notification to retrieve.
     * @returns The notification with the specified ID, or null if not found.
     */
    getNotification: (id: string) => Notification;
    /**
     * Removes notifications by resource ID.
     * @param resourceId - The ID of the resource whose notifications to remove.
     */
    removeNotificationByResourceId: (resourceId: string) => void;
}

/**
 * Validation context for managing flow validation state and notifications.
 */
export const ValidationContext: Context<ValidationContextProps> = createContext<ValidationContextProps>({
    addNotification: null,
    currentActiveTab: 0,
    getNotification: null,
    isValid: true,
    notifications: [],
    openValidationPanel: false,
    removeNotification: null,
    removeNotificationByResourceId: null,
    selectedNotification: null,
    setCurrentActiveTab: null,
    setOpenValidationPanel: null
});
