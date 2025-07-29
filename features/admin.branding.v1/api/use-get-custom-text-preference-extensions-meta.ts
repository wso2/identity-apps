/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { AppState } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import { useSelector } from "react-redux";
import { CustomTextPreferenceMeta } from "../models/custom-text-preference";

/**
 * Hook to get the extended preference text customization metadata from the distribution.
 *
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isValidating, mutate.
 */
const useGetCustomTextPreferenceExtensionsMeta = <
    Data = CustomTextPreferenceMeta,
    Error = RequestErrorInterface
>(shouldFetch: boolean = true): RequestResultInterface<Data, Error> => {
    const supportedLocaleExtensions: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state?.global?.supportedLocaleExtensions
    );

    const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";
    const url: string = `https://${window.location.host}${basename}/extensions/branding/i18n/meta.json`;

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig : null, {
        attachToken: false,
        shouldRetryOnError: false
    });

    let mergedData: Data = data;

    // If 404, gracefully return a meta object with only supportedLocaleExtensions as locales
    if (error && (error as any)?.response?.status === 404 && supportedLocaleExtensions) {
        mergedData = {
            locales: Object.keys(supportedLocaleExtensions)
        } as Data;
    } else if (Array.isArray((data as CustomTextPreferenceMeta)?.locales) && supportedLocaleExtensions) {
        (data as CustomTextPreferenceMeta).locales = [
            ...(data as CustomTextPreferenceMeta).locales,
            ...Object.keys(supportedLocaleExtensions)
        ];
        // Remove duplicates
        (data as CustomTextPreferenceMeta).locales = Array.from(new Set((data as CustomTextPreferenceMeta).locales));
        mergedData = data;
    }

    return {
        data: mergedData,
        error,
        isLoading: !error && !mergedData,
        isValidating,
        mutate
    };
};

export default useGetCustomTextPreferenceExtensionsMeta;
