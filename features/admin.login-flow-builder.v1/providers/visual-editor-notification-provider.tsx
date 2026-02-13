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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useCallback, useMemo, useState } from "react";
import VisualEditorNotificationContext from "../context/visual-editor-notification-context";
import {
    NotificationCategory,
    NotificationSeverity,
    VisualEditorNotification
} from "../models/visual-editor-notification";

/**
 * Props interface for VisualEditorNotificationProvider.
 */
export type VisualEditorNotificationProviderProps = IdentifiableComponentInterface;

/**
 * Provider component for visual editor notifications.
 *
 * @param props - Props injected to the component.
 * @returns VisualEditorNotificationProvider component.
 */
const VisualEditorNotificationProvider: FunctionComponent<PropsWithChildren<VisualEditorNotificationProviderProps>> = (
    props: PropsWithChildren<VisualEditorNotificationProviderProps>
): ReactElement => {

    const { children } = props;
    const [ notifications, setNotifications ] = useState<VisualEditorNotification[]>([]);

    /**
     * Generate a unique ID for notifications.
     */
    const generateId: () => string = useCallback((): string => {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    /**
     * Add a new notification.
     */
    const addNotification: (notification: Omit<VisualEditorNotification, "id" | "timestamp">) => void = useCallback((
        notification: Omit<VisualEditorNotification, "id" | "timestamp">
    ): void => {
        const newNotification: VisualEditorNotification = {
            ...notification,
            id: generateId(),
            timestamp: Date.now()
        };

        setNotifications((prev: VisualEditorNotification[]) => {
            const exists: boolean = prev.some(
                (n: VisualEditorNotification) =>
                    n.category === notification.category &&
                    n.relatedEntity === notification.relatedEntity &&
                    n.stepNumber === notification.stepNumber &&
                    !n.dismissed
            );

            if (exists) {
                return prev;
            }

            return [ ...prev, newNotification ];
        });
    }, [ generateId ]);

    /**
     * Remove a notification by ID.
     */
    const removeNotification: (id: string) => void = useCallback((id: string): void => {
        setNotifications((prev: VisualEditorNotification[]) =>
            prev.filter((n: VisualEditorNotification) => n.id !== id)
        );
    }, []);

    /**
     * Dismiss a notification by ID.
     */
    const dismissNotification: (id: string) => void = useCallback((id: string): void => {
        setNotifications((prev: VisualEditorNotification[]) =>
            prev.map((n: VisualEditorNotification) =>
                n.id === id ? { ...n, dismissed: true } : n
            )
        );
    }, []);

    /**
     * Clear all notifications.
     */
    const clearAllNotifications: () => void = useCallback((): void => {
        setNotifications([]);
    }, []);

    /**
     * Clear notifications by severity.
     */
    const clearNotificationsBySeverity: (severity: NotificationSeverity) => void = useCallback(
        (severity: NotificationSeverity): void => {
            setNotifications((prev: VisualEditorNotification[]) =>
                prev.filter((n: VisualEditorNotification) => n.severity !== severity)
            );
        }, []);

    /**
     * Clear notifications by category.
     */
    const clearNotificationsByCategory: (category: NotificationCategory) => void = useCallback(
        (category: NotificationCategory): void => {
            setNotifications((prev: VisualEditorNotification[]) =>
                prev.filter((n: VisualEditorNotification) => n.category !== category)
            );
        }, []);

    /**
     * Filter warnings from notifications.
     */
    const warnings: VisualEditorNotification[] = useMemo(() =>
        notifications.filter(
            (n: VisualEditorNotification) => n.severity === NotificationSeverity.WARNING && !n.dismissed
        ),
    [ notifications ]);

    /**
     * Filter errors from notifications.
     */
    const errors: VisualEditorNotification[] = useMemo(() =>
        notifications.filter(
            (n: VisualEditorNotification) => n.severity === NotificationSeverity.ERROR && !n.dismissed
        ),
    [ notifications ]);

    return (
        <VisualEditorNotificationContext.Provider
            value={ {
                addNotification,
                clearAllNotifications,
                clearNotificationsByCategory,
                clearNotificationsBySeverity,
                dismissNotification,
                errors,
                notifications,
                removeNotification,
                warnings
            } }
        >
            { children }
        </VisualEditorNotificationContext.Provider>
    );
};

export default VisualEditorNotificationProvider;
