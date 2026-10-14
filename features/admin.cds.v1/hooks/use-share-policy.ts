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
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { HttpMethods } from "@wso2is/core/models";
import { getSharingPoliciesEndpoint } from "../api/organization-management";
import type { SharePolicyList, ShareableResource } from "../models/organization-management";

const JSON_HEADERS: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json"
};

/**
 * Hook to list the share policies of a profile attribute or a unification rule. The list
 * has a maximum of one policy: the policy of the current organization.
 *
 * @param resource - The resource.
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
export const useSharePolicies = <Data = SharePolicyList, Error = RequestErrorInterface>(
    resource: ShareableResource,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: JSON_HEADERS,
        method: HttpMethods.GET,
        url: resource ? getSharingPoliciesEndpoint(resource) : null
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        shouldFetch && resource ? requestConfig : null,
        { shouldRetryOnError: false }
    );

    return {
        data: (data) as Data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};
