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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Get an axios instance with automatic token handling.
 * Used for non-streaming requests (history, clear).
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Get a streaming request function with automatic token handling.
 * Used for streaming requests (chat).
 */
const httpStreamClient = (AsgardeoSPAClient.getInstance() as any).httpStreamRequest.bind(
    AsgardeoSPAClient.getInstance()
);

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
 * SSE event types from the backend.
 */
export type SSEEventType = "STATUS" | "STREAM" | "STREAM_END" | "ERROR";

/**
 * Interface for a parsed SSE event from the backend.
 */
export interface SSEEvent {
    type: SSEEventType;
    content?: string;
    message?: string;
}

/**
 * Callbacks for SSE streaming.
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

// Local development URL (copilot runs on port 8443, separate from identity server on 9443)
//const COPILOT_BASE_URL: string = "http://localhost:8443/t/carbon.super/api/server/v1/copilot";

// Production URL
const COPILOT_BASE_URL: string = `${store.getState().config.deployment.serverHost}/t/${
     store.getState().config.deployment.tenant
}/api/server/v1/copilot`;

/**
 * Parse formal SSE chunks into events.
 * Handles partial events by accumulating a buffer across calls.
 */
const parseSSEChunk = (chunk: string, buffer: string): { events: SSEEvent[]; remaining: string } => {
    const combined: string = buffer + chunk;
    const events: SSEEvent[] = [];

    // Events are separated by double newlines (\n\n)
    const parts: string[] = combined.split("\n\n");

    // Last part may be an incomplete event — keep as buffer
    const remaining: string = parts.pop() || "";

    for (const part of parts) {
        // Collect all "data: ..." lines within this event block
        const dataLines: string[] = part
            .split("\n")
            .filter((line: string) => line.startsWith("data: "))
            .map((line: string) => line.slice(6)); // strip "data: " prefix

        if (dataLines.length === 0) continue;

        const jsonStr: string = dataLines.join("");

        try {
            const parsed: SSEEvent = JSON.parse(jsonStr);

            events.push(parsed);
        } catch (e) {
            console.warn("[CopilotAPI] Failed to parse SSE event:", jsonStr);
        }
    }

    return { events, remaining };
};

/**
 * Send a chat message using SSE streaming.
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

    console.log("[CopilotAPI] Starting SSE stream for chat via httpStreamRequest...");

    const stream: ReadableStream<Uint8Array> | undefined =
        await (AsgardeoSPAClient.getInstance() as any).httpStreamRequest({
            data: { question: question.trim() },
            headers: {
                "Accept": "text/event-stream",
                "Content-Type": "application/json",
                "correlation-id": correlationId,
                "x-request-id": requestId
            },
            method: "POST",
            url: `${COPILOT_BASE_URL}/chat`
        });

    if (!stream) {
        throw new Error("No stream returned — httpStreamRequest requires WebWorker storage.");
    }

    if (signal?.aborted) {
        throw new Error("Request was aborted before streaming began.");
    }

    const reader: ReadableStreamDefaultReader<Uint8Array> = stream.getReader();
    const decoder: TextDecoder = new TextDecoder();
    let fullAnswer: string = "";
    let sseBuffer: string = "";

    // Abort-signal wiring: cancel the reader if signal fires
    const abortHandler = (): void => { reader.cancel(); };

    signal?.addEventListener("abort", abortHandler);

    try {
        while (true) {
            const { done, value }: ReadableStreamReadResult<Uint8Array> = await reader.read();

            if (done) break;

            const chunk: string = decoder.decode(value, { stream: true });
            const { events, remaining } = parseSSEChunk(chunk, sseBuffer);

            sseBuffer = remaining;

            for (const event of events) {
                switch (event.type) {
                    case "STATUS":
                        if (callbacks?.onStatus && event.content) {
                            callbacks.onStatus(event.content);
                        }
                        break;

                    case "STREAM":
                        if (event.content) {
                            fullAnswer += event.content;
                            if (callbacks?.onToken) {
                                callbacks.onToken(event.content);
                            }
                        }
                        break;

                    case "STREAM_END":
                        console.log("[CopilotAPI] Stream completed, total answer:", fullAnswer.length, "chars");
                        if (callbacks?.onComplete) {
                            callbacks.onComplete();
                        }
                        break;

                    case "ERROR":
                        console.error("[CopilotAPI] Server error:", event.message);
                        if (callbacks?.onError) {
                            callbacks.onError(event.message || "Unknown server error");
                        }

                        throw new Error(event.message || "Server error during chat processing");

                    default:
                        console.warn("[CopilotAPI] Unknown event type:", event.type);
                }
            }
        }
    } finally {
        signal?.removeEventListener("abort", abortHandler);
        reader.releaseLock();
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
        url: `${COPILOT_BASE_URL}/clear`
    };

    console.log("[CopilotAPI] Clearing chat...");

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
            console.error("[CopilotAPI] Error clearing chat:", error);
            const errorData: any = error?.response?.data || {};

            throw new Error(
                errorData.detail || errorData.message || error.message || "Failed to clear chat"
            );
        });
};

/**
 * Get a page of the chat history for the user.
 * Uses AsgardeoSPAClient.httpRequest for automatic token handling.
 *
 * History uses reverse-offset pagination: ``offset=0`` returns the most-recent
 * ``limit`` records; incrementing ``offset`` by ``limit`` loads older pages.
 *
 * @param limit  - Maximum records to return (1–50, default 10).
 * @param offset - Most-recent records to skip (default 0).
 * @returns The paginated chat history.
 */
export const getCopilotChatHistory = async (
    limit: number = 10,
    offset: number = 0
): Promise<CopilotHistoryResponse> => {
    const requestId: string = crypto.randomUUID();
    const correlationId: string = `corr-${Date.now()}`;

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "correlation-id": correlationId,
            "x-request-id": requestId
        },
        method: HttpMethods.GET,
        params: { limit, offset },
        url: `${COPILOT_BASE_URL}/history`
    };

    console.log(`[CopilotAPI] Fetching chat history (limit=${limit}, offset=${offset})...`);

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: Failed to fetch history`);
            }

            return response.data;
        })
        .catch((error: AxiosError) => {
            console.error("[CopilotAPI] Error fetching history:", error);
            const errorData: any = error?.response?.data || {};

            throw new Error(
                errorData.detail || errorData.message || error.message || "Failed to fetch history"
            );
        });
};
