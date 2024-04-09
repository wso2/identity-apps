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

import { SupportedLanguagesMeta } from "@wso2is/i18n";
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
// import { Dispatch } from "redux";
// import { AppState } from "../../core/store";
// import { useGetCurrentOrganizationType } from "../../organizations/hooks/use-get-organization-type";
// import { OrganizationResponseInterface } from "../../organizations/models/organizations";
import generateBrandingPreference from "../api/generate-branding-preference";
import AIFeatureContext from "../context/ai-branding-feature-context";
import { BannerState } from "../models/types";

type AIBrandingPreferenceProviderProps = PropsWithChildren;


const AIBrandingPreferenceProvider: FunctionComponent<AIBrandingPreferenceProviderProps> = (
    props: AIBrandingPreferenceProviderProps
): ReactElement => {
    const { children } = props;
    const { preference } = useBrandingPreference();
    const [ currentStatus, setCurrentStatus ] = useState("Initializing...");
    const [ progress, setProgress ] = useState(0);
    const [ isGeneratingBranding, setGeneratingBranding ] = useState(false);
    const [ mergedBrandingPreference, setMergedBrandingPreference ] = useState<BrandingPreferenceInterface>(null);
    const [ operationId, setOperationId ] = useState<string>(null);

    function removeEmptyKeys(obj: Record<string, any>): Record<string, any> {
        return transform(obj, (result: Record<string, any>, value: any, key: string) => {
            // If the value is an object, recursively remove empty keys from it.
            if (isObject(value)) {
                const newValue: Record<string, any> = removeEmptyKeys(value);

                // If the new value is not empty, add it to the result.
                if (!isEmpty(newValue)) {
                    result[key] = newValue;
                }
            }
            // If the value is not an object and it is not empty, add it to the result.
            else if (!isEmpty(value)) {
                result[key] = value;
            }
        });
    }

    useEffect(() => {
        console.log("########## operationId ##########\n", operationId);
    }, [ operationId ]);


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
