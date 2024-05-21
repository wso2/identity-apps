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
import * as useGetApplicationTemplate from "../../../api/use-get-application-template";
import * as useGetApplicationTemplateMetadata from "../../../api/use-get-application-template-metadata";
import {
    ApplicationCreateWizard,
    ApplicationCreateWizardPropsInterface
} from "../../../components/dynamic-forms/application-create-wizard";
import * as useApplicationSharingEligibility from "../../../hooks/use-application-sharing-eligibility";
import { MainApplicationInterface } from "../../../models";
import { ApplicationTemplateMetadataInterface } from "../../../models/application-templates";
import {
    applicationSearchListMockResponse,
    applicationTemplateMetadataMockResponse,
    applicationTemplateMockResponse,
    applicationTemplatesListMockResponse
} from "../../__mocks__/application-template";
import "@testing-library/jest-dom";

describe("[Applications Management Feature] - ApplicationCreateWizard", () => {
    const useGetApplicationTemplateMock: jest.SpyInstance = jest.spyOn(useGetApplicationTemplate, "default");

    useGetApplicationTemplateMock.mockImplementation(() => ({
        data: applicationTemplateMockResponse,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: jest.fn()
    }));

    const useGetApplicationTemplateMetadataMock: jest.SpyInstance = jest.spyOn(
        useGetApplicationTemplateMetadata, "default");

    useGetApplicationTemplateMetadataMock.mockImplementation(() => ({
        data: applicationTemplateMetadataMockResponse,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: jest.fn()
    }));

    const useApplicationListMock: jest.SpyInstance = jest.spyOn(api, "useApplicationList");

    useApplicationListMock.mockImplementation(() => ({
        data: applicationSearchListMockResponse,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: jest.fn()
    }));

    const getApplicationListMock: jest.SpyInstance = jest.spyOn(api, "getApplicationList");

    getApplicationListMock.mockImplementation(() => Promise.resolve(applicationSearchListMockResponse));

    const createApplicationMock: jest.SpyInstance = jest.spyOn(api, "createApplication");

    createApplicationMock.mockImplementation(() => Promise.resolve());

    const textFieldMock: jest.SpyInstance = jest.spyOn(OxygenTextField, "default");

    textFieldMock.mockImplementation((props: MuiTextFieldProps) => {
        const { id, type, ...rest } = props;

        return (
            <div className="oxygen-text-field">
                <MuiTextField id={ id } type={ type } { ...rest } />
            </div>
        );
    });

    const useApplicationSharingEligibilityMock: jest.SpyInstance = jest.spyOn(
        useApplicationSharingEligibility, "default");

    useApplicationSharingEligibilityMock.mockImplementation(jest.fn().mockReturnValue(true));

    const props: ApplicationCreateWizardPropsInterface = {
        onClose: jest.fn(),
        template: applicationTemplatesListMockResponse[3]
    };

    test("Test the rendering of the dynamic application create wizard based on the template", async () => {
        render(
            <ApplicationCreateWizard { ...props } />
        );

        await waitFor(() => {
            expect(screen.getByTestId("application-create-wizard")).toBeInTheDocument();
            expect(screen.getByText("Salesforce")).toBeInTheDocument();
            expect(screen.getByTestId("salesforce-create-wizard-application-name")).toBeInTheDocument();
            expect(screen.getByTestId("application-create-wizard-share-field")).toBeInTheDocument();
            expect(screen.getByText("applications:wizards.minimalAppCreationWizard.help.heading")).toBeInTheDocument();
            expect(screen.getByText("https://myapp.io/login")).toBeInTheDocument();
        });
    });

    test("Test whether the unique application name is generated", async () => {
        render(
            <ApplicationCreateWizard { ...props } />
        );

        await waitFor(() => {
            expect(within(screen.getByTestId("salesforce-create-wizard-application-name"))
                .getByRole("textbox")).toHaveValue("Salesforce 2");
        });
    });

    test("Test whether the form submission is completed with only defined fields", async () => {
        render(
            <ApplicationCreateWizard { ...props } />
        );

        fireEvent.click(screen.getByTestId("application-create-wizard-create-button"));

        await waitFor(() => {
            expect(createApplicationMock).toHaveBeenCalledWith({
                name: "Salesforce 2"
            });
        });
    });

    test("Test whether the form submission is completed with initial values and input values", async () => {
        const clonedApplicationTemplateMetadataMockResponse: ApplicationTemplateMetadataInterface = cloneDeep(
            applicationTemplateMetadataMockResponse);

        set(
            clonedApplicationTemplateMetadataMockResponse,
            "create.form.submitDefinedFieldsOnly",
            false
        );

        useGetApplicationTemplateMetadataMock.mockImplementation(() => ({
            data: clonedApplicationTemplateMetadataMockResponse,
            error: null,
            isLoading: false,
            isValidating: false,
            mutate: jest.fn()
        }));

        render(
            <ApplicationCreateWizard { ...props } />
        );

        fireEvent.change(
            within(screen.getByTestId("salesforce-create-wizard-application-name")).getByRole("textbox"),
            { target: { value: "New Salesforce App" } }
        );
        fireEvent.click(screen.getByTestId("application-create-wizard-create-button"));

        const appPayload: MainApplicationInterface = cloneDeep(applicationTemplateMockResponse.payload);

        appPayload.name = "New Salesforce App";

        await waitFor(() => {
            expect(createApplicationMock).toHaveBeenCalledWith(appPayload);
        });
    });
});
