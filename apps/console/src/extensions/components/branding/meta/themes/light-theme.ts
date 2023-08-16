/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { rgbToHex } from "@wso2is/react-components";
import { BrandingPreferencesConstants } from "../../constants";
import { ThemeConfigInterface } from "../../models";

export const LIGHT_THEME: ThemeConfigInterface ={
    buttons: {
        externalConnection: {
            base: {
                background: {
                    backgroundColor: "#FFFFFF"
                },
                border: {
                    borderRadius: "4px"
                },
                font: {
                    color: rgbToHex("rgba(0, 0, 0, 0.87)")
                }
            }
        },
        primary: {
            base: {
                border: {
                    borderRadius: "4px"
                },
                font: {
                    color: rgbToHex("rgba(255, 255, 255, 0.9)")
                }
            }
        },
        secondary: {
            base: {
                border: {
                    borderRadius: "4px"
                },
                font: {
                    color: rgbToHex("rgba(0, 0, 0, 0.87)")
                }
            }
        }
    },
    colors: {
        alerts: {
            error: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#ffd8d8"
            },
            info: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#eff7fd"
            },
            neutral: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#f8f8f9"
            },
            warning: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#fff6e7"
            }
        },
        background: {
            body: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#fbfbfb"
            },
            surface: {
                contrastText: "",
                dark: "#F6F4F2",
                inverted: "#212a32",
                light: "#f9fafb",
                main: "#ffffff"
            }
        },
        illustrations: {
            accent1: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#3865B5"
            },
            accent2: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#19BECE"
            },
            accent3: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#FFFFFF"
            },
            primary: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#FF7300"
            },
            secondary: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#E0E1E2"
            }
        },
        outlined: {
            default: "#dadce0"
        },
        primary: {
            contrastText: "",
            dark: "",
            inverted: "",
            light: "",
            main: "#FF7300"
        },
        secondary: {
            contrastText: "",
            dark: "",
            inverted: "",
            light: "",
            main: "#E0E1E2"
        },
        text: {
            primary: rgbToHex("rgba(0,0,0,.87)"),
            secondary: rgbToHex("rgba(0,0,0,.4)")
        }
    },
    footer: {
        border: {
            borderColor: ""
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
        },
        myAccountLogo: {
            altText: undefined,
            imgURL: undefined,
            title: "Account"
        }
    },
    inputs: {
        base: {
            background: {
                backgroundColor: "#FFFFFF"
            },
            border: {
                borderColor: "",
                borderRadius: "4px"
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
            backgroundColor: ""
        },
        border: {
            borderColor: "",
            borderRadius: "12px",
            borderWidth: "1px"
        },
        font: {
            color: ""
        }
    },
    loginPage: {
        background: {
            backgroundColor: ""
        },
        font: {
            color: ""
        }
    },
    typography: {
        font: {
            fontFamily: BrandingPreferencesConstants.DEFAULT_FONT_FROM_THEME
        },
        heading: {
            font: {
                color: ""
            }
        }
    }
};
