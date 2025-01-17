/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { DropDownItemInterface, SupportedFileTypes } from "@wso2is/form";

/**
 * Interface to define a dynamic form.
 */
export interface DynamicFormInterface {
    /**
     * Dynamic field data needs to be rendered on the form.
     */
    fields: DynamicFieldInterface[],
    /**
     * Should the form only submit the fields defined above.
     */
    submitDefinedFieldsOnly?: boolean;
}

/**
 * Data types required to render the dynamic input fields.
 */
export interface DynamicFieldInterface {
    /**
     * Unique identifier for the input field.
     */
    id: string;
    /**
     * Aria label of the input field.
     */
    "aria-label": string;
    /**
     * Name of the input field.
     */
    name: string;
    /**
     * Label of the input field.
     */
    label: string;
    /**
     * Input field type.
     */
    type: DynamicInputFieldTypes;
    /**
     * Whether the field is optional or not.
     */
    required: boolean;
    /**
     * Placeholder for the input field.
     */
    placeholder: string;
    /**
     * Helper text for the input field.
     */
    helperText: string;
    /**
     * The data component id for the input field.
     */
    dataComponentId: string;
    /**
     * Indicates if the field is disabled (Value will not be submitted).
     */
    disable?: boolean;
    /**
     * Indicates whether the field is read only.
     */
    readOnly?: boolean;
    /**
     * Indicates whether the field is hidden.
     */
    hidden?: boolean;
    /**
     * Array of handlers to manage this field at various phases of the form life cycle.
     */
    handlers?: DynamicFieldHandlerInterface[];
}

/**
 * Data types required to render the dynamic file picker.
 */
export interface DynamicFilePickerFieldInterface extends DynamicFieldInterface {
    /**
     * File type to be used in the FilePicker component.
     */
    fileType: SupportedFileTypes;
    /**
     * In the dropzone we can explain what types of file
     * and some descriptive info about the required file.
     */
    dropzoneText: string;
    /**
     * This is the placeholder text for paste tab content
     * area. By default this has a value like the following:-
     * "Paste your content in this area..."
     */
    pasteAreaPlaceholderText?: string;
    /**
     * The manual upload button text. This button is
     * placed beneath the description.
     */
    uploadButtonText: string;
    /**
     * Hide selection tabs & paste section.
     */
    hidePasteOption?: boolean;
}

/**
 * Data types required to render the dynamic dropdown field.
 */
export interface DynamicDropdownFieldInterface extends DynamicFieldInterface {
    /**
     * File type to be used in the FilePicker component.
     */
    options: DropDownItemInterface[];
}

/**
 * Interface for the handlers of dynamic fields.
 */
export interface DynamicFieldHandlerInterface {
    /**
     * Name of the handler.
     */
    name: string;
    /**
     * Type of handler based on the form life cycle.
     */
    type: FieldHandlerTypes;
    /**
     * Props that need to be passed into the handler method.
     */
    props?: Record<string, unknown>;
}

/**
 * Supported dynamic input field types.
 */
export enum DynamicInputFieldTypes {
    /**
     * Text input field.
     */
    TEXT = "text",
    /**
     * Checkbox field.
     */
    CHECKBOX = "checkbox",
    /**
     * Text Area.
     */
    TEXTAREA = "textarea",
    /**
     * File picker field.
     */
    FILE = "file",
    /**
     * Dropdown field.
     */
    SELECT = "select"
}

/**
 * Supported field handler types for dynamic input fields.
 */
export enum FieldHandlerTypes {
    INITIALIZE = "initialize",
    VALIDATION = "validation",
    SUBMISSION = "submission"
}

/**
 * Supported common validation handlers.
 */
export enum CommonValidationHandlers {
    URL = "url",
    REQUIRED = "required"
}

/**
 * Supported common initialize handlers.
 */
export enum CommonInitializeHandlers {
    EXTRACT_TEMPLATED_FIELDS = "extractTemplatedFields"
}

/**
 * Supported common submission handlers.
 */
export enum CommonSubmissionHandlers {
    UNIQUE_ID_GENERATOR = "uniqueIDGenerator",
    DISABLE_PROPERTY = "disableProperty",
    DEPENDENT_PROPERTY = "dependentProperty",
    TEMPLATED_PROPERTY = "templatedProperty"
}
