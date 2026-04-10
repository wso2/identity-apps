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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Get an axios instance with automatic token handling.
 * Used for non-streaming requests (history, clear).
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Interface for chat message request.
 */
export interface CopilotChatRequest {
    question: string;
}

/**
 * Interface for chat message response.
 */
export interface CopilotChatResponse {
    answer: string;
    conversationId?: string;
    messageId?: string;
}

/**
 * Server-Sent Events (SSE) event types from the backend.
 */
export type SSEEventType = "STATUS" | "STREAM" | "STREAM_END" | "ERROR" | "SUGGESTIONS_LOADING" | "SUGGESTIONS";

/**
 * Interface for a parsed Server-Sent Events (SSE) event from the backend.
 */
export interface SSEEvent {
    type: SSEEventType;
    content?: string | string[]; // Can be string for token, or array of strings for suggestions.
    message?: string;
}

/**
 * Callbacks for Server-Sent Events (SSE) streaming.
 */
export interface StreamCallbacks {
    /** Called when a STATUS event is received (e.g., "Searching docs...") */
    onStatus?: (step: string) => void;
    /** Called for each STREAM token (the answer typing out) */
    onToken?: (content: string) => void;
    /** Called when the stream completes */
    onComplete?: () => void;
    /** Called when an error occurs */
    onError?: (error: string) => void;
    /** Called when the backend starts generating follow-up suggestions (show skeletons) */
    onSuggestionsLoading?: () => void;
    /** Called when follow-up suggestions are generated */
    onSuggestions?: (suggestions: string[]) => void;
}

/**
 * Interface for clear chat response.
 */
export interface CopilotClearResponse {
    success: boolean;
    message?: string;
}

/**
 * Interface for API error response.
 */
export interface CopilotApiError {
    error: string;
    detail?: string;
    status?: number;
}

/**
 * Interface for history response.
 */
export interface CopilotHistoryResponse {
    history: {
        question: string;
        answer: string;
    }[];
    /** Total number of history records stored for the user. */
    total: number;
    /** Maximum records requested per page. */
    limit: number;
    /** Reverse offset applied — most-recent records skipped before this page. */
    offset: number;
    /** True when there are older records beyond this page. */
    has_more: boolean;
}

/**
 * Get the Copilot base URL from Redux config.
 * Dynamically resolves the endpoint on each request.
 *
 * @returns The Copilot API base URL.
 */
const getCopilotBaseUrl = (): string => {
    const state: AppState = store.getState();

    return state.config.endpoints.copilot;
};

/**
 * Parse formal Server-Sent Events (SSE) chunks into events.
 * Handles partial events by accumulating a buffer across calls.
 */
const parseSSEChunk = (chunk: string, buffer: string): { events: SSEEvent[]; remaining: string } => {
    // Normalize line endings: convert all \r\n to \n.
    const normalized: string = (buffer + chunk).replace(/\r\n/g, "\n");
    const events: SSEEvent[] = [];

    // Events are separated by double newlines (\n\n or \r\n\r\n after normalization).
    const parts: string[] = normalized.split("\n\n");

    // Last part may be an incomplete event - keep as buffer.
    const remaining: string = parts.pop() || "";

    for (const part of parts) {
        // Collect all "data: ..." or "data:..." lines within this event block.
        const dataLines: string[] = part
            .split("\n")
            .map((line: string) => line.trim())
            .filter((line: string) => line.startsWith("data:"))
            .map((line: string) => {
                // Strip "data:" prefix (with or without space).
                const colonIndex: number = line.indexOf(":");

                return line.slice(colonIndex + 1).trim();
            });

        if (dataLines.length === 0) continue;

        const jsonStr: string = dataLines.join("");

        try {
            const parsed: SSEEvent = JSON.parse(jsonStr);

            events.push(parsed);
        } catch (e) {
            // Silently skip malformed Server-Sent Events (SSE) events.
        }
    }

    return { events, remaining };
};

/**
 * Send a chat message using Server-Sent Events (SSE) streaming.
 * Uses AsgardeoSPAClient.httpStreamRequest — token injection and web worker
 * transport are handled automatically by the SDK.
 *
 * @param question - The user's question.
 * @param callbacks - Callbacks for status, token, complete, and error events.
 * @param signal - Optional AbortSignal for cancellation.
 * @returns The complete answer string.
 */
export const sendCopilotChatMessage = async (
    question: string,
    callbacks?: StreamCallbacks,
    signal?: AbortSignal
): Promise<CopilotChatResponse> => {
    if (!question.trim()) {
        throw new Error("Question cannot be empty");
    }

    const correlationId: string = `corr-${Date.now()}`;
    const requestId: string = crypto.randomUUID();

    if (signal?.aborted) {
        throw new Error("Request was aborted before streaming began.");
    }

    const spaClient: AsgardeoSPAClient = AsgardeoSPAClient.getInstance();

    const stream: ReadableStream<Uint8Array> | undefined =
        await spaClient.httpStreamRequest({
            data: { question: question.trim() },
            headers: {
                "Accept": "text/event-stream",
                "Content-Type": "application/json",
                "correlation-id": correlationId,
                "x-request-id": requestId
            },
            method: "POST",
            url: `${getCopilotBaseUrl()}/chat`
        });

    if (!stream) {
        throw new Error("No stream returned — httpStreamRequest requires WebWorker storage.");
    }

    const reader: ReadableStreamDefaultReader<Uint8Array> = stream.getReader();
    const decoder: TextDecoder = new TextDecoder();
    let fullAnswer: string = "";
    let sseBuffer: string = "";
    let aborted: boolean = false;

    // Abort-signal wiring: cancel the reader and set aborted flag if signal fires.
    const abortHandler = (): void => {
        aborted = true;
        reader.cancel();
    };

    signal?.addEventListener("abort", abortHandler);

    try {
        let streamDone: boolean = false;

        while (!streamDone) {
            const { done, value }: ReadableStreamReadResult<Uint8Array> = await reader.read();

            if (done) {
                // Flush any bytes buffered inside the TextDecoder and any
                // remaining SSE data that lacked a trailing blank line.
                const finalChunk: string = decoder.decode();

                if (finalChunk || sseBuffer) {
                    const { events: finalEvents } = parseSSEChunk(`${finalChunk}\n\n`, sseBuffer);

                    sseBuffer = "";

                    for (const event of finalEvents) {
                        switch (event.type) {
                            case "STATUS":
                                if (callbacks?.onStatus && event.content && typeof event.content === "string") {
                                    callbacks.onStatus(event.content);
                                }

                                break;

                            case "STREAM":
                                if (event.content && typeof event.content === "string") {
                                    fullAnswer += event.content;
                                    if (callbacks?.onToken) {
                                        callbacks.onToken(event.content);
                                    }
                                }

                                break;

                            case "STREAM_END":
                                if (callbacks?.onComplete) {
                                    callbacks.onComplete();
                                }

                                break;

                            case "SUGGESTIONS_LOADING":
                                if (callbacks?.onSuggestionsLoading) {
                                    callbacks.onSuggestionsLoading();
                                }

                                break;

                            case "SUGGESTIONS":
                                if (callbacks?.onSuggestions && event.content && Array.isArray(event.content)) {
                                    callbacks.onSuggestions(
                                        event.content.map((s: string) => s.replace(/^["']|["']$/g, ""))
                                    );
                                }

                                break;

                            case "ERROR":
                                if (callbacks?.onError) {
                                    callbacks.onError(event.message || "Unknown server error");
                                }

                                throw new Error(event.message || "Server error during chat processing");

                            default:
                                break;
                        }
                    }
                }

                streamDone = true;

                continue;
            }

            const chunk: string = decoder.decode(value, { stream: true });
            const { events, remaining } = parseSSEChunk(chunk, sseBuffer);

            sseBuffer = remaining;

            for (const event of events) {
                switch (event.type) {
                    case "STATUS":
                        if (callbacks?.onStatus && event.content && typeof event.content === "string") {
                            callbacks.onStatus(event.content);
                        }

                        break;

                    case "STREAM":
                        if (event.content && typeof event.content === "string") {
                            fullAnswer += event.content;
                            if (callbacks?.onToken) {
                                callbacks.onToken(event.content);
                            }
                        }

                        break;

                    case "STREAM_END":
                        if (callbacks?.onComplete) {
                            callbacks.onComplete();
                        }

                        break;

                    case "SUGGESTIONS_LOADING":
                        if (callbacks?.onSuggestionsLoading) {
                            callbacks.onSuggestionsLoading();
                        }

                        break;

                    case "SUGGESTIONS":
                        if (callbacks?.onSuggestions && event.content && Array.isArray(event.content)) {
                            callbacks.onSuggestions(
                                event.content.map((s: string) => s.replace(/^["']|["']$/g, ""))
                            );
                        }

                        break;

                    case "ERROR":
                        if (callbacks?.onError) {
                            callbacks.onError(event.message || "Unknown server error");
                        }

                        throw new Error(event.message || "Server error during chat processing");

                    default:
                        break;
                }
            }
        }
    } finally {
        signal?.removeEventListener("abort", abortHandler);
        reader.releaseLock();
    }

    // Check if the stream was aborted.
    if (aborted) {
        const abortMessage: string = "Chat request was aborted";

        if (callbacks?.onError) {
            callbacks.onError(abortMessage);
        }
        throw new Error(abortMessage);
    }

    return { answer: fullAnswer };
};

/**
 * Clear the chat conversation.
 * Uses AsgardeoSPAClient.httpRequest for automatic token handling.
 *
 * @returns The clear response.
 */
export const clearCopilotChatApi = async (): Promise<CopilotClearResponse> => {
    const requestId: string = crypto.randomUUID();
    const correlationId: string = `corr-${Date.now()}`;

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "correlation-id": correlationId,
            "x-request-id": requestId
        },
        method: HttpMethods.POST,
        url: `${getCopilotBaseUrl()}/clear`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: Failed to clear chat`);
            }

            const result: CopilotClearResponse = response.data;

            if (!result || typeof result !== "object") {
                throw new Error("Invalid JSON response from server");
            }

            return result;
        })
        .catch((error: AxiosError) => {
            const errorData: Record<string, unknown> = (error?.response?.data as Record<string, unknown>) || {};

            throw new Error(
                (errorData.detail as string) || (errorData.message as string) || error.message || "Failed to clear chat"
            );
        });
};

/**
 * Get a page of the chat history for the user.
 * Uses AsgardeoSPAClient.httpRequest for automatic token handling.
 *
 * History uses reverse-offset pagination: `offset=0` returns the most-recent
 * `limit` records; incrementing `offset` by `limit` loads older pages.
 *
 * @param limit  - Maximum records to return (1–50, default 10).
 * @param offset - Most-recent records to skip (default 0).
 * @returns The paginated chat history.
 */
export const getCopilotChatHistory = async (
    offset: number = 0,
    limit: number = 10,
    signal?: AbortSignal
): Promise<CopilotHistoryResponse> => {
    if (offset < 0) {
        throw new Error("Offset cannot be negative");
    }

    if (limit < 1 || limit > 50) {
        throw new Error("Limit must be between 1 and 50");
    }

    const requestId: string = crypto.randomUUID();
    const correlationId: string = `corr-${Date.now()}`;

    const params: { limit: number; offset: number } = { limit, offset };

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "correlation-id": correlationId,
            "x-request-id": requestId
        },
        method: HttpMethods.GET,
        params,
        signal,
        url: `${getCopilotBaseUrl()}/history`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: Failed to fetch history`);
            }

            return response.data;
        })
        .catch((error: AxiosError) => {
            const errorData: Record<string, unknown> = (error?.response?.data as Record<string, unknown>) || {};

            throw new Error(
                (errorData.detail as string) ||
                    (errorData.message as string) ||
                    error.message ||
                    "Failed to fetch history"
            );
        });
};
