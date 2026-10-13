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

import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { RolesV2Interface, RolesV2ResponseInterface } from "@wso2is/admin.roles.v2/models/roles";
import ReduxStoreStateMock from "@wso2is/unit-testing/__mocks__/redux/redux-store-state";
import { RenderResult, fireEvent, render, screen, within } from "@wso2is/unit-testing/utils";
import React from "react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import OrganizationRoleProperties from "../organization-role-properties";
import type {} from "@testing-library/jest-dom/vitest";

const useGetRolesListMock: Mock = vi.hoisted(() => vi.fn());

vi.mock("@wso2is/admin.roles.v2/api/use-get-roles-list", () => ({ default: useGetRolesListMock }));

describe("OrganizationRoleProperties", () => {
    const componentId: string = "organization-role-properties";
    const onChange: Mock<(_roleIds: string[]) => void> = vi.fn();
    const manager: RolesV2Interface = {
        audience: { display: "Organization", type: "ORGANIZATION", value: "organization-id" },
        displayName: "Manager",
        id: "role-manager",
        meta: { location: "" }
    };
    const auditor: RolesV2Interface = {
        audience: { display: "Organization", type: "ORGANIZATION", value: "organization-id" },
        displayName: "Auditor",
        id: "role-auditor",
        meta: { location: "" }
    };
    const roles: RolesV2ResponseInterface = {
        Resources: [ manager, auditor ],
        startIndex: 1,
        totalResults: 2
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
    ): RenderResult => render(
        <OrganizationRoleProperties selectedRoleIds={ selectedRoleIds } onChange={ onChange } />,
        { allowedScopes, initialState }
    );

    const getInput = (): HTMLElement =>
        within(screen.getByTestId(`${componentId}-input`)).getByRole("combobox");

    beforeEach(() => {
        onChange.mockReset();
        useGetRolesListMock.mockReset();
        useGetRolesListMock.mockReturnValue({ data: roles, error: undefined, isLoading: false });
    });

    it("searches loaded roles and adds a role without losing an existing selection", () => {
        const { rerender } = renderRolePicker([ manager.id ]);

        expect(screen.getByText("Manager (Organization)")).toBeInTheDocument();
        fireEvent.change(getInput(), { target: { value: "Auditor" } });
        expect(screen.getByText("Manager (Organization)")).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: /Manager/ })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("option", { name: /Auditor/ }));

        expect(onChange).toHaveBeenCalledWith([ manager.id, auditor.id ]);
        rerender(<OrganizationRoleProperties
            selectedRoleIds={ [ manager.id, auditor.id ] } onChange={ onChange }
        />);
        expect(screen.getByText("Manager (Organization)")).toBeInTheDocument();
        expect(screen.getByText("Auditor (Organization)")).toBeInTheDocument();
        expect(getInput()).toHaveValue("");
    });

    it("removes a selected role without removing the other selection", () => {
        renderRolePicker([ manager.id, auditor.id ]);
        fireEvent.mouseDown(getInput());
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
            "users,groups,permissions,associatedApplications",
            false
        );
    });

    it("loads subsequent pages without dropping roles from the first page", () => {
        const firstPage: RolesV2ResponseInterface = { Resources: [ manager ], startIndex: 1, totalResults: 2 };
        const secondPage: RolesV2ResponseInterface = { Resources: [ auditor ], startIndex: 2, totalResults: 2 };

        useGetRolesListMock.mockImplementation((_count: number, startIndex: number) => ({
            data: startIndex === 1 ? firstPage : secondPage,
            error: undefined,
            isLoading: false
        }));

        renderRolePicker();
        fireEvent.mouseDown(getInput());

        expect(screen.getByRole("option", { name: /Manager/ })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: /Auditor/ })).toBeInTheDocument();
        expect(useGetRolesListMock).toHaveBeenCalledWith(
            UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
            2,
            undefined,
            "users,groups,permissions,associatedApplications",
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

        expect(screen.getByText("Manager (Organization)")).toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
    });
});
