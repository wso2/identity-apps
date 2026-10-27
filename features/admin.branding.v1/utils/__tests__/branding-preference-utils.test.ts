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

import {
    BrandingPreferenceInterface,
    BrandingPreferenceThemeInterface,
    PredefinedThemes
} from "@wso2is/common.branding.v1/models";
import cloneDeep from "lodash-es/cloneDeep";
import { BrandingPreferencesConstants } from "../../constants/branding-preferences-constants";
import { BrandingPreferenceMeta } from "../../meta/branding-preference-meta";
import { BrandingPreferenceUtils } from "../branding-preference-utils";

const LIGHT_PREDEFINED_PRIMARY: string = "#1a1a1a";
const DARK_PREDEFINED_PRIMARY: string = "#2b2b2b";
const STORED_LIGHT_PRIMARY: string = "#ff7300";
const STORED_LOGO_URL: string = "https://example.com/logo.png";

/**
 * The predefined themes as the branding page resolves them. The primary colors are marked so
 * that a predefined value can be told apart from a stored one.
 *
 * @returns Predefined themes.
 */
const buildPredefinedThemes = (): BrandingPreferenceThemeInterface => {
    const predefinedThemes: BrandingPreferenceThemeInterface = {
        activeTheme: PredefinedThemes.LIGHT,
        ...cloneDeep(BrandingPreferenceMeta.getThemes())
    };

    predefinedThemes[ PredefinedThemes.LIGHT ].colors.primary.main = LIGHT_PREDEFINED_PRIMARY;
    predefinedThemes[ PredefinedThemes.DARK ].colors.primary.main = DARK_PREDEFINED_PRIMARY;

    return predefinedThemes;
};

/**
 * Builds a preference document in the shape the preference API returns it. The `theme` section
 * is deliberately loose: the API accepts and stores a `theme` object that does not carry every
 * predefined theme.
 *
 * @param theme - Theme section to store.
 * @returns Stored branding preference.
 */
const buildStoredPreference = (theme: Partial<BrandingPreferenceThemeInterface>): BrandingPreferenceInterface =>
    cloneDeep({
        ...BrandingPreferencesConstants.DEFAULT_PREFERENCE,
        theme
    }) as BrandingPreferenceInterface;

describe("BrandingPreferenceUtils.migrateThemePreference", () => {

    describe("when the stored theme object is incomplete", () => {

        it("does not throw when the theme object only carries activeTheme", () => {
            const storedPreference: BrandingPreferenceInterface = buildStoredPreference({
                activeTheme: PredefinedThemes.LIGHT
            });

            expect(() => BrandingPreferenceUtils.migrateThemePreference(storedPreference, {
                theme: buildPredefinedThemes()
            })).not.toThrow();
        });

        it("fills in every predefined theme that is missing", () => {
            const migratedPreference: BrandingPreferenceInterface = BrandingPreferenceUtils
                .migrateThemePreference(buildStoredPreference({
                    activeTheme: PredefinedThemes.DARK
                }), {
                    theme: buildPredefinedThemes()
                });

            expect(migratedPreference.theme.activeTheme).toBe(PredefinedThemes.DARK);
            expect(migratedPreference.theme[ PredefinedThemes.LIGHT ].colors.primary.main)
                .toBe(LIGHT_PREDEFINED_PRIMARY);
            expect(migratedPreference.theme[ PredefinedThemes.DARK ].colors.primary.main)
                .toBe(DARK_PREDEFINED_PRIMARY);
        });

        it("fills in DARK when the stored theme only has a complete LIGHT", () => {
            const predefinedThemes: BrandingPreferenceThemeInterface = buildPredefinedThemes();

            const migratedPreference: BrandingPreferenceInterface = BrandingPreferenceUtils
                .migrateThemePreference(buildStoredPreference({
                    activeTheme: PredefinedThemes.LIGHT,
                    [ PredefinedThemes.LIGHT ]: predefinedThemes[ PredefinedThemes.LIGHT ]
                }), {
                    theme: predefinedThemes
                });

            expect(migratedPreference.theme[ PredefinedThemes.LIGHT ].colors.primary.main)
                .toBe(LIGHT_PREDEFINED_PRIMARY);
            expect(migratedPreference.theme[ PredefinedThemes.DARK ].colors.primary.main)
                .toBe(DARK_PREDEFINED_PRIMARY);
        });

        it("keeps the stored preference and the predefined themes untouched", () => {
            const predefinedThemes: BrandingPreferenceThemeInterface = buildPredefinedThemes();
            const storedPreference: BrandingPreferenceInterface = buildStoredPreference({
                activeTheme: PredefinedThemes.LIGHT
            });

            BrandingPreferenceUtils.migrateThemePreference(storedPreference, {
                theme: predefinedThemes
            });

            expect(storedPreference.theme).toEqual({ activeTheme: PredefinedThemes.LIGHT });
            expect(predefinedThemes).toEqual(buildPredefinedThemes());
        });
    });

    describe("when the stored theme object is complete", () => {

        it("keeps the stored customizations", () => {
            const storedTheme: BrandingPreferenceThemeInterface = {
                activeTheme: PredefinedThemes.DARK,
                ...cloneDeep(BrandingPreferenceMeta.getThemes())
            };

            storedTheme[ PredefinedThemes.LIGHT ].colors.primary.main = STORED_LIGHT_PRIMARY;
            storedTheme[ PredefinedThemes.LIGHT ].images.logo.imgURL = STORED_LOGO_URL;

            const migratedPreference: BrandingPreferenceInterface = BrandingPreferenceUtils
                .migrateThemePreference(buildStoredPreference(storedTheme), {
                    theme: buildPredefinedThemes()
                });

            expect(migratedPreference.theme.activeTheme).toBe(PredefinedThemes.DARK);
            expect(migratedPreference.theme[ PredefinedThemes.LIGHT ].colors.primary.main)
                .toBe(STORED_LIGHT_PRIMARY);
            expect(migratedPreference.theme[ PredefinedThemes.LIGHT ].images.logo.imgURL)
                .toBe(STORED_LOGO_URL);
        });
    });

    describe("when the preference has no theme object", () => {

        it("creates the theme object from the predefined themes", () => {
            const storedPreference: BrandingPreferenceInterface = cloneDeep({
                ...BrandingPreferencesConstants.DEFAULT_PREFERENCE,
                theme: undefined
            }) as BrandingPreferenceInterface;

            const migratedPreference: BrandingPreferenceInterface = BrandingPreferenceUtils
                .migrateThemePreference(storedPreference, {
                    theme: buildPredefinedThemes()
                });

            expect(migratedPreference.theme.activeTheme).toBe(PredefinedThemes.LIGHT);
            expect(migratedPreference.theme[ PredefinedThemes.LIGHT ].colors.primary.main)
                .toBe(LIGHT_PREDEFINED_PRIMARY);
            expect(migratedPreference.theme[ PredefinedThemes.DARK ].colors.primary.main)
                .toBe(DARK_PREDEFINED_PRIMARY);
        });
    });
});
