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

import Box from "@oxygen-ui/react/Box";
import Drawer from "@oxygen-ui/react/Drawer";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CopilotChat from "./copilot-chat";
import CopilotHeader from "./copilot-header";
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
        width = 600,
        ["data-componentid"]: componentId = "copilot-panel"
    } = props;

    const { t } = useTranslation();
    const [ isExpanded, setIsExpanded ] = useState<boolean>(false);

    const {
        isVisible,
        contentType,
        messages,
        isLoading,
        hidePanel,
        loadHistory
    } = useCopilotPanel();

    /**
     * Load chat history when panel becomes visible.
     */
    useEffect(() => {
        if (isVisible) {
            loadHistory();
        }
    }, [ isVisible, loadHistory ]);

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
        setIsExpanded((prev: boolean) => !prev);
    }, []);

    /**
     * Render the panel content based on content type.
     */
    const renderContent = (): ReactElement => {
        switch (contentType) {
            case CopilotContentType.CHAT:
                // While the initial history fetch is in progress, render nothing so
                // the welcome screen doesn't flash before chat history appears.
                if (isLoading && messages.length === 0) {
                    return <Box className="copilot-panel-content-placeholder" />;
                }

                return messages.length === 0 ? (
                    <CopilotWelcome data-componentid={ `${componentId}-welcome` } />
                ) : (
                    <CopilotChat data-componentid={ `${componentId}-chat` } />
                );
            case CopilotContentType.HELP:
                return (
                    <Box p={ 2 }>
                        <Typography variant="body1">
                            { t("console:common.copilot.help.content") }
                        </Typography>
                    </Box>
                );
            case CopilotContentType.DOCUMENTATION:
                return (
                    <Box p={ 2 }>
                        <Typography variant="body1">
                            { t("console:common.copilot.documentation.content") }
                        </Typography>
                    </Box>
                );
            default:
                if (isLoading && messages.length === 0) {
                    return <Box className="copilot-panel-content-placeholder" />;
                }

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
                    width: isExpanded ? "100%" : width
                }
            } }
            data-componentid={ componentId }
        >
            <Box className="copilot-panel-container">
                <CopilotHeader
                    onClose={ handleClose }
                    onToggleExpand={ handleToggleExpand }
                    isExpanded={ isExpanded }
                    data-componentid={ `${componentId}-header` }
                />

                <Box className="copilot-panel-content">
                    { renderContent() }
                </Box>
            </Box>
        </Drawer>
    );
};

export default CopilotPanel;
