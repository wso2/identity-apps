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
 * Utility class for encode and santization operations.
 */
export class Encode {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

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
    public static forHtml(htmlString: string): string {
        return DOMPurify.sanitize(htmlString);
    }
}
