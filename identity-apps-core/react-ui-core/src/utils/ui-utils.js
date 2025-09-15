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

/**
 * Returns the appropriate icon class for a given field.
 * @param {string} fieldName - The name or type of the field (e.g., "email", "username").
 * @returns {string|null} - The icon class to be used or null if no icon should be shown.
 */
export const getInputIconClass = (fieldName) => {
    if (!fieldName) {
        return null;
    }

    const iconMapping = {
        address: "home",
        email: "envelope outline",
        "http://wso2.org/claims/username": "user outline",
        password: "lock",
        phone: "phone"
    };

    return iconMapping[fieldName] || null;
};
