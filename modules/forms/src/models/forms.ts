/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import * as React from "react";
import { FlagProps, SemanticSIZES, SemanticShorthandItem, SemanticWIDTHS } from "semantic-ui-react";

/**
 * Form Field Types
 */
export type Type =
    | "email"
    | "text"
    | "textarea"
    | "password"
    | "number"
    | "submit"
    | "radio"
    | "dropdown"
    | "checkbox"
    | "reset"
    | "button"
    | "divider"
    | "custom"
    | "toggle";

/**
 * Model of the Validation object passed into validation functions
 */
export interface Validation {
    isValid: boolean;
    errorMessages: string[];
}

/**
 * Model of the Error object used by semantic Input elements to check for error
 */
export interface Error {
    isError: boolean;
    errorMessages: string[];
}

/**
 * The generic interface for all input fields
 */
interface FormFieldModel {
    className?: string;
    name: string;
    label?: string | React.ReactElement;
    listen?: (values: Map<string, FormValue>) => void;
    autoFocus?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    displayErrorOn?: "blur" | "submit";
    hidden?: boolean;
    "data-testid"?: string;
    enableReinitialize?: boolean;
}

/**
 * The generic interface for all input fields but the radio field
 */
interface FormRequiredFieldModel extends FormFieldModel {
    required: boolean;
    requiredErrorMessage: string;
}

/**
 * Input field model
 */
export interface TextField extends FormRequiredFieldModel {
    type: "text" | "email" | "textarea" | "number";
    width?: SemanticWIDTHS;
    validation?: (value: string, validation: Validation, allValues?: Map<string, FormValue>) => void;
    value?: string;
    placeholder?: string;
    [extra: string]: any;
}

/**
 * Password field model
 */
export interface PasswordField extends FormRequiredFieldModel {
    type: "password";
    width?: SemanticWIDTHS;
    validation?: (value: string, validation: Validation, allValues?: Map<string, FormValue>) => void;
    value?: string;
    showPassword: string;
    hidePassword: string;
    placeholder?: string;
    [extra: string]: any;
}

/**
 * Radio field child model
 */
export interface RadioChild extends StrictRadioChild {
    [ key: string ]: any;
}

/**
 * Radio field child strict model
 */
export interface StrictRadioChild {
    label: string;
    value: string;
    /**
     * Optionally we can pass a hint with a context header and content.
     * It will be rendered as a popup when the user hover over the
     * radio button.
     */
    hint?: {
        header?: string;
        content: string;
    };
}

/**
 * Radio field model
 */
export interface RadioField extends FormFieldModel {
    type: "radio";
    default: string;
    children: RadioChild[];
    value?: string;
    onBefore?: (event: React.SyntheticEvent,value: string | number) => boolean; 
    [extra: string]: any;
}

/**
 * Checkbox field child model
 */
export interface CheckboxChild {
    label: string;
    value: string;
    readOnly?: boolean;
    /**
     * Support for disabling an individual checkbox
     * within a group of checkboxes.
     */
    disabled?: boolean;
    /**
     * Optionally we can pass a hint with a context header and content.
     * It will be rendered as a popup when the user hover over the checkbox.
     */
    hint?: { header: string; content: string };
}

/**
 * Checkbox field model
 */
export interface CheckboxField extends FormRequiredFieldModel {
    type: "checkbox";
    children: CheckboxChild[];
    value?: string[];
    [extra: string]: any;
}

/**
 * Query Parameters field model
 */
export interface QueryParamsField extends FormRequiredFieldModel {
    type: "queryParams";
    value?: string;
    validation?: (value: string, validation: Validation, allValues?: Map<string, FormValue>) => void;
}

/**
 * Toggle field model
 */
export interface ToggleField extends FormRequiredFieldModel {
    type: "toggle";
    value?: string;
    [extra: string]: any;
}

/**
 * Dropdown field child model
 */
export interface DropdownChild {
    text: React.ReactNode;
    value: string;
    key: string | number;
    flag?: SemanticShorthandItem<FlagProps>;
}

/**
 * Dropdown field model
 */
export interface DropdownField extends FormRequiredFieldModel {
    type: "dropdown";
    default?: string;
    children: DropdownChild[];
    validation?: (value: string, validation: Validation, allValues?: Map<string, FormValue>) => void;
    placeholder?: string;
    value?: string;
    width?: SemanticWIDTHS;
    [extra: string]: any;
}

/**
 * Custom field model
 */
export interface CustomField {
    type: Type;
    element: JSX.Element;
    [extra: string]: any;
}

/**
 * Form submit model
 */
export interface FormSubmit {
    disabled?: (values: Map<string, FormValue>) => boolean;
    value: string;
    type: "submit";
    size?: SemanticSIZES;
    className?: string;
    [extra: string]: any;
}

/**
 * Reset button model
 */
export interface Reset {
    disabled?: (values: Map<string, FormValue>) => boolean;
    value: string;
    type: "reset";
    size?: SemanticSIZES;
    className?: string;
    [extra: string]: any;
}

/**
 * Button model
 */
export interface FormButton {
    disabled?: (values: Map<string, FormValue>) => boolean;
    onClick: () => void;
    className?: string;
    size?: SemanticSIZES;
    type: "button";
    value: string;
    [extra: string]: any;
}

/**
 * Group model
 */
export interface Group {
    startIndex: number;
    endIndex: number;
    wrapper: React.ComponentType;
    wrapperProps: any;
    [extra: string]: any;
}

/**
 * Divider model
 */
export interface FormDivider {
    type: "divider";
    hidden: boolean;
    [extra: string]: any;
}

/**
 * FormField types
 */
export type FormField =
    | TextField
    | PasswordField
    | FormSubmit
    | RadioField
    | DropdownField
    | CheckboxField
    | Reset
    | FormButton
    | FormDivider
    | CustomField
    | ToggleField
    | QueryParamsField;

/**
 * FormField value types
 */
export type FormValue = string | string[];
