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

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import HistoryIcon from "@mui/icons-material/History";
import { Theme, alpha, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import IconButton from "@oxygen-ui/react/IconButton";
import Paper from "@oxygen-ui/react/Paper";
import Skeleton from "@oxygen-ui/react/Skeleton";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DocumentationLink, Markdown, useDocumentation } from "@wso2is/react-components";
import React, {
    Component, ReactElement, ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState
} from "react";
import { useTranslation } from "react-i18next";
import AISparkleIcon from "./ai-sparkle-icon";
import {
    StyledCopilotInput,
    StyledFollowUpSuggestionsList,
    StyledLoadMoreButton,
    StyledSuggestionButton
} from "./copilot-styles";
import useCopilotPanel from "../hooks/use-copilot-panel";
import { CopilotMessageInterface } from "../store/types/copilot-action-types";

const StyledBotMessageBubble: typeof Paper = styled(Paper)(({ theme }: { theme: Theme }) => ({
    "& .markdown": {
        "& .code-editor": {
            "& .CodeMirror": {
                "& .CodeMirror-gutters": { display: "none" },
                "& .CodeMirror-scroll": { overflowX: "auto" },
                "& span[class^=\"cm-\"], & span[class*=\" cm-\"]": {
                    color: `${theme.palette.text.primary} !important`
                },
                backgroundColor: alpha(theme.palette.common.black, 0.05),
                borderRadius: 4,
                color: theme.palette.text.primary,
                fontFamily: "Monaco, Menlo, \"Ubuntu Mono\", monospace",
                fontSize: 12,
                lineHeight: 1.25,
                padding: theme.spacing(1.5),
                paddingRight: 40
            },
            "& .editor-actions .editor-action": {
                "& .theme-icon path": { fill: `${theme.palette.primary.main} !important` },
                "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.15) },
                borderRadius: 4,
                transition: "background-color 0.15s ease"
            },
            margin: 0
        },
        "& .code-segment": {
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
            margin: `${theme.spacing(1.5)} 0`,
            overflow: "hidden"
        },
        "& .markdown-blockquote-alert": {
            backgroundColor: `${theme.palette.grey[100]} !important`,
            border: "none !important",
            boxShadow: "none !important",
            color: `${theme.palette.text.primary} !important`,
            fontStyle: "normal",
            padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)} !important`
        },
        "& > *:first-of-type": { marginTop: 0 },
        "& > *:last-child": { marginBottom: 0 },
        "& a": {
            "&:hover": { textDecoration: "underline" },
            color: theme.palette.primary.main,
            textDecoration: "none"
        },
        "& code": {
            backgroundColor: alpha(theme.palette.common.black, 0.08),
            borderRadius: 3,
            fontFamily: "Monaco, Menlo, \"Ubuntu Mono\", monospace",
            fontSize: "0.9em",
            padding: `2px ${theme.spacing(0.5)}`
        },
        "& h1": {
            color: "inherit",
            fontSize: 18,
            lineHeight: 1.25,
            margin: `${theme.spacing(1.5)} 0 ${theme.spacing(1)} 0`
        },
        "& h2": {
            color: "inherit",
            fontSize: 16,
            lineHeight: 1.25,
            margin: `${theme.spacing(1.5)} 0 ${theme.spacing(1)} 0`
        },
        "& h3": {
            color: "inherit",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.25,
            margin: `${theme.spacing(1.5)} 0 ${theme.spacing(1)} 0`
        },
        "& h4, & h5, & h6": {
            color: "inherit",
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.25,
            margin: `${theme.spacing(1.5)} 0 ${theme.spacing(1)} 0`
        },
        "& hr": {
            border: "none",
            borderTop: `1px solid ${theme.palette.divider}`,
            margin: `${theme.spacing(2)} 0`
        },
        "& li": { margin: `${theme.spacing(0.5)} 0` },
        "& p": { lineHeight: 1.5, margin: `${theme.spacing(1)} 0` },
        "& table": {
            borderCollapse: "collapse",
            margin: `${theme.spacing(1.5)} 0`,
            width: "100%"
        },
        "& th": {
            backgroundColor: alpha(theme.palette.common.black, 0.05),
            fontWeight: 600
        },
        "& th, & td": {
            border: `1px solid ${theme.palette.divider}`,
            padding: theme.spacing(1),
            textAlign: "left"
        },
        "& ul, & ol": { margin: `${theme.spacing(1)} 0`, paddingLeft: theme.spacing(2.5) },
        contain: "layout style"
    },
    "&.error-message": {
        backgroundColor: alpha(theme.palette.error.main, 0.08),
        border: `1px solid ${alpha(theme.palette.error.main, 0.4)}`,
        borderRadius: 4,
        color: theme.palette.error.main
    },
    background: "transparent",
    border: "none",
    borderRadius: 0,
    color: theme.palette.text.primary,
    contain: "layout style",
    fontSize: 14,
    lineHeight: 1.5,
    overflowWrap: "break-word",
    padding: theme.spacing(1.5),
    willChange: "auto"
}));

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
    const contentWithoutCode: string = contentWithoutFencedBlocks.replace(/`[^`]*`/g, "");
    const inlineCodeCount: number = contentWithoutCode.match(/`/g)?.length ?? 0;

    if (inlineCodeCount % 2 === 1) {
        normalizedContent = `${normalizedContent}\``;
    }

    const boldAsteriskCount: number = contentWithoutCode.match(/\*\*/g)?.length ?? 0;

    if (boldAsteriskCount % 2 === 1) {
        normalizedContent = `${normalizedContent}**`;
    }

    const boldUnderscoreCount: number = contentWithoutCode.match(/__/g)?.length ?? 0;

    if (boldUnderscoreCount % 2 === 1) {
        normalizedContent = `${normalizedContent}__`;
    }

    if (/\[[^\]]*\]\([^)]*$/.test(contentWithoutCode)) {
        normalizedContent = `${normalizedContent})`;
    }

    return normalizedContent;
};

/**
 * Props for the memoized single-message renderer.
 */
interface ChatMessageProps {
    message: CopilotMessageInterface;
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
                    data-componentid={ `${componentId}-message-${message.id}` }
                    sx={ { mb: 2, pr: 2, textAlign: "right" } }
                >
                    <Box sx={ { marginLeft: "auto", maxWidth: "80%" } }>
                        <Paper
                            elevation={ 0 }
                            sx={ {
                                backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
                                borderRadius: "16px 16px 4px 16px",
                                display: "inline-block",
                                overflowWrap: "break-word",
                                p: 2,
                                textAlign: "left"
                            } }
                        >
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
            <Stack
                key={ message.id }
                direction="row"
                alignItems="flex-start"
                data-componentid={ `${componentId}-message-${message.id}` }
                sx={ { mb: 2, px: 2 } }
            >
                <Box sx={ { maxWidth: "100%", width: "100%" } }>
                    <StyledBotMessageBubble
                        elevation={ 0 }
                        className={ isError ? "error-message" : "" }
                    >
                        <MessageErrorBoundary
                            resetKey={ renderedContent }
                            errorText={ t("console:common.copilot.chat.messageError") }
                        >
                            <Markdown source={ renderedContent } />
                        </MessageErrorBoundary>
                    </StyledBotMessageBubble>

                    { !isError && isLastMessage && (
                        <>
                            { message.suggestionsLoading && !message.suggestions && (
                                <StyledFollowUpSuggestionsList>
                                    { [ 0, 1 ].map((i: number) => (
                                        <Skeleton
                                            key={ `${message.id}-suggestion-skeleton-${i}` }
                                            variant="rounded"
                                            sx={ (theme: Theme) => ({
                                                backgroundColor: alpha(theme.palette.primary.main, 0.06),
                                                borderRadius: "24px",
                                                height: 36,
                                                width: 160
                                            }) }
                                        />
                                    )) }
                                </StyledFollowUpSuggestionsList>
                            ) }
                            { message.suggestions && message.suggestions.length > 0 && (
                                <StyledFollowUpSuggestionsList>
                                    { message.suggestions.map((suggestion: string, index: number) => (
                                        <StyledSuggestionButton
                                            key={ `${message.id}-suggestion-${index}` }
                                            variant="text"
                                            onClick={ () => onSendMessage(suggestion) }
                                            disabled={ loading }
                                            data-componentid={ `${componentId}-suggestion-${index}` }
                                            startIcon={ <AISparkleIcon width={ 16 } height={ 16 } /> }
                                        >
                                            { suggestion }
                                        </StyledSuggestionButton>
                                    )) }
                                </StyledFollowUpSuggestionsList>
                            ) }
                        </>
                    ) }
                </Box>
            </Stack>
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
    const { getLink } = useDocumentation();

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
        if (event.nativeEvent.isComposing) {
            return;
        }

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
     * Returns true when the user is within `threshold` pixels of the bottom
     * of the messages container. Used to decide whether to auto-scroll.
     */
    const isUserNearBottom: (threshold?: number) => boolean = useCallback((threshold: number = 100) => {
        if (!messagesContainerRef.current) {
            return true;
        }
        const { scrollHeight, scrollTop, clientHeight } = messagesContainerRef.current;

        return scrollHeight - scrollTop - clientHeight < threshold;
    }, []);

    /**
     * Scroll to bottom when messages change - only when the user is already
     * near the bottom so loading earlier history never yanks the viewport.
     */
    useEffect(() => {
        if (isUserNearBottom()) {
            throttledScrollToBottom();
        }
    }, [ messages, isUserNearBottom, throttledScrollToBottom ]);

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
     * If loadMoreHistory resolves without prepending (abort, empty response, error),
     * the saved anchor is cleared so useLayoutEffect never applies a stale delta.
     */
    const handleLoadMore: () => Promise<void> = useCallback(async (): Promise<void> => {
        if (messagesContainerRef.current) {
            prevScrollHeightRef.current = messagesContainerRef.current.scrollHeight;
        }

        try {
            const prepended: boolean = await loadMoreHistory();

            if (!prepended) {
                prevScrollHeightRef.current = null;
            }
        } catch (_error: unknown) {
            prevScrollHeightRef.current = null;
        }
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
        <Stack
            direction="column"
            className={ className }
            data-componentid={ componentId }
            sx={ { height: "100%" } }
        >
            { /* Messages Area */ }
            <Box
                ref={ messagesContainerRef }
                sx={ {
                    flex: 1,
                    overflowY: "auto",
                    py: 2
                } }
            >
                { /* Load Earlier Messages button */ }
                { hasMoreHistory && (
                    <Stack direction="row" justifyContent="center" sx={ { pb: 1, pt: 0.5, px: 2 } }>
                        <StyledLoadMoreButton
                            variant="text"
                            size="small"
                            startIcon={ isLoadingMoreHistory
                                ? <CircularProgress size={ 14 } />
                                : <HistoryIcon fontSize="small" /> }
                            onClick={ handleLoadMore }
                            disabled={ isLoadingMoreHistory }
                            data-componentid={ `${componentId}-load-earlier-btn` }
                        >
                            { isLoadingMoreHistory
                                ? t("console:common.copilot.chat.loadingHistory")
                                : t("console:common.copilot.chat.loadEarlier") }
                        </StyledLoadMoreButton>
                    </Stack>
                ) }
                { messages.length === 0 ? (
                    <Box sx={ { p: 3, textAlign: "center" } }>
                        <Typography variant="body2" color="text.secondary">
                            { t("console:common.copilot.chat.emptyChat") }
                        </Typography>
                    </Box>
                ) : (
                    messages.map((message: CopilotMessageInterface) => (
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

                { /* Agent status indicator */ }
                { isLoading && statusMessage && (
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={ 1 }
                        data-componentid={ `${componentId}-loading` }
                        sx={ { mb: 2, px: 4 } }
                    >
                        <CircularProgress size={ 16 } color="primary" />
                        <Typography variant="body2">{ statusMessage }</Typography>
                    </Stack>
                ) }
                <div ref={ messagesEndRef } />
            </Box>
            { /* Input Area */ }
            <Box sx={ { bgcolor: "background.paper", p: 2 } }>
                <Box sx={ { position: "relative" } }>
                    <StyledCopilotInput
                        fullWidth
                        multiline
                        minRows={ 1 }
                        maxRows={ 4 }
                        aria-label={ t("console:common.copilot.chat.inputLabel") }
                        placeholder={ t("console:common.copilot.welcome.placeholder") }
                        value={ inputValue }
                        onChange={ handleInputChange }
                        onKeyDown={ handleKeyDown }
                        disabled={ isLoading }
                        data-componentid={ `${componentId}-input` }
                    />

                    { /* Send Button */ }
                    <IconButton
                        color="primary"
                        onClick={ handleSendMessage }
                        disabled={ !inputValue.trim() || isLoading }
                        aria-label={ t("console:common.copilot.chat.sendMessage") }
                        data-componentid={ `${componentId}-send-button` }
                        sx={ (theme: Theme) => ({
                            height: 32,
                            position: "absolute",
                            right: theme.spacing(1),
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 32
                        }) }
                    >
                        <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                </Box>

                { /* Footer */ }
                <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={ { mt: 1.5, textAlign: "center" } }
                >
                    { /* TODO: Switch back to "Copilot" once branding is finalized */ }
                    { t("console:common.copilot.welcome.disclaimer") }
                    { " " }
                    <DocumentationLink link={ getLink("common.aiTermsOfService") }>
                        { t("console:common.copilot.welcome.termsAndConditions") }
                    </DocumentationLink>
                </Typography>
            </Box>
        </Stack>
    );
};

export default CopilotChat;
