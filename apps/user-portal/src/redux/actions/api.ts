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

import { HttpRequestConfig } from "../../models/api";

/**
 * Redux actions related to API requests and responses.
 */

/**
 * Action type to handle starting state of an API request.
 *
 * @type {string}
 */
export const API_REQUEST_START = "API_REQUEST_START";

/**
 * Dispatches an action of type `API_REQUEST_START` with the type
 * of dispatcher as the payload.
 *
 * @param actionType type of the dispatcher who initiated the request.
 * @return {{payload: any; type: string}}
 */
export const apiRequestStart = (actionType) => ({
    payload: actionType,
    type: API_REQUEST_START
});

/**
 * Action type to handle termination of an API request.
 *
 * @type {string}
 */
export const API_REQUEST_END = "API_REQUEST_END";

/**
 * Dispatches an action of type `API_REQUEST_END` with the type
 * of dispatcher as the payload.
 *
 * @param actionType type of the dispatcher who initiated the request.
 * @return {{payload: any; type: string}}
 */
export const apiRequestEnd = (actionType) => ({
    payload: actionType,
    type: API_REQUEST_END
});

/**
 * Action type to handle API requests.
 *
 * @type {string}
 */
export const API_REQUEST = "API_REQUEST";

/**
 * Takes in an config of type `HttpRequestConfig` and dispatches and action of type
 * `API_REQUEST` with data as payload and other configs as meta.
 *
 * @param {HttpRequestConfig} config http request configuration.
 * @return {{payload: any; meta: {headers: any; onError: (error: AxiosError) => void; method: string;
 *     auth: AxiosBasicCredentials; dispatcher: any; url: string; onSuccess: (response: AxiosResponse) => void};
 *     type: string}}
 */
export const apiRequest = (config: HttpRequestConfig) => {
    const { auth, data, dispatcher, headers, method, onSuccess, onError, url  } = config;
    return {
        meta: {auth, dispatcher, headers, method, onSuccess, onError, url},
        payload: data,
        type: API_REQUEST
    };
};
