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
import { API_REQUEST, apiRequestEnd, apiRequestStart } from "../actions";

const api = ({ dispatch }) => (next) => (action) => {
    if (action.type !== API_REQUEST) {
        return next(action);
    }

    const { auth, dispatcher, headers, method, onSuccess, onError, url } = action.meta;
    const { data } = action.payload;
    const dataOrParams = ["GET", "DELETE"].includes(method) ? "params" : "data";

    if (dispatcher) {
        dispatch(apiRequestStart(dispatcher));
    }

    axios
        .request({
            auth,
            [dataOrParams]: data,
            headers,
            method,
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

export const apiMiddleware = [api];
