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

import { EndpointConfigFormPropertyInterface } from "@wso2is/admin.actions.v1/models/actions";
import { URLUtils } from "@wso2is/core/utils";
import { CommonAuthenticatorConstants } from "../constants/common-authenticator-constants";
import { EndpointAuthenticationType } from "../models/connection";

/**
 * Validates the ActionConfig form fields.
 *
 * @param values - Form values to validate.
 * @param options - Dynamic options for validation (e.g., flags and authenticationType).
 * @param t - localization translations
 * @returns A partial object containing validation errors.
 */
export const validateEndpointAuthentication = (
    values: EndpointConfigFormPropertyInterface,
    options: {
        isAuthenticationUpdateFormState: boolean;
        authenticationType?: EndpointAuthenticationType;
    },
    t: (key: string, options?: any) => string
): Partial<EndpointConfigFormPropertyInterface> => {
    const { isAuthenticationUpdateFormState, authenticationType } = options;
    const errors: Partial<EndpointConfigFormPropertyInterface> = {};

    if (!values?.endpointUri) {
        errors.endpointUri = t("actions:fields.endpoint.validations.empty");
    }
    if (URLUtils.isURLValid(values?.endpointUri)) {
        if (!(URLUtils.isHttpsUrl(values?.endpointUri))) {
            errors.endpointUri = t("actions:fields.endpoint.validations.notHttps");
        }
    } else {
        errors.endpointUri = t("actions:fields.endpoint.validations.invalidUrl");
    }
    if (!values?.authenticationType) {
        errors.authenticationType = t("actions:fields.authenticationType.validations.empty");
    }

    switch (authenticationType) {
        case EndpointAuthenticationType.BASIC:
            if(isAuthenticationUpdateFormState ||
                values?.usernameAuthProperty || values?.passwordAuthProperty) {
                if (!values?.usernameAuthProperty) {
                    errors.usernameAuthProperty = t("actions:fields.authentication." +
                        "types.basic.properties.username.validations.empty");
                }
                if (!values?.passwordAuthProperty) {
                    errors.passwordAuthProperty = t("actions:fields.authentication." +
                        "types.basic.properties.password.validations.empty");
                }
            }

            break;
        case EndpointAuthenticationType.BEARER:
            if (isAuthenticationUpdateFormState) {
                if (!values?.accessTokenAuthProperty) {
                    errors.accessTokenAuthProperty = t("actions:fields.authentication." +
                        "types.bearer.properties.accessToken.validations.empty");
                }
            }

            break;
        case EndpointAuthenticationType.API_KEY:
            if (isAuthenticationUpdateFormState ||
                values?.headerAuthProperty || values?.valueAuthProperty) {
                if (!values?.headerAuthProperty) {
                    errors.headerAuthProperty = t("actions:fields.authentication." +
                        "types.apiKey.properties.header.validations.empty");
                }
                if (!CommonAuthenticatorConstants.API_KEY_HEADER_REGEX.test(values?.headerAuthProperty)) {
                    errors.headerAuthProperty = t("actions:fields.authentication." +
                        "types.apiKey.properties.header.validations.invalid");
                }
                if (!values?.valueAuthProperty) {
                    errors.valueAuthProperty = t("actions:fields.authentication." +
                        "types.apiKey.properties.value.validations.empty");
                }
            }

            break;
        default:
            break;
    }

    return errors;
};
