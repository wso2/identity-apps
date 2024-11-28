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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface,
    RevalidatorInterface,
    RevalidatorOptionsInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { BareFetcher, PublicConfiguration } from "swr/dist/_internal";
import { UserStoreDetails } from "../models";

/**
 * Hook to get User Store details.
 *
 * @param userStoreId - User Store ID.
 * @param shouldFetch - If true, will fetch the data.
 *
 * @returns Requested data.
 */
const useGetUserStoreDetails = <Data = UserStoreDetails, Error = RequestErrorInterface>(
    userStoreId: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> & { remainingRetryCount: number } => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.userStores}/${userStoreId}`
    };

    const RETRY_INTERVAL: number = 2000;
    const RETRY_COUNT_LIMIT: number = 10;
    const [ remainingRetryCount, setRemainingRetryCount ] = useState<number>(RETRY_COUNT_LIMIT);

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    } = useRequest<Data, Error>(
        shouldFetch ? requestConfig : null,
        {
            onErrorRetry: (
                error: AxiosError<Error>,
                _: string,
                __: Readonly<PublicConfiguration<AxiosResponse<Data>, AxiosError<Error>, BareFetcher<any>>>,
                revalidate: RevalidatorInterface,
                { retryCount }: Required<RevalidatorOptionsInterface>
            ) => {
                if (error?.response?.status !== 404) {
                    return;
                }

                setRemainingRetryCount(RETRY_COUNT_LIMIT - retryCount);
                if (retryCount >= RETRY_COUNT_LIMIT) {
                    return;
                }

                setTimeout(() => revalidate({ retryCount }), RETRY_INTERVAL);
            },
            shouldRetryOnError: true
        }
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
        remainingRetryCount
    };
};

export default useGetUserStoreDetails;
