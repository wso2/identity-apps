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
import { I18n } from "@wso2is/i18n";
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
    SetIsLoadingMoreHistoryActionInterface,
    ToggleCopilotPanelActionInterface,
    UpdateCopilotMessageActionInterface
} from "../types/copilot-action-types";

/**
 * Manages per-request AbortControllers so that only the targeted request
 * is cancelled — not a module-level singleton that could cancel unrelated traffic.
 */
class RequestManager {
    private controllers: Map<string, AbortController> = new Map();

    startRequest(requestId: string): AbortController {
        this.abortRequest(requestId);
        const controller: AbortController = new AbortController();

        this.controllers.set(requestId, controller);

        return controller;
    }

    abortRequest(requestId: string): void {
        const controller: AbortController | undefined = this.controllers.get(requestId);

        if (controller) {
            controller.abort();
            this.controllers.delete(requestId);
        }
    }

    completeRequest(requestId: string, controller: AbortController): void {
        if (this.controllers.get(requestId) === controller) {
            this.controllers.delete(requestId);
        }
    }

    hasActiveRequest(requestId: string): boolean {
        return this.controllers.has(requestId);
    }
}

const requestManager: RequestManager = new RequestManager();

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
        // Cancel any ongoing chat or history requests
        requestManager.abortRequest("chat");
        requestManager.abortRequest("chatHistory");

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
                    content: I18n.instance.t("console:common.copilot.errors.clearHistoryFailed"),
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
 * Redux action to set the isLoadingMoreHistory flag.
 *
 * @param isLoading - Whether a "load earlier" request is in progress.
 * @returns An action of type `SET_IS_LOADING_MORE_HISTORY`.
 */
export const setIsLoadingMoreHistory = (isLoading: boolean): SetIsLoadingMoreHistoryActionInterface => ({
    payload: isLoading,
    type: CopilotActionTypes.SET_IS_LOADING_MORE_HISTORY
});



/**
 * Redux thunk action to fetch the most-recent page of chat history.
 * Uses reverse-offset pagination: offset=0 returns the latest records.
 *
 * @returns A thunk function.
 */
export const fetchCopilotHistory = () => {
    return async (dispatch: Dispatch, getState: () => AppState) => {
        const historyController: AbortController = requestManager.startRequest("chatHistory");

        try {
            // Check if there are already messages (don't overwrite existing conversation)
            const currentState: AppState = getState();
            const currentMessages: CopilotMessage[] = currentState?.copilot?.messages || [];

            if (currentMessages.length > 0) {
                return;
            }

            dispatch(setCopilotPanelLoading(true));

            const response: CopilotHistoryResponse = await getCopilotChatHistory(
                0, undefined, historyController.signal
            );

            // Discard results if a clear was issued while this request was in-flight.
            if (historyController.signal.aborted) return;

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
            requestManager.completeRequest("chatHistory", historyController);
            // Only set loading to false if there's no active request
            if (!requestManager.hasActiveRequest("chat")) {
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

        // Set the guard before the async boundary so rapid clicks are blocked.
        dispatch(setIsLoadingMoreHistory(true));

        const historyController: AbortController = requestManager.startRequest("chatHistory");

        try {
            const response: CopilotHistoryResponse = await getCopilotChatHistory(
                historyOffset, undefined, historyController.signal
            );

            // Discard results if a clear was issued while this request was in-flight.
            if (historyController.signal.aborted) return;

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
            // Don't touch pagination state when the request was intentionally aborted
            if (historyController.signal.aborted) return;

            // Reset pagination so the "load more" button re-enables instead of staying stuck
            dispatch(setHistoryPagination({
                hasMoreHistory,
                nextOffset: historyOffset,
                total: state?.copilot?.historyTotal ?? 0
            }));
        } finally {
            requestManager.completeRequest("chatHistory", historyController);
            dispatch(setIsLoadingMoreHistory(false));
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
    private pendingTimer: ReturnType<typeof setTimeout> | null = null;
    private pendingTimerResolve: (() => void) | null = null;

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
     * Peeks at queue[0] without shifting so drain() cannot consume the same item.
     * The shift happens inside the timer callback once the item is actually displayed.
     */
    private processNext(): void {
        if (this.cancelled || this.queue.length === 0) {
            this.isProcessing = false;

            return;
        }

        this.isProcessing = true;
        const message: string = this.queue[0];
        const now: number = Date.now();
        const elapsed: number = now - this.lastDisplayTime;
        const delay: number = Math.max(0, STATUS_MIN_DISPLAY_MS - elapsed);

        this.pendingTimer = setTimeout(() => {
            const resolve: (() => void) | null = this.pendingTimerResolve;

            this.pendingTimer = null;
            this.pendingTimerResolve = null;

            if (this.cancelled) {
                resolve?.();

                return;
            }

            this.queue.shift();
            this.dispatch(setCopilotStatusMessage(message));
            this.lastDisplayTime = Date.now();
            resolve?.();
            this.processNext();
        }, delay);
    }

    /**
     * Drain any remaining messages in the queue, showing each for the minimum time.
     * Waits for any in-flight processNext timer before consuming from the queue.
     * Returns a promise that resolves when the queue is empty.
     */
    async drain(): Promise<void> {
        // Wait for processNext's pending timer so drain doesn't race with it.
        if (this.pendingTimer !== null) {
            await new Promise<void>((resolve: () => void) => {
                this.pendingTimerResolve = resolve;
            });
        }

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
        // Cancel any existing request before starting a new one, then register this one
        const controller: AbortController = requestManager.startRequest("chat");
        const signal: AbortSignal = controller.signal;

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
        dispatch(setCopilotStatusMessage(I18n.instance.t("console:common.copilot.status.submitting")));

        // Create status queue for smooth step-by-step progression
        const statusQueue: StatusQueue = new StatusQueue(dispatch);

        // Create a placeholder AI message and add it to the store immediately so that
        // onComplete, onSuggestionsLoading, and onSuggestions can update it even if
        // they fire before the first token.
        const aiMessageId: string = `ai-${Date.now()}`;
        const aiPlaceholder: CopilotMessage = {
            content: "",
            id: aiMessageId,
            sender: "copilot",
            timestamp: Date.now(),
            type: "streaming"
        };

        dispatch(addCopilotMessage(aiPlaceholder));

        // Tracks whether the status queue has been cancelled and the message made visible.
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
            if (signal.aborted || tokenBatch.length === 0) return;
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

                return;
            }

            let errorContent: string = I18n.instance.t("console:common.copilot.errors.default");

            if (errorMsg.includes("Authentication required")) {
                errorContent = I18n.instance.t("console:common.copilot.errors.authRequired");
            } else if (errorMsg.includes("Request was cancelled")) {
                errorContent = I18n.instance.t("console:common.copilot.errors.requestCancelled");
            } else if (errorMsg.includes("Failed to fetch")) {
                errorContent = I18n.instance.t("console:common.copilot.errors.connectionFailed");
            } else if (errorMsg.includes("timed out")) {
                errorContent = I18n.instance.t("console:common.copilot.errors.timeout");
            }

            if (!aiMessageAdded) {
                // No tokens were streamed yet — reuse the placeholder so we don't leave
                // an orphaned empty bubble in the message list.
                dispatch(updateCopilotMessage({
                    content: errorContent,
                    id: aiMessageId,
                    suggestionsLoading: false,
                    type: "error"
                }));
            } else {
                // Partial content was already visible; append a separate error bubble.
                const errorMessage: CopilotMessage = {
                    content: errorContent,
                    id: `error-${Date.now()}`,
                    sender: "copilot",
                    timestamp: Date.now(),
                    type: "error"
                };

                dispatch(addCopilotMessage(errorMessage));
            }
        } finally {
            if (tokenFlushTimer !== null) {
                clearTimeout(tokenFlushTimer);
                tokenFlushTimer = null;
            }
            requestManager.completeRequest("chat", controller);
            dispatch(setCopilotPanelLoading(false));
            dispatch(setCopilotStatusMessage(null));
        }
    };
};
