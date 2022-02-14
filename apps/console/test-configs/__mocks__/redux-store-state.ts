/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * @fileoverview Mocks the Redux store state.
 *
 * @remarks If you add new attributes to the reducers, you will need to add them to this file.
 */

/* eslint-disable */

const ReduxStoreStateMock = {
    accessControl: {
        isDevelopAllowed: true,
        isManageAllowed: true
    },
    application: {
        meta: {
            customInboundProtocolChecked: false,
            customInboundProtocols: [],
            inboundProtocols: [],
            protocolMeta: {}
        }
    },
    auth: {
        displayName: "admin@carbon.super",
        display_name: "admin@carbon.super",
        email: "admin@wso2.com",
        initialized: true,
        isAuthenticated: true,
        loginInit: true,
        logoutInit: false,
        scope: "internal_add_attachements internal_add_bpel internal_add_extensions internal_add_module internal_add_services internal_add_webapp internal_app_template_create internal_app_template_delete internal_app_template_update internal_app_template_view internal_application_mgt_create internal_application_mgt_delete internal_application_mgt_update internal_application_mgt_view internal_auth_seq_create internal_auth_seq_delete internal_auth_seq_update internal_auth_seq_view internal_bpel_instances internal_bpel_packages internal_bpel_proceses internal_challenge_questions_create internal_challenge_questions_delete internal_challenge_questions_update internal_challenge_questions_view internal_claim_manage_create internal_claim_manage_delete internal_claim_manage_update internal_claim_manage_view internal_claim_meta_create internal_claim_meta_delete internal_claim_meta_update internal_claim_meta_view internal_config_mgt_add internal_config_mgt_delete internal_config_mgt_list internal_config_mgt_update internal_config_mgt_view internal_configure_datasources internal_configure_themes internal_consent_mgt_add internal_consent_mgt_delete internal_consent_mgt_list internal_consent_mgt_view internal_cors_origins_view internal_email_mgt_create internal_email_mgt_delete internal_email_mgt_update internal_email_mgt_view internal_event_publish internal_feature_management internal_functional_lib_create internal_functional_lib_delete internal_functional_lib_update internal_functional_lib_view internal_humantask_add internal_humantask_packages internal_humantask_task internal_humantask_view internal_identity_mgt_create internal_identity_mgt_delete internal_identity_mgt_update internal_identity_mgt_view internal_idp_create internal_idp_delete internal_idp_update internal_idp_view internal_keystore_create internal_keystore_delete internal_keystore_update internal_keystore_view internal_list_extensions internal_list_tenants internal_login internal_manage_event_streams internal_manage_passwords internal_manage_pep internal_manage_profiles internal_manage_provisining internal_manage_provisioning internal_manage_users internal_media_mgt_create internal_media_mgt_delete internal_media_mgt_view internal_modify_module internal_modify_service internal_modify_tenants internal_modify_user_profile internal_modify_webapp internal_monitor_attachment internal_monitor_bpel internal_monitor_metrics internal_pap_create internal_pap_delete internal_pap_demote internal_pap_enable internal_pap_list internal_pap_order internal_pap_publish internal_pap_rollback internal_pap_subscriber_create internal_pap_subscriber_delete internal_pap_subscriber_list internal_pap_subscriber_update internal_pap_subscriber_view internal_pap_update internal_pap_view internal_pdp_manage internal_pdp_test internal_pdp_view internal_pep_manage internal_resouces_browse internal_resouces_notifications internal_role_mgt_create internal_role_mgt_delete internal_role_mgt_update internal_role_mgt_view internal_search_advanced internal_search_resouces internal_security_manage_create internal_security_manage_delete internal_security_manage_update internal_security_manage_view internal_server_admin internal_session_delete internal_session_view internal_sts_mgt_create internal_sts_mgt_delete internal_sts_mgt_update internal_sts_mgt_view internal_template_mgt_add internal_template_mgt_delete internal_template_mgt_list internal_template_mgt_view internal_topic_add internal_topic_browse internal_topic_delete internal_topic_purge internal_user_association_create internal_user_association_delete internal_user_association_update internal_user_association_view internal_user_count_create internal_user_count_delete internal_user_count_update internal_user_count_view internal_user_mgt_create internal_user_mgt_delete internal_user_mgt_list internal_user_mgt_update internal_user_mgt_view internal_user_profile_create internal_user_profile_delete internal_user_profile_update internal_user_profile_view internal_userrole_ui_create internal_userstore_create internal_userstore_delete internal_userstore_update internal_userstore_view internal_workflow_association_create internal_workflow_association_delete internal_workflow_association_update internal_workflow_association_view internal_workflow_def_create internal_workflow_def_delete internal_workflow_def_update internal_workflow_def_view internal_workflow_monitor_delete internal_workflow_monitor_view internal_workflow_profile_create internal_workflow_profile_delete internal_workflow_profile_update internal_workflow_profile_view openid",
        username: "admin@carbon.super",
        tenantDomain: "carbon.super"
    },
    config: {
        deployment: {
            accountApp: {
                path: "https://localhost:9000/myaccount/overview",
                commonPostLogoutUrl: false
            },
            adminApp: {
                basePath: "/console/manage",
                displayName: "Manage",
                path: "/console/manage/users"
            },
            appBaseName: "/console",
            appBaseNameWithoutTenant: "console",
            appHomePath: "/console/develop/applications",
            appLoginPath: "/console/login",
            appLogoutPath: "/console/logout",
            allowMultipleAppProtocols: false,
            clientHost: "https://localhost:9001",
            clientID: "CONSOLE",
            clientOrigin: "https://localhost:9001",
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
            loginCallbackUrl: "https://localhost:9001/console/login",
            serverHost: "https://localhost:9443",
            serverOrigin: "https://localhost:9443",
            superTenant: "carbon.super",
            tenant: "carbon.super",
            tenantPath: ""
        },
        endpoints: {
            applications: "https://localhost:9443/api/server/v1/applications",
            requestPathAuthenticators: "https://localhost:9443/api/server/v1/configs/authenticators?type=REQUEST_PATH",
            approvals: "https://localhost:9443/api/users/v1/me/approval-tasks",
            claims: "https://localhost:9443/api/server/v1/claim-dialects",
            externalClaims: "https://localhost:9443/api/server/v1/claim-dialects/{}/claims",
            localClaims: "https://localhost:9443/api/server/v1/claim-dialects/local/claims",
            certificates: "https://localhost:9443/api/server/v1/keystores/certs",
            clientCertificates: "https://localhost:9443/api/server/v1/keystores/client-certs",
            publicCertificates: "https://localhost:9443/api/server/v1/keystores/certs/public",
            identityProviders: "https://localhost:9443/api/server/v1/identity-providers",
            localAuthenticators: "https://localhost:9443/api/server/v1/configs/authenticators",
            emailTemplateType: "https://localhost:9443/api/server/v1/email/template-types",
            permission: "https://localhost:9443/api/server/v1/permission-management/permissions",
            roles: "https://localhost:9443/scim2/Roles",
            accountDisabling: "https://localhost:9443/api/server/v1/identity-governance/TG9naW4gUG9saWNpZXM/connectors/YWNjb3VudC5kaXNhYmxlLmhhbmRsZXI",
            accountLocking: "https://localhost:9443/api/server/v1/identity-governance/TG9naW4gUG9saWNpZXM/connectors/YWNjb3VudC5sb2NrLmhhbmRsZXI",
            accountRecovery: "https://localhost:9443/api/server/v1/identity-governance/QWNjb3VudCBNYW5hZ2VtZW50IFBvbGljaWVz/connectors/YWNjb3VudC1yZWNvdmVyeQ",
            captchaForSSOLogin: "https://localhost:9443/api/server/v1/identity-governance/TG9naW4gUG9saWNpZXM/connectors/c3NvLmxvZ2luLnJlY2FwdGNoYQ",
            governanceConnectorCategories: "https://localhost:9443/api/server/v1/identity-governance",
            loginPolicies: "https://localhost:9443/api/server/v1/identity-governance/TG9naW4gUG9saWNpZXM",
            passwordHistory: "https://localhost:9443/api/server/v1/identity-governance/UGFzc3dvcmQgUG9saWNpZXM/connectors/cGFzc3dvcmRIaXN0b3J5",
            passwordPolicies: "https://localhost:9443/api/server/v1/identity-governance/UGFzc3dvcmQgUG9saWNpZXM",
            passwordPolicy: "https://localhost:9443/api/server/v1/identity-governance/UGFzc3dvcmQgUG9saWNpZXM/connectors/cGFzc3dvcmRQb2xpY3k",
            selfSignUp: "https://localhost:9443/api/server/v1/identity-governance/QWNjb3VudCBNYW5hZ2VtZW50IFBvbGljaWVz/connectors/c2VsZi1zaWduLXVw",
            serverConfigurations: "https://localhost:9443/api/server/v1/configs",
            bulk: "https://localhost:9443/scim2/Bulk",
            groups: "https://localhost:9443/scim2/Groups",
            userSessions: "https://localhost:9443/api/users/v1/{0}/sessions",
            userStores: "https://localhost:9443/api/server/v1/userstores",
            users: "https://localhost:9443/scim2/Users",
            oidcScopes: "https://localhost:9443/api/server/v1/oidc/scopes",
            remoteFetchConfig: "https://localhost:9443/api/server/v1/remote-fetch",
            CORSOrigins: "https://localhost:9443/api/server/v1/cors/origins",
            me: "https://localhost:9443/scim2/Me",
            saml2Meta: "https://localhost:9443/identity/metadata/saml2",
            wellKnown: "https://localhost:9443/oauth2/token/.well-known/openid-configuration"
        },
        features: null,
        i18n: {
            initOptions: {
                backend: {
                    addPath: "/locales/add/{{lng}}/{{ns}}",
                    allowMultiLoading: false,
                    crossDomain: false
                },
                load: "currentOnly",
                ns: [
                    "common",
                    "console",
                    "myAccount",
                    "extensions"
                ]
            },
            langAutoDetectEnabled: true,
            namespaceDirectories: {},
            overrideOptions: false,
            resourcePath: "/resources/i18n",
            xhrBackendPluginEnabled: true
        },
        ui: {
            appCopyright: "WSO2 Identity Server © 2021",
            appName: "Console",
            applicationTemplateLoadingStrategy: "LOCAL",
            identityProviderTemplateLoadingStrategy: "LOCAL",
            appTitle: "Console | WSO2 Identity Server",
            features: {
                applications: {
                    disabledFeatures: [],
                    enabled: true,
                    scopes: {
                        create: [
                            "internal_application_mgt_create"
                        ],
                        read: [
                            "internal_application_mgt_view"
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
                        create: [
                            "internal_claim_meta_create"
                        ],
                        read: [
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
                generalConfigurations: {
                    enabled: true,
                    disabledFeatures: [],
                    scopes: {
                        create: [],
                        read: [
                            "internal_idp_view"
                        ],
                        update: [
                            "internal_idp_update"
                        ],
                        delete: []
                    }
                },
                groups: {
                    enabled: true,
                    disabledFeatures: [],
                    scopes: {
                        create: [
                            "internal_role_mgt_create"
                        ],
                        read: [
                            "internal_role_mgt_view"
                        ],
                        update: [
                            "internal_role_mgt_update"
                        ],
                        delete: [
                            "internal_role_mgt_delete"
                        ]
                    }
                },
                identityProviders: {
                    disabledFeatures: [],
                    enabled: true,
                    scopes: {
                        create: [
                            "internal_idp_create"
                        ],
                        read: [
                            "internal_idp_view"
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
                        create: [
                            "internal_application_mgt_create"
                        ],
                        read: [
                            "internal_application_mgt_view"
                        ],
                        update: [
                            "internal_application_mgt_update"
                        ],
                        delete: [
                            "internal_application_mgt_delete"
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
                        create: [
                            "internal_role_mgt_create"
                        ],
                        read: [
                            "internal_role_mgt_view"
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
                        create: [
                            "internal_user_mgt_create"
                        ],
                        read: [
                            "internal_user_mgt_list",
                            "internal_userstore_view"
                        ],
                        update: [
                            "internal_user_mgt_update"
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
            hiddenAuthenticators: [],
            i18nConfigs: {
                showLanguageSwitcher: false
            },
            isCookieConsentBannerEnabled: false,
            isClientSecretHashEnabled: false,
            isDefaultDialectEditingEnabled: false,
            isDialectAddingEnabled: true,
            isGroupAndRoleSeparationEnabled: true,
            isLeftNavigationCategorized: true,
            isRequestPathAuthenticationEnabled: true,
            isSignatureValidationCertificateAliasEnabled: false,
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
    },
    form: {},
    global: {
        alert: null,
        alertSystem: null,
        isAJAXTopLoaderVisible: true,
        supportedI18nLanguages: {
            "en-US": {
                code: "en-US",
                flag: "us",
                name: "English (United States)",
                namespaces: [
                    "common",
                    "console",
                    "myAccount",
                    "extensions"
                ],
                paths: {
                    common: "en-US/portals/common.json",
                    console: "en-US/portals/console.json",
                    myAccount: "en-US/portals/myAccount.json",
                    extensions: "en-US/portals/extensions.json"
                }
            },
            "fr-FR": {
                code: "fr-FR",
                flag: "fr",
                name: "Français (France)",
                namespaces: [
                    "common",
                    "console",
                    "myAccount",
                    "extensions"
                ],
                paths: {
                    common: "fr-FR/portals/common.json",
                    console: "fr-FR/portals/console.json",
                    myAccount: "fr-FR/portals/myAccount.json",
                    extensions: "fr-FR/portals/extensions.json"
                }
            },
            "pt-BR": {
                code: "pt-BR",
                flag: "br",
                name: "Português (Brazil)",
                namespaces: [
                    "common",
                    "myAccount"
                ],
                paths: {
                    common: "pt-BR/portals/common.json",
                    myAccount: "pt-BR/portals/myAccount.json",
                    extensions: "pt-BR/portals/extensions.json"
                }
            },
            "si-LK": {
                code: "si-LK",
                flag: "lk",
                name: "සිංහල (Sri Lanka)",
                namespaces: [
                    "common",
                    "myAccount",
                    "console",
                    "extensions"
                ],
                paths: {
                    common: "si-LK/portals/common.json",
                    myAccount: "si-LK/portals/myAccount.json",
                    console: "si-LK/portals/console.json",
                    extensions: "si-LK/portals/extensions.json"
                }
            },
            "ta-IN": {
                code: "ta-IN",
                flag: "in",
                name: "தமிழ் (India)",
                namespaces: [
                    "common",
                    "myAccount"
                ],
                paths: {
                    common: "ta-IN/portals/common.json",
                    myAccount: "ta-IN/portals/myAccount.json",
                    extensions: "ta-IN/portals/extensions.json"
                }
            }
        }
    },
    governanceConnector: {
        categories: []
    },
    helpPanel: {
        activeTabIndex: 0,
        docStructure: null,
        docURL: null,
        visibility: false
    },
    identityProvider: {
        meta: {
            authenticators: []
        }
    },
    loaders: {
        isProfileInfoRequestLoading: true,
        isProfileSchemaRequestLoading: false,
        isSignOutRequestLoading: false,
        isTokenRequestLoading: false,
        isTokenRevokeRequestLoading: false
    },
    profile: {
        isSCIMEnabled: true,
        linkedAccounts: [],
        profileInfo: {
            email: "",
            emails: [],
            isSecurity: false,
            name: {
                givenName: "",
                familyName: ""
            },
            organisation: "",
            phoneNumbers: [],
            profileUrl: "",
            responseStatus: null,
            roles: [],
            userImage: "",
            userName: ""
        },
        profileSchemas: []
    }
};

export default ReduxStoreStateMock;
