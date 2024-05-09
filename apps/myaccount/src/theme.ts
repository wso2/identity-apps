/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

// eslint-disable-next-line no-restricted-imports
import { Theme } from "@oxygen-ui/react";
import { extendTheme } from "@oxygen-ui/react/theme";
import { BrandingPreferenceContextProps } from "./contexts";
import { ThemeConfigInterface } from "./models";

const generateTheme: (branding: BrandingPreferenceContextProps) => Theme = (
    branding: BrandingPreferenceContextProps
) => {
    const mode: string = branding?.brandingPreference?.preference?.theme?.activeTheme.toLowerCase() ?? "light";
    const brandingTheme: ThemeConfigInterface = branding?.brandingPreference?.preference?.theme[mode.toUpperCase()];

    return extendTheme({
        colorSchemes: {
            dark: {
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

export default generateTheme;
