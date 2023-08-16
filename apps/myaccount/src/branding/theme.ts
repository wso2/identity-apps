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
import { BrandingPreferenceContextProps } from "../contexts";
import { ThemeConfigInterface } from "../models";

export const generateAsgardeoTheme: (branding: BrandingPreferenceContextProps) => Theme = (
    branding: BrandingPreferenceContextProps
) => {
    const mode: string = branding?.brandingPreference?.preference?.theme?.activeTheme.toLowerCase() ?? "light";
    const brandingTheme: ThemeConfigInterface = branding?.brandingPreference?.preference?.theme[mode.toUpperCase()];

    return extendTheme({
        colorSchemes: {
            dark: {
                brand: {
                    logo: {
                        main: brandingTheme?.images?.myAccountLogo?.imgURL 
                            ?? `${process.env.PUBLIC_URL}/assets/brands/asgardeo/images/asgardeo-logo-inverted.svg`
                    }
                },
                palette: {
                    customComponents: {
                        AppShell: {
                            Main: {
                                background:
                                    brandingTheme?.colors?.background?.body?.main ??
                                    "var(--oxygen-palette-background-paper)"
                            },
                            MainWrapper: {
                                background:
                                    brandingTheme?.colors?.background?.surface?.dark ??
                                    "var(--oxygen-palette-background-paper)"
                            }
                        },
                        Navbar: {
                            background:
                                brandingTheme?.colors?.background?.surface?.dark ??
                                "var(--oxygen-palette-background-paper)"
                        }
                    },
                    gradients: {
                        primary: {
                            stop1: "#EB4F63",
                            stop2: "#FA7B3F"
                        }
                    },
                    primary: {
                        main: brandingTheme?.colors?.primary?.main ?? "#ff7300"
                    }
                }
            },
            light: {
                brand: {
                    logo: {
                        main: brandingTheme?.images?.myAccountLogo?.imgURL
                            ?? `${process.env.PUBLIC_URL}/assets/brands/asgardeo/images/asgardeo-logo.svg`
                    }
                },
                palette: {
                    customComponents: {
                        AppShell: {
                            Main: {
                                background: brandingTheme?.colors?.background?.body?.main ?? "#FAF9F8"
                            },
                            MainWrapper: {
                                background: brandingTheme?.colors?.background?.surface?.dark ?? "#F6F4F2"
                            }
                        },
                        Navbar: {
                            background: brandingTheme?.colors?.background?.surface?.dark ?? "#F6F4F2"
                        }
                    },
                    gradients: {
                        primary: {
                            stop1: "#EB4F63",
                            stop2: "#FA7B3F"
                        }
                    },
                    primary: {
                        main: brandingTheme?.colors?.primary?.main ?? "#ff7300"
                    }
                }
            }
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: brandingTheme?.colors?.background?.surface?.dark ?? "#F6F4F2",
                        borderBottom: "none"
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
            }
        },
        shape: {
            borderRadius: 4
        },
        typography: {
            fontFamily: brandingTheme?.typography ?? "Gilmer, sans-serif",
            h1: {
                fontWeight: 700
            }
        }
    });
};
