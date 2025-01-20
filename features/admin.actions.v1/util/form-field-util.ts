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

import { URLUtils } from "@wso2is/core/utils";
import { ActionConfigFormPropertyInterface, AuthenticationType } from "../models/actions";

/**
 * Validates the ActionConfig form fields.
 *
 * @param values - Form values to validate.
 * @param options - Dynamic options for validation (e.g., flags and authenticationType).
 * @param t - localization translations
 * @returns A partial object containing validation errors.
 */
export const validateActionCommonFields = (
    values: ActionConfigFormPropertyInterface,
    options: {
        isCreateFormState: boolean;
        isAuthenticationUpdateFormState: boolean;
        authenticationType?: AuthenticationType;
    },
    t: (key: string, options?: any) => string
): Partial<ActionConfigFormPropertyInterface> => {
    const { isCreateFormState, isAuthenticationUpdateFormState, authenticationType } = options;
    const error: Partial<ActionConfigFormPropertyInterface> = {};

    if (!values?.name) {
        error.name = t("actions:fields.name.validations.empty");
    }
    const actionNameRegex: RegExp = /^[a-zA-Z0-9-_][a-zA-Z0-9-_ ]*[a-zA-Z0-9-_]$/;

    if (!actionNameRegex.test(values?.name)) {
        error.name = t("actions:fields.name.validations.invalid");
    }
    if (!values?.endpointUri) {
        error.endpointUri = t("actions:fields.endpoint.validations.empty");
    }
    if (URLUtils.isURLValid(values?.endpointUri)) {
        if (!(URLUtils.isHttpsUrl(values?.endpointUri))) {
            error.endpointUri = t("actions:fields.endpoint.validations.notHttps");
        }
    } else {
        error.endpointUri = t("actions:fields.endpoint.validations.invalidUrl");
    }
    if (!values?.authenticationType) {
        error.authenticationType = t("actions:fields.authenticationType.validations.empty");
    }

    const apiKeyHeaderRegex: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9-.]+$/;

    switch (authenticationType) {
        case AuthenticationType.BASIC:
            if(isCreateFormState || isAuthenticationUpdateFormState ||
                values?.usernameAuthProperty || values?.passwordAuthProperty) {
                if (!values?.usernameAuthProperty) {
                    error.usernameAuthProperty = t("actions:fields.authentication." +
                        "types.basic.properties.username.validations.empty");
                }
                if (!values?.passwordAuthProperty) {
                    error.passwordAuthProperty = t("actions:fields.authentication." +
                        "types.basic.properties.password.validations.empty");
                }
            }

            break;
        case AuthenticationType.BEARER:
            if (isCreateFormState || isAuthenticationUpdateFormState) {
                if (!values?.accessTokenAuthProperty) {
                    error.accessTokenAuthProperty = t("actions:fields.authentication." +
                        "types.bearer.properties.accessToken.validations.empty");
                }
            }

            break;
        case AuthenticationType.API_KEY:
            if (isCreateFormState || isAuthenticationUpdateFormState ||
                values?.headerAuthProperty || values?.valueAuthProperty) {
                if (!values?.headerAuthProperty) {
                    error.headerAuthProperty = t("actions:fields.authentication." +
                        "types.apiKey.properties.header.validations.empty");
                }
                if (!apiKeyHeaderRegex.test(values?.headerAuthProperty)) {
                    error.headerAuthProperty = t("actions:fields.authentication." +
                        "types.apiKey.properties.header.validations.invalid");
                }
                if (!values?.valueAuthProperty) {
                    error.valueAuthProperty = t("actions:fields.authentication." +
                        "types.apiKey.properties.value.validations.empty");
                }
            }

            break;
        default:
            break;
    }

    return error;
};
