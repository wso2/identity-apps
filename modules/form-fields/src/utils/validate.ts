/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

export const getDefaultValidation = (field: string, fieldType: string, value: string): string => {

    const INVALID_EMAIL_ERROR = "Please enter a valid email";
    const INVALID_URL_ERROR = "Please enter a valid URL";
    const INVALID_NAME_ERROR = "Please enter a valid name";
    const INVALID_PHONE_NUMBER_ERROR = "Please enter a valid phone number";

    if (field === "text") {
        switch (fieldType) {
            case "resourceName":
                if (!FormValidation.resourceName(value)) {
                    return INVALID_NAME_ERROR;
                }
                break;
            case "email":
                if (!FormValidation.email(value)) {
                    return INVALID_EMAIL_ERROR;
                }
                break;
            case "phoneNumber":
                if (!FormValidation.mobileNumber(value)) {
                    return INVALID_PHONE_NUMBER_ERROR;
                }
                break;
            case "url":
                if (!FormValidation.url(value)) {
                    return INVALID_URL_ERROR;
                }
                break;
        }
    }
};

export const getValidation = (value: any, field: string, fieldType: string, validation: any): string => {

        if (validation?.type) {
            const errorMessage = validation.validator();

            if (!errorMessage && errorMessage !== "") {
                return errorMessage;
            }
        }

        return getDefaultValidation(field, fieldType, value);
};
