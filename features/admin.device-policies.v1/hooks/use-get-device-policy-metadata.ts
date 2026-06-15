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

import { store } from "@wso2is/admin.core.v1/store";
import useRequest, { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { HttpMethods } from "@wso2is/core/models";
import { DevicePolicyFieldDefinitionInterface, DevicePlatformType } from "../models/device-policy";

/**
 * Hook to fetch device policy field metadata for a given platform.
 *
 * @param platform - Platform to filter metadata by.
 * @param shouldFetch - Whether to trigger the request.
 * @returns SWR result with field definitions.
 */
const useGetDevicePolicyMetadata = (
    platform: DevicePlatformType | null,
    shouldFetch: boolean = true
): RequestResultInterface<DevicePolicyFieldDefinitionInterface[], RequestErrorInterface> => {
    const baseUrl: string = store.getState().config.endpoints.devicePolicyMetadata;
    const url: string = platform ? `${ baseUrl }?platform=${ platform }` : baseUrl;

    const requestConfig: { url: string; method: string; headers: Record<string, string> } = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        url
    };

    const { data, isLoading, isValidating, error, mutate } = useRequest<
        DevicePolicyFieldDefinitionInterface[],
        RequestErrorInterface
    >(shouldFetch && platform ? requestConfig : null);

    return { data, error, isLoading, isValidating, mutate };
};

export default useGetDevicePolicyMetadata;
