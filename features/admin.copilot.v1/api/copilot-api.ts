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

import { HttpMethods } from "@wso2is/core/models";

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
 * Copilot API service class.
 */
export class CopilotApiService {
    private static instance: CopilotApiService;
    private baseUrl: string;
    private accessToken: string | null = null;
    private abortController: AbortController | null = null;

    private constructor() {
        // TODO: Get the base URL from config
        // Example: this.baseUrl = 'https://<host>:<port>/t/<tenant>/api/server/v1/copilot'
        this.baseUrl = "";
    }

    /**
     * Get singleton instance of CopilotApiService.
     */
    public static getInstance(): CopilotApiService {
        if (!CopilotApiService.instance) {
            CopilotApiService.instance = new CopilotApiService();
        }

        return CopilotApiService.instance;
    }

    /**
     * Set access token for API requests.
     */
    public setAccessToken(accessToken: string | null): void {
        this.accessToken = accessToken;
    }

    /**
     * Get current access token.
     */
    private getAccessToken(): string | null {
        return this.accessToken;
    }

    /**
     * Generate request headers.
     */
    private generateHeaders(): Record<string, string> {
        const accessToken: string | null = this.getAccessToken();
        const requestId: string = crypto.randomUUID();
        const correlationId: string = `corr-${Date.now()}`;

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "correlation-id": correlationId,
            "x-request-id": requestId
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return headers;
    }



    /**
     * Send a chat message to the copilot.
     */
    public async sendMessage(question: string, onStream?: StreamingCallback): Promise<CopilotChatResponse> {
        if (!question.trim()) {
            throw new Error("Question cannot be empty");
        }

        const accessToken: string | null = this.getAccessToken();

        if (!accessToken) {
            throw new Error("Authentication required. Please log in to continue.");
        }

        // Create new abort controller for this request
        this.abortController = new AbortController();

        const payload: CopilotChatRequest = {
            question: question.trim()
        };

        const headers: Record<string, string> = this.generateHeaders();

        try {
            const response: Response = await fetch(`${this.baseUrl}/chat`, {
                body: JSON.stringify(payload),
                headers,
                method: HttpMethods.POST,
                signal: this.abortController.signal
            });

            if (!response.ok) {
                const errorText: string = await response.text();
                const errorData: any = safeParse(errorText);

                throw new Error(errorData.detail || errorData.message ||
                    `HTTP ${response.status}: Failed to send message`);
            }

            const contentType: string = response.headers.get("content-type") || "";

            if (contentType.includes("text/event-stream") || contentType.includes("text/plain")) {
                return this.handleStreamingResponse(response, onStream);
            }

            const responseText: string = await response.text();
            const result: CopilotChatResponse = safeParse(responseText) as CopilotChatResponse;

            if (!result || typeof result !== "object") {
                throw new Error("Invalid JSON response from server");
            }

            return result;
        } catch (error: any) {
            if (error.name === "AbortError") {
                throw new Error("Request was cancelled");
            }
            throw error;
        }
    }

    /**
     * Handle streaming response from the server.
     */
    private async handleStreamingResponse(
        response: Response,
        onStream?: StreamingCallback
    ): Promise<CopilotChatResponse> {
        const reader: ReadableStreamDefaultReader<Uint8Array> | undefined = response.body?.getReader();

        if (!reader) {
            throw new Error("Response body is not readable");
        }

        const decoder: TextDecoder = new TextDecoder();
        let fullAnswer: string = "";
        let buffer: string = "";

        try {
            let done: boolean = false;

            while (!done) {
                const result: ReadableStreamReadResult<Uint8Array> = await reader.read();

                done = result.done;
                if (done) break;

                // Decode the chunk and add to buffer
                const chunk: string = decoder.decode(result.value, { stream: true });

                buffer += chunk;

                // Process complete lines
                const lines: string[] = buffer.split("\n");

                buffer = lines.pop() || ""; // Keep incomplete line in buffer

                for (const line of lines) {
                    const trimmedLine: string = line.trim();

                    if (!trimmedLine) continue;

                    const parsed: CopilotStreamChunk = safeParse(trimmedLine) as CopilotStreamChunk;

                    if (parsed && parsed.type === "STREAM" && parsed.content) {
                        fullAnswer += parsed.content;
                        if (onStream) {
                            onStream(parsed);
                        }
                    }
                }
            }

            if (buffer.trim()) {
                const parsed: CopilotStreamChunk = safeParse(buffer.trim()) as CopilotStreamChunk;

                if (parsed && parsed.type === "STREAM" && parsed.content) {
                    fullAnswer += parsed.content;
                    if (onStream) {
                        onStream(parsed);
                    }
                }
            }

            return {
                answer: fullAnswer,
                conversationId: undefined,
                messageId: undefined
            };
        } finally {
            reader.releaseLock();
        }
    }

    /**
     * Clear the chat conversation.
     */
    public async clearChat(): Promise<CopilotClearResponse> {
        const accessToken: string | null = this.getAccessToken();

        if (!accessToken) {
            throw new Error("Authentication required. Please log in to continue.");
        }

        const headers: Record<string, string> = this.generateHeaders();

        const response: Response = await fetch(`${this.baseUrl}/clear`, {
            headers,
            method: HttpMethods.POST
        });

        if (!response.ok) {
            const errorText: string = await response.text();
            const errorData: any = safeParse(errorText);

            throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: Failed to clear chat`);
        }

        const responseText: string = await response.text();
        const result: CopilotClearResponse = safeParse(responseText) as CopilotClearResponse;

        if (!result || typeof result !== "object") {
            throw new Error("Invalid JSON response from server");
        }

        return result;
    }

    /**
     * Abort the current request.
     */
    public abortCurrentRequest(): void {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    /**
     * Check if there's an active request.
     */
    public hasActiveRequest(): boolean {
        return this.abortController !== null;
    }
}

// Export singleton instance
export const copilotApiService: CopilotApiService = CopilotApiService.getInstance();
