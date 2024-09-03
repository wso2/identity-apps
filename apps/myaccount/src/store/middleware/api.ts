/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com).
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

import axios, { AxiosError, AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { HttpRequestConfig } from "../../models";
import { apiRequestEnd, apiRequestStart } from "../actions";
import { API_REQUEST } from "../actions/types";

/**
 * Intercepts and handles actions of type `API_REQUEST`.
 *
 * @param dispatch - `dispatch` function from redux
 */
export const apiMiddleware = ({ dispatch }: {
    dispatch: Dispatch<any>
}) => (next: any) => (action: any): void => {
    next(action);

    if (action.type !== API_REQUEST) {
        return;
    }

    const { auth, dispatcher, headers, method, onSuccess, onError, url }: HttpRequestConfig = action.meta;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const data: any = action.payload;

    // `GET` requests and `DELETE` requests usually has params rather than data.
    const dataOrParams: string = [ "GET", "DELETE" ].includes(method) ? "params" : "data";

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
        .then((response: AxiosResponse<any>) => {
            dispatch({
                payload: response,
                type: onSuccess
            });
        })
        .catch((error: AxiosError) => {
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
