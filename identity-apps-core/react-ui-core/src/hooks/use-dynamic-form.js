/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { useCallback, useState } from "react";

const useDynamicForm = (fields) => {

    const [ formState, setFormState ] = useState({
        dirtyFields: {},
        disabled: false,
        errors: [],
        isDirty: false,
        isLoading: false,
        isSubmitSuccessful: false,
        isSubmitted: false,
        isSubmitting: false,
        isValid: false,
        isValidating: false,
        touchedFields: {},
        values: {}
    });

    const handleFieldError = useCallback((identifier, error) => {
        setFormState((prev) => {
            const updatedErrors = { ...prev.errors };

            if (error && error.length > 0) {
                updatedErrors[identifier] = error[error.length - 1];
            } else {
                delete updatedErrors[identifier];
            }

            return {
                ...prev,
                errors: updatedErrors,
                isValid: Object.keys(updatedErrors).length === 0
            };
        });
    }, []);

    const handleChange = useCallback((identifier, value) => {
        setFormState((prev) => {
            const updatedValues = {
                ...prev.values,
                [identifier]: value
            };

            return {
                ...prev,
                isDirty: value !== "",
                touched: {
                    ...prev.touched,
                    [identifier]: true
                },
                values: updatedValues
            };
        });
    }, [ fields ]);

    const handleSubmit = (onSubmit) => (event) => {
        event.preventDefault();

        let errors = [];

        fields.forEach(field => {
            const fieldValue = formState.values[field.config.identifier];

            if (field.config.required && !fieldValue) {
                errors.push({
                    error: "This field is required.",
                    label: field.config.identifier
                });
            }

            if (field.config.validation) {
                field.config.validation.forEach(rule => {
                    if (rule.type === "MIN_LENGTH" && fieldValue.length < rule.value) {
                        errors.push({
                            error: `Must be at least ${rule.value} characters.`,
                            label: field.config.identifier
                        });
                    }
                });
            }
        });

        if (Object.keys(errors).length > 0) {
            setFormState((prev) => ({
                ...prev,
                errors: errors,
                isValid: false
            }));

            return;
        }

        setFormState((prev) => ({
            ...prev,
            isValid: true
        }));

        onSubmit(event.nativeEvent.submitter.name, formState.values);
    };

    return {
        formState,
        handleChange,
        handleFieldError,
        handleSubmit
    };
};

export default useDynamicForm;
