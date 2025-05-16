/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import { Hint, Message } from "@wso2is/react-components";
import { FieldState } from "final-form";
import React, { ReactElement } from "react";
import { Field as FinalFormField } from "react-final-form";
import {
    CopyFieldAdapter,
    PasswordFieldAdapter,
    TextFieldWithAdornmentAdapter,
    __DEPRECATED__TextFieldAdapter
} from "./adapters/__DEPRECATED__adapters";
import { FormFieldPropsInterface } from "./field";
import { FieldInputTypes, FormFieldMessage } from "../models";
import { getValidation } from "../utils";

export interface FieldInputPropsInterface extends FormFieldPropsInterface {
    /**
     * Type of the input field.
     */
    inputType: "default"
        | "identifier"
        | "text"
        | "name"
        | "number"
        | "resource_name"
        | "client_id"
        | "description"
        | "email"
        | "url"
        | "copy_input"
        | "password"
        | "phoneNumber"
        | "roleName"
        | "text_with_adornment";
    /**
     * Hint of the form field.
     */
    hint?: string | ReactElement;
    /**
     * Max length of the input.
     */
    maxLength: number;
    /**
     * Minimum length of the input.
     */
    minLength: number;
    /**
     * Message to be displayed.
     */
    message?: FormFieldMessage;
    /**
     * Validation of the field.
     */
    validation?: any;
    /**
     * Call back to trigger on input onChange.
     */
    listen?: (values) => void;
}

/**
 * Implementation of the Input Field component.
 * @param props - Props injected to the component.
 */
export const FieldInput = (props: FieldInputPropsInterface): ReactElement => {

    const {
        inputType,
        validation,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const inputFieldGenerator = () => {
        if (inputType == FieldInputTypes.INPUT_PASSWORD) {
            return (
                <FinalFormField
                    key={ testId }
                    type="password"
                    name={ props.name }
                    parse={ (value: any) => value }
                    component={ PasswordFieldAdapter }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, "password", props.required, inputType, validation)
                    }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_COPY) {
            return (
                <FinalFormField
                    key={ testId }
                    type="text"
                    name={ props.name }
                    parse={ (value: any) => value }
                    component={ CopyFieldAdapter }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, "text", props.required, inputType, validation)
                    }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_NUMBER) {
            return (
                <FinalFormField
                    key={ testId }
                    type="number"
                    name={ props.name }
                    parse={ (value: any) => value }
                    component={ __DEPRECATED__TextFieldAdapter }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, "text", props.required, inputType, validation)
                    }
                    { ...rest }
                />
            );
        } else if (inputType == FieldInputTypes.INPUT_TEXT_WITH_ADORNMENT) {
            return (
                <FinalFormField
                    key={ testId }
                    type="text"
                    name={ props.name }
                    parse={ (value: any) => value }
                    component={ TextFieldWithAdornmentAdapter }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, "text", props.required, inputType, validation)
                    }
                    { ...props }
                />
            );
        }
        else {
            return (
                <FinalFormField
                    key={ testId }
                    type="text"
                    name={ props.name }
                    parse={ (value: any) => value }
                    component={ __DEPRECATED__TextFieldAdapter }
                    validate={ (value: any, allValues: Record<string, unknown>, meta: FieldState<any>) =>
                        getValidation(value, allValues, meta, "text", props.required, inputType, validation)
                    }
                    { ...props }
                />
            );
        }
    };

    const resolveInputFieldMessage = () => {
        switch (props.message.type) {
            case "info":
                return (
                    <Message
                        type={ props.message.type }
                        content={ props.message.content }
                        header={ props.message.header }
                    />
                );
            case "warning":
                return (
                    <Message
                        type={ props.message.type }
                        content={ props.message.content }
                        header={ props.message.header }
                    />
                );
            case "error":
                return (
                    <Message
                        type={ props.message.type }
                        content={ props.message.content }
                        header={ props.message.header }
                    />
                );
        }
    };

    return (
        <>
            { inputFieldGenerator() }
            {
                props.hint && (
                    <Hint compact>
                        { props.hint }
                    </Hint>
                )
            }
            {
                props.message && (
                    resolveInputFieldMessage()
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
FieldInput.defaultProps = {
    inputType: "default",
    maxLength: 50,
    minLength: 3,
    type: FieldInputTypes.INPUT_DEFAULT,
    width: 16
};
