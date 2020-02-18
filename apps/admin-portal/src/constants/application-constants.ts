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
 * Application settings key in local storage.
 * @constant
 * @type {string}
 * @default
 */
export const APPLICATION_SETTINGS_STORAGE_KEY = "application_settings";

/**
 * Primary user store identifier.
 * @constant
 * @type {string}
 * @default
 */
export const PRIMARY_USER_STORE_IDENTIFIER = "PRIMARY";

/**
 * Path to the login error page.
 * @constant
 * @type {string}
 * @default
 */
export const LOGIN_ERROR_PAGE_PATH = "/login-error";

/**
 * Path to the applications page.
 * @constant
 * @type {string}
 * @default
 */
export const APPLICATIONS_PAGE_PATH = "/applications";

/**
 * User portal application identifier.
 * @constant
 * @type {string}
 * @default
 */
export const USER_PORTAL_IDENTIFIER = "This is the user portal application.";

/**
 * Error description when the user denies consent to the app
 * @constant
 * @type {string}
 * @default
 */
export const USER_DENIED_CONSENT = "User denied the consent";

/**
 * Class containing app constants.
 */
export class ApplicationConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Paths for the application management config files.
     * @constant
     * @type {object}
     */
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public static readonly APPLICATION_MGT_CONFIG_PATHS: any = {
        META: "configs/application-mgt.meta.json"
    };
}

/**
 * Key of the time at which an auth error occurred in the session storage
 * @constant
 * @type {string}
 * @default
 */
export const AUTH_ERROR_TIME: string = "authErrorTime";
