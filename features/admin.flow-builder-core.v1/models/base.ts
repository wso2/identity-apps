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

import { CSSProperties } from "react";
import { ElementTypes } from "./elements";

/**
 * Base interface for a component or a primitive.
 */
export interface StrictBase<T = any> {
    /**
     * ID of the component or the primitive.
     */
    id: string;
    /**
     * Category of the component or the primitive.
     */
    category: string;
    /**
     * Type of the component or the primitive.
     */
    type: string;
    /**
     * Version of the component or the primitive.
     */
    version: string;
    /**
     * Is the component or the primitive deprecated.
     */
    deprecated: boolean;
    /**
     * Display properties of the component or the primitive.
     */
    display: BaseDisplay;
    /**
     * Configuration of the component or the primitive.
     */
    config: BaseConfig & T;
    /**
     * Base variant of the component or the primitive
     */
    variant: any;
    /**
     * Variants of the component or the primitive.
     */
    variants: Base<T>[];
}

/**
 * Interface representing a base component or a primitive.
 */
export interface Base<T = any> extends StrictBase<T> {
    /**
     * Data added to the component by the flow builder.
     */
    data?: any;
    /**
     * Addtional meta data of the component or the primitive
     */
    meta?: any;
}

export interface BaseDisplay {
    /**
     * Fallback & i18n key value of the label.
     */
    label: string;
    /**
     * Image URL of the component or the primitive.
     */
    image: string;
    /**
     * The default variant of the component or the primitive.
     */
    defaultVariant?: string;
    /**
     * Description of the component or the primitive.
     */
    description?: string;
}

/**
 * Interface representing an option for a field.
 */
export interface FieldOption {
    /**
     * The key of the field option.
     */
    key: string;

    /**
     * The value of the field option.
     */
    value: string;

    /**
     * The label of the field option.
     */
    label: string;
}

/**
 * Interface representing a strict field.
 */
export interface StrictField {
    /**
     * The name of the field.
     */
    name: string;
    /**
     * The type of the field.
     */
    type: ElementTypes;
    /**
     * Options of the field.
     */
    options?: FieldOption[];
}

export type FieldKey = string;

export type FieldValue = any;

export type Field = StrictField & Record<FieldKey, FieldValue>;

export type Properties = Field | CSSProperties;

export interface BaseConfig {
    /**
     * Field properties.
     */
    field: Field;
    /**
     * Styles of the component or the primitive.
     */
    styles: CSSProperties;
}
