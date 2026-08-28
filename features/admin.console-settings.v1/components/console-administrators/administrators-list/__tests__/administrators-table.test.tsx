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

import { UserListInterface } from "@wso2is/admin.users.v1/models/user";
import ReduxStoreStateMock from "@wso2is/unit-testing/__mocks__/redux/redux-store-state";
import { RenderResult, render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdministratorsTable from "../administrators-table";
import type {} from "@testing-library/jest-dom/vitest";

vi.mock("@wso2is/admin.server-configurations.v1/api/server-config", () => ({
    useServerConfigs: () => ({ data: { realmConfig: { adminUser: "root-admin" } } })
}));

vi.mock("@wso2is/admin.organizations.v1/hooks/use-get-organization-type", () => ({
    useGetCurrentOrganizationType: () => ({
        isFirstLevelOrganization: () => true,
        isSubOrganization: () => false,
        isSuperOrganization: () => false
    })
}));

vi.mock("../../../../hooks/use-console-roles", () => ({
    default: () => ({ consoleRoles: { Resources: [] } })
}));

/**
 * The console administrator and the organization user share an email address but are distinct
 * accounts, so they carry distinct user ids. This is the reported scenario.
 */
const CONSOLE_ADMINISTRATOR_ID: string = "3f2a1b7c-0000-4000-8000-aaaaaaaaaaaa";
const ORGANIZATION_USER_ID: string = "9d8c7b6a-0000-4000-8000-bbbbbbbbbbbb";
const UNLISTED_USER_ID: string = "00000000-0000-4000-8000-cccccccccccc";
const SHARED_USERNAME: string = "PRIMARY/alex@example.com";

const administrators: UserListInterface = {
    Resources: [
        {
            emails: [ "alex@example.com" ],
            id: CONSOLE_ADMINISTRATOR_ID,
            name: {
                familyName: "Administrator",
                givenName: "Console"
            },
            roles: [],
            userName: SHARED_USERNAME
        },
        {
            emails: [ "alex@example.com" ],
            id: ORGANIZATION_USER_ID,
            name: {
                familyName: "User",
                givenName: "Organization"
            },
            roles: [],
            userName: SHARED_USERNAME
        }
    ],
    itemsPerPage: 10,
    startIndex: 1,
    totalResults: 2
} as UserListInterface;

const renderTable = (signedInUserId: string, showListItemActions: boolean = false): RenderResult =>
    render(
        <AdministratorsTable
            administrators={ administrators }
            data-componentid="administrators-table"
            isLoading={ false }
            showListItemActions={ showListItemActions }
        />,
        {
            allowedScopes: "internal_login internal_user_mgt_delete",
            initialState: {
                ...ReduxStoreStateMock,
                auth: {
                    ...ReduxStoreStateMock.auth,
                    isPrivilegedUser: false,
                    // Both accounts share this username, so a username based comparison matches both rows.
                    providedUsername: "alex@example.com"
                },
                config: {
                    ...ReduxStoreStateMock.config,
                    ui: {
                        ...ReduxStoreStateMock.config.ui,
                        features: {
                            ...ReduxStoreStateMock.config.ui.features,
                            users: {
                                disabledFeatures: [],
                                enabled: true,
                                scopes: {
                                    create: [ "internal_user_mgt_create" ],
                                    delete: [ "internal_user_mgt_delete" ],
                                    read: [ "internal_user_mgt_list" ],
                                    update: [ "internal_user_mgt_update" ]
                                }
                            }
                        }
                    }
                },
                profile: {
                    ...ReduxStoreStateMock.profile,
                    profileInfo: {
                        ...ReduxStoreStateMock.profile.profileInfo,
                        id: signedInUserId,
                        userName: SHARED_USERNAME
                    }
                }
            }
        }
    );

/**
 * Resolves the display name of the row that carries the "Me" label.
 *
 * @returns Display name of the labelled row, or null when no row is labelled.
 */
const resolveLabelledRowName = (): string | null => {
    const labels: HTMLElement[] = screen.queryAllByText("Me");

    if (labels.length !== 1) {
        return null;
    }

    return labels[0].closest("tr")?.textContent ?? null;
};

describe("AdministratorsTable - \"Me\" label", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("labels only the row whose user id matches the signed-in user", () => {
        renderTable(CONSOLE_ADMINISTRATOR_ID);

        expect(screen.queryAllByText("Me")).toHaveLength(1);
        expect(resolveLabelledRowName()).toContain("Console Administrator");
    });

    it("labels the other account when it is the one signed in", () => {
        renderTable(ORGANIZATION_USER_ID);

        expect(screen.queryAllByText("Me")).toHaveLength(1);
        expect(resolveLabelledRowName()).toContain("Organization User");
    });

    it("labels no row when the signed-in user is not listed", () => {
        renderTable(UNLISTED_USER_ID);

        expect(screen.queryByText("Me")).not.toBeInTheDocument();
    });

    it("hides the delete action only on the signed-in user's row", () => {
        renderTable(CONSOLE_ADMINISTRATOR_ID, true);

        const deleteButtons: HTMLElement[] = screen.getAllByTestId("administrators-list-item-delete-button");
        const labelledRow: HTMLElement = screen.getByText("Me").closest("tr");

        expect(deleteButtons).toHaveLength(1);
        expect(labelledRow).not.toContainElement(deleteButtons[0]);
    });
});
