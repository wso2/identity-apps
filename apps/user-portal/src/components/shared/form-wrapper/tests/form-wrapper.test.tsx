/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import * as React from "react";
import { fireEvent, render } from "../../../../../test_configs/test-utils";
import { Validation } from "../../../../models";
import { FormWrapper } from "../form-wrapper";
import constants from "./constants";
import getForm from "./test-form";

describe("Test if the FormWrapper is working fine", () => {

    test("Test if the basic input type text functions work fine", () => {

        const { getByText, getByPlaceholderText, getByDisplayValue } = render(
            <FormWrapper
                formFields={ [{
                    label: constants.TEXT_BOX_LABEL,
                    name: constants.TEXT_BOX_NAME,
                    placeholder: constants.TEXT_BOX_PLACEHOLDER,
                    required: true,
                    requiredErrorMessage: constants.TEXT_BOX_REQUIRED_MESSAGE,
                    type: "text" as const,
                    validation: (value: string, validation: Validation) => {
                        if (value !== constants.TEXT_BOX_VALID_MESSAGE) {
                            validation.isValid = false;
                            validation.errorMessages.push(
                                constants.TEXT_BOX_VALIDATION_FAILED
                            );
                        }
                    },
                    value: constants.TEXT_BOX_VALUE,
                    width: 15 as const
                },
                {
                    type: "submit",
                    value: "Submit"
                }] }
                onSubmit={ () => { } }
            />
        );

        // checks if the label is displayed
        expect(getByText(constants.TEXT_BOX_LABEL)).toBeInTheDocument();

        // checks if the text box with the mentioned placeholder value is displayed
        const textBox = getByPlaceholderText(constants.TEXT_BOX_PLACEHOLDER);
        expect(textBox).toBeInTheDocument();

        // checks if the submit button is displayed
        expect(getByText(constants.SUBMIT)).toBeInTheDocument();

        // check if the value of the text box changes
        const NEW_VALUE = "new value";
        fireEvent.change(textBox, { target: { value: NEW_VALUE } });
        expect(getByDisplayValue(NEW_VALUE)).toBeInTheDocument();

        // checks if required error message is correctly displayed
        fireEvent.change(textBox, { target: { value: "" } });
        fireEvent.blur(textBox);
        fireEvent.click(getByText(constants.SUBMIT));
        expect(getByText(constants.TEXT_BOX_REQUIRED_MESSAGE)).toBeInTheDocument();

        // checks if the text box with the mentioned value is displayed
        expect(getByDisplayValue(constants.TEXT_BOX_VALUE)).toBeInTheDocument();

        // checks if validation is working fine
        fireEvent.change(textBox, { target: { value: "wrong value" } });
        fireEvent.blur(textBox);
        fireEvent.click(getByText(constants.SUBMIT));
        expect(getByText(constants.TEXT_BOX_VALIDATION_FAILED)).toBeInTheDocument();

        // checks if submit is working fine
        fireEvent.change(textBox, { target: { value: constants.TEXT_BOX_VALID_MESSAGE } });
        fireEvent.blur(textBox);
        fireEvent.click(getByText(constants.SUBMIT));
        expect(constants.onSubmit).toHaveBeenCalledTimes(1);
        expect(constants.onSubmit.mock.calls[0][0].get(constants.TEXT_BOX_NAME)).toBe(constants.TEXT_BOX_VALID_MESSAGE);
    });

    test("Test if input type text is empty by default when no value is passed", () => {

        const { getByDisplayValue } = render(getForm([
            {
                isDefault: true,
                isRequired: true,
                isValue: false,
                type: "text"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: false,
                type: "submit"
            }
        ]));

        // checks if the text box with the mentioned value is displayed
        expect(getByDisplayValue(constants.TEXT_BOX_VALUE)).not().toBeInTheDocument();

    });

    test("Test if the form is submitted successfully with an empty text box when required is set to false",
        () => {

            const { getByPlaceholderText, getByText } = render(getForm([
                {
                    isDefault: true,
                    isRequired: false,
                    isValue: false,
                    type: "text"
                },
                {
                    isDefault: false,
                    isRequired: false,
                    isValue: false,
                    type: "submit"
                }
            ]));

            const textBox = getByPlaceholderText(constants.TEXT_BOX_PLACEHOLDER);

            // checks if required error message is correctly displayed
            fireEvent.change(textBox, { target: { value: "" } });
            fireEvent.blur(textBox);
            fireEvent.click(getByText(constants.SUBMIT));
            expect(getByText(constants.TEXT_BOX_REQUIRED_MESSAGE)).not().toBeInTheDocument();
        });

    test("Test if the input type password works fine", () => {

        const { container, getByText, getByPlaceholderText, getByDisplayValue } = render(getForm([
            {
                isDefault: true,
                isRequired: true,
                isValue: true,
                type: "password"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: false,
                type: "submit"
            }
        ]));

        // checks if the label is displayed
        expect(getByText(constants.PASSWORD_LABEL)).toBeInTheDocument();

        // checks if the password box with the mentioned placeholder value is displayed
        expect(getByPlaceholderText(constants.PASSWORD_PLACEHOLDER)).toBeInTheDocument();

        // checks if the submit button is displayed
        expect(getByText(constants.SUBMIT)).toBeInTheDocument();

        // checks if the password box with the mentioned value is displayed
        const passwordBox = getByDisplayValue(constants.PASSWORD_VALUE);
        expect(passwordBox).toBeInTheDocument();

        // check if the value of the password box changes
        const NEW_VALUE = "new value";
        fireEvent.change(passwordBox, { target: { value: NEW_VALUE } });
        expect(getByDisplayValue(NEW_VALUE)).toBeInTheDocument();

        // checks if validation is working fine
        fireEvent.change(passwordBox, { target: { value: "wrong value" } });
        fireEvent.blur(passwordBox);
        fireEvent.click(getByText(constants.SUBMIT));
        expect(getByText(constants.PASSWORD_VALIDATION_FAILED)).toBeInTheDocument();

        // checks if show/hide is working fine
        let showButton = container.getElementsByClassName("eye link icon")[0];
        expect(passwordBox).toHaveAttribute("type", "password");
        expect(showButton).toBeInTheDocument();

        // click on the show icon
        fireEvent.click(showButton);

        const hideButton = container.getElementsByClassName("eye slash link icon")[0];
        expect(passwordBox).toHaveAttribute("type", "text");
        expect(showButton).toBeInTheDocument();

        // click on the show button
        fireEvent.click(hideButton);
        showButton = container.getElementsByClassName("eye link icon")[0];
        expect(passwordBox).toHaveAttribute("type", "password");
        expect(showButton).toBeInTheDocument();

        // check if the show/hide button is disabled
        fireEvent.change(passwordBox, { target: { value: "" } });
        expect(container.getElementsByClassName("eye disabled link icon")[0]).toBeInTheDocument();

        // checks if required error message if correctly displayed
        fireEvent.change(passwordBox, { target: { value: "" } });
        fireEvent.blur(passwordBox);
        fireEvent.click(getByText(constants.SUBMIT));
        expect(getByText(constants.PASSWORD_REQUIRED_MESSAGE)).toBeInTheDocument();

        // checks if submit is working fine
        fireEvent.change(passwordBox, { target: { value: constants.PASSWORD_VALID_MESSAGE } });
        fireEvent.blur(passwordBox);
        fireEvent.click(getByText(constants.SUBMIT));
        expect(constants.onSubmit).toHaveBeenCalledTimes(2);
        expect(constants.onSubmit.mock.calls[1][0].get(constants.PASSWORD_NAME)).toBe(constants.PASSWORD_VALID_MESSAGE);
    });

});
