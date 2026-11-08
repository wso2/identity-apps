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

const PLACEHOLDER_PATTERN = /\{\{([^}]+)\}\}/g;

/**
 * Reads a value by a dot notation path, such as "branding.supportEmail".
 *
 * @param {Object} obj - The object to read.
 * @param {string} path - The dot notation path.
 * @returns {string} The value, or an empty string when it is missing, null or empty.
 */
export const getNestedValue = (obj, path) => {
    try {
        return path.split(".").reduce((current, key) => {
            const value = current && current[key];

            return value != null && value !== "" && value !== "null" ? value : "";
        }, obj);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Error resolving path "${path}":`, error);

        return "";
    }
};

/**
 * Reads a step data value. Step data keys are flat, so the key itself is tried before a nested path.
 *
 * @param {Object} stepData - Additional data of the current step.
 * @param {string} key - The key or dot notation path.
 * @returns {string} The value, or an empty string when it is missing.
 */
export const getStepDataValue = (stepData, key) => {
    if (!stepData) {
        return "";
    }

    const value = stepData[key];

    if (value != null && value !== "" && value !== "null") {
        return value;
    }

    return getNestedValue(stepData, key);
};

/**
 * Replaces {{key}} placeholders with the first non empty value the resolvers return, in order.
 * A placeholder no resolver knows is kept as it is.
 *
 * @param {string} text - The text with placeholders.
 * @param {Array<function(string): string>} resolvers - Resolvers tried in order for each key.
 * @returns {string} The text with the placeholders resolved.
 */
export const resolvePlaceholders = (text, resolvers) => {
    if (!text || typeof text !== "string") {
        return text;
    }

    return text.replace(PLACEHOLDER_PATTERN, (match, keyPath) => {
        const key = keyPath.trim();

        for (const resolver of resolvers) {
            const value = resolver(key);

            if (value != null && value !== "") {
                return value;
            }
        }

        return match;
    });
};

/**
 * Escapes a value for use in HTML.
 *
 * @param {string} value - The value.
 * @returns {string} The escaped value.
 */
export const escapeHtml = (value) => {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};
