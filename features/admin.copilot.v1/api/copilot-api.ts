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
        this.baseUrl = '';
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
        const accessToken = this.getAccessToken();
        const requestId = crypto.randomUUID();
        const correlationId = `corr-${Date.now()}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-request-id': requestId,
            'correlation-id': correlationId
        };

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return headers;
    }



    /**
     * Send a chat message to the copilot.
     */
    public async sendMessage(question: string, onStream?: StreamingCallback): Promise<CopilotChatResponse> {
        if (!question.trim()) {
            throw new Error('Question cannot be empty');
        }

        const accessToken = this.getAccessToken();
        if (!accessToken) {
            throw new Error('Authentication required. Please log in to continue.');
        }

        // Create new abort controller for this request
        this.abortController = new AbortController();

        const payload: CopilotChatRequest = {
            question: question.trim()
        };

        const headers = this.generateHeaders();

        try {
            const response = await fetch(`${this.baseUrl}/chat`, {
                method: HttpMethods.POST,
                headers,
                body: JSON.stringify(payload),
                signal: this.abortController.signal
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData: any = {};
                try {
                    errorData = JSON.parse(errorText);
                } catch (parseError) {
                    // Ignore parse error
                }
                throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: Failed to send message`);
            }

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
                return this.handleStreamingResponse(response, onStream);
            }

            const responseText = await response.text();
            let result: CopilotChatResponse;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error(`Invalid JSON response from server: ${parseError.message}`);
            }

            return result;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error('Request was cancelled');
            }
            throw error;
        }
    }

    /**
     * Handle streaming response from the server.
     */
    private async handleStreamingResponse(response: Response, onStream?: StreamingCallback): Promise<CopilotChatResponse> {
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Response body is not readable');
        }

        const decoder = new TextDecoder();
        let fullAnswer = '';
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode the chunk and add to buffer
                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Process complete lines
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) continue;

                    try {
                        const parsed: CopilotStreamChunk = JSON.parse(trimmedLine);
                        if (parsed.type === 'STREAM' && parsed.content) {
                            fullAnswer += parsed.content;
                            if (onStream) {
                                onStream(parsed);
                            }
                        }
                    } catch (parseError) {
                        // Ignore parse errors for malformed chunks
                    }
                }
            }

            if (buffer.trim()) {
                try {
                    const parsed: CopilotStreamChunk = JSON.parse(buffer.trim());
                    if (parsed.type === 'STREAM' && parsed.content) {
                        fullAnswer += parsed.content;
                        if (onStream) {
                            onStream(parsed);
                        }
                    }
                } catch (parseError) {
                    // Ignore parse errors for final buffer
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
        const accessToken = this.getAccessToken();
        if (!accessToken) {
            throw new Error('Authentication required. Please log in to continue.');
        }

        const headers = this.generateHeaders();

        try {
            const response = await fetch(`${this.baseUrl}/clear`, {
                method: HttpMethods.POST,
                headers
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData: any = {};
                try {
                    errorData = JSON.parse(errorText);
                } catch (parseError) {
                    // Ignore parse error
                }
                throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: Failed to clear chat`);
            }

            const responseText = await response.text();
            let result: CopilotClearResponse;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error(`Invalid JSON response from server: ${parseError.message}`);
            }

            return result;
        } catch (error: any) {
            throw error;
        }
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
export const copilotApiService = CopilotApiService.getInstance();
