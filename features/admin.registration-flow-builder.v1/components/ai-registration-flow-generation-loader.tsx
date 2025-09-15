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
import { Dialog, DialogContent, DialogTitle, IconButton, LinearProgress, Typography } from "@mui/material";
import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import AIBot
    from "../../themes/wso2is/assets/images/illustrations/ai-bot.svg";
import useAIRegistrationFlowGenerationStatus from "../api/use-ai-registration-flow-status";
import {
    FACTS_ROTATION_DELAY,
    PROGRESS_UPDATE_INTERVAL,
    statusProgressMap,
    useGetFacts,
    useGetStatusLabels
} from "../constants/registration-flow-ai-constants";
import useAIGeneratedRegistrationFlow from "../hooks/use-ai-generated-registration-flow";

const RegistrationFlowAILoader = (): ReactElement => {

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const statusLabels: Record<string, string> = useGetStatusLabels();

    const {
        setIsFlowGenerating,
        setFlowGenerationCompleted
    } = useAIGeneratedRegistrationFlow();

    const { data, error } = useAIRegistrationFlowGenerationStatus();
    const facts: string[] = useGetFacts();

    const [ currentProgress, setCurrentProgress ] = useState<number>(0);
    const [ factIndex, setFactIndex ] = useState<number>(0);
    const [ showModal, setShowModal ] = useState<boolean>(true);

    const statusProgress: Record<string, number> = statusProgressMap;

    useEffect(() => {
        const targetProgress: number = getProgress();

        const interval: ReturnType<typeof setInterval> = setInterval(() => {
            setCurrentProgress((prevProgress: number) => {
                if (prevProgress >= targetProgress) {
                    clearInterval(interval);

                    return targetProgress;
                } else {
                    return prevProgress + 1;
                }
            });
        }, PROGRESS_UPDATE_INTERVAL);

        return () => clearInterval(interval);
    }, [ data ]);

    useEffect(() => {
        const interval: ReturnType<typeof setInterval> = setInterval(() => {
            setFactIndex((factIndex + 1) % facts.length);
        }, FACTS_ROTATION_DELAY);

        return () => clearInterval(interval);
    }, [ factIndex ]);

    useEffect(() => {
        if (error) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("ai:aiRegistrationFlow.notifications.generateStatusError.description"),
                    level: AlertLevels.ERROR,
                    message: t("ai:aiRegistrationFlow.notifications.generateStatusError.message")
                })
            );
        }
    }, [ error ]);

    /**
     * Get the current progress based on the status.
     *
     * @returns The current progress based on the status.
     */
    const getProgress = () => {
        if (!data) return 0;

        // Find the last completed status based on the predefined progress mapping.
        let maxProgress: number = 0;

        Object.entries(data.status).forEach(([ key, value ]: [string, boolean]) => {
            if (value && statusProgress[key] > maxProgress) {
                maxProgress = statusProgress[key];
            }
        });

        return maxProgress;
    };

    /**
     * Get the current status based on the status object in the API response.
     *
     * @returns The current status.
     */
    const getCurrentStatus = () => {
        if (!data) return t("ai:aiRegistrationFlow.states.0");
        let currentStatusLabel: string = "ai:aiRegistrationFlow.states.0";

        Object.entries(data.status).forEach(([ key, value ]: [string, boolean]) => {
            if (value && statusLabels[key]) {
                currentStatusLabel = statusLabels[key];
            }
        });

        return t(currentStatusLabel);
    };

    const handleGenerateCancel = () => {
        setIsFlowGenerating(false);
        setFlowGenerationCompleted(false);
        setShowModal(false);
    };

    return (
        <Dialog
            open={ showModal }
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle sx={ { pb: 0, pr: 2 } }>
                <IconButton
                    edge="end"
                    size="small"
                    sx={ { float: "right" } }
                    onClick={ handleGenerateCancel }
                >
                    <CloseOutlinedIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={ {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    px: 2,
                    pb: 3
                } }
            >
                <img
                    src={ AIBot }
                    alt="AI Bot"
                    style={ {
                        width: "200px",
                        height: "auto",
                        marginBottom: "1rem"
                    } }
                />

                <Typography variant="body1" mb={ 2 } textAlign="center">
                    {  getCurrentStatus() }
                </Typography>

                <LinearProgress
                    variant="buffer"
                    value={ currentProgress }
                    valueBuffer={ currentProgress + (1 + Math.random() * 10) }
                    sx={ {
                        width: "100%",
                        margin: "0 auto",
                        height: "5px"
                    } }
                />
            </DialogContent>
        </Dialog>

    );
};

export default RegistrationFlowAILoader;
