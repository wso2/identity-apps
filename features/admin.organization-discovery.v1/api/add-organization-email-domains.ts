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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "@wso2is/admin.core.v1/store";
import { OrganizationDiscoveryConstants } from "../constants/organization-discovery-constants";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Update the branding preference text customizations.
 *
 * @param id - Organization id.
 * @param domains - Set of domains to be mapped.
 * @returns Promise containing the response.
 * @throws Throws an IdentityAppsApiException if the request fails.
 */
const addOrganizationEmailDomain = (
    id: string,
    domains: string[]
): Promise<void> => {
    const requestConfig: AxiosRequestConfig = {
        data: {
            attributes: [
                {
                    type: "emailDomain",
                    values: domains
                }
            ],
            organizationId: id
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.organizations }/organizations/discovery`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    OrganizationDiscoveryConstants
                        .ErrorMessages
                        .ORGANIZATION_DOMAIN_ASSIGN_INVALID_STATUS_CODE_ERROR
                        .getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                OrganizationDiscoveryConstants.ErrorMessages.ORGANIZATION_DOMAIN_ASSIGN_ERROR.getErrorMessage(),
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

export default addOrganizationEmailDomain;
