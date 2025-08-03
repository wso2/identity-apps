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

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Box from "@oxygen-ui/react/Box";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import IconButton from "@oxygen-ui/react/IconButton";
import Paper from "@oxygen-ui/react/Paper";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Markdown } from "@wso2is/react-components";
import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { useCopilotPanel } from "../hooks";
import "./copilot-chat.scss";
import { CopilotMessage } from "../store/types";

/**
 * Props interface for the CopilotChat component.
 */
export interface CopilotChatProps extends IdentifiableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
}

/**
 * Chat component for the copilot panel.
 *
 * @param props - Props injected to the component.
 * @returns Copilot chat component.
 */
const CopilotChat: React.FunctionComponent<CopilotChatProps> = (
    props: CopilotChatProps
): ReactElement => {
    const {
        className,
        ["data-componentid"]: componentId = "copilot-chat"
    } = props;

    const {
        messages,
        isLoading,
        sendMessage
    } = useCopilotPanel();

    const [inputValue, setInputValue] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Scroll to bottom of messages.
     */
    const scrollToBottom = useCallback((smooth: boolean = false) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: smooth ? "smooth" : "auto",
                block: "end"
            });
        }
    }, []);

    /**
     * Handle input change.
     */
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }, []);

    /**
     * Handle send message.
     */
    const handleSendMessage = useCallback(() => {
        if (inputValue.trim() && !isLoading) {
            sendMessage(inputValue.trim());
            setInputValue("");
            // Smooth scroll when user sends a message
            setTimeout(() => scrollToBottom(true), 100);
        }
    }, [inputValue, isLoading, sendMessage, scrollToBottom]);

    /**
     * Handle key down in input.
     */
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    /**
     * Throttled scroll to bottom during streaming to prevent shaking.
     */
    const throttledScrollToBottom = useCallback(() => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
            scrollToBottom(false);
        }, 16); // ~60fps throttling
    }, [scrollToBottom]);

    /**
     * Scroll to bottom when messages change - use throttled scroll during streaming.
     */
    useEffect(() => {
        throttledScrollToBottom();
    }, [messages, throttledScrollToBottom]);

    /**
     * Cleanup timeout on unmount.
     */
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    /**
     * Render a single message.
     */
    const renderMessage = (message: CopilotMessage): ReactElement => {
        const isUser = message.sender === "user";
        const isError = message.type === "error";

        if (isUser) {
            // User message - orange bubble on the right
            return (
                <Box
                    key={message.id}
                    className="copilot-message user-message"
                    data-componentid={`${componentId}-message-${message.id}`}
                >
                    <Box className="copilot-message-content">
                        <Typography variant="caption" className="copilot-message-time">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Typography>
                        <Paper elevation={0} className="copilot-message-bubble">
                            {message.content}
                        </Paper>
                    </Box>
                </Box>
            );
        } else {
            // Copilot message - gray bubble on the left
            return (
                <Box
                    key={message.id}
                    className="copilot-message bot-message"
                    data-componentid={`${componentId}-message-${message.id}`}
                >
                    <Box className="copilot-message-content">
                        <Box className="copilot-message-header">
                            <Typography variant="caption" className="copilot-message-sender">
                                Copilot
                            </Typography>
                            <Typography variant="caption" className="copilot-message-time">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                        </Box>
                        <Paper
                            elevation={0}
                            className={`copilot-message-bubble ${isError ? 'error-message' : ''}`}
                        >
                            <Markdown source={message.content} />
                        </Paper>
                    </Box>
                </Box>
            );
        }
    };

    return (
        <Box
            className={`copilot-chat ${className || ""}`}
            data-componentid={componentId}

        >
            {/* Messages Area */}
            <Box className="copilot-chat-messages">
                {messages.length === 0 ? (
                    <Box className="copilot-empty-state">
                        <Typography variant="body2" className="copilot-empty-text">
                            Start a conversation...
                        </Typography>
                    </Box>
                ) : (
                    messages.map(renderMessage)
                )}

                {/* Loading indicator */}
                {isLoading && (
                    <Box
                        className="copilot-message loading-message"
                        data-componentid={`${componentId}-loading`}
                    >
                        <Box className="copilot-message-content">
                            <Box className="copilot-message-header">
                                <Typography variant="caption" className="copilot-message-sender">
                                    Copilot
                                </Typography>
                            </Box>
                            <Paper elevation={0} className="copilot-message-bubble">
                                <Box className="copilot-loading-content">
                                    <CircularProgress size={16} className="copilot-loading-spinner" />
                                    <Typography variant="body2" className="copilot-loading-text">
                                        Thinking...
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Box>
            {/* Input Area */}
            <Box className="copilot-input-container">
                <Box className="copilot-input-wrapper">
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder="Enter your message here..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        data-componentid={`${componentId}-input`}
                        className="copilot-input-field"
                    />

                    {/* Send Button */}
                    <IconButton
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        data-componentid={`${componentId}-send-button`}
                        className="copilot-send-button"
                    >
                        <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Footer */}
                <Typography variant="caption" className="copilot-disclaimer">
                    Use Copilot mindfully as AI can make mistakes.
                </Typography>
            </Box>
        </Box>
    );
};

export default CopilotChat;
