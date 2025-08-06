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

import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@oxygen-ui/react/Box";
import Drawer from "@oxygen-ui/react/Drawer";
import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import AISparkleIcon from "./ai-sparkle-icon";
import ClearChatConfirmationModal from "./clear-chat-confirmation-modal";
import CopilotChat from "./copilot-chat";
import CopilotWelcome from "./copilot-welcome";
import { useCopilotPanel } from "../hooks";
import { CopilotContentType } from "../store/types";
import "./copilot-panel.scss";

/**
 * Props interface for the CopilotPanel component.
 */
export interface CopilotPanelProps extends IdentifiableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Width of the panel.
     */
    width?: number;
}

/**
 * Copilot panel component that appears as a right-side drawer.
 *
 * @param props - Props injected to the component.
 * @returns Copilot panel component.
 */
const CopilotPanel: React.FunctionComponent<CopilotPanelProps> = (
    props: CopilotPanelProps
): ReactElement => {
    const {
        className,
        width = 400,
        ["data-componentid"]: componentId = "copilot-panel"
    } = props;

    const { t } = useTranslation();
    const [ isExpanded, setIsExpanded ] = useState(false);
    const [ showClearChatModal, setShowClearChatModal ] = useState(false);
    const [ isRefreshing, setIsRefreshing ] = useState(false);

    const {
        isVisible,
        contentType,
        messages,
        hidePanel,
        clearChat
    } = useCopilotPanel();

    /**
     * Handle panel close.
     */
    const handleClose: () => void = useCallback(() => {
        hidePanel();
    }, [ hidePanel ]);

    /**
     * Handle panel expand/collapse.
     */
    const handleToggleExpand: () => void = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [ isExpanded ]);

    /**
     * Handle clear chat button click - show confirmation modal.
     */
    const handleClearChatClick: () => void = useCallback(() => {
        setShowClearChatModal(true);
    }, []);

    /**
     * Handle clear chat confirmation.
     */
    const handleClearChatConfirm: () => void = useCallback(() => {
        setIsRefreshing(true);

        try {
            clearChat();
        } finally {
            // Reset refresh state after animation
            setTimeout(() => setIsRefreshing(false), 1000);
        }
    }, [ clearChat ]);

    /**
     * Render the panel content based on content type.
     */
    const renderContent = (): ReactElement => {
        switch (contentType) {
            case CopilotContentType.CHAT:
                // Show welcome screen if no messages, otherwise show chat
                return messages.length === 0 ? (
                    <CopilotWelcome data-componentid={ `${componentId}-welcome` } />
                ) : (
                    <CopilotChat data-componentid={ `${componentId}-chat` } />
                );
            case CopilotContentType.HELP:
                return (
                    <Box p={ 2 }>
                        <Typography variant="body1">
                            { t("console:copilot.help.content") }
                        </Typography>
                    </Box>
                );
            case CopilotContentType.DOCUMENTATION:
                return (
                    <Box p={ 2 }>
                        <Typography variant="body1">
                            { t("console:copilot.documentation.content") }
                        </Typography>
                    </Box>
                );
            default:
                // Show welcome screen if no messages, otherwise show chat
                return messages.length === 0 ? (
                    <CopilotWelcome data-componentid={ `${componentId}-welcome` } />
                ) : (
                    <CopilotChat data-componentid={ `${componentId}-chat` } />
                );
        }
    };

    return (
        <Drawer
            anchor="right"
            open={ isVisible }
            onClose={ handleClose }
            variant="persistent"
            transitionDuration={ {
                enter: 400,
                exit: 400
            } }
            className={ classNames("copilot-panel", className, {
                "copilot-panel-expanded": isExpanded
            }) }
            ModalProps={ {
                hideBackdrop: true,
                keepMounted: true
            } }
            PaperProps={ {
                className: "copilot-panel-paper",
                style: {
                    margin: 0,
                    padding: 0,
                    width: isExpanded ? "100vw" : width
                }

            } }
            data-componentid={ componentId }

        >
            <Box
                className="copilot-panel-container"
            >
                { /* Header - Always visible at top */ }
                <Box
                    className="copilot-panel-header"
                >
                    { /* Left side - Logo and Title */ }
                    <Box className="copilot-header-left">
                        <Box className="copilot-avatar-container">
                            <AISparkleIcon width={ 24 } height={ 24 } />
                        </Box>
                        <Box className="copilot-title-container">
                            <Typography variant="h6" className="copilot-title">
                                    Copilot
                            </Typography>
                            <Typography variant="caption" className="copilot-preview-label">
                                    Preview
                            </Typography>
                        </Box>
                    </Box>

                    { /* Right side - Action buttons */ }
                    <Box className="copilot-header-actions">
                        { messages.length > 0 && (
                            <Tooltip title="Clear Chat">
                                <IconButton
                                    size="small"
                                    onClick={ handleClearChatClick }
                                    disabled={ isRefreshing }
                                    className={ `copilot-action-button ${isRefreshing ? "refreshing" : ""}` }
                                >
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        ) }
                        <Tooltip title={ isExpanded ? "Exit Fullscreen" : "Expand to Fullscreen" }>
                            <IconButton
                                onClick={ handleToggleExpand }
                                size="small"
                                className="copilot-action-button"
                            >
                                { isExpanded
                                    ? <FullscreenExitIcon fontSize="small" />
                                    : <FullscreenIcon fontSize="small" /> }
                            </IconButton>
                        </Tooltip>
                        <IconButton
                            onClick={ handleClose }
                            size="small"
                            className="copilot-action-button"
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                { /* Content Area - Below header with top margin for absolute header */ }
                <Box
                    className="copilot-panel-content"
                >
                    { renderContent() }
                </Box>

                { /* Clear Chat Confirmation Modal */ }
                <ClearChatConfirmationModal
                    open={ showClearChatModal }
                    onClose={ () => setShowClearChatModal(false) }
                    onConfirm={ handleClearChatConfirm }
                    data-componentid="copilot-panel-clear-chat-modal"
                />
            </Box>
        </Drawer>
    );
};

export default CopilotPanel;
