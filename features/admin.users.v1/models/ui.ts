/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface, ProfileSchemaInterface } from "@wso2is/core/models";

/**
 * Interface for the User profile form field props.
 */
interface ProfileFormFieldProps<T> extends IdentifiableComponentInterface {
    /**
     * Field name to be passed to the input component.
     */
    fieldName: string;
    /**
     * Field label to be displayed.
     */
    fieldLabel: string;
    /**
     * Initial value of the field. Can be string or string[].
     */
    initialValue: T;
    /**
     * Whether the form is being updated.
     */
    isUpdating: boolean;
    /**
     * Whether the field is read-only.
     */
    isReadOnly: boolean;
    /**
     * Whether the field is required.
     */
    isRequired: boolean;
    /**
     * Validator for the field.
     */
    validator?: (value: string) => string | undefined;
}

/**
 * Interface for the User profile text field props.
 */
export interface TextFormFieldPropsInterface extends ProfileFormFieldProps<string> {
    /**
     * Maximum characters allowed in the field.
     */
    maxLength: number;
    /**
     * Placeholder for the field. If not provided, placeholder will be derived from the field label.
     */
    placeholder?: string;
    /**
     * Type of the field. Can be "text" or "number".
     * Default value is "text".
     */
    type?: string;
}

/**
 * Interface for the User profile country field props.
 */
export interface CountryFieldPropsInterface extends ProfileFormFieldProps<string> { }

/**
 * Interface for the User profile locale field props.
 */
export interface LocaleFieldPropsInterface extends ProfileFormFieldProps<string> { }

/**
 * User profile single-valued email/mobile field component props interface.
 */
export interface SingleValuedEmailMobileFieldPropsInterface extends ProfileFormFieldProps<string> {
    /**
     * Attribute schema.
     */
    schema: ProfileSchemaInterface;
    /**
     * Pending email or mobile value. Used to show the verification status.
     */
    pendingValue: string;
    /**
     * Whether the verification is enabled or not.
     */
    isVerificationEnabled: boolean;
    /**
     * Maximum characters allowed in the field.
     */
    maxLength?: number;
}

/**
 * Interface for the User profile multi-valued text field props.
 */
export interface MultiValuedTextFieldPropsInterface extends ProfileFormFieldProps<string[]> {
    /**
     * Attribute schema.
     */
    schema: ProfileSchemaInterface;
    /**
     * Maximum number of values allowed in the field.
     */
    maxValueLimit: number;
    /**
     * Type of the field. Can be "text" or "number".
     * Default value is "text".
     */
    type?: string;
}

/**
 * Interface for the User profile radio group field props.
 */
export interface RadioGroupFormFieldPropsInterface extends ProfileFormFieldProps<string> {
    /**
     * Attribute schema.
     */
    schema: ProfileSchemaInterface;
}

/**
 * Interface for the User profile dropdown field props.
 */
export interface DropdownFormFieldPropsInterface extends Omit<ProfileFormFieldProps<string | string[]>, "validator"> {
    /**
     * Attribute schema.
     */
    schema: ProfileSchemaInterface;
    /**
     * Whether the field should allow multiple selections.
     * Default value is false.
     */
    isMultiSelect?: boolean;
}

/**
 * Interface for the User profile checkbox group field props.
 */
export interface CheckBoxGroupFormFieldPropsInterface extends Omit<ProfileFormFieldProps<string[]>, "validator"> {
    /**
     * Attribute schema.
     */
    schema: ProfileSchemaInterface;
}
