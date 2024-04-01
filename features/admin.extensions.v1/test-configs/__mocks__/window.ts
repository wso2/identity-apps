/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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
 * @remarks Window Mocks.
 *
 * @remarks Document and place all the extended Window mocks in this file.
 */

/**
 * Custom window interface.
 */
interface CustomExtendedWindow extends Window {
    AppUtils: {
        getConfig: () => any;
    };
}

/**
 * `AppUtils` Mock.
 * @remarks Overrides the default `window.AppUtils.getConfig()` result.
 * IMPORTANT: Constantly keep this updated by executing `window.AppUtils.getConfig()` on the browser.
 */
(window as CustomExtendedWindow & typeof globalThis).AppUtils = {
    /* eslint-disable sort-keys, max-len */
    getConfig: () => {
        return {
            accountApp: {
                commonPostLogoutUrl: true,
                path: "https://localhost:9000/myaccount/overview",
                tenantQualifiedPath: "https://localhost:9000/t/brionmario"
            },
            adminApp: {
                basePath: "/t/brionmario/manage",
                displayName: "Manage",
                path: "/t/brionmario/manage/users"
            },
            allowMultipleAppProtocols: false,
            appBase: "",
            appBaseNameForHistoryAPI: "/",
            appBaseWithTenant: "/t/brionmario",
            clientID: "CONSOLE",
            clientOrigin: "https://dev.console.asgardeo.io",
            clientOriginWithTenant: "https://dev.console.asgardeo.io/t/brionmario",
            debug: false,
            developerApp: {
                basePath: "/t/brionmario/develop",
                displayName: "Develop",
                path: "/t/brionmario/develop/applications"
            },
            docSiteUrl: "https://dev.docs.asgardeo.io/",
            documentation: {
                baseURL: "https://api.github.com",
                contentBaseURL: "https://api.github.com/repos/wso2/docs-is/contents/en/docs",
                githubOptions: {
                    branch: "new_restructure"
                },
                imagePrefixURL: "https://github.com/wso2/docs-is/raw/new_restructure/en/docs/",
                provider: "GITHUB",
                structureFileType: "YAML",
                structureFileURL: "https://api.github.com/repos/wso2/docs-is/contents/en/mkdocs.yml"
            },
            extensions: {
                applicationInsightsEnabled: false,
                applicationInsightsCookieDomain: "",
                applicationInsightsCookiePostfix: "",
                applicationInsightsInstrumentationKey: "",
                applicationInsightsProxyEndpoint: "",
                collaboratorUsernameRegex: "^[\\u00C0-\\u00FFa-zA-Z0-9.+\\-_]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,10}$",
                community: "https://wso2iem-en-community.insided.com/ssoproxy/login?ssoType=openidconnect&returnUrl=https://wso2iem-en-community.insided.com/asgardeo-1",
                feedbackEndPoint: "https://dev.portal.asgardeo.io/api/cloud/v1/feedback/",
                helpCenterUrl: "https://dev.support.asgardeo.io/asp?id=asgardeo_support_login",
                defaultBrandedLoginScreenCopyright: "${copyright} ${year} WSO2, Inc.",
                supportEmail: "asgardeo-help@wso2.com"
            },
            idpConfigs: {
                serverOrigin: "https://dev.api.asgardeo.io",
                enablePKCE: true,
                clockTolerance: 300,
                responseMode: "query",
                scope: [
                    "SYSTEM"
                ],
                storage: "webWorker",
                authorizeEndpointURL: "https://dev.api.asgardeo.io/t/a/oauth2/authorize?ut=brionmario",
                logoutEndpointURL: "https://dev.api.asgardeo.io/t/a/oidc/logout",
                oidcSessionIFrameEndpointURL: "https://dev.api.asgardeo.io/t/a/oidc/checksession"
            },
            isSaas: true,
            loginCallbackURL: "https://dev.console.asgardeo.io/login",
            logoutCallbackURL: "https://dev.console.asgardeo.io",
            productVersionConfig: {
                productVersion: "BETA"
            },
            routes: {
                home: "/t/brionmario/getting-started",
                login: "/t/brionmario/login",
                logout: "/t/brionmario/logout"
            },
            serverOrigin: "https://dev.api.asgardeo.io",
            serverOriginWithTenant: "https://dev.api.asgardeo.io/t/brionmario",
            session: {
                sessionRefreshTimeOut: 300,
                userIdleWarningTimeOut: 1740,
                checkSessionInterval: 5,
                userIdleTimeOut: 1800
            },
            superTenant: "carbon.super",
            tenant: "brionmario",
            tenantPath: "/t/brionmario",
            tenantPrefix: "t",
            ui: {
                appCopyright: "${copyright} ${year} WSO2, Inc.",
                appTitle: "Asgardeo Console",
                appName: "Console",
                applicationTemplateLoadingStrategy: "LOCAL",
                identityProviderTemplateLoadingStrategy: "LOCAL",
                appLogoPath: "/assets/images/branding/logo.svg",
                showAppSwitchButton: true,
                features: {
                    accountSecurity: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            create: [],
                            read: [
                                "internal_governance_view"
                            ],
                            update: [
                                "internal_governance_update"
                            ],
                            delete: []
                        }
                    },
                    accountRecovery: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            create: [],
                            read: [
                                "internal_governance_view"
                            ],
                            update: [
                                "internal_governance_update"
                            ],
                            delete: []
                        }
                    },
                    applications: {
                        disabledFeatures: [],
                        enabled: true,
                        scopes: {
                            feature: [
                                "console:applications"
                            ],
                            create: [
                                "internal_application_mgt_create"
                            ],
                            read: [
                                "internal_cors_origins_view",
                                "internal_application_mgt_view",
                                "internal_claim_meta_view",
                                "internal_idp_view"
                            ],
                            update: [
                                "internal_application_mgt_update"
                            ],
                            delete: [
                                "internal_application_mgt_delete"
                            ]
                        }
                    },
                    approvals: {
                        disabledFeatures: [],
                        enabled: false,
                        scopes: {
                            create: [
                                "internal_humantask_view"
                            ],
                            read: [
                                "internal_humantask_view"
                            ],
                            update: [
                                "internal_humantask_view"
                            ],
                            delete: [
                                "internal_humantask_view"
                            ]
                        }
                    },
                    attributeDialects: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            feature: [
                                "console:attributes"
                            ],
                            create: [
                                "internal_claim_meta_create"
                            ],
                            read: [
                                "internal_userstore_view",
                                "internal_claim_meta_view"
                            ],
                            update: [
                                "internal_claim_meta_update"
                            ],
                            delete: [
                                "internal_claim_meta_delete"
                            ]
                        }
                    },
                    branding: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            create: [
                                "internal_application_mgt_update"
                            ],
                            delete: [
                                "internal_application_mgt_update"
                            ],
                            read: [
                                "internal_application_mgt_view"
                            ],
                            update: [
                                "internal_application_mgt_update"
                            ]
                        }
                    },
                    certificates: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            create: [
                                "internal_keystore_update"
                            ],
                            read: [
                                "internal_keystore_view"
                            ],
                            update: [
                                "internal_keystore_update"
                            ],
                            delete: [
                                "internal_keystore_update"
                            ]
                        }
                    },
                    developerGettingStarted: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            create: [],
                            read: [
                                "internal_application_mgt_create",
                                "internal_idp_create",
                                "internal_application_mgt_update"
                            ],
                            update: [],
                            delete: []
                        }
                    },
                    emailTemplates: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            create: [
                                "internal_email_mgt_create"
                            ],
                            read: [
                                "internal_email_mgt_view"
                            ],
                            update: [
                                "internal_email_mgt_update"
                            ],
                            delete: [
                                "internal_email_mgt_delete"
                            ]
                        }
                    },
                    governanceConnectors: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            create: [],
                            read: [
                                "internal_governance_view"
                            ],
                            update: [
                                "internal_governance_update"
                            ],
                            delete: []
                        }
                    },
                    groups: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            feature: [
                                "console:groups"
                            ],
                            create: [
                                "internal_group_mgt_create"
                            ],
                            read: [
                                "internal_user_mgt_view",
                                "internal_role_mgt_view",
                                "internal_group_mgt_view",
                                "internal_userstore_view"
                            ],
                            update: [
                                "internal_group_mgt_update"
                            ],
                            delete: [
                                "internal_group_mgt_delete"
                            ]
                        }
                    },
                    identityProviders: {
                        disabledFeatures: [],
                        enabled: true,
                        scopes: {
                            feature: [
                                "console:idps"
                            ],
                            create: [
                                "internal_idp_create"
                            ],
                            read: [
                                "internal_userstore_view",
                                "internal_idp_view",
                                "internal_role_mgt_view",
                                "internal_claim_meta_view"
                            ],
                            update: [
                                "internal_idp_update"
                            ],
                            delete: [
                                "internal_idp_delete"
                            ]
                        }
                    },
                    manageGettingStarted: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            create: [],
                            read: [
                                "internal_user_mgt_create",
                                "internal_group_mgt_create"
                            ],
                            update: [],
                            delete: []
                        }
                    },
                    oidcScopes: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            feature: [
                                "console:scopes:oidc"
                            ],
                            create: [
                                "internal_oidc_scope_mgt_create"
                            ],
                            read: [
                                "internal_oidc_scope_mgt_view",
                                "internal_claim_meta_view"
                            ],
                            update: [
                                "internal_oidc_scope_mgt_update"
                            ],
                            delete: [
                                "internal_oidc_scope_mgt_delete"
                            ]
                        }
                    },
                    secretsManagement: {
                        enabled: false,
                        disabledFeatures: [],
                        scopes: {
                            create: [
                                "internal_secret_mgt_add"
                            ],
                            read: [
                                "internal_secret_mgt_view"
                            ],
                            update: [
                                "internal_secret_mgt_update"
                            ],
                            delete: [
                                "internal_secret_mgt_delete"
                            ]
                        }
                    },
                    remoteFetchConfig: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            create: [
                                "internal_identity_mgt_view",
                                "internal_identity_mgt_update",
                                "internal_identity_mgt_create",
                                "internal_identity_mgt_delete"
                            ],
                            read: [
                                "internal_identity_mgt_view",
                                "internal_identity_mgt_update",
                                "internal_identity_mgt_create",
                                "internal_identity_mgt_delete"
                            ],
                            update: [
                                "internal_identity_mgt_view",
                                "internal_identity_mgt_update",
                                "internal_identity_mgt_create",
                                "internal_identity_mgt_delete"
                            ],
                            delete: [
                                "internal_identity_mgt_view",
                                "internal_identity_mgt_update",
                                "internal_identity_mgt_create",
                                "internal_identity_mgt_delete"
                            ]
                        }
                    },
                    roles: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            feature: [
                                "console:roles"
                            ],
                            create: [
                                "internal_role_mgt_create"
                            ],
                            read: [
                                "internal_user_mgt_view",
                                "internal_role_mgt_view",
                                "internal_userstore_view",
                                "internal_group_mgt_view"
                            ],
                            update: [
                                "internal_role_mgt_update"
                            ],
                            delete: [
                                "internal_role_mgt_delete"
                            ]
                        }
                    },
                    userOnboarding: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            create: [],
                            read: [
                                "internal_governance_view"
                            ],
                            update: [
                                "internal_governance_update"
                            ],
                            delete: []
                        }
                    },
                    userStores: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            create: [
                                "internal_userstore_create"
                            ],
                            read: [
                                "internal_userstore_view"
                            ],
                            update: [
                                "internal_userstore_update"
                            ],
                            delete: [
                                "internal_userstore_delete"
                            ]
                        }
                    },
                    users: {
                        enabled: true,
                        disabledFeatures: [],
                        scopes: {
                            feature: [
                                "console:users"
                            ],
                            create: [
                                "internal_user_mgt_create"
                            ],
                            read: [
                                "internal_userstore_view",
                                "internal_role_mgt_view",
                                "internal_group_mgt_view",
                                "internal_governance_view",
                                "internal_login",
                                "internal_user_mgt_view",
                                "internal_user_mgt_list",
                                "internal_session_view"
                            ],
                            update: [
                                "internal_user_mgt_update",
                                "internal_session_delete"
                            ],
                            delete: [
                                "internal_user_mgt_delete"
                            ]
                        }
                    }
                },
                gravatarConfig: {
                    fallback: "404"
                },
                hiddenAuthenticators: [
                    "FIDOAuthenticator",
                    "IdentifierExecutor"
                ],
                hiddenConnectionTemplates: [],
                i18nConfigs: {
                    showLanguageSwitcher: false,
                    langAutoDetectEnabled: false
                },
                identityProviderTemplates: {
                    enterpriseOIDC: {
                        enabled: true
                    },
                    enterpriseSAML: {
                        enabled: true
                    },
                    facebook: {
                        enabled: true
                    },
                    google: {
                        enabled: true
                    },
                    github: {
                        enabled: true
                    },
                    microsoft: {
                        enabled: true
                    }
                },
                isCookieConsentBannerEnabled: true,
                isGroupAndRoleSeparationEnabled: true,
                isSignatureValidationCertificateAliasEnabled: false,
                isCustomClaimMappingEnabled: true,
                isCustomClaimMappingMergeEnabled: true,
                isClientSecretHashEnabled: false,
                isDefaultDialectEditingEnabled: false,
                isDialectAddingEnabled: false,
                isHeaderAvatarLabelAllowed: false,
                isLeftNavigationCategorized: false,
                isRequestPathAuthenticationEnabled: false,
                listAllAttributeDialects: false,
                privacyPolicyConfigs: {
                    visibleOnFooter: false
                },
                productName: "Asgardeo",
                productVersionConfig: {
                    productVersion: "BETA"
                },
                selfAppIdentifier: "Console",
                systemAppsIdentifiers: [
                    "Console",
                    "My Account"
                ],
                theme: {
                    name: "asgardio"
                }
            }
        };
    }
    /* eslint-disable sort-keys, max-len */
};
