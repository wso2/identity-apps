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
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Safely parse JSON string, returning empty object if parsing fails.
 */
const safeParse = (str: string) => {
    try {
        return JSON.parse(str);
    } catch {
        return {};
    }
};

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
 * Interface for streaming chat chunk.
 */
export interface CopilotStreamChunk {
    type: string;
    content: string;
}

/**
 * Type for streaming callback function.
 */
export type StreamingCallback = (chunk: CopilotStreamChunk) => void;

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
    summary: string;
}

/**
 * Interface for history response.
 */
export interface CopilotHistoryResponse {
    history: {
        question: string;
        answer: string;
    }[];
    summary: string;
}

// Local development URL (copilot runs on port 8443, separate from identity server on 9443)
const COPILOT_BASE_URL: string = "http://localhost:8443/t/carbon.super/api/server/v1/copilot";

// Production URL
// const COPILOT_BASE_URL: string = `${store.getState().config.deployment.serverHost}/t/${
//     store.getState().config.deployment.tenant
// }/api/server/v1/copilot`;

/**
 * Send a chat message to the copilot.
 * Uses AsgardeoSPAClient.httpRequest for automatic token handling.
 *
 * @param question - The user's question.
 * @param onStream - Optional callback for streaming responses.
 * @returns The chat response.
 */
export const sendCopilotChatMessage = async (
    question: string,
    onStream?: StreamingCallback
): Promise<CopilotChatResponse> => {
    if (!question.trim()) {
        throw new Error("Question cannot be empty");
    }

    const requestId: string = crypto.randomUUID();
    const correlationId: string = `corr-${Date.now()}`;

    const requestConfig: AxiosRequestConfig = {
        data: {
            question: question.trim()
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "correlation-id": correlationId,
            "x-request-id": requestId
        },
        method: HttpMethods.POST,
        url: `${COPILOT_BASE_URL}/chat`
    };

    console.log("[CopilotAPI] Sending message via httpClient...");

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: Failed to send message`);
            }

            // Process the response data (may be streaming format as text)
            return processStreamingResponse(response.data, onStream);
        })
        .catch((error: AxiosError) => {
            console.error("[CopilotAPI] Error sending message:", error);
            const errorData: any = error?.response?.data || {};

            throw new Error(
                errorData.detail || errorData.message || error.message || "Failed to send message"
            );
        });
};

/**
 * Process streaming response data.
 * The axios httpClient receives the complete response, which we parse line-by-line
 * to extract streaming chunks and invoke the callback.
 *
 * @param data - The response data (string or object).
 * @param onStream - Optional callback for streaming chunks.
 * @returns The assembled chat response.
 */
const processStreamingResponse = (data: any, onStream?: StreamingCallback): CopilotChatResponse => {
    let fullAnswer: string = "";

    // If data is already a parsed object with an answer, use it directly
    if (typeof data === "object" && data !== null) {
        if (data.answer) {
            return {
                answer: data.answer,
                conversationId: data.conversationId,
                messageId: data.messageId
            };
        }
    }

    // If data is a string, parse line-by-line for streaming chunks
    if (typeof data === "string") {
        const lines: string[] = data.split("\n");

        for (const line of lines) {
            const trimmedLine: string = line.trim();

            if (!trimmedLine) continue;

            const parsed: CopilotStreamChunk = safeParse(trimmedLine) as CopilotStreamChunk;

            if (parsed && parsed.type === "STREAM" && parsed.content) {
                fullAnswer += parsed.content;
                if (onStream) {
                    onStream(parsed);
                }
            } else if (parsed && parsed.type === "STREAM_END") {
                break;
            }
        }
    }

    return {
        answer: fullAnswer || (typeof data === "string" ? data : ""),
        conversationId: undefined,
        messageId: undefined
    };
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
 * Get the chat history for the user.
 * Uses AsgardeoSPAClient.httpRequest for automatic token handling.
 *
 * @returns The chat history.
 */
export const getCopilotChatHistory = async (): Promise<CopilotHistoryResponse> => {
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
        url: `${COPILOT_BASE_URL}/history`
    };

    console.log("[CopilotAPI] Fetching chat history...");

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
