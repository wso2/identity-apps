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

import { HttpMethods } from "@wso2is/core/models";
import {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface,
    useRequest
} from "./use-request";
import { DeviceListResponseInterface } from "../models/devices";
import { store } from "../store";

/**
 * Hook to get a page of the devices registered to the authenticated user.
 *
 * @param limit - Maximum number of devices to return.
 * @param offset - Number of devices to skip.
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetDevices = <Data = DeviceListResponseInterface, Error = RequestErrorInterface>(
    limit: number,
    offset: number,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.GET,
        params: {
            limit,
            offset
        },
        url: store.getState().config.endpoints.devices
    };

    const { data, error, isValidating, mutate }: RequestResultInterface<Data, Error> = useRequest<Data, Error>(
        shouldFetch ? requestConfig : null,
        { shouldRetryOnError: false }
    );

    return {
        data,
        error,
        // `useRequest` does not expose a loading flag, so derive it from the SWR state.
        isLoading: shouldFetch && !data && !error,
        isValidating,
        mutate
    };
};

export default useGetDevices;
