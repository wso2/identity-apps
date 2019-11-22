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
import { SemanticSIZES, SemanticWIDTHS } from "semantic-ui-react";

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
    | "custom";

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
 * Input field model
 */
export interface InputField {
    placeholder: string;
    name: string;
    type: "text" | "email" | "textarea" | "number";
    required: boolean;
    label: string;
    width?: SemanticWIDTHS;
    validation?: (value: string, validation: Validation, allValues?: Map<string, FormValue>) => void;
    requiredErrorMessage: string;
    value?: string;
}

/**
 * Password field model
 */
export interface PasswordField {
    placeholder: string;
    name: string;
    type: "password";
    required: boolean;
    label: string;
    width?: SemanticWIDTHS;
    validation?: (value: string, validation: Validation, allValues?: Map<string, FormValue>) => void;
    requiredErrorMessage: string;
    value?: string;
    showPassword: string;
    hidePassword: string;
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
}

/**
 * Radio field child model
 */
export interface RadioChild {
    label: string;
    value: string;
}

/**
 * Custom field model
 */
export interface CustomField {
    type: Type;
    element: JSX.Element;
}

/**
 * Radio field model
 */
export interface RadioField {
    type: "radio";
    label: string;
    name: string;
    default: string;
    children: RadioChild[];
    value?: string;
}

/**
 * Checkbox field child model
 */
export interface CheckboxChild {
    label: string;
    value: string;
}

/**
 * Checkbox field model
 */
export interface CheckboxField {
    type: "checkbox";
    label: string;
    name: string;
    children: CheckboxChild[];
    value?: string[];
    required: boolean;
    requiredErrorMessage: string;
}

/**
 * Dropdown field child model
 */
export interface DropdownChild {
    text: string;
    value: string;
    key: number;
}

/**
 * Dropdown field model
 */
export interface DropdownField {
    type: "dropdown";
    label: string;
    name: string;
    default?: string;
    children: DropdownChild[];
    placeholder?: string;
    requiredErrorMessage: string;
    required: boolean;
    value?: string;
}

/**
 * Group model
 */
export interface Group {
    startIndex: number;
    endIndex: number;
    wrapper: React.ComponentType;
    wrapperProps: any;
}

/**
 * Divider model
 */
export interface FormDivider {
    type: "divider";
    hidden: boolean;
}

/**
 * FormField types
 */
export type FormField =
    | InputField
    | PasswordField
    | FormSubmit
    | RadioField
    | DropdownField
    | CheckboxField
    | Reset
    | FormButton
    | FormDivider
    | CustomField;

/**
 * FormField value types
 */
export type FormValue = string | string[];
