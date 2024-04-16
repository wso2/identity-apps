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

import { HttpMethods } from "@wso2is/core/models";
import { AppConstants } from "../../admin.core.v1/constants/app-constants";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../admin.core.v1/hooks/use-request";
import { CustomTextPreferenceScreenMetaInterface } from "../models/custom-text-preference";

/**
 * Hook to get the custom text preference screen meta.
 *
 * @param shouldFetch - Should fetch the data.
 * @param screen - Resource Screen.
 * @returns SWR response object containing the data, error, isValidating, mutate.
 */
const useGetCustomTextPreferenceScreenMeta = <
    Data = CustomTextPreferenceScreenMetaInterface,
    Error = RequestErrorInterface
>(
        shouldFetch: boolean,
        screen: string
    ): RequestResultInterface<Data, Error> => {
    const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";
    const url: string = `https://${
        window.location.host
    }${basename}/resources/branding/i18n/screens/${screen}/meta.json`;

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

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

export default useGetCustomTextPreferenceScreenMeta;
