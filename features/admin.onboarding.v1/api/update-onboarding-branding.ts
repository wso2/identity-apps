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
import { updateBrandingPreference } from "@wso2is/admin.branding.v1/api/branding-preferences";
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
import { BrandingConstraints } from "../constants/preset-logos";
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
 *
 * @returns Complete default branding preference
 */
const getDefaultBrandingPreference = (): BrandingPreferenceInterface => {
    return structuredClone(BrandingPreferencesConstants.DEFAULT_PREFERENCE);
};

/**
 * Deep-merges onboarding branding config with default/existing preference
 * and predefined theme values from theme-variables.json.
 */
const mergeBrandingPreference = (
    brandingConfig: OnboardingBrandingConfigInterface,
    predefinedTheme: BrandingPreferenceThemeInterface,
    existingPreference?: BrandingPreferenceInterface
): BrandingPreferenceInterface => {
    const base: BrandingPreferenceInterface = existingPreference || getDefaultBrandingPreference();

    return merge({}, base, {
        configs: {
            isBrandingEnabled: true
        },
        theme: {
            ...predefinedTheme,
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
 * Updates (or creates) app-level branding preference by merging the
 * onboarding config with any existing preference and predefined theme values.
 */
export const updateApplicationBranding = async (
    applicationId: string,
    brandingConfig: OnboardingBrandingConfigInterface
): Promise<void> => {
    const locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE;
    let existingPreference: BrandingPreferenceInterface | undefined;
    let isBrandingAlreadyConfigured: boolean = false;

    const predefinedTheme: BrandingPreferenceThemeInterface =
        await BrandingPreferenceUtils.getPredefinedThemePreferences(DEFAULT_THEME);

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
    await updateBrandingPreference(
        isBrandingAlreadyConfigured,
        applicationId,
        mergedPreference,
        BrandingPreferenceTypes.APP
    );
};

export const isBrandingCustomized = (brandingConfig: OnboardingBrandingConfigInterface): boolean => {
    if (brandingConfig.primaryColor.toLowerCase() !==
        BrandingConstraints.DEFAULT_PRIMARY_COLOR.toLowerCase()) {
        return true;
    }

    if (brandingConfig.logoUrl) {
        return true;
    }

    return false;
};
