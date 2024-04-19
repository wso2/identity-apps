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
     * The data component id for the input field.
     */
    dataComponentId: string;
    /**
     * Array of validation rules for the field's input.
     */
    validations?: ValidationRule[];
    /**
     * Additional meta data need to decorate the dynamic input field.
     */
    meta?: DynamicFieldMetadataInterface;
}

/**
 * Interface for the metadata of dynamic fields.
 */
export interface DynamicFieldMetadataInterface {
    /**
     * Properties that should automatically submit along with the current property.
     */
    autoSubmitProperties?: DynamicFieldAutoSubmitPropertyInterface[];
}

/**
 * Interface for defining an auto-submitting property.
 */
export interface DynamicFieldAutoSubmitPropertyInterface {
    /**
     * The path for the property that should be included in the final form submit payload.
     */
    path: string;
    /**
     * The value to be assigned to the specified path.
     */
    value: any;
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
    TEXTAREA = "textarea"
}

/**
 * Representation of the validation rules for dynamic input field.
 */
export interface ValidationRule {
    /**
     * The validation rule type.
     */
    type: ValidationRuleTypes;
    /**
     * Error message to be displayed when validation fails.
     */
    errorMessage?: string;
}

/**
 * Supported validation rule types for dynamic input fields.
 */
export enum ValidationRuleTypes {
    DOMAIN_NAME = "domainName",
    APPLICATION_NAME = "applicationName",
    REQUIRED = "required"
}
