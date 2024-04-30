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

import isEmpty from "lodash-es/isEmpty";
import { BrandingPreferenceThemeInterface } from "../models/branding-preferences";

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
        /* eslint-disable sort-keys */
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
        --asg-colors-primary-main: ${ theme[ theme.activeTheme ].colors.primary.main };
        --asg-colors-secondary-main: ${ theme[ theme.activeTheme ].colors.secondary.main };
        --asg-colors-background-body-main: ${ theme[ theme.activeTheme ].colors.background?.body?.main };
        --asg-colors-background-surface-main: ${ theme[ theme.activeTheme ].colors.background?.surface?.main };
        --asg-colors-background-surface-light: ${ theme[ theme.activeTheme ].colors.background?.surface?.light };
        --asg-colors-background-surface-dark: ${ theme[ theme.activeTheme ].colors.background?.surface?.dark };
        --asg-colors-background-surface-inverted: ${ theme[ theme.activeTheme ].colors.background?.surface?.inverted };
        --asg-colors-outlined-default: ${ theme[ theme.activeTheme ].colors.outlined?.default };
        --asg-colors-text-primary: ${ theme[ theme.activeTheme ].colors.text?.primary };
        --asg-colors-text-secondary: ${ theme[ theme.activeTheme ].colors.text?.secondary };
        --asg-colors-alerts-error-main: ${ theme[ theme.activeTheme ].colors.alerts?.error?.main };
        --asg-colors-alerts-neutral-main: ${ theme[ theme.activeTheme ].colors.alerts?.neutral?.main };
        --asg-colors-alerts-info-main: ${ theme[ theme.activeTheme ].colors.alerts?.info?.main };
        --asg-colors-alerts-warning-main: ${ theme[ theme.activeTheme ].colors.alerts?.warning?.main };
        --asg-colors-illustrations-primary-main: ${ theme[ theme.activeTheme ].colors.illustrations?.primary?.main };
        --asg-colors-illustrations-secondary-main: ${ theme[ theme.activeTheme ].colors.illustrations?.secondary?.main };
        --asg-colors-illustrations-accent1-main: ${ theme[ theme.activeTheme ].colors.illustrations?.accent1?.main };
        --asg-colors-illustrations-accent2-main: ${ theme[ theme.activeTheme ].colors.illustrations?.accent2?.main };
        --asg-colors-illustrations-accent3-main: ${ theme[ theme.activeTheme ].colors.illustrations?.accent3?.main };

        /* Components */
        --asg-footer-text-color: ${ footerFontColor };
        --asg-footer-border-color: ${ theme[ theme.activeTheme ].footer?.border?.borderColor || "var(--asg-colors-outlined-default)" };
        --asg-primary-font-family: ${ theme[ theme.activeTheme ].typography.font.fontFamily };
        --asg-heading-text-color: ${ headingFontColor };
        --asg-primary-button-base-text-color: ${ theme[ theme.activeTheme ].buttons.primary.base.font.color };
        --asg-primary-button-base-border-radius: ${ theme[ theme.activeTheme ].buttons.primary.base.border.borderRadius };
        --asg-secondary-button-base-text-color: ${ theme[ theme.activeTheme ].buttons.secondary.base.font.color };
        --asg-secondary-button-base-border-radius: ${ theme[ theme.activeTheme ].buttons.secondary.base.border.borderRadius };
        --asg-external-login-button-base-background-color: ${ theme[ theme.activeTheme ].buttons.externalConnection.base.background.backgroundColor };
        --asg-external-login-button-base-text-color: ${ theme[ theme.activeTheme ].buttons.externalConnection.base.font.color };
        --asg-external-login-button-base-border-radius: ${ theme[ theme.activeTheme ].buttons.externalConnection.base.border.borderRadius };
        --asg-login-box-background-color: ${ theme[ theme.activeTheme ].loginBox?.background?.backgroundColor || "var(--asg-colors-background-surface-main)" };
        --asg-login-box-border-color: ${ theme[ theme.activeTheme ].loginBox?.border?.borderColor || "var(--asg-colors-outlined-default)" };
        --asg-login-box-border-width: ${ theme[ theme.activeTheme ].loginBox.border.borderWidth };
        --asg-login-box-border-style: solid;
        --asg-login-box-border-radius: ${ theme[ theme.activeTheme ].loginBox.border.borderRadius };
        --asg-login-box-text-color: ${ loginBoxFontColor };
        --asg-login-page-background-color: ${ theme[ theme.activeTheme ].loginPage?.background?.backgroundColor || "var(--asg-colors-background-body-main)" };
        --asg-login-page-font-color: ${ theme[ theme.activeTheme ].loginPage?.font?.color || "var(--asg-colors-text-primary)" };
        --asg-input-field-base-text-color: ${ inputBaseFontColor || "var(--asg-colors-text-primary)" };
        --asg-input-field-base-background-color: ${ theme[ theme.activeTheme ].inputs.base.background.backgroundColor };
        --asg-input-field-base-label-text-color: ${ inputBaseLabelFontColor };
        --asg-input-field-base-border-color: ${ theme[ theme.activeTheme ].inputs.base.border.borderColor || "var(--asg-colors-outlined-default)" };
        --asg-input-field-base-border-radius: ${ theme[ theme.activeTheme ].inputs.base.border.borderRadius };
        --language-selector-background-color: var(--asg-login-page-background-color) !important;
        --language-selector-text-color: var(--asg-footer-text-color) !important;
        --language-selector-border-color: var(--asg-colors-primary-main) !important;

        /* Oxygen UI variables */
        --oxygen-palette-text-primary: ${ theme[ theme.activeTheme ].colors.text?.primary };
    }

    body {
        color: var(--asg-colors-text-primary);
        background: var(--asg-colors-background-body-main);
    }

    .oxygen-button {
        font-family: var(--asg-primary-font-family);
    }

    /*-----------------------------
            Anchor Tags
    ------------------------------*/

    /* Anchor Tags */
    a {
        color: var(--asg-colors-primary-main);
    }

    a:hover, a:focus, a:active {
        color: var(--asg-colors-primary-main);
        filter: brightness(0.85);
    }

    /*-----------------------------
             Pre Loader
    ------------------------------*/

    .pre-loader-wrapper {
        background: var(--asg-colors-background-body-main);
    }

    .ui.inverted.dimmer {
        background: var(--asg-colors-background-body-main);
    }

    /*-----------------------------
                Messages
    ------------------------------*/

    /* TODO: Remove the background color from .totp-tooltip */
    .ui.message, .ui.message.totp-tooltip {
        background-color: var(--asg-colors-alerts-neutral-main);
        color: var(--asg-colors-text-primary) !important;
    }

    .backup-code-label.info {
        background-color: var(--asg-colors-alerts-info-main) !important;
        color: var(--asg-colors-text-primary) !important;
    }

    .ui.message.info {
        background-color: var(--asg-colors-alerts-info-main) !important;
    }

    .ui.message.warning {
        background-color: var(--asg-colors-alerts-warning-main) !important;
    }

    .ui.message.error, .ui.negative.message {
        background-color: var(--asg-colors-alerts-error-main) !important;
    }

    /*-----------------------------
                Alert
    ------------------------------*/

    .alert-wrapper .notifications-wrapper .notification {
        background: var(--asg-colors-background-surface-main) !important;
        color: var(--asg-colors-text-primary) !important;
        border: 1px solid var(--asg-colors-outlined-default) !important;
    }

    .alert-wrapper .notifications-wrapper .notification .notification-message .alert-message .description {
        color: var(--asg-colors-text-secondary);
    }

    .alert-wrapper .notifications-wrapper .notification .notification-dismiss {
        color: var(--asg-colors-text-primary) !important;
    }

    /*-----------------------------
                Card
    ------------------------------*/

    .ui.card, .ui.cards>.card {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default);
    }

    .ui.card, .ui.card.settings-card {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default);
    }

    .ui.card>.extra, .ui.cards>.card>.extra, .ui.card.settings-card .extra-content {
        background: var(--asg-colors-background-surface-light);
    }

    .ui.card>.content, .ui.cards>.card>.content {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.card .meta, .ui.cards>.card .meta {
        color: var(--asg-colors-text-secondary);
    }

    /* Security Page Active Sessions Terminate panel */
    .ui.card.settings-card .top-action-panel {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-input-field-base-border-color);
    }

    /* Card Actions */
    .ui.card.settings-card .extra-content .action-button .action-button-text {
        color: var(--asg-colors-primary-main);
    }

    .ui.card.basic-card {
        border-color: var(--asg-colors-outlined-default);
    }

    /*-----------------------------
                Dropdown
    ------------------------------*/

    /* Avatar Modal Inner */
    .ui.dropdown .menu {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default);
        color: var(--asg-colors-text-primary);
    }
    .ui.dropdown .menu .selected.item, .ui.dropdown.selected {
        color: var(--asg-colors-text-primary);
    }

    /*-----------------------------
                Menu
    ------------------------------*/

    .ui.menu, .ui.vertical.menu {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.menu .dropdown.item .menu {
        background: var(--asg-colors-background-surface-main);
    }

    /*-----------------------------
                Modal
    ------------------------------*/

    .ui.modal, .ui.modal>.content {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.modal>.actions {
        background: var(--asg-colors-background-surface-light);
        border-color: var(--asg-colors-outlined-default);
    }

    .ui.modal>.header {
        color: var(--asg-colors-text-primary);
        background: var(--asg-colors-background-surface-light);
    }

    /*-----------------------------
                Segment
    ------------------------------*/

    .ui.segment {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.segment.edit-segment {
        background: var(--asg-colors-background-surface-light);
    }

    .ui.segment.emphasized.placeholder-container {
        background: var(--asg-colors-background-surface-main);
    }

    /*-----------------------------
                Icons
    ------------------------------*/

    /* Primary Icons */
    i.icon.primary {
        color: var(--asg-colors-primary-main);
    }

    .theme-icon
        background: var(--asg-colors-background-surface-light);
    }

    .theme-icon.bordered {
        border-color: var(--asg-colors-outlined-default);
    }

    .theme-icon.two-tone svg.icon .lighten-1 {
        filter: brightness(1.08);
    }

    .theme-icon.two-tone svg.icon .lighten-2 {
        filter: brightness(1.16);
    }

    .theme-icon.two-tone svg.icon .darken-1 {
        filter: brightness(0.9);
    }

    .theme-icon.two-tone svg.icon .darken-2 {
        filter: brightness(0.7);
    }

    .theme-icon.two-tone svg.icon .opacity-80 {
        opacity: 0.8;
    }

    .theme-icon.two-tone svg.icon .opacity-60 {
        opacity: 0.6;
    }

    .theme-icon.two-tone svg.icon .fill.primary, .theme-icon.two-tone svg.icon .fill-primary {
        fill: var(--asg-colors-illustrations-primary-main);
    }

    .theme-icon.two-tone svg.icon .stroke.primary, .theme-icon.two-tone svg.icon .stroke-primary {
        stroke: var(--asg-colors-illustrations-primary-main);
    }

    .theme-icon.two-tone svg.icon .fill.secondary, .theme-icon.two-tone svg.icon .fill-secondary {
        fill: var(--asg-colors-illustrations-secondary-main);
    }

    .theme-icon.two-tone svg.icon .stroke.secondary, .theme-icon.two-tone svg.icon .stroke-secondary {
        stroke: var(--asg-colors-illustrations-secondary-main);
    }

    .theme-icon.two-tone svg.icon .fill.accent1, .theme-icon.two-tone svg.icon .fill-accent1 {
        fill: var(--asg-colors-illustrations-accent1-main);
    }

    .theme-icon.two-tone svg.icon .stroke.accent1, .theme-icon.two-tone svg.icon .stroke-accent1 {
        stroke: var(--asg-colors-illustrations-accent1-main);
    }

    .theme-icon.two-tone svg.icon .fill.accent2, .theme-icon.two-tone svg.icon .fill-accent2 {
        fill: var(--asg-colors-illustrations-accent2-main);
    }

    .theme-icon.two-tone svg.icon .stroke.accent2, .theme-icon.two-tone svg.icon .stroke-accent2 {
        stroke: var(--asg-colors-illustrations-accent2-main);
    }

    .theme-icon.two-tone svg.icon .fill.accent3, .theme-icon.two-tone svg.icon .fill-accent3 {
        fill: var(--asg-colors-illustrations-accent3-main);
    }

    .theme-icon.two-tone svg.icon .stroke.accent3, .theme-icon.two-tone svg.icon .stroke-accent3 {
        stroke: var(--asg-colors-illustrations-accent3-main);
    }

    /*-----------------------------
             Placeholder
    ------------------------------*/

    .ui.placeholder, .ui.placeholder .image.header:after, .ui.placeholder .line, .ui.placeholder .line:after, .ui.placeholder>:before {
        background-color: var(--asg-colors-background-surface-main);
    }

    /*-----------------------------
                Typography
    ------------------------------*/

    /* ------  Font Family ------ */

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
    }

    /* ------  Font Colors ------ */

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
    }

    .ui.vertical.menu.side-panel .side-panel-item .route-name {
        color: var(--asg-colors-text-primary);
    }

    .empty-placeholder .subtitle {
        color: var(--asg-colors-text-secondary);
    }

    .ui.list .list>.item .header, .ui.list>.item .header {
        color: var(--asg-colors-text-primary);
    }

    .ui.header {
        color: var(--asg-heading-text-color);
    }

    /* Primary Text */
    .text-typography.primary {
        color: var(--asg-colors-primary-main);
    }

    .hint-description {
        color: var(--asg-colors-text-secondary) !important;
    }

    .ui.items>.item.application-list-item .text-content-container .item-description {
        color: var(--asg-colors-text-secondary);
    }

    .ui.card.application-card.recent .application-content .text-content-container .application-name {
        color: var(--asg-colors-text-primary);
    }

    .ui.card.application-card.recent .application-content .text-content-container .application-description {
        color: var(--asg-colors-text-secondary);
    }

    /*-----------------------------
                Buttons
    ------------------------------*/

    /* Primary */
    .ui.primary.button:not(.basic) {
        background: var(--asg-colors-primary-main) !important;
        color: var(--asg-primary-button-base-text-color);
        border-radius: var(--asg-primary-button-base-border-radius);
    }

    .ui.primary.button:not(.basic):hover,
    .ui.primary.button:not(.basic):focus,
    .ui.primary.button:not(.basic):active {
        background: var(--asg-colors-primary-main) !important;
        filter: brightness(0.85);
    }

    /* Secondary */
    .ui.secondary.button {
        background: var(--asg-colors-secondary-main);
        color: var(--asg-secondary-button-base-text-color);
        border-radius: var(--asg-secondary-button-base-border-radius);
    }

    .ui.secondary.button:hover, .ui.secondary.button:focus, .ui.secondary.button:active {
        background: var(--asg-colors-secondary-main);
        filter: brightness(0.85);
    }

    /* Basic Button */
    .ui.basic.button, .ui.basic.buttons .button {
        color: var(--asg-colors-text-primary) !important;
        background: transparent !important;
    }

    .ui.basic.button:hover, .ui.basic.button:focus, .ui.basic.button:active, .ui.basic.buttons .button:hover, .ui.basic.buttons .button:active, .ui.basic.buttons .button:focus {
        color: var(--asg-colors-text-primary) !important;
        background: transparent !important;
    }

    .ui.basic.button.show-more-button {
        box-shadow: 0 0 0 1px var(--asg-colors-outlined-default) inset;
    }

    .ui.basic.button.show-more-button .arrow.down.icon {
        border-left: 1px solid var(--asg-colors-outlined-default);
    }

    .ui.basic.primary.button, .ui.basic.primary.buttons .button {
        color: var(--asg-colors-primary-main) !important;
        border-radius: var(--asg-primary-button-base-border-radius);
    }

    .ui.basic.primary.button:hover, .ui.basic.primary.buttons .button:hover {
        color: var(--asg-colors-primary-main) !important;
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

    /* Input calendar icon */
    .ui.calendar .ui.input.left.icon .calendar.icon {
        color: var(--asg-input-field-base-text-color);
    }

    /* Input Readonly */
    .ui.form input[readonly] {
        background: var(--asg-input-field-base-background-color) !important;
        filter: brightness(0.85);
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

    .ui.checkbox label, .ui.checkbox+label {
        color: var(--asg-input-field-base-label-text-color);
    }

    .ui.checkbox label:hover, .ui.checkbox+label:hover {
        color: var(--asg-input-field-base-label-text-color);
    }

    .ui.checkbox input:focus~label {
        color: var(--asg-input-field-base-label-text-color);
    }

    /* Input Addons */
    .addon-field-wrapper .ui.input {
        border-color: var(--asg-input-field-base-border-color);
    }

    .addon-field-wrapper .ui.input:focus-within {
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.input>input {
        color: var(--asg-input-field-base-text-color);
    }

    .advanced-search-wrapper .ui.input.advanced-search {
        color: var(--asg-input-field-base-text-color);
    }

    .advanced-search-wrapper.fill-white .ui.input.advanced-search.with-add-on {
        border-color: var(--asg-input-field-base-border-color);
    }

    .advanced-search-wrapper.fill-white .ui.input.advanced-search.with-add-on input {
        color: var(--asg-input-field-base-text-color);
        background: var(--asg-input-field-base-background-color);
        border-radius: var(--asg-input-field-base-border-radius);
    }

    .advanced-search-wrapper.fill-white .ui.input.advanced-search.with-add-on .input-add-on {
        background: var(--asg-input-field-base-background-color) !important;
        border: 1px solid transparent;
    }

    .ui.input.advanced-search.with-add-on .ui.icon.input>i.icon {
        color: var(--asg-input-field-base-text-color);
    }

    .advanced-search-wrapper.fill-white .ui.input.advanced-search.with-add-on .input-add-on:active {
        background: var(--asg-input-field-base-background-color) !important;
    }

    /* Labeled Inputs */
    .ui.labeled.input>.label {
        background: var(--asg-input-field-base-background-color);
        color: var(--asg-colors-text-secondary);
        border: 1px solid var(--asg-input-field-base-border-color);
    }

    .ui[class*="right labeled"].input>input:focus {
        border-color: var(--asg-input-field-base-border-color) !important;;
    }

    /* Error Labels */
    .ui.form .field .prompt.label {
        color: var(--asg-colors-text-primary);
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default);
    }

    /*-----------------------------
                Popup
    ------------------------------*/

    .ui.popup {
        color: var(--asg-colors-text-primary);
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default);
    }

    .ui.bottom.popup:before, .ui.top.popup:before, .ui.left.popup:before, .ui.right.popup:before, .ui.left.center.popup:before, .ui.right.center.popup:before {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.popup:before {
        box-shadow: 1px 1px 0 0 var(--asg-colors-outlined-default);
    }

    .ui.bottom.left.popup:before, .ui.bottom.center.popup:before, .ui.bottom.right.popup:before {
        box-shadow: -1px -1px 0 0 var(--asg-colors-outlined-default);
    }

    .ui.left.center.popup:before {
        box-shadow: 1px -1px 0 0 var(--asg-colors-outlined-default);
    }

    .ui.right.center.popup:before {
        box-shadow: -1px 1px 0 0 var(--asg-colors-outlined-default);
    }

    /*-----------------------------
            Login Screens
    ------------------------------*/

    /* ------  Login Page ------ */

    /* Default Page */
    .login-portal.layout {
        color: var(--asg-login-page-font-color);
        background: var(--asg-login-page-background-color);
    }

    /* Default Page with Blurred Patch */
    .login-portal.layout .page-wrapper {
        background: var(--asg-login-page-background-color);
    }

    /* Error, Success Pages */
    .login-portal.layout .page-wrapper.success-page, .login-portal.layout .page-wrapper.error-page {
        background: var(--asg-login-page-background-color);
    }

    /* ------  Login Box ------ */

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
        color: var(--asg-colors-primary-main);
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

    /* ------  Login Footer ------ */

    .login-portal.layout .footer {
        border-color: var(--asg-footer-border-color);
    }

    .login-portal.layout .footer .ui.text.menu .item {
        color: var(--asg-footer-text-color);
    }

    .login-portal.layout .footer .ui.text.menu .item:not(.no-hover):hover {
        color: var(--asg-colors-primary-main);
    }

    /*-----------------------------
              My Account
    ------------------------------*/

    .recovery-options-muted-header {
        background: var(--asg-colors-background-surface-dark);
        color: var(--asg-colors-text-secondary);
    }

    /* ------  My Account Side Panel ------ */

    .ui.vertical.menu.side-panel {
        background: var(--asg-colors-background-body-main);
    }

    /* ------  My Account Header ------ */

    .ui.menu.app-header {
        background: var(--asg-colors-background-surface-inverted);
        border-color: var(--asg-colors-outlined-default);
    }

    .ui.pointing.dropdown>.menu:after {
        background: var(--asg-colors-background-surface-main);
        box-shadow: -1px -1px 0 0 var(--asg-colors-outlined-default);
    }

    .ui.menu .user-dropdown .user-dropdown-menu .organization-label {
        background: var(--asg-colors-alerts-info-main);
        color: var(--asg-colors-text-secondary);
    }

    /* ------  My Account Footer ------ */

    .ui.menu.app-footer {
        background: var(--asg-colors-background-body-main);
        border-color: var(--asg-colors-outlined-default);
    }

    .ui.menu.app-footer {
        color: var(--asg-colors-text-secondary);
    }

    .ui.menu.app-footer .ui.menu .item.copyright {
        color: var(--asg-colors-text-secondary);
    }

    .ui.segment.cookie-consent-banner.inverted {
        border: 1px solid var(--asg-colors-outlined-default);
        background: var(--asg-colors-background-surface-inverted);
    }

    .ui.menu.app-footer .footer-dropdown .dropdown-trigger.link, .ui.menu.app-footer .footer-link {
        color: var(--asg-colors-text-primary);
    }

    .ui.menu.app-footer .footer-dropdown .dropdown.icon {
        color: var(--asg-colors-text-primary);
    }

    /* ------  My Account Applications ------ */

    .ui.items>.item.application-list-item {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.items>.item.application-list-item .text-content-container .item-header {
        color: var(--asg-colors-text-primary);
    }

    .ui.image.app-image.app-avatar.default-app-icon .initials {
        color: var(--asg-colors-primary-main);
    }

    .ui.card.application-card.recent .application-image.default {
        background: var(--asg-colors-background-surface-light);
    }

    .ui.items>.item.application-list-item {
        border-color: var(--asg-colors-outlined-default);
    }`;
    }
}
