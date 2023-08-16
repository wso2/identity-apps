/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AlertLevels, StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";
import { addAlert, setTenants } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import set from "lodash-es/set";
import { AppUtils } from "./app-utils";
import { getAssociatedTenants } from "../../../extensions/components/tenants/api";
import { TenantInfo, TenantRequestResponse } from "../../../extensions/components/tenants/models";
import { CommonConstants } from "../constants";
import { store } from "../store";

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
        if (!tenantDomain) {
            tenantDomain = store.getState()?.auth?.tenantDomain;
        }
        if (associatedTenants) {
            associatedTenants = store.getState()?.auth?.tenants;
        }

        if (!Array.isArray(associatedTenants)) {
            await getAssociatedTenants()
                .then((response: TenantRequestResponse) => {
                    associatedTenants = response?.associatedTenants;

                    store.dispatch(setTenants<TenantInfo>(response.associatedTenants));
                })
                .catch((error: any) => {
                    store.dispatch(
                        addAlert({
                            description:
                                error?.description &&
                                I18n.instance.t("extensions:manage.features.tenant.notifications."
                                    + "getTenants.description"),
                            level: AlertLevels.ERROR,
                            message:
                                error?.description &&
                                I18n.instance.t("extensions:manage.features.tenant.notifications."
                                    + "getTenants.message")
                        })
                    );
                });
        }

        if (!tenantDomain) {
            return {
                billingPortalURL: "",
                upgradeButtonURL: ""
            };
        }

        if (!Array.isArray(associatedTenants)) {
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
            billingPortalURL: window[ "AppUtils" ].getConfig()
                .extensions?.billingPortalUrl?.replace("${tenantId}", user.id),
            upgradeButtonURL: window[ "AppUtils" ].getConfig()
                .extensions?.upgradeButtonUrl?.replace("${tenantId}", user.id)
        };
    }
}
