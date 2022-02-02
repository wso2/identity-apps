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

import { IdentityClient } from "@asgardio/oidc-js";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ConfigurationModel, HttpMethods } from "../models";
import { store } from "../store";

/**
 * @see IdentityClient
 */
const httpClient = IdentityClient.getInstance().httpRequest.bind(
    IdentityClient.getInstance()
);

/**
 * Fetches the basic server configurations.
 *
 * @see ServiceResourceEndpointsInterface.config
 * @see ConfigurationModel
 * @returns Promise<ConfigurationModel> response.data
 */
export const fetchServerConfiguration = async (): Promise<ConfigurationModel> => {

    const requestConfig: AxiosRequestConfig = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.config
    };

    try {
        const response: AxiosResponse = await httpClient(requestConfig);
        return Promise.resolve<ConfigurationModel>(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};
