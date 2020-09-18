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
import { IdentityAppsApiException } from "../exceptions";
import { AppConstants } from "../constants";
import { StringUtils } from "../utils";

/**
 * Fetches the application config file.
 *
 * @param {string} configFileName - Config file name.
 * @param {string} appBaseName - App base name.
 * @return {Promise<T>} Config as a promise.
 */
export const getAppConfig = <T>(configFileName = AppConstants.DEFAULT_APP_CONFIG_FILE_NAME,
                                appBaseName: string): Promise<T> => {

    return axios.get(`/${ StringUtils.removeSlashesFromPath(appBaseName) }/${ configFileName }`)
        .then((response) => {
            return Promise.resolve(response.data as T);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                AppConstants.APP_CONFIG_FETCH_ERROR_MESSAGE,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
