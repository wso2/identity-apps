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

import { RenderHookResult, renderHook, waitFor } from "@testing-library/react";
import { TenantInfo } from "@wso2is/admin.tenants.v1/models/tenant";
import { ReactElement, ReactNode, createElement } from "react";
import { Provider } from "react-redux";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { BillingURLsInterface } from "../use-billing-urls";

const getTenantAssociationMock: Mock = vi.fn();

vi.mock("../../utils/tenant-association-utils", () => ({
    getTenantAssociation: (tenantDomain: string) => getTenantAssociationMock(tenantDomain)
}));

const authStateMock: { tenantDomain: string; tenants: TenantInfo[] } = {
    tenantDomain: undefined,
    tenants: undefined
};

const storeMock: { dispatch: () => void; getState: () => unknown; subscribe: () => () => void } = {
    dispatch: () => undefined,
    getState: () => ({ auth: authStateMock }),
    subscribe: () => () => undefined
};

const wrapper = ({ children }: { children: ReactNode }): ReactElement =>
    createElement(Provider, { store: storeMock as never }, children);

const association = (domain: string, associationType: string = "MEMBER"): TenantInfo => ({
    associationType,
    default: false,
    domain,
    id: `id-of-${ domain }`
});

/**
 * Loads a fresh copy of the hook, so the association cache it keeps does not leak between tests,
 * and renders it.
 */
const renderBillingURLs = async (enabled?: boolean): Promise<RenderHookResult<BillingURLsInterface, unknown>> => {
    vi.resetModules();

    const { default: useBillingURLs } = await import("../use-billing-urls");

    return renderHook(() => (enabled === undefined ? useBillingURLs() : useBillingURLs(enabled)), { wrapper });
};

describe("useBillingURLs", () => {
    beforeEach(() => {
        getTenantAssociationMock.mockReset();
        authStateMock.tenantDomain = undefined;
        authStateMock.tenants = undefined;

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

    it("builds the URLs from the association already in the store, without a request", async () => {
        authStateMock.tenantDomain = "in-store";
        authStateMock.tenants = [ association("in-store") ];

        const { result } = await renderBillingURLs();

        await waitFor(() =>
            expect(result.current.billingPortalURL).toBe("https://billing.example.com/id-of-in-store"));

        expect(result.current.upgradeButtonURL).toBe("https://billing.example.com/id-of-in-store/upgrade");
        expect(getTenantAssociationMock).not.toHaveBeenCalled();
    });

    it("fetches the association when the current tenant is beyond the page held in the store", async () => {
        // The regression this guards: `state.auth.tenants` only ever holds the first page of the
        // association list, so a user with more than 15 tenants can be working in one that is not
        // there, and the links used to silently disappear.
        authStateMock.tenantDomain = "beyond-first-page";
        authStateMock.tenants = [ association("some-other-tenant") ];
        getTenantAssociationMock.mockResolvedValue(association("beyond-first-page"));

        const { result } = await renderBillingURLs();

        await waitFor(() =>
            expect(result.current.billingPortalURL).toBe("https://billing.example.com/id-of-beyond-first-page"));

        expect(result.current.upgradeButtonURL)
            .toBe("https://billing.example.com/id-of-beyond-first-page/upgrade");
        expect(getTenantAssociationMock).toHaveBeenCalledWith("beyond-first-page");
    });

    it("fetches once however many consumers ask for the links", async () => {
        authStateMock.tenantDomain = "shared-fetch";
        authStateMock.tenants = [];
        getTenantAssociationMock.mockResolvedValue(association("shared-fetch"));

        vi.resetModules();

        const { default: useBillingURLs } = await import("../use-billing-urls");
        const first: RenderHookResult<BillingURLsInterface, unknown> =
            renderHook(() => useBillingURLs(), { wrapper });
        const second: RenderHookResult<BillingURLsInterface, unknown> =
            renderHook(() => useBillingURLs(), { wrapper });

        await waitFor(() => expect(first.result.current.upgradeButtonURL).toBeTruthy());
        await waitFor(() => expect(second.result.current.upgradeButtonURL).toBeTruthy());

        expect(getTenantAssociationMock).toHaveBeenCalledTimes(1);
    });

    it("leaves the URLs empty for a tenant the user is not a MEMBER of", async () => {
        authStateMock.tenantDomain = "not-a-member";
        authStateMock.tenants = [];
        getTenantAssociationMock.mockResolvedValue(association("not-a-member", "OWNER"));

        const { result } = await renderBillingURLs();

        await waitFor(() => expect(getTenantAssociationMock).toHaveBeenCalled());

        expect(result.current.billingPortalURL).toBe("");
        expect(result.current.upgradeButtonURL).toBe("");
    });

    it("leaves the URLs empty and makes no request when billing links do not apply", async () => {
        authStateMock.tenantDomain = "disabled-tenant";
        authStateMock.tenants = [];

        const { result } = await renderBillingURLs(false);

        expect(result.current.billingPortalURL).toBe("");
        expect(getTenantAssociationMock).not.toHaveBeenCalled();
    });

    it("leaves the URLs empty when the association cannot be resolved", async () => {
        authStateMock.tenantDomain = "unresolvable";
        authStateMock.tenants = [];
        getTenantAssociationMock.mockResolvedValue(undefined);

        const { result } = await renderBillingURLs();

        await waitFor(() => expect(getTenantAssociationMock).toHaveBeenCalled());

        expect(result.current.billingPortalURL).toBe("");
        expect(result.current.upgradeButtonURL).toBe("");
    });
});
