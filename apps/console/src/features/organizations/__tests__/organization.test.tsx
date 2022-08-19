/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { fireEvent, render, screen, waitFor, within } from "@unit-testing";
import { AccessControlProvider } from "@wso2is/access-control";
import React from "react";
import ReduxStoreStateMock from "../../../../test-configs/__mocks__/redux/redux-store-state";
import {
    addOrganizationMockResponse,
    getOrganizationsEmptyMockResponse,
    getOrganizationsOneMockResponse,
    getOrganizationsPageOneMockResponse,
    getOrganizationsTwoMockResponse,
    organizationThreeMockResponse,
    organizationTwoMockResponse
} from "../__mocks__/organization";
import * as api from "../api/organization";
import OrganizationsPage from "../pages/organizations";

describe("UTC-1.0 - [Organization Management Feature] - Organization Page", () => {
    const getOrganizationsMock = jest.spyOn(api, "getOrganizations");
    const getOrganizationMock = jest.spyOn(api, "getOrganization");

    afterEach(() => {
        getOrganizationsMock.mockClear();
        getOrganizationMock.mockClear();
    });

    getOrganizationsMock.mockImplementation((filter: string) => {
        if (filter === "parentId eq organization-one") {
            return Promise.resolve(getOrganizationsOneMockResponse);
        } else if (filter === "parentId eq organization-two") {
            return Promise.resolve(getOrganizationsTwoMockResponse);
        } else if (filter === "parentId eq organization-three") {
            return Promise.resolve(getOrganizationsEmptyMockResponse);
        } else if (filter === "parentId eq organization-seven") {
            return Promise.resolve(getOrganizationsEmptyMockResponse);
        }

        return Promise.resolve(getOrganizationsPageOneMockResponse);
    });

    getOrganizationMock.mockImplementation((id: string) => {
        if (id === "organization-one") {
            return Promise.resolve(addOrganizationMockResponse);
        } else if (id === "organization-two") {
            return Promise.resolve(organizationTwoMockResponse);
        } else if (id === "organization-three") {
            return Promise.resolve(organizationThreeMockResponse);
        }

        return Promise.resolve(addOrganizationMockResponse);
    });

    test("UTC-1.1 - Test if the list of organizations is shown", async () => {
        render(
            <OrganizationsPage />
        );

        await waitFor(() => expect(getOrganizationsMock).toHaveBeenCalledTimes(1));

        expect(await screen.findByText("Organization One")).toBeInTheDocument();
        expect(await screen.findByText("Organization Two")).toBeInTheDocument();
        expect(await screen.findByText("Organization Three")).toBeInTheDocument();
        expect(await screen.findByText("Organization Four")).toBeInTheDocument();
        expect(await screen.findByText("Organization Five")).toBeInTheDocument();
        expect(await screen.findByText("Organization Six")).toBeInTheDocument();
        expect(await screen.findByText("Organization Seven")).toBeInTheDocument();
        expect(screen.getAllByTestId("data-table-row")).toHaveLength(7);
    });

    test("UTC-1.1 - Test if it is possible to navigate to Organization One", async () => {
        render(
            <OrganizationsPage />
        );

        fireEvent.click(await screen.findByText("Organization One"));
        expect(
            await within(await screen.findByTestId("organizations-page-layout-page-header")).findByText(
                "Organization One"
            )
        );

        expect(
            await within(await screen.findByTestId("organizations-breadcrumb")).findByText("Organization One")
        ).toBeInTheDocument();
        expect(
            await within(await screen.findByTestId("organizations-breadcrumb")).findByTestId(
                "organizations-breadcrumb-home"
            )
        ).toBeInTheDocument();
        expect(await screen.findByText("Organization Two")).toBeInTheDocument();
        expect(screen.getByTestId("data-table-row")).toBeInTheDocument();
    });

    test("UTC-1.2 - Test if it is possible to navigate to Organization Two", async () => {
        render(
            <OrganizationsPage />
        );

        fireEvent.click(await screen.findByText("Organization One"));
        fireEvent.click(await screen.findByText("Organization Two"));
        expect(
            await within(await screen.findByTestId("organizations-page-layout-page-header")).findByText(
                "Organization Two"
            )
        );

        expect(
            await within(await screen.findByTestId("organizations-breadcrumb")).findByText("Organization One")
        ).toBeInTheDocument();
        expect(
            await within(await screen.findByTestId("organizations-breadcrumb")).findByText("Organization Two")
        ).toBeInTheDocument();
        expect(
            await within(await screen.findByTestId("organizations-breadcrumb")).findByTestId(
                "organizations-breadcrumb-home"
            )
        ).toBeInTheDocument();
        expect(await screen.findByText("Organization Three")).toBeInTheDocument();
        expect(screen.getByTestId("data-table-row")).toBeInTheDocument();
    });

    test("UTC-1.3 - Test if it is possible to navigate using the breadcrumb", async () => {
        render(
            <OrganizationsPage />
        );

        fireEvent.click(await screen.findByText("Organization One"));
        fireEvent.click(await screen.findByText("Organization Two"));
        fireEvent.click(
            await within(await screen.findByTestId("organizations-breadcrumb")).findByText("Organization One")
        );

        expect(
            await within(await screen.findByTestId("organizations-page-layout-page-header")).findByText(
                "Organization One"
            )
        );

        expect(
            await within(await screen.findByTestId("organizations-breadcrumb")).findByText("Organization One")
        ).toBeInTheDocument();
        expect(
            await within(await screen.findByTestId("organizations-breadcrumb")).findByTestId(
                "organizations-breadcrumb-home"
            )
        ).toBeInTheDocument();
        expect(await screen.findByText("Organization Two")).toBeInTheDocument();
        expect(screen.getByTestId("data-table-row")).toBeInTheDocument();
    });

    test("UTC-1.4 - Test if the next pagination button is enabled", async () => {
        render(
            <OrganizationsPage />
        );

        expect(
            await within(await screen.findByTestId("organizations-list-layout-pagination-steps")).findByText("Next")
        ).not.toHaveClass("disabled");

        getOrganizationsMock.mockClear();
        getOrganizationMock.mockClear();
    });

    test("UTC-1.5 - Test if the next and previous pagination buttons are disabled", async () => {
        render(
            <OrganizationsPage />
        );

        fireEvent.click(await screen.findByText("Organization Two"));

        expect(
            await within(await screen.findByTestId("organizations-list-layout-pagination-steps")).findByText("Next")
        ).toHaveClass("disabled");
        expect(
            await within(await screen.findByTestId("organizations-list-layout-pagination-steps")).findByText("Previous")
        ).toHaveClass("disabled");

        getOrganizationsMock.mockClear();
        getOrganizationMock.mockClear();
    });

    test("UTC-1.6 - Test if the previous pagination button is enabled", async () => {
        render(
            <OrganizationsPage />
        );

        fireEvent.click(await screen.findByText("Organization One"));

        expect(
            await within(await screen.findByTestId("organizations-list-layout-pagination-steps")).findByText("Previous")
        ).not.toHaveClass("disabled");
    });

    test("UTC-1.7 - Test if the previous pagination button is clickable", async () => {
        render(
            <OrganizationsPage />
        );

        fireEvent.click(await screen.findByText("Organization One"));

        fireEvent.click(
            await within(await screen.findByTestId("organizations-list-layout-pagination-steps")).findByText("Previous")
        );

        await waitFor(() => expect(getOrganizationsMock).toHaveBeenCalledTimes(2));
    });

    test("UTC-1.8 - Test if the next pagination button is clickable", async () => {
        render(
            <OrganizationsPage />
        );

        fireEvent.click(
            await within(await screen.findByTestId("organizations-list-layout-pagination-steps")).findByText("Next")
        );

        await waitFor(() => expect(getOrganizationsMock).toHaveBeenCalledTimes(2));
    });

    test("UTC-1.9 - Test if the filter feature is functional", async () => {
        render(
            <OrganizationsPage />
        );

        fireEvent.click(await screen.findByTestId("advanced-search-options-button"));

        expect(await screen.findByTestId("advanced-search-dropdown")).toBeInTheDocument();

        fireEvent.change(
            await within(await screen.findByTestId("advanced-search-filter-value-input")).findByRole("textbox"),
            {
                target: { value: "Organization One" }
            }
        );

        fireEvent.blur(
            await within(await screen.findByTestId("advanced-search-filter-value-input")).findByRole("textbox"),
            {
                target: { value: "Organization One" }
            }
        );
        fireEvent.click(await screen.findByTestId("advanced-search-search-button"));

        await waitFor(() => expect(getOrganizationsMock).toHaveBeenCalledTimes(2));
    });

    test("UTC-1.10 - Test if it the add organization button is functional", async () => {
        render(
            <AccessControlProvider
                allowedScopes={ ReduxStoreStateMock.auth.scope }
                featureConfig={ ReduxStoreStateMock.config.ui }
            >
                <OrganizationsPage />
            </AccessControlProvider>
        );

        fireEvent.click(await screen.findByTestId("organizations-list-layout-add-button"));

        expect(await screen.findByTestId("organization-create-wizard-modal")).toBeInTheDocument();
    });

    test("UTC-1.11 - Test if it is add organization button is disabled for disabled parent", async () => {
        render(
            <AccessControlProvider
                allowedScopes={ ReduxStoreStateMock.auth.scope }
                featureConfig={ ReduxStoreStateMock.config.ui }
            >
                <OrganizationsPage />
            </AccessControlProvider>
        );

        // Navigate to Organization seven which is a disabled organization
        fireEvent.click(await screen.findByText("Organization Seven"));

        expect(await within(await screen.findByTestId("organization-list-empty-placeholder-action-container"))
            .findByRole("button"))
            .toHaveClass("disabled");
    });
});
