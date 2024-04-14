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

import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import useAIBrandingPreference from "features/admin.ai.v1/hooks/use-ai-branding-preference";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import generateBrandingPreference from "../api/generate-branding-preference";
import { GenerateBrandingAPIResponseInterface } from "../models/branding-preferences";

export type GenerateAIBrandingPreferenceFunc = (website_url: string, tenant: string) => Promise<void>;

const useGenerateAIBrandingPreference = (): GenerateAIBrandingPreferenceFunc => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const { setOperationId } = useAIBrandingPreference();

    const generateAIBrandingPreference = (
        website_url: string,
        tenant: string
    ): Promise<void> => {

        return generateBrandingPreference(website_url, tenant)
            .then(
                (data: GenerateBrandingAPIResponseInterface) => {
                    setOperationId(data.operationId);
                    dispatch(
                        addAlert<AlertInterface>({
                            description: t("branding:brandingCustomText.notifications.updateSuccess.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("branding:brandingCustomText.notifications.updateSuccess.message")
                        })
                    );
                }
            )
            .catch(() => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("branding:brandingCustomText.notifications.updateError.description"),
                        level: AlertLevels.ERROR,
                        message: t("branding:brandingCustomText.notifications.updateError.message")
                    }));
            });
    };

    return generateAIBrandingPreference;
};

export default useGenerateAIBrandingPreference;
