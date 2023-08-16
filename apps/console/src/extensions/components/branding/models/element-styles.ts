/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
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
