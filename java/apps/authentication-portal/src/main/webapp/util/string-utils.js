/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com).
 * 
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
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
