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
import { store } from "@wso2is/admin.core.v1/store";
import useRequest, { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { DevicePolicyResponseInterface } from "../models/device-policy";

/**
 * Hook to fetch a single device policy by ID.
 *
 * @param policyId - The policy ID to fetch.
 * @param shouldFetch - Whether to trigger the request.
 * @returns SWR result with the device policy.
 */
const useGetDevicePolicyById = (
    policyId: string,
    shouldFetch: boolean = true
): RequestResultInterface<DevicePolicyResponseInterface, RequestErrorInterface> => {
    const requestConfig: { url: string; method: string; headers: Record<string, string> } = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.devicePolicies }/${ policyId }`
    };

    const { data, isLoading, isValidating, error, mutate } = useRequest<
        DevicePolicyResponseInterface,
        RequestErrorInterface
    >(shouldFetch ? requestConfig : null);

    return { data, error, isLoading, isValidating, mutate };
};

export default useGetDevicePolicyById;
