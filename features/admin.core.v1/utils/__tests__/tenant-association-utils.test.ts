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

import { TenantInfo, TenantRequestResponse } from "@wso2is/admin.tenants.v1/models/tenant";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { ASSOCIATED_TENANTS_PAGE_SIZE, findTenantAssociation } from "../tenant-association-utils";

const fetchPage: Mock = vi.fn();

const association = (index: number): TenantInfo => ({
    associationType: "MEMBER",
    default: index === 0,
    domain: `tenant-${ index }`,
    id: `id-${ index }`
});

/**
 * Serve `total` associations from a fake `tenant/me`, honouring the limit and offset it is called
 * with.
 */
const servePages = (total: number): void => {
    fetchPage.mockImplementation((limit: number, offset: number): Promise<TenantRequestResponse> => {
        const page: TenantInfo[] = Array.from({ length: total }, (_: unknown, index: number) => association(index))
            .slice(offset, offset + limit);

        return Promise.resolve({
            associatedTenants: page,
            count: page.length,
            startIndex: offset,
            totalResults: total
        });
    });
};

describe("findTenantAssociation", () => {
    beforeEach(() => {
        fetchPage.mockReset();
    });

    it("resolves an association on the first page with a single request", async () => {
        servePages(40);

        await expect(findTenantAssociation(fetchPage, "tenant-3")).resolves.toEqual(association(3));
        expect(fetchPage).toHaveBeenCalledTimes(1);
        expect(fetchPage).toHaveBeenCalledWith(ASSOCIATED_TENANTS_PAGE_SIZE, 0);
    });

    it("resolves an association beyond the first page", async () => {
        // The regression this guards: with a page size of 15, `tenant-20` is on the second page,
        // and used to be invisible to everything that read the first page alone.
        servePages(40);

        await expect(findTenantAssociation(fetchPage, "tenant-20")).resolves.toEqual(association(20));
        expect(fetchPage).toHaveBeenCalledTimes(2);
        expect(fetchPage).toHaveBeenLastCalledWith(ASSOCIATED_TENANTS_PAGE_SIZE, ASSOCIATED_TENANTS_PAGE_SIZE);
    });

    it("walks every page before giving up on an association the user does not have", async () => {
        servePages(40);

        await expect(findTenantAssociation(fetchPage, "tenant-999")).resolves.toBeUndefined();
        expect(fetchPage).toHaveBeenCalledTimes(3);
    });

    it("stops at a short page rather than paging forever", async () => {
        fetchPage.mockResolvedValue({
            associatedTenants: [ association(0) ],
            count: 1,
            startIndex: 0,
            // Deliberately inconsistent with the page returned.
            totalResults: 500
        });

        await expect(findTenantAssociation(fetchPage, "tenant-999")).resolves.toBeUndefined();
        expect(fetchPage).toHaveBeenCalledTimes(1);
    });

    it("gives up on an empty list", async () => {
        servePages(0);

        await expect(findTenantAssociation(fetchPage, "tenant-0")).resolves.toBeUndefined();
        expect(fetchPage).toHaveBeenCalledTimes(1);
    });

    it("does not fetch anything without a tenant domain", async () => {
        servePages(40);

        await expect(findTenantAssociation(fetchPage, undefined)).resolves.toBeUndefined();
        expect(fetchPage).not.toHaveBeenCalled();
    });
});
