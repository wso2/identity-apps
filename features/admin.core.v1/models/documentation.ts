/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

interface AccountRecoveryDocumentationLinksInterface {
    passwordRecovery: {
        learnMore: string;
    }
}

interface AdministratorsDocumentationLinksInterface {
    learnMore: string;
}

interface LoginSecurityDocumentationLinksInterface {
    botDetection: {
        learnMore: string;
    },
    loginAttempts: {
        learnMore: string;
    },
    siftConnector: {
        learnMore: string;
    },
}

interface ActionsDocumentationLinksInterface {
    learnMore: string;
    types: {
        preIssueAccessToken: {
            learnMore: string;
        }
        preRegistration: {
            learnMore: string;
        }
        preUpdatePassword: {
            learnMore: string;
        }
        preUpdateProfile: {
            learnMore: string;
        }
    };
    versioning: {
        learnMore: string;
    };
}

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
            advanced: {
                trustedApps: {
                    learnMore: string
                }
            },
            signInMethod: {
                learnMore: string;
                conditionalAuthenticaion: {
                    ai: {
                        learnMore: string;
                    }
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
        outdatedApplications: {
            versions: {
                version100: {
                    removeUsernameFromIntrospectionRespForAppTokens: {
                        documentationLink: string;
                    },
                    useClientIdAsSubClaimOfAppTokens: {
                        documentationLink: string;
                    }
                },
                version200: {
                    addAllRequestedClaimsInJWTAccessToken: {
                        documentationLink: string;
                    }
                },
                version300: {
                    linkedLocalAccountAttributeHandling: {
                        documentationLink: string;
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
            totp: string;
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
        },
        m2mApplication: {
            learnMore: string
        },
        customApplication: {
            learnMore: string
        }
    }
    managementApplication: {
        learnMore: string;
        selfServicePortal: string;
    }
    myaccount: {
        learnMore: string;
        smsOtp: string;
        overview: {
            learnMore: string;
        }
    }
    roles: {
        learnMore: string;
    }
    template: {
        categories: {
            default: {
                learnMore: string;
            }
            technology: {
                learnMore: string;
            }
            ssoIntegration: {
                learnMore: string;
            }
        }
    }
}

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

interface BrandingDocumentationLinksInterface {
    ai: {
        learnMore: string;
    }
    layout: {
        custom: {
            editor: {
                learnMore: string;
            }
            learnMore: string;
        }
    }
    learnMore: string;
}

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
        duo: {
            learnMore: string;
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
        iProov: {
            learnMore: string;
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
        "sms-otp-authenticator": {
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

interface EventPublishingDocumentationLinksInterface {
    learnMore: string;
}

interface GroupsDocumentationLinksInterface {
    learnMore: string;
    roles: {
        learnMore: string;
    }
}

interface PrivateKeyJWTDocumentationLinksInterface {
    learnMore: string;
}

interface SelfRegistrationDocumentationLinksInterface {
    learnMore: string;
}

interface OrganizationDocumentationLinksInterface {
    learnMore: string;
}

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
    learnMore: string;
    newCollaboratorUser: {
        learnMore: string;
    }
    bulkUsers: {
        learnMore: string;
    }
}

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

interface ValidationDocumentationLinksInterface {
    passwordValidation: {
        learnMore: string;
    }
}

interface EmailCustomizationLinksInterface {
    learnMore: string,
    form: {
        emailBody: {
            learnMore: string
        }
    }
}

interface SmsCustomizationLinksInterface {
    learnMore: string,
    form: {
        smsBody: {
            learnMore: string
        }
    }
}

interface InsightsDocumentationLinksInterface {
    learnMore: string;
}

interface LogsDocumentationLinksInterface {
    learnMore: string;
}

interface MultiTenancyDocumentationLinksInterface {
    addTenant: {
        learnMore: string;
    };
    learnMore: string;
    systemSettings: {
        learnMore: string;
    };
}

interface AccountDisableDocumentationLinksInterface {
    learnMore: string;
}

interface WebhooksDocumentationLinksInterface {
    learnMore: string;
}

interface CommonDocumentationLinksInterface {
    aiTermsOfService: string;
}

export interface DocumentationLinksInterface {
    common: CommonDocumentationLinksInterface;
    develop: {
        actions: ActionsDocumentationLinksInterface;
        apiResources: APIResourcesDocumentationLinksInterface
        applications: ApplicationsDocumentationLinksInterface;
        branding: BrandingDocumentationLinksInterface;
        connections: ConnectionsDocumentationLinksInterface;
        eventPublishing: EventPublishingDocumentationLinksInterface;
        emailCustomization: EmailCustomizationLinksInterface;
        multiTenancy: MultiTenancyDocumentationLinksInterface;
        smsCustomization: SmsCustomizationLinksInterface;
        webhooks: WebhooksDocumentationLinksInterface;
    }
    manage: {
        accountDisable: AccountDisableDocumentationLinksInterface;
        accountRecovery: AccountRecoveryDocumentationLinksInterface;
        administrators: AdministratorsDocumentationLinksInterface;
        loginSecurity: LoginSecurityDocumentationLinksInterface;
        attributes: AttributesDocumentationLinksInterface;
        groups: GroupsDocumentationLinksInterface;
        insights: InsightsDocumentationLinksInterface;
        logs: LogsDocumentationLinksInterface;
        organizations: OrganizationDocumentationLinksInterface;
        privateKeyJWT: PrivateKeyJWTDocumentationLinksInterface;
        selfRegistration: SelfRegistrationDocumentationLinksInterface;
        users: UsersDocumentationLinksInterface;
        userStores: UserStoreDocumentationLinksInterface;
        validation: ValidationDocumentationLinksInterface;
    }
}
