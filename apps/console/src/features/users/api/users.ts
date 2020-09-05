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

import { IdentityClient } from "@wso2is/authentication";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods, ProfileInfoInterface } from "@wso2is/core/models";
import { store } from "../../core";
import { UserManagementConstants } from "../constants";
import { UserListInterface } from "../models";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient = IdentityClient.getInstance().httpRequest.bind(IdentityClient.getInstance());

/**
 * Retrieve the list of users that are currently in the system.
 *
 * @returns {Promise<UserListInterface>} a promise containing the user list.
 */
export const getUsersList = (count: number, startIndex: number, filter: string, attributes: string, domain: string):
    Promise<UserListInterface> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            attributes,
            count,
            domain,
            filter,
            startIndex
        },
        url: store.getState().config.endpoints.users
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data as UserListInterface);
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
 * @returns {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const addUser = (data: object): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.users
    };

    return httpClient(requestConfig)
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
 * @returns {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteUser = (userId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.users + "/" + userId
    };

    return httpClient(requestConfig)
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
 * @param {string} groupId - Group ID.
 * @param {object} data - Request payload
 * @returns {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const addUserRole = (data: object, groupId: string): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.groups + "/" + groupId
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve the user information through user id.
 *
 * @return {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getUserDetails = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.users + "/" + id
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data as ProfileInfoInterface);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve user information - ${error}`);
        });
};

/**
 * Update the required details of the user profile.
 *
 * @param {string} userId - User ID.
 * @param {object} data - Data to be updated.
 * @return {Promise<ProfileInfoInterface>} a promise containing the response.
 * @throws {IdentityAppsApiException}
 */
export const updateUserInfo = (userId: string, data: object): Promise<ProfileInfoInterface> => {

    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.users + "/" + userId
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data as ProfileInfoInterface);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                UserManagementConstants.USER_INFO_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
