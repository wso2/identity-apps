/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
import { Config } from "@wso2is/admin.core.v1/configs/app";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { WSFederationConfigConstants } from "../constants/wsfed-configuration";
import { WSFederationConfigAPIResponseInterface } from "../models/wsfed-configuration";


const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Get WSFederation configurations.
 *
 *
 * @returns the WSFederation configurations of the tenant.
 */
export const useWSFederationConfig = <
    Data = WSFederationConfigAPIResponseInterface, Error = RequestErrorInterface
>(): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: Config.getServiceResourceEndpoints().passiveStsConfigurations
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

/**
 * Update WSFederation configurations.
 *
 * @param data - the updated WSFederation configurations.
 * @returns a promise to update the WSFederation configurations.
 */
export const updateWSFederationConfigurations = (data: WSFederationConfigAPIResponseInterface):
    Promise<WSFederationConfigAPIResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        data: data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method:  HttpMethods.PATCH,
        url: Config.getServiceResourceEndpoints().passiveStsConfigurations
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    WSFederationConfigConstants.ErrorMessages
                        .WS_FEDERATION_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE.getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as WSFederationConfigAPIResponseInterface);
        }).catch((error: AxiosError) => {
            const errorMessage: string = WSFederationConfigConstants.ErrorMessages
                .WS_FEDERATION_CONFIG_UPDATE_ERROR_CODE.getErrorMessage();

            throw new IdentityAppsApiException(errorMessage, error.stack, error.response?.data?.code, error.request,
                error.response, error.config);
        });
};

/**
 * Revert WSFederation configurations.
 *
 * @returns a promise to revert the WSFederation configurations.
 */
export const revertWSFederationConfigurations = (): Promise<void> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: Config.getServiceResourceEndpoints().passiveStsConfigurations
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    WSFederationConfigConstants.ErrorMessages
                        .WS_FEDERATION_CONFIG_REVERT_INVALID_STATUS_CODE_ERROR_CODE.getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve();
        }).catch((error: AxiosError) => {
            const errorMessage: string = WSFederationConfigConstants.ErrorMessages
                .WS_FEDERATION_CONFIG_REVERT_ERROR_CODE.getErrorMessage();

            throw new IdentityAppsApiException(errorMessage, error.stack, error.response?.data?.code, error.request,
                error.response, error.config);
        });
};
