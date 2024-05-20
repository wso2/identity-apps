/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { useContext } from "react";
import { ThemeProviderContext, ThemeProviderContextProps } from "../contexts/theme-provider-context";
import { BrandingPreferenceAPIResponseInterface, BrandingPreferenceOrganizationDetailsInterface } from "../models";

/**
 * Interface for the return type of the useThemeProvider hook.
 */
export type UseThemeProviderInterface = {
    /**
     * Organization's basic details.
     */
    organizationDetails: BrandingPreferenceOrganizationDetailsInterface;
    /**
     * The current theme object from the theme provider.
     */
    theme: any;
    /**
     * The raw branding preference API response.
     */
    raw: BrandingPreferenceAPIResponseInterface;
};

/**
 * Hook that provides access to the theme provider context.
 * @returns An object containing the current theme from the theme provider and raw API response.
 */
export const useThemeProvider = (): UseThemeProviderInterface => {
    const { themePreference }: ThemeProviderContextProps = useContext(ThemeProviderContext);

    return {
        organizationDetails: themePreference?.preference?.organizationDetails,
        raw: themePreference,
        theme: themePreference?.preference?.theme[themePreference?.preference?.theme?.activeTheme]
    };
};
