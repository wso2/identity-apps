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
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { FapiSecurityPolicyConstants } from "../constants/fapi-security-policy-constants";
import {
    FapiConfigAPIResponseInterface,
    FapiConfigPatchRequestInterface
} from "../models/fapi-security-policy";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Update the FAPI configuration via PATCH /api/server/v1/configs/fapi.
 *
 * @param config - The updated FAPI configuration to send.
 * @returns A promise resolving to the updated FAPI configuration.
 */
export const updateFapiConfig = (
    config: FapiConfigPatchRequestInterface
): Promise<FapiConfigAPIResponseInterface> => {
    const requestConfig: AxiosRequestConfig = {
        data: config,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.fapiConfigurations
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    FapiSecurityPolicyConstants.ErrorMessages
                        .FAPI_CONFIG_UPDATE_ERROR_CODE.getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return Promise.resolve(response.data as FapiConfigAPIResponseInterface);
        })
        .catch((error: AxiosError) => {
            const errorMessage: string = (error.response?.data as { message?: string })?.message
                ?? FapiSecurityPolicyConstants.ErrorMessages.FAPI_CONFIG_UPDATE_ERROR_CODE.getErrorMessage();

            throw new IdentityAppsApiException(
                errorMessage,
                error.stack,
                (error.response?.data as { code?: string })?.code,
                error.request,
                error.response,
                error.config
            );
        });
};
