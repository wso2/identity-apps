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
 *
 */

import { PatternConstants } from "../constants";

/**
 * Utility class for URL operations and validations.
 */
export class URLUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Checks if the passed in url is a valid Http URL.
     *
     * @param {string} url - URL to evaluate.
     *
     * @return {boolean} True if the url is a http url.
     */
    public static isHttpUrl(url: string): boolean {
        return !!url.trim().match(PatternConstants.HTTP_URL_REGEX_PATTERN);
    }

    /**
     * Checks if the passed in url is a valid Https URL.
     *
     * @param {string} url - URL to evaluate.
     *
     * @return {boolean} True if the url is a https url.
     */
    public static isHttpsUrl(url: string): boolean {
        return !!url.trim().match(PatternConstants.HTTPS_URL_REGEX_PATTERN);
    }

    /**
     * Checks if the passed in url starts with HTTP/HTTPS.
     *
     * @param {string} url - URL to evaluate.
     *
     * @return {boolean} True if the url is a https/http url.
     */
    public static isHttpsOrHttpUrl(url: string): boolean {
        return !!url.trim().match(PatternConstants.HTTPS_OR_HTTP_REGEX_PATTERN);
    }

    /**
     * Checks if the passed in url is a valid data URL.
     *
     * @param {string} url - URL to evaluate.
     *
     * @return {boolean} True if the url is a data url.
     */
    public static isDataUrl(url: string): boolean {
        return !!url.trim().match(PatternConstants.DATA_URL_REGEX_PATTERN);
    }

    /**
     * Checks if the the provided URL is a valid mobile deep link.
     *
     * @param {string} url - The URL to evaluate.
     *
     * @return {boolean} True if the URL is a mobile deep link.
     */
    public static isMobileDeepLink(url: string): boolean{
        return !!url.trim().match(PatternConstants.MOBILE_DEEP_LINK_URL_REGEX_PATTERN);
    }
}
