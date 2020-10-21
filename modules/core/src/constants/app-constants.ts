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
 * Class containing app constants which can be used across several applications.
 */
export class AppConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Default name of the app config file.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly DEFAULT_APP_CONFIG_FILE_NAME: string = "app.config.json";

    /**
     * App config fetch error message.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly APP_CONFIG_FETCH_ERROR_MESSAGE: string = "An error occurred while fetching the " +
        "application config.";

    /**
     * The name of the console app.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly CONSOLE_APP: string = "console";

    /**
     * The name of the my account app.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly MY_ACCOUNT_APP: string = "my_account";
}
