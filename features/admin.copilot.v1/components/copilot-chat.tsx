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
import HistoryIcon from "@mui/icons-material/History";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import IconButton from "@oxygen-ui/react/IconButton";
import Paper from "@oxygen-ui/react/Paper";
import Skeleton from "@oxygen-ui/react/Skeleton";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Markdown } from "@wso2is/react-components";
import React, {
    Component, ReactElement, ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState
} from "react";
import AISparkleIcon from "./ai-sparkle-icon";
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
 * Error boundary that catches rendering errors inside a single chat message.
 * Prevents a malformed message from crashing the entire chat list.
 */
class MessageErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): { hasError: boolean } {
        return { hasError: true };
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <Typography variant="body2" className="copilot-message-error">
                    This message could not be displayed.
                </Typography>
            );
        }

        return this.props.children;
    }
}

/**
 * Normalize partial markdown while a message is still streaming.
 * This helps completed markdown segments render with styles before
 * the full answer arrives.
 *
 * @param content - Partial markdown content.
 * @returns Markdown content with temporary closing delimiters.
 */
const normalizeStreamingMarkdown = (content: string): string => {
    if (!content) {
        return content;
    }

    let normalizedContent: string = content;
    const fencedCodeBlockCount: number = normalizedContent.match(/```/g)?.length ?? 0;

    if (fencedCodeBlockCount % 2 === 1) {
        normalizedContent = `${normalizedContent}\n\n\`\`\``;
    }

    const contentWithoutFencedBlocks: string = normalizedContent.replace(/```[\s\S]*?```/g, "");
    const inlineCodeCount: number = contentWithoutFencedBlocks.match(/`/g)?.length ?? 0;

    if (inlineCodeCount % 2 === 1) {
        normalizedContent = `${normalizedContent}\``;
    }

    const boldAsteriskCount: number = normalizedContent.match(/\*\*/g)?.length ?? 0;

    if (boldAsteriskCount % 2 === 1) {
        normalizedContent = `${normalizedContent}**`;
    }

    const boldUnderscoreCount: number = normalizedContent.match(/__/g)?.length ?? 0;

    if (boldUnderscoreCount % 2 === 1) {
        normalizedContent = `${normalizedContent}__`;
    }

    if (/\[[^\]]*\]\([^)]*$/.test(normalizedContent)) {
        normalizedContent = `${normalizedContent})`;
    }

    return normalizedContent;
};

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
        sendMessage,
        statusMessage,
        hasMoreHistory,
        isLoadingMoreHistory,
        loadMoreHistory
    } = useCopilotPanel();

    const [ inputValue, setInputValue ] = useState<string>("");
    const messagesEndRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const messagesContainerRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null);
    /** Stores the scrollHeight snapshot taken just before a prepend so we can restore position. */
    const prevScrollHeightRef: React.MutableRefObject<number | null> = useRef<number | null>(null);
    /** When true the next messages-change effect skips the scroll-to-bottom. */
    const suppressScrollRef: React.MutableRefObject<boolean> = useRef<boolean>(false);

    /**
     * Scroll to bottom of messages.
     */
    const scrollToBottom: (smooth?: boolean) => void = useCallback((smooth: boolean = false) => {
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
    const handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(event.target.value);
        }, []);

    /**
     * Handle send message.
     */
    const handleSendMessage: () => void = useCallback(() => {
        if (inputValue.trim() && !isLoading) {
            sendMessage(inputValue.trim());
            setInputValue("");
            // Smooth scroll when user sends a message
            setTimeout(() => scrollToBottom(true), 100);
        }
    }, [ inputValue, isLoading, sendMessage, scrollToBottom ]);

    /**
     * Handle key down in input.
     */
    const handleKeyDown: (event: React.KeyboardEvent) => void = useCallback((event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    }, [ handleSendMessage ]);

    /**
     * Throttled scroll to bottom during streaming to prevent shaking.
     */
    const throttledScrollToBottom: () => void = useCallback(() => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
            scrollToBottom(false);
        }, 16); // ~60fps throttling
    }, [ scrollToBottom ]);

    /**
     * Scroll to bottom when messages change - suppressed when loading earlier messages.
     */
    useEffect(() => {
        if (suppressScrollRef.current) {
            suppressScrollRef.current = false;

            return;
        }
        throttledScrollToBottom();
    }, [ messages, throttledScrollToBottom ]);

    /**
     * Restore the scroll anchor after older messages are prepended.
     * useLayoutEffect fires synchronously after the DOM is updated but before the
     * browser paints, so the user never sees a scroll jump.
     */
    useLayoutEffect(() => {
        if (prevScrollHeightRef.current !== null && messagesContainerRef.current) {
            const scrollDiff: number =
                messagesContainerRef.current.scrollHeight - prevScrollHeightRef.current;

            messagesContainerRef.current.scrollTop += scrollDiff;
            prevScrollHeightRef.current = null;
        }
    }, [ messages.length ]);

    /**
     * Handle "Load earlier messages" click.
     * Captures the current scrollHeight so that useLayoutEffect can restore the
     * visual position once the prepended messages inflate the container.
     */
    const handleLoadMore: () => void = useCallback(() => {
        if (messagesContainerRef.current) {
            prevScrollHeightRef.current = messagesContainerRef.current.scrollHeight;
            suppressScrollRef.current = true;
        }
        loadMoreHistory();
    }, [ loadMoreHistory ]);

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
        const isUser: boolean = message.sender === "user";
        const isError: boolean = message.type === "error";
        const renderedContent: string = message.type === "streaming"
            ? normalizeStreamingMarkdown(message.content)
            : message.content;

        if (isUser) {
            // User message - orange bubble on the right
            return (
                <Box
                    key={ message.id }
                    className="copilot-message user-message"
                    data-componentid={ `${componentId}-message-${message.id}` }
                >
                    <Box className="copilot-message-content">
                        <Paper elevation={ 0 } className="copilot-message-bubble">
                            { message.content }
                        </Paper>
                    </Box>
                </Box>
            );
        } else {
            // Copilot message - gray bubble on the left
            const isLastMessage: boolean = messages[messages.length - 1]?.id === message.id;

            return (
                <Box
                    key={ message.id }
                    className="copilot-message bot-message"
                    data-componentid={ `${componentId}-message-${message.id}` }
                >
                    <Box className="copilot-message-content">
                        <Paper
                            elevation={ 0 }
                            className={ `copilot-message-bubble ${isError ? "error-message" : ""}` }
                        >
                            <MessageErrorBoundary>
                                <Markdown source={ renderedContent } />
                            </MessageErrorBoundary>
                        </Paper>

                        { /* Render suggestions if they exist and this is the latest message */ }
                        { !isError && isLastMessage && (
                            <>
                                { message.suggestionsLoading && !message.suggestions && (
                                    <Box className="copilot-follow-up-suggestions-list">
                                        { [ 0, 1 ].map((i: number) => (
                                            <Skeleton
                                                key={ `${message.id}-suggestion-skeleton-${i}` }
                                                variant="rounded"
                                                className="copilot-suggestion-skeleton"
                                            />
                                        )) }
                                    </Box>
                                ) }
                                { message.suggestions && message.suggestions.length > 0 && (
                                    <Box className="copilot-follow-up-suggestions-list">
                                        { message.suggestions.map((suggestion: string, index: number) => (
                                            <Button
                                                key={ `${message.id}-suggestion-${index}` }
                                                variant="outlined"
                                                onClick={ () => sendMessage(suggestion) }
                                                disabled={ isLoading }
                                                className="copilot-suggestion-button"
                                                data-componentid={ `${componentId}-suggestion-${index}` }
                                                startIcon={ <AISparkleIcon width={ 16 } height={ 16 } /> }
                                            >
                                                { suggestion }
                                            </Button>
                                        )) }
                                    </Box>
                                ) }
                            </>
                        ) }
                    </Box>
                </Box>
            );
        }
    };

    return (
        <Box
            className={ `copilot-chat ${className || ""}` }
            data-componentid={ componentId }

        >
            { /* Messages Area */ }
            <Box className="copilot-chat-messages" ref={ messagesContainerRef }>
                { /* Load Earlier Messages button */ }
                { hasMoreHistory && (
                    <Box className="copilot-load-earlier-container">
                        <Button
                            variant="text"
                            size="small"
                            startIcon={ isLoadingMoreHistory
                                ? <CircularProgress size={ 14 } />
                                : <HistoryIcon fontSize="small" /> }
                            onClick={ handleLoadMore }
                            disabled={ isLoadingMoreHistory }
                            data-componentid={ `${componentId}-load-earlier-btn` }
                            className="copilot-load-earlier-btn"
                        >
                            { isLoadingMoreHistory ? "Loading..." : "Load earlier messages" }
                        </Button>
                    </Box>
                ) }
                { messages.length === 0 ? (
                    <Box className="copilot-empty-state">
                        <Typography variant="body2" className="copilot-empty-text">
                            Start a conversation...
                        </Typography>
                    </Box>
                ) : (
                    messages.map(renderMessage)
                ) }

                { /* Loading indicator */ }
                { isLoading && (
                    <Box
                        className="copilot-message loading-message"
                        data-componentid={ `${componentId}-loading` }
                    >
                        <Box className="copilot-message-content">
                            <Paper elevation={ 0 } className="copilot-message-bubble">
                                <Box className="copilot-loading-content">
                                    <CircularProgress size={ 16 } className="copilot-loading-spinner" />
                                    <Typography variant="body2" className="copilot-loading-text">
                                        { statusMessage || "Thinking..." }
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                ) }
                <div ref={ messagesEndRef } />
            </Box>
            { /* Input Area */ }
            <Box className="copilot-input-container">
                <Box className="copilot-input-wrapper">
                    <TextField
                        fullWidth
                        multiline
                        maxRows={ 4 }
                        placeholder="Enter your message here..."
                        value={ inputValue }
                        onChange={ handleInputChange }
                        onKeyDown={ handleKeyDown }
                        disabled={ isLoading }
                        data-componentid={ `${componentId}-input` }
                        className="copilot-input-field"
                    />

                    { /* Send Button */ }
                    <IconButton
                        onClick={ handleSendMessage }
                        disabled={ !inputValue.trim() || isLoading }
                        data-componentid={ `${componentId}-send-button` }
                        className="copilot-send-button"
                    >
                        <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                </Box>

                { /* Footer */ }
                <Typography variant="caption" className="copilot-disclaimer">
                    Use Copilot mindfully as AI can make mistakes.
                </Typography>
            </Box>
        </Box>
    );
};

export default CopilotChat;
