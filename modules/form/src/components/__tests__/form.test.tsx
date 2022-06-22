/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { FieldTestConstants } from "./constants";
import getForm from "./test-form";

describe("Test if the Forms is working fine", () => {
    test("Test if the basic input type text functions work fine", async () => {

        const { getByText, getByPlaceholderText, getByDisplayValue, findByText } = render(getForm([
            {
                ariaLabel: "First Name",
                fieldType: "resourceName",
                isDefault: true,
                isRequired: true,
                isValue: true,
                type: "text",
                name: "First Name"
            },
            {
                ariaLabel: "Submit",
                fieldType: "primary-btn",
                name: "submit",
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        // check if the label is displayed
        expect(getByText(FieldTestConstants.TEXT_FIELD_LABEL)).toBeInTheDocument();

        // check if the text box with the mentioned placeholder value is displayed
        const textBox = getByPlaceholderText(FieldTestConstants.TEXT_FIELD_PLACEHOLDER);
        expect(textBox).toBeInTheDocument();

        // check if the submit button is displayed
        expect(getByText(FieldTestConstants.SUBMIT)).toBeInTheDocument();

        // check if the text box with the mentioned value is displayed
        expect(getByDisplayValue(FieldTestConstants.TEXT_FIELD_VALUE)).toBeInTheDocument();

        // check if the value of the text box changes
        const NEW_VALUE = "new value";
        fireEvent.change(textBox, { target: { value: NEW_VALUE } });
        expect(getByDisplayValue(NEW_VALUE)).toBeInTheDocument();

        // check if the listen function was called
        expect(FieldTestConstants.listen).toHaveBeenCalledTimes(1);
        expect(FieldTestConstants.listen.mock.calls[ 0 ][ 0 ].get(FieldTestConstants.TEXT_FIELD_NAME)).toBe(NEW_VALUE);

        // check if required error message is correctly displayed
        fireEvent.change(textBox, { target: { value: "" } });
        fireEvent.blur(textBox);
        fireEvent.click(getByText(FieldTestConstants.SUBMIT));
        expect(await findByText(FieldTestConstants.TEXT_FIELD_REQUIRED_MESSAGE)).toBeInTheDocument();

        // check if validation is working fine
        fireEvent.change(textBox, { target: { value: "wrong value" } });
        fireEvent.blur(textBox);
        fireEvent.click(getByText(FieldTestConstants.SUBMIT));
        expect(await findByText(FieldTestConstants.TEXT_FIELD_VALIDATION_FAILED)).toBeInTheDocument();

        // check if submit is working fine
        fireEvent.change(textBox, { target: { value: FieldTestConstants.TEXT_FIELD_VALID_MESSAGE } });
        fireEvent.blur(textBox);
        fireEvent.click(getByText(FieldTestConstants.SUBMIT));

        await waitFor(() => {
            expect(FieldTestConstants.onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(FieldTestConstants.onSubmit.mock.calls[ 0 ][ 0 ].get(FieldTestConstants.TEXT_FIELD_NAME))
            .toBe(FieldTestConstants.TEXT_FIELD_VALID_MESSAGE);
        FieldTestConstants.onSubmit.mockReset();
    });

    test("Test if input type text is empty by default when no value is passed", () => {

        const { getByPlaceholderText } = render(getForm([
            {
                ariaLabel: "First Name",
                fieldType: "resourceName",
                isDefault: true,
                isRequired: true,
                isValue: true,
                type: "text",
                name: "First Name"
            },
            {
                ariaLabel: "Submit",
                fieldType: "primary-btn",
                name: "submit",
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        // check if the text box with the mentioned value is displayed
        expect(getByPlaceholderText(FieldTestConstants.TEXT_FIELD_PLACEHOLDER).nodeValue).toBe(null);

    });

    test("Test if the form is submitted successfully with an empty text box when required is set to false",
        async () => {

            const { getByPlaceholderText, queryByText, getByText } = render(getForm([
                {
                    ariaLabel: "First Name",
                    fieldType: "resourceName",
                    isDefault: true,
                    isRequired: true,
                    isValue: true,
                    type: "text",
                    name: "First Name"
                },
                {
                    ariaLabel: "Submit",
                    fieldType: "primary-btn",
                    name: "submit",
                    isDefault: false,
                    isRequired: false,
                    isValue: true,
                    type: "submit"
                }
            ]));

            const textBox = getByPlaceholderText(FieldTestConstants.TEXT_FIELD_PLACEHOLDER);

            // check if required error message is correctly displayed
            fireEvent.change(textBox, { target: { value: "" } });
            fireEvent.blur(textBox);
            fireEvent.click(getByText(FieldTestConstants.SUBMIT));
            await waitFor(() => {
                expect(queryByText(FieldTestConstants.TEXT_FIELD_REQUIRED_MESSAGE)).not.toBeInTheDocument();
            });
        });

    test("Test if the input type password works fine", async () => {

        const {
            container,
            getByText,
            getByPlaceholderText,
            getByDisplayValue,
            findByText,
            findByDisplayValue
        } = render(getForm([
            {
                ariaLabel: "First Name",
                fieldType: "password",
                isDefault: true,
                isRequired: true,
                isValue: true,
                type: "password",
                name: "First Name"
            },
            {
                ariaLabel: "Submit",
                fieldType: "primary-btn",
                name: "submit",
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        // check if the label is displayed
        expect(getByText(FieldTestConstants.PASSWORD_LABEL)).toBeInTheDocument();

        // check if the password box with the mentioned placeholder value is displayed
        expect(getByPlaceholderText(FieldTestConstants.PASSWORD_PLACEHOLDER)).toBeInTheDocument();

        // check if the submit button is displayed
        expect(getByText(FieldTestConstants.SUBMIT)).toBeInTheDocument();

        // check if the password box with the mentioned value is displayed
        const passwordBox = getByDisplayValue(FieldTestConstants.PASSWORD_VALUE);
        expect(passwordBox).toBeInTheDocument();

        // check if the value of the password box changes
        FieldTestConstants.listen.mockReset();
        const NEW_VALUE = "new value";
        fireEvent.change(passwordBox, { target: { value: NEW_VALUE } });
        expect(await findByDisplayValue(NEW_VALUE)).toBeInTheDocument();

        // check if the listen function was called
        expect(FieldTestConstants.listen).toHaveBeenCalledTimes(1);
        expect(FieldTestConstants.listen.mock.calls[ 0 ][ 0 ].get(FieldTestConstants.PASSWORD_NAME)).toBe(NEW_VALUE);

        // check if validation is working fine
        fireEvent.change(passwordBox, { target: { value: "wrong value" } });
        fireEvent.blur(passwordBox);
        fireEvent.click(getByText(FieldTestConstants.SUBMIT));
        expect(await findByText(FieldTestConstants.PASSWORD_VALIDATION_FAILED)).toBeInTheDocument();

        // check if show/hide is working fine
        let showButton = container.getElementsByClassName("eye link icon")[ 0 ];
        expect(passwordBox).toHaveAttribute("type", "password");
        expect(showButton).toBeInTheDocument();

        // click on the show icon
        fireEvent.click(showButton);

        // check if show password popup is displayed on hover
        expect(getByText(FieldTestConstants.HIDE_PASSWORD)).toBeInTheDocument();

        // check if toggling works fine
        const hideButton = container.getElementsByClassName("eye slash link icon")[ 0 ];
        expect(passwordBox).toHaveAttribute("type", "text");
        expect(hideButton).toBeInTheDocument();

        // click on the hide icon
        fireEvent.click(hideButton);

        // check if the hide password popup is displayed on hover
        expect(await findByText(FieldTestConstants.SHOW_PASSWORD)).toBeInTheDocument();

        // check if toggling works fine
        showButton = container.getElementsByClassName("eye link icon")[ 0 ];
        expect(passwordBox).toHaveAttribute("type", "password");
        expect(showButton).toBeInTheDocument();

        // check if the show/hide button is disabled
        fireEvent.change(passwordBox, { target: { value: "" } });

        await waitFor(() => {
            expect(container.getElementsByClassName("eye disabled link icon")[ 0 ]).toBeInTheDocument();
        });

        // check if required error message if correctly displayed
        fireEvent.change(passwordBox, { target: { value: "" } });
        fireEvent.blur(passwordBox);
        fireEvent.click(getByText(FieldTestConstants.SUBMIT));
        expect(await findByText(FieldTestConstants.PASSWORD_REQUIRED_MESSAGE)).toBeInTheDocument();

        // check if submit is working fine
        FieldTestConstants.onSubmit.mockReset();
        fireEvent.change(passwordBox, { target: { value: FieldTestConstants.PASSWORD_VALID_MESSAGE } });
        fireEvent.blur(passwordBox);
        fireEvent.click(getByText(FieldTestConstants.SUBMIT));

        await waitFor(() => {
            expect(FieldTestConstants.onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(FieldTestConstants.onSubmit.mock.calls[ 0 ][ 0 ].get(FieldTestConstants.PASSWORD_NAME))
            .toBe(FieldTestConstants.PASSWORD_VALID_MESSAGE);
    });
});
