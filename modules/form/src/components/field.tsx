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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Hint, MessageWithIcon } from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { FieldProps, Field as FinalFormField } from "react-final-form";
import { Grid } from "semantic-ui-react";
import {
    ButtonAdapter,
    CopyFieldAdapter,
    PasswordFieldAdapter,
    TextAreaAdapter,
    TextFieldAdapter,
    ToggleAdapter
} from "./adapters";
import { FormFieldMessage } from "../models";
import { getValidation } from "../utils";

export interface FormFieldPropsInterface extends FieldProps<any,any,any>, TestableComponentInterface {
    /**
     * Aria label for the field.
     */
    ariaLabel: string;
    /**
     * Type of the form field.
     */
    fieldType: "default" | "identifier" | "name" | "resourceName" | "email" | "url" | "copy-input" |
        "password" | "phoneNumber" | "primary-btn" | "cancel-btn" | "danger-btn" | "secondary-btn" |
        "link-btn";
    /**
     * Hint of the form field.
     */
    hint?: string;
    /**
     * Max length of the input.
     */
    maxLength?: number;
    /**
     * Regex pattern to validate the input against.
     */
    pattern?: string;
    /**
     * Message to be displayed.
     */
    message?: FormFieldMessage;
    /**
     * Validation of the field.
     */
    validation?: any;
}

/**
 * Implementation of the Form Field component.
 * @param props
 */
export const Field = (props: FormFieldPropsInterface): ReactElement => {

    const {
        fieldType,
        hint,
        maxLength,
        message,
        validation,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const required = value => (value ? undefined : 'Required');

    const formFieldGenerator = (): ReactElement => {
        if (props.type === "text") {
            if (fieldType == "password") {
                return (
                    <FinalFormField
                        { ...rest }
                        key={ testId }
                        type="password"
                        name={ props.name }
                        component={ PasswordFieldAdapter }
                        validate={ (value,allValues, meta) =>
                            getValidation(value, props.type, fieldType, validation, props.required)
                        }
                    />
                );
            } else if (fieldType == "copy-input") {
                return (
                    <FinalFormField
                        { ...rest }
                        key={ testId }
                        type="text"
                        name={ props.name }
                        component={ CopyFieldAdapter }
                        validate={ (value,allValues, meta) =>
                            getValidation(value, props.type, fieldType, validation, props.required)
                        }
                    />
                );
            } else {
                return (
                    <FinalFormField
                        key={ testId }
                        type="text"
                        name={ props.name }
                        component={ TextFieldAdapter }
                        validate={ required }
                        { ...props }
                    />
                );
            }
        } else if (props.type === "textarea") {
            return (
                <FinalFormField
                    { ...rest }
                    key={ testId }
                    type="textarea"
                    name={ props.name }
                    component={ TextAreaAdapter }
                    validate={ (value,allValues, meta) =>
                        getValidation(value, props.type, fieldType, validation, props.required)
                    }
                />
            );
        } else if (props.type === "toggle") {
            return (
                <FinalFormField
                    { ...rest }
                    key={ testId }
                    type="checkbox"
                    name={ props.name }
                    component={ ToggleAdapter }
                    validate={ (value,allValues, meta) =>
                        getValidation(value, props.type, fieldType, validation, props.required)
                    }
                />
            );
        } else if (props.type === "button") {
            return (
                <FinalFormField
                    key={ testId }
                    name={ props.name }
                    component={ ButtonAdapter }
                    { ...props }
                />
            );
        }
    };

    const resolveFormFieldMessage = () => {
        switch (props.message.type) {
            case "info":
                return (
                    <MessageWithIcon
                        type={ props.message.type }
                        content={ props.message.content }
                        header={ props.message.header }
                    />
                );
        }
    };

    return (
        <>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ props.width }>
                        { formFieldGenerator() }
                        {
                            props.hint && (
                                <Hint>
                                    { props.hint }
                                </Hint>
                            )
                        }
                        {
                            props.message && (
                                resolveFormFieldMessage()
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

/**
 * Default props for the component.
 */
Field.defaultProps = {
    fieldType: "default",
    maxLength: 50,
    width: 10
};
