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
 * Recursively removes the `id` attribute from the given object.
 *
 * @param obj - Input of a JSON object or an Array of JSON objects.
 * @returns Object without `id` properties.
 */
export const removeIds = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(removeIds);
    } else if (typeof obj === "object" && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([ key ]: [string, any]) => key !== "id")
                .map(([ key, value ]: [string, any]) => [ key, removeIds(value) ])
        );
    }

    return obj;
};

export default removeIds;
