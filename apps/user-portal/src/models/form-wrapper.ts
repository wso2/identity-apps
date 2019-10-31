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

/**
 * Semantic widths number type
 */
type SemanticWIDTHSNUMBER = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

/**
 * Semantic width string type
 */
type SemanticWIDTHSSTRING =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "13"
    | "14"
    | "15"
    | "16"
    | "one"
    | "two"
    | "three"
    | "four"
    | "five"
    | "six"
    | "seven"
    | "eight"
    | "nine"
    | "ten"
    | "eleven"
    | "twelve"
    | "thirteen"
    | "fourteen"
    | "fifteen"
    | "sixteen";

/**
 * Semantic widths type
 */
export type SemanticWIDTHS = SemanticWIDTHSNUMBER | SemanticWIDTHSSTRING;

/**
 * Semantic Sizes type
 */
export type SemanticSIZES = "big" | "small" | "mini" | "tiny" | "medium" | "large" | "huge" | "massive";

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
    type: Type;
    required: boolean;
    label: string;
    width?: SemanticWIDTHS;
    validation?: (value: string, validation: Validation, allValues?: Map<string, FormValue>) => void;
    requiredErrorMessage: string;
    value?: string;
}

/**
 * Form submit model
 */
export interface FormSubmit {
    value: string;
    type: Type;
    size?: SemanticSIZES;
    className?: string;
}

/**
 * Reset button model
 */
export interface Reset {
    value: string;
    type: Type;
    size?: SemanticSIZES;
    className?: string;
}

/**
 * Button model
 */
export interface Ibutton {
    value: string;
    type: string;
    size?: SemanticSIZES;
    className?: string;
    onClick: () => void;
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
    type: Type;
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
    type: Type;
    label: string;
    name: string;
    children: CheckboxChild[];
    value?: string[];
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
    type: Type;
    label: string;
    name: string;
    default?: string;
    children: DropdownChild[];
    placeholder?: string;
    validation?: (value: string, validation: Validation) => void;
    requiredErrorMessage: string;
    required: boolean;
    value?: string;
}

/**
 * Group style types
 */
export type GroupStyle = "grouped" | "inline";

/**
 * Group model
 */
export interface Group {
    startIndex: number;
    endIndex: number;
    style: GroupStyle;
    width?: SemanticWIDTHS | "equal";
}

/**
 * Divider model
 */
export interface Idivider {
    type: Type;
    hidden: boolean;
}

/**
 * FormField types
 */
export type FormField =
    | InputField
    | FormSubmit
    | RadioField
    | DropdownField
    | CheckboxField
    | Reset
    | Ibutton
    | Idivider
    | CustomField;

/**
 * FormField value types
 */
export type FormValue = string | string[];
