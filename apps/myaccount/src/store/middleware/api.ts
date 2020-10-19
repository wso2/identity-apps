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

import axios from "axios";
import log from "log";
import { HttpRequestConfig } from "../../models";
import { apiRequestEnd, apiRequestStart } from "../actions";
import { API_REQUEST } from "../actions/types";

/**
 * Intercepts and handles actions of type `API_REQUEST`.
 *
 * @param {any} dispatch - `dispatch` function from redux
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
export const apiMiddleware = ({ dispatch }) => (next) => (action): void => {
    next(action);

    if (action.type !== API_REQUEST) {
        return;
    }

    const { auth, dispatcher, headers, method, onSuccess, onError, url }: HttpRequestConfig = action.meta;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const data: any = action.payload;

    // `GET` requests and `DELETE` requests usually has params rather than data.
    const dataOrParams: string = ["GET", "DELETE"].includes(method) ? "params" : "data";

    // `dispatcher` is the action which invoked the `API_REQUEST` action. This is
    // useful to show placeholders specific to certain API requests.
    if (dispatcher) {
        dispatch(apiRequestStart(dispatcher));
    }

    axios
        .request({
            auth,
            [dataOrParams]: data,
            headers,
            method,
            url,
            withCredentials: true
        })
        .then((response) => {
            dispatch({
                payload: response,
                type: onSuccess
            });
        })
        .catch((error) => {
            log.error(error);
            dispatch({
                payload: error,
                type: onError
            });
        })
        .finally(() => {
            if (dispatcher) {
                dispatch(apiRequestEnd(dispatcher));
            }
        });
};
