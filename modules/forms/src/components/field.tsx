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

import classNames from "classnames";
import React, { ReactElement } from "react";
import { Button, Divider, Form, Icon, Popup, Radio } from "semantic-ui-react";
import { Password } from "./password";
import { QueryParameters } from "./query-parameters";
import { Scopes } from "./scopes";
import {
    isButtonField,
    isCheckBoxField,
    isCustomField,
    isDivider,
    isDropdownField,
    isPasswordField,
    isQueryParamsField,
    isRadioField,
    isResetField,
    isScopesField,
    isSubmitField,
    isTextField,
    isToggleField
} from "../helpers";
import { FormField, FormValue, RadioChild } from "../models";
import { filterPassedProps } from "../utils";

/**
 * The enter key.
 * @constant
 * @type {string}
 */
const ENTER_KEY = "Enter";

/**
 * prop types for the Field component
 */
interface InnerFieldPropsInterface {
    passedProps: any;
    formProps: {
        checkError: (inputField: FormField) => { isError: boolean; errorMessages: string[] };
        handleBlur: (event: React.KeyboardEvent, name: string) => void;
        handleChange: (value: string, name: string) => void;
        handleToggle: (name: string) => void;
        handleChangeCheckBox: (value: string, name: string) => void;
        handleReset: (event: React.MouseEvent) => void;
        form: Map<string, FormValue>;
    };
}

/**
 * This produces a InnerField component
 * @param props
 */
export const InnerField = React.forwardRef((props: InnerFieldPropsInterface, ref: React.Ref<any>): JSX.Element => {

    const {
        passedProps,
        formProps
    } = props;

    const formField: FormField = { ...passedProps };

    const filteredProps = filterPassedProps({ ...passedProps });

    const { checkError, handleBlur, handleChange, handleToggle, handleChangeCheckBox, handleReset, form } = formProps;

    const formFieldClasses = classNames({
        hidden: formField.hidden,
        [ "read-only" ]: formField.readOnly
    }, formField.className);

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
                        { ...passedProps }
                        label={ inputField.label !== "" ? inputField.label : null }
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
                        readOnly={ inputField.readOnly }
                        disabled={ inputField.disabled }
                        required={ inputField.label ? inputField.required : false }
                        onKeyPress={ (event: React.KeyboardEvent) => {
                            event.key === ENTER_KEY && handleBlur(event, inputField.name);
                        } }
                    />
                );
            } else if (inputField.type === "textarea") {
                return (
                    <Form.TextArea
                        { ...filteredProps }
                        label={ inputField.label !== "" ? inputField.label : null }
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
                        type={ inputField.type }
                        placeholder={ inputField.placeholder }
                        name={ inputField.name }
                        value={ form.get(inputField.name)?.toString() || "" }
                        onBlur={ (event: React.KeyboardEvent) => {
                            handleBlur(event, inputField.name);
                        } }
                        onChange={ (event: React.ChangeEvent<HTMLTextAreaElement>) => {
                            handleChange(event.target.value, inputField.name);
                        } }
                        autoFocus={ inputField.autoFocus || false }
                        readOnly={ inputField.readOnly }
                        disabled={ inputField.disabled }
                        required={ inputField.label ? inputField.required : false }
                        onKeyPress={ (event: React.KeyboardEvent) => {
                            event.key === ENTER_KEY && handleBlur(event, inputField.name);
                        } }
                    />
                );
            } else {
                return (
                    <Form.Input
                        { ...filteredProps }
                        label={ inputField.label !== "" ? inputField.label : null }
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
                        readOnly={ inputField.readOnly }
                        disabled={ inputField.disabled }
                        required={ inputField.label ? inputField.required : false }
                        onKeyPress={ (event: React.KeyboardEvent) => {
                            event.key === ENTER_KEY && handleBlur(event, inputField.name);
                        } }
                        onKeyDown={ inputField.type === "number" ?
                            ((event: React.KeyboardEvent) => {
                                const isNumber = /^[0-9]$/i.test(event.key);
                                const isAllowed = ((event.key === "a" || event.key === "v" ||
                                    event.key === "c" || event.key === "x")
                                    && (event.ctrlKey === true || event.metaKey === true)) ||
                                    (event.key === "ArrowRight" || event.key == "ArrowLeft") ||
                                    (event.key === "Delete" || event.key === "Backspace");

                                !isNumber && !isAllowed && event.preventDefault();
                            }) : (): void => {
                                return;
                            }
                        }
                        onPaste={ inputField.type === "number" ?
                            ((event: React.ClipboardEvent) => {
                                const data = event.clipboardData.getData("Text") ;
                                const isNumber = /^[0-9]+$/i.test(data);

                                !isNumber && event.preventDefault();
                            }) : (): void => {
                                return;
                            }
                        }
                    />
                );
            }
        } else if (isRadioField(inputField)) {
            return (
                <Form.Group grouped={ true }>
                    { inputField.label !== "" ? <label>{ inputField.label }</label> : null }
                    { inputField.hint && <FieldHint hint={ inputField.hint }/> }
                    { inputField.children.map((radio: RadioChild, index: number) => {

                        const {
                            hint,
                            label,
                            value,
                            ...rest
                        } = radio;

                        const field = (
                            <Form.Field key={ index }>
                                <Radio
                                    { ...filteredProps }
                                    label={ label }
                                    name={ inputField.name }
                                    value={ value }
                                    checked={ form.get(inputField.name) === value }
                                    onChange={ (event: React.ChangeEvent<HTMLInputElement>, { value }) => {
                                        if (inputField?.onBefore && !inputField.onBefore(event, value)) {
                                            return;
                                        }
                                        handleChange(value.toString(), inputField.name);
                                    } }
                                    onBlur={ (event: React.KeyboardEvent) => {
                                        handleBlur(event, inputField.name);
                                    } }
                                    autoFocus={ inputField.autoFocus || false }
                                    readOnly={ inputField.readOnly }
                                    disabled={ inputField.disabled }
                                    onKeyPress={ (event: React.KeyboardEvent) => {
                                        event.key === ENTER_KEY && handleBlur(event, inputField.name);
                                    } }
                                    { ...rest }
                                />
                            </Form.Field>
                        );

                        if (hint && hint.content) {
                            return (
                                <Popup
                                    key={ `${ index }-popup` }
                                    header={ hint.header }
                                    content={ hint.content }
                                    trigger={ field }
                                />
                            );
                        } else {
                            return field;
                        }
                    }) }
                </Form.Group>
            );
        } else if (isDropdownField(inputField)) {
            return (
                <Form.Select
                    { ...filteredProps }
                    label={ inputField.label !== "" ? inputField.label : null }
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
                    disabled={ inputField.disabled }
                    required={ inputField.label ? inputField.required : false }
                    onKeyPress={ (event: React.KeyboardEvent) => {
                        event.key === ENTER_KEY && handleBlur(event, inputField.name);
                    } }
                />
            );
        } else if (isCheckBoxField(inputField)) {
            return (
                <Form.Group grouped={ true }>
                    {
                        inputField.label && inputField.required ? (
                            <div className={ "required field" }>
                                <label>{ inputField.label }</label>
                            </div>
                        ) : (
                            <div className={ "field" }>
                                <label>{ inputField.label }</label>
                            </div>
                        )
                    }
                    { inputField.hint && <FieldHint hint={ inputField.hint }/> }
                    { inputField.children.map((checkbox, index) => {
                        const field = (
                            <Form.Field key={ index }>
                                <Form.Checkbox
                                    { ...filteredProps }
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
                                    readOnly={ inputField.readOnly || checkbox.readOnly }
                                    disabled={ checkbox.disabled ?? inputField.disabled }
                                    defaultChecked={ inputField.defaultChecked }
                                    onKeyPress={ (event: React.KeyboardEvent) => {
                                        event.key === ENTER_KEY && handleBlur(event, inputField.name);
                                    } }
                                />
                            </Form.Field>
                        );

                        if (checkbox.hint && checkbox.hint.content) {
                            return (
                                <Popup
                                    key={ `${ index }-popup` }
                                    header={ checkbox.hint.header }
                                    content={ checkbox.hint.content }
                                    trigger={ field }
                                />
                            );
                        } else {
                            return field;
                        }
                    }) }
                </Form.Group>
            );
        } else if (isScopesField(inputField)) {
            return (
                <Form.Group grouped={ true }>
                    <label>
                        { inputField.label }
                        {
                            inputField.label && inputField.required
                                ? <span className="ui text color red">*</span>
                                : null
                        }
                    </label>
                    <Scopes
                        value={ inputField.value }
                        defaultValue={ inputField.defaultValue }
                        error={
                            isError
                                ? errorMessages[0] : ""
                        }
                        onBlur={ (event: React.KeyboardEvent) => {
                            handleBlur(event, inputField.name);
                        } }
                        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(event.target.value, inputField.name);
                        } }
                    />
                </Form.Group>
            );
        } else if (isQueryParamsField(inputField)) {
            return (
                <Form.Group grouped={ true }>
                    <label>
                        { inputField.label }
                        {
                            inputField.label && inputField.required
                                ? <span className="ui text color red">*</span>
                                : null
                        }
                    </label>
                    <QueryParameters
                        name={ inputField.name }
                        value={ inputField.value }
                        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(event.target.value, inputField.name);
                        } }
                    />
                </Form.Group>
            );
        } else if (isToggleField(inputField)) {
            return (
                <Form.Checkbox
                    { ...filteredProps }
                    label={ inputField.label }
                    name={ inputField.name }
                    value={ inputField.value }
                    checked={
                        form.get(inputField.name) === "true"
                    }
                    onChange={ () => {
                        handleToggle(inputField.name);
                    } }
                    onBlur={ (event: React.KeyboardEvent) => {
                        handleBlur(event, inputField.name);
                    } }
                    error={
                        isError
                            ? {
                                content: errorMessages.map(
                                    (errorMessage: string, indexError: number) => {
                                        return <p key={ indexError }>{ errorMessage }</p>;
                                    }
                                ),
                                pointing: "left"
                            }
                            : false
                    }
                    autoFocus={ inputField.autoFocus || false }
                    readOnly={ inputField.readOnly }
                    disabled={ inputField.disabled }
                    defaultChecked={ inputField.defaultChecked }
                    onKeyPress={ (event: React.KeyboardEvent) => {
                        event.key === ENTER_KEY && handleBlur(event, inputField.name);
                    } }
                />
            );
        }
        else if (isSubmitField(inputField)) {
            return (
                <Button
                    { ...filteredProps }
                    primary={ true }
                    size={ inputField.size }
                    className={ inputField.className }
                    type={ inputField.type }
                    disabled={ inputField.disabled ? inputField.disabled(form) : false }
                >
                    { inputField.icon && <Icon name={ inputField.icon }/> }
                    { inputField.value }
                </Button>
            );
        } else if (isResetField(inputField)) {
            return (
                <Button
                    { ...filteredProps }
                    size={ inputField.size }
                    className={ inputField.className }
                    onClick={ handleReset }
                    disabled={ inputField.disabled ? inputField.disabled(form) : false }
                >
                    { inputField.icon && <Icon name={ inputField.icon } /> }
                    { inputField.value }
                </Button>
            );
        } else if (isButtonField(inputField)) {
            return (
                <Button
                    { ...filteredProps }
                    size={ inputField.size }
                    className={ inputField.className }
                    onClick={ (event) => {
                        event.preventDefault();
                        inputField.onClick();
                    } }
                    disabled={ inputField.disabled ? inputField.disabled(form) : false }
                >
                    { inputField.icon && <Icon name={ inputField.icon } /> }
                    { inputField.value }
                </Button>
            );
        } else if (isDivider(inputField)) {
            return <Divider hidden={ inputField.hidden } />;
        } else if (isCustomField(inputField)) {
            return inputField.element;
        }
    };

    return (
        <Form.Field className={ formFieldClasses }>
            <div ref={ ref }>{ formFieldGenerator(formField) }</div>
        </Form.Field>
    );
});

/**
 * A component that creates a text hint. Used mainly within the
 * form fields. To see usages see {@link Checkbox} and {@link Radio}
 * conditional rendering sections in {@link InnerField}.
 *
 * @param hint {string}
 * @constructor
 */
export const FieldHint: React.FC<{ hint: string }> = ({ hint }: { hint: string }): ReactElement => {
    return (
        <div className={ "ui-hint" }>
            <Icon color="grey" floated="left" name="info circle"/>
            { hint }
        </div>
    );
};
