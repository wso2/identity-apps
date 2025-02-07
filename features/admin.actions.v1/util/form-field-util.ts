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

import { I18n } from "@wso2is/i18n";
import { FormValidation } from "@wso2is/validation";
import { ActionsConstants } from "../constants/actions-constants";
import {
    ActionConfigFormPropertyInterface,
    AuthenticationType,
    EndpointConfigFormPropertyInterface
} from "../models/actions";

/**
 * Validates the ActionConfig form fields.
 *
 * @param values - Form values to validate.
 * @param options - Dynamic options for validation (e.g., flags and authenticationType).
 * @returns A partial object containing validation errors.
 */
export const validateActionCommonFields = (
    values: ActionConfigFormPropertyInterface,
    options: {
        isCreateFormState: boolean;
        isAuthenticationUpdateFormState: boolean;
        authenticationType?: AuthenticationType;
    }
): Partial<ActionConfigFormPropertyInterface> => {
    const errors: Partial<ActionConfigFormPropertyInterface> = {};

    if (!values?.name) {
        errors.name = I18n.instance.t("actions:fields.name.validations.empty");
    }

    if (!ActionsConstants.ACTION_NAME_REGEX.test(values?.name)) {
        errors.name = I18n.instance.t("actions:fields.name.validations.invalid");
    }

    return {
        ...errors,
        ...validateActionEndpointFields(values, options)
    };
};

/**
 * Validate endpoint fields of the ActionConfig form.
 *
 * @param values - Form values to validate.
 * @param options - Dynamic options for validation (e.g., flags and authenticationType).
 * @returns A partial object containing validation errors.
 */
export const validateActionEndpointFields = (
    values: EndpointConfigFormPropertyInterface,
    options: {
        isCreateFormState?: boolean;
        isAuthenticationUpdateFormState: boolean;
        authenticationType?: AuthenticationType;
    }
): Partial<EndpointConfigFormPropertyInterface> => {
    const { isCreateFormState, isAuthenticationUpdateFormState, authenticationType } = options;
    const errors: Partial<EndpointConfigFormPropertyInterface> = {};

    if (!values?.endpointUri) {
        errors.endpointUri = I18n.instance.t("actions:fields.endpoint.validations.empty");
    }

    if (
        !FormValidation.url(values?.endpointUri, {
            domain: {
                allowUnicode: true,
                minDomainSegments: 1,
                tlds: false
            },
            scheme: [ "https", "http" ]
        })
    ) {
        errors.endpointUri = I18n.instance.t("actions:fields.endpoint.validations.invalidUrl");
    }

    if (!values?.authenticationType) {
        errors.authenticationType = I18n.instance.t("actions:fields.authenticationType.validations.empty");
    }

    switch (authenticationType) {
        case AuthenticationType.BASIC:
            if (
                isCreateFormState || isAuthenticationUpdateFormState || values?.usernameAuthProperty ||
                    values?.passwordAuthProperty
            ) {
                if (!values?.usernameAuthProperty) {
                    errors.usernameAuthProperty = I18n.instance.t(
                        "actions:fields.authentication.types.basic.properties.username.validations.empty"
                    );
                }
                if (!values?.passwordAuthProperty) {
                    errors.passwordAuthProperty = I18n.instance.t(
                        "actions:fields.authentication.types.basic.properties.password.validations.empty"
                    );
                }
            }

            break;
        case AuthenticationType.BEARER:
            if (isCreateFormState || isAuthenticationUpdateFormState) {
                if (!values?.accessTokenAuthProperty) {
                    errors.accessTokenAuthProperty = I18n.instance.t(
                        "actions:fields.authentication.types.bearer.properties.accessToken.validations.empty"
                    );
                }
            }

            break;
        case AuthenticationType.API_KEY:
            if (isCreateFormState || isAuthenticationUpdateFormState || values?.headerAuthProperty ||
                   values?.valueAuthProperty
            ) {
                if (!values?.headerAuthProperty) {
                    errors.headerAuthProperty = I18n.instance.t(
                        "actions:fields.authentication.types.apiKey.properties.header.validations.empty"
                    );
                }
                if (!ActionsConstants.API_HEADER_REGEX.test(values?.headerAuthProperty)) {
                    errors.headerAuthProperty = I18n.instance.t(
                        "actions:fields.authentication.types.apiKey.properties.header.validations.invalid"
                    );
                }
                if (!values?.valueAuthProperty) {
                    errors.valueAuthProperty = I18n.instance.t(
                        "actions:fields.authentication.types.apiKey.properties.value.validations.empty"
                    );
                }
            }

            break;
        default:
            break;
    }

    return errors;
};
