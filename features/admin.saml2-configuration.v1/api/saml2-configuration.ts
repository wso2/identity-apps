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
import { Saml2ConfigurationConstants } from "../constants/saml2-configuration";
import { Saml2ConfigAPIResponseInterface } from "../models/saml2-configuration";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Get saml2 configurations.
 *
 * @returns the saml2 configurations of the tenant.
 */
export const useSaml2Config = <
    Data = Saml2ConfigAPIResponseInterface, Error = RequestErrorInterface
>(): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: Config.getServiceResourceEndpoints().saml2Configurations
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
 * Revert saml2 configurations.
 *
 * @returns a promise to revert the saml2 configurations.
 */
export const revertSaml2Configurations = (): Promise<void> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: Config.getServiceResourceEndpoints().saml2Configurations
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    Saml2ConfigurationConstants.ErrorMessages
                        .SAML2_CONFIG_REVERT_INVALID_STATUS_CODE_ERROR_CODE.getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve();
        }).catch((error: AxiosError) => {
            const errorMessage: string = Saml2ConfigurationConstants.ErrorMessages
                .SAML2_CONFIG_REVERT_ERROR_CODE.getErrorMessage();

            throw new IdentityAppsApiException(errorMessage, error.stack, error.response?.data?.code, error.request,
                error.response, error.config);
        });
};

/**
 * Update saml2 configurations.
 *
 * @param data - the updated saml2 configurations.
 * @returns a promise to update the saml2 configurations.
 */
export const updateSaml2Configurations = (data: Saml2ConfigAPIResponseInterface):
    Promise<Saml2ConfigAPIResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        data: data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method:  HttpMethods.PATCH,
        url: Config.getServiceResourceEndpoints().saml2Configurations
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    Saml2ConfigurationConstants.ErrorMessages
                        .SAML2_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE.getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as Saml2ConfigAPIResponseInterface);
        }).catch((error: AxiosError) => {
            const errorMessage: string = Saml2ConfigurationConstants.ErrorMessages
                .SAML2_CONFIG_UPDATE_ERROR_CODE.getErrorMessage();

            throw new IdentityAppsApiException(errorMessage, error.stack, error.response?.data?.code, error.request,
                error.response, error.config);
        });
};
