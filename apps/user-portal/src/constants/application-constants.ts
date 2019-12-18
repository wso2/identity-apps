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
 * Application settings key in local storage.
 * @constant
 * @type {string}
 * @default
 */
export const APPLICATION_SETTINGS_STORAGE_KEY: string = "application_settings";

/**
 * Primary user store identifier.
 * @constant
 * @type {string}
 * @default
 */
export const PRIMARY_USER_STORE_IDENTIFIER: string = "PRIMARY";

/**
 * Path to the login error page.
 * @constant
 * @type {string}
 * @default
 */
export const LOGIN_ERROR_PAGE_PATH: string = "/login-error";

/**
 * Path to the applications page.
 * @constant
 * @type {string}
 * @default
 */
export const APPLICATIONS_PAGE_PATH: string = "/applications";

/**
 * User portal application identifier.
 * @constant
 * @type {string}
 * @default
 */
export const USER_PORTAL_IDENTIFIER: string = "This is the user portal application.";

/**
 * Error description when the user selects no in the logout prompt
 * @constant
 * @type {string}
 * @default
 */
export const USER_DENIED_LOGOUT_REQUEST: string = "End User denied the logout request";

/**
 * Error description when the user denies consent to the app
 * @constant
 * @type {string}
 * @default
 */
export const USER_DENIED_CONSENT: string = "User denied the consent";
