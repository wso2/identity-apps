/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import { AxiosError } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import merge from "lodash-es/merge";
import { BrandingPreferencesConstants } from "../constants";
import { BrandingPreferenceMeta, LAYOUTS, PredefinedLayouts } from "../meta";
import {
    BrandingPreferenceInterface,
    BrandingPreferenceLayoutInterface,
    BrandingPreferenceThemeInterface,
    DynamicBrandingPreferenceLayoutInterface,
    PredefinedThemes
} from "../models";

/**
 * Utility class for Branding Preference related operations.
 */
export class BrandingPreferenceUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    /**
     * Migrate the theme preference from v1 - v2.
     *
     * @remarks
     * Migrations:
     *     - The `theme` object inside the `preference` doc was introduced later
     *       `colors` & `images` objects were moved inside the respective theme.
     *
     * @param original - Original preference of the user.
     * @param additions - New additions.
     * @returns Migrated branding preference.
     */
    public static migrateThemePreference = (original: BrandingPreferenceInterface,
        additions: Partial<BrandingPreferenceInterface>): BrandingPreferenceInterface => {

        const migratedThemePreference: BrandingPreferenceInterface = cloneDeep(original);

        // If the preference is of v1, create a `theme` object and set the defaults.
        if (!original.theme && additions.theme) {
            migratedThemePreference.theme = additions.theme;
        }

        for (const theme in PredefinedThemes) {
            // v2 Migrations!
            // If the preference is of v1, move `images` inside the theme.
            if (original.images) {
                migratedThemePreference.theme[ PredefinedThemes[ theme ] ].images = original.images;
            }

            // v3 Migrations!
            const originalPrimaryColor: string = migratedThemePreference.theme[
                PredefinedThemes[ theme ]
            ].colors.primary;

            if (typeof originalPrimaryColor === "string") {
                delete migratedThemePreference.theme[ PredefinedThemes[ theme ] ].colors.primary;
                migratedThemePreference.theme[ PredefinedThemes[ theme ] ].colors.primary = {
                    main: originalPrimaryColor
                };
            }

            const originalSecondaryColor: string = migratedThemePreference.theme[
                PredefinedThemes[ theme ]
            ].colors.secondary;

            if (typeof originalSecondaryColor === "string") {
                delete migratedThemePreference.theme[ PredefinedThemes[ theme ] ].colors.secondary;
                migratedThemePreference.theme[ PredefinedThemes[ theme ] ].colors.secondary = {
                    main: originalSecondaryColor
                };
            }

            if (migratedThemePreference.theme[PredefinedThemes[ theme ]].page) {
                const originalLoginPageBackgroundColor: string = migratedThemePreference.theme[
                    PredefinedThemes[ theme ]
                ].page?.background?.backgroundColor;

                if (!migratedThemePreference.theme[ PredefinedThemes[ theme ] ].colors?.background
                    && originalLoginPageBackgroundColor) {
                    migratedThemePreference.theme[ PredefinedThemes[ theme ] ].colors.background = {
                        body: {
                            main: originalLoginPageBackgroundColor
                        }
                    };
                }

                const originalPageFontColor: string = migratedThemePreference.theme[
                    PredefinedThemes[ theme ]
                ].page?.font?.color;

                if (!migratedThemePreference.theme[ PredefinedThemes[ theme ] ].colors?.text && originalPageFontColor) {
                    migratedThemePreference.theme[ PredefinedThemes[ theme ] ].colors.text = {
                        primary: originalPageFontColor
                    };
                }

                migratedThemePreference.theme[ PredefinedThemes[ theme ] ].loginPage = migratedThemePreference.theme[
                    PredefinedThemes[ theme ]
                ].page;
                delete migratedThemePreference.theme[ PredefinedThemes[ theme ] ].page;
            }

            migratedThemePreference.theme[ PredefinedThemes[ theme ] ] = merge(
                BrandingPreferenceMeta.getThemes()[ theme ],
                migratedThemePreference.theme[ PredefinedThemes[ theme ] ]
            );
        }

        if ("removeAsgardeoBranding" in migratedThemePreference.configs) {
            migratedThemePreference.configs.removeDefaultBranding = 
                migratedThemePreference.configs.removeAsgardeoBranding;
            delete migratedThemePreference.configs.removeAsgardeoBranding;
        }

        return migratedThemePreference;
    };

    /**
     * Migrate the layout preference to add all relevant properties to the layout section.
     * And also this method will takecare of older branding preference object and add layout
     * preferences to those objects.
     *
     * @param original - Original preference of the user.
     * @param additions - New additions.
     * @returns Migrated Layout preference.
     */
    public static migrateLayoutPreference = (original: BrandingPreferenceInterface,
        additions: Partial<BrandingPreferenceInterface>): BrandingPreferenceInterface => {

        const migratedPreference: BrandingPreferenceInterface = cloneDeep(original);
        const migratingObject: BrandingPreferenceLayoutInterface = cloneDeep(additions.layout);
        const defaultProperties: DynamicBrandingPreferenceLayoutInterface = cloneDeep(LAYOUTS);

        if (!original.layout && additions.layout) {
            migratedPreference.layout = migratingObject;
        } else if (original.layout && additions.layout) {
            merge(migratingObject, migratedPreference.layout);

            migratedPreference.layout = migratingObject;
        } else if (original.layout && !additions.layout) {
            const migratedLayoutSection: BrandingPreferenceLayoutInterface
                = merge(defaultProperties, migratedPreference.layout);

            migratedPreference.layout = migratedLayoutSection;
        } else {
            migratedPreference.layout = {
                activeLayout: BrandingPreferencesConstants.DEFAULT_LAYOUT,
                ...LAYOUTS
            };
        }

        return migratedPreference;
    };

    /**
     * Get the default branding preference.
     *
     * @param overrides - Object to merge.
     * @returns Default branding preference.
     */
    public static getDefaultBrandingPreference(
        overrides?: Partial<BrandingPreferenceInterface>): BrandingPreferenceInterface {

        return merge(BrandingPreferencesConstants.DEFAULT_PREFERENCE, overrides);
    }

    /**
     * Fetches the theme variables of the core theme (ATM `asgardeo`) from `@wso2is/theme`.
     * And set them as the defaults for the `LIGHT` theme.
     * Also generate the defaults for other themes.
     *
     * @param appTheme - Theme used by the app from `@wso2is/theme`.
     * @returns Predefined theme preference.
     */
    public static getPredefinedThemePreferences = (
        appTheme: string): Promise<BrandingPreferenceThemeInterface> => {

        return import(`../../../themes/${ appTheme }/theme-variables.json`)
            .then((response: Record<string, string>) => {
                return Promise.resolve({
                    activeTheme: BrandingPreferencesConstants.DEFAULT_THEME,
                    ...merge(BrandingPreferenceMeta.getThemes(),
                        {
                            [ PredefinedThemes.LIGHT ]: {
                                buttons: {
                                    externalConnection: {
                                        base: {
                                            background: {
                                                backgroundColor:
                                                    response.loginPortalExternalConnectionButtonBackgroundColor
                                            },
                                            border: {
                                                borderRadius: response.buttonBorderRadius
                                            }
                                        }
                                    },
                                    primary: {
                                        base: {
                                            border: {
                                                borderRadius: response.buttonBorderRadius
                                            }
                                        }
                                    },
                                    secondary: {
                                        base: {
                                            border: {
                                                borderRadius: response.buttonBorderRadius
                                            }
                                        }
                                    }
                                },
                                colors: {
                                    background: {
                                        body: {
                                            main: response.pageBackground
                                        },
                                        surface: {
                                            inverted: response.asgardeoBlack
                                        }
                                    },
                                    illustrations: {
                                        accent1: {
                                            main: response.accentColor1
                                        },
                                        accent2: {
                                            main: response.accentColor2
                                        },
                                        accent3: {
                                            main: response.accentColor3
                                        },
                                        primary: {
                                            main: response.primaryColor
                                        },
                                        secondary: {
                                            main: response.secondaryColor
                                        }
                                    },
                                    primary: {
                                        main: response.primaryColor
                                    },
                                    secondary: {
                                        main: response.secondaryColor
                                    }
                                },
                                inputs: {
                                    base: {
                                        background: {
                                            backgroundColor: response.inputBackground
                                        },
                                        border: {
                                            borderRadius: response.defaultBorderRadius
                                        }
                                    }
                                },
                                loginBox: {
                                    border: {
                                        borderRadius: response.loginPortalLoginCardBorderRadius
                                    }
                                }
                            },
                            [ PredefinedThemes.DARK ]: {
                                buttons: {
                                    externalConnection: {
                                        base: {
                                            border: {
                                                borderRadius: response.buttonBorderRadius
                                            }
                                        }
                                    },
                                    primary: {
                                        base: {
                                            border: {
                                                borderRadius: response.buttonBorderRadius
                                            }
                                        }
                                    },
                                    secondary: {
                                        base: {
                                            border: {
                                                borderRadius: response.buttonBorderRadius
                                            }
                                        }
                                    }
                                },
                                colors: {
                                    illustrations: {
                                        accent1: {
                                            main: response.accentColor1
                                        },
                                        accent2: {
                                            main: response.accentColor2
                                        },
                                        accent3: {
                                            main: response.accentColor3
                                        },
                                        primary: {
                                            main: response.primaryColor
                                        },
                                        secondary: {
                                            main: response.secondaryColor
                                        }
                                    },
                                    primary: {
                                        main: response.primaryColor
                                    },
                                    secondary: {
                                        main: response.secondaryColor
                                    }
                                },
                                inputs: {
                                    base: {
                                        border: {
                                            borderRadius: response.defaultBorderRadius
                                        }
                                    }
                                },
                                loginBox: {
                                    border: {
                                        borderRadius: response.loginPortalLoginCardBorderRadius
                                    }
                                }
                            }
                        }
                    )
                });
            })
            .catch((error: AxiosError) => {
                return Promise.reject(error);
            });
    };

    /**
     * Checks if the preview container size is too small to display the preview properly.
     *
     * @param layout - Current selected layout.
     * @param width - Current preview container width.
     * @returns a boolean value.
     */
    public static isLayoutPreviewTrimmed(layout: PredefinedLayouts, width: number): boolean {
        switch(layout) {
            case PredefinedLayouts.LEFT_ALIGNED:
            case PredefinedLayouts.RIGHT_ALIGNED:
                return width < BrandingPreferencesConstants.BRANDING_PREVIEW_MIN_WIDTH_SIDE_ALIGNED;
            case PredefinedLayouts.LEFT_IMAGE:
            case PredefinedLayouts.RIGHT_IMAGE:
                return width < BrandingPreferencesConstants.BRANDING_PREVIEW_MIN_WIDTH_SIDE_IMAGE;
            default:
                return false;
        }
    }
}
