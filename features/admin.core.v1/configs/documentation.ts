/**
 * Copyright (c) 2021-2026, WSO2 LLC. (https://www.wso2.com).
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

import { Config } from "./app";
import { DocumentationLinksInterface } from "../models/documentation";

const documentationBaseUrl: string =
    Config?.getDeploymentConfig()?.docSiteURL ?? "";

/**
 * Get all the Features documentation links.
 *
 * @returns the feature documentation links.
 */
export const DocumentationLinks: DocumentationLinksInterface = {
    common: {
        aiTermsOfService: "https://wso2.com/licenses/wso2-ai-services-terms-of-use/"
    },
    develop: {
        actions: {
            learnMore: documentationBaseUrl + "/guides/service-extensions/understanding-service-extensions/",
            types: {
                preIssueAccessToken: {
                    learnMore: documentationBaseUrl
                        + "/guides/service-extensions/pre-flow-extensions/pre-issue-access-token-action/"
                },
                preRegistration: {
                    learnMore: undefined
                },
                preUpdatePassword: {
                    learnMore: documentationBaseUrl
                        + "/guides/service-extensions/pre-flow-extensions/pre-update-password-action/"
                },
                preUpdateProfile: {
                    learnMore: documentationBaseUrl
                        + "/guides/service-extensions/pre-flow-extensions/pre-update-profile-action/"
                }
            },
            versioning: {
                learnMore: undefined
            }
        },
        apiResources: {
            addAPIResource: {
                rbacInfoBox: {
                    learnMore: documentationBaseUrl + "/references/authorization-policies-for-apps/"
                        + "#role-based-access-control"
                },
                requiredAuthorization: {
                    learnMore: documentationBaseUrl + "/guides/api-authorization/"
                        + "#authorize-the-api-resource-to-an-app"
                }
            },
            learnMore: documentationBaseUrl + "/guides/api-authorization/#register-an-api-resource"
        },
        applications: {
            apiAuthorization: {
                learnMore: documentationBaseUrl + "/guides/api-authorization/#authorize-the-api-resource-to-an-app",
                policies: {
                    noPolicy: {
                        learnMore: documentationBaseUrl + "/references/authorization-policies-for-apps/"
                            + "#no-authorization-policy"
                    },
                    rbac: {
                        learnMore: documentationBaseUrl + "/references/authorization-policies-for-apps/"
                            + "#role-based-access-control"
                    }
                }
            },
            applicationsSettings: {
                dcr: {
                    authenticationRequired: {
                        learnMore: undefined
                    },
                    learnMore: undefined
                }
            },
            editApplication: {
                asgardeoTryitApplication: {
                    general: {
                        learnMore: documentationBaseUrl + "/get-started/try-it-application/"
                    }
                },
                attributeManagement: {
                    manageOIDCScopes: documentationBaseUrl + "/guides/users/attributes/manage-scopes"
                        + "/#how-to-request-scope-to-request-user-attributes"
                },
                common: {
                    advanced: {
                        trustedApps: {
                            learnMore: documentationBaseUrl + "/guides/authentication/app-native-authentication/"
                                + "handle-advanced-login-scenarios"
                        }
                    },
                    signInMethod: {
                        conditionalAuthenticaion: {
                            ai: {
                                learnMore: documentationBaseUrl + "/guides/authentication/conditional-auth"
                                    + "/ai-loginflow/"
                            },
                            apiReference: documentationBaseUrl + "/references/conditional-auth/api-reference/",
                            learnMore: documentationBaseUrl + "/guides/authentication/conditional-auth/",
                            template: {
                                deviceBased: {
                                    learnMore: documentationBaseUrl
                                        + "/guides/authentication/conditional-auth/new-device-based-template/"
                                },
                                groupBased: {
                                    learnMore: documentationBaseUrl
                                        + "/guides/authentication/conditional-auth/group-based-template/"
                                },
                                ipBased: {
                                    learnMore: documentationBaseUrl
                                        + "/guides/authentication/conditional-auth/ip-based-template/"
                                },
                                userAgeBased: {
                                    learnMore: documentationBaseUrl
                                        + "/guides/authentication/conditional-auth/user-age-based-template/"
                                }
                            }
                        },
                        learnMore: undefined
                    }
                },
                oidcApplication: {
                    advanced: {
                        learnMore: undefined
                    },
                    attributes: {
                        learnMore: documentationBaseUrl + "/guides/authentication/user-attributes"
                            + "/enable-attributes-for-oidc-app/"
                    },
                    info: {
                        learnMore: documentationBaseUrl + "/get-started/try-samples/qsg-oidc-webapp-java-ee/"
                    },
                    protocol: {
                        learnMore: documentationBaseUrl + "/references/app-settings/oidc-settings-for-app/"
                    },
                    quickStart: {
                        applicationScopes: {
                            learnMore: documentationBaseUrl + "/guides/authentication/user-attributes/"
                                + "enable-attributes-for-oidc-app/#application-requests-with-scopes"
                        },
                        customConfig: {
                            learnMore: documentationBaseUrl + "/guides/authentication/oidc/implement-auth-code"
                        },
                        mavenDownload: undefined,
                        mobileApp: {
                            learnMore: documentationBaseUrl + "/guides/authentication/add-login-to-mobile-app"
                        }
                    }
                },
                outdatedApplications: {
                    versions: {
                        version100: {
                            removeUsernameFromIntrospectionRespForAppTokens: {
                                documentationLink: documentationBaseUrl + "/guides/authentication/oidc"
                                    + "/token-validation-resource-server/#application-access-token-response"
                            },
                            useClientIdAsSubClaimOfAppTokens: {
                                documentationLink: documentationBaseUrl + "/guides/authentication/user-attributes"
                                    + "/enable-attributes-for-oidc-app/#select-an-alternate-subject-attribute"
                            }
                        },
                        version200: {
                            addAllRequestedClaimsInJWTAccessToken: {
                                documentationLink: documentationBaseUrl + "/references/app-settings/"
                                    + "oidc-settings-for-app/#access-token-attributes"
                            }
                        },
                        version300: {
                            linkedLocalAccountAttributeHandling: {
                                documentationLink: undefined
                            }
                        }
                    }
                },
                samlApplication: {
                    advanced: {
                        learnMore: undefined
                    },
                    attributes: {
                        learnMore: documentationBaseUrl + "/guides/authentication/user-attributes"
                            + "/enable-attributes-for-saml-app/"
                    },
                    info: {
                        learnMore: documentationBaseUrl + "/guides/authentication/saml/"
                    },
                    protocol: {
                        learnMore: documentationBaseUrl + "/references/app-settings/saml-settings-for-app/"
                    },
                    quickStart: {
                        customConfig: {
                            learnMore: documentationBaseUrl + "/guides/authentication/saml/discover-saml-configs/"
                        },
                        mavenDownload: undefined
                    }
                },
                signInMethod: {
                    fido: documentationBaseUrl + "/guides/authentication/passwordless-login/",
                    totp: documentationBaseUrl
                        + "/guides/authentication/mfa/add-totp-login/#disable-enrolling-in-totp-during-first-login"
                },
                singlePageApplication: {
                    info: {
                        learnMore: documentationBaseUrl
                            + "/guides/authentication/oidc/implement-auth-code-with-pkce/"
                    },
                    quickStart: {
                        customConfig: {
                            learnMore: documentationBaseUrl
                                + "/guides/authentication/oidc/implement-auth-code-with-pkce/"
                        },
                        nodejsDownload: undefined
                    }
                },
                standardBasedApplication: {
                    oauth2OIDC: {
                        protocol: {
                            learnMore: documentationBaseUrl + "/guides/authentication/oidc/"
                        }
                    },
                    saml: {
                        protocol: {
                            learnMore: documentationBaseUrl + "/guides/authentication/saml/"
                        }
                    }
                }
            },
            learnMore: documentationBaseUrl + "/guides/applications/",
            managementApplication: {
                learnMore: documentationBaseUrl + "/apis/authentication/",
                selfServicePortal: documentationBaseUrl + "/guides/user-self-service/customer-self-service-portal/"
            },
            myaccount: {
                learnMore: documentationBaseUrl + "/guides/user-self-service/customer-self-service-portal/",
                overview: {
                    learnMore: documentationBaseUrl + "/guides/user-self-service/"
                },
                smsOtp: documentationBaseUrl + "/guides/authentication/mfa/add-smsotp-login"
            },
            newApplication: {
                customApplication: {
                    learnMore: documentationBaseUrl + "/guides/applications/register-standard-based-app/"
                },
                m2mApplication: {
                    learnMore: documentationBaseUrl + "/guides/applications/register-machine-to-machine-app/"
                },
                mobileApplication: {
                    learnMore: documentationBaseUrl + "/guides/applications/register-mobile-app/"
                },
                oidcApplication: {
                    learnMore: documentationBaseUrl + "/guides/applications/register-oidc-web-app/"
                },
                samlApplication: {
                    learnMore: documentationBaseUrl + "/guides/applications/register-saml-web-app/"
                },
                singlePageApplication: {
                    learnMore: documentationBaseUrl + "/guides/applications/register-single-page-app/"
                }
            },
            roles: {
                learnMore: documentationBaseUrl + "/guides/users/manage-roles/"
            },
            template: {
                categories: {
                    default: {
                        learnMore: undefined
                    },
                    ssoIntegration: {
                        learnMore: undefined
                    },
                    technology: {
                        learnMore: undefined
                    }
                }
            }
        },
        branding: {
            ai: {
                learnMore: documentationBaseUrl + "/guides/branding/ai-branding/"
            },
            layout: {
                custom: {
                    editor: {
                        learnMore: documentationBaseUrl + "/guides/branding/customize-layouts-with-editor/"
                    },
                    learnMore: documentationBaseUrl + "/guides/branding/configure-ui-branding/#design-preferences"
                }
            },
            learnMore: documentationBaseUrl + "/guides/branding/"
        },
        connections: {
            edit: {
                advancedSettings: {
                    jit: documentationBaseUrl + "/guides/authentication/jit-user-provisioning"
                },
                quickStart: {
                    fido: {
                        learnMore: documentationBaseUrl
                            + "/guides/authentication/passwordless-login/add-passwordless-login-with-fido/"
                    }
                }
            },
            learnMore: documentationBaseUrl + "/guides/authentication/#manage-connections",
            newConnection: {
                apple: {
                    help: {
                        configureSignIn: undefined,
                        developerConsole: undefined
                    },
                    learnMore: documentationBaseUrl + "/guides/authentication/social-login/add-apple-login/",
                    setupGuide: undefined
                },
                duo: {
                    learnMore: documentationBaseUrl + "/guides/authentication/mfa/add-duo-login/"
                },
                enterprise: {
                    oidc: {
                        learnMore: documentationBaseUrl
                            + "/guides/authentication/enterprise-login/add-oidc-idp-login/",
                        setupGuide: undefined
                    },
                    saml: {
                        learnMore: documentationBaseUrl
                            + "/guides/authentication/enterprise-login/add-saml-idp-login/",
                        setupGuide: undefined
                    }
                },
                facebook: {
                    help: {
                        configureOAuth: undefined,
                        developerConsole: undefined
                    },
                    learnMore: documentationBaseUrl + "/guides/authentication/social-login/add-facebook-login/",
                    setupGuide: undefined
                },
                github: {
                    help: {
                        configureOAuth: undefined,
                        developerConsole: undefined
                    },
                    learnMore: documentationBaseUrl + "/guides/authentication/social-login/add-github-login/",
                    setupGuide: undefined
                },
                google: {
                    help: {
                        configureOAuth: undefined,
                        developerConsole: undefined
                    },
                    learnMore: documentationBaseUrl + "/guides/authentication/social-login/add-google-login/",
                    setupGuide: undefined
                },
                hypr: {
                    help: {
                        developerConsole: undefined,
                        token: undefined
                    },
                    learnMore: documentationBaseUrl + "/guides/authentication/passwordless-login/"
                        + "add-passwordless-login-with-hypr/",
                    setupGuide: undefined
                },
                iProov: {
                    learnMore: documentationBaseUrl + "/guides/authentication/mfa/add-iproov-login/"
                },
                learnMore: documentationBaseUrl + "/guides/authentication/#manage-connections",
                microsoft: {
                    help: {
                        configureOAuth: undefined,
                        developerConsole: undefined
                    },
                    learnMore: documentationBaseUrl + "/guides/authentication/social-login/add-microsoft-login/",
                    setupGuide: undefined
                },
                siwe: {
                    help: {
                        configureOIDC: undefined
                    },
                    learnMore: documentationBaseUrl
                        + "/guides/authentication/decentralized-login/sign-in-with-ethereum/",
                    setupGuide: undefined
                },
                "sms-otp-authenticator": {
                    learnMore: documentationBaseUrl + "/guides/authentication/mfa/add-smsotp-login/"
                },
                trustedTokenIssuer: {
                    learnMore: documentationBaseUrl + "/guides/authentication/configure-a-trusted-token-issuer/"
                }
            }
        },
        emailCustomization: {
            form: {
                emailBody: {
                    learnMore: documentationBaseUrl + "/references/email-templates/#general-literals"
                }
            },
            learnMore: documentationBaseUrl + "/references/email-templates/"
        },
        eventPublishing: {
            learnMore: documentationBaseUrl + "/guides/asgardeo-events/"
        },
        multiTenancy: {
            addTenant: {
                learnMore: undefined
            },
            learnMore: undefined,
            systemSettings: {
                learnMore: undefined
            }
        },
        smsCustomization: {
            form: {
                smsBody: {
                    learnMore: undefined
                }
            },
            learnMore: undefined
        },
        webhooks: {
            learnMore: documentationBaseUrl + "/guides/webhooks/understanding-webhooks/"
        }
    },
    manage: {
        accountDisable: {
            learnMore: documentationBaseUrl + "/guides/account-configurations/account-disabling/"
        },
        accountRecovery: {
            passwordRecovery: {
                learnMore: documentationBaseUrl + "/guides/user-accounts/password-recovery/"
            }
        },
        administrators: {
            learnMore: documentationBaseUrl + "/guides/users/manage-administrators/"
        },
        attributes: {
            attributes: {
                learnMore: documentationBaseUrl + "/guides/users/attributes/manage-attributes/"
            },
            oidcAttributes: {
                learnMore: documentationBaseUrl + "/guides/users/attributes/manage-oidc-attribute-mappings/"
            },
            scimAttributes: {
                learnMore: documentationBaseUrl + "/guides/users/attributes/manage-scim2-attribute-mappings/"
            }
        },
        groups: {
            learnMore: documentationBaseUrl + "/guides/users/manage-groups/",
            roles: {
                learnMore: documentationBaseUrl + "/guides/users/manage-groups/#assign-roles-to-groups"
            }
        },
        insights: {
            learnMore: documentationBaseUrl + "/guides/organization-insights/"
        },
        loginSecurity: {
            botDetection: {
                learnMore: documentationBaseUrl + "/guides/user-accounts/account-security/bot-detection/"
            },
            loginAttempts: {
                learnMore: documentationBaseUrl
                    + "/guides/user-accounts/account-security/login-attempts-security/"
            },
            siftConnector: {
                learnMore: documentationBaseUrl + "/guides/account-configurations/login-security/"
                    + "sift-fraud-detection/"
            }
        },
        logs: {
            learnMore: documentationBaseUrl + "/guides/asgardeo-logs/"
        },
        organizations: {
            learnMore: documentationBaseUrl + "/guides/organization-management/"
        },
        privateKeyJWT: {
            learnMore: documentationBaseUrl + "/guides/authentication/oidc/private-key-jwt-client-auth"
        },
        selfRegistration: {
            learnMore: documentationBaseUrl + "/guides/user-self-service/self-register/"
        },
        userStores: {
            attributeMappings: {
                learnMore: documentationBaseUrl + "/guides/users/attributes/"
            },
            createUserStore: {
                learnMore: documentationBaseUrl + "/guides/users/user-stores/configure-a-user-store/"
            },
            highAvailability: {
                learnMore: documentationBaseUrl + "/guides/users/user-stores/configure-high-availability/"
            },
            userStoreProperties: {
                learnMore: documentationBaseUrl + "/guides/users/user-stores/configure-a-user-store/"
                    + "#set-up-the-remote-user-store/"
            },
            userStoresList: {
                learnMore: documentationBaseUrl + "/guides/users/user-stores/"
            }
        },
        users: {
            allUsers: {
                learnMore: documentationBaseUrl + "/guides/users/"
            },
            bulkUsers: {
                learnMore: documentationBaseUrl + "/guides/users/manage-users/#onboard-multiple-user"
            },
            collaboratorAccounts: {
                adminSettingsLearnMore: documentationBaseUrl
                    + "/guides/users/manage-collaborators/#assign-admin-privileges-to-users",
                learnMore: documentationBaseUrl + "/guides/users/manage-collaborators/",
                roles: {
                    learnMore: documentationBaseUrl + "/references/user-management/user-roles/"
                }
            },
            customerAccounts: {
                learnMore: documentationBaseUrl + "/guides/users/manage-customers/"
            },
            learnMore: documentationBaseUrl + "/guides/users/manage-users/",
            newCollaboratorUser: {
                learnMore: documentationBaseUrl + "/references/user-management/user-roles/"
            }
        },
        validation: {
            passwordValidation: {
                learnMore: documentationBaseUrl
                    + "/guides/account-configurations/login-security/password-validation/"
            }
        }
    }
};
