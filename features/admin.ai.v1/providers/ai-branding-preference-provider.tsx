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
import useBrandingPreference from "features/admin.branding.v1/hooks/use-branding-preference";
import { BrandingPreferenceInterface } from "features/admin.branding.v1/models";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import isObject from "lodash-es/isObject";
import merge from "lodash-es/merge";
import transform from "lodash-es/transform";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { BrandingPreferenceUtils } from "../../admin.branding.v1/utils";
import useGetAIBrandingGenerationResult from "../api/use-get-ai-branding-generation-result";
import AIFeatureContext from "../context/ai-branding-feature-context";
import { BrandingGenerationResultAPIResponseInterface } from "../models/branding-preferences";

type AIBrandingPreferenceProviderProps = PropsWithChildren;

/**
 * Provider for the AI branding preference context.
 *
 * @param props - Props injected to the component.
 * @returns AI branding preference provider.
 */
const AIBrandingPreferenceProvider: FunctionComponent<AIBrandingPreferenceProviderProps> = (
    props: AIBrandingPreferenceProviderProps
): ReactElement => {

    const { children } = props;
    const { t } = useTranslation();

    const dispatch: Dispatch<any> = useDispatch();
    const [ isGeneratingBranding, setGeneratingBranding ] = useState(false);
    const [ mergedBrandingPreference, setMergedBrandingPreference ] = useState<BrandingPreferenceInterface>(null);
    const [ operationId, setOperationId ] = useState<string>();
    const [ brandingGenerationCompleted, setBrandingGenerationCompleted ] = useState(false);

    const { preference } = useBrandingPreference();

    const brandingPreference: BrandingPreferenceInterface = preference?.preference ??
        BrandingPreferenceUtils.getDefaultBrandingPreference();

    /**
     * Removes empty keys from an object.
     *
     * @param obj - Object to be processed.
     * @returns Object with empty keys removed.
     */
    const removeEmptyKeys = (obj: Record<string, any>): Record<string, any> => {
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
    };

    /**
     * Custom hook to get the branding generation result.
     */
    const { data, error } = useGetAIBrandingGenerationResult(operationId, brandingGenerationCompleted);

    useEffect(() => {
        if (brandingGenerationCompleted && !error && data) {
            handleGenerate(data);
        }
    }, [ data, brandingGenerationCompleted ]);

    /**
     * Function to process the API response and generate the merged branding preference.
     *
     * @param data - Data from the API response.
     */
    const handleGenerate = (data: BrandingGenerationResultAPIResponseInterface) => {


        if (data.status !== "COMPLETED" || !data.data) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("branding:ai.notifications.generateError.description"),
                    level: AlertLevels.ERROR,
                    message: t("branding:ai.notifications.generateError.message")
                }));
            setBrandingGenerationCompleted(false);
            setGeneratingBranding(false);

            return;
        }

        const newBrandingPreference: BrandingPreferenceInterface = getMergedBrandingPreference(data.data);

        setMergedBrandingPreference(newBrandingPreference);
        setBrandingGenerationCompleted(false);
        setGeneratingBranding(false);
        data = null;
    };

    /**
     * Function to merge the branding preference.
     *
     * @param data - Data from the API response.
     * @returns Merged branding preference.
     */
    const getMergedBrandingPreference = (data: BrandingPreferenceInterface): BrandingPreferenceInterface => {

        const { theme } = removeEmptyKeys(data);
        const { activeTheme, LIGHT, DARK } = theme;

        const mergedBrandingPreference: BrandingPreferenceInterface =  merge(cloneDeep(brandingPreference), {
            theme: {
                ...brandingPreference.theme,
                DARK: DARK,
                LIGHT: LIGHT,
                activeTheme: activeTheme
            }
        });

        return mergedBrandingPreference;
    };

    return (
        <AIFeatureContext.Provider
            value={ {
                brandingGenerationCompleted,
                handleGenerate,
                isGeneratingBranding,
                mergedBrandingPreference,
                operationId,
                setBrandingGenerationCompleted,
                setGeneratingBranding,
                setMergedBrandingPreference,
                setOperationId
            } }
        >
            { children }
        </AIFeatureContext.Provider>
    );
};

export default AIBrandingPreferenceProvider;
