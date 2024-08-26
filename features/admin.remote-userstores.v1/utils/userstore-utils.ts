/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
 * This validates and extracts the matched string with Regex.
 *
 * @returns validity status and the invalid string
 */
export const validateInputWithRegex = (input: string, regex: string): Map<string, string | boolean> => {
    const regExpInvalidSymbols: RegExp = new RegExp(regex);

    let isMatch: boolean = false;
    let invalidStringValue: string = "";

    if (regExpInvalidSymbols.test(input)) {
        isMatch = true;
        if (regExpInvalidSymbols.exec(input) != null) {
            invalidStringValue = regExpInvalidSymbols.exec(input).toString();
        }
    }

    const validityResultsMap: Map<string, string | boolean> = new Map<string, string | boolean>();

    validityResultsMap.set("isMatch", isMatch);
    validityResultsMap.set("invalidStringValue", invalidStringValue);

    return validityResultsMap;
};
