/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ApplicationManagementConstants } from "../../../../admin-applications-v1/constants";
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
