/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { addCommonDataForTheLayout } from "./common";
import { SIDE_ALIGNED_LAYOUT_INITIALES, generateDataSetForTheSideAlignedLayout } from "./side-aligned";
import { 
    SIDE_IMAGE_LAYOUT_INITIALES, 
    generateDataSetForTheSideImageLayout 
} from "./side-image";
import { BrandingPreferenceLayoutInterface, DynamicBrandingPreferenceLayoutInterface } from "../../models";

/**
 * Enum for set of predefined layouts.
 * @readonly
 * @enum {string}
 */
export enum PredefinedLayouts {
    CENTERED = "centered",
    RIGHT_ALIGNED = "right-aligned",
    LEFT_ALIGNED = "left-aligned",
    LEFT_IMAGE = "left-image",
    RIGHT_IMAGE = "right-image",
    CUSTOM = "custom"
}

/**
 * Property keys of each layout.
 */
export const LAYOUT_PROPERTY_KEYS: {[ keys in PredefinedLayouts ]: Array<string>} = {
    [ PredefinedLayouts.CENTERED ]: [],
    [ PredefinedLayouts.RIGHT_ALIGNED ]: Object.keys(SIDE_ALIGNED_LAYOUT_INITIALES),
    [ PredefinedLayouts.LEFT_ALIGNED ]: Object.keys(SIDE_ALIGNED_LAYOUT_INITIALES),
    [ PredefinedLayouts.LEFT_IMAGE ]: Object.keys(SIDE_IMAGE_LAYOUT_INITIALES),
    [ PredefinedLayouts.RIGHT_IMAGE ]: Object.keys(SIDE_IMAGE_LAYOUT_INITIALES),
    [ PredefinedLayouts.CUSTOM ]: []
};

/**
 * Initial values of the layout properties.
 */
export const LAYOUTS: DynamicBrandingPreferenceLayoutInterface = {
    ...SIDE_ALIGNED_LAYOUT_INITIALES,
    ...SIDE_IMAGE_LAYOUT_INITIALES
};

/**
 * Data required to generate the layout html content.
 */
export const LAYOUT_DATA: {
    [ keys in PredefinedLayouts ]: 
        (source: BrandingPreferenceLayoutInterface, tenantDomain: string) => Record<string, string>
} = {
    [ PredefinedLayouts.CENTERED ]: (_source: BrandingPreferenceLayoutInterface, tenantDomain:string) => 
        addCommonDataForTheLayout({}, tenantDomain),
    [ PredefinedLayouts.RIGHT_ALIGNED ]: (source: BrandingPreferenceLayoutInterface, tenantDomain:string) =>
        addCommonDataForTheLayout(generateDataSetForTheSideAlignedLayout(source), tenantDomain),
    [ PredefinedLayouts.LEFT_ALIGNED ]: (source: BrandingPreferenceLayoutInterface, tenantDomain:string) =>
        addCommonDataForTheLayout(generateDataSetForTheSideAlignedLayout(source), tenantDomain),
    [ PredefinedLayouts.LEFT_IMAGE ]: (source: BrandingPreferenceLayoutInterface, tenantDomain:string) =>
        addCommonDataForTheLayout(generateDataSetForTheSideImageLayout(source), tenantDomain),
    [ PredefinedLayouts.RIGHT_IMAGE ]: (source: BrandingPreferenceLayoutInterface, tenantDomain:string) =>
        addCommonDataForTheLayout(generateDataSetForTheSideImageLayout(source), tenantDomain),
    [ PredefinedLayouts.CUSTOM ]: (_source: BrandingPreferenceLayoutInterface, tenantDomain:string) => 
        addCommonDataForTheLayout({}, tenantDomain)
};
