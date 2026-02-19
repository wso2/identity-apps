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

import { Context, createContext } from "react";
import {
    VisualEditorNotificationActions,
    VisualEditorNotificationState
} from "../models/visual-editor-notification";

/**
 * Props interface for VisualEditorNotificationContext.
 */
export type VisualEditorNotificationContextProps = VisualEditorNotificationState & VisualEditorNotificationActions;

/**
 * Default context value.
 */
const defaultContextValue: VisualEditorNotificationContextProps = {
    addNotification: () => {},
    clearAllNotifications: () => {},
    clearNotificationsByCategory: () => {},
    clearNotificationsBySeverity: () => {},
    dismissNotification: () => {},
    errors: [],
    notifications: [],
    removeNotification: () => {},
    warnings: []
};

/**
 * Context object for managing visual editor notifications.
 */
const VisualEditorNotificationContext: Context<VisualEditorNotificationContextProps> =
    createContext<VisualEditorNotificationContextProps>(defaultContextValue);

/**
 * Display name for the VisualEditorNotificationContext.
 */
VisualEditorNotificationContext.displayName = "VisualEditorNotificationContext";

export default VisualEditorNotificationContext;
