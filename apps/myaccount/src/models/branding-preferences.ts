/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
    BackgroundStyleAttributesInterface,
    BorderStyleAttributesInterface,
    ButtonStyleAttributesInterface,
    ColorStyleAttributesInterface,
    ElementStateInterface,
    FontStyleAttributesInterface
} from "./element-styles";

/**
 * Interface for the Branding Preference API response.
 */
export interface BrandingPreferenceAPIResponseInterface {
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
     * Preference object.
     */
    preference: BrandingPreferenceInterface;
}

/**
 * Interface Branding preference object.
 */
export interface BrandingPreferenceInterface {

    /**
     * images such as Logo, Favicon, etc.
     * @deprecated Use the images object in `theme.[<DESIRED_THEME>].images`.
     */
    images?: BrandingPreferenceImagesInterface;
    /**
     * Organization's basic details.
     */
    organizationDetails: BrandingPreferenceOrganizationDetailsInterface;
    /**
     * Links for policies, etc.
     */
    urls: BrandingPreferenceURLInterface;
    /**
     * Stylesheets for login pages etc..
     */
    stylesheets?: BrandingPreferenceStylesheetsInterface;
    /**
     * Theme.
     */
    theme: BrandingPreferenceThemeInterface;
    /**
     * Layout.
     */
    layout: BrandingPreferenceLayoutInterface;
    /**
     * Configurations.
     */
    configs: BrandingPreferenceConfigInterface;
}

/**
 * Interface Branding preference organization details.
 */
export interface BrandingPreferenceOrganizationDetailsInterface {
    /**
     * Site title appearing on the browser tab.
     */
    siteTitle: string;
    /**
     * Copyright for the footer.
     */
    copyrightText: string;
    /**
     * Support email to be shown for Org members.
     */
    supportEmail: string;
}

/**
 * Interface Branding preference images.
 */
export interface BrandingPreferenceImagesInterface {
    /**
     * Organization Logo.
     */
    logo: BrandingPreferenceImageInterface;
    /**
     * Organization Favicon.
     */
    favicon: Omit<BrandingPreferenceImageInterface, "altText">
}

/**
 * Interface Branding preference image.
 */
export interface BrandingPreferenceImageInterface {
    /**
     * Image URL.
     */
    imgURL: string;
    /**
     * Image Alt.
     */
    altText: string;
}

/**
 * Interface Branding preference URLs.
 */
export interface BrandingPreferenceURLInterface {
    /**
     * Link for Privacy Policy.
     */
    privacyPolicyURL: string;
    /**
     * Link for Terms of Service.
     */
    termsOfUseURL: string;
    /**
     * Link for Cookie Policy.
     */
    cookiePolicyURL: string;
}

/**
 * Interface Branding preference stylesheets.
 */
export interface BrandingPreferenceStylesheetsInterface {
    /**
     * Login portal stylesheet.
     */
    accountApp: PredefinedThemes;
}

export type BrandingPreferenceThemeInterface = StrictBrandingPreferenceThemeInterface
    & DynamicBrandingPreferenceThemeInterface;

/**
 * Interface Branding preference theme.
 */
export type DynamicBrandingPreferenceThemeInterface = {
    [ key in PredefinedThemes ]: ThemeConfigInterface;
};

/**
 * Theme Configurations Interface.
 */
export interface ThemeConfigInterface {
    /**
     * Color Palette.
     */
    colors: BrandingPreferenceColorsInterface;
    /**
     * Footer Preferences.
     */
    footer: BrandingPreferenceFooterInterface,
    /**
     * images such as Logo, Favicon, etc.
     */
    images: BrandingPreferenceImagesInterface;
    /**
     * Page Preferences.
     */
    page: BrandingPreferencePageInterface;
    /**
     * Typography Preferences.
     */
    typography: BrandingPreferenceTypographyInterface;
    /**
     * Button Preferences.
     */
    buttons: BrandingPreferenceButtonsInterface;
    /**
     * Login Box Preferences.
     */
    loginBox: BrandingPreferenceLoginBoxInterface;
    /**
     * Input Fields Preferences.
     */
    inputs: ElementStateInterface<BrandingPreferenceInputInterface>;
}

/**
 * Strict Interface Branding preference theme.
 */
export interface StrictBrandingPreferenceThemeInterface {
    /**
     * The active theme.
     */
    activeTheme: PredefinedThemes;
}

/**
 * Interface Branding preference theme color palette.
 */
export interface BrandingPreferenceColorsInterface {
    /**
     * Hex value of the theme primary color.
     */
    primary: string;
    /**
     * Hex value of the theme secondary color.
     */
    secondary: string;
}

/**
 * Interface Branding preference footer preferences.
 */
export interface BrandingPreferenceFooterInterface {
    /**
     * Page Body Font.
     */
    border: Pick<BorderStyleAttributesInterface, "borderColor">;
    /**
     * Page Body Font.
     */
    font: FontStyleAttributesInterface;
}

/**
 * Interface Branding preference page preferences.
 */
export interface BrandingPreferencePageInterface {
    /**
     * Page Background.
     */
    background: BackgroundStyleAttributesInterface;
    /**
     * Page Body Font.
     */
    font: FontStyleAttributesInterface;
}

/**
 * Interface for the Branding Preference Typography.
 */
export interface BrandingPreferenceTypographyInterface {
    /**
     * Page Font.
     */
    font: BrandingPreferenceTypographyFontInterface;
    /**
     * Page Heading Typography.
     */
    heading: {
        /**
         * Page Heading Font Preferences.
         */
        font: ColorStyleAttributesInterface
    };
}

/**
 * Interface for the Font Typography Font.
 */
export interface BrandingPreferenceTypographyFontInterface {
    /**
     * URL to import if loaded from a CDN.
     */
    importURL?: string;
    /**
     * Font Family.
     */
    fontFamily: string;
}

/**
 * Interface for the Login Box Preferences.
 */
export interface BrandingPreferenceButtonsInterface {
    /**
     * Social, External IDP Connection Button Preference.
     */
    externalConnection: ElementStateInterface<ButtonStyleAttributesInterface>;
    /**
     * Primary Button Preferences.
     */
    primary: ElementStateInterface<Omit<ButtonStyleAttributesInterface, "background">>;
    /**
     * Secondary Button Preferences.
     */
    secondary: ElementStateInterface<Omit<ButtonStyleAttributesInterface, "background">>;
}

/**
 * Interface for the Login Box Preferences.
 */
export interface BrandingPreferenceInputInterface {
    /**
     * Input Field Font Preferences.
     */
    font: FontStyleAttributesInterface;
    /**
     * Input field background.
     */
    background: BackgroundStyleAttributesInterface;
    /**
     * Secondary Button Preferences.
     */
    border: Pick<BorderStyleAttributesInterface, "borderRadius" | "borderColor">;
    /**
     * Input Labels Preferences.
     */
    labels: {
        /**
         * Input Labels Font Preferences.
         */
        font: FontStyleAttributesInterface;
    };
}

export interface BrandingPreferenceLoginBoxInterface {
    /**
     * Login Box Background.
     */
    background: BackgroundStyleAttributesInterface;
    /**
     * Login Box Border.
     */
    border: BorderStyleAttributesInterface;
    /**
     * Login Box Font.
     */
    font: FontStyleAttributesInterface;
}

/**
 * Interface Branding preference layout.
 */
export type BrandingPreferenceLayoutInterface = StrictBrandingPreferenceLayoutInterface
    & Partial<DynamicBrandingPreferenceLayoutInterface>;

/**
 * Strict Interface Branding preference layout.
 */
export interface StrictBrandingPreferenceLayoutInterface {
    /**
     * The active layout.
     */
    activeLayout: PredefinedLayouts;
}

/**
 * Interface dynamic branding preference layout.
 */
export type DynamicBrandingPreferenceLayoutInterface =
    BrandingPreferenceSideImageLayoutInterface
    & BrandingPreferenceSideAlignedLayoutInterface

/**
 * Left Image and Right Image layouts preference interface.
 */
export interface BrandingPreferenceSideImageLayoutInterface {
    sideImg: BrandingPreferenceImageInterface;
}

/**
 * Left Aligned and Right Aligned layouts preference interface.
 */
export interface BrandingPreferenceSideAlignedLayoutInterface {
    productTagLine: string;
}

/**
 * Interface Branding preference configurations.
 */
export interface BrandingPreferenceConfigInterface {
    /**
     * Should the changes be published?
     */
    isBrandingEnabled: boolean;
    /**
     * Should remove default branding.
     */
    removeAsgardeoBranding: boolean;
}

/**
 * Enum for Branding Preference Types.
 */
export enum BrandingPreferenceTypes {
    /**
     * Branding Preference for the Organization.
     */
    ORG = "ORG"
}

/**
 * Enum for the font config strategies.
 */
export enum FontConfigurationStrategies {
    BROWSER_DEFAULT = "BROWSER_DEFAULT",
    CDN = "CDN",
}

/**
 * Enum for set of predefined layouts.
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
 * Enum for set of predefined themes.
 */
export enum PredefinedThemes {
    LIGHT = "LIGHT",
    DARK = "DARK",
}
