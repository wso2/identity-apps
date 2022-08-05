/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

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
        primary: "#FF7300",
        secondary: "#ffffff"
    },
    footer: {
        border: {
            borderColor: "#333333"
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
                backgroundColor: "#000000"
            },
            border: {
                borderColor: "#292929",
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
            backgroundColor: "#111111"
        },
        border: {
            borderColor: "#333333",
            borderRadius: "12px",
            borderWidth: "1px"
        },
        font: {
            color: ""
        }
    },
    page: {
        background: {
            backgroundColor: "#000000"
        },
        font: {
            color: "#ffffff"
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
