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
import useDependentProperty from "./use-dependent-property";
import {
    CommonSubmissionHandlers,
    DynamicFieldHandlerInterface,
    DynamicFieldInterface,
    FieldHandlerTypes
} from "../models/dynamic-fields";
import disableProperty from "../utils/disable-property";
import templatedProperty from "../utils/templated-property";
import uniqueIDGenerator from "../utils/unique-id-generator";

/**
 * Function definition for custom submission handler.
 */
export type CustomSubmissionFunction = (
    formValues: Record<string, unknown>,
    field: DynamicFieldInterface,
    handler: DynamicFieldHandlerInterface,
    templatePayload: Record<string, unknown>
) => Promise<void>;

/**
 * Hook for submission handlers.
 *
 * @param customSubmissionHandlers - Extension for custom submission handlers.
 * @returns An submission function for the fields.
 */
const useSubmissionHandlers = (
    customSubmissionHandlers: CustomSubmissionFunction
): {
    submission: (
        formValues: Record<string, unknown>,
        fields: DynamicFieldInterface[],
        templateData: Record<string, unknown>
    ) => Promise<void> } => {

    const { dependentProperty } = useDependentProperty();

    /**
     * Modify the field value based on its submission handlers.
     *
     * @param values - The form values to be submitted.
     * @param field - Metadata of the form field.
     * @param initializers - An array of submission handlers for the field.
     * @param templatePayload - Template payload values.
     */
    const submitField = async (
        values: Record<string, unknown>,
        field: DynamicFieldInterface,
        submissionHandlers: DynamicFieldHandlerInterface[],
        templatePayload: Record<string, unknown>
    ): Promise<void> => {
        for (const submissionHandler of submissionHandlers) {
            const { name, props } = submissionHandler;

            switch (name) {
                case CommonSubmissionHandlers.UNIQUE_ID_GENERATOR:
                    uniqueIDGenerator(
                        get(templatePayload, field?.name) as string,
                        values,
                        field?.name,
                        props?.placeholder as string
                    );

                    break;
                case CommonSubmissionHandlers.DEPENDENT_PROPERTY:
                    dependentProperty(
                        get(templatePayload, field?.name) as string,
                        values,
                        field?.name,
                        props?.placeholder as string
                    );

                    break;
                case CommonSubmissionHandlers.DISABLE_PROPERTY:
                    disableProperty(values, field?.name);

                    break;
                case CommonSubmissionHandlers.TEMPLATED_PROPERTY:
                    templatedProperty(
                        get(templatePayload, props?.propertyPath as string) as string,
                        values,
                        field?.name,
                        props?.propertyPath as string
                    );

                    break;
                default:
                    if (customSubmissionHandlers) {
                        await customSubmissionHandlers(values, field, submissionHandler, templatePayload);
                    }
            }
        }
    };

    /**
     * Modify all provided fields according to their respective submission handlers.
     *
     * @param formValues - Current values of all form fields.
     * @param fields - Metadata associated with each field.
     * @param templatePayload - Template payload values.
     */
    const submitAllFields = async (
        formValues: Record<string, unknown>,
        fields: DynamicFieldInterface[],
        templateData: Record<string, unknown>
    ): Promise<void> => {
        for (const field of fields) {
            let submissionHandlers: DynamicFieldHandlerInterface[] = field?.handlers?.filter(
                (handler: DynamicFieldHandlerInterface) => handler?.type === FieldHandlerTypes.SUBMISSION) || [];

            if (field?.disable) {
                submissionHandlers = [
                    ...submissionHandlers,
                    { name: CommonSubmissionHandlers.DISABLE_PROPERTY, type: FieldHandlerTypes.SUBMISSION }
                ];
            }

            if (submissionHandlers?.length > 0) {
                await submitField(formValues, field, submissionHandlers, templateData);
            }
        }
    };

    return {
        submission: (
            formValues: Record<string, unknown>,
            fields: DynamicFieldInterface[],
            templateData: Record<string, unknown>
        ): Promise<void> => submitAllFields(formValues, fields, templateData)
    };
};

export default useSubmissionHandlers;
