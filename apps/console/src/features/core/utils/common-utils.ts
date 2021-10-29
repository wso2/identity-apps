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
 *
 */

import { StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import set from "lodash-es/set";
import { AppUtils } from "./app-utils";
import { CommonConstants } from "../constants";

/**
 * Utility class for common util operations.
 */
export class CommonUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Retrieve the set of seen announcements persisted in the storage.
     *
     * @return {string[]} Seen announcements.
     */
    public static getSeenAnnouncements(): string[] {

        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        if (isEmpty(userPreferences)) {
            return;
        }

        return get(userPreferences, CommonConstants.SEEN_ANNOUNCEMENTS_KEY, []);
    }

    /**
     * Persists the seen announcement in the storage.
     *
     * @param {string} id - Id of the seen announcement.
     */
    public static setSeenAnnouncements(id: string): void {

        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        if (isEmpty(userPreferences)) {
            return;
        }

        const newPref: StorageIdentityAppsSettingsInterface = cloneDeep(userPreferences);
        const seen = get(userPreferences, CommonConstants.SEEN_ANNOUNCEMENTS_KEY, []);

        set(newPref, CommonConstants.SEEN_ANNOUNCEMENTS_KEY, [ ...seen, id ]);

        AppUtils.setUserPreferences(newPref);
    }
}
