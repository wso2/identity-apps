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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { FetcherResponse } from "swr/infinite/dist";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

export type GetRequest = AxiosRequestConfig | null

/**
 * Request error interface.
 */
export interface RequestResultInterface<Data = unknown, Error = unknown>
    extends Pick<
        SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
        "isValidating" | "error" | "mutate"
    > {
    /**
     * Request data.
     */
    data: Data | undefined;
    /**
     * Request loading state.
     */
    isLoading?: boolean;
    /**
     * Request response.
     */
    response?: AxiosResponse<Data> | undefined;
    /**
     * Custom function to mutate multiple cache items
     */
    mutateMultiple?: () => void;
}

/**
 * Schema for the request config.
 */
export type RequestConfigInterface = AxiosRequestConfig;

/**
 * Schema of the Error response body returned by Identity Server REST APIs.
 */
export interface RequestErrorInterface {
    /**
     * Error code.
     * @example example: AAA-00000
     */
    code: string;
    /**
     * Error message.
     * @example example: Some error message.
     */
    message: string;
    /**
     * Error description.
     * @example Some error description.
     */
    description?: string;
    /**
     * Error description alias.
     * @example Some error description.
     */
    detail?: string;
    /**
     * Error trace id.
     * @example e0fbcfeb-3617-43c4-8dd0-7b7d38e13047
     */
    traceId: string;
}

export interface SWRConfig<Data = unknown, Error = unknown>
    extends Omit<
        SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
        "fallbackData"
    > {
    attachToken?: boolean,
    fallbackData?: Data
}

const globalConfig: SWRConfiguration = {};

const useRequest = <Data = unknown, Error = unknown>(
    request: GetRequest,
    { attachToken, fallbackData, ...config }: SWRConfig<Data, Error> = {}
): RequestResultInterface<Data, Error> => {

    const _config: SWRConfiguration = {
        ...globalConfig,
        ...config
    };

    const { data: response, error, isValidating, mutate } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
        request && JSON.stringify(request),
        /**
         * NOTE: Typescript thinks `request` can be `null` here, but the fetcher
         * function is actually only called by `useSWR` when it isn't.
         */
        () =>
            (attachToken === undefined
                ? httpClient(request)
                : attachToken
                    ? httpClient(request)
                    : axios(request)) as FetcherResponse<AxiosResponse<Data>>,
        {
            // Re-validates data on document focus.
            // Sends unnecessary request so disabling globally.
            // If needed, can pass in as a special option for selected requests.
            revalidateOnFocus: false,
            // SWR retries error requests by default, which casuses the UI alert to show multiple times.
            // There's no real requirement to retry REST API calls, so disabling globally.
            shouldRetryOnError: false,
            ..._config,
            fallbackData: fallbackData && {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                config: request!,
                data: fallbackData,
                headers: {},
                status: 200,
                statusText: "InitialData"
            }
        }
    );

    return {
        data: response && response.data,
        error,
        isValidating,
        mutate,
        response
    };
};

export default useRequest;
