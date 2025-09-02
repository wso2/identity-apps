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
import { OrganizationPatchData } from "@wso2is/admin.organizations.v1/models";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";

/**
 * Get an HTTP client instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Update details of the currently authenticated organization.
 *
 * @param operations - Array of patch operations to apply to the organization.
 * @returns Promise containing the updated organization response.
 */
const updateSelfAuthenticatedOrganization = (operations: OrganizationPatchData[]): Promise<any> => {

    const requestConfig: any = {
        data: operations,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${store.getState().config.endpoints.organizations}/organizations/self`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(new IdentityAppsApiException(
                error?.response?.data?.description ||
                error?.response?.data?.message ||
                error?.message ||
                "An error occurred while updating the organization.",
                error.stack,
                error?.response?.status,
                error?.response?.request,
                error?.response,
                error?.response?.config
            ));
        });
};

export default updateSelfAuthenticatedOrganization;
