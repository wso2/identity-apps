/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

/**
 * String Utils class to perform string related operations.
*/
var StringUtils = /** @class */ ( function () {

    function StringUtils() {}

    /**
     * Returns the kebabcase formatting of a given string.
     * 
     * Note: This is only a simple kebabcase formatter and will not correctly transform complex inputs.
     * 
     * @param {string} str - Input string.
     * @returns {string} Formatted string.
    */
    StringUtils.kebabCase = function (/** @type {string} */ str) {
        /**
         * Conversion steps.
         * 
         * - Insert a hyphen in between letters if a lowercase letter followed by a uppercase letter.
         * - Insert a hyphen in between the second letter and the third letter if three uppercase letters 
         *   followed by a lowercase letter.
         * - Replace one or more spaces or underscores from a hyphen.
         * - Transform all letters to lowercase.
        */
        return str.trim()
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/([A-Z])([A-Z])([A-Z])([a-z])/g, '$1$2-$3$4')
            .replace(/[\s_]+/g, '-')
            .toLowerCase();
    };

    return StringUtils;

}());
