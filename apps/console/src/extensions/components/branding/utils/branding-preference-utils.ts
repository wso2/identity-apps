/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import cloneDeep from "lodash-es/cloneDeep";
import merge from "lodash-es/merge";
import { BrandingPreferencesConstants } from "../constants";
import { BrandingPreferenceMeta } from "../meta";
import { PredefinedThemes } from "../meta/themes";
import {
    BrandingPreferenceInterface,
    BrandingPreferenceThemeInterface
} from "../models";

/**
 * Utility class for Branding Preference related operations.
 */
export class BrandingPreferenceUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    private constructor() { }

    /**
     * Migrate the theme preference from v1 -> v2.
     *
     * @remarks
     * Migrations:
     *     - The `theme` object inside the `preference` doc was introduced later
     *       `colors` & `images` objects were moved inside the respective theme.
     *
     * @param {BrandingPreferenceInterface} original - Original preference of the user.
     * @param {Partial<BrandingPreferenceInterface>} additions - New additions.
     * @return {BrandingPreferenceInterface}
     */
    public static migrateThemePreference = (original: BrandingPreferenceInterface,
        additions: Partial<BrandingPreferenceInterface>): BrandingPreferenceInterface => {

        const migratedThemePreference: BrandingPreferenceInterface = cloneDeep(original);

        // If the preference is of v1, create a `theme` object and set the defaults.
        if (!original.theme && additions.theme) {
            migratedThemePreference.theme = additions.theme;
        }

        // If the preference is of v1, move `images` inside the theme.
        for (const theme in PredefinedThemes) {
            if (original.images) {
                migratedThemePreference.theme[ PredefinedThemes[ theme ] ].images = original.images;
            }
        }

        return migratedThemePreference;
    };

    /**
     * Get the default branding preference.
     *
     * @param {Partial<BrandingPreferenceInterface>} overrides - Object to merge.
     * @return {BrandingPreferenceInterface}
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
     * @param {string} appTheme - Theme used by the app from `@wso2is/theme`.
     * @return {BrandingPreferenceThemeInterface}
     */
    public static getPredefinedThemePreferences = (
        appTheme: string): Promise<BrandingPreferenceThemeInterface> => {

        return import(`../../../../themes/${ appTheme }/theme-variables.json`)
            .then((response: Record<string, string>) => {
                return Promise.resolve({
                    activeTheme: BrandingPreferencesConstants.DEFAULT_THEME,
                    ...BrandingPreferenceMeta.getThemes(),
                    // TODO: Bring this back once the following is fixed.
                    // https://github.com/wso2-enterprise/asgardeo-product/issues/9972
                    /*[ PredefinedThemes.LIGHT ]: {
                        buttons: {
                            externalConnection: {
                                base: {
                                    background: {
                                        backgroundColor: response.loginPortalExternalConnectionButtonBackgroundColor
                                    },
                                    border: {
                                        borderRadius: response.defaultBorderRadius
                                    },
                                    font: {
                                        color: response.textColor
                                    }
                                }
                            },
                            primary: {
                                base: {
                                    border: {
                                        borderRadius: response.defaultBorderRadius
                                    },
                                    font: {
                                        color: response.invertedTextColor
                                    }
                                }
                            },
                            secondary: {
                                base: {
                                    border: {
                                        borderRadius: response.defaultBorderRadius
                                    },
                                    font: {
                                        color: response.textColor
                                    }
                                }
                            }
                        },
                        colors: {
                            primary: response.primaryColor,
                            secondary: response.secondaryColor
                        },
                        footer: {
                            border: {
                                borderColor: response.defaultBorderColor
                            },
                            font: {
                                color: ""
                            }
                        },
                        images: {
                            favicon: {
                                imgURL: undefined
                            },
                            logo: {
                                altText: undefined,
                                imgURL: undefined
                            }
                        },
                        inputs: {
                            base: {
                                background: {
                                    backgroundColor: response.inputBackground
                                },
                                border: {
                                    borderColor: response.defaultBorderColor,
                                    borderRadius: response.absoluteBorderRadius
                                },
                                font: {
                                    color: ""
                                },
                                labels: {
                                    font: {
                                        color: ""
                                    }
                                }
                            }
                        },
                        loginBox: {
                            background: {
                                backgroundColor: response.loginPortalLoginCardBackground
                            },
                            border: {
                                borderColor: response.loginPortalLoginCardBorderColor,
                                borderRadius: response.loginPortalLoginCardBorderRadius,
                                borderWidth: response.defaultBorderWidth
                            },
                            font: {
                                color: ""
                            }
                        },
                        page: {
                            background: {
                                backgroundColor: response.loginPortalBackgroundColor
                            },
                            font: {
                                color: response.textColor
                            }
                        },
                        typography: {
                            font: {
                                fontFamily: response.primaryFont
                            },
                            heading: {
                                font: {
                                    color: ""
                                }
                            }
                        }
                    }*/
                });
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };
}
