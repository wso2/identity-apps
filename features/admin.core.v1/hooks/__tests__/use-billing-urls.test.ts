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
import { FeatureStatus } from "@wso2is/access-control";
import { TenantInfo } from "@wso2is/admin.tenants.v1/models/tenant";
import { ReactElement, ReactNode, createElement } from "react";
import { Provider } from "react-redux";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import type { BillingURLsInterface } from "../use-billing-urls";

const useGetTenantAssociationMock: Mock = vi.fn();
const useCheckFeatureStatusMock: Mock = vi.fn();

vi.mock("@wso2is/access-control", async (importOriginal: () => Promise<Record<string, unknown>>) => ({
    ...(await importOriginal()),
    useCheckFeatureStatus: (path: string) => useCheckFeatureStatusMock(path)
}));

vi.mock("@wso2is/admin.tenants.v1/api/use-get-tenant-association", () => ({
    default: (tenantDomain: string, shouldFetch?: boolean) => useGetTenantAssociationMock(tenantDomain, shouldFetch)
}));

let useBillingURLs: (_enabled?: boolean) => BillingURLsInterface;

const authStateMock: { tenantDomain: string } = {
    tenantDomain: undefined
};

const storeMock: { dispatch: () => void; getState: () => unknown; subscribe: () => () => void } = {
    dispatch: () => undefined,
    getState: () => ({ auth: authStateMock }),
    subscribe: () => () => undefined
};

const wrapper: (_props: { children: ReactNode }) => ReactElement = (
    { children }: { children: ReactNode }
): ReactElement => createElement(Provider, { store: storeMock as never }, children);

const association: (_domain: string, _associationType?: string) => TenantInfo = (
    domain: string,
    associationType: string = "MEMBER"
): TenantInfo => ({
    associationType,
    default: false,
    domain,
    id: `id-of-${ domain }`
});

/**
 * Serves the association `resolve` gives for each domain, keeping one reference per domain as SWR does.
 */
const serveAssociation: (_resolve: (_domain: string) => TenantInfo | undefined) => void = (
    resolve: (_domain: string) => TenantInfo | undefined
): void => {
    const served: Map<string, TenantInfo | undefined> = new Map();

    useGetTenantAssociationMock.mockImplementation((tenantDomain: string, shouldFetch: boolean = true) => {
        if (!served.has(tenantDomain)) {
            served.set(tenantDomain, resolve(tenantDomain));
        }

        return {
            data: shouldFetch ? served.get(tenantDomain) : undefined,
            error: undefined,
            isLoading: false
        };
    });
};

const renderBillingURLs: (_enabled?: boolean) => RenderHookResult<BillingURLsInterface, unknown> = (
    enabled?: boolean
): RenderHookResult<BillingURLsInterface, unknown> =>
    renderHook(() => (enabled === undefined ? useBillingURLs() : useBillingURLs(enabled)), { wrapper });

/**
 * Lets the URL building finish, so a test asserting that the URLs stayed empty cannot pass merely by
 * reading the initial state.
 */
const settleBillingURLs: () => Promise<void> = async (): Promise<void> => {
    await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
    });
};

describe("useBillingURLs", () => {
    beforeEach(async () => {
        // The shared test setup loads this hook before `vi.mock` applies, so reload it to pick up the mock.
        vi.resetModules();
        ({ default: useBillingURLs } = await import("../use-billing-urls"));

        useGetTenantAssociationMock.mockReset();
        useCheckFeatureStatusMock.mockReset();
        useCheckFeatureStatusMock.mockReturnValue(FeatureStatus.ENABLED);
        authStateMock.tenantDomain = undefined;

        window["AppUtils"] = {
            getConfig: () => ({
                extensions: {
                    billingPortalUrl: "https://billing.example.com/${tenantId}",
                    upgradeButtonUrl: "https://billing.example.com/${tenantId}/upgrade"
                },
                ui: {
                    features: {}
                }
            })
        };
    });

    it("builds the URLs from the current tenant's association", async () => {
        authStateMock.tenantDomain = "current-tenant";
        serveAssociation((domain: string) => association(domain));

        const { result } = renderBillingURLs();

        await waitFor(() =>
            expect(result.current.billingPortalURL).toBe("https://billing.example.com/id-of-current-tenant"));

        expect(result.current.upgradeButtonURL).toBe("https://billing.example.com/id-of-current-tenant/upgrade");
        expect(useGetTenantAssociationMock).toHaveBeenCalledWith("current-tenant", true);
    });

    it("leaves the URLs empty for a tenant the user is not a MEMBER of", async () => {
        authStateMock.tenantDomain = "not-a-member";
        serveAssociation((domain: string) => association(domain, "OWNER"));

        const { result } = renderBillingURLs();

        await settleBillingURLs();

        expect(result.current.billingPortalURL).toBe("");
        expect(result.current.upgradeButtonURL).toBe("");
    });

    it("leaves the URLs empty when the association cannot be resolved", async () => {
        authStateMock.tenantDomain = "unresolvable";
        serveAssociation(() => undefined);

        const { result } = renderBillingURLs();

        await settleBillingURLs();

        expect(result.current.billingPortalURL).toBe("");
        expect(result.current.upgradeButtonURL).toBe("");
    });

    it("leaves the URLs empty and skips fetching when billing links do not apply", async () => {
        authStateMock.tenantDomain = "disabled-tenant";
        serveAssociation((domain: string) => association(domain));

        const { result } = renderBillingURLs(false);

        await settleBillingURLs();

        expect(result.current.billingPortalURL).toBe("");
        expect(useGetTenantAssociationMock).toHaveBeenCalledWith("disabled-tenant", false);
    });

    it("leaves the URLs empty and skips fetching when SaaS features are disabled", async () => {
        authStateMock.tenantDomain = "non-saas-tenant";
        useCheckFeatureStatusMock.mockReturnValue(FeatureStatus.DISABLED);
        serveAssociation((domain: string) => association(domain));

        const { result } = renderBillingURLs();

        await settleBillingURLs();

        expect(result.current.billingPortalURL).toBe("");
        expect(result.current.upgradeButtonURL).toBe("");
        expect(useGetTenantAssociationMock).toHaveBeenCalledWith("non-saas-tenant", false);
    });

    it("drops the previous tenant's links when the tenant changes", async () => {
        authStateMock.tenantDomain = "first-tenant";
        serveAssociation((domain: string) => association(domain));

        const { result, rerender }: RenderHookResult<BillingURLsInterface, unknown> = renderBillingURLs();

        await waitFor(() =>
            expect(result.current.billingPortalURL).toBe("https://billing.example.com/id-of-first-tenant"));

        // An in-place organization switch swaps the domain under a mounted header.
        authStateMock.tenantDomain = "second-tenant";
        rerender();

        expect(result.current.billingPortalURL).not.toBe("https://billing.example.com/id-of-first-tenant");

        await waitFor(() =>
            expect(result.current.billingPortalURL).toBe("https://billing.example.com/id-of-second-tenant"));
    });
});
