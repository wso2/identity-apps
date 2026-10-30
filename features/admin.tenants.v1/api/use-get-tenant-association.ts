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

import { AppState } from "@wso2is/admin.core.v1/store";
import { useSelector } from "react-redux";
import useSWR, { SWRResponse } from "swr";
import { getAssociatedTenants } from "./tenants";
import TenantConstants from "../constants/tenant-constants";
import { TenantInfo, TenantRequestResponse } from "../models/tenant";

/**
 * Upper bound on the `tenant/me` pages walked past the first one.
 */
const MAX_ASSOCIATED_TENANTS_PAGES: number = 10;

export interface UseGetTenantAssociationInterface {
    data: TenantInfo | undefined;
    error: unknown;
    isLoading: boolean;
}

/**
 * Walk `tenant/me` from `startOffset` looking for a single domain, since the API cannot filter by it.
 *
 * @param tenantDomain - Domain of the tenant to look for.
 * @param startOffset - Offset to start from.
 * @returns The association, or `undefined` if the user does not have one for that domain.
 */
const findTenantAssociation: (_tenantDomain: string, _startOffset: number) => Promise<TenantInfo | undefined> = async (
    tenantDomain: string,
    startOffset: number
): Promise<TenantInfo | undefined> => {
    const pageSize: number = TenantConstants.ASSOCIATED_TENANTS_PAGE_SIZE;
    let offset: number = startOffset;

    for (let page: number = 0; page < MAX_ASSOCIATED_TENANTS_PAGES; page++) {
        const response: TenantRequestResponse = await getAssociatedTenants(undefined, pageSize, offset);
        const associations: TenantInfo[] = response?.associatedTenants ?? [];
        const match: TenantInfo = associations.find((tenant: TenantInfo) => tenant?.domain === tenantDomain);

        if (match) {
            return match;
        }

        offset += associations.length;

        if (associations.length < pageSize
            || (Number.isFinite(response?.totalResults) && offset >= response.totalResults)) {
            return undefined;
        }
    }

    return undefined;
};

/**
 * Hook to get the current user's association with a tenant.
 *
 * `state.auth.tenants` holds the first page of associations, loaded by the tenant dropdown, so it
 * answers most users without a request. Only when that page is full and does not hold the tenant
 * are the remaining pages walked.
 *
 * @param tenantDomain - Domain of the tenant.
 * @param shouldFetch - Should fetch the data.
 * @returns The association, or `undefined` while loading or if the user has none for that domain.
 */
const useGetTenantAssociation: (_tenantDomain: string, _shouldFetch?: boolean) => UseGetTenantAssociationInterface = (
    tenantDomain: string,
    shouldFetch: boolean = true
): UseGetTenantAssociationInterface => {
    const loadedTenants: TenantInfo[] = useSelector((state: AppState) => state?.auth?.tenants);

    const tenants: TenantInfo[] = Array.isArray(loadedTenants) ? loadedTenants : [];
    const knownAssociation: TenantInfo | undefined = tenantDomain
        ? tenants.find((tenant: TenantInfo) => tenant?.domain === tenantDomain)
        : undefined;
    const hasMorePages: boolean = tenants.length >= TenantConstants.ASSOCIATED_TENANTS_PAGE_SIZE;

    const { data, error, isLoading }: SWRResponse<TenantInfo | undefined, unknown> = useSWR(
        shouldFetch && tenantDomain && !knownAssociation && hasMorePages
            ? [ "tenant-association", tenantDomain ]
            : null,
        () => findTenantAssociation(tenantDomain, tenants.length),
        {
            errorRetryCount: 3,
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );

    return {
        data: shouldFetch ? knownAssociation ?? data : undefined,
        error,
        isLoading
    };
};

export default useGetTenantAssociation;
