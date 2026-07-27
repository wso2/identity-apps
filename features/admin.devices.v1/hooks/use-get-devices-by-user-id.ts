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

import useRequest, { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { DeviceListResponseInterface } from "../models/devices";

/**
 * Hook to fetch registered devices for a specific user with server-side pagination.
 *
 * @param userId - The ID of the user whose devices to retrieve.
 * @param limit - Maximum number of devices to return per page.
 * @param offset - Number of records to skip (zero-based).
 * @param shouldFetch - Whether to trigger the request.
 * @returns SWR result containing the paginated device list.
 */
const useGetDevicesByUserId = (
    userId: string,
    limit: number = 10,
    offset: number = 0,
    shouldFetch: boolean = true
): RequestResultInterface<DeviceListResponseInterface, RequestErrorInterface> => {
    const baseUrl: string = store.getState().config.endpoints.devices;

    const requestConfig: { url: string; method: string; headers: Record<string, string> } | null =
        shouldFetch && userId
            ? {
                headers: { "Content-Type": "application/json" },
                method: HttpMethods.GET,
                url: `${ baseUrl }?userId=${ encodeURIComponent(userId) }&limit=${ limit }&offset=${ offset }`
            }
            : null;

    const { data, isLoading, isValidating, error, mutate } = useRequest<
        DeviceListResponseInterface,
        RequestErrorInterface
    >(requestConfig);

    return { data, error, isLoading, isValidating, mutate };
};

export default useGetDevicesByUserId;
