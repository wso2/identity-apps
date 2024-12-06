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

const MIN_ALLOWED_FONT_SIZE = 8;
const MAX_ALLOWED_FONT_SIZE = 72;

export const parseAllowedFontSize = (input: string): string => {
    const match = input.match(/^(\d+(?:\.\d+)?)px$/);

    if (match) {
        const n = Number(match[1]);

        if (n >= MIN_ALLOWED_FONT_SIZE && n <= MAX_ALLOWED_FONT_SIZE) {
            return input;
        }
    }

    return "";
};

export function parseAllowedColor(input: string) {
    return /^rgb\(\d+, \d+, \d+\)$/.test(input) ? input : "";
}
