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

import React, { useEffect, useRef, useState } from "react";
import { Form } from "semantic-ui-react";
import { Field, GroupFields, InnerField, InnerGroupFields } from "./components";
import { isCheckBoxField, isDropdownField, isInputField,
    isRadioField, isScopesField, isTextField, isToggleField } from "./helpers";
import { Error, FormField, FormValue, Validation } from "./models";
import { useNonInitialEffect } from "./utils";

/**
 * Prop types for Form component
 */
interface FormPropsInterface {
    onSubmit?: (values: Map<string, FormValue>) => void;
    onChange?: (isPure: boolean, values: Map<string, FormValue>) => void;
    resetState?: boolean;
    submitState?: boolean;
    ref?: React.Ref<any>;
    onSubmitError?: (requiredFields: Map<string, boolean>, validFields: Map<string, Validation>) => void;
    [ key: string ]: any;
}

/**
 * This is a Forms component
 */
export const Forms: React.FunctionComponent<React.PropsWithChildren<FormPropsInterface>> =
    React.forwardRef((props: React.PropsWithChildren<FormPropsInterface>, ref): JSX.Element => {

        const { onSubmit, resetState, submitState, onChange, onSubmitError, children, ...rest } = props;

        // This holds the values of the form fields
        const [ form, setForm ] = useState(new Map<string, FormValue>());

        // This specifies if any of the fields in the form has been touched or not
        const [ isPure, setIsPure ] = useState(true);

        // This specifies if a field's value is valid or not
        const [ validFields, setValidFields ] = useState(new Map<string, Validation>());
        const validFieldsRef = useRef(new Map<string, Validation>());

        // This specifies if a field has been touched or not
        const [ touchedFields, setTouchedFields ] = useState(new Map<string, boolean>());
        const [ modifyingFields, setModifyingFields ] = useState(new Map<string, boolean>());

        // This specifies if the required fields are  filled or not
        const [ requiredFields, setRequiredFields ] = useState(new Map<string, boolean>());
        const requiredFieldsRef = useRef(new Map<string, boolean>());

        // This specifies if the `Submit` method has been called or not
        const [ isSubmitting, setIsSubmitting ] = useState(false);

        // This specifies if the submit has been clicked or not.
        const [ startSubmission, setStartSubmission ] = useState(false);

        const initialValues = useRef(new Map<string, FormValue>());

        // This specifies if a form field is currently validating or not.
        const [ isValidating, setIsValidating ] = useState(false);
        const isValidatingRef = useRef(false);

        // This holds all the form field components
        const formFields: FormField[] = [];
        const flatReactChildren: React.ReactElement[] = [];

        // The lock to be used by `initMutex`
        let locked = false;

        /**
         * Calls the onChange prop
         */
        const propagateOnChange = (formValue: Map<string, FormValue>) => {
            if (onChange && typeof onChange === "function") {
                onChange(isPure, formValue);
            }
        };

        /**
         * This function calls the listener prop of the field that is calling the `handleChange` function
         * @param name
         * @param newForm
         */
        const listener = (name: string, newForm: Map<string, FormValue>) => {
            React.Children.map(flatReactChildren, (element: React.ReactElement) => {
                if (
                    element.props.name
                    && element.props.name === name
                    && element.props.listen
                    && typeof element.props.listen === "function"
                ) {
                    element.props.listen(newForm);
                }
            });
        };

        /**
         * Handler for the onChange event
         * @param value
         * @param name
         */
        const handleChange = (value: string, name: string) => {
            const tempForm: Map<string, FormValue> = new Map(form);
            const tempTouchedFields: Map<string, boolean> = new Map(touchedFields);
            const tempModifyingFields: Map<string, boolean> = new Map(modifyingFields);

            tempForm.set(name, value);
            tempTouchedFields.set(name, true);
            tempModifyingFields.set(name, true);
            listener(name, tempForm);
            propagateOnChange(tempForm);
            setForm(tempForm);
            setIsPure(false);
            setTouchedFields(tempTouchedFields);
            setModifyingFields(tempModifyingFields);
        };

        /**
         * This toggles the boolean value
         * @param {string} name Field name
         */
        const handleToggle = (name: string) => {
            const tempForm: Map<string, FormValue> = new Map(form);
            const tempTouchedFields: Map<string, boolean> = new Map(touchedFields);

            tempForm.set(name, tempForm.get(name) === "true" ? "false" : "true");
            tempTouchedFields.set(name, true);
            listener(name, tempForm);
            propagateOnChange(tempForm);
            setForm(tempForm);
            setIsPure(false);
            setTouchedFields(tempTouchedFields);
        };

        /**
         * Handler for the onChange event of checkboxes
         * @param value
         * @param name
         */
        const handleChangeCheckBox = (value: string, name: string) => {
            const tempForm: Map<string, FormValue> = new Map(form);
            const selectedItems: string[] = tempForm.get(name) as string[];
            const tempTouchedFields: Map<string, boolean> = new Map(touchedFields);

            let itemIndex = -1;

            selectedItems.forEach((item, index) => {
                if (item === value) {
                    itemIndex = index;
                }
            });
            itemIndex === -1 ? selectedItems.push(value) : selectedItems.splice(itemIndex, 1);

            tempForm.set(name, selectedItems);
            tempTouchedFields.set(name, true);
            listener(name, tempForm);
            propagateOnChange(tempForm);
            setForm(tempForm);
            setIsPure(false);
            setTouchedFields(tempTouchedFields);
        };

        /**
         * This function checks if a form field is valid
         * @param name
         * @param requiredFieldsParam
         * @param validFieldsParam
         */
        const validate = async (
            name: string,
            requiredFieldsParam: Map<string, boolean>,
            validFieldsParam: Map<string, Validation>
        ) => {
            const inputField: FormField = formFields.find((formField) => {
                return isInputField(formField) && formField.name === name;
            });
            const value = form.get(name);

            if (isInputField(inputField) && !isRadioField(inputField) && inputField.required) {
                if (!isCheckBoxField(inputField) && !isToggleField(inputField)) {
                    const tempForm: Map<string, FormValue> = new Map(form);

                    tempForm.set(name, tempForm.get(name)?.toString()?.trim());
                    setForm(tempForm);

                    value !== null && value?.toString()?.trim() !== ""
                        ? requiredFieldsParam.set(name, true)
                        : requiredFieldsParam.set(name, false);
                } else if (isToggleField(inputField)) {
                    value !== null && value !== "false"
                        ? requiredFieldsParam.set(name, true)
                        : requiredFieldsParam.set(name, false);
                } else {
                    value !== null && value.length > 0
                        ? requiredFieldsParam.set(name, true)
                        : requiredFieldsParam.set(name, false);
                }
            }

            const validation: Validation = {
                errorMessages: [],
                isValid: true
            };
            
            if (
                (isTextField(inputField) || isDropdownField(inputField) || isScopesField(inputField))
                && inputField.validation
                && !(form.get(name) === null || form.get(name) === "")
            ) {              
                await inputField.validation(form.get(name) as string, validation, new Map(form));
            }
  
            validFieldsParam.set(name, {
                errorMessages: validation.errorMessages,
                isValid: validation.isValid
            });
        };

        /**
         * Handler for the onBlur event.
         *
         * @param {KeyBoardEvent} event - Event object.
         * @param {string} name - The name of the field.
         */
        const handleBlur = async (event: React.KeyboardEvent, name: string) => {
            const tempRequiredFields: Map<string, boolean> = new Map(requiredFieldsRef.current);
            const tempValidFields: Map<string, Validation> = new Map(validFieldsRef.current);
            const tempModifyingFields: Map<string, boolean> = new Map(modifyingFields);
            const tempTouchedFields: Map<string, boolean> = new Map(touchedFields);

            isValidatingRef.current = true;
            tempModifyingFields.set(name, false);
            tempTouchedFields.set(name, true);
            setIsValidating(true);
            setTouchedFields(tempTouchedFields);
            await validate(name, tempRequiredFields, tempValidFields);

            validFieldsRef.current = new Map(tempValidFields);
            requiredFieldsRef.current = new Map(tempRequiredFields);
            isValidatingRef.current = false;
            setIsValidating(false);

            setValidFields(tempValidFields);
            setRequiredFields(tempRequiredFields);
            setModifyingFields(tempModifyingFields);
        };

        /**
         * Initialize form
         * @param {boolean} isReset
         */
        const init = (isReset: boolean) => {
            const tempForm: Map<string, FormValue> = new Map(form);
            const tempRequiredFields: Map<string, boolean> = new Map(requiredFieldsRef.current);
            const tempValidFields: Map<string, Validation> = new Map(validFieldsRef.current);
            const tempTouchedFields: Map<string, boolean> = new Map(touchedFields);
            const formFieldNames = new Set<string>();

            formFields.forEach((inputField: FormField) => {
                /**
                 * Check if the element is an input element(an element that can hold a value)
                 *      -> Then:
                 *          Check if the field has not been touched OR the reset button has been pressed
                 *             OR enableReInitialize is true and the initial value has changed
                 *          -> Then:
                 *              Check if the element has a value and the reset button has not been clicked
                 *                  -> Then:
                 *                      Set the value of the element to the corresponding key in the FormValue map
                 *                  -> Else:
                 *                      Check if the element is a (radio OR Dropdown) AND it has a default value
                 *                          -> Then:
                 *                              Assign the default value to the corresponding FormValue key
                 *                          -> Else:
                 *                              Check if the  element is checkbox
                 *                                  -> Then:
                 *                                      Assign an empty array to the corresponding FormValue key
                 *                                  -> Else:
                 *                                          Check if the element is a toggle
                 *                                              -> Then:
                 *                                                  Assign false
                 *                                              -> Else:
                 *                                                  Assign an empty string value to the
                 *                                                  corresponding FormValue key
                 */
                if (isInputField(inputField)) {
                    if (!touchedFields.get(inputField.name)
                        || isReset
                        || (inputField.enableReinitialize
                            && initialValues.current.get(inputField.name) !== inputField.value)) {
                        inputField.value && !isReset
                            ? tempForm.set(inputField.name, inputField.value)
                            : (isRadioField(inputField) || isDropdownField(inputField)) && inputField.default
                                ? tempForm.set(inputField.name, inputField.default)
                                : isCheckBoxField(inputField)
                                    ? tempForm.set(inputField.name, [])
                                    : isToggleField(inputField)
                                        ? tempForm.set(inputField.name, "false")
                                        : tempForm.set(inputField.name, "");

                        initialValues.current.set(inputField.name, inputField.value);
                    }

                    /**
                     * {
                     *      {
                     *          If the value is an array check if its length is zero
                     *          OR check if it the value is empty or false
                     *      } OR
                     *      the reset button has been clicked
                     * } AND
                     *          it is not a radio field AND
                     *          the field is required
                     *
                     * Then: Set required to false
                     * Else: Set required to true
                     *
                     */
                    const value = tempForm.get(inputField.name);

                    (
                        !((value instanceof Array && value.length > 0)
                            || (!(value instanceof Array) && value.trim && !!value.trim()))
                        || isReset
                    )
                        && (!isRadioField(inputField) && inputField.required)
                        ? tempRequiredFields.set(inputField.name, false)
                        : tempRequiredFields.set(inputField.name, true);

                    if (!tempValidFields.has(inputField.name) || isReset) {
                        tempValidFields.set(inputField.name, {
                            errorMessages: [],
                            isValid: true
                        });
                        tempTouchedFields.set(inputField.name, false);
                    }

                    formFieldNames.add(inputField.name);
                }
            });

            /**
             * This removes all the redundant elements from the passed Map object and returns the stripped Map object
             * @param iterable a Map object which should have redundant elements removed
             * @param neededFields a Set object containing the names of the needed fields
             *
             * @returns {Map} stripped Map object
             */
            const removeRedundant = (iterable: Map<string, any>, neededFields: Set<string>): Map<string, any> => {
                const tempIterable = new Map(iterable);

                iterable.forEach((value, key: string) => {
                    if (!neededFields.has(key)) {
                        tempIterable.delete(key);
                    }
                });

                return tempIterable;
            };

            /**
             * In case an existing form field is dynamically removed, remove all its data.
             */
            const leanForm = removeRedundant(tempForm, formFieldNames);
            const leanRequiredFields = removeRedundant(tempRequiredFields, formFieldNames);
            const leanValidFields = removeRedundant(tempValidFields, formFieldNames);
            const leanTouchedFields = removeRedundant(tempTouchedFields, formFieldNames);

            /**
             * Touched should not change if it is a reset
             */
            if (!isReset) {
                setTouchedFields(leanTouchedFields);
            }
            setForm(leanForm);
            validFieldsRef.current = leanValidFields;
            requiredFieldsRef.current = leanRequiredFields;

            setValidFields(leanValidFields);
            setRequiredFields(leanRequiredFields);
        };

        /**
         * This is a mutex that wraps the `init` function.
         * This prevents `init` from being called twice when reset is triggered.
         * @param {boolean} lock A boolean value that specifies if the mutex should be locked or not
         */
        const initMutex = (lock: boolean) => {
            if (locked) {
                locked = false;
            } else {
                if (lock) {
                    locked = true;
                    init(true);
                } else {
                    init(false);
                }
            }
        };

        /**
         * Resets form
         */
        const reset = () => {
            setIsSubmitting(false);
            initMutex(true);
        };

        /**
         * Handles reset button click
         * @param event
         */
        const handleReset = (event: React.MouseEvent) => {
            event.preventDefault();
            reset();
            locked = false;
        };

        /**
         * Checks if all the required fields are filled
         */
        const checkRequiredFieldsFilled = (): boolean => {
            let requiredFilled = true;

            requiredFieldsRef.current.forEach((requiredFieldParam) => {
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
            let isValidated = true;

            validFieldsRef.current.forEach((validField) => {
                if (!validField.isValid) {
                    isValidated = false;
                }
            });

            return isValidated;
        };

        useEffect(() => {
            if (startSubmission && !isValidatingRef.current) {
                if (checkRequiredFieldsFilled() && checkValidated()) {
                    setStartSubmission(false);
                    setIsSubmitting(false);
                    onSubmit && onSubmit(form);
                } else {
                    onSubmitError && onSubmitError(requiredFields, validFields);
                    setIsSubmitting(true);
                    setStartSubmission(false);
                }
            } else {
                if (startSubmission) {
                    setIsSubmitting(true);
                }
            }
        }, [ startSubmission, isValidating ]);

        /**
         * This validates the form and calls the `onSubmit` prop function
         */
        const submit = () => {
            setStartSubmission(true);
        };

        /**
         * Handler for onSubmit event
         * @param {React.FormEvent} event
         */
        const handleSubmit = (event: React.FormEvent) => {
            event.preventDefault();
            submit();
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
                && !modifyingFields.get(inputField.name)
                && (isSubmitting
                    || (touchedFields.get(inputField.name)
                        && inputField.displayErrorOn === "blur"))) {                          
                return {                  
                    errorMessages: [ inputField.requiredErrorMessage ],
                    isError: true
                };
            } else if (
                (isTextField(inputField) || isDropdownField(inputField) || isScopesField(inputField)) &&
                validFields.get(inputField.name) &&
                !modifyingFields.get(inputField.name) &&
                !validFields.get(inputField.name).isValid &&
                (isSubmitting
                    || (touchedFields.get(inputField.name)
                        && inputField.displayErrorOn === "blur"))
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
         * Calls submit when submit is triggered externally
         */
        useNonInitialEffect(() => {
            submit();
        }, [ submitState ]);

        /**
         * Calls reset when reset is triggered externally
         */
        useNonInitialEffect(() => {
            reset();
        }, [ resetState ]);

        /**
         * Initializes the state of the from every time the passed formFields prop changes
         */
        useEffect(() => {
            initMutex(false);
        }, [ children ]);

        /**
         * Parses the children and
         * 1.passes form event handler functions as props to all the Field components
         * 2.extracts the props of the Field components
         * @param elements
         * @param fields
         */
        const parseChildren = (elements: React.ReactNode, fields: FormField[]): React.ReactElement[] => {
            return React.Children.map(elements, (element: React.FunctionComponentElement<any>) => {
                if (element) {
                    if (element.type === Field) {
                        fields.push(element.props);
                        flatReactChildren.push(element);

                        return React.createElement(InnerField, {
                            formProps: {
                                checkError,
                                form,
                                handleBlur,
                                handleChange,
                                handleChangeCheckBox,
                                handleReset,
                                handleToggle
                            },
                            passedProps: { ...element.props },
                            ref: element.ref as any
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
                }
            });
        };

        const mutatedChildren: React.ReactElement[] = children ? [ ...parseChildren(children, formFields) ] : null;

        return <Form { ...rest } noValidate ref={ ref } onSubmit={ handleSubmit }>{ mutatedChildren }</Form>;
    });

Forms.defaultProps = {
    resetState: false,
    submitState: false
};
