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

import isEmpty from "lodash-es/isEmpty";
import { BrandingPreferenceThemeInterface } from "../models";

/**
 * Class for the Branding Preference Metadata.
 */
export class BrandingPreferenceMeta {
    /* eslint-disable max-len */
    /**
     * Get the theme skeleton.
     * @param theme - Theme Config.
     * @returns Theme Skeleton
     */
    public static getThemeSkeleton(theme: BrandingPreferenceThemeInterface): string {

        if (!theme) {
            return;
        }

        const footerFontColor: string = !isEmpty(theme[ theme.activeTheme ].footer.font.color)
            ? theme[ theme.activeTheme ].footer.font.color
            : "inherit";
        const headingFontColor: string = !isEmpty(theme[ theme.activeTheme ].typography.heading.font.color)
            ? theme[ theme.activeTheme ].typography.heading.font.color
            : "inherit";
        const loginBoxFontColor: string = !isEmpty(theme[ theme.activeTheme ].loginBox.font.color)
            ? theme[ theme.activeTheme ].loginBox.font.color
            : "inherit";
        const inputBaseFontColor: string = !isEmpty(theme[ theme.activeTheme ].inputs.base.font.color)
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
        --asg-colors-background-body-main: ${ theme[ theme.activeTheme ].colors.background.body.main };
        --asg-colors-background-surface-main: ${ theme[ theme.activeTheme ].colors.background.surface.main };
        --asg-colors-background-surface-light: ${ theme[ theme.activeTheme ].colors.background.surface.light };
        --asg-colors-background-surface-dark: ${ theme[ theme.activeTheme ].colors.background.surface.dark };
        --asg-colors-outlined-default-main: ${ theme[ theme.activeTheme ].colors.outlined.default };
        --asg-colors-text-primary: ${ theme[ theme.activeTheme ].colors.text.primary };
        --asg-colors-text-secondary: ${ theme[ theme.activeTheme ].colors.text.secondary };
        --asg-colors-action-hover: ${ theme[ theme.activeTheme ].colors.action.hover };
        --asg-colors-alerts-neutral-main: ${ theme[ theme.activeTheme ].colors.alerts.neutral.main };
        --asg-colors-alerts-info-main: ${ theme[ theme.activeTheme ].colors.alerts.info.main };
        --asg-colors-alerts-warning-main: ${ theme[ theme.activeTheme ].colors.alerts.warning.main };

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

    .pre-loader-wrapper {
        background: var(--asg-colors-background-body-main);
    }

    /* Body */
    body {
        color: var(--asg-colors-text-primary);
        background: var(--asg-colors-background-body-main);
    }

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
                Messages
    ------------------------------*/

    /* TODO: Remove the nackground color from .totp-tooltip */
    .ui.message, .ui.message.totp-tooltip {
        background-color: var(--asg-colors-alerts-neutral-main);
        color: var(--asg-colors-text-primary) !important;
    }

    .ui.message.info {
        background-color: var(--asg-colors-alerts-info-main) !important;
    }

    .ui.message.warning {
        background-color: var(--asg-colors-alerts-warning-main) !important;
    }

    /*-----------------------------
                Surfaces
    ------------------------------*/

    .ui.card, .ui.cards>.card {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default-main);
    }

    .ui.card, .ui.card.settings-card {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default-main);
    }

    .ui.card>.extra, .ui.cards>.card>.extra {
        background: var(--asg-colors-background-surface-light);
    }

    .ui.card .meta, .ui.cards>.card .meta {
        color: var(--asg-colors-text-secondary);
    }

    /* Avatar Modal Inner */
    .ui.dropdown .menu {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default-main);
        color: var(--asg-colors-text-primary);
    }
    .ui.dropdown .menu .selected.item, .ui.dropdown.selected {
        color: var(--asg-colors-text-primary);
    }

    .ui.menu, .ui.vertical.menu {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.menu .dropdown.item .menu {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.modal, .ui.modal>.content {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.modal>.actions {
        background: var(--asg-colors-background-surface-light);
        border-color: var(--asg-colors-outlined-default-main);
    }

    .ui.segment.edit-segment {
        background: var(--asg-colors-background-surface-dark);
    }

    .ui.modal>.header {
        color: var(--asg-colors-text-primary);
        background: var(--asg-colors-background-surface-light);
    }

    .ui.checkbox label, .ui.checkbox+label {
        color: var(--asg-input-field-base-label-text-color);
    }

    .ui.checkbox label:hover, .ui.checkbox+label:hover {
        color: var(--asg-input-field-base-label-text-color);
    }

    .ui.checkbox input:focus~label {
        color: var(--asg-input-field-base-label-text-color);
    }

    .ui.basic.primary.button, .ui.basic.primary.buttons .button {
        color: var(--asg-secondary-color) !important;
        border-radius: var(--asg-primary-button-base-border-radius);
    }

    .ui.basic.primary.button:hover, .ui.basic.primary.buttons .button:hover {
        color: var(--asg-primary-color) !important;
        filter: brightness(0.85);
    }

    .ui.basic.button, .ui.basic.buttons .button {
        color: var(--asg-colors-text-primary) !important;
        background: transparent !important;
    }

    .ui.basic.button:hover, .ui.basic.button:focus, .ui.basic.button:active, .ui.basic.buttons .button:hover, .ui.basic.buttons .button:active, .ui.basic.buttons .button:focus {
        color: var(--asg-colors-text-secondary) !important;
        background: transparent !important;
    }

    .ui.basic.button.session-detail-extension-button {
        border: 1px solid var(--asg-colors-outlined-default-main);
    }

    .ui.basic.button.session-detail-extension-button .arrow.down.icon {
        border-left: 1px solid var(--asg-colors-outlined-default-main);
    }

    /* Security Page Active Sessions Terminate panel */
    .ui.card.settings-card .top-action-panel {
        background: var(--asg-colors-background-surface-main);
        border: 1px solid var(--asg-input-field-base-border-color);
    }

    /*-----------------------------
                No Cat
    ------------------------------*/

    .theme-icon.two-tone svg.icon .fill.primary {
        fill: var(--asg-primary-color);
    }

    .theme-icon.two-tone svg.icon .stroke.primary {
        stroke: var(--asg-primary-color);
    }

    .theme-icon.two-tone svg.icon .fill.secondary {
        fill: var(--asg-primary-color);
        filter: brightness(0.3);
    }

    .addon-field-wrapper .ui.input {
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.segment.emphasized.placeholder-container {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.placeholder, .ui.placeholder .image.header:after, .ui.placeholder .line, .ui.placeholder .line:after, .ui.placeholder>:before {
        background-color: var(--asg-colors-background-surface-main);
    }

    .addon-field-wrapper .ui.input:focus-within {
        border-color: var(--asg-input-field-base-border-color);
    }

    /*-----------------------------
                Typography
    ------------------------------*/

    .ui.table {
        color: var(--asg-colors-text-primary);
    }

    /* My Account session table */
    .ui.table.session-table {
        color: var(--asg-colors-text-secondary);
    }

    .ui.header .sub.header {
        color: var(--asg-colors-text-secondary);
    }

    .ui.list .list>.item .description, .ui.list>.item .description {
        color: var(--asg-colors-text-secondary);
    }

    .text-typography {
        color: var(--asg-colors-text-primary);
    }

    .ui.menu .item {
        color: var(--asg-colors-text-primary);
    }

    .ui.items>.item>.content>.description {
        color: var(--asg-colors-text-primary);
    }

    /* '!important' is used from Semantic UI's side */
    .ui.menu .ui.dropdown .menu>.item {
        color: var(--asg-colors-text-primary) !important;
    }

    .ui.menu .ui.dropdown .menu>.item:hover {
        color: var(--asg-colors-text-primary) !important;
        background: var(--asg-colors-action-hover) !important;
    }

    .ui.vertical.menu.side-panel .side-panel-item .route-name {
        color: var(--asg-colors-text-primary);
    }

    /*-----------------------------
        My Account Side Panel
    ------------------------------*/

    .ui.vertical.menu.side-panel {
        background: var(--asg-colors-background-body-main);
    }

    /*-----------------------------
        My Account Header
    ------------------------------*/

    .ui.menu.app-header {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default-main);
    }

    /*-----------------------------
        My Account Footer
    ------------------------------*/

    .ui.menu.app-footer {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default-main);
    }

    .ui.menu.app-footer {
        color: var(--asg-colors-text-secondary);
    }

    .ui.menu.app-footer .ui.menu .item.copyright {
        color: var(--asg-colors-text-secondary);
    }

    .ui.segment.cookie-consent-banner.inverted {
        border-color: var(--asg-colors-outlined-default-main);
        background: var(--asg-colors-background-surface-main);
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

    /* Card Actions */
    .ui.card.settings-card .extra-content .action-button .action-button-text {
        color: var(--asg-primary-color);
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
