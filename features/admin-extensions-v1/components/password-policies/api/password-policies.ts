/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../../../admin-core-v1";
import {
    UpdateMultipleGovernanceConnectorsInterface
} from "../../../../features/server-configurations";

/**
 * Initialize an axios Http client.
 */
const httpClient: (
    config: HttpRequestConfig
) => Promise<AxiosResponse> = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

export const updatePasswordPolicyProperties = (
    data: UpdateMultipleGovernanceConnectorsInterface
): Promise<void> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState()?.config?.endpoints?.passwordPoliciesUpdate
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    "Received an invalid status code while updating the password expiry and history properties.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return Promise.resolve();
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                "An error ocurred while updating the password expiry and history properties.",
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};
