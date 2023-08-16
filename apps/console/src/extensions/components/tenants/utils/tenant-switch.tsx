/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { SessionStorageUtils } from "@wso2is/core/utils";

/**
 * Handle the tenant switch action and redirect the user to the selected
 * tenant path of the console.
 *
 * @param tenantName    Name of the tenant being switched to.
 */
export const handleTenantSwitch = (tenantName: string): void => {
    const newTenantedPath = window["AppUtils"].getConfig().clientOrigin + "/t/" + tenantName + "/" +
        window[ "AppUtils" ].getConfig().appBase + "?disable_silent_sign_in=true&switch_tenant=true";

    // Clear the callback url of the previous tenant.
    SessionStorageUtils.clearItemFromSessionStorage("auth_callback_url_console");

    // Redirect the user to the newly selected tenant path.
    window.location.replace(newTenantedPath);
};
