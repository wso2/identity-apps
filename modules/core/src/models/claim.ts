/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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
 *  Captures claim management properties.
 */
export interface Claim {
    id?: string;
    claimURI: string;
    dialectURI?: string;
    description: string;
    displayOrder: number;
    multiValued: boolean;
    dataType: string;
    subAttributes?: string[];
    canonicalValues?: LabelValue[];
    displayName: string;
    readOnly: boolean;
    regEx: string;
    required: boolean;
    supportedByDefault: boolean;
    uniquenessScope?: UniquenessScope;
    inputFormat?: InputFormat
    sharedProfileValueResolvingMethod?: SharedProfileValueResolvingMethod;
    attributeMapping?: AttributeMapping[];
    properties?: Property[];
    profiles?: {
        console?: AttributeProfileConfig;
        endUser?: AttributeProfileConfig;
        selfRegistration?: AttributeProfileConfig;
    }
}

/**
 * Interface for attribute profile configuration.
 */
export interface AttributeProfileConfig {
    readOnly?: boolean;
    required?: boolean;
    supportedByDefault?: boolean;
}

/**
 * Type of userstore-attribute mapping
 */
export interface AttributeMapping {
    mappedAttribute: string;
    userstore: string;
}

/**
 * Type of additional property key-value pair
 */
export interface Property{
    key: string;
    value: string;
}

/**
 * Type of label-value pair.
 */
export interface LabelValue {
    label: string;
    value: string;
}

/**
 * Type of input format for claims in the UI.
 * This is used to determine how the claim should be rendered in the UI.
 */
export interface InputFormat {
    inputType: string;
}

/**
 * Type of claim dialect
 */
export interface ClaimDialect {
    id: string;
    dialectURI: string;
    link: Link;
}

/**
 * Type of link attribute found in claim dialect objects
 */
interface Link {
    href: string;
    rel: string;
}

/**
 *  Dialect other than local dialect.
 */
export interface ExternalClaim {
    id: string;
    claimURI: string;
    claimDialectURI: string;
    mappedLocalClaimURI: string;
    localClaimDisplayName: string;
    properties?: Property[];
}

/**
 * Type of query params passed when fetching a list
 */
export interface ClaimsGetParams {
    limit: number;
    offset: number;
    filter: string;
    sort: string;
    attributes?: string;
    "exclude-identity-claims"?: boolean;
    "exclude-hidden-claims"?: boolean;
    profile?: string;
}

/**
 * Type of query params passed when fetching claim dialects.
 */
export interface ClaimDialectsGetParams {
    limit?: number;
    offset?: number;
    filter?: string;
    sort?: string;
}

/**
 * Type of SCIM resource schema extension.
 */
export interface SCIMSchemaExtension {
    schema: string;
    required?: boolean;
}

/**
 * Type of SCIM resource.
 */
export interface SCIMResource {
    schemas: string[];
    meta: {
        location: string;
        resourceType: string;
    };
    id: string;
    name: string;
    endpoint: string;
    description: string;
    schema: string;
    schemaExtensions?: SCIMSchemaExtension[];
}

/**
 * Enum representing the scope of uniqueness validation for the claim.
 * - NONE: The claim value doesn't need to be unique
 * - WITHIN_USERSTORE: The claim value must be unique within a single userstore
 * - ACROSS_USERSTORES: The claim value must be unique across all userstores
 */
export enum UniquenessScope {
    NONE = "NONE",
    WITHIN_USERSTORE = "WITHIN_USERSTORE",
    ACROSS_USERSTORES = "ACROSS_USERSTORES"
}

/**
 * Enum representing the method of resolving shared profile attribute values.
 * - FROM_ORIGIN: Use the value from the originating organization.
 * - FROM_SHARED_PROFILE: Use the value from the shared profile.
 * - FROM_FIRST_FOUND_IN_HIERARCHY: Use the first value found in the organization hierarchy.
 */
export enum SharedProfileValueResolvingMethod {
    FROM_ORIGIN = "FromOrigin",
    FROM_SHARED_PROFILE = "FromSharedProfile",
    FROM_FIRST_FOUND_IN_HIERARCHY = "FromFirstFoundInHierarchy"
}

/**
 * Enum representing the data types of claims.
 * - STRING: A string value.
 * - INTEGER: An integer value.
 * - DECIMAL: A decimal value.
 * - BOOLEAN: A boolean value.
 * - DATE_TIME: A date and time value.
 * - COMPLEX: A complex value.
 */
export enum ClaimDataType {
    STRING = "string",
    INTEGER = "integer",
    DECIMAL = "decimal",
    BOOLEAN = "boolean",
    DATE_TIME = "date_time",
    COMPLEX = "complex",
    OPTIONS = "options",
    TEXT = "text"
}

/**
 * Enum representing the input formats for claims in the UI.
 * - DROPDOWN: A dropdown selection.
 * - RADIO_GROUP: A group of radio buttons.
 * - CHECKBOX_GROUP: A group of checkboxes.
 * - MULTI_SELECT_DROPDOWN: A multi-select dropdown.
 * - CHECKBOX: A checkbox input.
 * - TEXT_INPUT: A single-line text input.
 * - TEXTAREA: A multi-line text input.
 * - DATE_PICKER: A date picker input.
 * - NUMBER_INPUT: A numeric input field.
 * - TOGGLE: A toggle switch input.
 */
export enum ClaimInputFormat {
    DROPDOWN = "dropdown",
    RADIO_GROUP = "radio_group",
    CHECKBOX_GROUP = "checkbox_group",
    MULTI_SELECT_DROPDOWN = "multi_select_dropdown",
    CHECKBOX = "checkbox",
    TEXT_INPUT = "text_input",
    TEXTAREA = "textarea",
    DATE_PICKER = "date_picker",
    NUMBER_INPUT = "number_input",
    TOGGLE = "toggle"
}
