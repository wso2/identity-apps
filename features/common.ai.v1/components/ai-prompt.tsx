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

import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import {
    Box,
    IconButton,
    InputBase,
    Typography
} from "@mui/material";
import Button from "@oxygen-ui/react/Button";
import Stack from "@oxygen-ui/react/Stack";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DocumentationLink, useDocumentation } from "@wso2is/react-components";
import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import AIPromptHistory from "./ai-prompt-history";
import useAIPromptHistory from "../hooks/use-ai-prompt-history";
import "./ai-prompt.scss";

interface AIPromptProps extends IdentifiableComponentInterface {
    handlePromptSubmit?: () => void;
    setUserPrompt?: (value: string) => void;
    samplePrompts?: string[];
    userPrompt: string;
    showHistory?: boolean;
    promptHistoryPreferenceKey?: string;
}

const AIPrompt = ({
    handlePromptSubmit,
    setUserPrompt,
    samplePrompts,
    userPrompt,
    promptHistoryPreferenceKey,
    showHistory = true,
    "data-componentid": componentId = "ai-prompt"
}: AIPromptProps): ReactElement => {

    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const { addPrompt, prompts } = useAIPromptHistory(promptHistoryPreferenceKey);

    const [ showPromptHistory, setShowPromptHistory ] = useState<boolean>(false);

    const handleSurpriseMe = () => {
        const randomPrompt: string = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];

        setUserPrompt(randomPrompt);
    };

    return (
        <Box
            className="ai-prompt-container"
            data-componentid={ `${ componentId }-container` }
        >
            <Box className="ai-prompt-input-container">
                <InputBase
                    className="ai-prompt-input"
                    data-componentid={ `${ componentId }-input` }
                    placeholder="Describe your flow to AI"
                    multiline
                    maxRows={ 4 }
                    value={ userPrompt }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => setUserPrompt(e.target.value) }
                />
            </Box>
            <Box className="ai-prompt-actions-container">
                <Stack direction="row" spacing={ 1 }>
                    <Button
                        className="ai-prompt-suggestions-button"
                        data-componentid={ `${ componentId }-suggestions-button` }
                        size="small"
                        variant="outlined"
                        startIcon={ <LightbulbOutlinedIcon /> }
                        onClick={ () => handleSurpriseMe() }
                    >
                        Suggestions
                    </Button>
                    { showHistory && (
                        <Button
                            className="ai-prompt-history-button"
                            data-componentid={ `${ componentId }-history-button` }
                            size="small"
                            variant="outlined"
                            startIcon={ <HistoryOutlinedIcon /> }
                            onClick={ () => setShowPromptHistory(true) }
                        >
                            History
                        </Button>
                    ) }
                </Stack>
                <IconButton
                    className="ai-prompt-submit-button"
                    data-componentid={ `${ componentId }-submit-button` }
                    onClick={ () => {
                        addPrompt(userPrompt);
                        handlePromptSubmit();
                    } }
                    color="primary"
                    disabled={ !userPrompt }
                >
                    <SendOutlinedIcon />
                </IconButton>
            </Box>
            {
                showPromptHistory && (
                    <AIPromptHistory
                        promptHistory={ prompts }
                        setUserPrompt={ setUserPrompt }
                        handleClose={ () => setShowPromptHistory(false) }
                    />
                )
            }
            <Typography
                className="ai-prompt-disclaimer"
                data-componentid={ `${ componentId }-disclaimer` }
                variant="body2"
            >
                { t("ai:aiRegistrationFlow.disclaimer") }
                <DocumentationLink
                    link={ getLink("common.termsOfService") }
                >
                    { t("ai:aiLoginFlow.termsAndConditions") }
                </DocumentationLink>
            </Typography>
        </Box>
    );
};

export default AIPrompt;
