/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { BrandingPreferencesConstants } from "../../constants";
import { ThemeConfigInterface } from "../../models";

export const DARK_THEME: ThemeConfigInterface = {
    buttons: {
        externalConnection: {
            base: {
                background: {
                    backgroundColor: "#24292e"
                },
                border: {
                    borderRadius: "4px"
                },
                font: {
                    color: "#ffffff"
                }
            }
        },
        primary: {
            base: {
                border: {
                    borderRadius: "4px"
                },
                font: {
                    color: "#ffffff"
                }
            }
        },
        secondary: {
            base: {
                border: {
                    borderRadius: "4px"
                },
                font: {
                    color: "#000000"
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
                main: "#ff000054"
            },
            info: {
                contrastText: "",
                dark: "#01579b",
                inverted: "",
                light: "#03a9f4",
                main: "#1971c233"
            },
            neutral: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#343a4033"
            },
            warning: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#f08c0033"
            }
        },
        background: {
            body: {
                contrastText: "",
                dark: "",
                inverted: "",
                light: "",
                main: "#17191a"
            },
            surface: {
                contrastText: "",
                dark: "#1e2021",
                inverted: "#17191a",
                light: "#2b2d2e",
                main: "#242627"
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
            default: "#3f4042"
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
            main: "#ffffff"
        },
        text: {
            primary: "#EBEBEF",
            secondary: "#B9B9C6"
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
                backgroundColor: "#000000"
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
