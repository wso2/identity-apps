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
import { Form } from "semantic-ui-react";
import { Field, GroupFields, InnerField, InnerGroupFields } from "./components";
import { isCheckBoxField, isDropdownField, isInputField, isRadioField, isTextField } from "./helpers/typeguards";
import {
    Error,
    FormField,
    FormValue,
    Validation
} from "./models";

/**
 * Prop types for Form component
 */
interface FormProps {
    onSubmit: (values: Map<string, FormValue>) => void;
    triggerReset?: (reset: () => void) => void;

}

/**
 * This is a Forms component
 */
export const Forms: React.FunctionComponent<React.PropsWithChildren<FormProps>> = (
    props: React.PropsWithChildren<FormProps>
): JSX.Element => {

    const { onSubmit, triggerReset, children } = props;

    const [form, setForm] = useState(new Map<string, FormValue>());
    const [validFields, setValidFields] = useState(new Map<string, Validation>());
    const [requiredFields, setRequiredFields] = useState(new Map<string, boolean>());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formFields: FormField[] = [];

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
     * Parses the children and
     * 1.passes form event handler functions as props to all the Field components
     * 2.extracts the props of the Field components
     * @param elements
     * @param fields
     */
    const parseChildren = (elements: React.ReactNode, fields: FormField[]): React.ReactElement[] => {
        return React.Children.map(elements, (element: React.ReactElement) => {
            if (element.type === Field) {
                fields.push(element.props);
                return React.createElement(InnerField, {
                    formProps: {
                        checkError,
                        form,
                        handleBlur,
                        handleChange,
                        handleChangeCheckBox,
                        handleReset
                    },
                    passedProps: { ...element.props }
                });
            } else if (element.type === GroupFields) {
                return React.createElement(InnerGroupFields, {
                    ...element.props,
                    children: parseChildren(element.props.children, fields)
                });
            } else if (element.props
                && element.props.children
                && React.Children.count(element.props.children) > 0) {
                return React.createElement(element.type, {
                    ...element.props,
                    children: parseChildren(element.props.children, fields)
                });
            } else {
                return element;
            }
        });
    };

    const mutatedChildren: React.ReactElement[] = [...parseChildren(children, formFields)];

    /**
     * Initializes the state of the from every time the passed formFields prop changes
     */
    useEffect(() => {
        init(false);
    }, [children]);

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

        formFields.forEach((inputField: FormField) => {
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
                    || isReset) && (!isRadioField(inputField) && inputField.required)
                    ? tempRequiredFields.set(inputField.name, false)
                    : tempRequiredFields.set(inputField.name, true);

                tempValidFields.set(inputField.name, { isValid: true, errorMessages: [] });
            }
        });

        if (!isReset) {
            setRequiredFields(tempRequiredFields);
        }
        setForm(tempForm);
        setValidFields(tempValidFields);
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

        if (isInputField(inputField) && !isRadioField(inputField) && inputField.required) {
            if (!isCheckBoxField(inputField)) {
                form.get(name) !== null && form.get(name) !== ""
                    ? requiredFieldsParam.set(name, true)
                    : requiredFieldsParam.set(name, false);
            } else {
                form.get(name) !== null && form.get(name).length > 0
                    ? requiredFieldsParam.set(name, true)
                    : requiredFieldsParam.set(name, false);
            }
        }

        const validation: Validation = {
            errorMessages: [],
            isValid: true
        };

        if (
            isTextField(inputField)
            && inputField.validation
            && !(form.get(name) === null || form.get(name) === "")
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

    return <Form onSubmit={ handleSubmit }>{ mutatedChildren }</Form>;
};
