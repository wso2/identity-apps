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

import { Dispatch } from "redux";
import { copilotApiService } from "../../api";
import {
    AddCopilotMessageActionInterface,
    ClearCopilotChatActionInterface,
    CopilotActionTypes,
    CopilotContentType,
    CopilotMessage,
    SetCopilotContentTypeActionInterface,
    SetCopilotPanelLoadingActionInterface,
    SetCopilotPanelVisibilityActionInterface,
    ToggleCopilotPanelActionInterface,
    UpdateCopilotMessageActionInterface
} from "../types/copilot-action-types";

/**
 * Redux action to set the copilot panel visibility.
 *
 * @param isVisible - Whether the panel should be visible.
 * @returns An action of type `SET_COPILOT_PANEL_VISIBILITY`.
 */
export const setCopilotPanelVisibility = (isVisible: boolean): SetCopilotPanelVisibilityActionInterface => ({
    payload: isVisible,
    type: CopilotActionTypes.SET_COPILOT_PANEL_VISIBILITY
});

/**
 * Redux action to toggle the copilot panel.
 *
 * @returns An action of type `TOGGLE_COPILOT_PANEL`.
 */
export const toggleCopilotPanel = (): ToggleCopilotPanelActionInterface => ({
    type: CopilotActionTypes.TOGGLE_COPILOT_PANEL
});

/**
 * Redux action to set the copilot panel loading state.
 *
 * @param isLoading - Whether the panel is in loading state.
 * @returns An action of type `SET_COPILOT_PANEL_LOADING`.
 */
export const setCopilotPanelLoading = (isLoading: boolean): SetCopilotPanelLoadingActionInterface => ({
    payload: isLoading,
    type: CopilotActionTypes.SET_COPILOT_PANEL_LOADING
});

/**
 * Redux action to add a message to the copilot chat.
 *
 * @param message - The message to add.
 * @returns An action of type `ADD_COPILOT_MESSAGE`.
 */
export const addCopilotMessage = (message: CopilotMessage): AddCopilotMessageActionInterface => ({
    payload: message,
    type: CopilotActionTypes.ADD_COPILOT_MESSAGE
});

/**
 * Redux action to update a message in the copilot chat.
 *
 * @param update - The message update containing id and content.
 * @returns An action of type `UPDATE_COPILOT_MESSAGE`.
 */
export const updateCopilotMessage = (update: { id: string; content: string }): UpdateCopilotMessageActionInterface => ({
    payload: update,
    type: CopilotActionTypes.UPDATE_COPILOT_MESSAGE
});

/**
 * Redux action to clear the copilot chat history (local only).
 *
 * @returns An action of type `CLEAR_COPILOT_CHAT`.
 */
export const clearCopilotChat = (): ClearCopilotChatActionInterface => ({
    type: CopilotActionTypes.CLEAR_COPILOT_CHAT
});

/**
 * Redux thunk action to clear the copilot chat with API call.
 *
 * @param accessToken - The access token for authentication.
 * @returns A thunk function.
 */
export const clearCopilotChatWithApi = (accessToken?: string | null) => {
    return async (dispatch: Dispatch) => {
        dispatch(clearCopilotChat());

        try {
            if (accessToken) {
                copilotApiService.setAccessToken(accessToken);
            }
            await copilotApiService.clearChat();
        } catch (error: any) {
            if (!error.message?.includes("Failed to fetch") && !error.message?.includes("Network error")) {
                const errorMessage: CopilotMessage = {
                    content: `Note: Chat cleared locally, but server history may not be cleared: ${error.message}`,
                    id: `warning-${Date.now()}`,
                    sender: "copilot",
                    timestamp: Date.now(),
                    type: "error"
                };

                dispatch(addCopilotMessage(errorMessage));
            }
        }
    };
};

/**
 * Redux action to set the copilot content type.
 *
 * @param contentType - The content type to set.
 * @returns An action of type `SET_COPILOT_CONTENT_TYPE`.
 */
export const setCopilotContentType = (contentType: CopilotContentType): SetCopilotContentTypeActionInterface => ({
    payload: contentType,
    type: CopilotActionTypes.SET_COPILOT_CONTENT_TYPE
});

/**
 * Redux thunk action to send a user message and get AI response.
 *
 * @param userMessage - The user's message.
 * @param accessToken - The access token for authentication.
 * @returns A thunk function.
 */
export const sendCopilotMessage = (userMessage: string, accessToken?: string | null) => {
    return async (dispatch: Dispatch) => {
        // Add user message
        const userMsg: CopilotMessage = {
            content: userMessage,
            id: `user-${Date.now()}`,
            sender: "user",
            timestamp: Date.now(),
            type: "text"
        };

        dispatch(addCopilotMessage(userMsg));
        dispatch(setCopilotPanelLoading(true));

        try {
            let accumulatedContent: string = "";
            let isFirstChunk: boolean = true;
            let assistantMessageId: string;

            if (accessToken) {
                copilotApiService.setAccessToken(accessToken);
            }
            const response: any = await copilotApiService.sendMessage(userMessage, (chunk: any) => {
                if (isFirstChunk) {
                    assistantMessageId = `ai-${Date.now()}`;
                    const aiResponse: CopilotMessage = {
                        content: "",
                        id: assistantMessageId,
                        sender: "copilot",
                        timestamp: Date.now(),
                        type: "text"
                    };

                    dispatch(addCopilotMessage(aiResponse));
                    dispatch(setCopilotPanelLoading(false));
                    isFirstChunk = false;
                }

                if (chunk.content) {
                    accumulatedContent += chunk.content;
                    dispatch(updateCopilotMessage({
                        content: accumulatedContent,
                        id: assistantMessageId
                    }));
                }
            });

            if (isFirstChunk) {
                const aiResponse: CopilotMessage = {
                    content: response.answer || "I received your message but couldn't generate a response.",
                    id: `ai-${Date.now()}`,
                    sender: "copilot",
                    timestamp: Date.now(),
                    type: "text"
                };

                dispatch(addCopilotMessage(aiResponse));
            } else {
                if (response.answer && response.answer !== accumulatedContent) {
                    dispatch(updateCopilotMessage({
                        content: response.answer,
                        id: assistantMessageId
                    }));
                }
            }
            dispatch(setCopilotPanelLoading(false));
        } catch (error: any) {
            let errorContent: string = "Sorry, I encountered an error while processing your request. Please try again.";

            if (error.message?.includes("Authentication required")) {
                errorContent = "Authentication required. Please log in to continue using the copilot.";
            } else if (error.message?.includes("Request was cancelled")) {
                errorContent = "Request was cancelled.";
            } else if (error.message?.includes("Failed to fetch")) {
                errorContent = "Connection failed. Please check if the server is running and try again.";
            }

            const errorMessage: CopilotMessage = {
                content: errorContent,
                id: `error-${Date.now()}`,
                sender: "copilot",
                timestamp: Date.now(),
                type: "error"
            };

            dispatch(addCopilotMessage(errorMessage));
        } finally {
            dispatch(setCopilotPanelLoading(false));
        }
    };
};
