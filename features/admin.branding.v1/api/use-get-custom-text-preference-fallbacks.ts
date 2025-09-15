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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { I18nConstants } from "@wso2is/admin.core.v1/constants/i18n-constants";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { BrandingPreferenceTypes } from "@wso2is/common.branding.v1/models/branding-preferences";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import useGetCustomTextPreferenceExtensionsMeta from "./use-get-custom-text-preference-extensions-meta";
import { CustomTextPreferenceConstants } from "../constants/custom-text-preference-constants";
import { CustomTextPreferenceAPIResponseInterface, CustomTextPreferenceMeta } from "../models/custom-text-preference";

/**
 * Hook to get the platform default branding preference text customizations from the distribution.
 * First tries to fetch from extensions path if locale is supported, falls back to resources path on 404.
 *
 * @param shouldFetch - Should fetch the data.
 * @param name - Resource Name.
 * @param screen - Resource Screen.
 * @param locale - Resource Locale.
 * @param type - Resource Type.
 * @returns SWR response object containing the data, error, isValidating, mutate.
 */
const useGetCustomTextPreferenceFallbacks = <
    Data = CustomTextPreferenceAPIResponseInterface,
    Error = RequestErrorInterface
>(
        shouldFetch: boolean,
        name: string,
        screen: string,
        locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE,
        type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG
    ): RequestResultInterface<Data, Error> => {
    const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";

    const { data: extensionsMeta, isLoading: extensionsMetaLoading } = useGetCustomTextPreferenceExtensionsMeta<
        CustomTextPreferenceMeta
    >(shouldFetch);

    // Fallback states: 0 = try locale in extensions, 1 = try en-US in extensions, 2 = try resources
    const [ fallbackStep, setFallbackStep ] = useState<number>(0);

    const isLocaleInExtensions: boolean = extensionsMeta?.locales?.includes(locale) ?? false;
    const isEnUSInExtensions: boolean =
        extensionsMeta?.locales?.includes(CustomTextPreferenceConstants.DEFAULT_LOCALE) ?? false;

    let url: string;

    if (fallbackStep === 0 && isLocaleInExtensions) {
        url = `https://${window.location.host}${basename}/extensions/branding/i18n/screens/${screen}/${locale}.json`;
    } else if (fallbackStep === 1 && isEnUSInExtensions) {
        url = `https://${window.location.host}${basename}/extensions/branding/i18n/screens/${screen}/${
            CustomTextPreferenceConstants.DEFAULT_LOCALE
        }.json`;
    } else {
        const resourceLocale: string = fallbackStep === 1 ? CustomTextPreferenceConstants.DEFAULT_LOCALE : locale;

        url =
            `https://${window.location.host}${basename}/resources/branding/i18n/screens/${screen}/` +
            `${resourceLocale}.json`;
    }

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url
    };

    // Only make the request if we have the extensions meta data (or don't need it) and should fetch
    const shouldMakeRequest: boolean = shouldFetch && !extensionsMetaLoading;

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldMakeRequest ? requestConfig : null, {
        attachToken: false,
        shouldRetryOnError: false
    });

    /**
     * Handle 404 fallback logic.
     * Try the default locale (i.e en-US) in extensions, if fails, try resources.
     */
    useEffect(() => {
        if (!error || (error as any)?.response?.status !== 404) return;

        if (fallbackStep === 0 && isLocaleInExtensions) {
            setFallbackStep(1);
        } else if (fallbackStep === 1 && isEnUSInExtensions) {
            setFallbackStep(2);
        }
    }, [ error, fallbackStep, isLocaleInExtensions, isEnUSInExtensions ]);

    /**
     * Reset fallback state when shouldFetch changes or parameters change
     */
    useEffect(() => {
        if (shouldFetch) {
            setFallbackStep(0);
        }
    }, [ shouldFetch, name, screen, locale, type ]);

    const overriddenMutate = (): Promise<AxiosResponse<Data>> => {
        setFallbackStep(0);

        return mutate();
    };

    /**
     * Determine if we should show error based on fallback logic.
     * Only show error if we've tried all fallbacks
     * @returns True/False based on the conditions.
     */
    const shouldShowError = (): boolean => {
        if (!error) return false;

        return fallbackStep === 2 || (!isLocaleInExtensions && !isEnUSInExtensions);
    };

    return {
        data: {
            locale,
            name,
            preference: {
                text: data
            },
            screen,
            type
        } as Data,
        error: shouldShowError() ? error : null,
        isLoading: extensionsMetaLoading || (!error && !data),
        isValidating,
        mutate: overriddenMutate
    };
};

export default useGetCustomTextPreferenceFallbacks;
