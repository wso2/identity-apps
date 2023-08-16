/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
    ScopesField,
    TextField,
    ToggleField
} from "../../src";

/**
 * Type guard to check if an input element is a text field.
 *
 * @param toBeDetermined - Form field to be checked.
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
 * Type guard to check if an input element is of the type Radio.
 *
 * @param toBeDetermined - Form field to be checked.
 */
export const isRadioField = (toBeDetermined: FormField): toBeDetermined is RadioField => {
    return (toBeDetermined as RadioField).type === "radio";
};

/**
 * Type guard to check if an input element is of the type Password.
 *
 * @param toBeDetermined - Form field to be checked.
 */
export const isPasswordField = (toBeDetermined: FormField): toBeDetermined is PasswordField => {
    return (toBeDetermined as PasswordField).type === "password";
};

/**
 * Type guard to check if an input element is of the type Dropdown.
 *
 * @param toBeDetermined - Form field to be checked.
 */
export const isDropdownField = (toBeDetermined: FormField): toBeDetermined is DropdownField => {
    return (toBeDetermined as DropdownField).type === "dropdown";
};

/**
 * Type guard to check if an input element is of the type Checkbox.
 *
 * @param toBeDetermined - Form field to be checked.
 */
export const isCheckBoxField = (toBeDetermined: FormField): toBeDetermined is CheckboxField => {
    return (toBeDetermined as CheckboxField).type === "checkbox";
};

/**
 * Type guard to check if an input element is of the type Scopes.
 *
 * @param toBeDetermined - Form field to be checked.
 */
export const isScopesField = (toBeDetermined: FormField): toBeDetermined is ScopesField => {
    return (toBeDetermined as ScopesField).type === "scopes";
};

/**
 * Type guard to check if an input element is of the type Query Parameters.
 *
 * @param toBeDetermined - Form field to be checked.
 */
export const isQueryParamsField = (toBeDetermined: FormField): toBeDetermined is QueryParamsField => {
    return (toBeDetermined as QueryParamsField).type === "queryParams";
};

/**
 * Type guard to check if an input element is of the type Toggle.
 *
 * @param toBeDetermined - Form field to be checked.
 */
export const isToggleField = (toBeDetermined: FormField): toBeDetermined is ToggleField => {
    return (toBeDetermined as ToggleField).type === "toggle";
};

/**
 * Type guard to check if an input element is of the type Submit.
 *
 * @param toBeDetermined - Form field to be checked.
 */
export const isSubmitField = (toBeDetermined: FormField): toBeDetermined is FormSubmit => {
    return (toBeDetermined as FormSubmit).type === "submit";
};

/**
 * Type guard to check if an input element is of the type Reset.
 *
 * @param toBeDetermined - Form field to be checked.
 */
export const isResetField = (toBeDetermined: FormField): toBeDetermined is Reset => {
    return (toBeDetermined as Reset).type === "reset";
};

/**
 * Type guard to check if an input element is of the type Button.
 *
 * @param toBeDetermined - Form field to be checked.
 */
export const isButtonField = (toBeDetermined: FormField): toBeDetermined is FormButton => {
    return (toBeDetermined as FormButton).type === "button";
};

/**
 * Type guard to check if an input element is of the type Divider.
 *
 * @param toBeDetermined - Form field to be checked.
 */
export const isDivider = (toBeDetermined: FormField): toBeDetermined is FormDivider => {
    return (toBeDetermined as FormDivider).type === "divider";
};

/**
 * Type guard to check if an input element is of the type Custom.
 *
 * @param toBeDetermined - Form field to be checked.
 */
export const isCustomField = (toBeDetermined: FormField): toBeDetermined is CustomField => {
    return (toBeDetermined as CustomField).type === "custom";
};

/**
 * Checks if the field is an input/checkbox/dropdown/radio/password field.
 *
 * @param toBeDetermined - Form field to be checked.
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
        isQueryParamsField(toBeDetermined) ||
        isScopesField(toBeDetermined)
    );
};
