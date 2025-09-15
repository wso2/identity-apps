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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useAIGeneratedPasswordRecoveryFlow from "./use-ai-generated-password-recovery-flow";
import generatePasswordRecoveryFlow from "../api/generate-ai-password-recovery-flow";

export type UseGeneratePasswordRecoveryFlowFunction = (
    userQuery: string,
    traceId: string
) => Promise<void>;

const useGeneratePasswordRecoveryFlow = (): UseGeneratePasswordRecoveryFlowFunction => {
    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const {
        setIsFlowGenerating,
        setOperationId
    } = useAIGeneratedPasswordRecoveryFlow();

    /**
     * Generate AI password recovery flow API call function.
     *
     * @param websiteUrl - Website URL.
     * @returns a promise containing the operation ID.
     */
    const generateAIPasswordRecoveryFlow = async (
        userQuery: string,
        traceId: string
    ): Promise<void> => {

        return generatePasswordRecoveryFlow(userQuery, traceId)
            .then((data: any) => {
                setOperationId(data.operation_id);
                setIsFlowGenerating(true);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.code === 422) {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("ai:aiPasswordRecoveryFlow.notifications.generateInputError.description"),
                            level: AlertLevels.ERROR,
                            message: t("ai:aiPasswordRecoveryFlow.notifications.generateInputError.message")
                        })
                    );

                    return;
                }

                if (error?.code === 429) {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("ai:aiPasswordRecoveryFlow.notifications.generateLimitError.description"),
                            level: AlertLevels.ERROR,
                            message: t("ai:aiPasswordRecoveryFlow.notifications.generateLimitError.message")
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert<AlertInterface>({
                        description: t("ai:aiPasswordRecoveryFlow.notifications.generateError.description"),
                        level: AlertLevels.ERROR,
                        message: error.message || t("ai:aiPasswordRecoveryFlow.notifications.generateError.message")
                    })
                );
            });
    };

    return generateAIPasswordRecoveryFlow;
};

export default useGeneratePasswordRecoveryFlow;
