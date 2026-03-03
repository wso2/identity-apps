/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { useSelector } from "react-redux";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../hooks/use-request";
import { CompatibilitySettingsInterface } from "../models/config";
import { AppState } from "../store";

/**
 * Hook to fetch tenant/sub-org compatibility settings from the API.
 * Uses the same pattern as other API hooks: URL from config.endpoints.
 * Subscribes via useSelector so the request runs after endpoints are loaded.
 * Request is authenticated (Bearer token).
 *
 * @param enabled - When true, the request is sent (e.g. when user is authenticated).
 * @returns Request result: data, error, isLoading, mutate
 */
export const useGetCompatibilitySettings = <
    Data = CompatibilitySettingsInterface,
    Error = RequestErrorInterface
>(
    enabled: boolean = true
): RequestResultInterface<Data, Error> => {
    const url: string = useSelector(
        (state: AppState) => state?.config?.endpoints?.compatibilitySettings ?? ""
    );
    const shouldFetch: boolean = enabled && Boolean(url);

    const requestConfig: RequestConfigInterface | null = shouldFetch
        ? {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url
        }
        : null;

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        requestConfig,
        {
            attachToken: true,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: false
        }
    );

    return {
        data,
        error,
        isLoading: isLoading ?? (!error && !data),
        isValidating,
        mutate
    };
};
