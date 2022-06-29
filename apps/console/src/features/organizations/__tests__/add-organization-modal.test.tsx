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

import { fireEvent,render, screen, waitFor, within } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import {
    addOrganizationMockResponse,
    getOrganizationsEmptyMockResponse,
    getOrganizationsMockResponse
} from "../__mocks__/organization";
import * as api from "../api/organization";
import { AddOrganizationModal, AddOrganizationModalPropsInterface } from "../components";

const addComponentModalProps: AddOrganizationModalPropsInterface = {
    closeWizard: jest.fn(),
    onUpdate: jest.fn(),
    parent: {
        id: "1",
        name: "Parent Organization",
        ref: "ref"
    }
};

describe("UTC-1.0 - [Organization Management Feature] - Add Organization Modal", () => {
    const mockStore = configureStore();
    const store = mockStore({});
    const addOrganizationMock = jest.spyOn(api, "addOrganization");
    const getOrganizationsMock = jest.spyOn(api, "getOrganizations");

    addOrganizationMock.mockImplementation(() => Promise.resolve(addOrganizationMockResponse));

    getOrganizationsMock.mockImplementation((filter: string) => {
        if (filter === "name eq Organization One") {
            return Promise.resolve(getOrganizationsMockResponse);
        }

        return Promise.resolve(getOrganizationsEmptyMockResponse);
    });

    test("UTC-1.1 - Test if the parent name is shown in the subheading", () => {
        render(
            <Provider store={ store }>
                <AddOrganizationModal { ...addComponentModalProps } />
            </Provider>
        );

        expect(screen.getByTestId("organization-create-wizard-subheading").innerHTML).toContain("Parent Organization");
    });

    test("UTC-1.2 - Test if the needed fields are shown", () => {
        render(
            <Provider store={ store }>
                <AddOrganizationModal { ...addComponentModalProps } />
            </Provider>
        );

        expect(screen.getByTestId("organization-create-wizard-organization-name-input")).toBeVisible();
        expect(screen.getByTestId("organization-create-wizard-description-input")).toBeVisible();
        expect(screen.getByTestId("organization-create-wizard-next-button")).toBeVisible();
    });

    test("UTC-1.3 - Test if name requirement validation is working", async () => {
        render(
            <Provider store={ store }>
                <AddOrganizationModal { ...addComponentModalProps } />
            </Provider>
        );

        fireEvent.change(
            within(screen.getByTestId("organization-create-wizard-organization-name-input")).getByRole("textbox"),
            { target: { value: "" } }
        );

        fireEvent.click(screen.getByTestId("organization-create-wizard-next-button"));
        await waitFor(() =>
            expect(
                screen.getByText("console:manage.features.organizations.forms.addOrganization.name.validation.empty")
            )
        );
    });

    test("UTC-1.4 - Test if duplicate name validation is working", async () => {
        render(
            <Provider store={ store }>
                <AddOrganizationModal { ...addComponentModalProps } />
            </Provider>
        );

        fireEvent.change(
            within(screen.getByTestId("organization-create-wizard-organization-name-input")).getByRole("textbox"),
            { target: { value: "Organization One" } }
        );

        fireEvent.click(screen.getByTestId("organization-create-wizard-next-button"));
        await waitFor(() => expect(screen.getByTestId("organization-create-wizard-duplicate-name-error")));
    });

    test("UTC-1.5 - Test if the form can be submitted", async () => {
        render(
            <Provider store={ store }>
                <AddOrganizationModal { ...addComponentModalProps } />
            </Provider>
        );

        fireEvent.change(
            within(screen.getByTestId("organization-create-wizard-organization-name-input")).getByRole("textbox"),
            { target: { value: "Organization Two" } }
        );

        fireEvent.click(screen.getByTestId("organization-create-wizard-next-button"));

        await waitFor(() => {
            expect(addOrganizationMock).toHaveBeenCalledTimes(1);
        });
    });
});
