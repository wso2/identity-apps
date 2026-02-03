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
import {
    CopilotStreamChunk,
    clearCopilotChatApi,
    getCopilotChatHistory,
    sendCopilotStreamingMessage
} from "../../api/copilot-api";
import {
    AddCopilotMessageActionInterface,
    ClearCopilotChatActionInterface,
    CopilotActionTypes,
    CopilotContentType,
    CopilotMessage,
    SetCopilotChatHistoryActionInterface,
    SetCopilotContentTypeActionInterface,
    SetCopilotPanelLoadingActionInterface,
    SetCopilotPanelVisibilityActionInterface,
    ToggleCopilotPanelActionInterface,
    UpdateCopilotMessageActionInterface
} from "../types/copilot-action-types";

// AbortController to cancel ongoing requests
let currentRequestController: AbortController | null = null;

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
 * Uses AsgardeoSPAClient for automatic token handling.
 *
 * @returns A thunk function.
 */
export const clearCopilotChatWithApi = () => {
    return async (dispatch: Dispatch) => {
        // Cancel any ongoing request
        if (currentRequestController) {
            currentRequestController.abort();
            currentRequestController = null;
        }

        // Reset loading state
        dispatch(setCopilotPanelLoading(false));

        // Clear the chat
        dispatch(clearCopilotChat());

        try {
            await clearCopilotChatApi();
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
 * Redux action to set the copilot chat history.
 *
 * @param messages - The history messages.
 * @returns An action of type `SET_COPILOT_CHAT_HISTORY`.
 */
export const setCopilotChatHistory = (messages: CopilotMessage[]): SetCopilotChatHistoryActionInterface => ({
    payload: messages,
    type: CopilotActionTypes.SET_COPILOT_CHAT_HISTORY
});

/**
 * Redux thunk action to fetch the chat history.
 * Uses AsgardeoSPAClient for automatic token handling.
 *
 * @returns A thunk function.
 */
export const fetchCopilotHistory = () => {
    return async (dispatch: Dispatch, getState: any) => {
        try {
            console.log("[fetchCopilotHistory] Dispatching loading state...");
            
            // Check if there are already messages (don't overwrite existing conversation)
            const currentState = getState();
            const currentMessages = currentState?.copilot?.messages || [];
            
            if (currentMessages.length > 0) {
                console.log("[fetchCopilotHistory] Messages already exist, skipping history load");
                return;
            }
            
            dispatch(setCopilotPanelLoading(true));

            console.log("[fetchCopilotHistory] Calling API...");
            const response = await getCopilotChatHistory();

            console.log("[fetchCopilotHistory] Response received:", response);

            if (response.history && Array.isArray(response.history)) {
                const messages: CopilotMessage[] = [];

                response.history.forEach((record: any, index: number) => {
                    // Add user message
                    messages.push({
                        content: record.question,
                        id: `hist-user-${index}-${Date.now()}`,
                        sender: "user",
                        timestamp: Date.now() - (response.history.length - index) * 60000,
                        type: "text"
                    });

                    // Add AI message
                    messages.push({
                        content: record.answer,
                        id: `hist-ai-${index}-${Date.now()}`,
                        sender: "copilot",
                        timestamp: Date.now() - (response.history.length - index) * 60000 + 1000,
                        type: "text"
                    });
                });

                // Only set history if we still don't have messages (avoid race condition)
                const finalState = getState();
                const finalMessages = finalState?.copilot?.messages || [];
                
                if (finalMessages.length === 0) {
                    dispatch(setCopilotChatHistory(messages));
                }
            }
        } catch (error: any) {
            console.error("[fetchCopilotHistory] Error:", error);
            // Silently fail for history fetch errors
        } finally {
            // Only set loading to false if there's no active request
            if (!currentRequestController) {
                dispatch(setCopilotPanelLoading(false));
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
 * Uses AsgardeoSPAClient for automatic token handling.
 *
 * @param userMessage - The user's message.
 * @returns A thunk function.
 */
export const sendCopilotMessage = (userMessage: string) => {
    return async (dispatch: Dispatch) => {
        // Cancel any existing request before starting a new one
        if (currentRequestController) {
            currentRequestController.abort();
        }

        // Create new AbortController for this request
        currentRequestController = new AbortController();
        const signal: AbortSignal = currentRequestController.signal;

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

            console.log("[sendCopilotMessage] Sending message via streaming API");

            const response: any = await sendCopilotStreamingMessage(
                userMessage,
                (chunk: CopilotStreamChunk) => {
                    // Check if request was aborted
                    if (signal.aborted) {
                        return;
                    }

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
                }
            );

            // Check if request was aborted before adding final message
            if (signal.aborted) {
                return;
            }

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

            // Clear the controller reference when done
            currentRequestController = null;
        } catch (error: any) {
            console.error("[sendCopilotMessage] Error details:", error);

            // Don't show error if request was aborted intentionally
            if (error.name === "AbortError" || signal.aborted) {
                console.log("[sendCopilotMessage] Request was cancelled");
                dispatch(setCopilotPanelLoading(false));
                currentRequestController = null;
                return;
            }

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
            currentRequestController = null;
        } finally {
            dispatch(setCopilotPanelLoading(false));
        }
    };
};
