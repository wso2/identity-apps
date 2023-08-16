/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { HttpMethods } from "@wso2is/core/models";
import { I18nConstants } from "../constants";
import {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface,
    useRequest
} from "../hooks/use-request";
import { getMigratedBrandingPreference } from "../migrations/branding-preference";
import { BrandingPreferenceAPIResponseInterface, BrandingPreferenceTypes } from "../models";
import { store } from "../store";

/**
 * Hook to get the branding preference via Branding Preferences API.
 *
 * @param name - Resource Name.
 * @param type - Resource Type.
 * @param locale - Resource Locale.
 * @returns Branding Preference GET hook.
 */
export const useGetBrandingPreference = <Data = BrandingPreferenceAPIResponseInterface, Error = RequestErrorInterface>(
    name: string,
    type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            locale,
            name,
            type
        },
        url: store.getState()?.config?.endpoints?.brandingPreference
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data: getMigratedBrandingPreference(
            data as unknown as BrandingPreferenceAPIResponseInterface) as unknown as Data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};
