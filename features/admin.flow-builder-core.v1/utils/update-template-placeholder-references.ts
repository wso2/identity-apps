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

import generateResourceId from "./generate-resource-id";

const updateTemplatePlaceholderReferences = (obj: any, replacers: any[]): any => {
    const placeholderCache = new Map<string, string>();

    const replacePlaceholders = (input: any): any => {
        if (Array.isArray(input)) {
            return input.map(value => replacePlaceholders(value));
        } else if (typeof input === "object" && input !== null) {
            return Object.fromEntries(
                Object.entries(input).map(([ key, value ]) => {
                    if (typeof value === "string") {
                        // Extract placeholder key (remove {{ }})
                        const placeholderKey = value.replace(/[{}]/g, "");

                        // Check if we already replaced this placeholder
                        if (placeholderCache.has(placeholderKey)) {
                            return [ key, placeholderCache.get(placeholderKey) ];
                        }

                        // Find the matching replacer
                        const replacer = replacers?.find(r => r.key === placeholderKey);

                        if (replacer) {
                            let replacementValue: string;

                            if (replacer.type === "ID") {
                                replacementValue = generateResourceId(replacer.type);
                            } else {
                                replacementValue = replacer.value || value; // Default to original if no value
                            }

                            // Store the replacement in the cache
                            placeholderCache.set(placeholderKey, replacementValue);

                            return [ key, replacementValue ];
                        }
                    }

                    return [ key, replacePlaceholders(value) ];
                })
            );
        }

        return input;
    };

    return [ replacePlaceholders(obj), placeholderCache ];
};

export default updateTemplatePlaceholderReferences;
