/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

/**
 * Model for danger zones.
 */
export interface DangerZone {
    actionTitle: string;
    header: string;
    subheader: string;
    subheader2?: string;
    buttonHint?: string;
    buttonDisableHint?: string;
}

/**
 * Model for pages
 */
export interface Page {
    title: string;
    subTitle: string;
}

/**
 * Model for edit pages.
 */
export interface EditPage extends Page {
    backButton: string;
}

/**
 * Model for notification set
 */
export interface Notification {
    error?: NotificationItem;
    genericError?: NotificationItem;
    success?: NotificationItem;
}

/**
 * Model for notification
 */
export interface NotificationItem {
    message: string;
    description: string;
}

/**
 * Model for confirmation boxes.
 */
export interface Confirmation {
    header: string;
    message: string;
    content: string;
    assertionHint: string;
}

/**
 * Model for placeholder.
 */
export interface Placeholder {
    action?: string;
    title: string;
    subtitles: string | PlaceholderSubtitle;
}

/**
 * Model for form attributes.
 */
export interface FormAttributes extends StrictFormAttributes {
    [ key: string ]: any;
    /**
     * This property holds a `optional` description for a form field
     * attribute. For example, if have have multiple radio button
     * groups as a "form field" then we would use this property to
     * explain the purpose of each each group.
     */
    description?: string;
    /**
     * This property holds an `alternate` error message for a form field
     * attribute if there are multiple validations.
     */
    errorMessage?: string;
}

/**
 * Model for strict form attributes.
 */
export interface StrictFormAttributes {
    actions?: FormAttributeActions;
    children?: FormAttributeChildren;
    hint?: string;
    label: string | Record<string, unknown>;
    placeholder?: string;
    ariaLabel?: string;
    validations?: {
        empty?: string;
        duplicate?: string;
        invalid?: string;
        required?: string;
        maxLengthReached?: string;
        range?: string;
    };
}

export interface FormAttributeChildren {
    [ key: string ]: FormAttributes;
}

export interface FormAttributeActions {
    [ key: string ]: string;
}

/**
 * Model for placeholder subtitle.
 */
interface PlaceholderSubtitle {
    [key: number]: string;
}

export interface HelpPanelInterface {
    tabs: HelpPanelTabsInterface;
}

export interface HelpPanelActionsInterface {
    [ key: string ]: string;
}

interface HelpPanelTabsInterface {
    [ key: string ]: HelpPanelTabInterface;
}

interface HelpPanelTabInterface {
    content: any;
    heading: string;
}

export interface FormField {
    label?: string;
    placeholder?: string;
    requiredErrorMessage?: string;
    validationErrorMessages?: {
        [ key: string ]: string;
    };
}

export interface TransferList {
    searchPlaceholders: TransferListSearchPlaceholders;
    headers: TransferListHeaders;
}

interface TransferListHeaders {
    [ key: string ]: any;
}

interface TransferListSearchPlaceholders {
    [ key: string ]: any;
}

/**
 * Interface for Modals.
 */
export interface ModalInterface {
    description: string;
    heading: string;
    content?: Record<string, unknown>;
    primaryButton: string;
    secondaryButton: string;
}

/**
 * Interface for Validations
 */
export interface ValidationInterface {
    heading: string;
    description: string;
}

/**
 * Interface for UI messages.
 */
export interface Message {
    heading: string;
    content: string;
}

/**
 * Interface for UI Popup.
 */
export interface Popup {
    content: string;
    header: string;
    subHeader: string;
}

/**
 * Interface for App Switch item.
 */
export interface AppSwitchItemInterface {
    name: string;
    description: string;
}
