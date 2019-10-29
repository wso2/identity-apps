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
    FormField,
    FormSubmit,
    FormValue,
    Group,
    Ibutton,
    Idivider,
    InputField,
    RadioChild,
    RadioField,
    Reset,
    Validation
} from "../../../models";
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
     * Initializes the state of the from everytime the passed formFields prop changes
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

                ((!inputField.value && !tempForm.get(inputField.name)) || isReset) && inputField.required
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
     * Type guard to check if an input element is not of the type submit/reset/button
     * @param toBeDetermined
     */
    const isInputField = (toBeDetermined: FormField): toBeDetermined is InputField => {
        if (
            (toBeDetermined as InputField).type !== "submit" &&
            (toBeDetermined as InputField).type !== "reset" &&
            (toBeDetermined as InputField).type !== "button" &&
            (toBeDetermined as InputField).type !== "divider" &&
            (toBeDetermined as InputField).type !== "custom"
        ) {
            return true;
        }
        return false;
    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isRadioField = (toBeDetermined: FormField): toBeDetermined is RadioField => {
        if ((toBeDetermined as RadioField).type === "radio") {
            return true;
        }
        return false;
    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isDropdownField = (toBeDetermined: FormField): toBeDetermined is DropdownField => {
        if ((toBeDetermined as DropdownField).type === "dropdown") {
            return true;
        }
        return false;
    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isCheckBoxField = (toBeDetermined: FormField): toBeDetermined is CheckboxField => {
        if ((toBeDetermined as CheckboxField).type === "checkbox") {
            return true;
        }
        return false;
    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isSubmitField = (toBeDetermined: FormField): toBeDetermined is FormSubmit => {
        if ((toBeDetermined as FormSubmit).type === "submit") {
            return true;
        }
        return false;
    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isResetField = (toBeDetermined: FormField): toBeDetermined is Reset => {
        if ((toBeDetermined as Reset).type === "reset") {
            return true;
        }
        return false;
    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isButtonField = (toBeDetermined: FormField): toBeDetermined is Ibutton => {
        if ((toBeDetermined as Ibutton).type === "button") {
            return true;
        }
        return false;
    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isDivider = (toBeDetermined: FormField): toBeDetermined is Idivider => {
        if ((toBeDetermined as Idivider).type === "divider") {
            return true;
        }
        return false;
    };

    /**
     * Type guard to check if an input element is of the type Radio
     * @param toBeDetermined
     */
    const isCustomField = (toBeDetermined: FormField): toBeDetermined is CustomField => {
        if ((toBeDetermined as CustomField).type === "custom") {
            return true;
        }
        return false;
    };

    /**
     * Handler for the onChange event
     * @param event
     * @param index
     */
    const handleChange = (value: string, name: string) => {
        const tempForm: Map<string, FormValue> = new Map(form);

        tempForm.set(name, value);
        setForm(tempForm);
    };

    /**
     * Handler for the onChange event of checkboxes
     * @param event
     * @param index
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
     * @param requiredFields
     * @param validFields
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
            isInputField(inputField) &&
            !isRadioField(inputField) &&
            !isCheckBoxField(inputField) &&
            !isDropdownField(inputField) &&
            inputField.validation
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
        if (isInputField(inputField) && inputField.required && !requiredFields.get(inputField.name) && isSubmitting) {
            return {
                errorMessages: [inputField.requiredErrorMessage],
                isError: true
            };
        } else if (
            isInputField(inputField) &&
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
        if (isInputField(inputField)) {
            if (inputField.type === "password") {
                return (
                    <Password
                        label={inputField.label}
                        width={inputField.width}
                        error={
                            isError
                                ? {
                                      content: errorMessages.map((errorMessage, index) => {
                                          return <p key={index}>{errorMessage}</p>;
                                      })
                                  }
                                : false
                        }
                        type={inputField.type}
                        placeholder={inputField.placeholder}
                        name={inputField.name}
                        value={(form.get(inputField.name) as string) || ""}
                        onBlur={(event: React.KeyboardEvent) => {
                            handleBlur(event, inputField.name);
                        }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(event.currentTarget.value, inputField.name);
                        }}
                    />
                );
            } else if (isRadioField(inputField)) {
                return (
                    <Form.Group grouped>
                        <label>{inputField.label}</label>
                        {inputField.children.map((radio: RadioChild, index: number) => {
                            return (
                                <Form.Field key={index}>
                                    <Radio
                                        label={radio.label}
                                        name={inputField.name}
                                        value={radio.value}
                                        checked={form.get(inputField.name) === radio.value}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>, { value }) => {
                                            handleChange(value.toString(), inputField.name);
                                        }}
                                        onBlur={(event: React.KeyboardEvent) => {
                                            handleBlur(event, inputField.name);
                                        }}
                                    />
                                </Form.Field>
                            );
                        })}
                    </Form.Group>
                );
            } else if (isDropdownField(inputField)) {
                return (
                    <Form.Select
                        label={inputField.label}
                        placeholder={inputField.placeholder}
                        options={inputField.children}
                        value={form.get(inputField.name)}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>, { value }) => {
                            handleChange(value.toString(), inputField.name);
                        }}
                        onBlur={(event: React.KeyboardEvent) => {
                            handleBlur(event, inputField.name);
                        }}
                        error={
                            isError
                                ? {
                                      content: errorMessages.map((errorMessage: string, index: number) => {
                                          return <p key={index}>{errorMessage}</p>;
                                      })
                                  }
                                : false
                        }
                    />
                );
            } else if (isCheckBoxField(inputField)) {
                return (
                    <Form.Group grouped>
                        <label>{inputField.label}</label>
                        {inputField.children.map((checkbox, index) => {
                            return (
                                <Form.Field key={index}>
                                    <Form.Checkbox
                                        label={checkbox.label}
                                        name={inputField.name}
                                        value={checkbox.value}
                                        checked={
                                            form.get(inputField.name) &&
                                            (form.get(inputField.name) as string[]).includes(checkbox.value)
                                        }
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>, { value }) => {
                                            handleChangeCheckBox(value.toString(), inputField.name);
                                        }}
                                        onBlur={(event: React.KeyboardEvent) => {
                                            handleBlur(event, inputField.name);
                                        }}
                                        error={
                                            index === 0
                                                ? isError
                                                    ? {
                                                          content: errorMessages.map(
                                                              (errorMessage: string, indexError: number) => {
                                                                  return <p key={indexError}>{errorMessage}</p>;
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
                        })}
                    </Form.Group>
                );
            } else {
                return (
                    <Form.Input
                        label={inputField.label}
                        width={inputField.width}
                        error={
                            isError
                                ? {
                                      content: errorMessages.map((errorMessage: string, index: number) => {
                                          return <p key={index}>{errorMessage}</p>;
                                      })
                                  }
                                : false
                        }
                        type={inputField.type}
                        placeholder={inputField.placeholder}
                        name={inputField.name}
                        value={form.get(inputField.name) || ""}
                        onBlur={(event: React.KeyboardEvent) => {
                            handleBlur(event, inputField.name);
                        }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(event.target.value, inputField.name);
                        }}
                    />
                );
            }
        } else if (isSubmitField(inputField)) {
            return (
                <Button primary size={inputField.size} className={inputField.className} type={inputField.type}>
                    {inputField.value}
                </Button>
            );
        } else if (isResetField(inputField)) {
            return (
                <Button size={inputField.size} className={inputField.className} onClick={handleReset}>
                    {inputField.value}
                </Button>
            );
        } else if (isButtonField(inputField)) {
            return (
                <Button
                    size={inputField.size}
                    className={inputField.className}
                    onClick={(event) => {
                        event.preventDefault();
                        inputField.onClick();
                    }}
                >
                    {inputField.value}
                </Button>
            );
        } else if (isDivider(inputField)) {
            return <Divider hidden={inputField.hidden} />;
        } else if (isCustomField(inputField)) {
            return inputField.element;
        }
    };

    /**
     * This function renders the form
     */
    const renderForm = (): JSX.Element[] => {
        let forms: JSX.Element[] = formFields.map((inputField: FormField, index: number) => {
            return <Form.Field key={index}>{formFieldGenerator(inputField)}</Form.Field>;
        });

        if (groups) {
            groups.forEach((group, index) => {
                const formGroup: JSX.Element[] = forms.slice(group.startIndex, group.endIndex);
                const preceedingForm: JSX.Element[] = forms.slice(0, group.startIndex);
                const succeedingForm: JSX.Element[] = forms.slice(group.endIndex);
                const enclosedGroup: JSX.Element = (
                    <Form.Group
                        key={index.toString() + group.endIndex}
                        grouped={group.style === "grouped"}
                        inline={group.style === "inline"}
                        widths={group.width}
                    >
                        {formGroup}
                    </Form.Group>
                );
                succeedingForm.unshift(enclosedGroup);
                forms = preceedingForm.concat(succeedingForm);
            });
        }

        return forms;
    };
    return <Form onSubmit={handleSubmit}>{renderForm()}</Form>;
};
