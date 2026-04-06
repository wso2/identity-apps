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

import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Theme } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Stack from "@oxygen-ui/react/Stack";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AISparkleIcon from "./ai-sparkle-icon";
import ClearChatConfirmationModal from "./clear-chat-confirmation-modal";
import useCopilotPanel from "../hooks/use-copilot-panel";

// Brand accent used in gradients (no theme token for this purple)
const COPILOT_SECONDARY: string = "#8b5cf6";

/**
 * Props interface for the CopilotHeader component.
 */
export interface CopilotHeaderProps extends IdentifiableComponentInterface {
    /**
     * Callback for close button click.
     */
    onClose: () => void;
    /**
     * Callback for expand/collapse button click.
     */
    onToggleExpand?: () => void;
    /**
     * Whether the panel is expanded.
     */
    isExpanded?: boolean;
}

/**
 * Header component for the copilot panel.
 *
 * @param props - Props injected to the component.
 * @returns Copilot header component.
 */
const CopilotHeader: React.FunctionComponent<CopilotHeaderProps> = (
    props: CopilotHeaderProps
): ReactElement => {
    const {
        onClose,
        onToggleExpand,
        isExpanded = false,
        ["data-componentid"]: componentId = "copilot-header"
    } = props;


    const { t } = useTranslation();
    const [ isRefreshing, setIsRefreshing ] = useState<boolean>(false);
    const [ showClearChatModal, setShowClearChatModal ] = useState<boolean>(false);
    const refreshTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null> =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (refreshTimeoutRef.current !== null) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, []);

    const {
        clearChat,
        messages
    } = useCopilotPanel();

    /**
     * Handle clear chat button click - show confirmation modal.
     */
    const handleClearChatClick: () => void = useCallback(() => {
        setShowClearChatModal(true);
    }, []);

    /**
     * Handle clear chat confirmation.
     */
    const handleClearChatConfirm: () => Promise<void> = useCallback(async (): Promise<void> => {
        setIsRefreshing(true);

        try {
            await clearChat();
        } finally {
            // Reset refresh state after animation; clear any prior timeout to avoid double-fire.
            if (refreshTimeoutRef.current !== null) {
                clearTimeout(refreshTimeoutRef.current);
            }
            refreshTimeoutRef.current = setTimeout(() => {
                refreshTimeoutRef.current = null;
                setIsRefreshing(false);
            }, 1000);
        }
    }, [ clearChat ]);

    /**
     * Handle close of the clear chat confirmation modal.
     */
    const handleCloseClearChat: () => void = useCallback(() => {
        setShowClearChatModal(false);
    }, []);

    /**
     * Handle expand/collapse toggle.
     */
    const handleToggleExpand: () => void = useCallback(() => {
        if (onToggleExpand) {
            onToggleExpand();
        }
    }, [ onToggleExpand ]);

    return (
        <Box
            data-componentid={ componentId }
            sx={ (theme: Theme) => ({
                bgcolor: "background.paper",
                borderBottom: 1,
                borderColor: "divider",
                flexShrink: 0,
                minHeight: 64,
                position: "relative",
                zIndex: theme.zIndex.appBar
            }) }
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={ { height: 64, px: 2 } }
            >
                { /* Left side - Logo and Title */ }
                <Stack direction="row" alignItems="center" spacing={ 1 }>
                    <AISparkleIcon width={ 24 } height={ 24 } />
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={ (theme: Theme) => ({
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${COPILOT_SECONDARY})`,
                            backgroundClip: "text",
                            fontSize: 16,
                            fontWeight: 600,
                            lineHeight: 1
                        }) }
                    >
                        { t("console:common.copilot.title") }
                    </Typography>
                </Stack>

                { /* Right side - Action buttons */ }
                <Stack direction="row" alignItems="center" spacing={ 0.5 }>
                    { messages.length > 0 && (
                        <Tooltip title={ t("console:common.copilot.clearChat.title") }>
                            <span>
                                <IconButton
                                    size="small"
                                    aria-label={ t("console:common.copilot.clearChat.title") }
                                    onClick={ handleClearChatClick }
                                    disabled={ isRefreshing }
                                    data-componentid={ `${componentId}-refresh-button` }
                                    sx={ {
                                        "@keyframes spin": {
                                            "0%": { transform: "rotate(0deg)" },
                                            "100%": { transform: "rotate(360deg)" }
                                        },
                                        animation: isRefreshing
                                            ? "spin 1s linear infinite"
                                            : "none",
                                        color: "text.secondary"
                                    } }
                                >
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                    ) }
                    { onToggleExpand && (
                        <Tooltip
                            title={ isExpanded
                                ? t("console:common.copilot.collapse")
                                : t("console:common.copilot.expand") }>
                            <IconButton
                                size="small"
                                aria-label={ isExpanded
                                    ? t("console:common.copilot.collapse")
                                    : t("console:common.copilot.expand") }
                                onClick={ handleToggleExpand }
                                data-componentid={ `${componentId}-expand-button` }
                                sx={ { color: "text.secondary" } }
                            >
                                { isExpanded
                                    ? <FullscreenExitIcon fontSize="small" />
                                    : <FullscreenIcon fontSize="small" /> }
                            </IconButton>
                        </Tooltip>
                    ) }
                    <Tooltip title={ t("console:common.copilot.close") }>
                        <IconButton
                            size="small"
                            aria-label={ t("console:common.copilot.close") }
                            onClick={ onClose }
                            data-componentid={ `${componentId}-close-button` }
                            sx={ { color: "text.secondary" } }
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            { /* Clear Chat Confirmation Modal */ }
            <ClearChatConfirmationModal
                open={ showClearChatModal }
                onClose={ handleCloseClearChat }
                onConfirm={ handleClearChatConfirm }
                data-componentid={ `${componentId}-clear-chat-modal` }
            />
        </Box>
    );
};

export default CopilotHeader;
