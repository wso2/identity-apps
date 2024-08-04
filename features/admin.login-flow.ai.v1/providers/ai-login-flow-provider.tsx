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

import { AuthenticationSequenceInterface } from "@wso2is/admin.applications.v1/models/application";
import { AppState } from "@wso2is/admin.core.v1";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, {  PropsWithChildren, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { useAILoginFlowGenerationResult } from "../api/use-ai-login-flow-generation-result";
import LoginFlowAIBanner from "../components/login-flow-ai-banner";
import LoginFlowAILoadingScreen from "../components/login-flow-ai-loading-screen";
import { LOGIN_FLOW_AI_FEATURE_TAG } from "../constants/login-flow-ai-constants";
import AILoginFlowContext from "../context/ai-login-flow-context";
import { LoginFlowResultStatus } from "../models/ai-login-flow";
import { BannerState } from "../models/banner-state";

export type AILoginFlowProviderProps = unknown;

/**
 * Provider for the sign on methods context.
 *
 * @param props - Props for the client.
 * @returns Sign On Mehtods provider.
 */
const AILoginFlowProvider = (props: PropsWithChildren<AILoginFlowProviderProps>): React.ReactElement=>{

    const { children } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { isSubOrganization } = useGetCurrentOrganizationType();

    const applicationDisabledFeatures: string[] = useSelector((state: AppState) =>
        state.config.ui.features?.applications?.disabledFeatures);

    const [ aiGeneratedLoginFlow, setAiGeneratedLoginFlow ] = useState<AuthenticationSequenceInterface>(undefined);
    const [ operationId, setOperationId ] = useState<string>();
    const [ isGeneratingLoginFlow, setGeneratingLoginFlow ] = useState<boolean>(false);
    const [ loginFlowGenerationCompleted, setLoginFlowGenerationCompleted ] = useState<boolean>(false);
    const [ promptHistory, setPromptHistory ] = useState<string[]>([]);
    const [ userPrompt, setUserPrompt ] = useState<string>("");
    const [ bannerState, setBannerState ] = useState<BannerState>(BannerState.FULL);

    /**
     * Custom hook to get the login flow generation result.
     */
    const { data, error } = useAILoginFlowGenerationResult(operationId, loginFlowGenerationCompleted);

    useEffect(() => {
        if (error) {
            setGeneratingLoginFlow(false);
            setLoginFlowGenerationCompleted(false);

            dispatch(
                addAlert<AlertInterface>({
                    description: t("ai:aiLoginFlow.notifications.generateResultError.description"),
                    level: AlertLevels.ERROR,
                    message: t("ai:aiLoginFlow.notifications.generateResultError.message")
                })
            );

            return;
        }

        if (data?.status === LoginFlowResultStatus.FAILED) {
            setGeneratingLoginFlow(false);
            setLoginFlowGenerationCompleted(false);

            // if data.data contains an object error then use that as the error message
            const errorMessage: string = "error" in data.data
                ? data.data.error : t("ai:aiLoginFlow.notifications.generateResultFailed.message");

            dispatch(
                addAlert<AlertInterface>({
                    description: errorMessage,
                    level: AlertLevels.ERROR,
                    message: t("ai:aiLoginFlow.notifications.generateResultFailed.message")
                })
            );

            return;
        }

        // data.data is of type AuthenticationSequenceInterface use it to generate the login flow
        if (data?.status === LoginFlowResultStatus.COMPLETED && "type" in data.data) {
            handleGenerate(data.data as AuthenticationSequenceInterface);
        }
    }, [ data, loginFlowGenerationCompleted ]);

    /**
     * Function to process the API response and generate the login flow.
     *
     * @param data - Data from the API response.
     */
    const handleGenerate = (data: AuthenticationSequenceInterface) => {
        setAiGeneratedLoginFlow(data);
        setGeneratingLoginFlow(false);
        setLoginFlowGenerationCompleted(false);
    };

    const updatePromptHistory = (prompt: string) => {
        // Only keep the last 3 prompts
        // If the prompt is already in the history, remove it and add it to the top
        if (promptHistory.includes(prompt)) {
            setPromptHistory([ prompt, ...promptHistory.filter((item: string) => item !== prompt) ]);
        } else {
            setPromptHistory([ prompt, ...promptHistory.slice(0, 2) ]);
        }
    };

    return (
        <AILoginFlowContext.Provider
            value={ {
                aiGeneratedLoginFlow,
                bannerState,
                handleGenerate,
                isGeneratingLoginFlow,
                loginFlowGenerationCompleted,
                operationId,
                promptHistory,
                setBannerState,
                setGeneratingLoginFlow,
                setLoginFlowGenerationCompleted,
                setOperationId,
                setUserPrompt,
                updatePromptHistory,
                userPrompt
            } }
        >
            {
                isGeneratingLoginFlow ? (
                    <LoginFlowAILoadingScreen />
                ) : (
                    <>
                        {
                            !applicationDisabledFeatures?.includes(LOGIN_FLOW_AI_FEATURE_TAG) &&
                            !isSubOrganization() && (
                                <div className="mb-2">
                                    <LoginFlowAIBanner/>
                                </div>
                            )
                        }
                        { children }
                    </>
                )
            }
        </AILoginFlowContext.Provider>
    );
};

export default AILoginFlowProvider;
