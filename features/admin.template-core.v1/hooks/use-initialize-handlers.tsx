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
import {
    CommonInitializeHandlers,
    DynamicFieldHandlerInterface,
    DynamicFieldInterface,
    FieldHandlerTypes
} from "../models/dynamic-fields";
import extractTemplatedFields from "../utils/extract-templated-fields";

/**
 * Function definition for custom initialize handler.
 */
export type CustomInitializeFunction = (
    formValues: Record<string, unknown>,
    field: DynamicFieldInterface,
    handler: DynamicFieldHandlerInterface,
    templatePayload: Record<string, unknown>
) => Promise<void>;

/**
 * Hook for initialize handlers.
 *
 * @param customInitializers - Extension for custom initialize functions.
 * @returns An initialize function for the fields.
 */
const useInitializeHandlers = (
    customInitializers: CustomInitializeFunction
): {
    initialize: (
        formValues: Record<string, unknown>,
        fields: DynamicFieldInterface[],
        templateData: Record<string, unknown>
    ) => Promise<void> } => {

    /**
     * Initialize a field based on its initialize handlers.
     *
     * @param values - The form values to be initialized.
     * @param field - Metadata of the form field.
     * @param initializers - An array of initializers for the field.
     * @param templatePayload - Template payload values.
     */
    const initializeField = async (
        values: Record<string, unknown>,
        field: DynamicFieldInterface,
        initializers: DynamicFieldHandlerInterface[],
        templatePayload: Record<string, unknown>
    ): Promise<void> => {
        for (const initializer of initializers) {
            const { name, props } = initializer;

            switch (name) {
                case CommonInitializeHandlers.EXTRACT_TEMPLATED_FIELDS:
                    extractTemplatedFields(
                        get(templatePayload, props?.propertyPath as string) as string,
                        values,
                        field?.name,
                        props?.propertyPath as string
                    );

                    break;
                default:
                    if (customInitializers) {
                        await customInitializers(values, field, initializer, templatePayload);
                    }
            }
        }
    };

    /**
     * Initialize all provided fields according to their respective initialize handlers.
     *
     * @param formValues - Current values of all form fields.
     * @param fields - Metadata associated with each field.
     * @param templatePayload - Template payload values.
     */
    const initializeAllFields = async (
        formValues: Record<string, unknown>,
        fields: DynamicFieldInterface[],
        templateData: Record<string, unknown>
    ): Promise<void> => {
        for (const field of fields) {
            const initializers: DynamicFieldHandlerInterface[] = field?.handlers?.filter(
                (handler: DynamicFieldHandlerInterface) => handler?.type === FieldHandlerTypes.INITIALIZE) || [];

            if (initializers?.length > 0) {
                await initializeField(formValues, field, initializers, templateData);
            }
        }
    };

    return {
        initialize: (
            formValues: Record<string, unknown>,
            fields: DynamicFieldInterface[],
            templateData: Record<string, unknown>
        ): Promise<void> => initializeAllFields(formValues, fields, templateData)
    };
};

export default useInitializeHandlers;
