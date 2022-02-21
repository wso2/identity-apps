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

import React, { ReactElement } from "react";
import { FieldTestConstants } from "./constants";
import { Field, Form, FormFieldPropsInterface } from "../../components";
import { Type } from "../../models";

export interface FormTestFields extends FormFieldPropsInterface {
    isRequired: boolean;
    isDefault: boolean;
    isValue: boolean;
    type: Type;
}

const getForm = (testFields: FormTestFields[]): ReactElement => {
    const form = {
        button: {
            onClick: FieldTestConstants.onClick,
            type: "button" as const,
            value: FieldTestConstants.BUTTON_VALUE
        },
        divider: {
            hidden: true,
            type: "divider" as const
        },
        password: {
            hidePassword: FieldTestConstants.HIDE_PASSWORD,
            label: FieldTestConstants.PASSWORD_LABEL,
            listen: (value) => { FieldTestConstants.listen(value); },
            name: FieldTestConstants.PASSWORD_NAME,
            placeholder: FieldTestConstants.PASSWORD_PLACEHOLDER,
            required: true,
            requiredErrorMessage: FieldTestConstants.PASSWORD_REQUIRED_MESSAGE,
            showPassword: FieldTestConstants.SHOW_PASSWORD,
            type: "password" as const,
            validation: (value: string) => {
                if (value !== FieldTestConstants.PASSWORD_VALID_MESSAGE) {
                    return FieldTestConstants.PASSWORD_VALIDATION_FAILED;
                }
            },
            value: FieldTestConstants.PASSWORD_VALUE,
            width: 15 as const
        },
        submit: {
            type: "submit" as const,
            value: FieldTestConstants.SUBMIT
        },
        text: {
            ariaLabel: FieldTestConstants.TEXT_FIELD_ARIA_LABEL,
            fieldType: FieldTestConstants.TEXT_FIELD_TYPE_NAME,
            label: FieldTestConstants.TEXT_FIELD_LABEL,
            name: FieldTestConstants.TEXT_FIELD_NAME,
            placeholder: FieldTestConstants.TEXT_FIELD_PLACEHOLDER,
            required: true,
            type: "text" as const,
            validation: (value: string) => {
                if (value !== FieldTestConstants.TEXT_FIELD_VALID_MESSAGE) {
                    return FieldTestConstants.TEXT_FIELD_VALIDATION_FAILED;
                }
            },
            value: FieldTestConstants.TEXT_FIELD_VALUE,
            width: 15 as const
        }
    };

    const formFields: FormFieldPropsInterface[] = [];
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
        <Form uncontrolledForm onSubmit={ (value) => FieldTestConstants.onSubmit(value) }>
            {
                formFields.map((formField, index) => {
                    return (
                        <Field key={ index } { ...formField } />
                    );
                })
            }
        </Form>
    );

};

export default getForm;
