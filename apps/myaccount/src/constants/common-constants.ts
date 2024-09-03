/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Class containing common constants.
 */
export class CommonConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() {}

    /**
     * Key to get the set of seen announcements from pref storage.
     */
    public static readonly SEEN_ANNOUNCEMENTS_KEY: string = "identityAppsSettings.userPortal.announcements.seen";

    /**
     * The name of the personal info page.
     */
    public static readonly PERSONAL_INFO: string = "personal-info-";

    /**
     * The name of the security page.
     */
    public static readonly SECURITY: string = "security-";

    /**
     * The name of the account activity section.
     */
    public static readonly ACCOUNT_ACTIVITY: string = "account_activity";

    /**
     * The name of the account security section.
     */
    public static readonly ACCOUNT_SECURITY: string = "account_security";

    /**
     * The name of the consents control section.
     */
    public static readonly CONSENTS_CONTROL: string = "consents_control";

    /**
     * Session storage key to store session state.
     */
    public static readonly SESSION_STATE: string = "session_state";
}
