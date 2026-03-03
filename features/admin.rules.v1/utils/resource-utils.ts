/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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

import { ResourceInterface } from "../models/resource";

/**
 * Interface for normalized resource list response.
 */
export interface NormalizedResourceList {
    count: number;
    items: ResourceInterface[];
    totalResults: number;
}

/**
 * Normalizes different API response shapes into a standard format.
 * Acts as a central registry for supported API response structures.
 *
 * When a new API endpoint returns data under a different key, add an explicit
 * block here to handle that format.
 *
 * @param response - The raw API response.
 * @returns The normalized resource list.
 */
export const normalizeResourceResponse = (response: any): NormalizedResourceList => {
    if (!response) {
        return { count: 0, items: [], totalResults: 0 };
    }

    // Plain array (e.g., userstores)
    if (Array.isArray(response)) {
        return {
            count: response.length,
            items: response,
            totalResults: response.length
        };
    }

    if (Array.isArray(response.Resources)) {
        return {
            count: response.itemsPerPage ?? response.Resources.length,
            items: response.Resources,
            totalResults: response.totalResults ?? response.Resources.length
        };
    }

    if (Array.isArray(response.applications)) {
        return {
            count: response.count ?? response.applications.length,
            items: response.applications,
            totalResults: response.totalResults ?? response.applications.length
        };
    }

    return { count: 0, items: [], totalResults: 0 };
};
