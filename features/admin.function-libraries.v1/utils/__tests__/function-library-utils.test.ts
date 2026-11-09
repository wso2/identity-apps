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

import { describe, expect, it } from "vitest";
import {
    FunctionLibraryNameValidationError,
    getFunctionLibraryImportStatement,
    validateFunctionLibraryName
} from "../function-library-utils";

describe("validateFunctionLibraryName", () => {
    it.each([
        "age-based.js",
        "age_based.js",
        "network.utils.js",
        "Lib1.js",
        "age based.js",
        "legacy lib v2.js"
    ])("accepts the valid name %s", (name: string) => {
        expect(validateFunctionLibraryName(name)).toBeUndefined();
    });

    it.each([
        [ "", FunctionLibraryNameValidationError.REQUIRED ],
        [ "   ", FunctionLibraryNameValidationError.REQUIRED ],
        [ undefined, FunctionLibraryNameValidationError.REQUIRED ],
        [ "age-based", FunctionLibraryNameValidationError.INVALID ],
        [ "age-based.js.bak", FunctionLibraryNameValidationError.INVALID ],
        [ "age\tbased.js", FunctionLibraryNameValidationError.INVALID ],
        [ "age*based.js", FunctionLibraryNameValidationError.INVALID ],
        [ ".js", FunctionLibraryNameValidationError.INVALID ],
        [ "age/based.js", FunctionLibraryNameValidationError.INVALID ],
        [ `${ "a".repeat(253) }.js`, FunctionLibraryNameValidationError.MAX_LENGTH ]
    ])("rejects %s with %s", (name: string, expectedError: FunctionLibraryNameValidationError) => {
        expect(validateFunctionLibraryName(name)).toBe(expectedError);
    });
});

describe("getFunctionLibraryImportStatement", () => {
    it.each([
        [ "age-based.js", "var ageBased = require(\"age-based.js\");" ],
        [ "network.utils.js", "var networkUtils = require(\"network.utils.js\");" ],
        [ "legacy lib.js", "var legacyLib = require(\"legacy lib.js\");" ],
        [ "1lib.js", "var _1lib = require(\"1lib.js\");" ],
        [ "class.js", "var _class = require(\"class.js\");" ],
        [ "new.js", "var _new = require(\"new.js\");" ],
        [ "null.js", "var _null = require(\"null.js\");" ],
        [ "let.js", "var _let = require(\"let.js\");" ],
        [ "my class.js", "var myClass = require(\"my class.js\");" ]
    ])("builds the require statement for %s", (name: string, expected: string) => {
        expect(getFunctionLibraryImportStatement(name)).toBe(expected);
    });

    it.each([
        "class.js", "new.js", "delete.js", "default.js", "this.js", "null.js", "true.js", "function.js",
        "1lib.js", "age-based.js", "legacy lib.js", "network.utils.js"
    ])("builds a statement for %s that compiles in strict mode", (name: string) => {
        expect(() => new Function(`"use strict"; ${ getFunctionLibraryImportStatement(name) }`)).not.toThrow();
    });
});
