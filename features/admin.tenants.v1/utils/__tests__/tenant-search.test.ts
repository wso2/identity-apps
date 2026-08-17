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

import { describe, expect, it } from "vitest";
import { TenantInfo } from "../../models";
import {
    filterAssociatedTenants,
    hasMoreAssociatedTenants,
    shouldLoadMoreForTenantSearch
} from "../tenant-search";

const createTenant = (domain: string): TenantInfo => ({ domain } as TenantInfo);

describe("tenant search utilities", (): void => {
    const firstPageTenants: TenantInfo[] = Array.from(
        { length: 15 },
        (_value: unknown, index: number): TenantInfo => createTenant(`tenant-${index + 1}`)
    );

    it("does not load another page when a matching tenant is in the first page", (): void => {
        const matchingTenants: TenantInfo[] = filterAssociatedTenants(firstPageTenants, "tenant-1");

        expect(matchingTenants).toHaveLength(7);
        expect(shouldLoadMoreForTenantSearch("tenant-1", matchingTenants, true, false)).toBe(false);
    });

    it("loads the next page when a matching tenant is outside the first page", (): void => {
        const nextPageTenants: TenantInfo[] = [ createTenant("target-tenant") ];
        const matchingFirstPageTenants: TenantInfo[] = filterAssociatedTenants(firstPageTenants, "target");

        expect(shouldLoadMoreForTenantSearch("target", matchingFirstPageTenants, true, false)).toBe(true);
        expect(filterAssociatedTenants([ ...firstPageTenants, ...nextPageTenants ], "target"))
            .toEqual(nextPageTenants);
    });

    it("continues loading unmatched searches until the final page", (): void => {
        expect(shouldLoadMoreForTenantSearch("missing", [], true, false)).toBe(true);
        expect(shouldLoadMoreForTenantSearch("missing", [], false, false)).toBe(false);
    });

    it("restores the loaded paginated list when the search query is cleared", (): void => {
        const loadedTenants: TenantInfo[] = [ ...firstPageTenants, createTenant("target-tenant") ];

        expect(filterAssociatedTenants(loadedTenants, "target")).toEqual([ createTenant("target-tenant") ]);
        expect(filterAssociatedTenants(loadedTenants, "")).toEqual(loadedTenants);
    });

    it("does not initiate another request while a tenant page is loading", (): void => {
        expect(shouldLoadMoreForTenantSearch("target", [], true, true)).toBe(false);
    });

    it("identifies whether an associated tenant response has another page", (): void => {
        expect(hasMoreAssociatedTenants(16, 0, 15)).toBe(true);
        expect(hasMoreAssociatedTenants(16, 15, 1)).toBe(false);
    });
});
