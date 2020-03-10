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

/**
 * Utility class for encode decode operations.
 */
export class EncodeDecodeUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Decodes a regex URL which and returns the individual URLs as
     * an array.
     *
     * @param {string} raw - Raw URL.
     * @param {string} separator - Characters to use in separating the string.
     * @return {string[]} An array of URLs.
     */
    public static decodeURLRegex(raw: string, separator = ","): string[] {
        if (!this.isRegexURL(raw)) {
            return raw.split(separator);
        }

        const rawURLs = raw.replace("regexp=(", "").replace(")", "");

        return rawURLs.split("|");
    }

    /**
     * Checks if the URL is a regex.
     *
     * @param {string} raw - Raw URL.
     * @return {boolean} If the URL is an regex or not.
     */
    public static isRegexURL(raw: string): boolean {
        return raw.includes("regexp=(");
    }
}
