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

import cloneDeep from "lodash-es/cloneDeep";
import React from "react";
import { render, screen, waitFor } from "../../../test-configs";
import * as api from "../../api/application";
import { ApplicationManagementConstants } from "../../constants";
import {
    applicationNameDynamicFormFieldMock,
    applicationSearchListMockResponse,
    domainNameDynamicFormFieldMock
} from "../__mocks__/application-template";
import "@testing-library/jest-dom";
import MockDynamicFieldValidationComponent, {
    MockDynamicFieldValidationComponentProps
} from "../__mocks__/mock-dynamic-field-validation-component";

describe("[Applications Management Feature] - useDynamicFieldValidations", () => {
    const getApplicationListMock: jest.SpyInstance = jest.spyOn(api, "getApplicationList");

    getApplicationListMock.mockImplementation(() => Promise.resolve(applicationSearchListMockResponse));

    const props: MockDynamicFieldValidationComponentProps = {
        field: cloneDeep(applicationNameDynamicFormFieldMock),
        formValues: { name: "" }
    };

    test("Test the validation for the required field", async () => {
        render(
            <MockDynamicFieldValidationComponent { ...props } />
        );

        await waitFor(() => {
            expect(screen.getByText("applications:forms.dynamicApplicationCreateWizard.common.validations.required"))
                .toBeInTheDocument();
        });
    });

    test("Test the validation for the not required field", async () => {
        props.field.required = false;

        render(
            <MockDynamicFieldValidationComponent { ...props } />
        );

        await waitFor(() => {
            expect(screen.queryByText("applications:forms.dynamicApplicationCreateWizard.common.validations.required"))
                .not.toBeInTheDocument();
            expect(screen.getByText(`applications:forms.spaProtocolSettingsWizard.fields.name.validations.invalid.${
                ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_MAX_LENGTH
            }`)).toBeInTheDocument();
        });
    });

    test("Test the validation for the invalid application name", async () => {
        props.field.required = true;
        props.formValues.name = "inv@lid n@me!";

        render(
            <MockDynamicFieldValidationComponent { ...props } />
        );

        await waitFor(() => {
            expect(screen.getByText(`applications:forms.spaProtocolSettingsWizard.fields.name.validations.invalid${
                props.formValues.name
            }.${
                ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_MAX_LENGTH
            }`)).toBeInTheDocument();
        });
    });

    test("Test the validation for the duplicate application name", async () => {
        props.formValues.name = "Salesforce";

        render(
            <MockDynamicFieldValidationComponent { ...props } />
        );

        await waitFor(() => {
            expect(screen.getByText("applications:forms.generalDetails.fields.name.validations.duplicate"))
                .toBeInTheDocument();
        });
    });

    test("Test the validation for the invalid domain name", async () => {
        props.field = domainNameDynamicFormFieldMock;
        props.formValues = {
            advancedConfigurations: {
                additionalSpProperties: [
                    {
                        displayName: "Domain Name",
                        name: "domainName",
                        value: ".ex@mple.cominavlid"
                    }
                ]
            },
            name: "Salesforce"
        };

        render(
            <MockDynamicFieldValidationComponent { ...props } />
        );

        await waitFor(() => {
            expect(screen.getByText("applications:forms.dynamicApplicationCreateWizard.domainName.validations.invalid"))
                .toBeInTheDocument();
        });
    });
});
