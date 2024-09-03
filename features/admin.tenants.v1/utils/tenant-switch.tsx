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

import { SessionStorageUtils } from "@wso2is/core/utils";

/**
 * Handle the tenant switch action and redirect the user to the selected
 * tenant path of the console.
 *
 * @param tenantName - Name of the tenant being switched to.
 */
export const handleTenantSwitch = (tenantName: string): void => {
    const newTenantedPath: URL = new URL(
        `${window["AppUtils"].getConfig().clientOrigin}/${window["AppUtils"].getConfig().tenantPrefix}/${tenantName}/${
            window["AppUtils"].getConfig().appBase
        }`
    );

    newTenantedPath.searchParams.set("disable_silent_sign_in", "true");
    newTenantedPath.searchParams.set("switch_tenant", "true");

    if (window["AppUtils"].getConfig()?.__experimental__platformIdP?.enabled) {
        newTenantedPath.searchParams.set(
            "fidp",
            window["AppUtils"].getConfig().__experimental__platformIdP.homeRealmId
        );
    }

    // Clear the callback url of the previous tenant.
    SessionStorageUtils.clearItemFromSessionStorage("auth_callback_url_console");

    // Redirect the user to the newly selected tenant path.
    window.location.replace(newTenantedPath);
};
