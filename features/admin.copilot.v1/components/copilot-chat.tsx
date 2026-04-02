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
import { useTranslation } from "react-i18next";
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
 * Props for MessageErrorBoundary.
 */
interface MessageErrorBoundaryProps {
    children?: ReactNode;
    /**
     * When this key changes the boundary resets, allowing the message to
     * re-render after a transient stream error.
     */
    resetKey: string;
    /** i18n translation function, threaded in from the nearest functional parent. */
    errorText: string;
}

/**
 * Error boundary that catches rendering errors inside a single chat message.
 * Prevents a malformed message from crashing the entire chat list.
 * Resets automatically when resetKey changes (e.g. when the message content updates).
 */
class MessageErrorBoundary extends Component<
    MessageErrorBoundaryProps,
    { hasError: boolean }
> {
    constructor(props: MessageErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): { hasError: boolean } {
        return { hasError: true };
    }

    componentDidUpdate(prevProps: MessageErrorBoundaryProps): void {
        if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
            this.setState({ hasError: false });
        }
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <Typography variant="body2" className="copilot-message-error">
                    { this.props.errorText }
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
 * Props for the memoized single-message renderer.
 */
interface ChatMessageProps {
    message: CopilotMessage;
    isLastMessage: boolean;
    isLoading: boolean;
    componentId: string;
    onSendMessage: (msg: string) => void;
}

/**
 * Renders a single chat message. Wrapped in React.memo so that messages that
 * have not changed (all history messages) do NOT re-render on every token
 * update during streaming — preventing the Markdown parser from blocking the
 * main thread on every incoming token.
 */
const ChatMessage: React.FunctionComponent<ChatMessageProps> = React.memo(
    ({
        message,
        isLastMessage,
        isLoading: loading,
        componentId,
        onSendMessage
    }: ChatMessageProps): ReactElement => {
        const { t } = useTranslation();
        const isUser: boolean = message.sender === "user";
        const isError: boolean = message.type === "error";
        const renderedContent: string = message.type === "streaming"
            ? normalizeStreamingMarkdown(message.content)
            : message.content;

        if (isUser) {
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
        }

        // Don't render the bot placeholder while it has no content yet —
        // it would create an invisible gap above the loading indicator.
        if (message.content === "" && message.type === "streaming") {
            return null;
        }

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
                        <MessageErrorBoundary
                            resetKey={ renderedContent }
                            errorText={ t("console:common.copilot.chat.messageError") }
                        >
                            <Markdown source={ renderedContent } />
                        </MessageErrorBoundary>
                    </Paper>

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
                                            onClick={ () => onSendMessage(suggestion) }
                                            disabled={ loading }
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
);

ChatMessage.displayName = "ChatMessage";

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

    const { t } = useTranslation();

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
                            { isLoadingMoreHistory
                                ? t("console:common.copilot.chat.loadingHistory")
                                : t("console:common.copilot.chat.loadEarlier") }
                        </Button>
                    </Box>
                ) }
                { messages.length === 0 ? (
                    <Box className="copilot-empty-state">
                        <Typography variant="body2" className="copilot-empty-text">
                            { t("console:common.copilot.chat.emptyChat") }
                        </Typography>
                    </Box>
                ) : (
                    messages.map((message: CopilotMessage) => (
                        <ChatMessage
                            key={ message.id }
                            message={ message }
                            isLastMessage={ message.id === messages[messages.length - 1]?.id }
                            isLoading={ isLoading }
                            componentId={ componentId }
                            onSendMessage={ sendMessage }
                        />
                    ))
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
                                        { statusMessage || t("console:common.copilot.chat.thinking") }
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
                        aria-label={ t("console:common.copilot.chat.inputLabel") }
                        placeholder={ t("console:common.copilot.welcome.placeholder") }
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
                        aria-label={ t("console:common.copilot.chat.sendMessage") }
                        data-componentid={ `${componentId}-send-button` }
                        className="copilot-send-button"
                    >
                        <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                </Box>

                { /* Footer */ }
                <Typography variant="caption" className="copilot-disclaimer">
                    { /* TODO: Switch back to "Copilot" once branding is finalized */ }
                    { t("console:common.copilot.welcome.disclaimer") }
                </Typography>
            </Box>
        </Box>
    );
};

export default CopilotChat;
