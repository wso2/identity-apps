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
import { VCTemplateList } from "../models/verifiable-credentials";

/**
 * Hook to get the VC templates list with cursor-based pagination.
 *
 * @param limit - The maximum number of templates to return.
 * @param before - Base64 encoded cursor for backward pagination.
 * @param after - Base64 encoded cursor for forward pagination.
 * @param filter - The filter to be applied (e.g., "identifier eq EmployeeBadge").
 * @param attributes - The attributes to be returned.
 * @param shouldFetch - Whether to fetch the data.
 * @returns RequestResultInterface with the template list.
 */
export const useGetVCTemplates = (
    limit?: number,
    before?: string,
    after?: string,
    filter?: string,
    attributes?: string,
    shouldFetch: boolean = true
): RequestResultInterface<VCTemplateList, RequestErrorInterface> => {
    const params: Record<string, any> = {};

    if (limit) params.limit = limit;
    if (before) params.before = before;
    if (after) params.after = after;
    if (filter) params.filter = filter;
    if (attributes) params.attributes = attributes;

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params,
        url: store.getState().config.endpoints.vcTemplates
    };

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    } = useRequest<VCTemplateList, RequestErrorInterface>(
        shouldFetch ? requestConfig : null
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};
