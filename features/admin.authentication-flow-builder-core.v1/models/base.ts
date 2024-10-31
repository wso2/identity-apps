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

/**
 * Base interface for a component or a primitive.
 */
export interface Base<T = unknown> {
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
    config: BaseConfig & T;
    variants: Base<T>[];
}

export interface BaseDisplay {
    /**
     * Fallback & i18n key value of the label.
     */
    label: {
        /**
         * Fallback value of the label.
         */
        fallback: string;
        /**
         * i18n key of the label.
         */
        i18nKey: string;
    };
    /**
     * Image URL of the component or the primitive.
     */
    image: string;
}

export interface BaseConfig {
    field: Record<string, unknown>;
    styles: CSSProperties;
}
