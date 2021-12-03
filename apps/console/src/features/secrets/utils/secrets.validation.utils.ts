/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { FieldConstants } from "@wso2is/form";
import { I18n } from "@wso2is/i18n";
import { FormValidation } from "@wso2is/validation";

export const SECRET_NAME_LENGTH = { max: 64, min: 3 };
export const SECRET_VALUE_LENGTH = { max: 1024 * 2, min: 1 };
export const SECRET_DESCRIPTION_LENGTH = { max: 256, min: 0 };

export type ValidationResult = string | undefined;

export const secretNameValidator = (
    value: string,
    listOfTakenSecretNamesForSecretType: Set<string> = new Set()
): ValidationResult => {
    if (!value) {
        return "You cannot leave secret name empty!";
    }
    if (value.length > SECRET_NAME_LENGTH.max || value.length < SECRET_NAME_LENGTH.min) {
        return `You have to enter a name between ${
            SECRET_NAME_LENGTH.min
        } to ${
            SECRET_NAME_LENGTH.max
        } characters!`;
    }
    if (!FormValidation.isValidResourceKey(value)) {
        return FieldConstants.INVALID_SECRET_NAME_ERROR;
    }

    let isNameAlreadyExists = false;

    if (listOfTakenSecretNamesForSecretType?.size) {
        listOfTakenSecretNamesForSecretType.forEach(name => {
            if (name.toLowerCase() === value.toLowerCase()) {
                isNameAlreadyExists = true;
            }
        });
    }

    return isNameAlreadyExists ?  
        I18n.instance.t(
            "console:develop.features.secrets.wizards.addSecret.form.secretNameField.alreadyPresentError"
        ) : undefined;
};

export const secretValueValidator = (value: string): ValidationResult => {
    if (!value) {
        return "You cannot leave secret value empty!";
    }
    if (value.length > SECRET_VALUE_LENGTH.max || value.length < SECRET_VALUE_LENGTH.min) {
        return `You have to enter a value between ${
            SECRET_VALUE_LENGTH.min
        } to ${
            SECRET_VALUE_LENGTH.max
        } characters!`;
    }
    return undefined;
};
