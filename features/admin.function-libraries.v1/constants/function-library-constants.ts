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

/**
 * Class containing function library management constants.
 */
export class FunctionLibraryConstants {

    private constructor() { }

    /**
     * Matches the `NAME` column size of the `IDN_FUNCTION_LIBRARY` table.
     */
    public static readonly NAME_MAX_LENGTH: number = 255;
    /**
     * Ending of every function library name. The name field shows it after the input and adds it to the name.
     */
    public static readonly NAME_SUFFIX: string = ".js";
    /**
     * Same limit enforced by the legacy management console.
     */
    public static readonly DESCRIPTION_MAX_LENGTH: number = 1020;
    /**
     * The characters allowed by the backend (`^[a-zA-Z0-9 ._-]*$`, spaces included, as in the legacy
     * management console), for the name without its `.js` ending.
     */
    public static readonly NAME_REGEX: RegExp = /^[a-zA-Z0-9 ._-]+$/;
    /**
     * JavaScript reserved words, including those reserved in strict mode, which cannot be used as variable names.
     */
    public static readonly JS_RESERVED_WORDS: ReadonlySet<string> = new Set<string>([
        "arguments", "await", "break", "case", "catch", "class", "const", "continue", "debugger", "default",
        "delete", "do", "else", "enum", "eval", "export", "extends", "false", "finally", "for", "function", "if",
        "implements", "import", "in", "instanceof", "interface", "let", "new", "null", "package", "private",
        "protected", "public", "return", "static", "super", "switch", "this", "throw", "true", "try", "typeof",
        "var", "void", "while", "with", "yield"
    ]);
}
