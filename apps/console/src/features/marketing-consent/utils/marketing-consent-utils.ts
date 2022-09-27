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

import { LocalStorageUtils } from "@wso2is/core/utils";
import get from "lodash-es/get";
import { MarketingConsentConstants } from "../constants";

/**
 * Util function to get whether the user has interacted with 
 * the marketing consent modal or not from the local storage.
 * 
 * @param uuid - user id.
 * @returns whether the user has interacted with the marketing consent modal or not.
 */
export const getMarketingConsentStatusFromLocalStorage = (uuid: string): boolean => {
    const marketingConsentData = JSON.parse(LocalStorageUtils
        .getValueFromLocalStorage(MarketingConsentConstants.LOCAL_STORAGE_KEY));
    const isMarketingConsentGiven: boolean = get(marketingConsentData, uuid, false);

    return isMarketingConsentGiven;
};

/**
 * Util function to store in the local storage that the user has interacted with 
 * the marketing consent modal.
 * 
 * @param uuid - user id.
 */
export const setMarketingConsentStatusToLocalStorage = (uuid: string): void => {
    LocalStorageUtils.setValueInLocalStorage(MarketingConsentConstants.LOCAL_STORAGE_KEY, JSON.stringify({
        ...JSON.parse(LocalStorageUtils.getValueFromLocalStorage(MarketingConsentConstants.LOCAL_STORAGE_KEY)),
        [ uuid ]: true
    }));
};
