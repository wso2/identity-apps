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
import { HttpMethods } from "@wso2is/core/models";
import merge from "lodash-es/merge";
import useGetCustomTextPreferenceExtensionsMeta from "./use-get-custom-text-preference-extensions-meta";
import { CustomTextPreferenceMeta } from "../models/custom-text-preference";

/**
 * Hook to get the platform default branding preference text customization metadata from the distribution.
 *
 * @remarks Use the extensions hook to get additional locale data and if both main and extensions data exist,
 * deep merge the entire objects.
 *
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isValidating, mutate.
 */
const useGetCustomTextPreferenceMeta = <
    Data = CustomTextPreferenceMeta,
    Error = RequestErrorInterface
>(shouldFetch: boolean = true): RequestResultInterface<Data, Error> => {
    const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";
    const url: string = `https://${window.location.host}${basename}/resources/branding/i18n/meta.json`;

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

    const {
        data: extensionsData,
        error: extensionsError,
        isValidating: extensionsIsValidating
    } = useGetCustomTextPreferenceExtensionsMeta<Data, Error>(shouldFetch);

    let mergedData: Data = data;

    if (data && extensionsData) {
        const mainData: CustomTextPreferenceMeta = data as CustomTextPreferenceMeta;
        const extensionData: CustomTextPreferenceMeta = extensionsData as CustomTextPreferenceMeta;

        mergedData = merge({}, mainData, extensionData, {
            locales: Array.from(new Set([
                ...(mainData.locales || []),
                ...(extensionData.locales || [])
            ]))
        }) as Data;
    } else if (!data && extensionsData) {
        mergedData = extensionsData;
    }

    return {
        data: mergedData,
        error: error || extensionsError,
        isLoading: (!error && !data) || (!extensionsError && !extensionsData),
        isValidating: isValidating || extensionsIsValidating,
        mutate
    };
};

export default useGetCustomTextPreferenceMeta;
