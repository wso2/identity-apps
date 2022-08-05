/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import {
    BackgroundStyleAttributesInterface,
    BorderStyleAttributesInterface,
    ButtonStyleAttributesInterface,
    ColorStyleAttributesInterface,
    ElementStateInterface,
    FontStyleAttributesInterface
} from "./element-styles";
import { PredefinedThemes } from "../meta";

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
     * @deprecated
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
 *
 * @readonly
 * @enum {string}
 */
export enum BrandingPreferenceTypes {
    /**
     * Branding Preference for the Organization.
     * @type {string}
     */
    ORG = "ORG"
}

/**
 * Enum for the font config strategies.
 * @readonly
 * @enum {string}
 */
export enum FontConfigurationStrategies {
    BROWSER_DEFAULT = "BROWSER_DEFAULT",
    CDN = "CDN",
}
