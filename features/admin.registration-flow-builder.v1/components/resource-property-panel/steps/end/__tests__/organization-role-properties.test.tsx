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

import { ApplicationListInterface } from "@wso2is/admin.applications.v1/models/application";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { OrganizationListInterface } from "@wso2is/admin.organizations.v1/models";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { RolesV2Interface, RolesV2ResponseInterface } from "@wso2is/admin.roles.v2/models/roles";
import ReduxStoreStateMock from "@wso2is/unit-testing/__mocks__/redux/redux-store-state";
import { RenderResult, fireEvent, render, screen, waitFor, within } from "@wso2is/unit-testing/utils";
import React from "react";
import { SWRConfig } from "swr";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import OrganizationRoleProperties from "../organization-role-properties";
import type {} from "@testing-library/jest-dom/vitest";

const useGetRolesListMock: Mock = vi.hoisted(() => vi.fn());
const getSharedOrganizationsMock: Mock = vi.hoisted(() => vi.fn());
const getApplicationListMock: Mock = vi.hoisted(() => vi.fn());

vi.mock("@wso2is/admin.applications.v1/api/application", () => ({ getApplicationList: getApplicationListMock }));
vi.mock("@wso2is/admin.roles.v2/api/use-get-roles-list", () => ({ default: useGetRolesListMock }));
vi.mock("@wso2is/admin.organizations.v1/api/organization", () => ({
    getSharedOrganizations: getSharedOrganizationsMock
}));

describe("OrganizationRoleProperties", () => {
    const componentId: string = "organization-role-properties";
    const organizationLabel: string = "roles:addRoleWizard.forms.roleBasicDetails.roleAudience.values.organization";
    const applicationLabel: string = "roles:addRoleWizard.forms.roleBasicDetails.roleAudience.values.application";
    const managerLabel: string = `Manager · ${organizationLabel}`;
    const auditorLabel: string = `Auditor · ${organizationLabel}`;
    const onChange: Mock<(_roleIds: string[]) => void> = vi.fn();
    const manager: RolesV2Interface = {
        audience: { display: "Super", type: "organization", value: "organization-id" },
        displayName: "Manager",
        id: "role-manager",
        meta: { location: "" }
    };
    const auditor: RolesV2Interface = {
        audience: { display: "Super", type: "organization", value: "organization-id" },
        displayName: "Auditor",
        id: "role-auditor",
        meta: { location: "" }
    };
    const roles: RolesV2ResponseInterface = {
        Resources: [ manager, auditor ],
        startIndex: 1,
        totalResults: 2
    };
    const sharing: OrganizationListInterface = {
        organizations: [],
        sharingMode: {
            policy: "ALL_EXISTING_AND_FUTURE_ORGS",
            roleSharing: { mode: "ALL", roles: [] }
        }
    };
    const initialState: Record<string, unknown> = {
        ...ReduxStoreStateMock,
        config: {
            ...ReduxStoreStateMock.config,
            ui: {
                ...ReduxStoreStateMock.config.ui,
                features: {
                    ...ReduxStoreStateMock.config.ui.features,
                    userRoles: { enabled: true, scopes: { read: [ "internal_role_mgt_view" ] } }
                }
            }
        }
    };

    const renderRolePicker = (
        selectedRoleIds: string[] = [],
        allowedScopes: string = "internal_role_mgt_view"
    ): RenderResult => {
        const wrap = (ui: React.ReactElement): React.ReactElement => (
            <SWRConfig value={ { dedupingInterval: 0, provider: () => new Map() } }>{ ui }</SWRConfig>
        );
        const result: RenderResult = render(wrap(
            <OrganizationRoleProperties selectedRoleIds={ selectedRoleIds } onChange={ onChange } />
        ), { allowedScopes, initialState });

        return { ...result, rerender: (ui: React.ReactElement): void => result.rerender(wrap(ui)) };
    };

    const getInput = (): HTMLElement =>
        within(screen.getByTestId(`${componentId}-input`)).getByRole("combobox");

    beforeEach(() => {
        getApplicationListMock.mockReset();
        getApplicationListMock.mockResolvedValue({
            applications: [ { associatedRoles: { allowedAudience: "ORGANIZATION" },
                id: "application-id", name: "Organization App" } ],
            totalResults: 1
        });
        onChange.mockReset();
        useGetRolesListMock.mockReset();
        useGetRolesListMock.mockReturnValue({ data: roles, error: undefined, isLoading: false });
        getSharedOrganizationsMock.mockReset();
        getSharedOrganizationsMock.mockResolvedValue({ data: sharing });
    });

    it("opens the role list above the input and outside the properties panel", async () => {
        const { container } = renderRolePicker();

        fireEvent.mouseDown(getInput());

        const listbox: HTMLElement = await screen.findByRole("listbox");

        expect(container).not.toContainElement(listbox);
        expect(document.body).toContainElement(listbox);
        await waitFor(() => {
            expect(listbox.closest("[data-popper-placement]"))
                .toHaveAttribute("data-popper-placement", "top-start");
        });
        expect(await screen.findByRole("option", { name: /Manager/ })).toBeVisible();
        expect(screen.getByRole("option", { name: /Auditor/ })).toBeVisible();
    });

    it("supports selecting a role with the keyboard", async () => {
        renderRolePicker();
        fireEvent.mouseDown(getInput());
        await screen.findByRole("option", { name: /Auditor/ });

        fireEvent.change(getInput(), { target: { value: "Auditor" } });
        fireEvent.keyDown(getInput(), { key: "ArrowDown" });
        fireEvent.keyDown(getInput(), { key: "Enter" });

        expect(onChange).toHaveBeenCalledWith([ auditor.id ]);
    });

    it("searches loaded roles and adds a role without losing an existing selection", async () => {
        const { rerender } = renderRolePicker([ manager.id ]);

        fireEvent.mouseDown(getInput());
        await screen.findByRole("option", { name: /Auditor/ });

        expect(screen.getByText(managerLabel)).toBeInTheDocument();

        fireEvent.change(getInput(), { target: { value: "Auditor" } });
        expect(screen.getByText(managerLabel)).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: /Manager/ })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("option", { name: /Auditor/ }));

        expect(onChange).toHaveBeenCalledWith([ manager.id, auditor.id ]);
        rerender(<OrganizationRoleProperties
            selectedRoleIds={ [ manager.id, auditor.id ] } onChange={ onChange }
        />);
        expect(screen.getByText(managerLabel)).toBeInTheDocument();
        expect(screen.getByText(auditorLabel)).toBeInTheDocument();
        expect(getInput()).toHaveValue("");
    });

    it("removes a selected role without removing the other selection", async () => {
        renderRolePicker([ manager.id, auditor.id ]);
        fireEvent.mouseDown(getInput());
        await waitFor(() => expect(getSharedOrganizationsMock).toHaveBeenCalled());
        fireEvent.click(screen.getByRole("option", { name: /Auditor/ }));

        expect(onChange).toHaveBeenCalledWith([ manager.id ]);
    });

    it("keeps saved role IDs visible when their role details cannot be loaded", () => {
        useGetRolesListMock.mockReturnValue({
            data: undefined,
            error: { message: "Unable to load roles" },
            isLoading: false
        });

        renderRolePicker([ "saved-role" ]);

        expect(screen.getByText("saved-role")).toBeInTheDocument();
        expect(screen.getByText("flows:registrationFlow.steps.end.organizationRoles.fetchError"))
            .toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
    });

    it("disables selection and fetching when the admin cannot read roles", () => {
        useGetRolesListMock.mockReturnValue({ data: undefined, error: undefined, isLoading: false });

        renderRolePicker([], "internal_login");

        expect(getInput()).toBeDisabled();
        expect(screen.getByText("flows:registrationFlow.steps.end.organizationRoles.noPermission"))
            .toBeInTheDocument();
        expect(useGetRolesListMock).toHaveBeenCalledWith(
            UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
            1,
            undefined,
            "users,groups,permissions",
            false
        );
        expect(getApplicationListMock).not.toHaveBeenCalled();
    });

    it("loads subsequent pages without dropping roles from the first page", async () => {
        const firstPage: RolesV2ResponseInterface = { Resources: [ manager ], startIndex: 1, totalResults: 2 };
        const secondPage: RolesV2ResponseInterface = { Resources: [ auditor ], startIndex: 2, totalResults: 2 };

        useGetRolesListMock.mockImplementation((_count: number, startIndex: number) => ({
            data: startIndex === 1 ? firstPage : secondPage,
            error: undefined,
            isLoading: false
        }));

        renderRolePicker();
        fireEvent.mouseDown(getInput());

        expect(await screen.findByRole("option", { name: /Manager/ })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: /Auditor/ })).toBeInTheDocument();
        expect(useGetRolesListMock).toHaveBeenCalledWith(
            UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
            2,
            undefined,
            "users,groups,permissions",
            true
        );
    });

    it("preserves an already loaded selection when a later request fails", () => {
        const { rerender } = renderRolePicker([ manager.id ]);

        useGetRolesListMock.mockReturnValue({
            data: undefined,
            error: { message: "Unable to load roles" },
            isLoading: false
        });
        rerender(<OrganizationRoleProperties selectedRoleIds={ [ manager.id ] } onChange={ onChange } />);

        expect(screen.getByText(managerLabel)).toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
    });

    it("filters selective sharing and preserves an unshared selection with a warning", async () => {
        getSharedOrganizationsMock.mockResolvedValue({ data: {
            ...sharing,
            sharingMode: { ...sharing.sharingMode, roleSharing: { mode: "SELECTED", roles: [ auditor ] } }
        } });
        const { rerender } = renderRolePicker();

        fireEvent.mouseDown(getInput());
        expect(await screen.findByRole("option", { name: /Auditor/ })).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: /Manager/ })).not.toBeInTheDocument();
        rerender(<OrganizationRoleProperties selectedRoleIds={ [ manager.id ] } onChange={ onChange } />);

        expect(screen.getByText(managerLabel)).toBeInTheDocument();
        expect(screen.getByText(`flows:registrationFlow.steps.end.organizationRoles.unavailable${managerLabel}`))
            .toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole("option", { name: /Manager/ }));
        expect(onChange).toHaveBeenCalledWith([]);
    });

    it("includes Console and other application roles but not roles from unshared applications", async () => {
        const applicationRoles: RolesV2Interface[] = [ "Console", "Business App", "Unshared App" ].map(
            (name: string): RolesV2Interface => ({
                ...manager, audience: { display: name, type: "APPLICATION", value: name }, displayName: name, id: name
            })
        );

        useGetRolesListMock.mockReturnValue({ data: {
            Resources: applicationRoles, startIndex: 1, totalResults: applicationRoles.length
        }, isLoading: false });
        getSharedOrganizationsMock.mockImplementation((_orgId: string, applicationId: string) => Promise.resolve({
            data: applicationId === "Unshared App" ? { organizations: [] } : sharing
        }));
        renderRolePicker();
        fireEvent.mouseDown(getInput());

        expect(await screen.findByRole("option", { name: /Console/ })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: /Business App/ })).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: /Unshared App/ })).not.toBeInTheDocument();
        expect(getSharedOrganizationsMock).toHaveBeenCalledWith(undefined, "Console", {
            attributes: "sharingMode", excludedAttributes: "roles", limit: 1, recursive: false
        });
    });

    it("lists both audiences without stored role associations and keeps labels on selections", async () => {
        const applicationRole: RolesV2Interface = {
            ...manager,
            audience: { display: "B2B app", type: "application", value: "b2b-app" },
            id: "application-manager"
        };

        useGetRolesListMock.mockReturnValue({ data: {
            Resources: [ manager, applicationRole ], startIndex: 1, totalResults: 2
        }, isLoading: false });
        const { rerender } = renderRolePicker([ manager.id ]);

        fireEvent.mouseDown(getInput());
        await screen.findByRole("option", { name: /B2B app/ });
        const options: HTMLElement[] = screen.getAllByRole("option");

        expect(within(options[0]).getByText(organizationLabel)).toBeInTheDocument();
        expect(within(options[1]).getByText(`${applicationLabel}: B2B app`)).toBeInTheDocument();
        fireEvent.click(options[1]);
        expect(onChange).toHaveBeenCalledWith([ manager.id, applicationRole.id ]);
        rerender(<OrganizationRoleProperties
            selectedRoleIds={ [ manager.id, applicationRole.id ] } onChange={ onChange }
        />);
        expect(screen.getByText(managerLabel)).toBeInTheDocument();
        expect(screen.getByText(`Manager · ${applicationLabel}: B2B app`)).toBeInTheDocument();
    });

    it("loads organization-audience applications from subsequent pages", async () => {
        getApplicationListMock.mockImplementation((_limit: number, offset: number): Promise<ApplicationListInterface> =>
            Promise.resolve({
                applications: offset === 0
                    ? [ { associatedRoles: { allowedAudience: RoleAudienceTypes.APPLICATION, roles: [] },
                        id: "app-only", name: "App Only" } ]
                    : [ { associatedRoles: { allowedAudience: RoleAudienceTypes.ORGANIZATION, roles: [] },
                        id: "org-app", name: "Org App" } ],
                totalResults: 2
            })
        );
        renderRolePicker();
        fireEvent.mouseDown(getInput());

        expect(await screen.findByRole("option", { name: /Manager/ })).toBeInTheDocument();
        expect(getApplicationListMock).toHaveBeenCalledWith(
            UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT, 1, undefined, false, "associatedRoles.allowedAudience"
        );
        expect(getSharedOrganizationsMock).toHaveBeenCalledWith(undefined, "org-app", {
            attributes: "sharingMode", excludedAttributes: "roles", limit: 1, recursive: false
        });
        expect(getSharedOrganizationsMock).not.toHaveBeenCalledWith(undefined, "app-only", expect.anything());
    });

    it.each([ "ALL_EXISTING_ORGS_ONLY", "SELECTED_ORG_ONLY" ])(
        "excludes organization roles when the application policy is %s", async (policy: string) => {
            getSharedOrganizationsMock.mockResolvedValue({ data: {
                ...sharing, sharingMode: { ...sharing.sharingMode, policy }
            } });
            renderRolePicker();
            fireEvent.mouseDown(getInput());

            await screen.findByText("common:noResultsFound");
            expect(screen.queryByRole("option", { name: /Manager/ })).not.toBeInTheDocument();
        }
    );

    it("does not expose organization roles through an application-audience app", async () => {
        getApplicationListMock.mockResolvedValue({ applications: [ {
            associatedRoles: { allowedAudience: "APPLICATION" }, id: "application-id", name: "App Only"
        } ], totalResults: 1 });
        renderRolePicker();
        fireEvent.mouseDown(getInput());

        await screen.findByText("common:noResultsFound");
        expect(screen.queryByRole("option", { name: /Manager/ })).not.toBeInTheDocument();
        expect(getSharedOrganizationsMock).not.toHaveBeenCalled();
    });

    it("matches selected application roles when the sharing response omits the audience display", async () => {
        const applicationRole: RolesV2Interface = {
            ...manager,
            audience: { display: "B2B app", type: "application", value: "b2b-app" }
        };

        useGetRolesListMock.mockReturnValue({ data: {
            Resources: [ applicationRole ], startIndex: 1, totalResults: 1
        }, isLoading: false });
        getSharedOrganizationsMock.mockResolvedValue({ data: {
            ...sharing,
            sharingMode: { ...sharing.sharingMode, roleSharing: { mode: "SELECTED", roles: [ {
                audience: { display: undefined, type: "application" }, displayName: manager.displayName
            } ] } }
        } });
        renderRolePicker();
        fireEvent.mouseDown(getInput());

        expect(await screen.findByRole("option", { name: /Manager/ })).toBeInTheDocument();
        expect(getApplicationListMock).not.toHaveBeenCalled();
    });

    it("keeps saved roles visible and reports an application lookup failure", async () => {
        getApplicationListMock.mockRejectedValue(new Error("Unable to load applications"));
        renderRolePicker([ manager.id ]);

        await screen.findByText("flows:registrationFlow.steps.end.organizationRoles.fetchError");
        expect(screen.getByText(managerLabel)).toBeInTheDocument();
        expect(screen.queryByText(`flows:registrationFlow.steps.end.organizationRoles.unavailable${managerLabel}`))
            .not.toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
    });

    it("does not mark saved roles as unshared when the sharing lookup fails", async () => {
        getSharedOrganizationsMock.mockRejectedValue(new Error("Unable to read sharing settings"));
        renderRolePicker([ manager.id ]);

        await screen.findByText("flows:registrationFlow.steps.end.organizationRoles.fetchError");

        expect(screen.getByText(managerLabel)).toBeInTheDocument();
        expect(screen.queryByText("flows:registrationFlow.steps.end.organizationRoles.unavailable"))
            .not.toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
    });
});
