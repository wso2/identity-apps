/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import AppSettingsProvider from "@wso2is/admin.core.v1/providers/app-settings-provider";
import DeploymentConfigProvider from "@wso2is/admin.core.v1/providers/deployment-config-provider";
import ResourceEndpointsProvider from "@wso2is/admin.core.v1/providers/resource-enpoints-provider";
import { fireEvent, render, screen, waitFor, within } from "@wso2is/unit-testing/utils";
import React from "react";
import { getOrganizationsEmptyMockResponse, getOrganizationsPageOneMockResponse } from "../__mocks__/organization";
import * as api from "../api/organization";
import { OrganizationList, OrganizationListPropsInterface } from "../components/organization-list";
import "@testing-library/jest-dom";
import { OrganizationInterface } from "../models";

const clearSearchQueryMock: jest.Mock<any, any> = jest.fn();
const onListItemClickMock: jest.Mock<any, any> = jest.fn();
const onEmptyListPlaceholderActionClickMock: jest.Mock<any, any> = jest.fn();
const onOrganizationDeleteMock: jest.Mock<any, any> = jest.fn();

const organizationListProps: OrganizationListPropsInterface = {
    list: getOrganizationsPageOneMockResponse,
    onEmptyListPlaceholderActionClick: onEmptyListPlaceholderActionClickMock,
    onListItemClick: onListItemClickMock,
    onListMutate: jest.fn(),
    onOrganizationDelete: onOrganizationDeleteMock,
    onSearchQueryClear: clearSearchQueryMock,
    parentOrganization: {
        id: "randomid",
        name: "testorg",
        ref: "rand",
        status: "ACTIVE"
    },
    searchQuery: ""
};

describe.skip("UTC-1.0 - [Organization Management Feature] - Organization List Component", () => {
    const deleteOrganizationMock: jest.SpyInstance<Promise<string>, [id: string]> =
        jest.spyOn(api, "deleteOrganization");

    deleteOrganizationMock.mockImplementation(() => Promise.resolve("organization-one"));

    test.skip("UTC-1.1 - Test if the placeholder is shown", async () => {
        render(
            <ResourceEndpointsProvider>
                <AppSettingsProvider>
                    <DeploymentConfigProvider>
                        <OrganizationList { ...organizationListProps } list={ getOrganizationsEmptyMockResponse } />
                    </DeploymentConfigProvider>
                </AppSettingsProvider>
            </ResourceEndpointsProvider>

        );

        await waitFor(() => {
            expect(screen.getByTestId("empty-placeholder")).toBeInTheDocument();
        });
    });

    test("UTC-1.2 - Test if the empty search placeholder is shown", () => {
        render(
            <ResourceEndpointsProvider>
                <AppSettingsProvider>
                    <DeploymentConfigProvider>
                        <OrganizationList
                            { ...organizationListProps }
                            list={ getOrganizationsEmptyMockResponse }
                            searchQuery="Organization"
                        />
                    </DeploymentConfigProvider>
                </AppSettingsProvider>
            </ResourceEndpointsProvider>

        );

        expect(screen.getByTestId("organization-list-empty-search-placeholder")).toBeInTheDocument();
    });

    test("UTC-1.3 - Test if the search query can be cleared", async () => {
        render(
            <ResourceEndpointsProvider>
                <AppSettingsProvider>
                    <DeploymentConfigProvider>
                        <OrganizationList
                            { ...organizationListProps }
                            list={ getOrganizationsEmptyMockResponse }
                            searchQuery="Organization"
                        />
                    </DeploymentConfigProvider>
                </AppSettingsProvider>
            </ResourceEndpointsProvider>

        );

        fireEvent.click(screen.getByTestId("link-button"));
        expect(clearSearchQueryMock.mock.calls.length).toBe(1);
    });

    test.skip("UTC-1.4 - Test if the add button in the empty placeholder works fine", async () => {
        render(
            <ResourceEndpointsProvider>
                <AppSettingsProvider>
                    <DeploymentConfigProvider>
                        <OrganizationList { ...organizationListProps } list={ getOrganizationsEmptyMockResponse } />
                    </DeploymentConfigProvider>
                </AppSettingsProvider>
            </ResourceEndpointsProvider>

        );

        fireEvent.click(screen.getByTestId("primary-button"));
        expect(onEmptyListPlaceholderActionClickMock.mock.calls.length).toBe(1);
    });

    test("UTC-1.5 - Test if the organizations are shown in the list", async () => {
        render(
            <ResourceEndpointsProvider>
                <AppSettingsProvider>
                    <DeploymentConfigProvider>
                        <OrganizationList { ...organizationListProps } />
                    </DeploymentConfigProvider>
                </AppSettingsProvider>
            </ResourceEndpointsProvider>

        );

        expect(screen.getByText("Organization One"));
        expect(screen.getAllByTestId("data-table-row")).toHaveLength(7);
    });

    test.skip("UTC-1.6 - Test if an organization can be clicked", async () => {
        render(
            <ResourceEndpointsProvider>
                <AppSettingsProvider>
                    <DeploymentConfigProvider>
                        <OrganizationList { ...organizationListProps } />
                    </DeploymentConfigProvider>
                </AppSettingsProvider>
            </ResourceEndpointsProvider>
        );

        fireEvent.click(screen.getAllByTestId("data-table-row")[ 0 ]);
        expect(onListItemClickMock.mock.calls.length).toBe(1);
    });

    test.skip("UTC-1.7 - Test if an organization can be deleted", async () => {
        render(
            <ResourceEndpointsProvider>
                <AppSettingsProvider>
                    <DeploymentConfigProvider>
                        <OrganizationList { ...organizationListProps } />
                    </DeploymentConfigProvider>
                </AppSettingsProvider>
            </ResourceEndpointsProvider>

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
            <ResourceEndpointsProvider>
                <AppSettingsProvider>
                    <DeploymentConfigProvider>
                        <OrganizationList { ...organizationListProps } />
                    </DeploymentConfigProvider>
                </AppSettingsProvider>
            </ResourceEndpointsProvider>
        );

        screen.getAllByTestId("data-table-row").forEach(((orgListItem: HTMLElement, index: number) => {
            const organization: OrganizationInterface = organizationListProps.list.organizations[index];
            const isDisabled: boolean = organization.status === "DISABLED";

            expect(within(orgListItem).getByTestId("organization-list-org-status-icon"))
                .toHaveClass(isDisabled ? "orange" : "green");
        }));
    });
});
