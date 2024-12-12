/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { useCallback, useEffect, useState } from "react";

const useDynamicForm = (fields) => {

    const [ formState, setFormState ] = useState({
        dirtyFields: {},
        disabled: false,
        errors: {},
        isDirty: false,
        isLoading: false,
        isValidating: false,
        isSubmitted: false,
        isSubmitting: false,
        isSubmitSuccessful: false,
        isValid: false,
        touchedFields: {},
        values: {}
    });
    const [ formErrors, setFormErrors ] = useState({});

    useEffect(() => {
        if (!formErrors) {
            return;
        }

        setFormState((prev) => ({
            ...prev,
            errors: formErrors,
            isValid: !formErrors || Object.keys(formErrors).length === 0
        }));
    }, [ formErrors ]);

    // Handle changes in form fields
    const handleChange = useCallback((name, value) => {
        setFormState((prev) => {
            const updatedValues = {
                ...prev.values,
                [name]: value
            };

            return {
                ...prev,
                values: updatedValues,
                touched: {
                    ...prev.touched,
                    [name]: true
                },
                isDirty: true
            };
        });
    }, [ fields ]);

    const handleSubmit = useCallback((onSubmit) => (event) => {

        event.preventDefault();

        setFormState((prev) => ({ ...prev, isSubmitting: true }));

        let hasErrors = false;
        const newErrors = {};

        fields.forEach((field) => {

            const fieldErrors = formState.errors[field.properties.name];

            if (fieldErrors && fieldErrors.length > 0) {
                hasErrors = true;
                newErrors[field.properties.name] = fieldErrors;
            }
        });

        setFormState((prev) => ({
            ...prev,
            errors: newErrors,
            isSubmitting: false
        }));

        if (!hasErrors) {
            onSubmit(event.nativeEvent.submitter.name, formState.values);
        }
    }, [ fields, formState.values ]);

    return {
        formState,
        handleChange,
        handleFormErrors: setFormErrors,
        handleSubmit
    };
};

export default useDynamicForm;
