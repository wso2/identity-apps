/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { store } from "../../../../features/core/store";
import { InterfaceDiagnosticLogsRequest, InterfaceDiagnosticLogsResponse } from "../models";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Get diagnostic logs via Asgardeo - Organization-Wise Log Visualization Rest API.
 *
 * @param data - diagnostic logs search request payload.
 * @returns Promise<InterfaceDiagnosticLogsResponse>
 * @throws {@link IdentityAppsApiException}
 */
export const getDiagnosticLogs = (
    data: InterfaceDiagnosticLogsRequest
): Promise<InterfaceDiagnosticLogsResponse> => {

    const requestConfig: AxiosRequestConfig = {
        data: data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.diagnosticLogsEndpoint
    };

    // TODO: use SWR instead of axios
    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.response?.data?.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
