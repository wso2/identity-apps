/**
 * Copyright (c) 2022-2025, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Status of validation configurations.
 */

export interface ValidationDataInterface {

    field: string;
    rules?: ValidationConfInterface[];
    regEx?: ValidationConfInterface[];
}

export interface RevertValidationConfigInterface {
    fields: string[];
}

export interface ValidationConfInterface {

    validator: string;
    properties: ValidationPropertyInterface[];
}

export interface ValidationPropertyInterface {

    key: string;
    value: string;
}

export interface ValidationFormInterface {

    field: string;
    type: string;
    minLength?: string;
    maxLength?: string;
    minNumbers?: string;
    minUpperCaseCharacters?: string;
    minLowerCaseCharacters?: string;
    minSpecialCharacters?: string;
    uniqueCharacterValidatorEnabled?: boolean;
    consecutiveCharacterValidatorEnabled?: boolean;
    minUniqueCharacters?: string;
    maxConsecutiveCharacters?: string;
    enableValidator?: string;
    isAlphanumericOnly?: boolean;
    [key: string]: string | boolean | number | Record<string, string>;
}

export enum PasswordExpiryRuleOperator {
    EQ = "eq",
    NE = "ne"
}

export enum PasswordExpiryRuleAttribute {
    ROLES = "roles",
    GROUPS = "groups"
}

export interface PasswordExpiryRule {
    id: string;
    priority: number;
    expiryDays: number;
    attribute: PasswordExpiryRuleAttribute;
    operator: PasswordExpiryRuleOperator;
    values: string[];
}
