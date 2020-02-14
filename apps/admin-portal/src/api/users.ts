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
import { HttpMethods, UserListInterface } from "../models";

/**
 * Initialize an axios Http client.
 * @type { AxiosHttpClientInstance }
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Retrieve the list of users that are currently in the system.
 *
 * @returns {Promise<BasicProfileInterface>} a promise containing the user list.
 */
export const getUsersList = (limit: number, offset: number): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.users + "?limit=" + limit + "&offset=" + offset
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data as UserListInterface);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve the list of user stores that are currently in the system.
 *
 * @returns {Promise<BasicProfileInterface>} a promise containing the user store list.
 */
export const getUserStoreList = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.userStores
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
 * Add new user.
 *
 * @param data request payload
 *
 * @returns {Promise<BasicProfileInterface>} a promise containing the response.
 */
export const addUser = (data: object): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.users
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
 * Delete user.
 *
 * @param user id
 *
 * @returns {Promise<BasicProfileInterface>} a promise containing the response.
 */
export const deleteUser = (userId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.DELETE,
        url: ServiceResourcesEndpoint.users + "/" + userId
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
 * Add role to new user.
 *
 * @param id group ID
 * @param data request payload
 *
 * @returns {Promise<BasicProfileInterface>} a promise containing the response.
 */
export const addUserRole = (data: object, groupId: string): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: ServiceResourcesEndpoint.groups + "/" + groupId
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};
