/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import isEmpty from "lodash-es/isEmpty";
import { PredefinedThemes, THEMES, THEME_SWATCH_UI_CONFIGS } from "./themes";
import { Config } from "../../../../features/core/configs";
import { ThemeSwatchUIConfigsInterface } from "../components";
import { BrandingPreferencesConstants } from "../constants";
import {
    BrandingPreferenceImagesInterface,
    BrandingPreferenceOrganizationDetailsInterface,
    BrandingPreferenceThemeInterface,
    DynamicBrandingPreferenceThemeInterface
} from "../models";

/**
 * Class for the Branding Preference Metadata.
 */
export class BrandingPreferenceMeta {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    private constructor() { }

    /**
     * Get Branding Preference internal fallback values to gracefully render the previews, etc.
     * @remarks These will not be sent in the API payload and the login screens should have the same level
     * of fallbacks.
     *
     * @param {PredefinedThemes} - Selected Theme.
     * @return {Partial<BrandingPreferenceInterface>}
     */
    public static getBrandingPreferenceInternalFallbacks(): {
        theme: {
            [ PredefinedThemes.DARK ]: {
                images: Pick<BrandingPreferenceImagesInterface, "favicon"> & {
                    logo: Partial<BrandingPreferenceImagesInterface[ "logo" ]>
                }
            },
            [ PredefinedThemes.LIGHT ]: {
                images: Pick<BrandingPreferenceImagesInterface, "favicon"> & {
                    logo: Partial<BrandingPreferenceImagesInterface[ "logo" ]>
                }
            }
        };
        organizationDetails: Partial<BrandingPreferenceOrganizationDetailsInterface>
        } {

        return {
            organizationDetails: {
                copyrightText: Config.getDeploymentConfig().extensions?.defaultBrandedLoginScreenCopyright
                    ? (Config.getDeploymentConfig().extensions.defaultBrandedLoginScreenCopyright as string)
                        .replace("${copyright}", "\u00A9")
                        .replace("${year}", String(new Date().getFullYear()))
                    : ""
            },
            theme: {
                [ PredefinedThemes.LIGHT ]: {
                    images: {
                        favicon: {
                            imgURL: Config.getDeploymentConfig().extensions?.defaultBrandedLoginScreenFavicon as string
                        },
                        logo: {
                            imgURL: Config.getDeploymentConfig().extensions?.defaultBrandedLoginScreenLogo as string
                        }
                    }
                },
                [ PredefinedThemes.DARK ]: {
                    images: {
                        favicon: {
                            imgURL: Config.getDeploymentConfig().extensions?.defaultBrandedLoginScreenFavicon as string
                        },
                        logo: {
                            imgURL: Config
                                .getDeploymentConfig().extensions?.defaultBrandedLoginScreenLogoWhite as string
                        }
                    }
                }
            }
        };
    }

    /**
     * Get the color palette needed to render the theme switch swatches.
     *
     * @param {PredefinedThemes} theme - Requested Theme.
     * @return {BrandingPreferenceColorsInterface}
     */
    public static getThemeSwatchConfigs(theme: PredefinedThemes): ThemeSwatchUIConfigsInterface {

        const DEFAULT_THEME_SWATCH_HEADER_BACKGROUND: string = "#f8f8fa";
        const DEFAULT_THEME_SWATCH_HEADER_BORDER_COLOR: string = "#e9e9e9";
        const DEFAULT_THEME_SWATCH_BACKGROUND_COLOR: string = "#F5F6F6";
        const DEFAULT_THEME_SWATCH_PRIMARY_COLOR: string = "#FF7300";
        const DEFAULT_THEME_SWATCH_SECONDARY_COLOR: string = "#616161";

        if (Object.prototype.hasOwnProperty.call(THEME_SWATCH_UI_CONFIGS, theme)) {
            return THEME_SWATCH_UI_CONFIGS[ theme ];
        }

        return {
            colors: {
                headerBackground: DEFAULT_THEME_SWATCH_HEADER_BACKGROUND,
                headerBorderColor: DEFAULT_THEME_SWATCH_HEADER_BORDER_COLOR,
                pageBackground: DEFAULT_THEME_SWATCH_BACKGROUND_COLOR,
                primary: DEFAULT_THEME_SWATCH_PRIMARY_COLOR,
                secondary: DEFAULT_THEME_SWATCH_SECONDARY_COLOR
            },
            displayName: "Light",
            type: PredefinedThemes.LIGHT
        };
    }

    /**
     * Get the list of themes in `themes` folder.
     *
     * @return {DynamicBrandingPreferenceThemeInterface}
     */
    public static getThemes(): DynamicBrandingPreferenceThemeInterface {
        return THEMES;
    }

    /**
     * Get a list of Web Safe Fonts.
     *
     * @return {string[]}
     */
    public static getWebSafeFonts(): string[] {

        return [
            "Arial",
            "Arial Black",
            "Verdana",
            "Tahoma",
            "Trebuchet MS",
            "Impact",
            "Times New Roman",
            "Didot",
            "Georgia",
            "American Typewriter",
            "Andalé Mono",
            "Courier",
            "Lucida Console ",
            "Monaco",
            "Bradley Hand",
            "Brush Script MT",
            "Luminari",
            "Comic Sans MS",
            BrandingPreferencesConstants.DEFAULT_FONT_FROM_THEME
        ];
    }

    /* eslint-disable max-len */
    /**
     * Get the theme skeleton.
     * @param {BrandingPreferenceThemeInterface} theme - Theme Config.
     * @return {string}
     */
    public static getThemeSkeleton(theme: BrandingPreferenceThemeInterface): string {

        const footerFontColor: string = !isEmpty(theme[ theme.activeTheme ].footer.font.color)
            ? theme[ theme.activeTheme ].footer.font.color
            : "inherit";
        const headingFontColor: string = !isEmpty(theme[ theme.activeTheme ].typography.heading.font.color)
            ? theme[ theme.activeTheme ].typography.heading.font.color
            : "inherit";
        const loginBoxFontColor = !isEmpty(theme[ theme.activeTheme ].loginBox.font.color)
            ? theme[ theme.activeTheme ].loginBox.font.color
            : "inherit";
        const inputBaseFontColor = !isEmpty(theme[ theme.activeTheme ].inputs.base.font.color)
            ? theme[ theme.activeTheme ].inputs.base.font.color
            : "inherit";
        const inputBaseLabelFontColor: string = !isEmpty(theme[ theme.activeTheme ].inputs.base.labels.font.color)
            ? theme[ theme.activeTheme ].inputs.base.labels.font.color
            : "inherit";

        return `
        ${theme[ theme.activeTheme ].typography.font.importURL
        ? `@import url(${ theme[ theme.activeTheme ].typography.font.importURL });`
        : ""}
            
        :root {
        --asg-primary-color: ${ theme[ theme.activeTheme ].colors.primary };
        --asg-secondary-color: ${ theme[ theme.activeTheme ].colors.secondary };
        --asg-primary-background-color: ${ theme[ theme.activeTheme ].page.background.backgroundColor };
        --asg-primary-text-color: ${ theme[ theme.activeTheme ].page.font.color };
        --asg-footer-text-color: ${ footerFontColor };
        --asg-footer-border-color: ${ theme[ theme.activeTheme ].footer.border.borderColor };
        --asg-primary-font-family: ${ theme[ theme.activeTheme ].typography.font.fontFamily };
        --asg-heading-text-color: ${ headingFontColor };
        --asg-primary-button-base-text-color: ${ theme[ theme.activeTheme ].buttons.primary.base.font.color };
        --asg-primary-button-base-border-radius: ${ theme[ theme.activeTheme ].buttons.primary.base.border.borderRadius };
        --asg-secondary-button-base-text-color: ${ theme[ theme.activeTheme ].buttons.secondary.base.font.color };
        --asg-secondary-button-base-border-radius: ${ theme[ theme.activeTheme ].buttons.secondary.base.border.borderRadius };
        --asg-external-login-button-base-background-color: ${ theme[ theme.activeTheme ].buttons.externalConnection.base.background.backgroundColor };
        --asg-external-login-button-base-text-color: ${ theme[ theme.activeTheme ].buttons.externalConnection.base.font.color };
        --asg-external-login-button-base-border-radius: ${ theme[ theme.activeTheme ].buttons.externalConnection.base.border.borderRadius };
        --asg-login-box-background-color: ${ theme[ theme.activeTheme ].loginBox.background.backgroundColor };
        --asg-login-box-border-color: ${ theme[ theme.activeTheme ].loginBox.border.borderColor };
        --asg-login-box-border-width: ${ theme[ theme.activeTheme ].loginBox.border.borderWidth };
        --asg-login-box-border-style: solid;
        --asg-login-box-border-radius: ${ theme[ theme.activeTheme ].loginBox.border.borderRadius };
        --asg-login-box-text-color: ${ loginBoxFontColor };
        --asg-input-field-base-text-color: ${ inputBaseFontColor };
        --asg-input-field-base-background-color: ${ theme[ theme.activeTheme ].inputs.base.background.backgroundColor };
        --asg-input-field-base-label-text-color: ${ inputBaseLabelFontColor };
        --asg-input-field-base-border-color: ${ theme[ theme.activeTheme ].inputs.base.border.borderColor };
        --asg-input-field-base-border-radius: ${ theme[ theme.activeTheme ].inputs.base.border.borderRadius };
    }

    /*-----------------------------
                Page
    ------------------------------*/

    /* Default Page */
    .login-portal.layout {
        color: var(--asg-primary-text-color);
        background: var(--asg-primary-background-color);
    }

    /* Default Page with Blurred Patch */
    .login-portal.layout .page-wrapper {
        background: var(--asg-primary-background-color);
    }

    /* Error, Success Pages */
    .login-portal.layout .page-wrapper.success-page, .login-portal.layout .page-wrapper.error-page {
        background: var(--asg-primary-background-color);
    }

    /*-----------------------------
                Typography
    ------------------------------*/

    .ui.header {
        color: var(--asg-heading-text-color);
    }

    /* Primary Text */
    .text-typography.primary {
        color: var(--asg-primary-color);
    }

    /*-----------------------------
                Icons
    ------------------------------*/

    /* Primary Icons */
    i.icon.primary {
        color: var(--asg-primary-color);
    }

    /*-----------------------------
                Buttons
    ------------------------------*/

    /* Primary */
    .ui.primary.button {
        background: var(--asg-primary-color);
        color: var(--asg-primary-button-base-text-color);
        border-radius: var(--asg-primary-button-base-border-radius);
    }

    .ui.primary.button:hover, .ui.primary.button:focus, .ui.primary.button:active {
        background: var(--asg-primary-color);
        filter: brightness(0.85);
    }

    /* Secondary */
    .ui.secondary.button {
        background: var(--asg-secondary-color);
        color: var(--asg-secondary-button-base-text-color);
        border-radius: var(--asg-secondary-button-base-border-radius);
    }

    .ui.secondary.button:hover, .ui.secondary.button:focus, .ui.secondary.button:active {
        background: var(--asg-secondary-color);
        filter: brightness(0.85);
    }

    /* External Connections */
    .login-portal.layout .center-segment>.ui.container>.ui.segment .social-login .ui.button {
        background: var(--asg-external-login-button-base-background-color);
        color: var(--asg-external-login-button-base-text-color);
        border-radius: var(--asg-external-login-button-base-border-radius);
    }

    .login-portal.layout .center-segment>.ui.container>.ui.segment .social-login .ui.button:hover,
    .login-portal.layout .center-segment>.ui.container>.ui.segment .social-login .ui.button:focus,
    .login-portal.layout .center-segment>.ui.container>.ui.segment .social-login .ui.button:active {
        background: var(--asg-external-login-button-base-background-color);
        filter: brightness(0.85);
    }

    /*-----------------------------
                Inputs
    ------------------------------*/

    /* Input */
    .ui.form input:not([type]), .ui.form input[type=date], .ui.form input[type=datetime-local], .ui.form input[type=email], .ui.form input[type=file], .ui.form input[type=number], .ui.form input[type=password], .ui.form input[type=search], .ui.form input[type=tel], .ui.form input[type=text], .ui.form input[type=time], .ui.form input[type=url],
    .ui.form .field.error input:not([type]), .ui.form .field.error input[type=date], .ui.form .field.error input[type=datetime-local], .ui.form .field.error input[type=email], .ui.form .field.error input[type=file], .ui.form .field.error input[type=number], .ui.form .field.error input[type=password], .ui.form .field.error input[type=search], .ui.form .field.error input[type=tel], .ui.form .field.error input[type=text], .ui.form .field.error input[type=time], .ui.form .field.error input[type=url], .ui.form .field.error select, .ui.form .field.error textarea, .ui.form .fields.error .field input:not([type]), .ui.form .fields.error .field input[type=date], .ui.form .fields.error .field input[type=datetime-local], .ui.form .fields.error .field input[type=email], .ui.form .fields.error .field input[type=file], .ui.form .fields.error .field input[type=number], .ui.form .fields.error .field input[type=password], .ui.form .fields.error .field input[type=search], .ui.form .fields.error .field input[type=tel], .ui.form .fields.error .field input[type=text], .ui.form .fields.error .field input[type=time], .ui.form .fields.error .field input[type=url], .ui.form .fields.error .field select, .ui.form .fields.error .field textarea,
    .ui.form .field.error input:not([type]):focus, .ui.form .field.error input[type=date]:focus, .ui.form .field.error input[type=datetime-local]:focus, .ui.form .field.error input[type=email]:focus, .ui.form .field.error input[type=file]:focus, .ui.form .field.error input[type=number]:focus, .ui.form .field.error input[type=password]:focus, .ui.form .field.error input[type=search]:focus, .ui.form .field.error input[type=tel]:focus, .ui.form .field.error input[type=text]:focus, .ui.form .field.error input[type=time]:focus, .ui.form .field.error input[type=url]:focus, .ui.form .field.error select:focus, .ui.form .field.error textarea:focus,
    .ui.form input:not([type]):focus, .ui.form input[type=date]:focus, .ui.form input[type=datetime-local]:focus, .ui.form input[type=email]:focus, .ui.form input[type=file]:focus, .ui.form input[type=number]:focus, .ui.form input[type=password]:focus, .ui.form input[type=search]:focus, .ui.form input[type=tel]:focus, .ui.form input[type=text]:focus, .ui.form input[type=time]:focus, .ui.form input[type=url]:focus,
    .ui.input.addon-wrapper,
    .ui.input.addon-wrapper:focus-within,
    .ui.selection.dropdown,
    .ui.selection.dropdown:hover {
        color: var(--asg-input-field-base-text-color);
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
        border-radius: var(--asg-input-field-base-border-radius);
    }

    /* Autofilled */
    .ui.form .field.field input:-webkit-autofill {
        color: var(--asg-input-field-base-text-color) !important;
        -webkit-text-fill-color: var(--asg-input-field-base-text-color) !important;
        box-shadow: 0 0 0 100px var(--asg-input-field-base-background-color) inset!important;
        -webkit-box-shadow: 0 0 0 100px var(--asg-input-field-base-background-color) inset!important;
        border-color: var(--asg-input-field-base-border-color) !important;
    }

    /* Autofilled:Focus */
    .ui.form .field.field input:-webkit-autofill:focus {
        color: var(--asg-input-field-base-text-color) !important;
        -webkit-text-fill-color: var(--asg-input-field-base-text-color) !important;
        box-shadow: 0 0 0 100px var(--asg-input-field-base-background-color) inset!important;
        -webkit-box-shadow: 0 0 0 100px var(--asg-input-field-base-background-color) inset!important;
        border-color: var(--asg-input-field-base-border-color) !important;
    }

    /* Autofilled:Error */
    .ui.form .error.error input:-webkit-autofill {
        color: var(--asg-input-field-base-text-color) !important;
        -webkit-text-fill-color: var(--asg-input-field-base-text-color) !important;
        box-shadow: 0 0 0 100px var(--asg-input-field-base-background-color) inset!important;
        -webkit-box-shadow: 0 0 0 100px var(--asg-input-field-base-background-color) inset!important;
        border-color: var(--asg-input-field-base-border-color) !important;
    }

    /* Input Labels */
    .ui.form .field>label {
        color: var(--asg-input-field-base-label-text-color);
    }

    /* Input Addon Icons */
    .ui.form .field .ui.input {
        color: var(--asg-input-field-base-text-color);
    }

    /* Dropdowns */
    .ui.selection.active.dropdown .menu {
        background: var(--asg-input-field-base-border-color);
    }

    .ui.selection.dropdown .menu>.item {
        color: var(--asg-input-field-base-text-color);
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
    }

    /* Checkbox */
    .ui.checkbox .box:before, .ui.checkbox label:before {
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.checkbox input:focus~.box:before, .ui.checkbox input:focus~label:before {
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.checkbox input:checked:focus~.box:before, .ui.checkbox input:checked:focus~label:before, .ui.checkbox input:not([type=radio]):indeterminate:focus~.box:before, .ui.checkbox input:not([type=radio]):indeterminate:focus~label:before {
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.checkbox input:checked~label:before {
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.checkbox .box:hover::before, .ui.checkbox label:hover::before {
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.checkbox input:checked~.box:after, .ui.checkbox input:checked~label:after {
        color: var(--asg-input-field-base-text-color);
    }

    .ui.checkbox input:checked:focus~.box:after, .ui.checkbox input:checked:focus~label:after, .ui.checkbox input:not([type=radio]):indeterminate:focus~.box:after, .ui.checkbox input:not([type=radio]):indeterminate:focus~label:after {
        color: var(--asg-input-field-base-text-color);
    }

    /*-----------------------------
            Login Box
    ------------------------------*/

    .login-portal.layout .center-segment>.ui.container>.ui.segment {
        background: var(--asg-login-box-background-color);
        border-width: var(--asg-login-box-border-width) !important;
        border-color: var(--asg-login-box-border-color);
        border-style: var(--asg-login-box-border-style);
        border-radius: var(--asg-login-box-border-radius);
        color: var(--asg-login-box-text-color);
    }

    .login-portal.layout .external-link-container.text-small {
       color: var(--asg-login-box-text-color);
    }

    .login-portal.layout .center-segment>.ui.container>.ui.segment .ui.checkbox label,
    .login-portal.layout .center-segment>.ui.container>.ui.segment .ui.checkbox+label {
        color: var(--asg-input-field-base-label-text-color);
    }

    .login-portal.layout .center-segment>.ui.container> .ui.bottom.attached.message {
        border-bottom-right-radius: var(--asg-login-box-border-radius);
        border-bottom-left-radius: var(--asg-login-box-border-radius);
    }

    /* Login Box Links */
    .login-portal.layout .clickable-link {
        color: var(--asg-primary-color);
    }

    /* Misc Text */
    .ui.divider {
        color: var(--asg-login-box-text-color);
    }

    .login-portal.layout .portal-tagline-description {
        color: var(--asg-login-box-text-color);
    }

    .login-portal.layout .center-segment>.ui.container>.ui.segment .ui.list .list > .item .header, .ui.list > .item .header {
        color: var(--asg-login-box-text-color);
    }

    .login-portal.layout .center-segment>.ui.container>.ui.segment .login-portal-app-consent-request {
        color: var(--asg-login-box-text-color);
    }

    /*-----------------------------
         Login Screen Footer
    ------------------------------*/

    .login-portal.layout .footer {
        border-color: var(--asg-footer-border-color);
    }

    .login-portal.layout .footer .ui.text.menu .item {
        color: var(--asg-footer-text-color);
    }

    .login-portal.layout .footer .ui.text.menu .item:not(.no-hover):hover {
        color: var(--asg-primary-color);
    }

    /*-----------------------------
            Anchor Tags
    ------------------------------*/

    /* Anchor Tags */
    a {
        color: var(--asg-primary-color);
    }

    a:hover, a:focus, a:active {
        color: var(--asg-primary-color);
        filter: brightness(0.85);
    }
    /*-----------------------------
            Fonts
    ------------------------------*/

    /* Body */
    body {
        font-family: var(--asg-primary-font-family);
    }

    /* Headings */
    h1,
    h2,
    h3,
    h4,
    h5 {
        font-family: var(--asg-primary-font-family);
    }

    .ui.header {
        font-family: var(--asg-primary-font-family);
    }

    /* Inputs */
    .ui.form input:not([type]),
    .ui.form input[type="date"],
    .ui.form input[type="datetime-local"],
    .ui.form input[type="email"],
    .ui.form input[type="number"],
    .ui.form input[type="password"],
    .ui.form input[type="search"],
    .ui.form input[type="tel"],
    .ui.form input[type="time"],
    .ui.form input[type="text"],
    .ui.form input[type="file"],
    .ui.form input[type="url"] {

        font-family: var(--asg-primary-font-family);
    }

    .ui.input > input {
        font-family: var(--asg-primary-font-family);
    }

    /* Search */
    .ui.search > .results .result .title {
        font-family: var(--asg-primary-font-family);
    }

    .ui.search > .results > .message .header {
        font-family: var(--asg-primary-font-family);
    }

    .ui.category.search > .results .category > .name {
        font-family: var(--asg-primary-font-family);
    }

    /* Menus */
    .ui.menu {
        font-family: var(--asg-primary-font-family);
    }

    /* Message */
    .ui.message .header {
        font-family: var(--asg-primary-font-family);
    }

    /* Table */
    .ui.sortable.table thead th:after {
        font-family: var(--asg-primary-font-family);
    }

    /* Button */
    .ui.button {
        font-family: var(--asg-primary-font-family);
    }

    /* Text Container */
    .ui.text.container {
        font-family: var(--asg-primary-font-family);
    }

    /* List */
    .ui.list .list > .item .header,
    .ui.list > .item .header {
        font-family: var(--asg-primary-font-family);
    }

    /* Steps */
    .ui.steps .step .title {
        font-family: var(--asg-primary-font-family);
    }

    /* Accordion */
    .ui.accordion .title:not(.ui) {
        font-family: var(--asg-primary-font-family);
    }

    /* Modal */
    .ui.modal > .header {
        font-family: var(--asg-primary-font-family);
    }

    /* Popup */
    .ui.popup > .header {
        font-family: var(--asg-primary-font-family);
    }

    /* Cards */
    .ui.cards > .card > .content > .header,
    .ui.card > .content > .header {
        font-family: var(--asg-primary-font-family);
    }

    /* Items */
    .ui.items > .item > .content > .header {
        font-family: var(--asg-primary-font-family);
    }

    /* Statistics */
    .ui.statistics .statistic > .value,
    .ui.statistic > .value {
        font-family: var(--asg-primary-font-family);
    }`;
    }
    /* eslint-enable max-len */
}
