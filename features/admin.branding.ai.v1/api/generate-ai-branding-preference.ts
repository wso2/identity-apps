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
import { GenerateBrandingAPIResponseInterface } from "../models/branding-preferences";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Generate branding preference via Branding Preferences API.
 *
 * @param websiteUrl - website URL given by the end user.
 * @param tenantDomain -  tenant domain.
 * @returns generated branding API response.
 */
const generateBrandingPreference = (
    websiteUrl: string,
    tenantDomain: string
): Promise<GenerateBrandingAPIResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        data: {
            tenant_domain: tenantDomain,
            website_url: websiteUrl
        },
        headers: {
            "Accept": "application/json",
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
            const errorMessage: string = error.response?.data?.detail || "Unknown error occurred";

            throw new IdentityAppsApiException(
                errorMessage,
                error.stack,
                error.response?.status,
                error.request,
                error.response,
                error.config
            );
        });
};

export default generateBrandingPreference;
