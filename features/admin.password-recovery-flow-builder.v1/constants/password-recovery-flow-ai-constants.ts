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

import { AppState } from "@wso2is/admin.core.v1/store";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const useGetFacts = (): string[] => {
    const { t } = useTranslation();
    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

    return [
        t("ai:aiFlow.screens.loading.facts.0", { productName }),
        t("ai:aiFlow.screens.loading.facts.1", { productName }),
        t("ai:aiFlow.screens.loading.facts.2", { productName })
    ];
};

export const useGetStatusLabels = (): Record<string, string> => {
    const { t } = useTranslation();

    return {
        completed: t("ai:aiFlow.states.3"),
        fetchingSamples: t("ai:aiFlow.states.1"),
        generatingFlow: t("ai:aiFlow.states.2"),
        optimizingQuery: t("ai:aiFlow.states.0")
    };
};

export const statusProgressMap: Record<string, number> = {
    completed: 100,
    fetchingSamples: 50,
    generatingFlow: 75,
    optimizingQuery: 0
};

export const INITIAL_PROGRESS: number = 5;
export const INCREMENT: number = 0.5;
export const FACTS_ROTATION_DELAY: number = 8000;
export const PROGRESS_UPDATE_INTERVAL: number = 100;
export const PASSWORD_RECOVERY_FLOW_AI_PROMPT_HISTORY_PREFERENCE_KEY: string = "passwordRecoveryFlowAIPrompts";
