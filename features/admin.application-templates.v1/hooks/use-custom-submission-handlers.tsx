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

import { CustomSubmissionFunction } from
    "@wso2is/admin.template-core.v1/hooks/use-submission-handlers";
import {
    DynamicFieldHandlerInterface,
    DynamicFieldInterface
} from "@wso2is/admin.template-core.v1/models/dynamic-fields";
import { ApplicationTemplateSubmissionHandlers } from "../models/dynamic-fields";
import buildCallBackUrlsWithRegExp from "../utils/build-callback-urls-with-regexp";

/**
 * Hook for custom submission handlers.
 *
 * @returns Custom submission handler functions.
 */
const useSubmissionHandlers = (): { customSubmissionHandlers: CustomSubmissionFunction } => {

    /**
     * Custom submission handler functions to modify the fields.
     *
     * @param formValues - The form values to be handled by submission handlers.
     * @param field - Metadata of the form field.
     * @param handler - Handler definition.
     * @param templatePayload - Template payload values.
     */
    const customSubmissionHandlers = async (
        formValues: Record<string, unknown>,
        field: DynamicFieldInterface,
        handler: DynamicFieldHandlerInterface,
        _templatePayload: Record<string, unknown>
    ): Promise<void> => {
        switch (handler?.name) {
            case ApplicationTemplateSubmissionHandlers.BUILD_CALLBACK_URLS_WITH_REGEXP:
                buildCallBackUrlsWithRegExp(formValues, field?.name);

                break;
        }
    };

    return { customSubmissionHandlers };
};

export default useSubmissionHandlers;
