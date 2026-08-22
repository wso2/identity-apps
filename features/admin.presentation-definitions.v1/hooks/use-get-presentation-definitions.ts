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
import { PresentationDefinitionListInterface } from "../models/presentation-definitions";

/**
 * Hook to fetch the list of presentation definitions with cursor-based pagination.
 *
 * @param limit - Maximum number of definitions to return.
 * @param before - Base64 encoded cursor for backward pagination.
 * @param after - Base64 encoded cursor for forward pagination.
 * @param filter - SCIM-style filter expression.
 * @param shouldFetch - Whether to fetch the data.
 * @returns RequestResultInterface with the definition list.
 */
export const useGetPresentationDefinitions = (
    limit?: number,
    before?: string,
    after?: string,
    filter?: string,
    shouldFetch: boolean = true
): RequestResultInterface<PresentationDefinitionListInterface, RequestErrorInterface> => {
    const params: Record<string, string | number> = {};

    if (limit) params.limit = limit;
    if (before) params.before = before;
    if (after) params.after = after;
    if (filter) params.filter = filter;

    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        params,
        url: store.getState().config.endpoints.vpTemplates
    };

    const { data, error, isLoading, isValidating, mutate } =
        useRequest<PresentationDefinitionListInterface, RequestErrorInterface>(
            shouldFetch ? requestConfig : null
        );

    return { data, error, isLoading, isValidating, mutate };
};
