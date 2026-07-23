/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { URLUtils } from "@wso2is/core/utils";

/**
 * Whether the whole value is a single atomic `regexp=(...)` pattern.
 *
 * @param value - Callback URL value.
 * @returns `true` if the value is a single wrapped regex.
 */
export const isSingleRegexValue = (value: string): boolean => {
    return !!value && /^regexp=\(.+\)$/.test(value.trim());
};

/**
 * Splits the URL state into chips, keeping a single atomic regex as one chip
 * instead of splitting it on the commas that may appear inside the pattern.
 *
 * @param urls - The stored callback URL state.
 * @returns The list of chips to display.
 */
export const splitURLState = (urls: string): string[] => {
    if (!urls) {
        return [];
    }

    if (isSingleRegexValue(urls)) {
        return [ urls ];
    }

    return urls.split(",");
};

/**
 * Individual alternatives of a callback value: a comma list splits on commas;
 * a regex splits on `|` only when every part is a plain URL, else is kept whole
 * so a complex pattern is never corrupted.
 *
 * @param value - A callback value (comma list or wrapped regex).
 * @returns The list of alternatives.
 */
const toRegexAlternatives = (value: string): string[] => {
    if (isSingleRegexValue(value)) {
        const inner: string = value.trim().replace(/^regexp=\(/, "").replace(/\)$/, "");
        const parts: string[] = inner.split("|");

        return parts.every((part: string): boolean => URLUtils.isHttpsOrHttpUrl(part)) ? parts : [ inner ];
    }

    return value.split(",");
};

/**
 * A value that mixes regex and comma-list syntax (e.g. `regexp=(a),b`), which is not allowed.
 *
 * @param value - The entered value.
 * @returns `true` if the value mixes both syntaxes.
 */
export const isMixedRegexInput = (value: string): boolean => {
    const v: string = value.trim();

    return v.includes("regexp=(") && !isSingleRegexValue(v) && v.includes(",");
};

/**
 * Combines an existing URL-state value with a newly added entry when either side is a regex:
 * flattens both to their alternatives, de-duplicates, and wraps them as a single `regexp=(...)`.
 *
 * @param existing - The current URL state.
 * @param added - The newly added entry.
 * @returns The combined, de-duplicated `regexp=(...)` value.
 */
export const combineRegexCallbackUrls = (existing: string, added: string): string => {
    const alternatives: string[] = [ ...toRegexAlternatives(existing), ...toRegexAlternatives(added) ];
    const unique: string[] = alternatives.filter(
        (value: string, index: number): boolean => alternatives.indexOf(value) === index
    );

    return `regexp=(${ unique.join("|") })`;
};
