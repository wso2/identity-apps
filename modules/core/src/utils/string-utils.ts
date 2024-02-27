/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import DOMPurify from "dompurify";

/**
 * Utility class for string operations.
 */
export class StringUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
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
     * @param raw - Raw input.
     * @param separator - Separator character.
     * @param splitSeparator - Character to split the string.
     * @returns Modified string.
     */
    public static constructSeparatedString(
        raw: string[] | string,
        separator: string,
        splitSeparator: string = ","
    ): string {
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
     * @param raw - Raw string.
     * @returns Text in sentence case.
     */
    public static toSentenceCase(raw: string): string {
        const parts: string[] = raw.split(" ");
        let newStr: string = "";

        parts.forEach((part: string, index: number) => {
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
     * @param str - Evaluating string
     * @returns If valid or not.
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
     * @param path - Raw path.
     * @param leading - Leading slashes should be removed or not.
     * @param trailing - Trailing slashes should be removed or not.
     * @returns Modified path.
     */
    public static removeSlashesFromPath(path: string, leading: boolean = true, trailing: boolean = true): string {
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
     * @param path - Relative path.
     * @returns Modified path.
     */
    public static removeDotsAndSlashesFromRelativePath(path: string): string {
        return path.replace(/\.\.\//g, "");
    }

    /**
     * Sanitizes an HTML string.
     *
     * @example
     * // returns "<p>Test</p>"
     * sanitizeHTMLString("<script>Test</script>");
     *
     * @param htmlString - HTML string to be sanitized.
     * @returns Sanitized HTML string.
     */
    public static sanitizeHTMLString(htmlString: string): string {
        return DOMPurify.sanitize(htmlString);
    }
}
