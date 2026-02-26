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

    // 1. Plain array (e.g., userstores, claims)
    if (Array.isArray(response)) {
        return {
            count: response.length,
            items: response,
            totalResults: response.length
        };
    }

    // 2. SCIM format (e.g., Groups, Roles) — has "Resources" key
    if (Array.isArray(response.Resources)) {
        return {
            count: response.itemsPerPage ?? response.Resources.length,
            items: response.Resources,
            totalResults: response.totalResults ?? response.Resources.length
        };
    }

    // 3. Applications format (Legacy WSO2 Server API) — has "applications" key
    if (Array.isArray(response.applications)) {
        return {
            count: response.count ?? response.applications.length,
            items: response.applications,
            totalResults: response.totalResults ?? response.applications.length
        };
    }

    // ========================================================================
    // HOW TO ADD A NEW API RESOURCE SHAPE:
    // If a new API endpoint returns data under a different key (e.g., "devices"),
    // simply add a new explicit block here:
    //
    // if (Array.isArray(response.devices)) {
    //     return {
    //         count: response.count ?? response.devices.length,
    //         items: response.devices,
    //         totalResults: response.totalResults ?? response.devices.length
    //     };
    // }
    // ========================================================================

    // Fallback if no known structure is matched
    return { count: 0, items: [], totalResults: 0 };
};
