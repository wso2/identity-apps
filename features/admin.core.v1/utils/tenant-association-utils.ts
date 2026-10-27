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

import { getAssociatedTenants } from "@wso2is/admin.tenants.v1/api/tenants";
import { TenantInfo, TenantRequestResponse } from "@wso2is/admin.tenants.v1/models/tenant";

/**
 * Number of tenant associations fetched per `tenant/me` page.
 */
export const ASSOCIATED_TENANTS_PAGE_SIZE: number = 15;

/**
 * Upper bound on the number of `tenant/me` pages walked while looking for a single association.
 * Guards against an unbounded loop if the API ever reports an inconsistent `totalResults`.
 */
const MAX_ASSOCIATED_TENANTS_PAGES: number = 100;

/**
 * Fetches one page of the current user's tenant associations.
 */
type AssociatedTenantsPageFetcher = (_limit: number, _offset: number) => Promise<TenantRequestResponse>;

/**
 * Walk the pages of a tenant association list looking for a single domain.
 *
 * `tenant/me` has no way to filter by domain, so paging is the only way to reach an association
 * that is not on the first page. Most users have a handful of associations and are answered by the
 * first request.
 *
 * @param fetchPage - Fetches one page of associations.
 * @param tenantDomain - Domain of the tenant to look for.
 * @returns The association, or `undefined` if the user does not have one for that domain.
 */
export const findTenantAssociation = async (
    fetchPage: AssociatedTenantsPageFetcher,
    tenantDomain: string
): Promise<TenantInfo | undefined> => {
    if (!tenantDomain) {
        return undefined;
    }

    let offset: number = 0;

    for (let page: number = 0; page < MAX_ASSOCIATED_TENANTS_PAGES; page++) {
        const response: TenantRequestResponse = await fetchPage(ASSOCIATED_TENANTS_PAGE_SIZE, offset);
        const associations: TenantInfo[] = response?.associatedTenants ?? [];
        const match: TenantInfo = associations.find((tenant: TenantInfo) => tenant?.domain === tenantDomain);

        if (match) {
            return match;
        }

        offset += associations.length;

        // Stop once the API runs out of records, either by returning a short page or by reporting
        // that everything has been seen.
        if (associations.length < ASSOCIATED_TENANTS_PAGE_SIZE || offset >= (response?.totalResults ?? 0)) {
            return undefined;
        }
    }

    return undefined;
};

/**
 * Resolve the association record of a single tenant for the current user.
 *
 * @param tenantDomain - Domain of the tenant to resolve.
 * @returns The association, or `undefined` if the user does not have one for that domain.
 */
export const getTenantAssociation = (tenantDomain: string): Promise<TenantInfo | undefined> =>
    findTenantAssociation(
        (limit: number, offset: number) => getAssociatedTenants(null, limit, offset),
        tenantDomain
    );
