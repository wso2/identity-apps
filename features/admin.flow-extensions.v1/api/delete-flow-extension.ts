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
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpErrorResponseDataInterface, HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Delete a Flow Extension connection.
 *
 * @param id - ID of the Flow Extension to delete.
 * @returns A promise resolving with the delete response.
 * @throws Throws an IdentityAppsApiException if the request fails.
 */
const deleteFlowExtension = (id: string): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.flowExtension }/${ id }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    "Failed to delete the flow extension.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return response;
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export default deleteFlowExtension;
