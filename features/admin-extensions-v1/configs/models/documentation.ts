/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Interface for the account recovery section documentation structure.
 */
interface AccountRecoveryDocumentationLinksInterface {
    passwordRecovery: {
        learnMore: string;
    }
}

/**
 * Interface for the login security section documentation structure.
 */
interface LoginSecurityDocumentationLinksInterface {
    botDetection: {
        learnMore: string;
    },
    loginAttempts: {
        learnMore: string;
    }
}

/**
 * Interface for the API Resources section documentation structure.
 */
interface APIResourcesDocumentationLinksInterface {
    addAPIResource: {
        rbacInfoBox: {
            learnMore: string
        }
        requiredAuthorization: {
            learnMore: string;
        }
    }
    learnMore: string;
}

/**
 * Interface for the applications section documentation structure.
 */
interface ApplicationsDocumentationLinksInterface {
    apiAuthorization: {
        learnMore: string;
        policies: {
            noPolicy: {
                learnMore: string;
            }
            rbac: {
                learnMore: string;
            }
        }
    }
    learnMore: string;
    applicationsSettings: {
        dcr: {
            learnMore: string;
            authenticationRequired: {
                learnMore: string;
            },
        }
    },
    editApplication: {
        asgardeoTryitApplication: {
            general: {
                learnMore: string
            }
        },
        attributeManagement: {
            manageOIDCScopes: string;
        },
        common: {
            signInMethod: {
                learnMore: string;
                conditionalAuthenticaion: {
                    apiReference: string;
                    learnMore: string;
                    template: {
                        deviceBased: {
                            learnMore: string;
                        }
                        groupBased: {
                            learnMore: string;
                        }
                        ipBased: {
                            learnMore: string;
                        }
                        userAgeBased: {
                            learnMore: string;
                        }
                    }
                }
            }
        }
        oidcApplication: {
            advanced: {
                learnMore: string;
            }
            attributes: {
                learnMore: string;
            }
            info: {
                learnMore: string;
            }
            protocol: {
                learnMore: string;
            };
            quickStart: {
                applicationScopes: {
                    learnMore: string;
                };
                customConfig: {
                    learnMore: string;
                };
                mavenDownload: string;
                mobileApp: {
                    learnMore: string;
                };
            };
        }
        samlApplication: {
            advanced: {
                learnMore: string;
            }
            attributes: {
                learnMore: string;
            }
            info: {
                learnMore: string;
            }
            protocol: {
                learnMore: string;
            };
            quickStart: {
                customConfig: {
                    learnMore: string;
                };
                mavenDownload: string;
            };
        },
        signInMethod: {
            fido: string;
        };
        singlePageApplication: {
            quickStart: {
                customConfig: {
                    learnMore: string;
                };
                nodejsDownload: string;
            };
            info: {
                learnMore: string;
            }
        };
        standardBasedApplication: {
            oauth2OIDC: {
                protocol: {
                    learnMore: string;
                };
            };
            saml: {
                protocol: {
                    learnMore: string;
                };
            };
        };
    }
    newApplication: {
        oidcApplication: {
            learnMore: string;
        }
        samlApplication: {
            learnMore: string;
        }
        singlePageApplication: {
            learnMore: string;
        }
        mobileApplication: {
            learnMore: string;
        }
    }
    managementApplication: {
        learnMore: string;
        selfServicePortal: string;
    }
    myaccount: {
        learnMore: string;
        smsOtp: string;
    }
    roles: {
        learnMore: string;
    }
}

/**
 * Interface for the attributes section documentation structure.
 */
interface AttributesDocumentationLinksInterface {
    attributes: {
        learnMore: string;
    }
    oidcAttributes: {
        learnMore: string;
    }
    scimAttributes: {
        learnMore: string;
    }
}

/**
 * Interface for the Branding section documentation structure.
 */
interface BrandingDocumentationLinksInterface {
    layout: {
        custom: {
            learnMore: string;
        }
    }
    learnMore: string;
}

/**
 * Interface for the common documentation structure.
 */
interface CommonDocumentationLinksInterface {
    cookiePolicy: string;
    docsHomePage: string;
    privacyPolicy: string;
    termsOfService: string;
}

/**
 * Interface for the connections section documentation structure.
 */
interface ConnectionsDocumentationLinksInterface {
    learnMore: string;
    newConnection: {
        learnMore: string;
        apple: {
            help: {
                configureSignIn: string;
                developerConsole: string;
            };
            learnMore: string;
            setupGuide: string;
        };
        enterprise: {
            oidc: {
                learnMore: string;
                setupGuide: string;
            };
            saml: {
                learnMore: string;
                setupGuide: string;
            };
        };
        facebook: {
            help: {
                configureOAuth: string;
                developerConsole: string;
            };
            learnMore: string;
            setupGuide: string;
        };
        github: {
            help: {
                configureOAuth: string;
                developerConsole: string;
            };
            learnMore: string;
            setupGuide: string;
        };
        google: {
            help: {
                configureOAuth: string;
                developerConsole: string;
            };
            learnMore: string;
            setupGuide: string;
        };
        hypr: {
            help: {
                developerConsole: string;
                token: string;
            };
            learnMore: string;
            setupGuide: string;
        };
        microsoft: {
            help: {
                configureOAuth: string;
                developerConsole: string;
            };
            learnMore: string;
            setupGuide: string;
        };
        siwe: {
            help: {
                configureOIDC: string;
            };
            learnMore: string;
            setupGuide: string;
        };
        trustedTokenIssuer: {
            learnMore: string;
        };
    };
    edit: {
        advancedSettings: {
            jit: string;
        };
        quickStart: {
            fido: {
                learnMore: string;
            };
        };
    }
}

/**
 * Interface for the event publishing documentation structure.
 */
interface EventPublishingDocumentationLinksInterface {
    learnMore: string;
}

/**
 * Interface for the groups section documentation structure.
 */
interface GroupsDocumentationLinksInterface {
    learnMore: string;
    roles: {
        learnMore: string;
    }
}

/**
 * Interface for the private kwy JWT authentication validation documentation structure.
 */
interface PrivateKeyJWTDocumentationLinksInterface {
    learnMore: string;
}

/**
 * Interface for the self registration section documentation structure.
 */
interface SelfRegistrationDocumentationLinksInterface {
    learnMore: string;
}

/**
 * Interface for the organization section documentation structure.
 */
interface OrganizationDocumentationLinksInterface {
    learnMore: string;
}

/**
 * Interface for the users section documentation structure.
 */
interface UsersDocumentationLinksInterface {
    allUsers: {
        learnMore: string;
    }
    collaboratorAccounts: {
        adminSettingsLearnMore: string;
        learnMore: string;
        roles: {
            learnMore: string;
        }
    }
    customerAccounts: {
        learnMore: string;
    }
    newCollaboratorUser: {
        learnMore: string;
    }
}

/**
 * Interface for the user stores section documentation structure.
 */
interface UserStoreDocumentationLinksInterface {
    attributeMappings: {
        learnMore: string;
    }
    createUserStore: {
        learnMore: string;
    }
    userStoresList: {
        learnMore: string;
    }
    highAvailability: {
        learnMore: string;
    }
    userStoreProperties: {
        learnMore: string;
    }
}

/**
 * Interface for the self registration section documentation structure.
 */
interface ValidationDocumentationLinksInterface {
    passwordValidation: {
        learnMore: string;
    }
}

/**
 * Interface for the email customization section documentation structure.
 */
interface EmailCustomizationLinksInterface {
    learnMore: string,
    form: {
        emailBody: {
            learnMore: string
        }
    }
}

/**
 * Interface for the console documentation structure.
 */
export interface DocumentationLinksExtensionInterface {
    /**
     * Documentation links for common elements.
     */
    common: CommonDocumentationLinksInterface;
    /**
     * Documentation links for develop section elements.
     */
    develop: {
        /**
         * Documentation links for API resources section elements.
         */
        apiResources: APIResourcesDocumentationLinksInterface
        /**
         * Documentation links for applications section elements.
         */
        applications: ApplicationsDocumentationLinksInterface;
        /**
         * Documentation links for Branding section elements.
         */
        branding: BrandingDocumentationLinksInterface;
        /**
         * Documentation links for connections section elements.
         */
        connections: ConnectionsDocumentationLinksInterface;

        /**
         * Documentation links for event publishing elements.
         */
        eventPublishing: EventPublishingDocumentationLinksInterface;

        /**
         * Documentation links for email customization UI elements.
         */
        emailCustomization: EmailCustomizationLinksInterface;
    }
    /**
     * Documentation links for manage section elements.
     */
    manage: {
        /**
         * Documentation links for account recovery elements.
         */
        accountRecovery: AccountRecoveryDocumentationLinksInterface;
        /**
         * Documentation links for login security elements.
         */
        loginSecurity: LoginSecurityDocumentationLinksInterface;
        /**
         * Documentation links for attributes section elements.
         */
        attributes: AttributesDocumentationLinksInterface;
        /**
         * Documentation links for groups section elements.
         */
        groups: GroupsDocumentationLinksInterface;
        /**
         * Documentation links for organization section elements.
         */
        organizations: OrganizationDocumentationLinksInterface;
        /**
         * Documentation links for privateKeyJWT elements.
         */
        privateKeyJWT: PrivateKeyJWTDocumentationLinksInterface;
        /**
         * Documentation links for self registration section elements.
         */
        selfRegistration: SelfRegistrationDocumentationLinksInterface;
        /**
         * Documentation links for users section elements.
         */
        users: UsersDocumentationLinksInterface;
        /**
         * Documentation links for user stores section elements.
         */
        userStores: UserStoreDocumentationLinksInterface;
        /**
         * Documentation links for validation elements.
         */
        validation: ValidationDocumentationLinksInterface;
    }
}
