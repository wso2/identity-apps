/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { 
    BrandingPreferenceLayoutInterface,
    BrandingPreferenceSideAlignedLayoutInterface 
} from "../../models";

/**
 * Initial values of the left aligned and right aligned layouts properties.
 */
export const SIDE_ALIGNED_LAYOUT_INITIALES: BrandingPreferenceSideAlignedLayoutInterface = {
    productTagLine: "Your product is awesome, describe it further here."
};

/**
 * Data set required to generate layout html code.
 */
export const generateDataSetForTheSideAlignedLayout = (source: BrandingPreferenceLayoutInterface): {
    productTagLine: string
} => {
    return {
        productTagLine: source.productTagLine
    };
};
