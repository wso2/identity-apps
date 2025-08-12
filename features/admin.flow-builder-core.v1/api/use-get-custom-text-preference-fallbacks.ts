/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { PreviewScreenType } from "@wso2is/common.branding.v1/models/branding-preferences";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import useSWR, { SWRResponse } from "swr";
import { CustomTextPreferenceResult } from "../models/custom-text-preference";

/**
 * Fetcher function for a single screen fallback.
 *
 * @param screen - The screen name.
 * @param locale - The locale.
 * @returns Promise containing the screen fallback data.
 */
const fetchScreenFallback = async (
    screen: PreviewScreenType,
    locale: string
): Promise<{ screen: PreviewScreenType; data: Record<string, string> }> => {
    const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";
    const url: string = `https://${
        window.location.host
    }${basename}/resources/branding/i18n/screens/${screen}/${locale}.json`;

    try {
        const response: Response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "GET"
        });

        if (response.status === 404) {
            return {
                data: {},
                screen
            };
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch ${screen}: ${response.statusText}`);
        }

        const data: Record<string, string> = await response.json();

        return {
            data,
            screen
        };
    } catch (error) {
        throw new IdentityAppsApiException("Failed to fetch custom text preference fallback.");
    }
};

/**
 * Hook to get the platform default branding preference text customizations from the distribution for multiple screens.
 *
 * @param screens - Array of Resource Screen names.
 * @param locale - Resource Locale.
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isValidating, mutate.
 */
const useGetCustomTextPreferenceFallbacks = (
    screens: PreviewScreenType[],
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE,
    shouldFetch: boolean = true
): CustomTextPreferenceResult => {
    // Create cache key based on all parameters.
    const cacheKey: string = shouldFetch
        ? `custom-text-preference-multiple-fallbacks-${JSON.stringify(screens.sort())}-${locale}`
        : null;

    const {
        data,
        isLoading,
        error,
        mutate
    }: SWRResponse<{ [ key in PreviewScreenType ]?: Record<string, string> }, IdentityAppsApiException> = useSWR(
        cacheKey,
        async (): Promise<{ [ key in PreviewScreenType ]?: Record<string, string> }> => {
            const results: { [ key in PreviewScreenType ]?: Record<string, string> } = {};

            // Fetch all screens in parallel.
            const promises: Promise<{
                screen: PreviewScreenType;
                data: Record<string, string>;
            }>[] = screens.map((screen: PreviewScreenType) => fetchScreenFallback(screen, locale));

            const responses: {
                screen: PreviewScreenType;
                data: Record<string, string>;
            }[] = await Promise.all(promises);

            // Combine results.
            responses.forEach(({ screen, data }: {
                screen: PreviewScreenType;
                data: Record<string, string>;
            }) => {
                results[screen] = data;
            });

            return results;
        },
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    return {
        data,
        error,
        isLoading,
        mutate
    };
};

export default useGetCustomTextPreferenceFallbacks;
