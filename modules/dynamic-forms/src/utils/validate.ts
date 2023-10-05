/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
    value: string | number | any,
    allValues: Record<string, unknown>,
    meta: string | number | any,
    required: boolean,
    validation?: (value: string | number | any, allValues: Record<string, unknown>) => any
): any => {

    const FIELD_REQUIRED_ERROR = "This field cannot be empty";

    if (required && !value) {
        return FIELD_REQUIRED_ERROR;
    }

    if (!meta.modified) {
        return;
    }

    if (meta.modified && required && !value) {
        return FIELD_REQUIRED_ERROR;
    }

    if (!value) {
        return;
    }

    if (validation instanceof Promise) {
        validation(value, allValues).then((message: string) => {
            return message;
        });
    }

    if (typeof(validation) === "function") {
        
        return validation(value, allValues);
    }
};
