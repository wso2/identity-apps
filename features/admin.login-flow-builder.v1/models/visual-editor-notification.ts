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

/**
 * Enum for notification severity levels.
 */
export enum NotificationSeverity {
    WARNING = "warning",
    ERROR = "error"
}

/**
 * Enum for notification categories.
 */
export enum NotificationCategory {
    UNSUPPORTED_AUTHENTICATOR = "unsupported_authenticator",
    INVALID_CONFIGURATION = "invalid_configuration",
    MISSING_DEPENDENCY = "missing_dependency",
    GENERAL = "general"
}

/**
 * Interface for visual editor notification.
 */
export interface VisualEditorNotification {
    /**
     * Unique identifier for the notification.
     */
    id: string;
    /**
     * Severity level of the notification.
     */
    severity: NotificationSeverity;
    /**
     * Category of the notification.
     */
    category: NotificationCategory;
    /**
     * Title of the notification.
     */
    title: string;
    /**
     * Description/message of the notification.
     */
    description: string;
    /**
     * Step number where the issue occurred (if applicable).
     */
    stepNumber?: number;
    /**
     * Name of the related entity (authenticator, etc.).
     */
    relatedEntity?: string;
    /**
     * Timestamp when the notification was created.
     */
    timestamp: number;
    /**
     * Whether the notification has been dismissed.
     */
    dismissed?: boolean;
}

/**
 * Interface for the notification context state.
 */
export interface VisualEditorNotificationState {
    /**
     * List of all notifications.
     */
    notifications: VisualEditorNotification[];
    /**
     * List of warning notifications.
     */
    warnings: VisualEditorNotification[];
    /**
     * List of error notifications.
     */
    errors: VisualEditorNotification[];
}

/**
 * Interface for notification context actions.
 */
export interface VisualEditorNotificationActions {
    /**
     * Add a new notification.
     * @param notification - Notification to add.
     */
    addNotification: (notification: Omit<VisualEditorNotification, "id" | "timestamp">) => void;
    /**
     * Remove a notification by ID.
     * @param id - Notification ID.
     */
    removeNotification: (id: string) => void;
    /**
     * Dismiss a notification by ID.
     * @param id - Notification ID.
     */
    dismissNotification: (id: string) => void;
    /**
     * Clear all notifications.
     */
    clearAllNotifications: () => void;
    /**
     * Clear notifications by severity.
     * @param severity - Severity level.
     */
    clearNotificationsBySeverity: (severity: NotificationSeverity) => void;
    /**
     * Clear notifications by category.
     * @param category - Notification category.
     */
    clearNotificationsByCategory: (category: NotificationCategory) => void;
}
