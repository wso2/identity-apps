/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { rgbToHex } from "@wso2is/react-components";
import { ThemeConfigInterface } from "../../models";

export const LIGHT_THEME: ThemeConfigInterface ={
    buttons: {
        externalConnection: {
            base: {
                background: {
                    backgroundColor: "#0000000a"
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
        primary: "#FF7300",
        secondary: "#E0E1E2"
    },
    footer: {
        border: {
            borderColor: rgbToHex("rgba(34, 36, 38, 0.15)")
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
                backgroundColor: "#FFFFFF"
            },
            border: {
                borderColor: rgbToHex("rgba(34, 36, 38, 0.15)"),
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
            backgroundColor: "#FFFFFF"
        },
        border: {
            borderColor: "transparent",
            borderRadius: "12px",
            borderWidth: "1px"
        },
        font: {
            color: ""
        }
    },
    page: {
        background: {
            backgroundColor: "#F5F6F6"
        },
        font: {
            color: rgbToHex("rgba(0,0,0,.87)")
        }
    },
    typography: {
        font: {
            fontFamily: "Montserrat"
        },
        heading: {
            font: {
                color: ""
            }
        }
    }
};
