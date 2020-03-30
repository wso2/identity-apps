/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Config } from "../configs";
import { HttpMethods } from "../models";
import { store } from "../store";

/**
 * Initialize an axios Http client.
 * @type { AxiosHttpClientInstance }
 */
const httpClient = AxiosHttpClient.getInstance();

export const getConfigurations = (url: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: url
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

export const updateConfigurations = (data: object, url: string): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: url
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve self sign up configurations.
 *
 * @returns {Promise<any>} a promise containing the configurations.
 */
export const getSelfSignUpConfigurations = (): Promise<any> => {
    return getConfigurations(Config.getServiceResourceEndpoints().selfSignUp);
};

/**
 * Update self sign up configurations.
 *
 * @param data request payload
 *
 * @returns {Promise<any>} a promise containing the response.
 */
export const updateSelfSignUpConfigurations = (data: object): Promise<any> => {
    return updateConfigurations(data, Config.getServiceResourceEndpoints().selfSignUp);
};

/**
 * Retrieve account recovery configurations.
 *
 * @returns {Promise<any>} a promise containing the configurations.
 */
export const getAccountRecoveryConfigurations = (): Promise<any> => {
    return getConfigurations(Config.getServiceResourceEndpoints().accountRecovery);
};

/**
 * Update account recovery configurations.
 *
 * @param data request payload
 *
 * @returns {Promise<any>} a promise containing the response.
 */
export const updateAccountRecoveryConfigurations = (data: object): Promise<any> => {
    return updateConfigurations(data, Config.getServiceResourceEndpoints().accountRecovery);
};
