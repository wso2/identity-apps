/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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
     * @deprecated Moved to the `/branding-preference/text` API.
     */
    siteTitle?: string;
    /**
     * Copyright for the footer.
     * @deprecated Moved to the `/branding-preference/text` API.
     */
    copyrightText?: string;
    /**
     * Support email to be shown for Org members.
     */
    supportEmail: string;
    /**
     * Display name to be shown for Org members.
     */
    displayName: string;
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
    favicon: Omit<BrandingPreferenceImageInterface, "altText">;
    /**
     * Organization My Account Logo.
     */
    myAccountLogo: BrandingPreferenceImageInterface;
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
    /**
     * Title.
     */
    title?: string;
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
    /**
     * Link for Self Sign Up.
     */
    selfSignUpURL?: string;
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
     * Login Page Preferences.
     */
    loginPage?: BrandingPreferencePageInterface;
    /**
     * Page Preferences.
     * @deprecated Renamed to `loginPage` to keep it specific for login page.
     */
    page?: BrandingPreferencePageInterface;
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
 * Represents a color palette with different shades and contrast text.
 */
export interface PaletteColor {
    /**
     * The light shade of the color.
     */
    light?: string;

    /**
     * The main shade of the color.
     */
    main: string;

    /**
     * The dark shade of the color.
     */
    dark?: string;

    /**
     * The contrast text color for the color.
     */
    contrastText?: string;

    /**
     * The inverted color for the color.
     */
    inverted?: string;
}

/**
 * Interface defining the color palette for a branding preference theme.
 */
export interface BrandingPreferenceColorsInterface {
    /**
     * The primary color palette of the theme.
     */
    primary: PaletteColor;
    /**
     * The secondary color palette of the theme.
     */
    secondary: PaletteColor;
    /**
     * The background color palette of the theme.
     */
    background: {
        /**
         * The body background color palette of the theme.
         */
        body: PaletteColor;
        /**
         * The surface background color palette of the theme.
         */
        surface: PaletteColor;
    };
    /**
     * The outlined color palette of the theme.
     */
    outlined: {
        /**
         * The default outlined color palette of the theme.
         */
        default: string;
    },
    /**
     * The text color palette of the theme.
     */
    text: {
        /**
         * The primary text color palette of the theme.
         */
        primary: string;
        /**
         * The secondary text color palette of the theme.
         */
        secondary: string;
    },
    /**
     * The alerts color palette of the theme.
     */
    alerts: {
        /**
         * The neutral alerts color palette of the theme.
         */
        neutral: PaletteColor;
        /**
         * The error alerts color palette of the theme.
         */
        error: PaletteColor;
        /**
         * The info alerts color palette of the theme.
         */
        info: PaletteColor;
        /**
         * The warning alerts color palette of the theme.
         */
        warning: PaletteColor;
    },
    /**
     * The illustrations color palette of the theme.
     */
    illustrations: {
        /**
         * The primary illustrations color palette of the theme.
         */
        primary: PaletteColor;
        /**
         * The secondary illustrations color palette of the theme.
         */
        secondary: PaletteColor;
        /**
         * The accent 1 illustrations color palette of the theme.
         */
        accent1: PaletteColor;
        /**
         * The accent 2 illustrations color palette of the theme.
         */
        accent2: PaletteColor;
        /**
         * The accent 3 illustrations color palette of the theme.
         */
        accent3: PaletteColor;
    }
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
     * @deprecated Renamed to `removeDefaultBranding` to keep it common.
     */
    removeAsgardeoBranding?: boolean;
    /**
     * Should remove default branding.
     */
    removeDefaultBranding?: boolean;
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
 * Enum for preview screen types.
 */
export enum PreviewScreenType {
    COMMON = "common",
    LOGIN = "login",
    MY_ACCOUNT = "myaccount",
    EMAIL_TEMPLATE = "email-template",
    SIGN_UP = "sign-up",
    EMAIL_OTP = "email-otp",
    SMS_OTP = "sms-otp",
    TOTP = "totp",
    PASSWORD_RECOVERY = "password-recovery",
    PASSWORD_RESET = "password-reset",
    PASSWORD_RESET_SUCCESS = "password-reset-success"
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

export enum BrandingSubFeatures {
    DESIGN = "DESIGN",
    CUSTOM_TEXT = "CUSTOM_TEXT"
}
