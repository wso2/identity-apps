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
import Button from "@oxygen-ui/react/Button";
import IconButton from "@oxygen-ui/react/IconButton";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import AiBotAvatar from "./ai-bot-avatar";
import AISparkleIcon from "./ai-sparkle-icon";
import { useCopilotPanel } from "../hooks";
import "./copilot-welcome.scss";

/**
 * Props interface for the CopilotWelcome component.
 */
export interface CopilotWelcomeProps extends IdentifiableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Callback when a suggested action is clicked.
     */
    onSuggestedAction?: (action: string) => void;
}

/**
 * Welcome screen component for the copilot panel.
 *
 * @param props - Props injected to the component.
 * @returns Copilot welcome component.
 */
const CopilotWelcome: React.FunctionComponent<CopilotWelcomeProps> = (
    props: CopilotWelcomeProps
): ReactElement => {
    const {
        className,
        onSuggestedAction,
        ["data-componentid"]: componentId = "copilot-welcome"
    } = props;

    const { t } = useTranslation();
    const { sendMessage, isLoading } = useCopilotPanel();
    const [ inputValue, setInputValue ] = useState<string>("");

    // Suggested actions
    const suggestedActions: Array<{
        id: string;
        text: string;
    }> = [
        {
            id: "authentication-methods",
            text: t("console:common.copilot.welcome.actions.authenticationMethods")
        },
        {
            id: "configure-saml",
            text: t("console:common.copilot.welcome.actions.configureSaml")
        },
        {
            id: "manage-roles",
            text: t("console:common.copilot.welcome.actions.manageRoles")
        }
    ];

    /**
     * Handle suggested action click.
     */
    const handleSuggestedAction: (action: string) => void = useCallback((action: string) => {
        if (onSuggestedAction) {
            onSuggestedAction(action);
        } else {
            sendMessage(action);
        }
    }, [ onSuggestedAction, sendMessage ]);

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
        }
    }, [ inputValue, isLoading, sendMessage ]);

    /**
     * Handle key down for Enter key.
     */
    const handleKeyDown: (event: React.KeyboardEvent) => void = useCallback((event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    }, [ handleSendMessage ]);

    return (
        <Box
            className={ `copilot-welcome ${className || ""}` }
            data-componentid={ componentId }

        >
            { /* Welcome Section */ }
            <Box className="copilot-welcome-content">
                { /* Main welcome content */ }
                <Box className="copilot-welcome-main">
                    <Box className="copilot-avatar-container">
                        <AiBotAvatar size={ 200 } />
                    </Box>

                    <Typography variant="h6" className="copilot-welcome-title">
                        { t("console:common.copilot.welcome.title") }
                    </Typography>

                    <Typography variant="body2" className="copilot-welcome-description">
                        { t("console:common.copilot.welcome.description") }
                    </Typography>
                </Box>

                { /* Suggested Actions */ }
                <Box className="copilot-suggestions">
                    <Typography variant="overline" className="copilot-suggestions-title">
                        { t("console:common.copilot.welcome.suggestionsTitle") }
                    </Typography>

                    <Box className="copilot-suggestions-list">
                        { suggestedActions.map((item: { id: string; text: string }) => (
                            <Button
                                key={ item.id }
                                variant="outlined"
                                onClick={ () => handleSuggestedAction(item.text) }
                                data-componentid={ `${componentId}-action-${item.id}` }
                                className="copilot-suggestion-button"
                                startIcon={ <AISparkleIcon width={ 16 } height={ 16 } /> }
                            >
                                { item.text }
                            </Button>
                        )) }
                    </Box>
                </Box>
            </Box>

            { /* Input Area - Always visible at bottom */ }
            <Box className="copilot-input-container">
                <Box className="copilot-input-wrapper">
                    <TextField
                        fullWidth
                        multiline
                        maxRows={ 4 }
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
                        aria-label={ t("console:common.copilot.welcome.send") }
                        data-componentid={ `${componentId}-send-button` }
                        className="copilot-send-button"
                    >
                        <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                </Box>

                { /* Footer */ }
                <Typography variant="caption" className="copilot-disclaimer">
                    { t("console:common.copilot.welcome.disclaimer") }
                </Typography>
            </Box>
        </Box>
    );
};

export default CopilotWelcome;
