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

import { Theme, alpha, styled } from "@mui/material/styles";
import Badge from "@oxygen-ui/react/Badge";
import Button from "@oxygen-ui/react/Button";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement, useCallback } from "react";
import { useTranslation } from "react-i18next";
import AISparkleIcon from "./ai-sparkle-icon";
import useCopilotPanel from "../hooks/use-copilot-panel";

const StyledCopilotToggleButton: typeof Button = styled(Button)(({ theme }: { theme: Theme }) => ({
    "& .MuiButton-startIcon": {
        marginLeft: 0,
        marginRight: 0
    },
    "& .ai-sparkle-icon": {
        "& path": {
            fill: theme.palette.primary.main,
            transition: "all 0.3s ease-in-out"
        },
        height: 20,
        width: 20
    },
    "&.MuiButton-root": {
        gap: theme.spacing(0.5)
    },
    "&.active": {
        "& .ai-sparkle-icon path": {
            fill: theme.palette.primary.main
        },
        "& .copilot-toggle-btn-text": {
            backgroundImage: `linear-gradient(
                93deg,
                var(--oxygen-palette-gradients-primary-stop2, ${theme.palette.primary.main}) 50%,
                var(--oxygen-palette-gradients-primary-stop1, ${theme.palette.primary.light}) 100%
            )`,
            color: "transparent"
        },
        backgroundImage: `linear-gradient(
            93deg,
            ${alpha(theme.palette.primary.main, 0.05)} 50%,
            ${alpha(theme.palette.primary.light, 0.05)} 88.67%,
            ${alpha(theme.palette.primary.light, 0.05)} 112.88%
        )`,
        border: `1.5px solid ${theme.palette.primary.main}`
    },
    "&:hover:not(.active), &.MuiButton-root:hover:not(.active)": {
        "& .ai-sparkle-icon path": {
            fill: "var(--oxygen-palette-primary-contrastText, #ffffff)"
        },
        "& .copilot-toggle-btn-text": {
            color: "var(--oxygen-palette-primary-contrastText, #ffffff)"
        },
        backgroundImage: `linear-gradient(
            93deg,
            var(--oxygen-palette-gradients-primary-stop2, ${theme.palette.primary.main}) 50%,
            var(--oxygen-palette-gradients-primary-stop1, ${theme.palette.primary.light}) 100%
        )`,
        border: `1.5px solid ${theme.palette.primary.light}`,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
    },
    backgroundImage: `linear-gradient(
        93deg,
        ${alpha(theme.palette.primary.main, 0.05)} 50%,
        ${alpha(theme.palette.primary.light, 0.05)} 88.67%,
        ${alpha(theme.palette.primary.light, 0.05)} 112.88%
    )`,
    border: `1.5px solid ${theme.palette.primary.main}`,
    borderRadius: 16,
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: 700,
    lineHeight: "20px",
    marginRight: theme.spacing(1),
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    textTransform: "none",
    transition: "background-image 0.3s ease-in-out"
}));

const StyledCopilotToggleButtonText: React.ComponentType<React.HTMLAttributes<HTMLSpanElement>> =
    styled("span")(() => ({
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        backgroundImage: `linear-gradient(
        93deg,
        var(--oxygen-palette-gradients-primary-stop2, #FF7300) 50%,
        var(--oxygen-palette-gradients-primary-stop1, #FF9A40) 100%
    )`,
        color: "transparent",
        transition: "background-position .2s, outline-width .2s"
    }));

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
        badgeContent,
        showBadge = false,
        ["data-componentid"]: componentId = "copilot-toggle-button"
    } = props;

    const { t } = useTranslation();

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
        <StyledCopilotToggleButton
            className={ `copilot-toggle-button ${isVisible ? "active" : ""} ${className || ""}` }
            variant="outlined"
            onClick={ handleClick }
            data-componentid={ componentId }
            startIcon={ <AISparkleIcon width={ 20 } height={ 20 } /> }
        >
            { /* TODO: Switch back to "Copilot" once branding is finalized */ }
            <StyledCopilotToggleButtonText className="copilot-toggle-btn-text">
                { t("console:common.copilot.title") }
            </StyledCopilotToggleButtonText>
        </StyledCopilotToggleButton>
    );

    if (showBadge) {
        return (
            <Badge
                badgeContent={ badgeContent }
                color="error"
                data-componentid={ `${componentId}-badge` }
            >
                { inlineButton }
            </Badge>
        );
    }

    return inlineButton;
};

export default CopilotToggleButton;
