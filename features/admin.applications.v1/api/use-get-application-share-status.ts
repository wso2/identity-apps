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
import { ApplicationShareStatusUnitListInterface } from "../models/application";

/**
 * Hook to get the list of application share status units.
 *
 * @param shouldFetch - Should fetch the data.
 * @param filter - Search filter.
 * @param limit - Pagination limit.
 * @param after - Pagination after.
 * @param before - Pagination before.
 * @returns SWR response object.
 */
const useGetApplicationShareStatusUnits = <
    Data = ApplicationShareStatusUnitListInterface,
    Error = RequestErrorInterface>(
        operationId: string,
        shouldFetch: boolean,
        filter: string,
        limit: number,
        after: string,
        before: string,
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
            limit,
        },
        url: store.getState().config.endpoints.asyncStatus + "/" + operationId + "/unit-operations"
    };

    // Construct full URL with query parameters for debugging
    const baseUrl = store.getState().config.endpoints.asyncStatus + "/" + operationId + "/unit-operations";
    const queryParams = new URLSearchParams({
        filter,
        limit: limit.toString(),
        after,
        before
    });
    //

const fullUrl = `${baseUrl}?${queryParams.toString()}`;
console.log("Resolved URL:", fullUrl);

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch? requestConfig : null, {
        shouldRetryOnError: false
    });
    console.log("data", data);
    console.log("error", error);
    console.log("isloading", !error && !data);

    return {
        data,
        error,
        // isLoading: !error && !data,
        isLoading: false,
        isValidating,
        mutate
    };
};

export default useGetApplicationShareStatusUnits;