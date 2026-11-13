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

import { fireEvent, render, screen, waitFor } from "@wso2is/unit-testing/utils";
import React, { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RoleAudienceTypes } from "../../constants/role-constants";
import { BasicRoleInterface, RolesV2Interface } from "../../models/roles";
import { ApplicationRoles } from "../application-roles";

const APP_ID: string = "app-id";

const createRoles = (from: number, to: number): BasicRoleInterface[] =>
    Array.from({ length: to - from + 1 }, (_: unknown, index: number) => ({
        id: `role-${ from + index }`,
        name: `ui-role-${ from + index }`
    }));

const toListingRoles = (roles: BasicRoleInterface[]): RolesV2Interface[] =>
    roles.map((role: BasicRoleInterface) => ({ displayName: role.name, id: role.id }) as RolesV2Interface);

const CREATED_ROLE: BasicRoleInterface = { id: "role-17", name: "ui-role-17" };

const { mockApplication, mockGetAllApplicationRolesByAudience, mockUpdateApplicationDetails } = vi.hoisted(() => ({
    mockApplication: {
        associatedRoles: {
            allowedAudience: "APPLICATION",
            roles: Array.from({ length: 16 }, (_: unknown, index: number) => ({
                id: `role-${ index + 1 }`,
                name: `ui-role-${ index + 1 }`
            }))
        },
        id: "app-id",
        name: "roles-test-app"
    },
    mockGetAllApplicationRolesByAudience: vi.fn(),
    mockUpdateApplicationDetails: vi.fn()
}));

vi.mock("../../api/roles", () => ({
    getAllApplicationRolesByAudience: mockGetAllApplicationRolesByAudience
}));

vi.mock("@wso2is/admin.applications.v1/api/application", () => ({
    updateApplicationDetails: mockUpdateApplicationDetails
}));

vi.mock("@wso2is/admin.applications.v1/api/use-get-application", () => ({
    useGetApplication: () => ({ data: mockApplication })
}));

vi.mock("@wso2is/admin.core.v1/helpers/history", () => ({
    history: { location: { pathname: "/applications/app-id" } }
}));

vi.mock("@wso2is/access-control", async (importOriginal: () => Promise<Record<string, unknown>>) => ({
    ...(await importOriginal()),
    useRequiredScopes: () => true
}));

// Stand in for the role creation wizard: creating a role reports the role from the create response.
vi.mock("../wizard-updated/application-role-wizard", () => ({
    ApplicationRoleWizard: ({ onRoleCreated }: { onRoleCreated: (role: BasicRoleInterface) => void }) => (
        <button
            data-componentid="mock-create-role"
            onClick={ () => onRoleCreated({ id: "role-17", name: "ui-role-17" }) }
        />
    )
}));

const renderRolesTab = (): void => {
    const ui: ReactElement = (
        <ApplicationRoles onUpdate={ vi.fn() } readOnly={ false } data-componentid="application-roles-tab" />
    );

    render(ui);
};

/**
 * Create a role from the tab, then click Update and return the role IDs sent in the application update.
 */
const createRoleAndUpdate = async (): Promise<string[]> => {
    await waitFor(() => expect(mockGetAllApplicationRolesByAudience).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByTestId("create-application-role-button"));
    fireEvent.click(screen.getByTestId("mock-create-role"));

    await waitFor(() => expect(mockGetAllApplicationRolesByAudience).toHaveBeenCalledTimes(2));

    fireEvent.click(screen.getByTestId("application-roles-tab-update-button"));

    await waitFor(() => expect(mockUpdateApplicationDetails).toHaveBeenCalledTimes(1));

    return mockUpdateApplicationDetails.mock.calls[0][0].associatedRoles.roles
        .map((role: BasicRoleInterface) => role.id);
};

describe("ApplicationRoles keeps the roles of the application when a role is created", () => {
    beforeEach(() => {
        mockGetAllApplicationRolesByAudience.mockReset();
        mockUpdateApplicationDetails.mockReset();
        mockUpdateApplicationDetails.mockResolvedValue({});
    });

    it("fetches every role of the application audience", async () => {
        mockGetAllApplicationRolesByAudience.mockResolvedValue(toListingRoles(createRoles(1, 16)));

        renderRolesTab();

        await waitFor(() => expect(mockGetAllApplicationRolesByAudience).toHaveBeenCalledTimes(1));
        expect(mockGetAllApplicationRolesByAudience.mock.calls[0].slice(0, 3)).toEqual([
            RoleAudienceTypes.APPLICATION, APP_ID, "users,groups,permissions,associatedApplications" ]);
    });

    it("sends every existing role and the created role after creating a role", async () => {
        mockGetAllApplicationRolesByAudience
            .mockResolvedValueOnce(toListingRoles(createRoles(1, 16)))
            .mockResolvedValueOnce(toListingRoles([ CREATED_ROLE, ...createRoles(1, 16).reverse() ]));

        renderRolesTab();

        const sentRoleIds: string[] = await createRoleAndUpdate();

        expect(sentRoleIds).toHaveLength(17);
        expect(sentRoleIds).toEqual(expect.arrayContaining([ "role-1", "role-16", "role-17" ]));
    });

    it("keeps the created role even if the refreshed listing does not include it", async () => {
        mockGetAllApplicationRolesByAudience
            .mockResolvedValueOnce(toListingRoles(createRoles(1, 16)))
            .mockResolvedValueOnce(toListingRoles(createRoles(1, 16)));

        renderRolesTab();

        const sentRoleIds: string[] = await createRoleAndUpdate();

        expect(sentRoleIds).toHaveLength(17);
        expect(sentRoleIds).toContain("role-17");
    });

    it("drops a role that was deleted elsewhere and keeps the rest", async () => {
        mockGetAllApplicationRolesByAudience
            .mockResolvedValueOnce(toListingRoles(createRoles(1, 16)))
            .mockResolvedValueOnce(toListingRoles([ CREATED_ROLE, ...createRoles(2, 16) ]));

        renderRolesTab();

        const sentRoleIds: string[] = await createRoleAndUpdate();

        expect(sentRoleIds).toHaveLength(16);
        expect(sentRoleIds).not.toContain("role-1");
        expect(sentRoleIds).toEqual(expect.arrayContaining([ "role-2", "role-16", "role-17" ]));
    });

    it("keeps every role and the created role if refreshing the listing fails", async () => {
        mockGetAllApplicationRolesByAudience
            .mockResolvedValueOnce(toListingRoles(createRoles(1, 16)))
            .mockRejectedValueOnce({ response: { data: { description: "Server error" } } });

        renderRolesTab();

        const sentRoleIds: string[] = await createRoleAndUpdate();

        expect(sentRoleIds).toHaveLength(17);
        expect(sentRoleIds).toEqual(expect.arrayContaining([ "role-1", "role-17" ]));
    });
});
