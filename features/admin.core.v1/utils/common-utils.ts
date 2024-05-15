/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import set from "lodash-es/set";
import { AppUtils } from "./app-utils";
import { AppConfigs } from "../configs";
import { CommonConstants } from "../constants";

/**
 * Utility class for common util operations.
 */
export class CommonUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Retrieve the set of seen announcements persisted in the storage.
     *
     * @returns - Seen announcements.
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
     * @param id - Id of the seen announcement.
     */
    public static setSeenAnnouncements(id: string): void {

        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        if (isEmpty(userPreferences)) {
            return;
        }

        const newPref: StorageIdentityAppsSettingsInterface = cloneDeep(userPreferences);
        const seen: any = get(userPreferences, CommonConstants.SEEN_ANNOUNCEMENTS_KEY, []);

        set(newPref, CommonConstants.SEEN_ANNOUNCEMENTS_KEY, [ ...seen, id ]);

        AppUtils.setUserPreferences(newPref);
    }

    public static async buildBillingURLs (tenantDomain?: string, associatedTenants?: any[]):
        Promise<{
            billingPortalURL: string;
            upgradeButtonURL: string;
        }> {

        if (!tenantDomain || !Array.isArray(associatedTenants)) {
            return {
                billingPortalURL: "",
                upgradeButtonURL: ""
            };
        }

        const user: Record<string, unknown> = associatedTenants.find(
            (tenant: any) => tenant.domain == tenantDomain
        );

        if (user?.associationType !== "MEMBER") {
            return {
                billingPortalURL: "",
                upgradeButtonURL: ""
            };
        }

        return {
            billingPortalURL: AppConfigs.getAppUtils().getConfig()
                .extensions?.billingPortalUrl?.replace("${tenantId}", user.id),
            upgradeButtonURL: AppConfigs.getAppUtils().getConfig()
                .extensions?.upgradeButtonUrl?.replace("${tenantId}", user.id)
        };
    }
}
