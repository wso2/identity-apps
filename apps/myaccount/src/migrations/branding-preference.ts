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

import { BrandingPreferenceAPIResponseInterface, PredefinedThemes } from "@wso2is/common.branding.v1/models";
import cloneDeep from "lodash-es/cloneDeep";
import merge from "lodash-es/merge";
import { THEMES } from "../meta";

/**
 * Migrates a branding preference API response to include the default themes.
 *
 * @param preference - The branding preference API response to migrate.
 * @returns A new API response object with the default themes merged in.
 */
export const getMigratedBrandingPreference = (
    original: BrandingPreferenceAPIResponseInterface
): BrandingPreferenceAPIResponseInterface => {
    if (!original) {
        return original;
    }

    const migratedThemePreference: BrandingPreferenceAPIResponseInterface = cloneDeep(original);

    // If the preference is of v1, create a `theme` object and set the defaults.
    if (!original?.preference?.theme) {
        migratedThemePreference.preference.theme = {
            activeTheme: PredefinedThemes.LIGHT,
            ...THEMES
        };

        // Delete the cloned theme if the theme doesn't exist in the original branding object.
        delete migratedThemePreference.preference.theme;

        return;
    }

    for (const theme in PredefinedThemes) {
        // v2 Migrations!
        // If the preference is of v1, move `images` inside the theme.
        if (original?.preference?.images) {
            migratedThemePreference.preference.theme[ PredefinedThemes[ theme ] ].images = original.preference.images;
        }

        // v3 Migrations!
        const originalPrimaryColor: string = migratedThemePreference.preference.theme[
            PredefinedThemes[ theme ]
        ].colors.primary;

        if (typeof originalPrimaryColor === "string") {
            delete migratedThemePreference.preference.theme[ PredefinedThemes[ theme ] ].colors.primary;
            migratedThemePreference.preference.theme[ PredefinedThemes[ theme ] ].colors.primary = {
                main: originalPrimaryColor
            };
        }

        const originalSecondaryColor: string = migratedThemePreference.preference.theme[
            PredefinedThemes[ theme ]
        ].colors.secondary;

        if (typeof originalSecondaryColor === "string") {
            delete migratedThemePreference.preference.theme[ PredefinedThemes[ theme ] ].colors.secondary;
            migratedThemePreference.preference.theme[ PredefinedThemes[ theme ] ].colors.secondary = {
                main: originalSecondaryColor
            };
        }

        if (migratedThemePreference.preference.theme[PredefinedThemes[ theme ]].page) {
            const originalLoginPageBackgroundColor: string = migratedThemePreference.preference.theme[
                PredefinedThemes[ theme ]
            ].page?.background?.backgroundColor;

            if (!migratedThemePreference.preference.theme[ PredefinedThemes[ theme ] ].colors?.background
                && originalLoginPageBackgroundColor) {
                migratedThemePreference.preference.theme[ PredefinedThemes[ theme ] ].colors.background = {
                    body: {
                        main: originalLoginPageBackgroundColor
                    }
                };
            }

            const originalPageFontColor: string = migratedThemePreference.preference.theme[
                PredefinedThemes[ theme ]
            ].page?.font?.color;

            if (!migratedThemePreference.preference.theme[ PredefinedThemes[ theme ] ].colors?.text
                && originalPageFontColor) {
                migratedThemePreference.preference.theme[ PredefinedThemes[ theme ] ].colors.text = {
                    primary: originalPageFontColor
                };
            }

            migratedThemePreference.preference.theme[
                PredefinedThemes[ theme ]
            ].loginPage = migratedThemePreference.preference.theme[ PredefinedThemes[ theme ] ].page;
            delete migratedThemePreference.preference.theme[ PredefinedThemes[ theme ] ].page;
        }
    }

    return merge({ preference: { theme: THEMES } }, migratedThemePreference);
};
