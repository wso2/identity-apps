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
import { I18nConstants } from "@wso2is/admin.core.v1/constants/i18n-constants";
import { store } from "@wso2is/admin.core.v1/store";
import {
    BrandingPreferenceTypes
} from "@wso2is/common.branding.v1/models";
import { HttpMethods } from "@wso2is/core/models";
import { OnboardingBrandingConfig } from "../models";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Get default branding preference structure.
 *
 * @returns Default branding preference
 */
const getDefaultBrandingPreference = (): any => ({
    theme: {
        LIGHT: {
            colors: {
                primary: {
                    main: "#ff7300"
                }
            },
            images: {
                logo: {
                    altText: "Logo",
                    imgURL: ""
                }
            }
        },
        activeTheme: "LIGHT"
    }
});

/**
 * Merge onboarding branding config with existing preference.
 *
 * @param brandingConfig - Onboarding branding configuration
 * @param existingPreference - Existing branding preference (optional)
 * @returns Merged branding preference
 */
const mergeBrandingPreference = (
    brandingConfig: OnboardingBrandingConfig,
    existingPreference?: any
): any => {
    const base: any = existingPreference || getDefaultBrandingPreference();

    return {
        ...base,
        theme: {
            ...base.theme,
            LIGHT: {
                ...base.theme?.LIGHT,
                colors: {
                    ...base.theme?.LIGHT?.colors,
                    primary: {
                        ...base.theme?.LIGHT?.colors?.primary,
                        main: brandingConfig.primaryColor
                    }
                },
                images: {
                    ...base.theme?.LIGHT?.images,
                    logo: {
                        altText: brandingConfig.logoAltText || "Logo",
                        imgURL: brandingConfig.logoUrl || ""
                    }
                }
            }
        }
    };
};

/**
 * Update branding preferences from onboarding configuration.
 *
 * @param brandingConfig - Onboarding branding configuration
 * @param tenantDomain - Tenant domain
 * @returns Promise that resolves when branding is updated
 */
export const updateOnboardingBranding = async (
    brandingConfig: OnboardingBrandingConfig,
    tenantDomain: string
): Promise<void> => {
    const locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE;
    let existingPreference: any;
    let isBrandingAlreadyConfigured: boolean = false;

    // Try to get existing branding preference
    try {
        const requestConfig: any = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            params: {
                locale,
                name: tenantDomain,
                type: BrandingPreferenceTypes.ORG
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

    // Merge with existing preference
    const mergedPreference: any = mergeBrandingPreference(
        brandingConfig,
        existingPreference
    );

    // Update or create branding preference
    const updateConfig: any = {
        data: {
            locale,
            name: tenantDomain,
            preference: mergedPreference,
            type: BrandingPreferenceTypes.ORG
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
export const isBrandingCustomized = (brandingConfig: OnboardingBrandingConfig): boolean => {
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
