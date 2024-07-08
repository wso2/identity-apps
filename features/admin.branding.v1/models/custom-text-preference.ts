/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
    BrandingPreferenceTypes,
    PreviewScreenType,
    PreviewScreenVariationType
} from "@wso2is/common.branding.v1/models";

/**
 * Interface for the custom text preference API response.
 */
export interface CustomTextPreferenceAPIResponseInterface {
    /**
     * Preference type.
     */
    type: BrandingPreferenceTypes;
    /**
     * Requested resource name.
     */
    name: string;
    /**
     * Resource locale.
     */
    locale: string;
    /**
     * Branding
     */
    screen: string;
    /**
     * Text preference object.
     */
    preference: CustomTextPreferenceInterface;
}

/**
 * Interface for the custom text preference.
 */
export interface CustomTextPreferenceInterface {
    /**
     * Text object.
     */
    text: Record<string, string>;
}

/**
 * Interface for the custom text values object.
 */
export type CustomTextInterface = Record<string, string>;

/**
 * Interface for the custom text preference meta.
 */
export interface CustomTextPreferenceMeta {
    /**
     * Set of supported screens and variations.
     */
    screens: Record<PreviewScreenType, PreviewScreenVariationType[]>;
    /**
     * Set of supported locales.
     */
    locales: string[];
}

/**
 * Enum for the custom text modes.
 */
export enum CustomTextConfigurationModes {
    /**
     * JSON mode.
     */
    JSON = "JSON",
    /**
     * Text fields mode.
     */
    TEXT_FIELDS = "TEXT_FIELDS"
}

/**
 * Interface for the custom text preference screen meta.
 */
export interface CustomTextPreferenceScreenMetaInterface {
    [key: string]: {
        /**
         * Is the text preference editable.
         */
        EDITABLE: boolean;
        /**
         * Screen name of the text preference.
         */
        SCREEN: string;
        /**
         * Is the text preference multi-line.
         */
        MULTI_LINE: boolean;
    };
}

/**
 * Base variations for screens. Represents the basic state of the screen.
 */
export const BASE_DISPLAY_VARIATION :Record<PreviewScreenType, PreviewScreenVariationType> = {
    [PreviewScreenType.COMMON]: PreviewScreenVariationType.BASE,
    [PreviewScreenType.EMAIL_OTP]: PreviewScreenVariationType.BASE,
    [PreviewScreenType.EMAIL_TEMPLATE]: PreviewScreenVariationType.BASE,
    [PreviewScreenType.LOGIN]: PreviewScreenVariationType.BASE,
    [PreviewScreenType.MY_ACCOUNT]: PreviewScreenVariationType.BASE,
    [PreviewScreenType.PASSWORD_RECOVERY]: PreviewScreenVariationType.EMAIL_LINK,
    [PreviewScreenType.PASSWORD_RESET]: PreviewScreenVariationType.BASE,
    [PreviewScreenType.PASSWORD_RESET_SUCCESS]: PreviewScreenVariationType.BASE,
    [PreviewScreenType.SIGN_UP]: PreviewScreenVariationType.BASE,
    [PreviewScreenType.SMS_OTP]: PreviewScreenVariationType.BASE,
    [PreviewScreenType.TOTP]: PreviewScreenVariationType.BASE,
    [PreviewScreenType.EMAIL_LINK_EXPIRY]: PreviewScreenVariationType.BASE
};
