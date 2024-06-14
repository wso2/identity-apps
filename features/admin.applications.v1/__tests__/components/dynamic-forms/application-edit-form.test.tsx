/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";
import * as OxygenTextField from "@oxygen-ui/react/TextField";
import cloneDeep from "lodash-es/cloneDeep";
import set from "lodash-es/set";
import React from "react";
import { fireEvent, render, screen, waitFor, within } from "../../../../test-configs";
import * as api from "../../../api/application";
import {
    ApplicationEditForm,
    ApplicationEditFormPropsInterface
} from "../../../components/dynamic-forms/application-edit-form";
import { MainApplicationInterface } from "../../../models";
import { ApplicationEditTabMetadataInterface } from "../../../models/application-templates";
import { applicationMockResponse, applicationSearchListMockResponse } from "../../__mocks__/application";
import { dynamicApplicationEditTabMetadataMockObject } from "../../__mocks__/application-template";
import "@testing-library/jest-dom";

describe("[Applications Management Feature] - ApplicationEditForm", () => {
    const getApplicationListMock: jest.SpyInstance = jest.spyOn(api, "getApplicationList");

    getApplicationListMock.mockImplementation(() => Promise.resolve(applicationSearchListMockResponse));

    const updateApplicationMock: jest.SpyInstance = jest.spyOn(api, "updateApplicationDetails");

    updateApplicationMock.mockImplementation(() => Promise.resolve());

    const textFieldMock: jest.SpyInstance = jest.spyOn(OxygenTextField, "default");

    textFieldMock.mockImplementation((props: MuiTextFieldProps) => {
        const { id, type, ...rest } = props;

        return (
            <div className="oxygen-text-field">
                <MuiTextField id={ id } type={ type } { ...rest } />
            </div>
        );
    });

    const props: ApplicationEditFormPropsInterface = {
        application: applicationMockResponse,
        isLoading: false,
        onUpdate: jest.fn(),
        readOnly: false,
        tab: dynamicApplicationEditTabMetadataMockObject
    };

    test("Test the rendering of the dynamic application edit tab based on the metadata", async () => {
        render(
            <ApplicationEditForm { ...props } />
        );

        await waitFor(() => {
            expect(screen.getByTestId("application-edit-form-tab-salesforce-settings")).toBeInTheDocument();
            expect(screen.getByTestId("dynamic-application-edit-form-application-name")).toBeInTheDocument();
            expect(screen.getByTestId("dynamic-application-edit-form-application-description")).toBeInTheDocument();
        });
    });

    test("Test whether the form submission is completed with only defined fields", async () => {
        render(
            <ApplicationEditForm { ...props } />
        );

        fireEvent.click(screen.getByTestId("application-edit-form-update-button"));

        await waitFor(() => {
            expect(updateApplicationMock).toHaveBeenCalledWith({
                description: applicationMockResponse?.description,
                id: applicationMockResponse?.id,
                name: applicationMockResponse?.name
            });
        });
    });

    test("Test whether the form submission is completed with initial values and input values", async () => {
        const clonedApplicationEditTabMetadataMockResponse: ApplicationEditTabMetadataInterface = cloneDeep(
            dynamicApplicationEditTabMetadataMockObject);

        set(
            clonedApplicationEditTabMetadataMockResponse,
            "form.submitDefinedFieldsOnly",
            false
        );

        props.tab = clonedApplicationEditTabMetadataMockResponse;

        render(
            <ApplicationEditForm { ...props } />
        );

        fireEvent.change(
            within(screen.getByTestId("dynamic-application-edit-form-application-name")).getByRole("textbox"),
            { target: { value: "Test App" } }
        );
        fireEvent.change(
            within(screen.getByTestId("dynamic-application-edit-form-application-description")).getByRole("textbox"),
            { target: { value: "Test Description" } }
        );
        fireEvent.click(screen.getByTestId("application-edit-form-update-button"));

        const appPayload: MainApplicationInterface = cloneDeep(applicationMockResponse);

        appPayload.name = "Test App";
        appPayload.description = "Test Description";

        await waitFor(() => {
            expect(updateApplicationMock).toHaveBeenCalledWith(appPayload);
        });
    });
});
