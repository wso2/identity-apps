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

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@oxygen-ui/react/IconButton";
import Typography from "@oxygen-ui/react/Typography";
import React, { ReactElement } from "react";
import AIPrompt from "./ai-prompt";
import AIText from "./ai-text";
import "./ai-generation-modal.scss";

interface AIGenerationModalProps {
    handleModalClose: () => void;
    open: boolean;
    onUserPromptSubmit: () => void;
    setUserPrompt: (prompt: string) => void;
    samplePrompts?: string[];
    userPrompt: string;
}

const AIGenerationModal = ({
    handleModalClose,
    open,
    onUserPromptSubmit,
    setUserPrompt,
    samplePrompts,
    userPrompt
}: AIGenerationModalProps): ReactElement => {
    return (
        <Dialog
            open={ open }
            maxWidth="md"
            className="ai-generation-modal"
        >
            <DialogTitle>
                <IconButton
                    edge="end"
                    size="small"
                    sx={ { float: "right" } }
                    onClick={ () => {
                        setUserPrompt("");
                        handleModalClose();
                    } }
                >
                    <CloseOutlinedIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="h5" sx={ { textAlign: "center", marginBottom: "1em" } }>
                    <span style={ { marginRight: "0.35rem" } }>Generate with</span>
                    <AIText>
                       Registration Flow AI
                    </AIText>
                </Typography>
                <AIPrompt
                    handlePromptSubmit={ onUserPromptSubmit }
                    setUserPrompt={ setUserPrompt }
                    samplePrompts={ samplePrompts }
                    userPrompt={ userPrompt }
                />
            </DialogContent>
        </Dialog>
    );
};

export default AIGenerationModal;
