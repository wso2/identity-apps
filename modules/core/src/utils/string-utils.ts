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
                                           splitSeparator: string = ","): string {
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
}
