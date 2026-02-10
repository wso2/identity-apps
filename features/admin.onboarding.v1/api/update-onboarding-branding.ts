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
import { BrandingPreferencesConstants } from "@wso2is/admin.branding.v1/constants/branding-preferences-constants";
import { BrandingPreferenceUtils } from "@wso2is/admin.branding.v1/utils/branding-preference-utils";
import { I18nConstants } from "@wso2is/admin.core.v1/constants/i18n-constants";
import { store } from "@wso2is/admin.core.v1/store";
import {
    BrandingPreferenceInterface,
    BrandingPreferenceThemeInterface,
    BrandingPreferenceTypes,
    PredefinedThemes
} from "@wso2is/common.branding.v1/models";
import { HttpMethods } from "@wso2is/core/models";
import merge from "lodash-es/merge";
import { OnboardingBrandingConfigInterface } from "../models";

/**
 * Default theme name used to load theme variables.
 */
const DEFAULT_THEME: string = "default";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Get default branding preference structure.
 * Uses the same DEFAULT_PREFERENCE as Console's branding feature.
 *
 * @returns Complete default branding preference
 */
const getDefaultBrandingPreference = (): BrandingPreferenceInterface => {
    // Use the complete default structure from the branding constants
    // structuredClone creates a deep copy to avoid mutating the original
    return structuredClone(BrandingPreferencesConstants.DEFAULT_PREFERENCE);
};

/**
 * Merge onboarding branding config with default/existing preference.
 * Uses lodash merge for deep merging (same pattern as Console).
 * Incorporates predefined theme values from theme-variables.json for proper defaults.
 *
 * @param brandingConfig - Onboarding branding configuration
 * @param predefinedTheme - Predefined theme preferences loaded from theme-variables.json
 * @param existingPreference - Existing branding preference (optional)
 * @returns Complete merged branding preference
 */
const mergeBrandingPreference = (
    brandingConfig: OnboardingBrandingConfigInterface,
    predefinedTheme: BrandingPreferenceThemeInterface,
    existingPreference?: BrandingPreferenceInterface
): BrandingPreferenceInterface => {
    const base: BrandingPreferenceInterface = existingPreference || getDefaultBrandingPreference();

    // Deep merge: base structure + predefined theme values + user's customizations
    return merge({}, base, {
        configs: {
            isBrandingEnabled: true  // Enable branding since user customized it
        },
        theme: {
            // Merge predefined theme (has proper border radius values from theme-variables.json)
            ...predefinedTheme,
            // Override with user's customizations for LIGHT theme
            [PredefinedThemes.LIGHT]: {
                ...predefinedTheme[PredefinedThemes.LIGHT],
                colors: {
                    ...predefinedTheme[PredefinedThemes.LIGHT]?.colors,
                    primary: {
                        main: brandingConfig.primaryColor
                    }
                },
                images: {
                    ...predefinedTheme[PredefinedThemes.LIGHT]?.images,
                    logo: {
                        altText: brandingConfig.logoAltText || "Logo",
                        imgURL: brandingConfig.logoUrl || ""
                    }
                }
            }
        }
    });
};

/**
 * Update application branding preferences from onboarding configuration.
 *
 * @param applicationId - The application ID to apply branding to
 * @param brandingConfig - Onboarding branding configuration
 * @returns Promise that resolves when branding is updated
 */
export const updateApplicationBranding = async (
    applicationId: string,
    brandingConfig: OnboardingBrandingConfigInterface
): Promise<void> => {
    const locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE;
    let existingPreference: BrandingPreferenceInterface | undefined;
    let isBrandingAlreadyConfigured: boolean = false;

    // Load predefined theme preferences from theme-variables.json
    // This provides proper default values for border radius, colors, etc.
    const predefinedTheme: BrandingPreferenceThemeInterface =
        await BrandingPreferenceUtils.getPredefinedThemePreferences(DEFAULT_THEME);

    // Try to get existing branding preference for this application
    try {
        const requestConfig: any = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            params: {
                locale,
                name: applicationId,
                type: BrandingPreferenceTypes.APP
            },
            url: store.getState().config.endpoints.brandingPreference
        };

        const response: any = await httpClient(requestConfig);

        if (response?.data?.preference) {
            existingPreference = response.data.preference;
            isBrandingAlreadyConfigured = true;
        }
    } catch {
        // No existing branding, will create new
        isBrandingAlreadyConfigured = false;
    }

    // Merge with existing preference and predefined theme values
    const mergedPreference: BrandingPreferenceInterface = mergeBrandingPreference(
        brandingConfig,
        predefinedTheme,
        existingPreference
    );

    // Update or create application branding preference
    const updateConfig: any = {
        data: {
            locale,
            name: applicationId,
            preference: mergedPreference,
            type: BrandingPreferenceTypes.APP
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: isBrandingAlreadyConfigured ? HttpMethods.PUT : HttpMethods.POST,
        url: store.getState().config.endpoints.brandingPreference
    };

    await httpClient(updateConfig);
};

/**
 * Check if branding has been customized (different from default).
 *
 * @param brandingConfig - Branding configuration to check
 * @returns True if branding has been customized
 */
export const isBrandingCustomized = (brandingConfig: OnboardingBrandingConfigInterface): boolean => {
    const defaultColor: string = "#ff7300";

    // Check if color is different from default
    if (brandingConfig.primaryColor.toLowerCase() !== defaultColor.toLowerCase()) {
        return true;
    }

    // Check if logo is set
    if (brandingConfig.logoUrl) {
        return true;
    }

    return false;
};
