/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// eslint-disable-next-line no-restricted-imports
import { Theme } from "@oxygen-ui/react";
import { extendTheme } from "@oxygen-ui/react/theme";

export const AsgardeoTheme: Theme = extendTheme({
    colorSchemes: {
        dark: {
            brand: {
                logo: {
                    main: `${process.env.PUBLIC_URL}/assets/brands/asgardeo/images/asgardeo-logo-inverted.svg`
                }
            },
            palette: {
                customComponents: {
                    Navbar: {
                        collapsibleItemBackground: "#E7E4E2"
                    }
                },
                gradients: {
                    primary: {
                        stop1: "#EB4F63",
                        stop2: "#FA7B3F"
                    }
                },
                primary: {
                    main: "#ff7300"
                }
            }
        },
        light: {
            brand: {
                logo: {
                    main: `${process.env.PUBLIC_URL}/assets/brands/asgardeo/images/asgardeo-logo.svg`
                }
            },
            palette: {
                customComponents: {
                    AppShell: {
                        Main: {
                            background: "#FAF9F8"
                        },
                        MainWrapper: {
                            background: "#F6F4F2"
                        }
                    },
                    Navbar: {
                        background: "#F6F4F2",
                        collapsibleItemBackground: "#E7E4E2"
                    }
                },
                gradients: {
                    primary: {
                        stop1: "#EB4F63",
                        stop2: "#FA7B3F"
                    }
                },
                primary: {
                    main: "#ff7300"
                }
            }
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#F6F4F2",
                    borderBottom: "none"
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontSize: "0.6125rem",
                    height: "20px"
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: "none",
                    boxShadow: "none"
                }
            }
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)"
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                input: {
                    padding: "0.67857143em 1em"
                }
            }
        }
    },
    customComponents: {
        AppShell: {
            properties: {
                mainBorderTopLeftRadius: "24px",
                navBarTopPosition: "80px"
            }
        },
        Navbar: {
            properties: {
                "chip-background-color": "#a333c8",
                "chip-color": "var(--oxygen-palette-primary-contrastText)"
            }
        }
    },
    shape: {
        borderRadius: 8
    },
    typography: {
        fontFamily: "Gilmer, sans-serif",
        h1: {
            fontWeight: 700
        }
    }
});
