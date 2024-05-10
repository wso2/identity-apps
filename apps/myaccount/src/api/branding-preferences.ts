/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { HttpMethods } from "@wso2is/core/models";
import {
    BrandingPreferenceAPIResponseInterface,
    BrandingPreferenceTypes
} from "@wso2is/features/common.branding.v1/models";
import { I18nConstants } from "../constants";
import {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface,
    useRequest
} from "../hooks/use-request";
import { getMigratedBrandingPreference } from "../migrations/branding-preference";
import { store } from "../store";

/**
 * Hook to get the branding preference via Branding Preferences API.
 *
 * @param name - Resource Name.
 * @param type - Resource Type.
 * @param locale - Resource Locale.
 * @returns Branding Preference GET hook.
 */
export const useGetBrandingPreference = <Data = BrandingPreferenceAPIResponseInterface, Error = RequestErrorInterface>(
    name: string,
    type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            locale,
            name,
            type
        },
        url: store.getState()?.config?.endpoints?.brandingPreference + "/resolve"
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data: getMigratedBrandingPreference(
            data as unknown as BrandingPreferenceAPIResponseInterface) as unknown as Data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};
