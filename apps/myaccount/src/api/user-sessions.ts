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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { HttpMethods, UserSessions } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches the list of user sessions from the API.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const fetchUserSessions = (): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.sessions
    };

    return httpClient(requestConfig)
        .then((response) => {
            return response.data as UserSessions;
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Terminates a user session.
 *
 * @param {string} id - Session ID.
 * @return {Promise<any>} A promise containing the response.
 */
export const terminateUserSession = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.sessions }/${ id }`
    };

    return httpClient(requestConfig)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Terminates all user sessions.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const terminateAllUserSessions = (): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.sessions
    };

    return httpClient(requestConfig)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};
