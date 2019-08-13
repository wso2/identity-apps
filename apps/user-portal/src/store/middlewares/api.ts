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
import { apiRequestEnd, apiRequestStart } from "../actions";
import { API } from "../actions/types";

export const apiMiddleware = ({ dispatch }) => (next) => (action) => {
    if (action.type !== API) {
        return next(action);
    }

    const { auth, data, headers, method, onSuccess, onError, params, url } = action.payload;
    const { dispatcher } = action.meta;

    if (dispatcher) {
        dispatch(apiRequestStart(dispatcher));
    }

    axios({
        auth,
        data,
        headers,
        method,
        params,
        url
    })
        .then((response) => {
            dispatch(onSuccess(response));
        })
        .catch((error) => {
            log.error(error);
            dispatch(onError(error));
        })
        .finally(() => {
            if (dispatcher) {
                dispatch(apiRequestEnd(dispatcher));
            }
        });
};
