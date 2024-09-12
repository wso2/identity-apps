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

import { AsgardeoSPAClient, HttpRequestConfig } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1";
import { UpdateGovernanceConnectorConfigInterface } from "@wso2is/admin.server-configurations.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Initialize an axios Http client.
 */
const httpClient: (
    config: HttpRequestConfig
) => Promise<AxiosResponse> = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Updates the password expiry properties.
 *
 * @param data - The data to update the governance connector configuration.
 * @returns A promise that resolves with the response data or rejects with an error.
 *
 * @throws IdentityAppsApiException If the response status is not 200 or if an error occurs during the request.
 *
 * @example
 * updatePasswordExpiryProperties(data)
 *  .then(...)
 *  .catch(...);
 */
const updatePasswordExpiryProperties = (data: UpdateGovernanceConnectorConfigInterface): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState()?.config?.endpoints?.passwordExpiry
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    "Received an invalid status code while updating the password expiry properties.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                "An error ocurred while updating the password expiry properties.",
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export default updatePasswordExpiryProperties;
