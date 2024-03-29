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
 * Data types required to render the dynamic input fields.
 */
export interface DynamicFieldInterface {
    /**
     * The index of the field.
     */
    index: number;
    /**
     * Unique identifier for the input field.
     */
    id: string;
    /**
     * Aria label of the input field.
     */
    ariaLabel: string;
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
     * Initial value of the input field.
     */
    initialValue: string;
    /**
     * The data component id for the input field.
     */
    dataComponentId: string;
    /**
     * The maximum length of the field's input.
     */
    maxLength: string;
    /**
     * The minimu length of the field's input.
     */
    minLength: string;
    /**
     * The width of the input field.
     */
    width: string;
    /**
     * Array of validation rules for the field's input.
     */
    validations?: ValidationRule[];
    /**
     * Additional custom attributes need to decorate the dynamic input field.
     */
    additionalAttributes?: any;
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
    CHECKBOX = "checkbox"
}

/**
 * Representation of the validation rules for dyanmic input field.
 */
export interface ValidationRule {
    /**
     * The validation rule type.
     */
    type: ValidationRuleTypes;
    /**
     * Error message to be displayed when validation fails.
     */
    errorMessage: string;
}

/**
 * Supported validation rule types for dynamic input fields.
 */
export enum ValidationRuleTypes {
    DOMAIN_NAME = "domainName"
}
