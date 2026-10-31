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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { Config } from "@wso2is/admin.core.v1/configs/app";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods, HttpErrorResponseDataInterface } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { OpenID4VPConfigConstants } from "../constants/openid4vp-configuration";
import { OpenID4VPConfigAPIResponseInterface } from "../models/openid4vp-configuration";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Get OpenID4VP configurations.
 * @returns the OpenID4VP configurations of the tenant.
 */
export const useOpenID4VPConfig = <
    Data = OpenID4VPConfigAPIResponseInterface, Error = RequestErrorInterface
>(): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: Config.getServiceResourceEndpoints().openid4vpConfigurations
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
 * Update OpenID4VP configurations.
 * @param data - the updated OpenID4VP configurations.
 * @returns a promise to update the OpenID4VP configurations.
 */
export const updateOpenID4VPConfig = (data: OpenID4VPConfigAPIResponseInterface):
    Promise<OpenID4VPConfigAPIResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        data: data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: Config.getServiceResourceEndpoints().openid4vpConfigurations
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    OpenID4VPConfigConstants.ErrorMessages
                        .OPENID4VP_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR_CODE.getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as OpenID4VPConfigAPIResponseInterface);
        }).catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            const errorMessage: string = OpenID4VPConfigConstants.ErrorMessages
                .OPENID4VP_CONFIG_UPDATE_ERROR_CODE.getErrorMessage();

            throw new IdentityAppsApiException(
                errorMessage,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
