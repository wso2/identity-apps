/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * The default list item count on settings sections.
 * @constant
 * @type {number}
 * @default
 */
export const SETTINGS_SECTION_LIST_ITEMS_DEFAULT_COUNT = 5;

/**
 * The max list item count on settings sections.
 * @constant
 * @type {number}
 * @default
 */
export const SETTINGS_SECTION_LIST_ITEMS_MAX_COUNT = 1000;

/**
 * Desktop layout content top padding.
 * @constant
 * @type {number}
 * @default
 */
export const DESKTOP_CONTENT_TOP_PADDING = 50;

/**
 * Mobile layout content padding.
 * @constant
 * @type {string}
 * @default
 */
export const MOBILE_CONTENT_PADDING = "2rem 1rem";

/**
 * The maximum recent application count.
 * @constant
 * @type {number}
 * @default
 */
export const RECENT_APPLICATIONS_LIST_LIMIT = 3;

/**
 * Add local linked account form identifier.
 * @constant
 * @type {string}
 * @default
 */
export const ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER = "addLocalLinkedAccountForm";

/**
 * `Gravatar` website URL.
 * @constant
 * @type {string}
 * @default
 */
export const GRAVATAR_URL = "https://www.gravatar.com";

/**
 * Warning Account status upper limit.
 * @constant
 * @type {number}
 * @default
 */
export const WARNING_ACCOUNT_STATUS_UPPER_LIMIT = 70;

/**
 * Error Account status upper limit.
 * @constant
 * @type {number}
 * @default
 */
export const ERROR_ACCOUNT_STATUS_UPPER_LIMIT = 40;

/**
 * Class containing ui constants.
 */
export class UIConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Default theme of the portal.
     * @type {string}
     */
    public static readonly DEFAULT_THEME: string = "default";
}
