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

import { AsgardeoSPAClient, HttpError, HttpInstance, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { HttpMethods, UserSessions } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches the list of user sessions from the API.
 *
 * @returns - A promise containing the response.
 */
export const fetchUserSessions = (): Promise<UserSessions> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.sessions
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse<UserSessions>) => {
            return response.data;
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Terminates a user session.
 *
 * @param id - Session ID.
 * @returns - A promise containing the response.
 */
export const terminateUserSession = (id: string): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.sessions }/${ id }`
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            return response.data;
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Terminates all user sessions.
 *
 * @returns - A promise containing the response.
 */
export const terminateAllUserSessions = (): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.sessions
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            return response.data;
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};
