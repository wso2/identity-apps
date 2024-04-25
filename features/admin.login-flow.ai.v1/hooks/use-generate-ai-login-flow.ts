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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useAILoginFlow from "./use-ai-login-flow";
import generateLoginFlow from "../api/generate-ai-login-flow";
import { GenerateLoginFlowAPIResponseInterface } from "../models/ai-login-flow";
import AutheticatorsRecord from "../models/authenticators-record";
import { ClaimURI } from "../models/claim-uri";

export type GenerateLoginFlowFunction = (
    userQuery: string,
    userClaims: ClaimURI[],
    availableAuthenticators: AutheticatorsRecord[],
    traceId: string
) => Promise<void>;

const useGenerateAILoginFlow = (): GenerateLoginFlowFunction => {
    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const {
        setGeneratingLoginFlow,
        setOperationId
    } = useAILoginFlow();

    /**
     * Generate AI login flow API call function.
     *
     * @param websiteUrl - Website URL.
     * @returns a promise containing the operation ID.
     */
    const generateAILoginFlow = async (
        userQuery: string,
        userClaims: ClaimURI[],
        availableAuthenticators: AutheticatorsRecord[],
        traceId: string
    ): Promise<void> => {

        return generateLoginFlow(userQuery, userClaims, availableAuthenticators, traceId)
            .then(
                (data: GenerateLoginFlowAPIResponseInterface) => {
                    setOperationId(data.operation_id);
                    setGeneratingLoginFlow(true);
                }
            )
            .catch((error: IdentityAppsApiException) => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("ai:aiLoginFlow.notifications.generateError.description"),
                        level: AlertLevels.ERROR,
                        message: error.message || t("ai:aiLoginFlow.notifications.generateError.message")
                    })
                );
            });
    };

    return generateAILoginFlow;
};

export default useGenerateAILoginFlow;
