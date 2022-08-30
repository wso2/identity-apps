/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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


/**
  * Interface to campture Email Template type
  */
export interface EmailTemplateType {
    id: string;
    displayName?: string;
    self: string;
}

/**
 * Interface to capture Email Template Type Details
 */
export interface EmailTemplateDetails {
    displayName: string;
    templates: EmailTemplate[];
    id: string;
}

/**
 * Interface to capture Email Template
 */
export interface EmailTemplate {
    contentType?: string;
    subject: string;
    body: string;
    footer: string;
    id?: string;
}

/**
 * Enum for the email template edit form modes..
 *
 * @readonly
 * @enum {string}
 */
export enum EmailTemplateFormModes {
    ADD = "ADD",
    EDIT = "EDIT"
}

/**
 * Interface to capture Branding Preferences
 */
export interface BrandingPreference {
    configs: {
         isBrandingEnabled: boolean,
         removeAsgardeoBranding: boolean
    },
    organizationDetails: {
        copyrightText: string,
        siteTitle: string,
        supportEmail: string
    },
    theme: {
        activeTheme: string,
        LIGHT: {
            buttons: {
                externalConnection: {
                    base: {
                        background: {
                            backgroundColor: string
                        },
                        border: {
                            borderRadius: string
                        },
                        font: {
                            color: string
                        }
                    }
                },
                primary: {
                    base: {
                        border: {
                            borderRadius: string
                        },
                        font: {
                            color: string
                        }
                    }
                },
                secondary: {
                    base: {
                        border: {
                            borderRadius: string
                        },
                        font: {
                            color: string
                        }
                    }
                }
            },
            colors: {
                primary: string,
                secondary: string
            },
            footer: {
                border: {
                    borderColor: string
                },
                font: {
                    color: string
                }
            },
            images: {
                favicon: {
                    imgURL: string
                },
                logo: {
                    altText: string,
                    imgURL: string
                }
            },
            inputs: {
                base: {
                    background: {
                        backgroundColor: string
                    },
                    border: {
                        borderColor: string,
                        borderRadius: string
                    },
                    font: {
                        color: string
                    },
                    labels: {
                        font: {
                            color: string
                        }
                    }
                }
            },
            loginBox: {
                background: {
                    backgroundColor: string
                },
                border: {
                    borderColor: string,
                    borderRadius: string,
                    borderWidth: string
                },
                font: {
                    color: string
                }
            },
            page: {
                background: {
                    backgroundColor: string
                },
                font: {
                    color: string
                }
            },
            typography: {
                font: {
                    fontFamily: string,
                    importURL: string
                },
                heading: {
                    font: {
                        color: string
                    }
                }
            }
        },
        DARK: {
            buttons: {
                externalConnection: {
                    base: {
                        background: {
                            backgroundColor: string
                        },
                        border: {
                            borderRadius: string
                        },
                        font: {
                            color: string
                        }
                    }
                },
                primary: {
                    base: {
                        border: {
                            borderRadius: string
                        },
                        font: {
                            color: string
                        }
                    }
                },
                secondary: {
                    base: {
                        border: {
                            borderRadius: string
                        },
                        font: {
                            color: string
                        }
                    }
                }
            },
            colors: {
                primary: string,
                secondary: string
            },
            footer: {
                border: {
                    borderColor: string
                },
                font: {
                    color: string
                }
            },
            images: {
                favicon: {
                    imgURL: string
                },
                logo: {
                    altText: string,
                    imgURL: string
                }
            },
            inputs: {
                base: {
                    background: {
                        backgroundColor: string
                    },
                    border: {
                        borderColor: string,
                        borderRadius: string
                    },
                    font: {
                        color: string
                    },
                    labels: {
                        font: {
                            color: string
                        }
                    }
                }
            },
            loginBox: {
                background: {
                    backgroundColor: string
                },
                border: {
                    borderColor: string,
                    borderRadius: string,
                    borderWidth: string
                },
                font: {
                    color: string
                }
            },
            page: {
                background: {
                    backgroundColor: string
                },
                font: {
                    color: string
                }
            },
            typography: {
                font: {
                    fontFamily: string
                },
                heading: {
                    font: {
                        color: string
                    }
                }
            }
        }
    },
    urls: {
        cookiePolicyURL: string,
        privacyPolicyURL: string,
        termsOfUseURL: string
    }
}
