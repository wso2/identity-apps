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

/**
 * Enum for copilot action types.
 */
export enum CopilotActionTypes {
    /**
     * Action type to set the copilot panel visibility.
     */
    SET_COPILOT_PANEL_VISIBILITY = "SET_COPILOT_PANEL_VISIBILITY",
    /**
     * Action type to toggle the copilot panel.
     */
    TOGGLE_COPILOT_PANEL = "TOGGLE_COPILOT_PANEL",
    /**
     * Action type to set copilot panel loading state.
     */
    SET_COPILOT_PANEL_LOADING = "SET_COPILOT_PANEL_LOADING",
    /**
     * Action type to add a message to copilot chat.
     */
    ADD_COPILOT_MESSAGE = "ADD_COPILOT_MESSAGE",
    /**
     * Action type to update a message in copilot chat.
     */
    UPDATE_COPILOT_MESSAGE = "UPDATE_COPILOT_MESSAGE",
    /**
     * Action type to clear copilot chat history.
     */
    CLEAR_COPILOT_CHAT = "CLEAR_COPILOT_CHAT",
    /**
     * Action type to set copilot panel content type.
     */
    SET_COPILOT_CONTENT_TYPE = "SET_COPILOT_CONTENT_TYPE"
}

/**
 * Copilot message interface.
 */
export interface CopilotMessage {
    id: string;
    content: string;
    sender: "user" | "copilot";
    timestamp: number;
    type?: "text" | "code" | "error";
}

/**
 * Copilot content types.
 */
export enum CopilotContentType {
    CHAT = "chat",
    HELP = "help",
    DOCUMENTATION = "documentation"
}

/**
 * Copilot panel state interface.
 */
export interface CopilotPanelState {
    isVisible: boolean;
    isLoading: boolean;
    messages: CopilotMessage[];
    contentType: CopilotContentType;
}

/**
 * Set copilot panel visibility action interface.
 */
export interface SetCopilotPanelVisibilityActionInterface {
    payload: boolean;
    type: CopilotActionTypes.SET_COPILOT_PANEL_VISIBILITY;
}

/**
 * Toggle copilot panel action interface.
 */
export interface ToggleCopilotPanelActionInterface {
    type: CopilotActionTypes.TOGGLE_COPILOT_PANEL;
}

/**
 * Set copilot panel loading action interface.
 */
export interface SetCopilotPanelLoadingActionInterface {
    payload: boolean;
    type: CopilotActionTypes.SET_COPILOT_PANEL_LOADING;
}

/**
 * Add copilot message action interface.
 */
export interface AddCopilotMessageActionInterface {
    payload: CopilotMessage;
    type: CopilotActionTypes.ADD_COPILOT_MESSAGE;
}

/**
 * Update copilot message action interface.
 */
export interface UpdateCopilotMessageActionInterface {
    payload: {
        id: string;
        content: string;
    };
    type: CopilotActionTypes.UPDATE_COPILOT_MESSAGE;
}

/**
 * Clear copilot chat action interface.
 */
export interface ClearCopilotChatActionInterface {
    type: CopilotActionTypes.CLEAR_COPILOT_CHAT;
}

/**
 * Set copilot content type action interface.
 */
export interface SetCopilotContentTypeActionInterface {
    payload: CopilotContentType;
    type: CopilotActionTypes.SET_COPILOT_CONTENT_TYPE;
}

/**
 * Export action interfaces.
 */
export type CopilotActions = SetCopilotPanelVisibilityActionInterface
    | ToggleCopilotPanelActionInterface
    | SetCopilotPanelLoadingActionInterface
    | AddCopilotMessageActionInterface
    | UpdateCopilotMessageActionInterface
    | ClearCopilotChatActionInterface
    | SetCopilotContentTypeActionInterface;
