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

import { AppState } from "@wso2is/admin.core.v1/store";
import { Dispatch } from "redux";
import {
    type CopilotHistoryResponse,
    clearCopilotChatApi,
    getCopilotChatHistory,
    sendCopilotChatMessage
} from "../../api/copilot-api";

/**
 * Shape of a single history record returned by the chat history API.
 */
interface HistoryRecord {
    answer: string;
    question: string;
}
import {
    AddCopilotMessageActionInterface,
    ClearCopilotChatActionInterface,
    CopilotActionTypes,
    CopilotContentType,
    CopilotMessage,
    HistoryPaginationPayload,
    PrependCopilotMessagesActionInterface,
    SetCopilotChatHistoryActionInterface,
    SetCopilotContentTypeActionInterface,
    SetCopilotHistoryPaginationActionInterface,
    SetCopilotPanelLoadingActionInterface,
    SetCopilotPanelVisibilityActionInterface,
    SetCopilotStatusMessageActionInterface,
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
export const updateCopilotMessage = (
    update: {
        id: string;
        content: string;
        type?: CopilotMessage["type"];
        suggestions?: string[];
        suggestionsLoading?: boolean;
    }
): UpdateCopilotMessageActionInterface => ({
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
 * Redux action to set the copilot status message (agent step progress).
 *
 * @param message - The status message to display, or null to clear.
 * @returns An action of type `SET_COPILOT_STATUS_MESSAGE`.
 */
export const setCopilotStatusMessage = (
    message: string | null
): SetCopilotStatusMessageActionInterface => ({
    payload: message,
    type: CopilotActionTypes.SET_COPILOT_STATUS_MESSAGE
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

        // Reset loading and status states
        dispatch(setCopilotPanelLoading(false));
        dispatch(setCopilotStatusMessage(null));

        // Clear the chat
        dispatch(clearCopilotChat());

        try {
            await clearCopilotChatApi();
        } catch (error: unknown) {
            const errorMsg: string = error instanceof Error ? error.message : String(error);

            if (!errorMsg.includes("Failed to fetch") && !errorMsg.includes("Network error")) {
                const errorMessage: CopilotMessage = {
                    content: `Note: Chat cleared locally, but server history may not be cleared: ${errorMsg}`,
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
 * Redux action to set the history pagination metadata.
 *
 * @param payload - Pagination metadata.
 * @returns An action of type `SET_COPILOT_HISTORY_PAGINATION`.
 */
export const setHistoryPagination = (
    payload: HistoryPaginationPayload
): SetCopilotHistoryPaginationActionInterface => ({
    payload,
    type: CopilotActionTypes.SET_COPILOT_HISTORY_PAGINATION
});

/**
 * Redux action to prepend older messages to the chat list (load-earlier).
 *
 * @param messages - Older messages to prepend.
 * @returns An action of type `PREPEND_COPILOT_MESSAGES`.
 */
export const prependCopilotMessages = (messages: CopilotMessage[]): PrependCopilotMessagesActionInterface => ({
    payload: messages,
    type: CopilotActionTypes.PREPEND_COPILOT_MESSAGES
});



/**
 * Redux thunk action to fetch the most-recent page of chat history.
 * Uses reverse-offset pagination: offset=0 returns the latest records.
 *
 * @returns A thunk function.
 */
export const fetchCopilotHistory = () => {
    return async (dispatch: Dispatch, getState: () => AppState) => {
        try {
            // Check if there are already messages (don't overwrite existing conversation)
            const currentState: AppState = getState();
            const currentMessages: CopilotMessage[] = currentState?.copilot?.messages || [];

            if (currentMessages.length > 0) {
                dispatch(setCopilotPanelLoading(false));

                return;
            }

            dispatch(setCopilotPanelLoading(true));

            const response: CopilotHistoryResponse = await getCopilotChatHistory(0);

            if (response.history && Array.isArray(response.history)) {
                const messages: CopilotMessage[] = [];

                response.history.forEach((record: HistoryRecord, index: number) => {
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
                const finalState: AppState = getState();
                const finalMessages: CopilotMessage[] = finalState?.copilot?.messages || [];

                if (finalMessages.length === 0) {
                    dispatch(setCopilotChatHistory(messages));
                    // Store pagination metadata so the UI can offer "load earlier"
                    dispatch(setHistoryPagination({
                        hasMoreHistory: response.has_more,
                        nextOffset: response.limit,
                        total: response.total
                    }));
                }
            }
        } catch (_error: unknown) {
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
 * Redux thunk action to load an older page of chat history and prepend it.
 * Increments the stored offset so repeated calls walk further into the past.
 *
 * @returns A thunk function.
 */
export const loadMoreCopilotHistory = () => {
    return async (dispatch: Dispatch, getState: () => AppState) => {
        const state: AppState = getState();
        const { hasMoreHistory, historyOffset, isLoadingMoreHistory } = state?.copilot || {};

        if (!hasMoreHistory || isLoadingMoreHistory) {
            return;
        }

        try {
            dispatch({
                payload: {
                    hasMoreHistory,
                    nextOffset: historyOffset,
                    total: state?.copilot?.historyTotal ?? 0
                } as HistoryPaginationPayload,
                type: CopilotActionTypes.SET_COPILOT_HISTORY_PAGINATION
            });

            const response: CopilotHistoryResponse = await getCopilotChatHistory(historyOffset);

            if (response.history && Array.isArray(response.history) && response.history.length > 0) {
                const olderMessages: CopilotMessage[] = [];

                response.history.forEach((record: HistoryRecord, index: number) => {
                    olderMessages.push({
                        content: record.question,
                        id: `hist-older-user-${historyOffset + index}-${Date.now()}`,
                        sender: "user",
                        timestamp: Date.now() - (response.total - historyOffset - index) * 60000,
                        type: "text"
                    });
                    olderMessages.push({
                        content: record.answer,
                        id: `hist-older-ai-${historyOffset + index}-${Date.now()}`,
                        sender: "copilot",
                        timestamp: Date.now() - (response.total - historyOffset - index) * 60000 + 1000,
                        type: "text"
                    });
                });

                dispatch(prependCopilotMessages(olderMessages));
                dispatch(setHistoryPagination({
                    hasMoreHistory: response.has_more,
                    nextOffset: historyOffset + response.limit,
                    total: response.total
                }));
            } else {
                // No more records
                dispatch(setHistoryPagination({
                    hasMoreHistory: false,
                    nextOffset: historyOffset,
                    total: state?.copilot?.historyTotal ?? 0
                }));
            }
        } catch (_error: unknown) {
            // Reset pagination so the "load more" button re-enables instead of staying stuck
            dispatch(setHistoryPagination({
                hasMoreHistory,
                nextOffset: historyOffset,
                total: state?.copilot?.historyTotal ?? 0
            }));
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
 * Minimum time (ms) to display each status message before allowing the next.
 */
const STATUS_MIN_DISPLAY_MS: number = 200;

/**
 * Status message queue that guarantees each message displays for a minimum duration.
 * This creates the smooth step-by-step progression the user sees.
 */
class StatusQueue {
    private queue: string[] = [];
    private isProcessing: boolean = false;
    private lastDisplayTime: number = 0;
    private dispatch: Dispatch;
    private cancelled: boolean = false;

    constructor(dispatch: Dispatch) {
        this.dispatch = dispatch;
    }

    /**
     * Add a status message to the queue. It will be shown after the current
     * message has been displayed for at least STATUS_MIN_DISPLAY_MS.
     */
    enqueue(message: string): void {
        if (this.cancelled) return;
        this.queue.push(message);
        if (!this.isProcessing) {
            this.processNext();
        }
    }

    /**
     * Process the next message in the queue.
     */
    private processNext(): void {
        if (this.cancelled || this.queue.length === 0) {
            this.isProcessing = false;

            return;
        }

        this.isProcessing = true;
        const message: string = this.queue.shift()!;
        const now: number = Date.now();
        const elapsed: number = now - this.lastDisplayTime;
        const delay: number = Math.max(0, STATUS_MIN_DISPLAY_MS - elapsed);

        setTimeout(() => {
            if (this.cancelled) return;
            this.dispatch(setCopilotStatusMessage(message));
            this.lastDisplayTime = Date.now();
            this.processNext();
        }, delay);
    }

    /**
     * Drain any remaining messages in the queue, showing each for the minimum time.
     * Returns a promise that resolves when the queue is empty.
     */
    async drain(): Promise<void> {
        while (this.queue.length > 0 && !this.cancelled) {
            const message: string = this.queue.shift()!;
            const now: number = Date.now();
            const elapsed: number = now - this.lastDisplayTime;
            const remaining: number = Math.max(0, STATUS_MIN_DISPLAY_MS - elapsed);

            if (remaining > 0) {
                await new Promise<void>((resolve: () => void) => setTimeout(resolve, remaining));
            }

            if (this.cancelled) return;
            this.dispatch(setCopilotStatusMessage(message));
            this.lastDisplayTime = Date.now();
        }

        // Wait for the last message to be visible for the minimum time
        if (!this.cancelled) {
            const finalElapsed: number = Date.now() - this.lastDisplayTime;
            const finalRemaining: number = Math.max(0, STATUS_MIN_DISPLAY_MS - finalElapsed);

            if (finalRemaining > 0) {
                await new Promise<void>((resolve: () => void) => setTimeout(resolve, finalRemaining));
            }
        }
    }

    /**
     * Cancel the queue and stop processing.
     */
    cancel(): void {
        this.cancelled = true;
        this.queue = [];
    }
}

/**
 * Redux thunk action to send a user message and get AI response via SSE streaming.
 * The answer types out token-by-token in real-time, like ChatGPT.
 * Status messages are queued with a minimum display time for smooth progression.
 *
 * @param userMessage - The user's message.
 * @param getAccessToken - Function from useAuthContext() to get the access token.
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
        dispatch(setCopilotStatusMessage("Submitting your question..."));

        // Create status queue for smooth step-by-step progression
        const statusQueue: StatusQueue = new StatusQueue(dispatch);

        // Create a placeholder AI message that will be updated as tokens arrive
        const aiMessageId: string = `ai-${Date.now()}`;
        const aiPlaceholder: CopilotMessage = {
            content: "",
            id: aiMessageId,
            sender: "copilot",
            timestamp: Date.now(),
            type: "streaming"
        };

        // We'll add the AI message once the first token arrives
        let aiMessageAdded: boolean = false;
        const pendingTokens: string[] = [];
        let drainingStatus: boolean = false;
        let suggestionsTimeoutId: ReturnType<typeof setTimeout> | null = null;

        // Token batching: collect tokens within a 16ms window (one animation frame)
        // and dispatch them as a single concatenated string. This reduces Redux
        // dispatch frequency from potentially hundreds/sec to max ~60/sec, which
        // directly reduces how often the Markdown parser runs during streaming.
        const tokenBatch: string[] = [];
        let tokenFlushTimer: ReturnType<typeof setTimeout> | null = null;

        const flushTokenBatch = (): void => {
            tokenFlushTimer = null;
            if (tokenBatch.length === 0) return;
            const joined: string = tokenBatch.splice(0).join("");

            dispatch(updateCopilotMessage({ content: joined, id: aiMessageId }));
        };

        try {
            await sendCopilotChatMessage(
                userMessage,
                {
                    onComplete: () => {
                        // Flush any tokens still waiting in the 16ms batch before finalizing.
                        if (tokenFlushTimer !== null) {
                            clearTimeout(tokenFlushTimer);
                            flushTokenBatch();
                        }
                        dispatch(updateCopilotMessage({
                            content: "",
                            id: aiMessageId,
                            type: "text"
                        }));
                    },
                    onError: (_error: string) => { /* errors are surfaced via the error message dispatch */ },
                    onStatus: (step: string) => {
                        if (signal.aborted) return;
                        statusQueue.enqueue(step);
                    },
                    onSuggestions: (suggestions: string[]) => {
                        if (signal.aborted) return;

                        // Cancel the safety-net timeout — suggestions arrived in time.
                        if (suggestionsTimeoutId !== null) {
                            clearTimeout(suggestionsTimeoutId);
                            suggestionsTimeoutId = null;
                        }

                        // Attach the generated suggestions to the AI message so they render as buttons.
                        // The reducer clears suggestionsLoading when suggestions arrive.
                        dispatch(updateCopilotMessage({
                            content: "",
                            id: aiMessageId,
                            suggestions
                        }));
                    },
                    onSuggestionsLoading: () => {
                        if (signal.aborted) return;
                        dispatch(updateCopilotMessage({
                            content: "",
                            id: aiMessageId,
                            suggestionsLoading: true
                        }));

                        // Client-side safety net: if SUGGESTIONS never arrives within 10s
                        // (backend timeout is 12s), clear the loading skeleton so the UI
                        // doesn't hang indefinitely.
                        suggestionsTimeoutId = setTimeout(() => {
                            suggestionsTimeoutId = null;
                            dispatch(updateCopilotMessage({
                                content: "",
                                id: aiMessageId,
                                suggestionsLoading: false
                            }));
                        }, 10000);
                    },
                    onToken: (content: string) => {
                        if (signal.aborted) return;

                        if (!aiMessageAdded) {
                            // Buffer this token
                            pendingTokens.push(content);

                            // On the very first token, immediately transition to the answer.
                            if (!drainingStatus) {
                                drainingStatus = true;
                                statusQueue.cancel();
                                aiMessageAdded = true;
                                dispatch(setCopilotStatusMessage(null));
                                dispatch(addCopilotMessage(aiPlaceholder));
                                dispatch(setCopilotPanelLoading(false));

                                // Flush all buffered pre-first-token content as one dispatch.
                                const initialContent: string = pendingTokens.splice(0).join("");

                                dispatch(updateCopilotMessage({ content: initialContent, id: aiMessageId }));
                            }
                        } else {
                            // Batch tokens within a 16ms window to reduce Markdown re-renders.
                            tokenBatch.push(content);
                            if (tokenFlushTimer === null) {
                                tokenFlushTimer = setTimeout(flushTokenBatch, 16);
                            }
                        }
                    }
                },
                signal
            );

            // If stream ended before any token arrived (e.g. empty response),
            // still drain the status queue and clean up.
            if (!aiMessageAdded) {
                await statusQueue.drain();
            }

            dispatch(setCopilotPanelLoading(false));
            dispatch(setCopilotStatusMessage(null));
            currentRequestController = null;

        } catch (error: unknown) {
            statusQueue.cancel();

            // Clear suggestions timeout if the request errored/aborted mid-stream.
            if (suggestionsTimeoutId !== null) {
                clearTimeout(suggestionsTimeoutId);
                suggestionsTimeoutId = null;
            }

            const errorName: string = error instanceof Error ? error.name : "";
            const errorMsg: string = error instanceof Error ? error.message : String(error);

            // Don't show error if request was aborted intentionally
            if (errorName === "AbortError" || signal.aborted) {
                dispatch(setCopilotPanelLoading(false));
                dispatch(setCopilotStatusMessage(null));
                currentRequestController = null;

                return;
            }

            let errorContent: string = "Sorry, I encountered an error while processing your request. Please try again.";

            if (errorMsg.includes("Authentication required")) {
                errorContent = "Authentication required. Please log in to continue using the copilot.";
            } else if (errorMsg.includes("Request was cancelled")) {
                errorContent = "Request was cancelled.";
            } else if (errorMsg.includes("Failed to fetch")) {
                errorContent = "Connection failed. Please check if the server is running and try again.";
            } else if (errorMsg.includes("timed out")) {
                errorContent = "The request took too long. Please try again with a simpler question.";
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
            dispatch(setCopilotStatusMessage(null));
        }
    };
};
