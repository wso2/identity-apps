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
        t("ai:aiPasswordRecoveryFlow.screens.loading.facts.0", { productName }),
        t("ai:aiPasswordRecoveryFlow.screens.loading.facts.1", { productName }),
        t("ai:aiPasswordRecoveryFlow.screens.loading.facts.2", { productName })
    ];
};

export const useGetStatusLabels = (): Record<string, string> => {
    const { t } = useTranslation();

    return {
        generating_password_recovery_flow: t("ai:aiPasswordRecoveryFlow.states.5"),
        generation_of_password_recovery_flow_complete: t("ai:aiPasswordRecoveryFlow.states.6"),
        generation_of_password_recovery_step_complete: t("ai:aiPasswordRecoveryFlow.states.10"),
        optimization_and_validation_complete: t("ai:aiPasswordRecoveryFlow.states.2"),
        optimizing_and_validating_user_query: t("ai:aiPasswordRecoveryFlow.states.1"),
        retrieval_of_examples_complete: t("ai:aiPasswordRecoveryFlow.states.4"),
        retrieving_examples: t("ai:aiPasswordRecoveryFlow.states.3")
    };
};

export const statusProgressMap: Record<string, number> = {
    generating_password_recovery_flow: 75,
    generation_of_password_recovery_flow_complete: 100,
    generation_of_password_recovery_step_complete: 80,
    optimization_and_validation_complete: 40,
    optimizing_and_validating_user_query: 20,
    retrieval_of_examples_complete: 70,
    retrieving_examples: 60
};

export const INITIAL_PROGRESS: number = 5;
export const INCREMENT: number = 0.5;
export const FACTS_ROTATION_DELAY: number = 8000;
export const PROGRESS_UPDATE_INTERVAL: number = 100;
export const PASSWORD_RECOVERY_FLOW_AI_PROMPT_HISTORY_PREFERENCE_KEY: string = "passwordRecoveryFlowAIPrompts";
