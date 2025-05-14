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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AsyncOperationStatusUnitListInterface } from "../models/application";

/**
 * Hook to get the list of asynchronous operation status units.
 *
 * @param operationId - Operation id the data.
 * @param shouldFetch - Should fetch the data.
 * @param filter - Search filter.
 * @param limit - Pagination limit.
 * @param after - Pagination after.
 * @param before - Pagination before.
 * @returns SWR response object.
 */
export const useGetAsyncOperationStatusUnits = <Data = AsyncOperationStatusUnitListInterface, Error =
    RequestErrorInterface>(
        operationId: string,
        shouldFetch: boolean,
        filter: string,
        limit: number,
        after: string,
        before: string
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            after,
            before,
            filter,
            limit
        },
        url: store.getState().config.endpoints.asyncStatus + "/" + operationId + "/unit-operations"
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig : null,
        {
            shouldRetryOnError: false
        });

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};
