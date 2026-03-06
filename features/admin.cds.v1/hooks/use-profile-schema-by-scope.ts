/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
    RequestConfigInterface, RequestErrorInterface, RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import type {
    ProfileSchemaAttribute,
    ProfileSchemaScope
} from "../models/profile-attributes";

/**
 * Hook: GET /profile-schema/`{scope}`
 *
 * Fetches profile schema attributes for a given scope, with an optional filter.
 * Passing `shouldFetch: false` or omitting a required param suspends the request,
 * which is useful for conditional / debounced fetching.
 *
 * @param scope - The profile schema scope to query.
 * @param filter - Optional OData-style filter string (e.g. `attribute_name+eq+traits.foo`).
 * @param shouldFetch - Set to false to suspend the request. Defaults to true.
 * @returns SWR response with the matching attribute list.
 */
export const useProfileSchemaByScope = <
    Data = ProfileSchemaAttribute[],
    Error = RequestErrorInterface
>(
        scope: ProfileSchemaScope,
        filter?: string,
        shouldFetch: boolean = true
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: filter ? { filter } : undefined,
        url: `${store.getState().config.endpoints.cdsProfileSchema}/${scope}`
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        shouldFetch ? requestConfig : null,
        { shouldRetryOnError: false }
    );

    return {
        data: data as Data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};
