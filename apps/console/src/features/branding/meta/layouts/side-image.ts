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
    BrandingPreferenceSideImageLayoutInterface
} from "../../models";

/**
 * Initial values of the left image and right image layouts properties.
 */
export const SIDE_IMAGE_LAYOUT_INITIALES: BrandingPreferenceSideImageLayoutInterface = {
    sideImg: {
        altText:"",
        imgURL: ""
    }
};

/**
 * Data set required to generate layout html code.
 */
export const generateDataSetForTheSideImageLayout = (source: BrandingPreferenceLayoutInterface): {
    sideImgAltText: string,
    sideImgUrl: string
} => {
    return {
        sideImgAltText: source.sideImg?.altText,
        sideImgUrl: source.sideImg?.imgURL
    };
};
