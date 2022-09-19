/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {
    CheckboxField,
    CustomField,
    DropdownField,
    FormButton,
    FormDivider,
    FormField,
    FormSubmit,
    PasswordField,
    QueryParamsField,
    RadioField,
    Reset,
    TextField,
    ToggleField
} from "../../src";

/**
 * Type guard to check if an input element is a text field
 * @param toBeDetermined
 */
export const isTextField = (toBeDetermined: FormField): toBeDetermined is TextField | PasswordField => {
    return (
        (toBeDetermined as TextField).type === "email" ||
        (toBeDetermined as PasswordField).type === "password" ||
        (toBeDetermined as TextField).type === "number" ||
        (toBeDetermined as TextField).type === "text" ||
        (toBeDetermined as TextField).type === "textarea"
    );
};

/**
 * Type guard to check if an input element is of the type Radio
 * @param toBeDetermined
 */
export const isRadioField = (toBeDetermined: FormField): toBeDetermined is RadioField => {
    return (toBeDetermined as RadioField).type === "radio";
};

/**
 * Type guard to check if an input element is of the type Password
 * @param toBeDetermined
 */
export const isPasswordField = (toBeDetermined: FormField): toBeDetermined is PasswordField => {
    return (toBeDetermined as PasswordField).type === "password";
};

/**
 * Type guard to check if an input element is of the type Radio
 * @param toBeDetermined
 */
export const isDropdownField = (toBeDetermined: FormField): toBeDetermined is DropdownField => {
    return (toBeDetermined as DropdownField).type === "dropdown";
};

/**
 * Type guard to check if an input element is of the type Radio
 * @param toBeDetermined
 */
export const isCheckBoxField = (toBeDetermined: FormField): toBeDetermined is CheckboxField => {
    return (toBeDetermined as CheckboxField).type === "checkbox";
};

/**
 * Type guard to check if an input element is of the type Query Parameters
 * @param toBeDetermined
 */
export const isQueryParamsField = (toBeDetermined: FormField): toBeDetermined is QueryParamsField => {
    return (toBeDetermined as QueryParamsField).type === "queryParams";
};

/**
 * Type guard to check if an input element is of the type Radio
 * @param toBeDetermined
 */
export const isToggleField = (toBeDetermined: FormField): toBeDetermined is ToggleField => {
    return (toBeDetermined as ToggleField).type === "toggle";
};

/**
 * Type guard to check if an input element is of the type Radio
 * @param toBeDetermined
 */
export const isSubmitField = (toBeDetermined: FormField): toBeDetermined is FormSubmit => {
    return (toBeDetermined as FormSubmit).type === "submit";
};

/**
 * Type guard to check if an input element is of the type Radio
 * @param toBeDetermined
 */
export const isResetField = (toBeDetermined: FormField): toBeDetermined is Reset => {
    return (toBeDetermined as Reset).type === "reset";
};

/**
 * Type guard to check if an input element is of the type Radio
 * @param toBeDetermined
 */
export const isButtonField = (toBeDetermined: FormField): toBeDetermined is FormButton => {
    return (toBeDetermined as FormButton).type === "button";
};

/**
 * Type guard to check if an input element is of the type Radio
 * @param toBeDetermined
 */
export const isDivider = (toBeDetermined: FormField): toBeDetermined is FormDivider => {
    return (toBeDetermined as FormDivider).type === "divider";
};

/**
 * Type guard to check if an input element is of the type Radio
 * @param toBeDetermined
 */
export const isCustomField = (toBeDetermined: FormField): toBeDetermined is CustomField => {
    return (toBeDetermined as CustomField).type === "custom";
};

/**
 * Checks if the field is an input/checkbox/dropdown/radio/password field
 * @param toBeDetermined
 */
export const isInputField = (
    toBeDetermined: FormField
): toBeDetermined is TextField | CheckboxField | DropdownField | RadioField | PasswordField | ToggleField => {
    return (
        isTextField(toBeDetermined) ||
        isCheckBoxField(toBeDetermined) ||
        isDropdownField(toBeDetermined) ||
        isRadioField(toBeDetermined) ||
        isPasswordField(toBeDetermined) ||
        isToggleField(toBeDetermined) ||
        isQueryParamsField(toBeDetermined)
    );
};
