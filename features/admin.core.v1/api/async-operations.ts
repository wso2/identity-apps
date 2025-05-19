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
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../store";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Function to get asynchronous operation status.
 *
 * @param operationType - Operation Type.
 * @param subjectId - Subject Id of the operation.
 * @param limit - number of records to fetch.
 *
 * @returns Promise of response of the operation status.
 */
export const getAsyncOperationStatus = (
    after: string,
    before: string,
    filter: string,
    limit: number
): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            after,
            before,
            filter,
            limit
        },
        url: store.getState().config.endpoints.asyncStatus
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if ((response.status !== 200)) {
                return Promise.reject(new Error("Failed to fetch async operation status."));
            }

            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};
