/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, waitFor } from "@testing-library/react";
import constants from "./constants";
import getForm from "./test-form";

describe("Test if the Forms is working fine", () => {

    test("Test if the basic input type text functions work fine", async () => {

        const { getByText, getByPlaceholderText, getByDisplayValue, findByText } = render(getForm([
            {
                isDefault: true,
                isRequired: true,
                isValue: true,
                type: "text"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        // check if the label is displayed
        expect(getByText(constants.TEXT_BOX_LABEL)).toBeInTheDocument();

        // check if the text box with the mentioned placeholder value is displayed
        const textBox = getByPlaceholderText(constants.TEXT_BOX_PLACEHOLDER);

        expect(textBox).toBeInTheDocument();

        // check if the submit button is displayed
        expect(getByText(constants.SUBMIT)).toBeInTheDocument();

        // check if the text box with the mentioned value is displayed
        expect(getByDisplayValue(constants.TEXT_BOX_VALUE)).toBeInTheDocument();

        // check if the value of the text box changes
        const NEW_VALUE = "new value";

        fireEvent.change(textBox, { target: { value: NEW_VALUE } });
        expect(getByDisplayValue(NEW_VALUE)).toBeInTheDocument();

        // check if the listen function was called
        expect(constants.listen).toHaveBeenCalledTimes(1);
        expect(constants.listen.mock.calls[ 0 ][ 0 ].get(constants.TEXT_BOX_NAME)).toBe(NEW_VALUE);

        // check if required error message is correctly displayed
        fireEvent.change(textBox, { target: { value: "" } });
        fireEvent.blur(textBox);
        fireEvent.click(getByText(constants.SUBMIT));
        expect(await findByText(constants.TEXT_BOX_REQUIRED_MESSAGE)).toBeInTheDocument();

        // check if validation is working fine
        fireEvent.change(textBox, { target: { value: "wrong value" } });
        fireEvent.blur(textBox);
        fireEvent.click(getByText(constants.SUBMIT));
        expect(await findByText(constants.TEXT_BOX_VALIDATION_FAILED)).toBeInTheDocument();

        // check if submit is working fine
        fireEvent.change(textBox, { target: { value: constants.TEXT_BOX_VALID_MESSAGE } });
        fireEvent.blur(textBox);
        fireEvent.click(getByText(constants.SUBMIT));

        await waitFor(() => {
            expect(constants.onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(constants.onSubmit.mock.calls[ 0 ][ 0 ].get(constants.TEXT_BOX_NAME))
            .toBe(constants.TEXT_BOX_VALID_MESSAGE);
        constants.onSubmit.mockReset();
    });

    test("Test if input type text is empty by default when no value is passed", () => {

        const { getByPlaceholderText } = render(getForm([
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

        // check if the text box with the mentioned value is displayed
        expect(getByPlaceholderText(constants.TEXT_BOX_PLACEHOLDER).nodeValue).toBe(null);

    });

    test("Test if the form is submitted successfully with an empty text box when required is set to false",
        async () => {

            const { getByPlaceholderText, queryByText, getByText } = render(getForm([
                {
                    isDefault: false,
                    isRequired: false,
                    isValue: false,
                    type: "text"
                },
                {
                    isDefault: false,
                    isRequired: false,
                    isValue: true,
                    type: "submit"
                }
            ]));

            const textBox = getByPlaceholderText(constants.TEXT_BOX_PLACEHOLDER);

            // check if required error message is correctly displayed
            fireEvent.change(textBox, { target: { value: "" } });
            fireEvent.blur(textBox);
            fireEvent.click(getByText(constants.SUBMIT));
            await waitFor(() => {
                expect(queryByText(constants.TEXT_BOX_REQUIRED_MESSAGE)).not.toBeInTheDocument();
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
                isDefault: false,
                isRequired: true,
                isValue: true,
                type: "password"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        // check if the label is displayed
        expect(getByText(constants.PASSWORD_LABEL)).toBeInTheDocument();

        // check if the password box with the mentioned placeholder value is displayed
        expect(getByPlaceholderText(constants.PASSWORD_PLACEHOLDER)).toBeInTheDocument();

        // check if the submit button is displayed
        expect(getByText(constants.SUBMIT)).toBeInTheDocument();

        // check if the password box with the mentioned value is displayed
        const passwordBox = getByDisplayValue(constants.PASSWORD_VALUE);

        expect(passwordBox).toBeInTheDocument();

        // check if the value of the password box changes
        constants.listen.mockReset();
        const NEW_VALUE = "new value";

        fireEvent.change(passwordBox, { target: { value: NEW_VALUE } });
        expect(await findByDisplayValue(NEW_VALUE)).toBeInTheDocument();

        // check if the listen function was called
        expect(constants.listen).toHaveBeenCalledTimes(1);
        expect(constants.listen.mock.calls[ 0 ][ 0 ].get(constants.PASSWORD_NAME)).toBe(NEW_VALUE);

        // check if validation is working fine
        fireEvent.change(passwordBox, { target: { value: "wrong value" } });
        fireEvent.blur(passwordBox);
        fireEvent.click(getByText(constants.SUBMIT));
        expect(await findByText(constants.PASSWORD_VALIDATION_FAILED)).toBeInTheDocument();

        // check if show/hide is working fine
        let showButton = container.getElementsByClassName("eye link icon")[ 0 ];

        expect(passwordBox).toHaveAttribute("type", "password");
        expect(showButton).toBeInTheDocument();

        // click on the show icon
        fireEvent.click(showButton);

        // check if show password popup is displayed on hover
        expect(getByText(constants.HIDE_PASSWORD)).toBeInTheDocument();

        // check if toggling works fine
        const hideButton = container.getElementsByClassName("eye slash link icon")[ 0 ];

        expect(passwordBox).toHaveAttribute("type", "text");
        expect(hideButton).toBeInTheDocument();

        // click on the hide icon
        fireEvent.click(hideButton);

        // check if the hide password popup is displayed on hover
        expect(await findByText(constants.SHOW_PASSWORD)).toBeInTheDocument();

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
        fireEvent.click(getByText(constants.SUBMIT));
        expect(await findByText(constants.PASSWORD_REQUIRED_MESSAGE)).toBeInTheDocument();

        // check if submit is working fine
        constants.onSubmit.mockReset();
        fireEvent.change(passwordBox, { target: { value: constants.PASSWORD_VALID_MESSAGE } });
        fireEvent.blur(passwordBox);
        fireEvent.click(getByText(constants.SUBMIT));

        await waitFor(() => {
            expect(constants.onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(constants.onSubmit.mock.calls[ 0 ][ 0 ].get(constants.PASSWORD_NAME))
            .toBe(constants.PASSWORD_VALID_MESSAGE);
    });

    test("Test if the basic functions of a checkbox are working fine", async () => {
        const { getByText, getByDisplayValue, findByText } = render(getForm([
            {
                isDefault: false,
                isRequired: true,
                isValue: true,
                type: "checkbox"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        // check if the label is displayed correctly
        expect(getByText(constants.CHECKBOX_LABEL)).toBeInTheDocument();

        // check if the children are there
        expect(getByText(constants.CHECKBOX_CHILD_1_LABEL)).toBeInTheDocument();
        expect(getByText(constants.CHECKBOX_CHILD_2_LABEL)).toBeInTheDocument();
        expect(getByText(constants.CHECKBOX_CHILD_3_LABEL)).toBeInTheDocument();

        // check if the provided value is selected
        expect(getByDisplayValue(constants.CHECKBOX_VALUE[ 0 ]).parentElement).toHaveClass("checked");

        // check if the checkbox selection is working fine
        constants.listen.mockReset();
        fireEvent.click(getByDisplayValue(constants.CHECKBOX_CHILD_1_VALUE));
        const check = await findByText(constants.CHECKBOX_CHILD_1_LABEL);

        expect(check.parentElement).toHaveClass("checked");

        // check if the listen function was called
        expect(constants.listen).toHaveBeenCalledTimes(1);
        expect(constants.listen.mock.calls[ 0 ][ 0 ].get(constants.CHECKBOX_NAME)[ 1 ])
            .toBe(constants.CHECKBOX_CHILD_1_VALUE);

        // check if required validation is working fine
        fireEvent.click(getByDisplayValue(constants.CHECKBOX_CHILD_1_VALUE));
        fireEvent.click(getByDisplayValue(constants.CHECKBOX_CHILD_2_VALUE));
        fireEvent.blur(getByDisplayValue(constants.CHECKBOX_CHILD_1_VALUE));
        fireEvent.click(getByText(constants.SUBMIT));
        expect(await findByText(constants.CHECKBOX_REQUIRED_MESSAGE)).toBeInTheDocument();

        // check if when submit is clicked the clicked checkboxes values are passed
        fireEvent.click(getByDisplayValue(constants.CHECKBOX_CHILD_1_VALUE));
        fireEvent.click(getByDisplayValue(constants.CHECKBOX_CHILD_2_VALUE));
        fireEvent.blur(getByDisplayValue(constants.CHECKBOX_CHILD_1_VALUE));
        constants.onSubmit.mockReset();
        fireEvent.click(getByText(constants.SUBMIT));

        await waitFor(() => {
            expect(constants.onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(constants.onSubmit.mock.calls[ 0 ][ 0 ].get(constants.CHECKBOX_NAME)).toHaveLength(2);

    });

    test("Test if checkbox submission succeeds when required is set to false", () => {
        const { getByText, queryByText } = render(getForm([
            {
                isDefault: false,
                isRequired: false,
                isValue: false,
                type: "checkbox"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        constants.onSubmit.mockReset();
        fireEvent.click(getByText(constants.SUBMIT));
        expect(queryByText(constants.CHECKBOX_REQUIRED_MESSAGE)).not.toBeInTheDocument();
        expect(constants.onSubmit).toHaveBeenCalledTimes(1);
        expect(constants.onSubmit.mock.calls[ 0 ][ 0 ].get(constants.CHECKBOX_NAME)).toHaveLength(0);
    });

    test("Test if the basic functions of the radio field are working fine", () => {
        const { getByText, getByDisplayValue } = render(getForm([
            {
                isDefault: true,
                isRequired: true,
                isValue: true,
                type: "radio"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        // check if the label is displayed correctly
        expect(getByText(constants.RADIO_LABEL)).toBeInTheDocument();

        // check if the children are displayed properly
        expect(getByText(constants.RADIO_CHILD_1_LABEL)).toBeInTheDocument();
        expect(getByText(constants.RADIO_CHILD_2_LABEL)).toBeInTheDocument();

        // check if the provided value is selected
        expect(getByDisplayValue(constants.RADIO_VALUE).parentElement).toHaveClass("checked");

        // check if radio selection is working fine
        constants.listen.mockReset();
        fireEvent.click(getByDisplayValue(constants.RADIO_CHILD_2_VALUE));
        expect(getByDisplayValue(constants.RADIO_CHILD_2_VALUE).parentElement).toHaveClass("checked");

        // check if the listen function was called
        expect(constants.listen).toHaveBeenCalledTimes(1);
        expect(constants.listen.mock.calls[ 0 ][ 0 ].get(constants.RADIO_NAME)).toBe(constants.RADIO_CHILD_2_VALUE);

        // check if submission is working fine
        constants.onSubmit.mockReset();
        fireEvent.click(getByText(constants.SUBMIT));
        expect(constants.onSubmit).toHaveBeenCalledTimes(1);
        expect(constants.onSubmit.mock.calls[ 0 ][ 0 ].get(constants.RADIO_NAME)).toBe(constants.RADIO_CHILD_2_VALUE);

    });

    test("Test if default value of a radio is checked", () => {
        const { getByDisplayValue } = render(getForm([
            {
                isDefault: true,
                isRequired: true,
                isValue: false,
                type: "radio"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        // check if the provided value is selected
        expect(getByDisplayValue(constants.RADIO_DEFAULT).parentElement).toHaveClass("checked");

    });

    test("Test if the basic functions of dropdown are working fine", async () => {
        const { getByText, getByRole, getAllByText, findByText, findByRole } = render(getForm([
            {
                isDefault: false,
                isRequired: true,
                isValue: false,
                type: "dropdown"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        // check if the label is displayed properly
        expect(getByText(constants.DROPDOWN_LABEL)).toBeInTheDocument();

        // check if the children are displayed properly
        expect(getByText(constants.DROPDOWN_CHILD_1_VALUE)).toBeInTheDocument();
        expect(getByText(constants.DROPDOWN_CHILD_2_VALUE)).toBeInTheDocument();

        // check if required validation works fine
        fireEvent.click(getByText(constants.SUBMIT));
        expect(await findByText(constants.DROPDOWN_REQUIRED_MESSAGE)).toBeInTheDocument();

        // check if selection works properly
        constants.listen.mockReset();
        fireEvent.click(getByRole("alert"));
        fireEvent.click(getByText(constants.DROPDOWN_CHILD_2_VALUE).parentElement);
        fireEvent.blur(getAllByText(constants.DROPDOWN_CHILD_2_VALUE)[ 1 ].parentElement);
        const dropdown = await findByRole("alert");

        expect(dropdown.firstChild.nodeValue).toBe(constants.DROPDOWN_CHILD_2_VALUE);

        // check if the listen function was called
        await waitFor(() => {
            expect(constants.listen).toHaveBeenCalledTimes(1);
            expect(constants.listen.mock.calls[ 0 ][ 0 ].get(constants.DROPDOWN_NAME))
                .toBe(constants.DROPDOWN_CHILD_2_VALUE);
        });

        // check if submission works fine
        constants.onSubmit.mockReset();
        fireEvent.click(getByText(constants.SUBMIT));

        await waitFor(() => {
            expect(constants.onSubmit).toHaveBeenCalledTimes(1);
            expect(constants.onSubmit.mock.calls[ 0 ][ 0 ].get(constants.DROPDOWN_NAME))
                .toBe(constants.DROPDOWN_CHILD_2_VALUE);
        });

    });

    test("Test if the default value is selected in a dropdown", () => {
        const { getByRole } = render(getForm([
            {
                isDefault: true,
                isRequired: true,
                isValue: false,
                type: "dropdown"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        expect(getByRole("alert").firstChild.nodeValue).toBe(constants.DROPDOWN_DEFAULT);

    });

    test("Test if the passed value is selected in a dropdown", () => {
        const { getByRole } = render(getForm([
            {
                isDefault: true,
                isRequired: true,
                isValue: true,
                type: "dropdown"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        expect(getByRole("alert").firstChild.nodeValue).toBe(constants.DROPDOWN_VALUE);

    });

    test("Test if dropdown submission works when required is set to false", () => {
        const { getByText, queryByText } = render(getForm([
            {
                isDefault: false,
                isRequired: false,
                isValue: false,
                type: "dropdown"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ]));

        constants.onSubmit.mockReset();
        fireEvent.click(getByText(constants.SUBMIT));
        expect(queryByText(constants.DROPDOWN_REQUIRED_MESSAGE)).not.toBeInTheDocument();
        expect(constants.onSubmit).toHaveBeenCalledTimes(1);
        expect(constants.onSubmit.mock.calls[ 0 ][ 0 ].get(constants.DROPDOWN_NAME)).toBe("");
    });

    test("Test if the reset button is working fine", () => {

        const { getByText, getByPlaceholderText } = render(getForm([
            {
                isDefault: true,
                isRequired: true,
                isValue: true,
                type: "text"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "reset"
            }
        ]));

        fireEvent.click(getByText(constants.RESET_VALUE));
        expect(getByPlaceholderText(constants.TEXT_BOX_PLACEHOLDER).nodeValue).toBe(null);

    });

    test("Test if the button works fine", () => {
        const { getByText } = render(getForm([
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "button"
            }
        ]));

        // check if the button is displayed
        expect(getByText(constants.BUTTON_VALUE)).toBeInTheDocument();

        // check if the click function works fine
        fireEvent.click(getByText(constants.BUTTON_VALUE));
        expect(constants.onClick).toHaveBeenCalledTimes(1);
    });

    test("Test if grouping works fine", () => {
        const { getAllByText, getByText } = render(getForm([
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "button"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "button"
            }
        ], true));

        // check if the first two elements belong to the same group
        expect(getAllByText(constants.BUTTON_VALUE)[0].parentElement.parentElement.className).toBe(
            getByText(constants.SUBMIT).parentElement.parentElement.className
        );

        // check if the first and the last element do not belong to the same group
        expect(getAllByText(constants.BUTTON_VALUE)[ 1 ].parentElement.parentElement).not.toBe(
            getByText(constants.SUBMIT).parentElement.parentElement
        );

    });
    test("Test if a field inside a group is working fine", async () => {

        const {
            getByText,
            getByPlaceholderText,
            getByDisplayValue,
            findByDisplayValue,
            findByText
        } = render(getForm([
            {
                isDefault: true,
                isRequired: true,
                isValue: true,
                type: "text"
            },
            {
                isDefault: false,
                isRequired: false,
                isValue: true,
                type: "submit"
            }
        ], true));

        // check if the label is displayed
        expect(getByText(constants.TEXT_BOX_LABEL)).toBeInTheDocument();

        // check if the text box with the mentioned placeholder value is displayed
        const textBox = getByPlaceholderText(constants.TEXT_BOX_PLACEHOLDER);

        expect(textBox).toBeInTheDocument();

        // check if the submit button is displayed
        expect(getByText(constants.SUBMIT)).toBeInTheDocument();

        // check if the text box with the mentioned value is displayed
        expect(getByDisplayValue(constants.TEXT_BOX_VALUE)).toBeInTheDocument();

        // check if the value of the text box changes
        constants.listen.mockReset();
        const NEW_VALUE = "new value";

        fireEvent.change(textBox, { target: { value: NEW_VALUE } });
        expect(await findByDisplayValue(NEW_VALUE)).toBeInTheDocument();

        // check if the listen function was called
        await waitFor(() => {
            expect(constants.listen).toHaveBeenCalledTimes(1);
            expect(constants.listen.mock.calls[ 0 ][ 0 ].get(constants.TEXT_BOX_NAME)).toBe(NEW_VALUE);
        });

        // check if required error message is correctly displayed
        fireEvent.change(textBox, { target: { value: "" } });
        fireEvent.blur(textBox);
        fireEvent.click(getByText(constants.SUBMIT));
        expect(await findByText(constants.TEXT_BOX_REQUIRED_MESSAGE)).toBeInTheDocument();

        // check if validation is working fine
        fireEvent.change(textBox, { target: { value: "wrong value" } });
        fireEvent.blur(textBox);
        fireEvent.click(getByText(constants.SUBMIT));
        expect(await findByText(constants.TEXT_BOX_VALIDATION_FAILED)).toBeInTheDocument();

        // check if submit is working fine
        fireEvent.change(textBox, { target: { value: constants.TEXT_BOX_VALID_MESSAGE } });
        fireEvent.blur(textBox);

        constants.onSubmit.mockReset();
        fireEvent.click(getByText(constants.SUBMIT));

        await waitFor(() => {
            expect(constants.onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(constants.onSubmit.mock.calls[ 0 ][ 0 ].get(constants.TEXT_BOX_NAME))
            .toBe(constants.TEXT_BOX_VALID_MESSAGE);
    });
});
