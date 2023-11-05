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
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../core/store";
import { OrganizationDiscoveryCheckResponseInterface } from "../models/organization-discovery";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Check whether a given email domain is available.
 *
 * @param domain - Domain to be checked.
 * @returns Promise containing the response.
 */
const checkEmailDomainAvailable = (
    domain: string
): Promise<OrganizationDiscoveryCheckResponseInterface> => {
    const requestConfig: AxiosRequestConfig = {
        data: {
            type: "emailDomain",
            value: domain
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.organizations }/organizations/check-discovery`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to check the email domain availability."));
            }

            return Promise.resolve(response?.data);
        }).catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

export default checkEmailDomainAvailable;
