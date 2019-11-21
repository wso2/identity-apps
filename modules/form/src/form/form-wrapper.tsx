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

import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Radio } from "semantic-ui-react";
import {
    CheckboxField,
    CustomField,
    DropdownField,
    Error,
    FormButton,
    FormDivider,
    FormField,
    FormSubmit,
    FormValue,
    Group,
    InputField,
    PasswordField,
    RadioChild,
    RadioField,
    Reset,
    Validation
} from "../models";
import { Password } from "./password";

/**
 * Prop types for Form component
 */
interface FormProps {
    formFields: FormField[];
    groups?: Group[];
    onSubmit: (values: Map<string, FormValue>) => void;
    triggerReset?: (reset: () => void) => void;
}

/**
 * This is a Form wrapper component
 */
export const FormWrapper: React.FunctionComponent<FormProps> = (props: FormProps): JSX.Element => {
    const { formFields, onSubmit, groups, triggerReset } = props;

    const [form, setForm] = useState(new Map<string, FormValue>());
    const [validFields, setValidFields] = useState(new Map<string, Validation>());
    const [requiredFields, setRequiredFields] = useState(new Map<string, boolean>());
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Initializes the state of the from every time the passed formFields prop changes
     */
    useEffect(() => {
        init(false);
    }, [formFields]);

    /**
     * passes the reset function as an argument into the triggerReset prop method
     */
    useEffect(() => {
        if (triggerReset) {
            triggerReset(reset);
        }
        return () => {
            if (triggerReset) {
                triggerReset(() => undefined);
            }
        };
    }, []);

    /**
     * Initialize form
     * @param {boolean} isReset
     */
    const init = (isReset: boolean) => {
        const tempForm: Map<string, FormValue> = new Map(form);
        const tempRequiredFields: Map<string, boolean> = new Map(requiredFields);
        const tempValidFields: Map<string, Validation> = new Map(validFields);

        formFields.forEach((inputField: InputField) => {
            if (isInputField(inputField)) {
                if (!tempForm.has(inputField.name) || isReset) {
                    inputField.value && !isReset
                        ? tempForm.set(inputField.name, inputField.value)
                        : (isRadioField(inputField) || isDropdownField(inputField)) && inputField.default
                            ? tempForm.set(inputField.name, inputField.default)
                            : isCheckBoxField(inputField)
                                ? tempForm.set(inputField.name, [])
                                : tempForm.set(inputField.name, "");
                }

                ((!inputField.value && (!tempForm.get(inputField.name) || !(tempForm.get(inputField.name).length > 0)))
                    || isReset) && inputField.required
                    ? tempRequiredFields.set(inputField.name, false)
                    : tempRequiredFields.set(inputField.name, true);
                tempValidFields.set(name, { isValid: true, errorMessages: [] });
            }
        });

        if (!isReset) {
            setRequiredFields(tempRequiredFields);
        }
        setForm(tempForm);
    };

    /**
     * Type guard to check if an input element is a text field
     * @param toBeDetermined
     */
    const isTextField = (toBeDetermined: FormField): toBeDetermined is InputField | PasswordField => {
        return (toBeDetermined as InputField).type === "email"
            || (toBeDetermined as PasswordField).type === "password"
            || (toBeDetermined as InputField).type === "number"
            || (toBeDetermined as InputField).type === "text"
            || (toBeDetermined as InputField).type === "textarea";

    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isRadioField = (toBeDetermined: FormField): toBeDetermined is RadioField => {
        return (toBeDetermined as RadioField).type === "radio";

    };

    /**
     * Type guard to check if an input element is of the type Password
     * @param toBeDetermined
     */
    const isPasswordField = (toBeDetermined: FormField): toBeDetermined is PasswordField => {
        return (toBeDetermined as PasswordField).type === "password";

    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isDropdownField = (toBeDetermined: FormField): toBeDetermined is DropdownField => {
        return (toBeDetermined as DropdownField).type === "dropdown";

    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isCheckBoxField = (toBeDetermined: FormField): toBeDetermined is CheckboxField => {
        return (toBeDetermined as CheckboxField).type === "checkbox";

    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isSubmitField = (toBeDetermined: FormField): toBeDetermined is FormSubmit => {
        return (toBeDetermined as FormSubmit).type === "submit";

    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isResetField = (toBeDetermined: FormField): toBeDetermined is Reset => {
        return (toBeDetermined as Reset).type === "reset";
    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isButtonField = (toBeDetermined: FormField): toBeDetermined is FormButton => {
        return (toBeDetermined as FormButton).type === "button";
    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isDivider = (toBeDetermined: FormField): toBeDetermined is FormDivider => {
        return (toBeDetermined as FormDivider).type === "divider";
    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isCustomField = (toBeDetermined: FormField): toBeDetermined is CustomField => {
        return (toBeDetermined as CustomField).type === "custom";
    };

    /**
     * Checks if the field is an input/checkbox/dropdown/radio/password field
     * @param toBeDetermined
     */
    const isInputField = (toBeDetermined: FormField): toBeDetermined is
        InputField
        | CheckboxField
        | DropdownField
        | RadioField
        | PasswordField => {
        return isTextField(toBeDetermined)
            || isCheckBoxField(toBeDetermined)
            || isDropdownField(toBeDetermined)
            || isRadioField(toBeDetermined);
    };

    /**
     * Handler for the onChange event
     * @param value
     * @param name
     */
    const handleChange = (value: string, name: string) => {
        const tempForm: Map<string, FormValue> = new Map(form);

        tempForm.set(name, value);
        setForm(tempForm);
    };

    /**
     * Handler for the onChange event of checkboxes
     * @param value
     * @param name
     */
    const handleChangeCheckBox = (value: string, name: string) => {
        const tempForm: Map<string, FormValue> = new Map(form);
        const selectedItems: string[] = tempForm.get(name) as string[];

        let itemIndex = -1;
        selectedItems.forEach((item, index) => {
            if (item === value) {
                itemIndex = index;
            }
        });
        itemIndex === -1 ? selectedItems.push(value) : selectedItems.splice(itemIndex, 1);
        tempForm.set(name, selectedItems);
        setForm(tempForm);
    };

    /**
     * Handler for the onBlur event
     * @param event
     * @param name
     */
    const handleBlur = (event: React.KeyboardEvent, name: string) => {
        const tempRequiredFields: Map<string, boolean> = new Map(requiredFields);
        const tempValidFields: Map<string, Validation> = new Map(validFields);

        validate(name, tempRequiredFields, tempValidFields);

        setValidFields(tempValidFields);
        setRequiredFields(tempRequiredFields);
    };

    /**
     * This function checks if a form field is valid
     * @param name
     * @param requiredFieldsParam
     * @param validFieldsParam
     */
    const validate = (
        name: string,
        requiredFieldsParam: Map<string, boolean>,
        validFieldsParam: Map<string, Validation>
    ) => {
        const inputField: FormField = formFields.find((formField) => {
            return isInputField(formField) && formField.name === name;
        });

        if (!isCheckBoxField(inputField)) {
            form.get(name) !== null && form.get(name) !== ""
                ? requiredFieldsParam.set(name, true)
                : requiredFieldsParam.set(name, false);
        } else {
            form.get(name) !== null && form.get(name).length > 0
                ? requiredFieldsParam.set(name, true)
                : requiredFieldsParam.set(name, false);
        }

        const validation: Validation = {
            errorMessages: [],
            isValid: true
        };

        if (
            isTextField(inputField)
            && inputField.validation
        ) {
            inputField.validation(form.get(name) as string, validation, new Map(form));
        }

        validFieldsParam.set(name, {
            errorMessages: validation.errorMessages,
            isValid: validation.isValid
        });
    };

    /**
     * Handler for onSubmit event
     * @param event
     */
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (checkRequiredFieldsFilled() && checkValidated()) {
            setIsSubmitting(false);
            onSubmit(form);
        } else {
            setIsSubmitting(true);
        }
    };

    /**
     * Checks if all the required fields are filled
     */
    const checkRequiredFieldsFilled = (): boolean => {
        let requiredFilled: boolean = true;
        requiredFields.forEach((requiredFieldParam) => {
            if (!requiredFieldParam) {
                requiredFilled = false;
            }
        });
        return requiredFilled;
    };

    /**
     * Checks if all the fields are validated
     */
    const checkValidated = (): boolean => {
        let isValidated: boolean = true;
        validFields.forEach((validField) => {
            if (!validField.isValid) {
                isValidated = false;
            }
        });
        return isValidated;
    };

    /**
     * Checks if the field has any errors (required but not filled | not validated)
     * @param inputField
     */
    const checkError = (inputField: FormField): Error => {
        if (isInputField(inputField)
            && !isRadioField(inputField)
            && inputField.required
            && !requiredFields.get(inputField.name)
            && isSubmitting) {
            return {
                errorMessages: [inputField.requiredErrorMessage],
                isError: true
            };
        } else if (
            isTextField(inputField) &&
            validFields.get(inputField.name) &&
            !validFields.get(inputField.name).isValid &&
            isSubmitting
        ) {
            return {
                errorMessages: validFields.get(inputField.name).errorMessages,
                isError: true
            };
        } else {
            return {
                errorMessages: [],
                isError: false
            };
        }
    };

    /**
     * Resets form
     */
    const reset = () => {
        setIsSubmitting(false);
        init(true);
    };

    /**
     * Handles reset button click
     * @param event
     */
    const handleReset = (event: React.MouseEvent) => {
        event.preventDefault();
        reset();
    };

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
                    />
                );
            } else {
                return (
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
                    />
                );
            }
        } else if (isSubmitField(inputField)) {
            return (
                <Button
                    primary={ true }
                    size={ inputField.size }
                    className={ inputField.className }
                    type={ inputField.type }
                >
                    { inputField.value }
                </Button>
            );
        } else if (isResetField(inputField)) {
            return (
                <Button size={ inputField.size } className={ inputField.className } onClick={ handleReset }>
                    { inputField.value }
                </Button>
            );
        } else if (isButtonField(inputField)) {
            return (
                <Button
                    size={ inputField.size }
                    className={ inputField.className }
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
                                />
                            </Form.Field>
                        );
                    }) }
                </Form.Group>
            );
        }
    };

    /**
     * This function renders the form
     */
    const renderForm = (): JSX.Element[] => {
        let forms: JSX.Element[] = formFields.map((inputField: FormField, index: number) => {
            return <Form.Field key={ index }>{ formFieldGenerator(inputField) }</Form.Field>;
        });

        if (groups) {
            groups.forEach((group, index) => {
                const Wrapper = group.wrapper;
                const formGroup: JSX.Element[] = forms.slice(group.startIndex, group.endIndex);
                const precedingForm: JSX.Element[] = forms.slice(0, group.startIndex);
                const succeedingForm: JSX.Element[] = forms.slice(group.endIndex);
                const enclosedGroup: JSX.Element = (
                    <Wrapper { ...group.wrapperProps } key={ index.toString() + group.endIndex } >
                        { formGroup }
                    </Wrapper>
                );
                succeedingForm.unshift(enclosedGroup);
                forms = precedingForm.concat(succeedingForm);
            });
        }

        return forms;
    };
    return <Form onSubmit={ handleSubmit }>{ renderForm() }</Form>;
};
