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
import { UnshareIdPFromSelectedOrganizationsPayloadInterface } from "../../../models/identity-provider-sharing";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Resolve the base identity providers endpoint from the store.
 *
 * @returns The identity providers base endpoint.
 */
const getIdentityProvidersEndpoint = (): string => store.getState().config.endpoints.identityProviders;

/**
 * Unshare an identity provider from a selected set of organizations.
 *
 * @param payload - Unshare from selected organizations payload.
 * @returns A promise resolving to the API response.
 */
export const unshareIdPFromSelectedOrganizations = (
    payload: UnshareIdPFromSelectedOrganizationsPayloadInterface
): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        data: payload,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ getIdentityProvidersEndpoint() }/unshare`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 202) {
                throw new IdentityAppsApiException(
                    "Failed to unshare the identity provider from the selected organizations.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return response;
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.status,
                error.request,
                error.response,
                error.config
            );
        });
};
