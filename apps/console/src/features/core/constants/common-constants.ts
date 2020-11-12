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
 * Class containing common constants.
 */
export class CommonConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Key to get the set of seen announcements from pref storage.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly SEEN_ANNOUNCEMENTS_KEY: string = "identityAppsSettings.adminPortal.announcements.seen";

    /**
     * Session storage key to store session state.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly SESSION_STATE: string = "session_state";
}
