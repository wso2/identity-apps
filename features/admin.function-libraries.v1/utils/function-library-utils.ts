/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { FunctionLibraryConstants } from "../constants";

/**
 * Validation errors of a function library name.
 */
export enum FunctionLibraryNameValidationError {
    REQUIRED = "required",
    INVALID = "invalid",
    MAX_LENGTH = "maxLength"
}

/**
 * Removes the `.js` ending from a function library name, for the name field, which shows `.js` after the input.
 *
 * @param name - Function library name, or the value typed in the name field.
 * @returns The name without spaces around it and without its `.js` ending.
 */
export const getFunctionLibraryNameWithoutSuffix = (name: string): string => {
    const trimmedName: string = name?.trim() ?? "";

    return trimmedName.endsWith(FunctionLibraryConstants.NAME_SUFFIX)
        ? trimmedName.slice(0, -FunctionLibraryConstants.NAME_SUFFIX.length).trim()
        : trimmedName;
};

/**
 * Builds the function library name from the value typed in the name field: `.js` is added, unless it was typed.
 *
 * @param value - Value of the name field.
 * @returns The function library name, e.g. `age-based.js` for both `age-based` and `age-based.js`.
 */
export const getFunctionLibraryName = (value: string): string =>
    `${ getFunctionLibraryNameWithoutSuffix(value) }${ FunctionLibraryConstants.NAME_SUFFIX }`;

/**
 * Validates the value of the name field, with or without its `.js` ending.
 *
 * @param value - Value to validate.
 * @returns The validation error, or `undefined` if the name is valid.
 */
export const validateFunctionLibraryName = (value: string): FunctionLibraryNameValidationError | undefined => {
    const nameWithoutSuffix: string = getFunctionLibraryNameWithoutSuffix(value);

    if (!nameWithoutSuffix) {
        return FunctionLibraryNameValidationError.REQUIRED;
    }

    if (getFunctionLibraryName(value).length > FunctionLibraryConstants.NAME_MAX_LENGTH) {
        return FunctionLibraryNameValidationError.MAX_LENGTH;
    }

    if (!FunctionLibraryConstants.NAME_REGEX.test(nameWithoutSuffix)) {
        return FunctionLibraryNameValidationError.INVALID;
    }

    return undefined;
};

/**
 * Builds the statement used to import a function library in a conditional authentication script.
 *
 * @param name - Name of the function library.
 * @returns The `require` statement.
 */
export const getFunctionLibraryImportStatement = (name: string): string => {
    // Derive a valid JS identifier from the library name. e.g. `age-based.js` -> `ageBased`.
    let moduleName: string = name.replace(/\.js$/, "").replace(/[^\w]+(\w?)/g,
        (_match: string, nextChar: string) => nextChar.toUpperCase());

    if (!moduleName) {
        moduleName = "library";
    } else if (/^\d/.test(moduleName) || FunctionLibraryConstants.JS_RESERVED_WORDS.has(moduleName)) {
        moduleName = `_${ moduleName }`;
    }

    return `var ${ moduleName } = require("${ name }");`;
};
