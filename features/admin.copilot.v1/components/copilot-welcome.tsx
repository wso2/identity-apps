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
import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DocumentationLink, useDocumentation } from "@wso2is/react-components";
import React, { ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import AiBotAvatar from "./ai-bot-avatar";
import AISparkleIcon from "./ai-sparkle-icon";
import {
    StyledCopilotInput,
    StyledSuggestionButton
} from "./copilot-styles";
import useCopilotPanel from "../hooks/use-copilot-panel";

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
    const { getLink } = useDocumentation();
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
    const handleKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void =
        useCallback((event: React.KeyboardEvent<HTMLElement>) => {
            if (event.nativeEvent.isComposing) {
                return;
            }

            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
            }
        }, [ handleSendMessage ]);

    return (
        <Stack
            direction="column"
            className={ className }
            data-componentid={ componentId }
            sx={ { height: "100%" } }
        >
            { /* Welcome Section */ }
            <Stack
                direction="column"
                sx={ { flex: 1, minHeight: 0, overflowX: "hidden", overflowY: "auto" } }
            >
                { /* Main welcome content */ }
                <Stack
                    direction="column"
                    alignItems="center"
                    sx={ { flex: 1, pt: 3, px: 3, textAlign: "center" } }
                >
                    <Box sx={ { mb: 1.5 } }>
                        <AiBotAvatar size={ 200 } />
                    </Box>

                    <Typography
                        variant="h6"
                        sx={ { fontSize: 18, fontWeight: 600, mb: 2 } }
                    >
                        { t("console:common.copilot.welcome.title") }
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={ { lineHeight: 1.5, maxWidth: 400, mb: 3 } }
                    >
                        { t("console:common.copilot.welcome.description") }
                    </Typography>
                </Stack>

                { /* Suggested Actions */ }
                <Box sx={ { p: 3 } }>
                    <Typography
                        variant="overline"
                        color="text.secondary"
                        display="block"
                        sx={ { fontWeight: 600, mb: 1, textAlign: "left" } }
                    >
                        { t("console:common.copilot.welcome.suggestionsTitle") }
                    </Typography>

                    <Stack direction="row" sx={ { flexWrap: "wrap", gap: 1.5 } }>
                        { suggestedActions.map((item: { id: string; text: string }) => (
                            <StyledSuggestionButton
                                key={ item.id }
                                variant="text"
                                onClick={ () => handleSuggestedAction(item.text) }
                                data-componentid={ `${componentId}-action-${item.id}` }
                                startIcon={ <AISparkleIcon width={ 16 } height={ 16 } /> }
                                sx={ { whiteSpace: "nowrap" } }
                            >
                                { item.text }
                            </StyledSuggestionButton>
                        )) }
                    </Stack>
                </Box>
            </Stack>

            { /* Input Area - Always visible at bottom */ }
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
                        aria-label={ t("console:common.copilot.welcome.send") }
                        data-componentid={ `${componentId}-send-button` }
                        sx={ (theme: import("@mui/material/styles").Theme) => ({
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
                    sx={ { fontSize: 11, lineHeight: 1.4, mt: 1.5, textAlign: "center" } }
                >
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

export default CopilotWelcome;
