/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
 * Interface for the Primary Button Style Attributes..
 */
export interface ButtonStyleAttributesInterface {
    /**
     * Button Text.
     */
    font: FontStyleAttributesInterface;
    /**
     * Button Background.
     */
    background: BackgroundStyleAttributesInterface;
    /**
     * Button Border.
     */
    border: Pick<BorderStyleAttributesInterface, "borderRadius">;
}

/**
 * Color styles interface.
 * @remarks Extend with contrast, alpha. whenever necessary.
 */
export type ColorStyleAttributesInterface = Pick<CSSProperties, "color">;

/**
 * Font styles interface.
 * @remarks Extend with font size, weight. whenever necessary.
 */
export type FontStyleAttributesInterface = ColorStyleAttributesInterface;

/**
 * Border styles interface.
 * @remarks Extend with borderStyle, etc. whenever necessary.
 */
export type BorderStyleAttributesInterface = Pick<CSSProperties, "borderColor">
    & Pick<CSSProperties, "borderRadius">
    & Pick<CSSProperties, "borderWidth">;

/**
 * Background styles interface.
 * @remarks Extend with backgroundImage, backgroundSize, etc. whenever necessary.
 */
export type BackgroundStyleAttributesInterface = Pick<CSSProperties, "backgroundColor">;

/**
 * Generic interface for element states.
 * @remarks Extend with hover, active & other possible element states.
 */
export interface ElementStateInterface<T> {
    base: T;
}
