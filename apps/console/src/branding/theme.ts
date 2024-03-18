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

export const AsgardeoTheme: Theme = extendTheme({
    colorSchemes: {
        dark: {
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
                },
                root: {
                    fontFamily: "Gilmer, sans-serif"
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
