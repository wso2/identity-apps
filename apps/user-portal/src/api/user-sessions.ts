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

import { AuthenticateSessionUtil } from "@wso2is/authenticate";
import axios, { AxiosRequestConfig } from "axios";
import { ServiceResourcesEndpoint } from "../configs";
import {
    HttpMethods,
    UserSessions
} from "../models";

/**
 * Fetches the list of user sessions from the API.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const fetchUserSessions = (): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${ token }`,
                },
                method: HttpMethods.GET,
                url: ServiceResourcesEndpoint.sessions
            };

            return axios.request(requestConfig)
                .then((response) => {
                    return response.data as UserSessions;
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        })
        .catch((error) => {
            return Promise.reject(new Error(`Failed to retrieve the access token - ${ error }`));
        });
};

/**
 * Terminates a user session.
 *
 * @param {string} id - Session ID.
 * @return {Promise<any>} A promise containing the response.
 */
export const terminateUserSession = (id: string): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${ token }`,
                },
                method: HttpMethods.DELETE,
                url: `${ ServiceResourcesEndpoint.sessions }/${ id }`
            };

            return axios.request(requestConfig)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        })
        .catch((error) => {
            return Promise.reject(new Error(`Failed to retrieve the access token - ${ error }`));
        });
};

/**
 * Terminates all user sessions.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const terminateAllUserSessions = (): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${ token }`,
                },
                method: HttpMethods.DELETE,
                url: ServiceResourcesEndpoint.sessions
            };

            return axios.request(requestConfig)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        })
        .catch((error) => {
            return Promise.reject(new Error(`Failed to retrieve the access token - ${ error }`));
        });
};
