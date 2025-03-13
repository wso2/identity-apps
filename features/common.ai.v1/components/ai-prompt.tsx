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
import React, { ReactElement } from "react";

interface AIPromptProps {
    handlePromptSubmit?: () => void;
    setUserPrompt?: (value: string) => void;
    samplePrompts?: string[];
    userPrompt: string;
    showHistory?: boolean;
}

const AIPrompt = ({
    handlePromptSubmit,
    setUserPrompt,
    samplePrompts,
    userPrompt,
    showHistory = true
}: AIPromptProps): ReactElement => {

    const handleSurpriseMe = () => {
        const randomPrompt: string = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];

        setUserPrompt(randomPrompt);
    };

    return (
        <Box
            sx={ {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                backgroundColor: "#f5f5f5",
                p: 2,
                borderRadius: 4,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                width: "fit-content",
                mx: "auto"
            } }
        >
            <Box
                sx={ {
                    backgroundColor: "#fff",
                    borderTopLeftRadius: "2rem",
                    borderTopRightRadius: "2rem",
                    display: "flex",
                    alignItems: "center",
                    minWidth: 600,
                    paddingTop: "14px",
                    paddingBottom: "12px",
                    paddingLeft: "22px",
                    paddingRight: "22px"
                } }
            >
                <InputBase
                    placeholder="Describe your flow to AI"
                    multiline
                    maxRows={ 4 }
                    value={ userPrompt }
                    onChange={ (e) => setUserPrompt(e.target.value) }
                    sx={ {
                        flex: 1,
                        color: "#333",
                        fontSize: "1rem"
                    } }
                />
            </Box>
            <Box
                sx={ {
                    justifyContent: "space-between",
                    backgroundColor: "#fff",
                    borderBottomLeftRadius: "2rem",
                    borderBottomRightRadius: "2rem",
                    display: "flex",
                    alignItems: "center",
                    paddingBottom: "14px",
                    paddingTop: "8px",
                    minWidth: 600,
                    px: 2
                } }
            >
                <Stack direction="row" spacing={ 1 }>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={ <LightbulbOutlinedIcon /> }
                        sx={ {
                            border: "1px solid #E8E8E8",
                            color: "#666",
                            mr: 2,
                            height: 40,
                            fontSize: "13px"
                        } }
                        onClick={ () => handleSurpriseMe() }
                    >
                            Suggestions
                    </Button>
                    { showHistory && (
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={ <HistoryOutlinedIcon /> }
                            sx={ {
                                border: "1px solid #E8E8E8",
                                color: "#666",
                                fontSize: "13px",
                                height: 40,
                                mr: 2
                            } }
                            onClick={ null }
                        >
                                History
                        </Button>
                    ) }
                </Stack>
                <IconButton
                    onClick={ () => handlePromptSubmit() }
                    color="primary"
                    sx={ {
                        float: "right",
                        ml: 2,
                        backgroundColor: "primary.main",
                        color: "#fff",
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        "&:hover": {
                            backgroundColor: "primary.dark"
                        }
                    } }
                >
                    <SendOutlinedIcon />
                </IconButton>
            </Box>
            <Typography
                variant="body2"
                sx={ {
                    textAlign: "center",
                    color: "#555",
                    marginTop: 1
                } }
            >
                Registration flow AI can make mistakes. Check important info.
            </Typography>
        </Box>
    );
};

export default AIPrompt;
