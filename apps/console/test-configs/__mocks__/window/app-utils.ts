/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
 *
 * @remarks Document and place all the AppUtils mocks in this file.
 */

interface CustomWindow extends Window {
    AppUtils: { 
        getConfig: () => any;
    };
}

/**
 * `AppUtils` Mock.
 * @remarks The deployment.config.json file is resolved and stored in the window object under AppUtils.
 * This has a method called `getConfig` that needs mocking.
 * IMPORTANT: Constantly keep this updated by executing `window.AppUtils.getConfig()` on the browser.
 */
(window as CustomWindow & typeof globalThis).AppUtils = {
    /* eslint-disable sort-keys, max-len */
    getConfig: function () {
        return {
            accountApp: {
                commonPostLogoutUrl: false,
                path: "https://localhost:9000/myaccount/overview",
                tenantQualifiedPath: ""
            },
            adminApp: {
                basePath: "/console/manage",
                displayName: "Manage",
                path: "/console/manage/users"
            },
            allowMultipleAppProtocols: false,
            appBase: "console",
            appBaseNameForHistoryAPI: "/",
            appBaseWithTenant: "/console",
            clientID: "CONSOLE",
            clientOrigin: "https://localhost:9001",
            clientOriginWithTenant: "https://localhost:9001",
            debug: false,
            developerApp: {
                basePath: "/console/develop",
                displayName: "Develop",
                path: "/console/develop/applications"
            },
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
            idpConfigs: {
                serverOrigin: "https://localhost:9443",
                enablePKCE: true,
                clockTolerance: 300,
                responseMode: "query",
                scope: [
                    "SYSTEM"
                ],
                storage: "webWorker"
            },
            isSaas: true,
            loginCallbackURL: "https://localhost:9001/console",
            logoutCallbackURL: "https://localhost:9001/console",
            productVersionConfig: {
                allowSnapshot: true,
                textCase: "uppercase",
                labelColor: "primary"
            },
            routes: {
                home: "/console/develop/applications",
                login: "/console",
                logout: "/console/logout"
            },
            serverOrigin: "https://localhost:9443",
            serverOriginWithTenant: "https://localhost:9443",
            session: {
                userIdleTimeOut: 600,
                userIdleWarningTimeOut: 580,
                sessionRefreshTimeOut: 300,
                checkSessionInterval: 3
            },
            superTenant: "carbon.super",
            tenant: "carbon.super",
            tenantPath: "",
            tenantPrefix: "t",
            ui: {
                appCopyright: "WSO2 Identity Server ${copyright} ${year}",
                appTitle: "Console | WSO2 Identity Server",
                appName: "Console",
                applicationTemplateLoadingStrategy: "LOCAL",
                identityProviderTemplateLoadingStrategy: "LOCAL",
                appLogoPath: "/assets/images/branding/logo.svg",
                features: {
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
                                "internal_role_mgt_view",
                                "internal_userstore_view",
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
                        enabled: true,
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
                        enabled: true,
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
                hiddenUserStores: [],
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
                        enabled: false
                    },
                    microsoft: {
                        enabled: true
                    }
                },
                gravatarConfig: {
                    fallback: "404"
                },
                hiddenAuthenticators: [],
                i18nConfigs: {
                    showLanguageSwitcher: false,
                    langAutoDetectEnabled: false
                },
                isCookieConsentBannerEnabled: false,
                isGroupAndRoleSeparationEnabled: true,
                isSignatureValidationCertificateAliasEnabled: false,
                isClientSecretHashEnabled: false,
                isDefaultDialectEditingEnabled: false,
                isDialectAddingEnabled: true,
                isLeftNavigationCategorized: true,
                isRequestPathAuthenticationEnabled: true,
                listAllAttributeDialects: false,
                privacyPolicyConfigs: {
                    visibleOnFooter: true
                },
                productName: "WSO2 Identity Server",
                productVersionConfig: {
                    allowSnapshot: true,
                    textCase: "uppercase",
                    labelColor: "primary"
                },
                selfAppIdentifier: "Console",
                systemAppsIdentifiers: [
                    "Console",
                    "My Account"
                ],
                theme: {
                    name: "default"
                }
            }
        };
    }
    /* eslint-disable sort-keys, max-len */
};
