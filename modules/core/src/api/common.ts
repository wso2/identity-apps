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

import axios from "axios";
import { CommonConstants } from "../constants";
import { IdentityAppsApiException } from "../exceptions";

/**
 * Fetches a static file from a URL.
 *
 * @param {string} url - URL path.
 *
 * @return {Promise<T>} Config as a promise.
 */
export const fetchFromURL = <T>(url: string): Promise<T> => {

    return axios.get(url)
        .then((response) => {
            return Promise.resolve(response.data as T);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                CommonConstants.AXIOS_FETCH_REQUEST_ERROR_MESSAGE,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
