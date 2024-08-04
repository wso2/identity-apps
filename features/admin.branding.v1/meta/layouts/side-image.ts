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

import {
    BrandingPreferenceLayoutInterface,
    BrandingPreferenceSideImageLayoutInterface
} from "@wso2is/common.branding.v1/models";

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
