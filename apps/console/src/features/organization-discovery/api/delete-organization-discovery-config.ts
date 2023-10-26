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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../core/store";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Delete organization discovery configurations.
 *
 * TODO: Use `IdentityAppsApiException` and validate the return type.
 */
export const deleteOrganizationDiscoveryConfig = (): Promise<string> => {
    const config: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "DELETE",
        url: `${ store.getState().config.endpoints.organizations }/organization-configs/discovery`
    };

    return httpClient(config)
        .then((response: AxiosResponse) => {
            if (response?.status !== 204) {
                return Promise.reject(new Error("Failed to delete organization discovery configs."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

export default deleteOrganizationDiscoveryConfig;
