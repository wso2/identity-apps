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

import React from "react";
import { render, screen, waitFor } from "../../../../test-configs";
import ApplicationCreationAdapter, {
    ApplicationCreationAdapterPropsInterface
} from "../../../components/application-templates/application-creation-adapter";
import * as ApplicationCreateWizard from "../../../components/dynamic-forms/application-create-wizard";
import * as MinimalApplicationCreateWizard from "../../../components/wizard/minimal-application-create-wizard";
import {
    applicationTemplatesListMockResponse
} from "../../__mocks__/application-template";
import "@testing-library/jest-dom";

describe("[Applications Management Feature] - ApplicationCreationAdapter", () => {
    const minimalApplicationCreateWizardMock: jest.SpyInstance = jest.spyOn(
        MinimalApplicationCreateWizard, "MinimalAppCreateWizard");

    minimalApplicationCreateWizardMock.mockImplementation(() =>
        <div data-componentid="minimal-application-create-wizard-modal"></div>);

    const applicationCreateWizardMock: jest.SpyInstance = jest.spyOn(
        ApplicationCreateWizard, "ApplicationCreateWizard");

    applicationCreateWizardMock.mockImplementation(() =>
        <div data-componentid="application-create-wizard"></div>);

    const propsWithSPATemplate: ApplicationCreationAdapterPropsInterface = {
        onClose: jest.fn(),
        showWizard: true,
        template: applicationTemplatesListMockResponse[0]
    };

    const propsWithSalesforceTemplate: ApplicationCreationAdapterPropsInterface = {
        onClose: jest.fn(),
        showWizard: true,
        template: applicationTemplatesListMockResponse[3]
    };

    test("Test the existing technology/protocol based application creation wizard", async () => {
        render(
            <ApplicationCreationAdapter { ...propsWithSPATemplate } />
        );

        await waitFor(() => {
            expect(screen.getByTestId("minimal-application-create-wizard-modal")).toBeInTheDocument();
        });
    });

    test("Test the dynamically rendered application creation wizard", async () => {
        render(
            <ApplicationCreationAdapter { ...propsWithSalesforceTemplate } />
        );

        await waitFor(() => {
            expect(screen.getByTestId("application-create-wizard")).toBeInTheDocument();
        });
    });
});
