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
 * Utility class for string operations.
 */
export class StringUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Constructs a separated string when a string array or a string
     * is passed in. The separator can be passed in as a parameter
     * and if the type of the raw input is string, a split separator
     * can be passed in to split the string if needed. The default
     * split separator will be ",".
     *
     * @param {string[] | string} raw - Raw input.
     * @param {string} separator - Separator character.
     * @param {string} splitSeparator - Character to split the string.
     * @return {string} Modified string.
     */
    public static constructSeparatedString(raw: string[] | string,
                                           separator: string,
                                           splitSeparator = ","): string {
        if (raw instanceof Array) {
            return raw.join(separator + " ");
        } else if (typeof raw === "string") {
            return raw.split(splitSeparator).join(separator);
        }
        return raw;
    }

    /**
     * Transforms a string to sentence case.
     *
     * @param {string} raw - Raw string.
     * @return {string} Text in sentence case.
     */
    public static toSentenceCase(raw: string): string {
        const parts = raw.split(" ");
        let newStr = "";

        parts.forEach((part, index) => {
            part = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();

            if (index === 0) {
                newStr = part;
                return; // forEach doesn't support `continue`.
            }

            newStr = newStr + " " + part;
        });

        return newStr;
    }

    /**
     * Checks if a string is a valid JSON string.
     * Useful when trying to parse JSON to avoid errors.
     *
     * @param {string} str - Evaluating string
     * @return {boolean} If valid or not.
     */
    public static isValidJSONString(str: string): boolean {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }

        return true;
    }

    /**
     * Removes leading and trailing slashes from a path.
     *
     * @example
     * // returns "sample-portal"
     * removeSlashesFromPath("/sample-portal/");
     *
     * @param {string} path - Raw path.
     * @param {boolean} leading - Leading slashes should be removed or not.
     * @param {boolean} trailing - Trailing slashes should be removed or not.
     * @return {string} Modified path.
     */
    public static removeSlashesFromPath(path: string, leading = true, trailing = true): string {
        if (leading && trailing) {
            return path?.replace(/^\/+|\/+$/g, "");
        } else if (leading) {
            return path?.replace(/^\/+/g, "");
        } else if (trailing) {
            return path?.replace(/\/+$/g, "");
        }

        return path;
    }

    /**
     * Removes leading dots and slashes from a relative path.
     *
     * @example
     * // returns "assets/img/test.jpg"
     * removeDotsAndSlashesFromRelativePath("../../assets/img/test.jpg");
     *
     * @param {string} path - Relative path.
     * @return {string} Modified path.
     */
    public static removeDotsAndSlashesFromRelativePath(path: string): string {
        return path.replace(/\.\.\//g, "");
    }
}
