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
    useEffect,
    useState } from "react";
import useGetAIBrandingGenerationResult from "../api/use-get-ai-branding-generation-result";
import AIFeatureContext from "../context/ai-branding-feature-context";

type AIBrandingPreferenceProviderProps = PropsWithChildren;


const AIBrandingPreferenceProvider: FunctionComponent<AIBrandingPreferenceProviderProps> = (
    props: AIBrandingPreferenceProviderProps
): ReactElement => {

    const { children } = props;
    const { preference } = useBrandingPreference();
    const [ isGeneratingBranding, setGeneratingBranding ] = useState(false);
    const [ mergedBrandingPreference, setMergedBrandingPreference ] = useState<BrandingPreferenceInterface>(null);
    const [ operationId, setOperationId ] = useState<string>("null");
    const [ brandingGenerationCompleted, setBrandingGenerationCompleted ] = useState(false);

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

    const { data, error } = useGetAIBrandingGenerationResult(operationId, brandingGenerationCompleted);

    useEffect(() => {
        if (brandingGenerationCompleted && !error && data) {
            handleGenerate(data.data);
        }
    }, [ data, brandingGenerationCompleted ]);

    const handleGenerate = (data: any) => {

        const newBrandingPreference: BrandingPreferenceInterface = getMergedBrandingPreference(data);

        setMergedBrandingPreference(newBrandingPreference);
        setBrandingGenerationCompleted(false);
        setGeneratingBranding(false);
    };

    const getMergedBrandingPreference = (data: any): BrandingPreferenceInterface => {

        const { theme } = removeEmptyKeys(data);
        const { activeTheme, LIGHT } = theme;

        const mergedBrandingPreference: BrandingPreferenceInterface =  merge(cloneDeep(preference.preference), {
            theme: {
                ...preference.preference.theme,
                LIGHT: LIGHT
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
                setOperationId
            } }
        >
            { children }
        </AIFeatureContext.Provider>
    );
};

export default AIBrandingPreferenceProvider;
