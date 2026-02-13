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

import { useContext } from "react";
import VisualEditorNotificationContext,
{ VisualEditorNotificationContextProps } from "../context/visual-editor-notification-context";

/**
 * Custom hook to access visual editor notification context.
 *
 * @returns VisualEditorNotificationContextProps.
 */
const useVisualEditorNotifications = (): VisualEditorNotificationContextProps => {
    const context: VisualEditorNotificationContextProps = useContext(VisualEditorNotificationContext);

    if (!context) {
        throw new Error("useVisualEditorNotifications must be used within a VisualEditorNotificationProvider");
    }

    return context;
};

export default useVisualEditorNotifications;
