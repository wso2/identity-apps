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

import get from "lodash-es/get";
import set from "lodash-es/set";
import { useTranslation } from "react-i18next";
import {
    CommonValidationHandlers,
    DynamicFieldHandlerInterface,
    DynamicFieldInterface,
    FieldHandlerTypes
} from "../models/dynamic-fields";
import requiredField from "../utils/required-field";
import validateURL from "../utils/url-validation";

/**
 * Function definition for custom validations.
 */
export type CustomValidationsFunction = (
    formValues: Record<string, unknown>,
    field: DynamicFieldInterface,
    handler: DynamicFieldHandlerInterface
) => Promise<string | null>;

/**
 * Hook for field validation handlers.
 *
 * @param customValidations - Extension for custom validation functions.
 * @returns A validation function for the fields.
 */
const useValidationHandlers = (
    customValidations: CustomValidationsFunction
): {
    validate: (
        formValues: Record<string, unknown>,
        fields: DynamicFieldInterface[]
    ) => Promise<{ [key: string]: string }> } => {

    const { t, i18n } = useTranslation();

    /**
     * Handle error messages based on the validation rule error message.
     * If the validation rule contains an error message, that message will be returned.
     * If there is no configured error message, the function will return the default error message.
     *
     * @param validationResult - Result of the validation function.
     * @param errorMessage - Custom error message for the validation rule.
     * @returns The final error message or null based on the validation result.
     */
    const handleErrorMessage = (validationResult: string | null, errorMessage: string): string | null => {
        if (validationResult) {
            if (errorMessage) {
                if (i18n.exists(errorMessage)) {
                    return t(errorMessage);
                }

                return errorMessage;
            }

            return t(validationResult);
        }

        // If all validation rules are successful, return null for the errorMessage.
        return null;
    };

    /**
     * Validates a field based on its validation rules.
     *
     * @param values - The form values to be validated.
     * @param field - Metadata of the form field.
     * @param validations - An array of validation rules for the field.
     * @returns An error message if validation fails, or `null` if validation succeeds.
     */
    const validateField = async (
        values: Record<string, unknown>,
        field: DynamicFieldInterface,
        validations: DynamicFieldHandlerInterface[]
    ): Promise<string | null> => {
        if (!validations) {
            return null;
        }

        for (const validation of validations) {
            const { name, props } = validation;

            let validationResult: string = null;

            switch (name) {
                case CommonValidationHandlers.REQUIRED:
                    validationResult = handleErrorMessage(
                        requiredField(get(values, field?.name)),
                        props?.errorMessage as string
                    );

                    break;
                case CommonValidationHandlers.URL:
                    validationResult = handleErrorMessage(
                        await validateURL(get(values, field?.name) as string),
                        props?.errorMessage as string
                    );

                    break;
            }

            if (!validationResult && customValidations) {
                validationResult = await customValidations(values, field, validation);
            }

            if (validationResult) {
                return validationResult;
            }
        }

        return null;
    };

    /**
     * Validate all provided fields according to their respective validation rules.
     *
     * @param formValues - Current values of all form fields.
     * @param fields - Metadata associated with each field.
     * @returns An error object containing error messages for each provided field.
     */
    const validateAllFields = async (
        formValues: Record<string, unknown>,
        fields: DynamicFieldInterface[]
    ): Promise<{ [key: string]: string }> => {
        const errorObject: { [key: string]: string } = {};

        for (const field of fields) {
            let validations: DynamicFieldHandlerInterface[] = field?.handlers?.filter(
                (handler: DynamicFieldHandlerInterface) => handler?.type === FieldHandlerTypes.VALIDATION) || [];

            if (field?.required) {
                validations = [
                    { name: CommonValidationHandlers.REQUIRED, type: FieldHandlerTypes.VALIDATION },
                    ...validations
                ];
            }

            if (validations?.length > 0) {
                const error: string = await validateField(formValues, field, validations);

                if (error) {
                    set(errorObject, field?.name, error);
                }
            }
        }

        return errorObject;
    };

    return {
        validate: (
            formValues: Record<string, unknown>,
            fields: DynamicFieldInterface[]
        ): Promise<{ [key: string]: string }> =>
            validateAllFields(formValues, fields)
    };
};

export default useValidationHandlers;
