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
import { GlobalConfig, ServiceResourcesEndpoint } from "../configs";
import { HttpMethods, IdentityProviderListResponseInterface, IdentityProviderResponseInterface } from "../models";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}.
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Gets the idp list.
 *
 * @return {Promise<any>} A promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getIdentityProviderList = (): Promise<any> => {
    // TODO add limit and offsets
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.identityProvider
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get idp list from: "));
            }
            return Promise.resolve(response.data as IdentityProviderListResponseInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets detail about the Identity Provider.
 *
 * @param id Identity Provider Id.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getIdentityProviderDetail = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.identityProvider + "/" + id
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get idp details from: "));
            }
            return Promise.resolve(response.data as IdentityProviderResponseInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};
