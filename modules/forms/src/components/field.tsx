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

import React from "react";
import { Button, Divider, Form, Radio, TextArea } from "semantic-ui-react";
import {
    isButtonField,
    isCheckBoxField,
    isCustomField,
    isDivider,
    isDropdownField,
    isPasswordField,
    isRadioField,
    isResetField,
    isSubmitField,
    isTextField
} from "../helpers";
import { FormField, FormValue, RadioChild } from "../models";
import { Password } from "./password";

/**
 * prop types for the Field component
 */
interface InnerFieldPropsInterface {
    passedProps: FormField;
    formProps: {
        checkError: (inputField: FormField) => { isError: boolean, errorMessages: string[] };
        handleBlur: (event: React.KeyboardEvent, name: string) => void;
        handleChange: (value: string, name: string) => void;
        handleChangeCheckBox: (value: string, name: string) => void;
        handleReset: (event: React.MouseEvent) => void;
        form: Map<string, FormValue>;
    };
}

/**
 * This produces a InnerField component
 * @param props
 */
export const InnerField = (props: InnerFieldPropsInterface): JSX.Element => {

    const {
        passedProps,
        formProps,
    } = props;

    const formField: FormField = { ...passedProps };

    const { checkError, handleBlur, handleChange, handleChangeCheckBox, handleReset, form } = formProps;

    /**
     * Generates a semantic Form element
     * @param inputField
     */
    const formFieldGenerator = (inputField: FormField): JSX.Element => {

        const { isError, errorMessages } = checkError(inputField);

        if (isTextField(inputField)) {
            if (isPasswordField(inputField)) {
                return (
                    <Password
                        label={ inputField.label }
                        width={ inputField.width }
                        error={
                            isError
                                ? {
                                    content: errorMessages.map((errorMessage, index) => {
                                        return <p key={ index }>{ errorMessage }</p>;
                                    })
                                }
                                : false
                        }
                        type={ inputField.type }
                        placeholder={ inputField.placeholder }
                        name={ inputField.name }
                        value={ (form.get(inputField.name) as string) || "" }
                        onBlur={ (event: React.KeyboardEvent) => {
                            handleBlur(event, inputField.name);
                        } }
                        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(event.currentTarget.value, inputField.name);
                        } }
                        showPassword={ inputField.showPassword }
                        hidePassword={ inputField.hidePassword }
                        autoFocus={ inputField.autoFocus || false }
                    />
                );
            } else {
                return (
                    <>
                        { inputField.type === "textarea" && <label>{ inputField.label }</label> }
                        <Form.Input
                            label={ inputField.label }
                            width={ inputField.width }
                            error={
                                isError
                                    ? {
                                        content: errorMessages.map((errorMessage: string, index: number) => {
                                            return <p key={ index }>{ errorMessage }</p>;
                                        })
                                    }
                                    : false
                            }
                            as={ inputField.type === "textarea" ? TextArea : undefined }
                            type={ inputField.type }
                            placeholder={ inputField.placeholder }
                            name={ inputField.name }
                            value={ form.get(inputField.name) || "" }
                            onBlur={ (event: React.KeyboardEvent) => {
                                handleBlur(event, inputField.name);
                            } }
                            onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(event.target.value, inputField.name);
                            } }
                            autoFocus={ inputField.autoFocus || false }
                        />
                    </>
                );
            }
        } else if (isSubmitField(inputField)) {
            return (
                <Button
                    primary={ true }
                    size={ inputField.size }
                    className={ inputField.className }
                    type={ inputField.type }
                    disabled={ inputField.disabled ? inputField.disabled(form) : false }
                >
                    { inputField.value }
                </Button>
            );
        } else if (isResetField(inputField)) {
            return (
                <Button
                    size={ inputField.size }
                    className={ inputField.className }
                    onClick={ handleReset }
                    disabled={ inputField.disabled ? inputField.disabled(form) : false }
                >
                    { inputField.value }
                </Button>
            );
        } else if (isButtonField(inputField)) {
            return (
                <Button
                    size={ inputField.size }
                    className={ inputField.className }
                    floated={ inputField.floated }
                    icon={ inputField.icon }
                    onClick={ (event) => {
                        event.preventDefault();
                        inputField.onClick();
                    } }
                    disabled={ inputField.disabled ? inputField.disabled(form) : false }
                >
                    { inputField.value }
                </Button>
            );
        } else if (isDivider(inputField)) {
            return <Divider hidden={ inputField.hidden } />;
        } else if (isCustomField(inputField)) {
            return inputField.element;
        } else if (isRadioField(inputField)) {
            return (
                <Form.Group grouped={ true }>
                    <label>{ inputField.label }</label>
                    { inputField.children.map((radio: RadioChild, index: number) => {
                        return (
                            <Form.Field key={ index }>
                                <Radio
                                    label={ radio.label }
                                    name={ inputField.name }
                                    value={ radio.value }
                                    checked={ form.get(inputField.name) === radio.value }
                                    onChange={ (event: React.ChangeEvent<HTMLInputElement>, { value }) => {
                                        handleChange(value.toString(), inputField.name);
                                    } }
                                    onBlur={ (event: React.KeyboardEvent) => {
                                        handleBlur(event, inputField.name);
                                    } }
                                    autoFocus={ inputField.autoFocus || false }
                                />
                            </Form.Field>
                        );
                    }) }
                </Form.Group>
            );
        } else if (isDropdownField(inputField)) {
            return (
                <Form.Select
                    label={ inputField.label }
                    placeholder={ inputField.placeholder }
                    options={ inputField.children }
                    value={ form.get(inputField.name) }
                    width={ inputField.width }
                    onChange={ (event: React.ChangeEvent<HTMLInputElement>, { value }) => {
                        handleChange(value.toString(), inputField.name);
                    } }
                    onBlur={ (event: React.KeyboardEvent) => {
                        handleBlur(event, inputField.name);
                    } }
                    error={
                        isError
                            ? {
                                content: errorMessages.map((errorMessage: string, index: number) => {
                                    return <p key={ index }>{ errorMessage }</p>;
                                })
                            }
                            : false
                    }
                    autoFocus={ inputField.autoFocus || false }
                />
            );
        } else if (isCheckBoxField(inputField)) {
            return (
                <Form.Group grouped={ true }>
                    <label>{ inputField.label }</label>
                    { inputField.children.map((checkbox, index) => {
                        return (
                            <Form.Field key={ index }>
                                <Form.Checkbox
                                    label={ checkbox.label }
                                    name={ inputField.name }
                                    value={ checkbox.value }
                                    checked={
                                        form.get(inputField.name) &&
                                        (form.get(inputField.name) as string[]).includes(checkbox.value)
                                    }
                                    onChange={ (event: React.ChangeEvent<HTMLInputElement>, { value }) => {
                                        handleChangeCheckBox(value.toString(), inputField.name);
                                    } }
                                    onBlur={ (event: React.KeyboardEvent) => {
                                        handleBlur(event, inputField.name);
                                    } }
                                    error={
                                        index === 0
                                            ? isError
                                                ? {
                                                    content: errorMessages.map(
                                                        (errorMessage: string, indexError: number) => {
                                                            return <p key={ indexError }>{ errorMessage }</p>;
                                                        }
                                                    ),
                                                    pointing: "left"
                                                }
                                                : false
                                            : isError
                                    }
                                    autoFocus={ inputField.autoFocus || false }
                                />
                            </Form.Field>
                        );
                    }) }
                </Form.Group>
            );
        }
    };
    return (
        <Form.Field>{ formFieldGenerator(formField) }</Form.Field>
    );
};
