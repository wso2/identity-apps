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

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AILoadingScreen from "../../common.ai.v1/components/components/ai-loading-screen";
import useGetAIBrandingGenerationStatus from "../api/use-get-branding-generation-status";
import {
    FACTS_ROTATION_DELAY,
    PROGRESS_UPDATE_INTERVAL,
    STATUS_PROGRESS_MAP,
    useGetFacts,
    useGetStatusLabels } from "../constants/ai-branding-constants";
import useAIBrandingPreference from "../hooks/use-ai-branding-preference";

/**
 * AI branding loading screen component.
 *
 * @returns ReactElement containing the AI branding loading screen.
 */
export const BrandingAILoadingScreen: FunctionComponent = (): ReactElement => {
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
        <AILoadingScreen
            currentLoadingState={ getCurrentStatus() }
            currentProgress={ currentProgress }
            fact={ facts[factIndex] }
            handleGenerateCancel={ handleGenerateCancel }
        />
    );
};
