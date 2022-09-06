/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
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

import { FormValidation } from "@wso2is/validation";
import { FieldConstants } from "../constants";
import { FieldInputTypes } from "../models";

/**
 * Util method to apply default validations to the fields.
 *
 * @param field - string - HTML input type of the field.
 * @param fieldType - string - Usage type of the field
 * @param value - value of the field.
 */
export const getDefaultValidation = (
    field: string,
    fieldType: typeof FieldInputTypes | string,
    value: string | number | any
): string => {

    if (field === "text") {
        switch (fieldType) {
            case "identifier":
                if (!FormValidation.identifier(value)) {
                    return FieldConstants.INVALID_NAME_ERROR;
                }

                break;
            case "resource_name":
                if (!FormValidation.isValidResourceName(value)) {
                    return FieldConstants.INVALID_RESOURCE_ERROR;
                }

                break;
            case "client_id":
                if (!FormValidation.isValidClientId(value)) {
                    return FieldConstants.INVALID_CLIENT_ID_ERROR;
                }

                break;
            case "description":
                if (!FormValidation.isValidDescription(value)) {
                    return FieldConstants.INVALID_DESCRIPTION_ERROR;
                }

                break;
            case "email":
                if (!FormValidation.email(value)) {
                    return FieldConstants.INVALID_EMAIL_ERROR;
                }

                break;
            case "phoneNumber":
                if (!FormValidation.mobileNumber(value)) {
                    return FieldConstants.INVALID_PHONE_NUMBER_ERROR;
                }

                break;
            case "url":
                if (!FormValidation.url(value)) {
                    return FieldConstants.INVALID_URL_ERROR;
                }

                break;
            case "scopes":
                if (!FormValidation.scopes(value)) {
                    return FieldConstants.INVALID_SCOPES_ERROR;
                }

                break;
        }
    }
};

/**
 * @returns Corresponding default validation.
 */
export const getValidation = (
    value: string | number | any, meta: string | number | any,
    field: string, required: boolean, fieldType?: string, validation?: (value: string | number | any) => any
): any => {

    if (!meta.modified) {
        return;
    }

    if (meta.modified && required && !value) {
        return FieldConstants.FIELD_REQUIRED_ERROR;
    }

    if (!value) {
        return;
    }

    if (validation instanceof Promise) {
        validation.then(message => {
            return message;
        });
    }

    if (typeof(validation) === "function") {
        return validation(value);
    }

    return getDefaultValidation(field, fieldType, value);
};
