/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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
