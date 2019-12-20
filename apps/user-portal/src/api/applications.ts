/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AxiosHttpClient } from "@wso2is/http";
import { GlobalConfig, ServiceResourcesEndpoint } from "../configs";
import { ApplicationList, HttpMethods } from "../models";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Fetches the list of applications.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const fetchApplications = (
    limit: number,
    offset: number,
    filter: string
): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset
        },
        url: ServiceResourcesEndpoint.applications
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            let applications = [];

            if (response
                && response.data
                && response.data.applications
                && response.data.applications.length
                && response.data.applications.length > 0) {
                applications = response.data.applications.filter((app) => app.name !== GlobalConfig.applicationName);
            }

            return Promise.resolve({
                ...response.data,
                applications
            });
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};
