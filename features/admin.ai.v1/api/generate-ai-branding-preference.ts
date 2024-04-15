/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { store } from "../../admin.core.v1/store";
import { OrganizationType } from "../../admin.organizations.v1/constants/organization-constants";
import { GenerateBrandingAPIResponseInterface } from "../models/branding-preferences";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

const generateBrandingPreference = (
    website_url: string,
    name: string
): Promise<GenerateBrandingAPIResponseInterface> => {
    const isSuborganization: boolean =
    store.getState().organization.organizationType === OrganizationType.SUBORGANIZATION;
    const tenantDomain: string = isSuborganization ? store.getState().organization.organization.id : name;

    const requestConfig: AxiosRequestConfig = {
        data: {
            website_url: website_url
        },
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${store.getState().config.endpoints.brandingPreference}/generate`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<GenerateBrandingAPIResponseInterface>) => {
            if (response.status !== 202) {
                throw new Error("Failed to generate branding preference: ${response.statusText}");
            }

            return response.data;
        }).catch((error: AxiosError) => {
            const errorMessage: string = error.response?.data?.message || "Unknown error occurred";

            throw new IdentityAppsApiException(
                errorMessage,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

export default generateBrandingPreference;
