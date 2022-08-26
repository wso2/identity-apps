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
import { getOrganizationsEmptyMockResponse, getOrganizationsPageOneMockResponse } from "../__mocks__/organization";
import * as api from "../api/organization";
import { OrganizationList, OrganizationListPropsInterface } from "../components/organization-list";

const clearSearchQueryMock = jest.fn();
const onListItemClickMock = jest.fn();
const onEmptyListPlaceholderActionClickMock = jest.fn();
const onOrganizationDeleteMock = jest.fn();

const organizationListProps: OrganizationListPropsInterface = {
    list: getOrganizationsPageOneMockResponse,
    onEmptyListPlaceholderActionClick: onEmptyListPlaceholderActionClickMock,
    onListItemClick: onListItemClickMock,
    onOrganizationDelete: onOrganizationDeleteMock,
    onSearchQueryClear: clearSearchQueryMock,
    parentOrganization: undefined,
    searchQuery: ""
};

describe("UTC-1.0 - [Organization Management Feature] - Organization List Component", () => {
    const deleteOrganizationMock = jest.spyOn(api, "deleteOrganization");

    deleteOrganizationMock.mockImplementation(() => Promise.resolve("organization-one"));

    test("UTC-1.1 - Test if the placeholder is shown", () => {
        render(
            <OrganizationList { ...organizationListProps } list={ getOrganizationsEmptyMockResponse } />
        );

        expect(screen.getByTestId("organization-list-empty-placeholder")).toBeInTheDocument();
    });

    test("UTC-1.2 - Test if the empty search placeholder is shown", () => {
        render(
            <OrganizationList
                { ...organizationListProps }
                list={ getOrganizationsEmptyMockResponse }
                searchQuery="Organization"
            />
        );

        expect(screen.getByTestId("organization-list-empty-search-placeholder")).toBeInTheDocument();
    });

    test("UTC-1.3 - Test if the search query can be cleared", async () => {
        render(
            <OrganizationList
                { ...organizationListProps }
                list={ getOrganizationsEmptyMockResponse }
                searchQuery="Organization"
            />
        );

        fireEvent.click(screen.getByTestId("link-button"));
        expect(clearSearchQueryMock.mock.calls.length).toBe(1);
    });

    test("UTC-1.4 - Test if the add button in the empty placeholder works fine", async () => {
        render(
            <AccessControlProvider
                allowedScopes={ ReduxStoreStateMock.auth.scope }
                featureConfig={ ReduxStoreStateMock.config.ui }
            >
                <OrganizationList { ...organizationListProps } list={ getOrganizationsEmptyMockResponse } />
            </AccessControlProvider>
        );

        fireEvent.click(screen.getByTestId("primary-button"));
        expect(onEmptyListPlaceholderActionClickMock.mock.calls.length).toBe(1);
    });

    test("UTC-1.5 - Test if the organizations are shown in the list", async () => {
        render(
            <AccessControlProvider
                allowedScopes={ ReduxStoreStateMock.auth.scope }
                featureConfig={ ReduxStoreStateMock.config.ui }
            >
                <OrganizationList { ...organizationListProps } />
            </AccessControlProvider>
        );

        expect(screen.getByText("Organization One"));
        expect(screen.getAllByTestId("data-table-row")).toHaveLength(7);
    });

    test("UTC-1.6 - Test if an organization can be clicked", async () => {
        render(
            <AccessControlProvider
                allowedScopes={ ReduxStoreStateMock.auth.scope }
                featureConfig={ ReduxStoreStateMock.config.ui }
            >
                <OrganizationList { ...organizationListProps } />
            </AccessControlProvider>
        );

        fireEvent.click(screen.getAllByTestId("data-table-row")[ 0 ]);
        expect(onListItemClickMock.mock.calls.length).toBe(1);
    });

    test("UTC-1.7 - Test if an organization can be deleted", async () => {
        render(
            <AccessControlProvider
                allowedScopes={ ReduxStoreStateMock.auth.scope }
                featureConfig={ ReduxStoreStateMock.config.ui }
            >
                <OrganizationList { ...organizationListProps } />
            </AccessControlProvider>
        );

        fireEvent.click(screen.getAllByTestId("organization-list-item-delete-button")[ 0 ]);
        fireEvent.click(
            within(screen.getByTestId("organization-list-delete-confirmation-modal-assertion-checkbox")).getByRole(
                "checkbox"
            )
        );
        fireEvent.click(screen.getByTestId("organization-list-delete-confirmation-modal-confirm-button"));
        await waitFor(() => expect(deleteOrganizationMock).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(onOrganizationDeleteMock.mock.calls.length).toBe(1));
    });

    test("UTC-1.8 - Test if disabled organization's indicator shows correctly", async () => {
        render(
            <AccessControlProvider
                allowedScopes={ ReduxStoreStateMock.auth.scope }
                featureConfig={ ReduxStoreStateMock.config.ui }
            >
                <OrganizationList { ...organizationListProps } />
            </AccessControlProvider>
        );

        screen.getAllByTestId("data-table-row").forEach(((orgListItem, index) => {
            const organization = organizationListProps.list.organizations[index];
            const isDisabled = organization.status === "DISABLED";

            expect(within(orgListItem).getByTestId("organization-list-org-status-icon"))
                .toHaveClass(isDisabled ? "orange" : "green");
        }));
    });
});
