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
    /**
     * API to which the form values should be submitted.
     */
    api?: SupportedAPIList;
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
     * Names of the properties that should be templated using the current field value.
     */
    dependentProperties?: string[];
    /**
     * Names of placeholder strings included as templated strings in the current field.
     */
    templatedPlaceholders?: string[];
    /**
     * Names of the properties that should be templated using the current field value.
     */
    dependent?: string[];
    /**
     * Whether the current field value should be a generated value.
     */
    generator: "uuid"
    /**
     * Custom props need to be provided into the field component.
     */
    customFieldProps: Record<string, any>
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
     * Application certificate field.
     */
    APPLICATION_CERTIFICATE = "application-certificate"
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

/**
 * List of supported APIs to which the form values can be submitted.
 */
export enum SupportedAPIList {
    APPLICATION_PATCH = "PATCH:/api/server/v1/applications",
    APPLICATION_SAML_INBOUND_PROTOCOL_PUT = "PUT:/api/server/v1/applications/{application-id}/inbound-protocols/saml"
}

/**
 * List of field value generators.
 */
export enum FieldValueGenerators {
    UUID = "uuid"
}
