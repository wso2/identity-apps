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
import Accordion from "@oxygen-ui/react/Accordion";
import AccordionDetails from "@oxygen-ui/react/AccordionDetails";
import Box from "@oxygen-ui/react/Box";
import Card from "@oxygen-ui/react/Card/Card";
import CardContent from "@oxygen-ui/react/CardContent/CardContent";
import IconButton from "@oxygen-ui/react/IconButton";
import Typography from "@oxygen-ui/react/Typography/Typography";
import React, { ReactElement, useMemo } from "react";

interface AIPromptHistoryProps {
    isHistoryOpen?: boolean;
    handleClose?: () => void;
    promptHistory: string[];
    setUserPrompt: (prompt: string) => void;
}

const AIPromptHistory = ({
    isHistoryOpen,
    handleClose,
    promptHistory,
    setUserPrompt
}: AIPromptHistoryProps): ReactElement => {

    const displayedPrompts: string[] = useMemo(() => {
        if (!promptHistory || promptHistory.length === 0) {
            return [];
        }
        const maxPrompts: number = 3;

        if (promptHistory.length <= maxPrompts) {
            return promptHistory;
        }

        return promptHistory.slice(promptHistory.length - maxPrompts);
    }, [ promptHistory ]);

    return (
        <Accordion
            sx={ {
                backgroundColor: "transparent",
                padding: 0,
                maxWidth: "600px",
                "&:before": { display: "none" }
            } }
            expanded={ isHistoryOpen }
            disableGutters
            elevation={ 0 }
            TransitionProps={ {
                timeout: 400,
                easing: {
                    enter: "ease-out",
                    exit: "ease-in"
                }
            } }
        >
            <AccordionDetails
                className="ai-prompt-history-card-container"
                sx={ { padding: "8px 0 16px" } }
            >
                <Box
                    sx={ {
                        maxWidth: 800,
                        width: "100%",
                        margin: "0 auto",
                        padding: "1rem",
                        backgroundColor: "#fff",
                        borderRadius: 2
                    } }
                >
                    <Box
                        sx={ {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1
                        } }
                    >
                        <Typography
                            variant="subtitle1"
                            sx={ { color: "#333", marginLeft: "5px" } }
                        >
                            History
                        </Typography>
                        <IconButton
                            edge="end"
                            size="small"
                            onClick={ handleClose }
                        >
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Box>

                    { displayedPrompts.length === 0 ? (
                        <Box sx={ { textAlign: "center", color: "#777", py: 2, width: "100%", minWidth: "600px" } }>
                            <Typography variant="body2">
                                No prompts have been saved yet.
                            </Typography>
                        </Box>
                    ) : (
                        <Box
                            sx={ {
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: displayedPrompts.length === 1 ? "1fr" : "1fr 1fr",
                                    md: displayedPrompts.length === 1 ? "1fr" :
                                        displayedPrompts.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr"
                                },
                                gap: 2,
                                width: "100%"
                            } }>
                            { displayedPrompts.map((prompt, i) => (
                                <Card
                                    key={ i }
                                    onClick={ () => setUserPrompt(prompt) }
                                    sx={ {
                                        height: "100%",
                                        borderRadius: 2,
                                        border: "1px solid #eee",
                                        boxShadow: "none",
                                        cursor: "pointer",
                                        "&:hover": {
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                                        }
                                    } }
                                >
                                    <CardContent sx={ { p: 1 } }>
                                        <Typography variant="body2" sx={ { color: "#444", lineHeight: 1.4 } }>
                                            { prompt.length > 200 ? prompt.substring(0, 200) + "..." : prompt }
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )) }
                        </Box>
                    ) }
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default AIPromptHistory;
