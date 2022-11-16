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

import axios, { AxiosError } from "axios";
import { ProfileConstants } from "../constants";
import { IdentityAppsApiException } from "../exceptions";
import { GravatarFallbackTypes, HttpMethods } from "../models";
import { ProfileUtils } from "../utils";

/**
 * Get Gravatar image using the email address.
 *
 * @param {string} email - Email address.
 * @param {number} size - Size of the image from 1 up to 2048.
 * @param {string} defaultImage - Custom default fallback image URL.
 * @param {GravatarFallbackTypes} fallback - Built in fallback strategy.
 * @return {Promise<string>} Valid Gravatar URL as a Promise.
 * @throws {IdentityAppsApiException}
 */
export const getGravatarImage = (email: string,
    size?: number,
    defaultImage?: string,
    fallback: GravatarFallbackTypes = "404"): Promise<string> => {

    const requestConfig = {
        method: HttpMethods.GET,
        url: ProfileUtils.buildGravatarURL(email, size, defaultImage, fallback)
    };

    return axios.request(requestConfig)
        .then(() => {
            return Promise.resolve(requestConfig.url);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ProfileConstants.GRAVATAR_IMAGE_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
