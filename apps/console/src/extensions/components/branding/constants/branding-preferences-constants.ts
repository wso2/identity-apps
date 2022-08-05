/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentityAppsError } from "@wso2is/core/errors";
import { PredefinedThemes } from "../meta/themes";
import { BrandingPreferenceInterface, ThemeConfigInterface } from "../models";

/**
 * Class containing Branding Preferences constants.
 */
export class BrandingPreferencesConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    private constructor() { }

    public static readonly DEFAULT_THEME: PredefinedThemes = PredefinedThemes.LIGHT;
    public static readonly DEFAULT_FONT_FROM_THEME: string = "Montserrat";
    public static readonly BRANDING_NOT_CONFIGURED_ERROR_CODE: string = "BPM-60002";
    public static readonly BRANDING_PREFERENCE_FETCH_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-CON-BPM-60001";
    public static readonly BRANDING_PREFERENCE_FETCH_ERROR_CODE: string = "ASG-CON-BPM-60002";
    public static readonly BRANDING_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-CON-BPM-60005";
    public static readonly BRANDING_PREFERENCE_UPDATE_ERROR_CODE: string = "ASG-CON-BPM-60006";
    public static readonly BRANDING_PREFERENCE_DELETE_ERROR_CODE: string = "ASG-CON-BPM-60008";
    public static readonly BRANDING_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-CON-BPM-60007";

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
     * General form field constraints for validations.
     */
    public static readonly GENERAL_DETAILS_FORM_FIELD_CONSTRAINTS: {
        COPYRIGHT_TEXT_MAX_LENGTH: number,
        COPYRIGHT_TEXT_MIN_LENGTH: number,
        SITE_TITLE_MAX_LENGTH: number,
        SITE_TITLE_MIN_LENGTH: number,
        SUPPORT_EMAIL_MAX_LENGTH: number,
        SUPPORT_EMAIL_MIN_LENGTH: number
    } = {
        COPYRIGHT_TEXT_MAX_LENGTH: 100,
        COPYRIGHT_TEXT_MIN_LENGTH: 3,
        SITE_TITLE_MAX_LENGTH: 100,
        SITE_TITLE_MIN_LENGTH: 3,
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
        LOGO_URL_MIN_LENGTH: number
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
        LOGO_URL_MIN_LENGTH: 3
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
            removeAsgardeoBranding: false
        },
        organizationDetails: {
            copyrightText: "",
            siteTitle: "",
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
                    primary: undefined,
                    secondary: undefined
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
                page: {
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
                    primary: undefined,
                    secondary: undefined
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
                page: {
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
            primary: undefined,
            secondary: undefined
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
        page: {
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
