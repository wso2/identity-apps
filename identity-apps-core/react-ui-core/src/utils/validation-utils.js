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

export const isRequired = value => value !== undefined && value !== null && value.trim() !== "";

export const validateWithRegex = (value, regex) => {
    if (!value || !regex) {

        return false;
    }

    const pattern = new RegExp(regex);

    return pattern.test(value);
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse a YYYY-MM-DD string into a Date.
 * Returns null when the string is not an existing calendar date (e.g. "2025-02-30").
 */
export const parseIsoDate = (value) => {
    if (!value || !ISO_DATE_PATTERN.test(value)) {

        return null;
    }

    const [ year, month, day ] = value.split("-").map((part) => parseInt(part, 10));
    const date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year || (date.getMonth() + 1) !== month || date.getDate() !== day) {

        return null;
    }

    return date;
};

/**
 * Whether the given YYYY-MM-DD string represents a date after today.
 */
export const isFutureDate = (value) => {
    const date = parseIsoDate(value);

    if (!date) {

        return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return date > today;
};
