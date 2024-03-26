/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../core";
import { Config } from "../../core/configs";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../core/hooks/use-request";
import { UpdateJWTAuthenticatorConfigInterface } from "../models/private-key-jwt-config";

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Call Get API to hook JWT Private-key Authentication configuration state
 *
 * @returns The response of the JWT Private-key Authentication configuration state.
 */
export const useTokenReuseConfigData = <Data = any, Error = RequestErrorInterface>(
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {},
        url: Config.getServiceResourceEndpoints().jwtAuthenticationServiceMgt
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, {
        shouldRetryOnError: false
    });

    return {
        data,
        error: error,
        isLoading: !data && !error,
        isValidating,
        mutate
    };
};

/**
 * Hook to update JWT Private-key Authentication config.
 *
 * @param data - UpdateJWTAuthenticatorConfigInterface /enableTokenReuse - TokenReuse is enabled/disabled. 
 * @returns The response of the JWT Private-key Authentication configuration state.
 */
export const updateJWTConfig = (data: UpdateJWTAuthenticatorConfigInterface): Promise<any> => {
    
    const requestConfig: AxiosRequestConfig = {
        data:[ data ],
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: Config.getServiceResourceEndpoints().jwtAuthenticationServiceMgt
    };

    return httpClient(requestConfig).then((response : AxiosResponse) => {
        return Promise.resolve(response);
    }).catch((error : AxiosError) => {
        return Promise.reject(error);
    });
};
