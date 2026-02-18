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
import { IdentityAppsError } from "@wso2is/core/errors";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { IssuerUsageScopeConfigConstants } from "../constants/issuer-usage-scope-configuration";
import { IssuerUsageScopeConfigAPIResponseInterface } from "../models/issuer-usage-scope-configuration";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Update Issuer Usage Scope configurations.
 * @param usageScope - the usage scope value to update.
 * @returns a promise to update the Issuer Usage Scope configurations.
 */
export const updateIssuerUsageScopeConfig = (
    usageScope: IssuerUsageScopeConfigAPIResponseInterface["usageScope"]
): Promise<IssuerUsageScopeConfigAPIResponseInterface> => {
    const requestConfig: AxiosRequestConfig = {
        data: {
            usageScope: usageScope
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.issuerUsageScope
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                const error: IdentityAppsError = IssuerUsageScopeConfigConstants.ErrorMessages
                    .ISSUER_USAGE_SCOPE_CONFIG_UPDATE_ERROR_CODE;

                throw new IdentityAppsApiException(
                    error.getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as IssuerUsageScopeConfigAPIResponseInterface);
        }).catch((error: AxiosError) => {
            const errorConstant: IdentityAppsError = IssuerUsageScopeConfigConstants.ErrorMessages
                .ISSUER_USAGE_SCOPE_CONFIG_UPDATE_ERROR_CODE;

            // Check if there's a specific error message from the API response
            const errorMessage: string = error.response?.data?.message
                ? error.response.data.message
                : errorConstant.getErrorMessage();

            throw new IdentityAppsApiException(
                errorMessage,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
