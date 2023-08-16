/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
