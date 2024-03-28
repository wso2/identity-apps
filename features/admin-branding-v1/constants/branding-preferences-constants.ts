/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsError } from "@wso2is/core/errors";
import { commonConfig } from "../../../extensions";
import { PredefinedLayouts } from "../meta/layouts";
import { BrandingPreferenceInterface, PredefinedThemes, ThemeConfigInterface } from "../models";

/**
 * Class containing Branding Preferences constants.
 */
export class BrandingPreferencesConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    public static readonly DEFAULT_THEME: PredefinedThemes = PredefinedThemes.LIGHT;
    public static readonly DEFAULT_LAYOUT: PredefinedLayouts = PredefinedLayouts.CENTERED;
    public static readonly DEFAULT_FONT_FROM_THEME: string = "Gilmer";
    public static readonly BRANDING_NOT_CONFIGURED_ERROR_CODE: string = "BPM-60002";
    public static readonly CUSTOM_TEXT_PREFERENCE_NOT_CONFIGURED_ERROR_CODE: string = "BPM-60006";
    public static readonly BRANDING_PREFERENCE_FETCH_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-CON-BPM-60001";
    public static readonly BRANDING_PREFERENCE_FETCH_ERROR_CODE: string = "ASG-CON-BPM-60002";
    public static readonly BRANDING_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-CON-BPM-60005";
    public static readonly BRANDING_PREFERENCE_UPDATE_ERROR_CODE: string = "ASG-CON-BPM-60006";
    public static readonly BRANDING_PREFERENCE_DELETE_ERROR_CODE: string = "ASG-CON-BPM-60008";
    public static readonly BRANDING_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-CON-BPM-60007";
    public static readonly BRANDING_PREVIEW_MIN_WIDTH_SIDE_ALIGNED: number = 519;
    public static readonly BRANDING_PREVIEW_MIN_WIDTH_SIDE_IMAGE: number = 556;

    /**
     * Branding Related Error Messages.
     */
    public static ErrorMessages: {
        BRANDING_PREFERENCE_DELETE_ERROR: IdentityAppsError;
        BRANDING_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
        BRANDING_PREFERENCE_FETCH_ERROR: IdentityAppsError;
        BRANDING_PREFERENCE_FETCH_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
        BRANDING_PREFERENCE_UPDATE_ERROR: IdentityAppsError;
        BRANDING_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
    } = {
        BRANDING_PREFERENCE_DELETE_ERROR: new IdentityAppsError(
            BrandingPreferencesConstants.BRANDING_PREFERENCE_DELETE_ERROR_CODE,
            "An error occurred while deleting the branding preferences for the requested resource.",
            "Error while deleting Branding Preferences",
            null
        ),
        BRANDING_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
            BrandingPreferencesConstants.BRANDING_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR_CODE,
            "Received an invalid status code while deleting the branding preferences for the requested resource.",
            "Invalid Error Code while deleting Branding Preferences",
            null
        ),
        BRANDING_PREFERENCE_FETCH_ERROR: new IdentityAppsError(
            BrandingPreferencesConstants.BRANDING_PREFERENCE_FETCH_ERROR_CODE,
            "An error occurred while fetching the branding preferences for the requested resource.",
            "Error while fetching Branding Preferences",
            null
        ),
        BRANDING_PREFERENCE_FETCH_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
            BrandingPreferencesConstants.BRANDING_PREFERENCE_FETCH_INVALID_STATUS_CODE_ERROR_CODE,
            "Received an invalid status code while fetching the branding preferences for the requested resource.",
            "Invalid Error Code while fetching Branding Preferences",
            null
        ),
        BRANDING_PREFERENCE_UPDATE_ERROR: new IdentityAppsError(
            BrandingPreferencesConstants.BRANDING_PREFERENCE_UPDATE_ERROR_CODE,
            "An error occurred while updating the branding preferences for the requested resource.",
            "Error while updating Branding Preferences",
            null
        ),
        BRANDING_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
            BrandingPreferencesConstants.BRANDING_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR_CODE,
            "Received an invalid status code while updating the branding preferences for the requested resource.",
            "Invalid Error Code while updating Branding Preferences",
            null
        )
    };

    /**
     * Branding preference tab ids.
     */
    public static readonly TABS: {
        ADVANCED_TAB_ID: string;
        DESIGN_TAB_ID: string;
        GENERAL_TAB_ID: string;
        TEXT_TAB_ID: string;
    } = {
        ADVANCED_TAB_ID: "advanced",
        DESIGN_TAB_ID: "design",
        GENERAL_TAB_ID: "general",
        TEXT_TAB_ID: "text"
    };

    /**
     * General form field constraints for validations.
     */
    public static readonly GENERAL_DETAILS_FORM_FIELD_CONSTRAINTS: {
        SUPPORT_EMAIL_MAX_LENGTH: number,
        SUPPORT_EMAIL_MIN_LENGTH: number,
        DISPLAY_NAME_MAX_LENGTH: number,
        DISPLAY_NAME_MIN_LENGTH: number
    } = {
        DISPLAY_NAME_MAX_LENGTH: 100,
        DISPLAY_NAME_MIN_LENGTH: 3,
        SUPPORT_EMAIL_MAX_LENGTH: 100,
        SUPPORT_EMAIL_MIN_LENGTH: 3
    };

    /**
     * Design form field constraints for validations.
     */
    public static readonly DESIGN_FORM_FIELD_CONSTRAINTS: {
        BORDER_RADIUS_MAX_LENGTH: number,
        BORDER_RADIUS_MIN_LENGTH: number,
        BORDER_WIDTH_MAX_LENGTH: number,
        BORDER_WIDTH_MIN_LENGTH: number,
        FAVICON_URL_MAX_LENGTH: number,
        FAVICON_URL_MIN_LENGTH: number
        FONT_FAMILY_MAX_LENGTH: number,
        FONT_FAMILY_MIN_LENGTH: number,
        FONT_IMPORT_URL_MAX_LENGTH: number,
        FONT_IMPORT_URL_MIN_LENGTH: number,
        LOGO_ALT_TEXT_MAX_LENGTH: number,
        LOGO_ALT_TEXT_MIN_LENGTH: number,
        LOGO_URL_MAX_LENGTH: number,
        LOGO_URL_MIN_LENGTH: number,
        MYACCOUNT_LOGO_ALT_TEXT_MAX_LENGTH: number,
        MYACCOUNT_LOGO_ALT_TEXT_MIN_LENGTH: number,
        MYACCOUNT_LOGO_TITLE_MAX_LENGTH: number,
        MYACCOUNT_LOGO_TITLE_MIN_LENGTH: number,
        MYACCOUNT_LOGO_URL_MAX_LENGTH: number,
        MYACCOUNT_LOGO_URL_MIN_LENGTH: number,
        SIDE_IMAGE_URL_MAX_LENGTH: number,
        SIDE_IMAGE_URL_MIN_LENGTH: number,
        SIDE_IMAGE_ALT_TEXT_MAX_LENGTH: number,
        SIDE_IMAGE_ALT_TEXT_MIN_LENGTH: number,
        PRODUCT_TAGLINE_TEXT_MAX_LENGTH: number,
        PRODUCT_TAGLINE_TEXT_MIN_LENGTH: number,
    } = {
        BORDER_RADIUS_MAX_LENGTH: 100,
        BORDER_RADIUS_MIN_LENGTH: 3,
        BORDER_WIDTH_MAX_LENGTH: 100,
        BORDER_WIDTH_MIN_LENGTH: 3,
        FAVICON_URL_MAX_LENGTH: 2048,
        FAVICON_URL_MIN_LENGTH: 3,
        FONT_FAMILY_MAX_LENGTH: 1024,
        FONT_FAMILY_MIN_LENGTH: 3,
        FONT_IMPORT_URL_MAX_LENGTH: 2048,
        FONT_IMPORT_URL_MIN_LENGTH: 3,
        LOGO_ALT_TEXT_MAX_LENGTH: 100,
        LOGO_ALT_TEXT_MIN_LENGTH: 1,
        LOGO_URL_MAX_LENGTH: 2048,
        LOGO_URL_MIN_LENGTH: 3,
        MYACCOUNT_LOGO_ALT_TEXT_MAX_LENGTH: 100,
        MYACCOUNT_LOGO_ALT_TEXT_MIN_LENGTH: 1,
        MYACCOUNT_LOGO_TITLE_MAX_LENGTH: 20,
        MYACCOUNT_LOGO_TITLE_MIN_LENGTH: 0,
        MYACCOUNT_LOGO_URL_MAX_LENGTH: 2048,
        MYACCOUNT_LOGO_URL_MIN_LENGTH: 3,
        PRODUCT_TAGLINE_TEXT_MAX_LENGTH: 100,
        PRODUCT_TAGLINE_TEXT_MIN_LENGTH: 1,
        SIDE_IMAGE_ALT_TEXT_MAX_LENGTH: 100,
        SIDE_IMAGE_ALT_TEXT_MIN_LENGTH: 1,
        SIDE_IMAGE_URL_MAX_LENGTH: 2048,
        SIDE_IMAGE_URL_MIN_LENGTH: 3
    };

    /**
     * Advance form field constraints for validations.
     */
    public static readonly ADVANCE_FORM_FIELD_CONSTRAINTS: {
        COOKIE_POLICY_URL_MAX_LENGTH: number,
        COOKIE_POLICY_URL_MIN_LENGTH: number,
        PRIVACY_POLICY_URL_MAX_LENGTH: number,
        PRIVACY_POLICY_URL_MIN_LENGTH: number,
        TOS_URL_MAX_LENGTH: number,
        TOS_URL_MIN_LENGTH: number
    } = {
        COOKIE_POLICY_URL_MAX_LENGTH: 2048,
        COOKIE_POLICY_URL_MIN_LENGTH: 3,
        PRIVACY_POLICY_URL_MAX_LENGTH: 2048,
        PRIVACY_POLICY_URL_MIN_LENGTH: 3,
        TOS_URL_MAX_LENGTH: 2048,
        TOS_URL_MIN_LENGTH: 3
    };

    /**
     * Default Preference Object.
     */
    public static readonly DEFAULT_PREFERENCE: BrandingPreferenceInterface = {
        configs: {
            isBrandingEnabled: false,
            // This should be decided based on the subscription tier.
            // TODO: Properly resolve once subscription API is integrated in to the console.
            // Tracked Here: https://github.com/wso2-enterprise/asgardeo-product/issues/8625
            removeDefaultBranding: commonConfig.enableDefaultBrandingPreviewSection
        },
        layout: {
            activeLayout: PredefinedLayouts.CENTERED,
            productTagLine: undefined,
            sideImg: {
                altText: undefined,
                imgURL: undefined
            }
        },
        organizationDetails: {
            displayName: "",
            supportEmail: ""
        },
        theme: {
            activeTheme: PredefinedThemes.LIGHT,
            [ PredefinedThemes.LIGHT ]: {
                buttons: {
                    externalConnection: {
                        base: {
                            background: {
                                backgroundColor: undefined
                            },
                            border: {
                                borderRadius: undefined
                            },
                            font: {
                                color: undefined
                            }
                        }
                    },
                    primary: {
                        base: {
                            border: {
                                borderRadius: undefined
                            },
                            font: {
                                color: undefined
                            }
                        }
                    },
                    secondary: {
                        base: {
                            border: {
                                borderRadius: undefined
                            },
                            font: {
                                color: undefined
                            }
                        }
                    }
                },
                colors: {
                    alerts: {
                        error: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        info: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        neutral: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        warning: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        }
                    },
                    background: {
                        body: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        surface: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        }
                    },
                    illustrations: {
                        accent1: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        accent2: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        accent3: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        primary: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        secondary: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        }
                    },
                    outlined: {
                        default: undefined
                    },
                    primary: {
                        contrastText: undefined,
                        dark: undefined,
                        light: undefined,
                        main: undefined
                    },
                    secondary: {
                        contrastText: undefined,
                        dark: undefined,
                        light: undefined,
                        main: undefined
                    },
                    text: {
                        primary: undefined,
                        secondary: undefined
                    }
                },
                footer: {
                    border: {
                        borderColor: undefined
                    },
                    font: {
                        color: undefined
                    }
                },
                images: {
                    favicon: {
                        imgURL: undefined
                    },
                    logo: {
                        altText: undefined,
                        imgURL: undefined
                    },
                    myAccountLogo: {
                        altText: undefined,
                        imgURL: undefined,
                        title: undefined
                    }
                },
                inputs: {
                    base: {
                        background: {
                            backgroundColor: undefined
                        },
                        border: {
                            borderColor: undefined,
                            borderRadius: undefined
                        },
                        font: {
                            color: undefined
                        },
                        labels: {
                            font: {
                                color: undefined
                            }
                        }
                    }
                },
                loginBox: {
                    background: {
                        backgroundColor: undefined
                    },
                    border: {
                        borderColor: undefined,
                        borderRadius: undefined,
                        borderWidth: undefined
                    },
                    font: {
                        color: undefined
                    }
                },
                loginPage: {
                    background: {
                        backgroundColor: undefined
                    },
                    font: {
                        color: undefined
                    }
                },
                typography: {
                    font: {
                        fontFamily: undefined,
                        importURL: undefined
                    },
                    heading: {
                        font: {
                            color: undefined
                        }
                    }
                }
            },
            [ PredefinedThemes.DARK ]: {
                buttons: {
                    externalConnection: {
                        base: {
                            background: {
                                backgroundColor: undefined
                            },
                            border: {
                                borderRadius: undefined
                            },
                            font: {
                                color: undefined
                            }
                        }
                    },
                    primary: {
                        base: {
                            border: {
                                borderRadius: undefined
                            },
                            font: {
                                color: undefined
                            }
                        }
                    },
                    secondary: {
                        base: {
                            border: {
                                borderRadius: undefined
                            },
                            font: {
                                color: undefined
                            }
                        }
                    }
                },
                colors: {
                    alerts: {
                        error: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        info: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        neutral: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        warning: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        }
                    },
                    background: {
                        body: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        surface: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        }
                    },
                    illustrations: {
                        accent1: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        accent2: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        accent3: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        primary: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        },
                        secondary: {
                            contrastText: undefined,
                            dark: undefined,
                            light: undefined,
                            main: undefined
                        }
                    },
                    outlined: {
                        default: undefined
                    },
                    primary: {
                        contrastText: undefined,
                        dark: undefined,
                        light: undefined,
                        main: undefined
                    },
                    secondary: {
                        contrastText: undefined,
                        dark: undefined,
                        light: undefined,
                        main: undefined
                    },
                    text: {
                        primary: undefined,
                        secondary: undefined
                    }
                },
                footer: {
                    border: {
                        borderColor: undefined
                    },
                    font: {
                        color: undefined
                    }
                },
                images: {
                    favicon: {
                        imgURL: undefined
                    },
                    logo: {
                        altText: undefined,
                        imgURL: undefined
                    },
                    myAccountLogo: {
                        altText: undefined,
                        imgURL: undefined,
                        title: undefined
                    }
                },
                inputs: {
                    base: {
                        background: {
                            backgroundColor: undefined
                        },
                        border: {
                            borderColor: undefined,
                            borderRadius: undefined
                        },
                        font: {
                            color: undefined
                        },
                        labels: {
                            font: {
                                color: undefined
                            }
                        }
                    }
                },
                loginBox: {
                    background: {
                        backgroundColor: undefined
                    },
                    border: {
                        borderColor: undefined,
                        borderRadius: undefined,
                        borderWidth: undefined
                    },
                    font: {
                        color: undefined
                    }
                },
                loginPage: {
                    background: {
                        backgroundColor: undefined
                    },
                    font: {
                        color: undefined
                    }
                },
                typography: {
                    font: {
                        fontFamily: undefined,
                        importURL: undefined
                    },
                    heading: {
                        font: {
                            color: undefined
                        }
                    }
                }
            }
        },
        urls: {
            cookiePolicyURL: "",
            privacyPolicyURL: "",
            termsOfUseURL: ""
        }
    };

    public static readonly DEFAULT_THEME_OBJECT: ThemeConfigInterface = {
        buttons: {
            externalConnection: {
                base: {
                    background: {
                        backgroundColor: undefined
                    },
                    border: {
                        borderRadius: undefined
                    },
                    font: {
                        color: undefined
                    }
                }
            },
            primary: {
                base: {
                    border: {
                        borderRadius: undefined
                    },
                    font: {
                        color: undefined
                    }
                }
            },
            secondary: {
                base: {
                    border: {
                        borderRadius: undefined
                    },
                    font: {
                        color: undefined
                    }
                }
            }
        },
        colors: {
            alerts: {
                error: {
                    contrastText: undefined,
                    dark: undefined,
                    light: undefined,
                    main: undefined
                },
                info: {
                    contrastText: undefined,
                    dark: undefined,
                    light: undefined,
                    main: undefined
                },
                neutral: {
                    contrastText: undefined,
                    dark: undefined,
                    light: undefined,
                    main: undefined
                },
                warning: {
                    contrastText: undefined,
                    dark: undefined,
                    light: undefined,
                    main: undefined
                }
            },
            background: {
                body: {
                    contrastText: undefined,
                    dark: undefined,
                    light: undefined,
                    main: undefined
                },
                surface: {
                    contrastText: undefined,
                    dark: undefined,
                    light: undefined,
                    main: undefined
                }
            },
            illustrations: {
                accent1: {
                    contrastText: undefined,
                    dark: undefined,
                    light: undefined,
                    main: undefined
                },
                accent2: {
                    contrastText: undefined,
                    dark: undefined,
                    light: undefined,
                    main: undefined
                },
                accent3: {
                    contrastText: undefined,
                    dark: undefined,
                    light: undefined,
                    main: undefined
                },
                primary: {
                    contrastText: undefined,
                    dark: undefined,
                    light: undefined,
                    main: undefined
                },
                secondary: {
                    contrastText: undefined,
                    dark: undefined,
                    light: undefined,
                    main: undefined
                }
            },
            outlined: {
                default: undefined
            },
            primary: {
                contrastText: undefined,
                dark: undefined,
                light: undefined,
                main: undefined
            },
            secondary: {
                contrastText: undefined,
                dark: undefined,
                light: undefined,
                main: undefined
            },
            text: {
                primary: undefined,
                secondary: undefined
            }
        },
        footer: {
            border: {
                borderColor: undefined
            },
            font: {
                color: undefined
            }
        },
        images: {
            favicon: {
                imgURL: undefined
            },
            logo: {
                altText: undefined,
                imgURL: undefined
            },
            myAccountLogo: {
                altText: undefined,
                imgURL: undefined,
                title: undefined
            }
        },
        inputs: {
            base: {
                background: {
                    backgroundColor: undefined
                },
                border: {
                    borderColor: undefined,
                    borderRadius: undefined
                },
                font: {
                    color: undefined
                },
                labels: {
                    font: {
                        color: undefined
                    }
                }
            }
        },
        loginBox: {
            background: {
                backgroundColor: undefined
            },
            border: {
                borderColor: undefined,
                borderRadius: undefined,
                borderWidth: undefined
            },
            font: {
                color: undefined
            }
        },
        loginPage: {
            background: {
                backgroundColor: undefined
            },
            font: {
                color: undefined
            }
        },
        typography: {
            font: {
                fontFamily: undefined,
                importURL: undefined
            },
            heading: {
                font: {
                    color: undefined
                }
            }
        }
    };
}
