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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { CustomTextPreferenceAPIResponseInterface } from "@wso2is/admin.branding.v1/models/custom-text-preference";
import { I18nConstants } from "@wso2is/admin.core.v1/constants/i18n-constants";
import { store } from "@wso2is/admin.core.v1/store";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { BrandingPreferenceTypes, PreviewScreenType } from "@wso2is/common.branding.v1/models/branding-preferences";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig } from "axios";
import useSWR, { SWRResponse } from "swr";
import { CustomTextPreferenceResult } from "../models/custom-text-preference";
import { getCustomScreenName } from "../utils/custom-text-utils";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetcher function for resolving custom text preference.
 *
 * @param requestConfig - The axios request configuration.
 * @returns Promise containing the resolved custom text preference data.
 */
const fetchCustomTextPreference = async (
    requestConfig: AxiosRequestConfig
): Promise<Record<string, string>> => {
    try {
        const response: any = await httpClient(requestConfig);

        if (response.status !== 200) {
            throw new Error(`Failed to resolve custom text preference: ${response.statusText}`);
        }

        return (response as CustomTextPreferenceAPIResponseInterface)?.preference?.text;
    } catch (error) {
        const axiosError: AxiosError = error as AxiosError;

        if (axiosError.response?.status === 404) {
            return {};
        }

        const errorMessage: string = axiosError.response?.data?.message || "Unknown error occurred";

        throw new IdentityAppsApiException(
            errorMessage,
            axiosError.stack,
            axiosError.response?.status,
            axiosError.request,
            axiosError.response,
            axiosError.config
        );
    }
};

/**
 * Hook to resolve custom text preferences for multiple screen types using useSWR with caching.
 * This is optimized for handling multiple screen types efficiently.
 *
 * @param name - Resource Name.
 * @param screenTypes - Array of Resource Screen types.
 * @param locale - Resource Locale.
 * @param type - Resource Type.
 * @param subOrg - Whether it's for a sub-organization.
 * @param flowType - The type of the flow.
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isLoading, mutate.
 */
const useResolveCustomTextPreferences = (
    name: string,
    screenTypes: PreviewScreenType[],
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE,
    type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG,
    subOrg: boolean = false,
    flowType: FlowTypes,
    shouldFetch: boolean = true
): CustomTextPreferenceResult => {
    const clonedScreenTypes: string[] = [ ...screenTypes, getCustomScreenName(flowType) ];

    const endpointUrl: string = subOrg
        ? `${store.getState().config.endpoints.brandingTextPreferenceSubOrg}/resolve`
        : `${store.getState().config.endpoints.brandingTextPreference}/resolve`;

    // Create cache key based on all parameters.
    const cacheKey: string = shouldFetch ?
        `resolve-multiple-custom-text-preferences-${name}-${JSON.stringify(clonedScreenTypes.sort())}-` +
        `${locale}-${type}-${subOrg}`
        : null;

    const {
        data,
        isLoading,
        error,
        mutate
    }: SWRResponse<{ [key in PreviewScreenType]?: Record<string, string> }, IdentityAppsApiException> = useSWR(
        cacheKey,
        async (): Promise<{ [key in PreviewScreenType]?: Record<string, string> }> => {
            const results: { [key in PreviewScreenType]?: Record<string, string> } = {};

            // Fetch all screen types in parallel.
            const promises: Promise<{
                screenType: PreviewScreenType;
                data: Record<string, string>;
            }>[] = clonedScreenTypes.map(async (screenType: string) => {
                const requestConfig: AxiosRequestConfig = {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    method: HttpMethods.GET,
                    params: {
                        locale,
                        name,
                        screen: screenType,
                        type
                    },
                    url: endpointUrl
                };

                const response: Record<string, string> = await fetchCustomTextPreference(requestConfig);

                return {
                    data: response || {},
                    screenType: screenType as PreviewScreenType
                };
            });

            const responses: {
                screenType: PreviewScreenType;
                data: Record<string, string>;
            }[] = await Promise.all(promises);

            // Combine results.
            responses.forEach(({ screenType, data }: {
                screenType: PreviewScreenType;
                data: Record<string, string>;
            }) => {
                results[screenType] = data;
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

export default useResolveCustomTextPreferences;
