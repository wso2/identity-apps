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

import { render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import UserStoresProvider from "../providers/user-stores-provider";
import "@testing-library/jest-dom";

const mockUserStoresResponse: { current: unknown } = { current: [] };

vi.mock("@wso2is/access-control", async (importOriginal: () => Promise<Record<string, unknown>>) => ({
    ...(await importOriginal()),
    useRequiredScopes: () => true
}));

vi.mock("../api/use-get-user-stores", () => ({
    useGetUserStores: () => ({
        data: mockUserStoresResponse.current,
        error: undefined,
        isLoading: false,
        isValidating: false,
        mutate: vi.fn(),
        response: undefined
    })
}));

vi.mock("../api/use-get-user-store-details", () => ({
    default: () => ({
        data: undefined,
        error: undefined,
        isLoading: false,
        isValidating: false,
        mutate: vi.fn(),
        remainingRetryCount: 10,
        response: undefined
    })
}));

describe("UserStoresProvider", () => {
    const renderProvider = (): void => {
        render(
            <UserStoresProvider>
                <span data-componentid="user-stores-provider-child">Console</span>
            </UserStoresProvider>
        );
    };

    it("renders its children when the user store list API returns an array", () => {
        mockUserStoresResponse.current = [
            {
                enabled: true,
                id: "REVTVElOQVRJT04",
                name: "DESTINATION",
                properties: [],
                typeName: "JDBCUserStoreManager"
            }
        ];

        renderProvider();

        expect(screen.getByTestId("user-stores-provider-child")).toBeInTheDocument();
    });

    /**
     * The user store list API is contractually an array. When it answers HTTP 200 with
     * anything else, the provider used to call `.some()` / spread it while rendering, which
     * threw and took down the whole Console, since this provider wraps the entire app.
     */
    it.each([
        [ "an object", { code: "UST-00000", message: "Something went wrong" } ],
        [ "a string", "<!DOCTYPE html><html></html>" ]
    ])("renders its children when the user store list API returns %s", (_label: string, payload: unknown) => {
        mockUserStoresResponse.current = payload;

        expect(() => renderProvider()).not.toThrow();
        expect(screen.getByTestId("user-stores-provider-child")).toBeInTheDocument();
    });
});
