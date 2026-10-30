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

import { RenderHookResult, act, renderHook, waitFor } from "@testing-library/react";
import { store } from "@wso2is/admin.core.v1/store";
import { setTenants } from "@wso2is/core/store";
import { ReactElement, ReactNode, createElement } from "react";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import TenantConstants from "../../constants/tenant-constants";
import { TenantInfo, TenantRequestResponse } from "../../models/tenant";
import { getAssociatedTenants } from "../tenants";
import type { UseGetTenantAssociationInterface } from "../use-get-tenant-association";

vi.mock("../tenants", () => ({
    getAssociatedTenants: vi.fn()
}));

let useGetTenantAssociation: (_tenantDomain: string, _shouldFetch?: boolean) => UseGetTenantAssociationInterface;

const PAGE_SIZE: number = TenantConstants.ASSOCIATED_TENANTS_PAGE_SIZE;

const association: (_index: number) => TenantInfo = (index: number): TenantInfo => ({
    associationType: "MEMBER",
    default: index === 0,
    domain: `tenant-${ index }`,
    id: `id-${ index }`
});

const associations: (_total: number) => TenantInfo[] = (total: number): TenantInfo[] =>
    Array.from({ length: total }, (_: unknown, index: number) => association(index));

let requestedOffsets: number[] = [];

/**
 * Serves `total` associations from `tenant/me`, honouring `limit` and `offset`.
 */
const serveAssociations: (_total: number) => void = (total: number): void => {
    (getAssociatedTenants as Mock).mockImplementation(
        (_attributes: string, limit: number, offset: number): Promise<TenantRequestResponse> => {
            const page: TenantInfo[] = associations(total).slice(offset, offset + limit);

            requestedOffsets.push(offset);

            return Promise.resolve({
                associatedTenants: page,
                count: page.length,
                startIndex: offset,
                totalResults: total
            });
        }
    );
};

const wrapper: (_props: { children: ReactNode }) => ReactElement = (
    { children }: { children: ReactNode }
): ReactElement => createElement(
    Provider,
    { store },
    createElement(SWRConfig, { value: { provider: () => new Map() } }, children)
);

const renderTenantAssociation: (
    _tenantDomain: string,
    _shouldFetch?: boolean
) => RenderHookResult<UseGetTenantAssociationInterface, unknown> = (
    tenantDomain: string,
    shouldFetch?: boolean
): RenderHookResult<UseGetTenantAssociationInterface, unknown> =>
    renderHook(() => useGetTenantAssociation(tenantDomain, shouldFetch), { wrapper });

/**
 * Lets any request the hook might have started settle, so asserting that none was made is meaningful.
 */
const settle: () => Promise<void> = async (): Promise<void> => {
    await act(async () => {
        await new Promise((resolve: (_value: unknown) => void) => setTimeout(resolve, 50));
    });
};

describe("useGetTenantAssociation", () => {
    beforeEach(async () => {
        requestedOffsets = [];
        (getAssociatedTenants as Mock).mockReset();
        store.dispatch(setTenants<TenantInfo>([]));

        // The shared test setup loads the real API module before `vi.mock` applies, so reload the hook
        // to pick up the mock.
        vi.resetModules();
        ({ default: useGetTenantAssociation } = await import("../use-get-tenant-association"));
    });

    it("resolves from the first page in the store without a request", async () => {
        serveAssociations(40);
        store.dispatch(setTenants<TenantInfo>(associations(PAGE_SIZE)));

        const { result } = renderTenantAssociation("tenant-3");

        expect(result.current.data).toEqual(association(3));
        await settle();
        expect(requestedOffsets).toEqual([]);
    });

    it("walks the pages after the one in the store to find a tenant beyond it", async () => {
        serveAssociations(40);
        store.dispatch(setTenants<TenantInfo>(associations(PAGE_SIZE)));

        const { result } = renderTenantAssociation("tenant-35");

        await waitFor(() => expect(result.current.data).toEqual(association(35)));
        expect(requestedOffsets).toEqual([ PAGE_SIZE, PAGE_SIZE * 2 ]);
    });

    it("stops at the last page when the user has no association with the tenant", async () => {
        serveAssociations(40);
        store.dispatch(setTenants<TenantInfo>(associations(PAGE_SIZE)));

        const { result } = renderTenantAssociation("tenant-999");

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.data).toBeUndefined();
        expect(requestedOffsets).toEqual([ PAGE_SIZE, PAGE_SIZE * 2 ]);
    });

    it("caps the number of pages it walks", async () => {
        serveAssociations(1000);
        store.dispatch(setTenants<TenantInfo>(associations(PAGE_SIZE)));

        const { result } = renderTenantAssociation("tenant-999");

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.data).toBeUndefined();
        expect(requestedOffsets).toHaveLength(10);
    });

    it("makes no request before the dropdown has loaded the first page", async () => {
        // Also covers privileged users, for whom the store is never filled.
        serveAssociations(40);

        const { result } = renderTenantAssociation("tenant-20");

        await settle();
        expect(result.current.data).toBeUndefined();
        expect(requestedOffsets).toEqual([]);
    });

    it("makes no request when the first page is all the user has", async () => {
        serveAssociations(5);
        store.dispatch(setTenants<TenantInfo>(associations(5)));

        const { result } = renderTenantAssociation("tenant-999");

        await settle();
        expect(result.current.data).toBeUndefined();
        expect(requestedOffsets).toEqual([]);
    });

    it("shares one walk between consumers of the same tenant", async () => {
        serveAssociations(40);
        store.dispatch(setTenants<TenantInfo>(associations(PAGE_SIZE)));

        const { result } = renderHook(
            () => [ useGetTenantAssociation("tenant-20"), useGetTenantAssociation("tenant-20") ],
            { wrapper }
        );

        await waitFor(() => expect(result.current[ 0 ].data).toEqual(association(20)));
        expect(result.current[ 1 ].data).toEqual(association(20));
        expect(requestedOffsets).toEqual([ PAGE_SIZE ]);
    });

    it("returns nothing and makes no request when fetching is disabled", async () => {
        serveAssociations(40);
        store.dispatch(setTenants<TenantInfo>(associations(PAGE_SIZE)));

        const { result } = renderTenantAssociation("tenant-3", false);

        await settle();
        expect(result.current.data).toBeUndefined();
        expect(requestedOffsets).toEqual([]);
    });
});
