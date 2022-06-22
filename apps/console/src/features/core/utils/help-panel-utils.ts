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

import { AlertLevels, StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import { AppUtils } from "./app-utils";
import { store } from "../store";

/**
 * Utility class for help panel operations..
 */
export class HelpPanelUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Checks if the side panel is pinned.
     *
     * @return {boolean}
     */
    public static isPanelPinned(): boolean {

        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        if (isEmpty(userPreferences)) {
            return false;
        }

        if (isEmpty(userPreferences)
            || !userPreferences.identityAppsSettings?.devPortal?.helpPanel
            || userPreferences.identityAppsSettings.devPortal.helpPanel.isPinned === undefined) {

            return false;
        }

        return userPreferences.identityAppsSettings.devPortal.helpPanel.isPinned;
    }

    /**
     * Persist the pin/unpin status of the help panel.
     */
    public static togglePanelPin(): void {

        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        if (isEmpty(userPreferences)) {
            return;
        }

        const isPinned = userPreferences?.identityAppsSettings?.devPortal?.helpPanel?.isPinned;

        if (isPinned === undefined) {
            return;
        }

        const newPref: StorageIdentityAppsSettingsInterface = cloneDeep(userPreferences);

        newPref.identityAppsSettings.devPortal.helpPanel.isPinned = !isPinned;

        AppUtils.setUserPreferences(newPref);

        store.dispatch(addAlert({
            description: I18n.instance.t("console:develop.features.helpPanel.notifications.pin.success.description",
                { state: isPinned ? I18n.instance.t("common:unpinned") : I18n.instance.t("common:pinned") }),
            level: AlertLevels.INFO,
            message: I18n.instance.t("console:develop.features.helpPanel.notifications.pin.success.message",
                { state: isPinned ? I18n.instance.t("common:unpinned") : I18n.instance.t("common:pinned") })
        }));
    }
}
