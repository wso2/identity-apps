/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { Form } from "semantic-ui-react";
import constants from "./constants";
import { Field, Forms } from "../../src";
import { GroupFields } from "../components";
import { FormField, Type, Validation } from "../models";

export interface FormTestFields {
    isRequired: boolean;
    isDefault: boolean;
    isValue: boolean;
    type: Type;
}

const getForm = (testFields: FormTestFields[], isGroup?: boolean): JSX.Element => {
    const form = {
        button: {
            onClick: constants.onClick,
            type: "button" as const,
            value: constants.BUTTON_VALUE
        },
        checkbox: {
            children: [
                {
                    label: constants.CHECKBOX_CHILD_1_LABEL,
                    value: constants.CHECKBOX_CHILD_1_VALUE
                },
                {
                    label: constants.CHECKBOX_CHILD_2_LABEL,
                    value: constants.CHECKBOX_CHILD_2_VALUE
                },
                {
                    label: constants.CHECKBOX_CHILD_3_LABEL,
                    value: constants.CHECKBOX_CHILD_3_VALUE
                }
            ],
            label: constants.CHECKBOX_LABEL,
            listen: (value) => { constants.listen(value); },
            name: constants.CHECKBOX_NAME,
            required: true,
            requiredErrorMessage: constants.CHECKBOX_REQUIRED_MESSAGE,
            type: "checkbox" as const,
            value: constants.CHECKBOX_VALUE
        },
        custom: {
            element: constants.CUSTOM_ELEMENT,
            type: "custom" as const
        },
        divider: {
            hidden: true,
            type: "divider" as const
        },
        dropdown: {
            children: [
                {
                    key: constants.DROPDOWN_CHILD_1_KEY,
                    text: constants.DROPDOWN_CHILD_1_VALUE,
                    value: constants.DROPDOWN_CHILD_1_VALUE
                },
                {
                    key: constants.DROPDOWN_CHILD_2_KEY,
                    text: constants.DROPDOWN_CHILD_2_VALUE,
                    value: constants.DROPDOWN_CHILD_2_VALUE
                }
            ],
            default: constants.DROPDOWN_DEFAULT,
            label: constants.DROPDOWN_LABEL,
            listen: (value) => { constants.listen(value); },
            name: constants.DROPDOWN_NAME,
            placeholder: constants.DROPDOWN_PLACEHOLDER,
            required: true,
            requiredErrorMessage: constants.DROPDOWN_REQUIRED_MESSAGE,
            type: "dropdown" as const, value: constants.DROPDOWN_VALUE
        },
        password: {
            generatePassword: constants.GENERATE_PASSWORD,
            hidePassword: constants.HIDE_PASSWORD,
            label: constants.PASSWORD_LABEL,
            listen: (value) => { constants.listen(value); },
            name: constants.PASSWORD_NAME,
            placeholder: constants.PASSWORD_PLACEHOLDER,
            required: true,
            requiredErrorMessage: constants.PASSWORD_REQUIRED_MESSAGE,
            showPassword: constants.SHOW_PASSWORD,
            type: "password" as const,
            validation: (value: string, validation: Validation) => {
                if (value !== constants.PASSWORD_VALID_MESSAGE) {
                    validation.isValid = false;
                    validation.errorMessages.push(
                        constants.PASSWORD_VALIDATION_FAILED
                    );
                }
            },
            value: constants.PASSWORD_VALUE,
            width: 15 as const
        },
        radio: {
            children: [
                {
                    label: constants.RADIO_CHILD_1_LABEL,
                    value: constants.RADIO_CHILD_1_VALUE
                },
                {
                    label: constants.RADIO_CHILD_2_LABEL,
                    value: constants.RADIO_CHILD_2_VALUE
                }
            ],
            default: constants.RADIO_DEFAULT,
            label: constants.RADIO_LABEL,
            listen: (value) => { constants.listen(value); },
            name: constants.RADIO_NAME,
            type: "radio" as const,
            value: constants.RADIO_VALUE
        },
        reset: {
            type: "reset" as const,
            value: constants.RESET_VALUE
        },
        submit: {
            type: "submit" as const,
            value: constants.SUBMIT
        },
        text: {
            label: constants.TEXT_BOX_LABEL,
            listen: (value) => { constants.listen(value); },
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
        }
    };

    const formFields: FormField[] = [];

    testFields.forEach((testField) => {
        const tempFormField = form[testField.type];

        if (tempFormField.required) {
            testField.isRequired ? tempFormField.required = true : tempFormField.required = false;
        }
        if (tempFormField.default && !testField.isDefault) {
            delete tempFormField.default;
        }
        if (tempFormField.value && !testField.isValue) {
            delete tempFormField.value;
        }
        formFields.push(tempFormField);
    });

    return (
        <Forms onSubmit={ (value) => constants.onSubmit(value) }>
            {
                isGroup
                    ? (
                        <>
                            <GroupFields wrapper={ Form.Group } wrapperProps={ { inline: true } }>
                                <Field { ...formFields[0] } />
                                <Field { ...formFields[1] } />
                            </GroupFields>
                            <Field { ...formFields[2] } />

                        </>
                    )
                    : formFields.map((formField, index) => {
                        return <Field key={ index } { ...formField } />;
                    })
            }
        </Forms>
    );

};

export default getForm;
