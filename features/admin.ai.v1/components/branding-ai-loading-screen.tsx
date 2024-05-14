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
import IconButton from "@oxygen-ui/react/IconButton";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as LoadingPlaceholder }
    from "../../themes/wso2is/assets/images/illustrations/ai-loading-screen-placeholder.svg";
import useGetAIBrandingGenerationStatus from "../api/use-get-branding-generation-status";
import {
    FACTS_ROTATION_DELAY,
    PROGRESS_UPDATE_INTERVAL,
    STATUS_PROGRESS_MAP,
    useGetFacts,
    useGetStatusLabels } from "../constants/ai-branding-constants";
import useAIBrandingPreference from "../hooks/use-ai-branding-preference";
import "./branding-ai-loading-screen.scss";

/**
 * AI branding loading screen component.
 *
 * @returns ReactElement containing the AI branding loading screen.
 */
export const LoadingScreen: FunctionComponent = (): ReactElement => {
    const { t } = useTranslation();

    const [ factIndex, setFactIndex ] = useState<number>(0);
    const [ currentProgress, setCurrentProgress ] = useState<number>(0);

    const { operationId, setBrandingGenerationCompleted, setGeneratingBranding } = useAIBrandingPreference();
    const { data } = useGetAIBrandingGenerationStatus(operationId);
    const facts: string[] = useGetFacts();
    const statusLabels: Record<string, string> = useGetStatusLabels();

    const statusProgress: Record<string, number> = STATUS_PROGRESS_MAP;

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
        if (!data) return t("branding:ai.screens.loading.states.0");
        let currentStatusLabel: string = "branding:ai.screens.loading.states.0";

        Object.entries(data.status).forEach(([ key, value ]: [string, boolean]) => {
            if (value && statusLabels[key]) {
                currentStatusLabel = statusLabels[key];
            }
        });

        return t(currentStatusLabel);
    };

    const handleGenerateCancel = () => {
        setGeneratingBranding(false);
        setBrandingGenerationCompleted(false);
    };

    return (
        <Box className="branding-ai-loading-screen-container">
            <Box className="branding-ai-loading-screen-illustration-container">
                <LoadingPlaceholder />
            </Box>
            <Box className="branding-ai-loading-screen-text-container">
                <Box className="mb-5">
                    <Typography
                        variant="h5"
                        className="branding-ai-loading-screen-heading"
                    >
                        { t("branding:ai.screens.loading.didYouKnow") }
                    </Typography>
                    <Typography className="branding-ai-loading-screen-sub-heading">
                        { facts[factIndex] }
                    </Typography>
                </Box>
                <Box sx={ { width: 1 } }>
                    <Box className="branding-ai-loading-screen-loading-container">
                        <Typography className="branding-ai-loading-screen-loading-state">
                            { getCurrentStatus() }
                        </Typography>
                        <Tooltip
                            title="Cancel"
                            placement="top"
                        >
                            <IconButton
                                onClick={ handleGenerateCancel }
                            >
                                <XMarkIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <LinearProgress variant="buffer" value={ currentProgress } valueBuffer={ currentProgress + 1 }  />
                </Box>
            </Box>
        </Box>
    );
};
