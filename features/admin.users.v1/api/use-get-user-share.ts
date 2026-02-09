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
import { HttpMethods } from "@wso2is/core/models";
import { UserSharedOrganizationsResponse } from "../models/endpoints";

/**
 * Hook to get user shared organizations.
 *
 * @param userId - User ID.
 * @param shouldFetch - Should fetch the data.
 * @param recursive - Determines whether a recursive search should happen.
 * @param filter - Filter condition.
 * @param attributes - Comma-separated attributes to include in response (e.g., "roles,sharingMode").
 * @param limit - Maximum number of records to return.
 * @param before - Base64 encoded cursor value for backward pagination.
 * @param after - Base64 encoded cursor value for forward pagination.
 * @returns SWR response object containing user shared organizations data.
 */
const useGetUserShare = (
    userId: string,
    shouldFetch: boolean = true,
    recursive?: boolean,
    filter?: string,
    attributes?: string,
    limit?: number,
    before?: string,
    after?: string,
    ...additionalAttributes: string[]
): RequestResultInterface<UserSharedOrganizationsResponse, RequestErrorInterface> => {

    // Combine all attributes into a single comma-separated string
    const allAttributes: string = attributes
        ? additionalAttributes.length > 0
            ? `${attributes},${additionalAttributes.join(",")}`
            : attributes
        : additionalAttributes.length > 0
            ? additionalAttributes.join(",")
            : undefined;

    // Build query parameters
    const params: URLSearchParams = new URLSearchParams();

    if (recursive !== undefined && recursive !== null) {
        params.append("recursive", String(recursive));
    }
    if (filter) {
        params.append("filter", filter);
    }
    if (allAttributes) {
        params.append("attributes", allAttributes);
    }
    if (limit !== undefined && limit !== null) {
        params.append("limit", String(limit));
    }
    if (before) {
        params.append("before", before);
    }
    if (after) {
        params.append("after", after);
    }

    const queryString: string = params.toString();
    const url: string =
        `http://localhost:3000/t/carbon.super/api/server/v2/users/${userId}/share${queryString ? `?${queryString}` : ""}`;

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: shouldFetch ? url : null
    };

    const { data, error, isValidating, mutate } = useRequest<UserSharedOrganizationsResponse, RequestErrorInterface>(
        requestConfig,
        {
            shouldRetryOnError: false
        }
    );

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

export default useGetUserShare;
