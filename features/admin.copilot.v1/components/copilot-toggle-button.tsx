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

import Badge from "@oxygen-ui/react/Badge";
import Button from "@oxygen-ui/react/Button";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement, useCallback } from "react";
import AISparkleIcon from "./ai-sparkle-icon";
import { useCopilotPanel } from "../hooks";
import "./copilot-toggle-button.scss";

/**
 * Props interface for the CopilotToggleButton component.
 */
export interface CopilotToggleButtonProps extends IdentifiableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Show notification badge.
     */
    showBadge?: boolean;
    /**
     * Badge content.
     */
    badgeContent?: string | number;
}

/**
 * Toggle button component for the copilot panel.
 *
 * @param props - Props injected to the component.
 * @returns Copilot toggle button component.
 */
const CopilotToggleButton: React.FunctionComponent<CopilotToggleButtonProps> = (
    props: CopilotToggleButtonProps
): ReactElement => {
    const {
        className,
        showBadge = false,
        badgeContent,
        ["data-componentid"]: componentId = "copilot-toggle-button"
    } = props;

    const {
        isVisible,
        togglePanel
    } = useCopilotPanel();

    /**
     * Handle button click.
     */
    const handleClick: () => void = useCallback(() => {
        togglePanel();
    }, [ togglePanel ]);

    const inlineButton: ReactElement = (
        <Button
            className={ `copilot-toggle-button ${isVisible ? "active" : ""} ${className || ""}` }
            variant="outlined"
            onClick={ handleClick }
            data-componentid={ componentId }
            startIcon={ <AISparkleIcon width={ 20 } height={ 20 } /> }
        >
            <span className="copilot-toggle-btn-text">Copilot</span>
        </Button>
    );

    return showBadge ? (
        <Badge
            badgeContent={ badgeContent }
            color="error"
            data-componentid={ `${componentId}-badge` }
        >
            { inlineButton }
        </Badge>
    ) : (
        inlineButton
    );
};

export default CopilotToggleButton;
