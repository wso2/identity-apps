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
import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement, useCallback, useState } from "react";
import AISparkleIcon from "./ai-sparkle-icon";
import ClearChatConfirmationModal from "./clear-chat-confirmation-modal";
import { useCopilotPanel } from "../hooks";
import "./copilot-header.scss";

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


    const [ isRefreshing, setIsRefreshing ] = useState(false);
    const [ showClearChatModal, setShowClearChatModal ] = useState(false);

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
     * Handle expand/collapse toggle.
     */
    const handleToggleExpand: () => void = useCallback(() => {
        if (onToggleExpand) {
            onToggleExpand();
        }
    }, [ onToggleExpand ]);

    return (
        <Box className="copilot-header" data-componentid={ componentId }>
            <Box className="copilot-header-content">
                { /* Left side - Logo and Title */ }
                <Box className="copilot-header-left">
                    <Box className="copilot-avatar-container">
                        <AISparkleIcon width={ 24 } height={ 24 } />
                    </Box>
                    <Typography variant="h6" component="h2" className="copilot-header-title">
                        Copilot
                    </Typography>
                </Box>

                { /* Right side - Action buttons */ }
                <Box className="copilot-header-actions">
                    { messages.length > 0 && (
                        <Tooltip title="Clear Chat">
                            <IconButton
                                size="small"
                                onClick={ handleClearChatClick }
                                disabled={ isRefreshing }
                                data-componentid={ `${componentId}-refresh-button` }
                                className={ `copilot-action-button ${isRefreshing ? "refreshing" : ""}` }
                            >
                                <RefreshIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) }
                    { onToggleExpand && (
                        <Tooltip title={ isExpanded ? "Collapse" : "Expand" }>
                            <IconButton
                                size="small"
                                onClick={ handleToggleExpand }
                                data-componentid={ `${componentId}-expand-button` }
                                className="copilot-action-button"
                            >
                                { isExpanded
                                    ? <FullscreenExitIcon fontSize="small" />
                                    : <FullscreenIcon fontSize="small" /> }
                            </IconButton>
                        </Tooltip>
                    ) }
                    <Tooltip title="Close">
                        <IconButton
                            size="small"
                            onClick={ onClose }
                            data-componentid={ `${componentId}-close-button` }
                            className="copilot-action-button"
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            { /* Clear Chat Confirmation Modal */ }
            <ClearChatConfirmationModal
                open={ showClearChatModal }
                onClose={ () => setShowClearChatModal(false) }
                onConfirm={ handleClearChatConfirm }
                data-componentid={ `${componentId}-clear-chat-modal` }
            />
        </Box>
    );
};

export default CopilotHeader;
