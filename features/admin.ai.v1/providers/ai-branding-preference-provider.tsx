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
import useBrandingPreference from "features/admin.branding.v1/hooks/use-branding-preference";
import { BrandingPreferenceInterface } from "features/admin.branding.v1/models";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import isObject from "lodash-es/isObject";
import merge from "lodash-es/merge";
import transform from "lodash-es/transform";
import React,
{ FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
// import { AppState } from "../../core/store";
// import { useGetCurrentOrganizationType } from "../../organizations/hooks/use-get-organization-type";
// import { OrganizationResponseInterface } from "../../organizations/models/organizations";
import generateBrandingPreference from "../api/generate-ai-branding-preference";
import { GenerateBrandingAPIResponseInterface } from "../models/branding-preferences";
import AIFeatureContext from "../context/ai-branding-feature-context";
import { BannerState } from "../models/types";

type AIBrandingPreferenceProviderProps = PropsWithChildren;


const AIBrandingPreferenceProvider: FunctionComponent<AIBrandingPreferenceProviderProps> = (
    props: AIBrandingPreferenceProviderProps
): ReactElement => {
    const { children } = props;
    const dispatch: Dispatch = useDispatch();
    const { preference } = useBrandingPreference();
    const [ isGeneratingBranding, setGeneratingBranding ] = useState(false);
    const [ mergedBrandingPreference, setMergedBrandingPreference ] = useState<BrandingPreferenceInterface>(null);
    const [ operationId, setOperationId ] = useState<string>(null);
    const { t } = useTranslation();

    function removeEmptyKeys(obj: Record<string, any>): Record<string, any> {
        return transform(obj, (result: Record<string, any>, value: any, key: string) => {
            if (isObject(value)) {
                const newValue: Record<string, any> = removeEmptyKeys(value);

                if (!isEmpty(newValue)) {
                    result[key] = newValue;
                }
            }
            else if (!isEmpty(value)) {
                result[key] = value;
            }
        });
    }

    const handleGenerate = (data: any) => {

        setGeneratingBranding(false);
        const newBrandingPreference: BrandingPreferenceInterface = getMergedBrandingPreference(data);

        setMergedBrandingPreference(newBrandingPreference);
    };

    const getMergedBrandingPreference = (data: any): BrandingPreferenceInterface => {

        setGeneratingBranding(false);
        const { theme } = removeEmptyKeys(data);
        const { activeTheme, LIGHT } = theme;

        console.log("########## existing branding preference ##########\n", preference);
        console.log("########## AI generated ##########\n", data);
        const mergedBrandingPreference: BrandingPreferenceInterface =  merge(cloneDeep(preference.preference), {
            theme: {
                ...preference.preference.theme,
                LIGHT: LIGHT
            }
        });

        console.log("########## merged preference ##########\n", mergedBrandingPreference);

        return mergedBrandingPreference;
    };

    const _generateAIBrandingPreference = (
        website_url: string,
        tenant: string
    ): Promise<void> => {

        return generateBrandingPreference(website_url, tenant)
            .then(
                (data: GenerateBrandingAPIResponseInterface) => {
                    setOperationId(data.operation_id);
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
                addAlert<AlertInterface>({
                    description: t("branding:brandingCustomText.notifications.updateError.description"),
                    level: AlertLevels.ERROR,
                    message: t("branding:brandingCustomText.notifications.updateError.message")
                });
            });
    };

    return (
        <AIFeatureContext.Provider
            value={ {
                handleGenerate,
                isGeneratingBranding,
                mergedBrandingPreference,
                operationId,
                setGeneratingBranding,
                setOperationId
            } }
        >
            { children }
        </AIFeatureContext.Provider>
    );
};

export default AIBrandingPreferenceProvider;
