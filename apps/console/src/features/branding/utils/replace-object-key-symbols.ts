/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import isObject from "lodash-es/isObject";
import transform from "lodash-es/transform";

/**
 * Replaces all occurrences of a symbol in an object's keys recursively.
 *
 * @example
 * ```
 * // Returns { "foo-bar": "baz" }
 * replaceSymbolsRecursively({ "foo_bar": "baz" }, "_", "-");
 * ```
 * @param obj - Object to replace symbols in.
 * @param targetSymbol - Symbol to replace.
 * @param replacementSymbol - Symbol to replace with.
 * @returns Object with replaced symbols.
 */
const replaceObjectKeySymbols = (
    obj: Record<string, unknown>,
    targetSymbol: string,
    replacementSymbol: string
): Record<string, unknown> => {
    return transform(obj, (result: Record<string, unknown>, value: Record<string, unknown>, key: string) => {
        const newKey: string = key.replaceAll(targetSymbol, replacementSymbol);

        if (isObject(value)) {
            // If the value is an object, recursively call the function
            result[newKey] = replaceObjectKeySymbols(value, targetSymbol, replacementSymbol);
        } else {
            // If not an object, simply assign the value
            result[newKey] = value;
        }
    });
};

export default replaceObjectKeySymbols;
