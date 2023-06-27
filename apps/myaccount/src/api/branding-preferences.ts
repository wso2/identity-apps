/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { AppConstants, I18nConstants } from "../constants";
import {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface,
    useRequest
} from "../hooks/use-request";
import { getMigratedBrandingPreference } from "../migrations/branding-preference";
import { BrandingPreferenceAPIResponseInterface } from "../models";

/**
 * Hook to get the branding preference files.
 *
 * @param tenantDomain - Tenant's name.
 * @param brandingStoreURL - Branding Store URL.
 * @param locale - Resource Locale.
 * @returns Branding Preference GET hook.
 */
export const useGetBrandingPreference = <Data = BrandingPreferenceAPIResponseInterface, Error = RequestErrorInterface>(
    tenantDomain: string,
    brandingStoreURL: string = "${host}/extensions/branding/${tenantDomain}/branding-preference_${locale}.json",
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE
): RequestResultInterface<Data, Error> => {
    const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";
    const moderatedBrandingStoreURL: string = brandingStoreURL
        .replace("${host}", `https://${window.location.host}${basename}`)
        .replace("${tenantDomain}", tenantDomain)
        .replace("${locale}", locale.replace("-", "_"));
        
    const url: string = moderatedBrandingStoreURL;

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, { attachToken: false });

    return {
        data: getMigratedBrandingPreference(data as unknown as 
            BrandingPreferenceAPIResponseInterface) as unknown as Data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};
