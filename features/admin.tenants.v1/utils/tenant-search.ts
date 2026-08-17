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

import { TenantInfo } from "../models";

/**
 * Filters associated tenants by their domain.
 *
 * @param tenants - Associated tenants available to the switcher.
 * @param query - Search query entered by the user.
 * @returns Matching tenants, or all tenants when the query is empty.
 */
export const filterAssociatedTenants: (_tenants: TenantInfo[], _query: string) => TenantInfo[] = (
    tenants: TenantInfo[],
    query: string
): TenantInfo[] => {
    const normalizedQuery: string = query.trim().toLowerCase();

    if (!normalizedQuery) {
        return tenants;
    }

    return tenants.filter((tenant: TenantInfo): boolean =>
        tenant.domain?.toLowerCase().includes(normalizedQuery));
};

/**
 * Determines whether a search must retrieve another associated tenant page.
 *
 * @param query - Search query entered by the user.
 * @param matchingTenants - Matching tenants in the loaded pages.
 * @param hasMoreTenants - Whether the API has more pages.
 * @param isLoading - Whether an associated tenant request is in progress.
 * @param retryCount - Number of retries attempted for the current search page.
 * @returns Whether the next page should be requested.
 */
export const shouldLoadMoreForTenantSearch: (
    _query: string,
    _matchingTenants: TenantInfo[],
    _hasMoreTenants: boolean,
    _isLoading: boolean,
    _retryCount: number
) => boolean = (
    query: string,
    matchingTenants: TenantInfo[],
    hasMoreTenants: boolean,
    isLoading: boolean,
    retryCount: number
): boolean => Boolean(query.trim()) && matchingTenants.length === 0 && hasMoreTenants && !isLoading && retryCount < 2;

/**
 * Determines whether a paginated associated tenant response has a next page.
 *
 * @param totalResults - Total tenant associations reported by the API.
 * @param offset - Offset used for the current request.
 * @param resultCount - Number of tenants returned by the current request.
 * @returns Whether the API has more associated tenant pages.
 */
export const hasMoreAssociatedTenants: (_totalResults: number, _offset: number, _resultCount: number) => boolean = (
    totalResults: number,
    offset: number,
    resultCount: number
): boolean => totalResults > offset + resultCount;
