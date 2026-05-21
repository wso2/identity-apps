/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import { BrandingPreferenceTypes } from "../models/branding-preferences";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import useGetCustomTextPreferenceExtensionsMeta from "./use-get-custom-text-preference-extensions-meta";
import { CustomTextPreferenceApiConstants } from "../constants/custom-text-preference-constants";
import { CustomTextPreferenceAPIResponseInterface, CustomTextPreferenceMeta } from "../models/custom-text-preference";

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

    const [ fallbackStep, setFallbackStep ] = useState<number>(0);

    const isLocaleInExtensions: boolean = extensionsMeta?.locales?.includes(locale) ?? false;
    const isEnUSInExtensions: boolean =
        extensionsMeta?.locales?.includes(CustomTextPreferenceApiConstants.DEFAULT_LOCALE) ?? false;

    let url: string;

    if (fallbackStep === 0 && isLocaleInExtensions) {
        url = `https://${window.location.host}${basename}/extensions/branding/i18n/screens/${screen}/${locale}.json`;
    } else if (fallbackStep === 1 && isEnUSInExtensions) {
        url = `https://${window.location.host}${basename}/extensions/branding/i18n/screens/${screen}/${
            CustomTextPreferenceApiConstants.DEFAULT_LOCALE
        }.json`;
    } else {
        const resourceLocale: string = fallbackStep === 1
            ? CustomTextPreferenceApiConstants.DEFAULT_LOCALE
            : locale;

        url = `https://${window.location.host}${basename}/resources/branding/i18n/screens/${screen}/` +
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

    const shouldMakeRequest: boolean = shouldFetch && !extensionsMetaLoading;

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldMakeRequest ? requestConfig : null, {
        attachToken: false,
        shouldRetryOnError: false
    });

    useEffect(() => {
        if (!error || (error as any)?.response?.status !== 404) return;

        if (fallbackStep === 0 && isLocaleInExtensions) {
            setFallbackStep(1);
        } else if (fallbackStep === 1 && isEnUSInExtensions) {
            setFallbackStep(2);
        }
    }, [ error, fallbackStep, isLocaleInExtensions, isEnUSInExtensions ]);

    useEffect(() => {
        if (shouldFetch) {
            setFallbackStep(0);
        }
    }, [ shouldFetch, name, screen, locale, type ]);

    const overriddenMutate = (): Promise<AxiosResponse<Data>> => {
        setFallbackStep(0);

        return mutate();
    };

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
