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
 * Class containing common constants which can be used across several applications.
 */
export class CommonConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Generic Axios fetch request error message.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly AXIOS_FETCH_REQUEST_ERROR_MESSAGE: string = "An error occurred while executing the request";

    /**
     * Key which will appear on the URL to denote session timeout state.
     * This should be same as the key used in session management logic in `index.(jsp|html) files in portals.
     * @type {string}
     */
    public static readonly SESSION_TIMEOUT_WARNING_URL_SEARCH_PARAM_KEY: string = "session_timeout_warning";
    /**
     * The name of the event dispatched when authentication successful.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly AUTHENTICATION_SUCCESSFUL_EVENT: string = "authentication-successful";
}
