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
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useAIBrandingPreference from "./use-ai-branding-preference";
import { AppConstants } from "../../admin.core.v1";
import { store } from "../../admin.core.v1/store";
import { OrganizationType } from "../../admin.organizations.v1/constants/organization-constants";
import generateBrandingPreference from "../api/generate-ai-branding-preference";
import { GenerateBrandingAPIResponseInterface } from "../models/branding-preferences";

export type GenerateAIBrandingPreferenceFunc = (website_url: string) => Promise<void>;

const useGenerateAIBrandingPreference = (): GenerateAIBrandingPreferenceFunc => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const { setGeneratingBranding,
        setOperationId } = useAIBrandingPreference();

    const isSuborganization: boolean =
    store.getState().organization.organizationType === OrganizationType.SUBORGANIZATION;
    const tenantDomain: string =
    isSuborganization ? store.getState().organization.organization.id : AppConstants.getTenant();

    const generateAIBrandingPreference = async (
        websiteUrl: string
    ): Promise<void> => {

        return generateBrandingPreference(websiteUrl, tenantDomain)
            .then(
                (data: GenerateBrandingAPIResponseInterface) => {
                    setOperationId(data.operation_id);
                    setGeneratingBranding(true);
                }
            )
            .catch(() => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("branding:ai.notifications.generateError.description"),
                        level: AlertLevels.ERROR,
                        message: t("branding:ai.notifications.generateError.message")
                    }));
            });
    };

    return generateAIBrandingPreference;
};

export default useGenerateAIBrandingPreference;
