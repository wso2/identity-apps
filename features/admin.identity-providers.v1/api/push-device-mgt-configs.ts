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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1/store";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods, HttpErrorResponseDataInterface } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { PushDeviceMgtConfigInterface } from "../models";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to get the push device management configuration.
 *
 * @param shouldFetch - Should fetch the data.
 *
 * @returns Push device management configuration.
 */
export const useGetPushDeviceMgtConfig = <Data = PushDeviceMgtConfigInterface, Error = RequestErrorInterface>(
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store?.getState()?.config?.endpoints?.pushDeviceMgtConfigs
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    return {
        data,
        error,
        isLoading: shouldFetch && !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Update the push device management configuration.
 *
 * @param config - Push device management configuration.
 *
 * @returns Updated push device management configuration.
 */
export const updatePushDeviceMgtConfig = (
    config: PushDeviceMgtConfigInterface
): Promise<PushDeviceMgtConfigInterface> => {

    const requestConfig: RequestConfigInterface = {
        data: config,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store?.getState()?.config?.endpoints?.pushDeviceMgtConfigs
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response?.status !== 200) {
                throw new IdentityAppsApiException(
                    "Received an invalid status code while updating the push device management configs.",
                    null,
                    response?.status,
                    response?.request,
                    response,
                    response?.config
                );
            }

            return Promise.resolve(response.data as PushDeviceMgtConfigInterface);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                "An error occurred while updating the push device management configs.",
                error?.stack,
                error?.response?.data?.code,
                error?.request,
                error?.response,
                error?.config
            );
        });
};
