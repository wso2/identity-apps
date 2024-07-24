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

import { CustomInitializeFunction } from
    "@wso2is/admin.template-core.v1/hooks/use-initialize-handlers";
import {
    DynamicFieldHandlerInterface,
    DynamicFieldInterface
} from "@wso2is/admin.template-core.v1/models/dynamic-fields";
import get from "lodash-es/get";
import useUniqueApplicationName from "./use-unique-application-name";
import { ApplicationTemplateInitializeHandlers } from "../models/dynamic-fields";

/**
 * Hook for custom initialize handlers.
 *
 * @returns Custom initialize functions.
 */
const useInitializeHandlers = (): { customInitializers: CustomInitializeFunction } => {

    const { generateUniqueApplicationName } = useUniqueApplicationName();

    /**
     * Custom initializer functions to initialize the field based on the handler.
     *
     * @param formValues - The form values to be initialized.
     * @param field - Metadata of the form field.
     * @param handler - Handler definition.
     * @param templatePayload - Template payload values.
     */
    const customInitializers = async (
        formValues: Record<string, unknown>,
        field: DynamicFieldInterface,
        handler: DynamicFieldHandlerInterface,
        templatePayload: Record<string, unknown>
    ): Promise<void> => {
        switch (handler?.name) {
            case ApplicationTemplateInitializeHandlers.UNIQUE_APPLICATION_NAME:
                await generateUniqueApplicationName(
                    get(templatePayload, field?.name)?.toString()?.trim(),
                    formValues,
                    field?.name
                );

                break;
        }
    };

    return { customInitializers };
};

export default useInitializeHandlers;
