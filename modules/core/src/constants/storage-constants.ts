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
 * Class containing constants used to store user preferences.
 */
export class StorageConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Identity apps key in local storage.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly IDENTITY_APPS_KEY: string = "identityAppsSettings";

    /**
     * User preferences key in local storage.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly USER_PREFERENCE: string = "userPreferences";

    /**
     * Application preferences key in local storage.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly APP_PREFERENCE: string = "applicationPreferences";
}
