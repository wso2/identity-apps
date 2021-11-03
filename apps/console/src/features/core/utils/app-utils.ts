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

import { AppConstants } from "@wso2is/core/constants";
import { StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";
import { LocalStorageUtils } from "@wso2is/core/utils";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import { store } from "../store";

/**
 * Utility class for common app operations.
 */
export class AppUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Get the logged in user's preferences.
     *
     * @return {StorageIdentityAppsSettingsInterface}
     */
    public static getUserPreferences(): StorageIdentityAppsSettingsInterface {
        const tenantName: string = store.getState().config.deployment.tenant;
        const username: string = store.getState().auth.username;

        if (!tenantName || !username) {
            return;
        }

        let preferences = {};
        
        try {
            preferences = JSON.parse(LocalStorageUtils.getValueFromLocalStorage(tenantName));
        } catch (e) {
            preferences = {};
        }

        return get(preferences, username);
    }

    /**
     * Sets the user preferences in the local storage.
     * @param {StorageIdentityAppsSettingsInterface} preferences
     */
    public static setUserPreferences(preferences: StorageIdentityAppsSettingsInterface): void {
        const tenantName: string = store.getState().config.deployment.tenant;
        const username: string = store.getState().auth.username;

        if (!tenantName || !username) {
            return;
        }

        LocalStorageUtils.setValueInLocalStorage(tenantName, JSON.stringify({
            ...JSON.parse(LocalStorageUtils.getValueFromLocalStorage(tenantName)),
            [ username ]: preferences
        }));
    }

    /**
     * Get the consensually hidden routes.
     *
     * @return {string[]}
     */
    public static getHiddenRoutes(): string[] {

        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        if (isEmpty(userPreferences)) {
            return [];
        }

        if (isEmpty(userPreferences) || isEmpty(userPreferences.identityAppsSettings?.devPortal?.hiddenRoutes)) {
            return [];
        }

        return userPreferences.identityAppsSettings?.devPortal?.hiddenRoutes;
    }

    /**
     * Set a consensually hidden route.
     *
     * @param {string} routeId - Route ID.
     */
    public static setHiddenRoute(routeId: string): void {
        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        if (isEmpty(userPreferences)) {
            return;
        }

        const hiddenRoutes = this.getHiddenRoutes();

        const newPref: StorageIdentityAppsSettingsInterface = cloneDeep(userPreferences);

        newPref.identityAppsSettings.devPortal.hiddenRoutes = [ ...hiddenRoutes, routeId ];

        this.setUserPreferences(newPref);
    }

    /**
     * Callback to be fired on every chunk load error.
     */
    public static onChunkLoadError(): void {

        dispatchEvent(new Event(AppConstants.CHUNK_LOAD_ERROR_EVENT));
    }
}
