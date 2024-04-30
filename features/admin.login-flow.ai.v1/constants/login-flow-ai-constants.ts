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

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppState } from "../../admin.core.v1";

export const useGetFacts = (): string[] => {
    const { t } = useTranslation();
    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

    return [
        t("ai:aiLoginFlow.screens.loading.facts.0", { productName }),
        t("ai:aiLoginFlow.screens.loading.facts.1", { productName }),
        t("ai:aiLoginFlow.screens.loading.facts.2", { productName })
    ];
};

export const useGetStatusLabels = (): Record<string, string> => {
    const { t } = useTranslation();

    return {
        generating_login_flow_authenticators: t("ai:aiLoginFlow.screens.loading.states.7"),
        generating_login_flow_script: t("ai:aiLoginFlow.screens.loading.states.5"),
        generation_of_login_flow_authenticators_complete: t("ai:aiLoginFlow.screens.loading.states.8"),
        generation_of_login_flow_script_complete: t("ai:aiLoginFlow.screens.loading.states.6"),
        login_flow_generation_complete: t("ai:aiLoginFlow.screens.loading.states.10"),
        optimization_and_validation_complete: t("ai:aiLoginFlow.screens.loading.states.2"),
        optimizing_and_validating_final_login_flow: t("ai:aiLoginFlow.screens.loading.states.9"),
        optimizing_and_validating_user_query: t("ai:aiLoginFlow.screens.loading.states.1"),
        retrieval_of_examples_complete: t("ai:aiLoginFlow.screens.loading.states.4"),
        retrieving_examples: t("ai:aiLoginFlow.screens.loading.states.3")
    };
};

export const STATUS_SEQUENCE: string[] = [
    "optimizing_and_validating_user_query",
    "optimization_and_validation_complete",
    "retrieving_examples",
    "retrieval_of_examples_complete",
    "generating_login_flow_script",
    "generation_of_login_flow_script_complete",
    "generating_login_flow_authenticators",
    "generation_of_login_flow_authenticators_complete",
    "optimizing_and_validating_final_login_flow",
    "login_flow_generation_complete"
];

export const STATUS_PROGRESS_MAP: Record<string, number> = {
    generating_login_flow_authenticators: 97,
    generating_login_flow_script: 95,
    generation_of_login_flow_authenticators_complete: 98,
    generation_of_login_flow_script_complete: 96,
    login_flow_generation_complete: 100,
    optimization_and_validation_complete: 40,
    optimizing_and_validating_final_login_flow: 99,
    optimizing_and_validating_user_query: 20,
    retrieval_of_examples_complete: 90,
    retrieving_examples: 70
};

export const INITIAL_PROGRESS: number = 5;
export const INCREMENT: number = 0.5;
export const FACTS_ROTATION_DELAY: number = 8000;
export const PROGRESS_UPDATE_INTERVAL: number = 100;

export const LOGIN_FLOW_AI_FEATURE_TAG: string = "applications.loginFlow.ai";
