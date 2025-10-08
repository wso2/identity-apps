/**
 * Copyright (c) 2019-2024, WSO2 LLC. (https://www.wso2.com).
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

import {
    AsgardeoSPAClient,
    HttpClientInstance,
    HttpError,
    HttpRequestConfig,
    HttpResponse
} from "@asgardeo/auth-react";
import { Application, HttpMethods } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Fetches the list of applications.
 *
 * @returns - A promise containing the response.
 */
export const fetchApplications = (
    limit: number,
    offset: number,
    filter: string
): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment
                ?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset
        },
        url: store.getState().config.endpoints.applications
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            let applications: Application[] = [];

            if (
                response &&
                response.data &&
                response.data.applications &&
                response.data.applications.length &&
                response.data.applications.length > 0
            ) {
                applications = response.data.applications.filter(
                    (app: Application) =>
                        app.name !== store.getState().config.ui.appName
                );
            }

            return Promise.resolve({
                ...response.data,
                applications
            });
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};
