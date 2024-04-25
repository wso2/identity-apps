/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import Typography from "@oxygen-ui/react/Typography";
import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, useDocumentation } from "@wso2is/react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { ReactComponent as LoadingPlaceholder }
    from "../../themes/wso2is/assets/images/illustrations/ai-loading-screen-placeholder.svg";
import { useAILoginFlowGenerationStatus } from "../api/use-ai-login-flow-generation-status";
import {
    FACTS_ROTATION_DELAY,
    PROGRESS_UPDATE_INTERVAL,
    STATUS_PROGRESS_MAP,
    useGetFacts,
    useGetStatusLabels
} from "../constants/login-flow-ai-constants";
import "./login-flow-ai-loading-screen.scss";

const LoginFlowAILoadingScreen = ( { traceId }: { traceId: string } ): JSX.Element => {

    const { t } = useTranslation();

    const { getLink } = useDocumentation();

    const dispatch: Dispatch = useDispatch();

    const statusLabels: Record<string, string> = useGetStatusLabels();

    const facts: string[] = useGetFacts();

    const { data, isLoading, error } = useAILoginFlowGenerationStatus(traceId);

    const [ currentProgress, setCurrentProgress ] = useState<number>(0);
    const [ factIndex, setFactIndex ] = useState<number>(0);

    const statusProgress: Record<string, number> = STATUS_PROGRESS_MAP;

    useEffect(() => {
        const targetProgress: number = getProgress();

        const interval: NodeJS.Timeout = setInterval(() => {
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
        const interval: NodeJS.Timeout = setInterval(() => {
            setFactIndex((factIndex + 1) % facts.length);
        }, FACTS_ROTATION_DELAY);

        return () => clearInterval(interval);
    }, [ factIndex ]);

    useEffect(() => {
        if (error) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("ai:aiLoginFlow.notifications.generateStatusError.description"),
                    level: AlertLevels.ERROR,
                    message: t("ai:aiLoginFlow.notifications.generateStatusError.message")
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
        if (!data) return t("ai:aiLoginFlow.screens.loading.states.0");
        let currentStatusLabel: string = "ai:aiLoginFlow.screens.loading.states.0";

        Object.entries(data.status).forEach(([ key, value ]: [string, boolean]) => {
            if (value && statusLabels[key]) {
                currentStatusLabel = statusLabels[key];
            }
        });

        return t(currentStatusLabel);
    };

    return (
        <Box className="login-flow-ai-loading-screen-parent">
            <Box className="login-flow-ai-loading-screen-container">
                <Box className="login-flow-ai-loading-screen-illustration-container">
                    <LoadingPlaceholder />
                </Box>
                <Box className="login-flow-ai-loading-screen-text-container">
                    <Box className="mb-5">
                        <Typography
                            variant="h5"
                            className="login-flow-ai-loading-screen-heading"
                        >
                            { t("ai:aiLoginFlow.didYouKnow") }
                        </Typography>
                        <Typography className="login-flow-ai-loading-screen-sub-heading">
                            { facts[factIndex] }
                        </Typography>
                    </Box>
                    <Box sx={ { width: 1 } }>
                        <Box className="login-flow-ai-loading-screen-loading-container">
                            { isLoading && <CircularProgress size={ 20 } sx={ { mr: 2 } } /> }
                            <Typography className="login-flow-ai-loading-screen-loading-state">
                                { getCurrentStatus() }
                            </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={ currentProgress } />
                    </Box>
                </Box>
            </Box>
            <Typography variant="caption">
                { t("ai:aiLoginFlow.disclaimer") }
                <DocumentationLink
                    link={ getLink("common.termsOfService") }
                >
                    { t("ai:aiLoginFlow.termsAndConditions") }
                </DocumentationLink>
            </Typography>
        </Box>
    );
};

export default LoginFlowAILoadingScreen;
