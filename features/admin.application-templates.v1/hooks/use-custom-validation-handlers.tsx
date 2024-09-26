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

import { CustomValidationsFunction } from
    "@wso2is/admin.template-core.v1/hooks/use-validation-handlers";
import {
    DynamicFieldHandlerInterface,
    DynamicFieldInterface
} from "@wso2is/admin.template-core.v1/models/dynamic-fields";
import get from "lodash-es/get";
import useApplicationNameValidation from "./use-application-name-validation";
import { ApplicationTemplateValidationHandlers } from "../models/dynamic-fields";

/**
 * Hook for custom validation handlers.
 *
 * @returns Custom validation functions.
 */
const useValidationHandlers = (): { customValidations: CustomValidationsFunction } => {

    const { validateApplicationName } = useApplicationNameValidation();

    /**
     * Custom validation function to validate the field based on the handler.
     *
     * @param formValues - The form values to be validated.
     * @param field - Metadata of the form field.
     * @param handler - Handler definition.
     * @returns An error message if validation fails, or `null` if validation succeeds.
     */
    const customValidations = async (
        formValues: Record<string, unknown>,
        field: DynamicFieldInterface,
        handler: DynamicFieldHandlerInterface
    ): Promise<string | null> => {
        let validationResult: string = null;

        switch (handler?.name) {
            case ApplicationTemplateValidationHandlers.APPLICATION_NAME:
                validationResult = await validateApplicationName(
                    get(formValues, field?.name)?.toString()?.trim(),
                    get(formValues, "id") as string
                );

                break;
        }

        return validationResult;
    };

    return { customValidations };
};

export default useValidationHandlers;
