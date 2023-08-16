/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import tinycolor from "tinycolor2";

/**
 * Converts a RGB | RGBA color to hex.
 *
 * @example
 *  rgbToHex(65, 131, 196);
 *  // Returns '4183c4'
 * @param value - The value to be converted.
 * @returns a convered HEX value.
 */
export const rgbToHex = (value: string): string => {

    return tinycolor(value).toHex8String();
};
