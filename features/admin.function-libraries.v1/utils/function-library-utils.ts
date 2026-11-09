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

import { PickerStrategy } from "@wso2is/react-components";
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
 * Validates the name of a new function library.
 *
 * @param name - Name to validate.
 * @returns The validation error, or `undefined` if the name is valid.
 */
export const validateFunctionLibraryName = (name: string): FunctionLibraryNameValidationError | undefined => {
    const trimmedName: string = name?.trim();

    if (!trimmedName) {
        return FunctionLibraryNameValidationError.REQUIRED;
    }

    if (trimmedName.length > FunctionLibraryConstants.NAME_MAX_LENGTH) {
        return FunctionLibraryNameValidationError.MAX_LENGTH;
    }

    if (!FunctionLibraryConstants.NAME_REGEX.test(trimmedName)) {
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

/**
 * File picker strategy that accepts JavaScript files.
 */
export class JavaScriptFileStrategy implements PickerStrategy<string> {

    public mimeTypes: string[] = [ ".js", "text/javascript", "application/javascript" ];

    /**
     * Serializes pasted content as is. The content of a selected file is read by the content editor, so that a
     * read which finishes after a newer file or an edit can be discarded.
     *
     * @param data - Selected file or pasted content.
     * @returns The pasted content, or an empty string for a file.
     */
    public async serialize(data: File | string): Promise<string> {
        return typeof data === "string" ? data : "";
    }

    /**
     * Accepts any content; the server validates the library.
     *
     * @returns A valid result.
     */
    public async validate(): Promise<{ valid: boolean }> {
        return { valid: true };
    }
}
