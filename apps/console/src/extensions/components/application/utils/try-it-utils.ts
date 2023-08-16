/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import set from "lodash-es/set";
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ApplicationManagementConstants } from "../../../../features/applications/constants";
import { AppState, AppUtils } from "../../../../features/core";
import LoginApplicationTemplate from 
    "../../../application-templates/templates/single-page-application/login-playground-application.json";
import { TryItApplicationConstants } from "../constants/try-it-constants";

/**
 * Persist the Playground Tour seen status in Local Storage.
 *
 * @param {boolean} status - Status to set.
 */
export const persistPlaygroundTourViewedStatus = (status: boolean): void => {
    const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();
    const newPref: StorageIdentityAppsSettingsInterface = cloneDeep(userPreferences);

    set(newPref?.identityAppsSettings?.devPortal,
        TryItApplicationConstants.TRY_IT_TOUR_STATUS_STORAGE_KEY, status);

    AppUtils.setUserPreferences(newPref);
};

/**
 * Check if the Playground Tour has already been seen by the user.
 *
 * @return {boolean}
 */
export const getPlaygroundTourViewedStatus = (): boolean => {
    const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

    if (isEmpty(userPreferences)) {
        return false;
    }

    return get(userPreferences?.identityAppsSettings?.devPortal,
        TryItApplicationConstants.TRY_IT_TOUR_STATUS_STORAGE_KEY, false);
};

/**
 * Get the client Id of the Try it application.
 *
 * @return {string}
 */
export const getTryItClientId = (tenantDomain:string): string => {
    
    return LoginApplicationTemplate.application.
        inboundProtocolConfiguration.oidc.clientId.replace("<TENANT>", tenantDomain);
};
