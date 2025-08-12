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

import { CustomTextPreferenceScreenMetaInterface } from "@wso2is/admin.branding.v1/models/custom-text-preference";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { PreviewScreenType } from "@wso2is/common.branding.v1/models/branding-preferences";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import useSWR, { SWRResponse } from "swr";
import { CustomTextPreferenceScreenMetaResult } from "../models/custom-text-preference";

/**
 * Fetcher function for a single screen meta.
 *
 * @param screen - The screen name.
 * @returns Promise containing the screen meta data.
 */
const fetchScreenMeta = async (
    screen: PreviewScreenType
): Promise<{ screen: PreviewScreenType; data: CustomTextPreferenceScreenMetaInterface }> => {
    const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";
    const url: string = `https://${
        window.location.host
    }${basename}/resources/branding/i18n/screens/${screen}/meta.json`;

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
            throw new Error(`Failed to fetch ${screen} meta: ${response.statusText}`);
        }

        const data: CustomTextPreferenceScreenMetaInterface = await response.json();

        return {
            data,
            screen
        };
    } catch (error) {
        throw new IdentityAppsApiException("Failed to fetch custom text preference screen meta.");
    }
};

/**
 * Hook to get the custom text preference screen meta for multiple screens.
 *
 * @param screens - Array of Resource Screen names.
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isValidating, mutate.
 */
const useGetCustomTextPreferenceScreenMeta = (
    screens: PreviewScreenType[],
    shouldFetch: boolean = true
): CustomTextPreferenceScreenMetaResult => {
    const cacheKey: string = shouldFetch
        ? `custom-text-preference-multiple-screen-meta-${JSON.stringify(screens.sort())}`
        : null;

    const {
        data,
        isLoading,
        error,
        mutate
    }: SWRResponse<
        { [ key in PreviewScreenType ]?: CustomTextPreferenceScreenMetaInterface },
        IdentityAppsApiException
    > = useSWR(
        cacheKey,
        async (): Promise<{ [ key in PreviewScreenType ]?: CustomTextPreferenceScreenMetaInterface }> => {
            const results: { [ key in PreviewScreenType ]?: CustomTextPreferenceScreenMetaInterface } = {};

            // Fetch all screens in parallel.
            const promises: Promise<{
                screen: PreviewScreenType;
                data: CustomTextPreferenceScreenMetaInterface;
            }>[] = screens.map((screen: PreviewScreenType) => fetchScreenMeta(screen));

            const responses: {
                screen: PreviewScreenType;
                data: CustomTextPreferenceScreenMetaInterface;
            }[] = await Promise.all(promises);

            // Combine results.
            responses.forEach(({ screen, data }: {
                screen: PreviewScreenType;
                data: CustomTextPreferenceScreenMetaInterface;
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

export default useGetCustomTextPreferenceScreenMeta;
