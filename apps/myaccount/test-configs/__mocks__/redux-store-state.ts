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
 * @remarks If you add new attributes to the reducers, you will need to add them to this file.
 */

/* eslint-disable */

const ReduxStoreStateMock = {
    authenticationInformation: {
        displayName: "admin@carbon.super",
        emails: "admin@wso2.com",
        initialized: true,
        isAuth: true,
        location: "/myaccount/overview",
        loginInit: true,
        logoutInit: false,
        profileInfo: {
            email: "",
            emails: [],
            isReadOnly: true,
            isSecurity: false,
            name: {
                familyName: "",
                givenName: ""
            },
            organisation: "",
            phoneNumbers: [],
            profileUrl: "",
            responseStatus: null,
            roles: [],
            userImage: "",
            userName: ""
        },
        profileSchemas: [],
        scope: "internal_add_attachements internal_add_bpel internal_add_extensions internal_add_module internal_add_services internal_add_webapp internal_app_template_create internal_app_template_delete internal_app_template_update internal_app_template_view internal_application_mgt_create internal_application_mgt_delete internal_application_mgt_update internal_application_mgt_view internal_auth_seq_create internal_auth_seq_delete internal_auth_seq_update internal_auth_seq_view internal_bpel_instances internal_bpel_packages internal_bpel_proceses internal_challenge_questions_create internal_challenge_questions_delete internal_challenge_questions_update internal_challenge_questions_view internal_claim_manage_create internal_claim_manage_delete internal_claim_manage_update internal_claim_manage_view internal_claim_meta_create internal_claim_meta_delete internal_claim_meta_update internal_claim_meta_view internal_config_mgt_add internal_config_mgt_delete internal_config_mgt_list internal_config_mgt_update internal_config_mgt_view internal_configure_datasources internal_configure_themes internal_consent_mgt_add internal_consent_mgt_delete internal_consent_mgt_list internal_consent_mgt_view internal_cors_origins_view internal_email_mgt_create internal_email_mgt_delete internal_email_mgt_update internal_email_mgt_view internal_event_publish internal_feature_management internal_functional_lib_create internal_functional_lib_delete internal_functional_lib_update internal_functional_lib_view internal_humantask_add internal_humantask_packages internal_humantask_task internal_humantask_view internal_identity_mgt_create internal_identity_mgt_delete internal_identity_mgt_update internal_identity_mgt_view internal_idp_create internal_idp_delete internal_idp_update internal_idp_view internal_keystore_create internal_keystore_delete internal_keystore_update internal_keystore_view internal_list_extensions internal_list_tenants internal_login internal_manage_event_streams internal_manage_passwords internal_manage_pep internal_manage_profiles internal_manage_provisining internal_manage_provisioning internal_manage_users internal_media_mgt_create internal_media_mgt_delete internal_media_mgt_view internal_modify_module internal_modify_service internal_modify_tenants internal_modify_user_profile internal_modify_webapp internal_monitor_attachment internal_monitor_bpel internal_monitor_metrics internal_pap_create internal_pap_delete internal_pap_demote internal_pap_enable internal_pap_list internal_pap_order internal_pap_publish internal_pap_rollback internal_pap_subscriber_create internal_pap_subscriber_delete internal_pap_subscriber_list internal_pap_subscriber_update internal_pap_subscriber_view internal_pap_update internal_pap_view internal_pdp_manage internal_pdp_test internal_pdp_view internal_pep_manage internal_resouces_browse internal_resouces_notifications internal_role_mgt_create internal_role_mgt_delete internal_role_mgt_update internal_role_mgt_view internal_search_advanced internal_search_resouces internal_security_manage_create internal_security_manage_delete internal_security_manage_update internal_security_manage_view internal_server_admin internal_session_delete internal_session_view internal_sts_mgt_create internal_sts_mgt_delete internal_sts_mgt_update internal_sts_mgt_view internal_template_mgt_add internal_template_mgt_delete internal_template_mgt_list internal_template_mgt_view internal_topic_add internal_topic_browse internal_topic_delete internal_topic_purge internal_user_association_create internal_user_association_delete internal_user_association_update internal_user_association_view internal_user_count_create internal_user_count_delete internal_user_count_update internal_user_count_view internal_user_mgt_create internal_user_mgt_delete internal_user_mgt_list internal_user_mgt_update internal_user_mgt_view internal_user_profile_create internal_user_profile_delete internal_user_profile_update internal_user_profile_view internal_userrole_ui_create internal_userstore_create internal_userstore_delete internal_userstore_update internal_userstore_view internal_workflow_association_create internal_workflow_association_delete internal_workflow_association_update internal_workflow_association_view internal_workflow_def_create internal_workflow_def_delete internal_workflow_def_update internal_workflow_def_view internal_workflow_monitor_delete internal_workflow_monitor_view internal_workflow_profile_create internal_workflow_profile_delete internal_workflow_profile_update internal_workflow_profile_view openid",
        tenantDomain: "carbon.super",
        username: "admin@carbon.super"
    },
    config: {
        deployment: {
            consoleApp: {
                path: null
            },
            appBaseName: "/myaccount",
            appBaseNameWithoutTenant: "myaccount",
            appHomePath: "/myaccount/overview",
            appLoginPath: "/myaccount/login",
            appLogoutPath: "/myaccount/logout",
            clientHost: "https://localhost:9000",
            clientID: "MY_ACCOUNT",
            clientOrigin: "https://localhost:9000",
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
            loginCallbackUrl: "https://localhost:9000/myaccount/login",
            serverHost: "https://localhost:9443",
            serverOrigin: "https://localhost:9443",
            superTenant: "carbon.super",
            tenant: "carbon.super",
            tenantPath: ""
        },
        endpoints: {
            applications: "https://localhost:9443/api/users/v1/me/applications",
            associations: "https://localhost:9443/api/users/v1/me/associations",
            authorize: "https://localhost:9443/oauth2/authorize",
            challengeAnswers: "https://localhost:9443/api/users/v1/me/challenge-answers",
            challenges: "https://localhost:9443/api/users/v1/me/challenges",
            federatedAssociations: "https://localhost:9443/api/users/v1/me/federated-associations",
            fidoEnd: "https://localhost:9443/api/users/v2/me/webauthn/finish-registration",
            fidoMetaData: "https://localhost:9443/api/users/v2/me/webauthn",
            fidoStart: "https://localhost:9443/api/users/v2/me/webauthn/start-registration",
            fidoStartUsernameless: "https://localhost:9443/api/users/v2/me/webauthn/start-usernameless-registration",
            isReadOnlyUser: "https://localhost:9443/scim2/Me?attributes=urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.isReadOnlyUser",
            issuer: "https://localhost:9443/oauth2/token",
            jwks: "https://localhost:9443/oauth2/jwks",
            logout: "https://localhost:9443/oidc/logout",
            me: "https://localhost:9443/scim2/Me",
            preference: "https://localhost:9443/api/server/v1/identity-governance/preferences",
            profileSchemas: "https://localhost:9443/scim2/Schemas",
            revoke: "https://localhost:9443/oauth2/revoke",
            sessions: "https://localhost:9443/api/users/v1/me/sessions",
            smsOtpResend: "https://localhost:9443/api/identity/user/v1.0/me/resend-code",
            smsOtpValidate: "https://localhost:9443/api/identity/user/v1.0/me/validate-code",
            token: "https://localhost:9443/oauth2/token",
            totp: "https://localhost:9443/api/users/v1/me/totp",
            totpSecret: "https://localhost:9443/api/users/v1/me/totp/secret",
            typingDNAMe: "https://localhost:9443/api/typingdna/v1.0/me/typingpatterns",
            typingDNAServer: "https://localhost:9443/api/typingdna/v1.0/server/typingdnaConfig",
            user: "https://localhost:9443/api/identity/user/v1.0/me",
            wellKnown: "https://localhost:9443/oauth2/oidcdiscovery/.well-known/openid-configuration",
            consentManagement: {
                consent: {
                    addConsent: "https://localhost:9443/api/identity/consent-mgt/v1.0/consents",
                    consentReceipt: "https://localhost:9443/api/identity/consent-mgt/v1.0/consents/receipts",
                    listAllConsents: "https://localhost:9443/api/identity/consent-mgt/v1.0/consents"
                },
                purpose: {
                    getPurpose: "https://localhost:9443/api/identity/consent-mgt/v1.0/consents/purposes",
                    list: "https://localhost:9443/api/identity/consent-mgt/v1.0/consents/purposes"
                }
            },
            homeRealmIdentifiers: "https://localhost:9443/api/server/v1/configs/home-realm-identifiers"
        },
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
                    "myAccount"
                ]
            },
            langAutoDetectEnabled: true,
            namespaceDirectories: {},
            overrideOptions: false,
            resourcePath: "/resources/i18n",
            xhrBackendPluginEnabled: true
        },
        ui: {
            appName: "My Account",
            authenticatorApp: [],
            copyrightText: "WSO2 Identity Server © 2021",
            features: {
                applications: {
                    disabledFeatures: [],
                    enabled: true,
                    scopes: {
                        create: [],
                        read: [],
                        update: [],
                        delete: []
                    }
                },
                overview: {
                    disabledFeatures: [],
                    enabled: true,
                    scopes: {
                        create: [],
                        read: [],
                        update: [],
                        delete: []
                    }
                },
                personalInfo: {
                    disabledFeatures: [
                        "profileInfo.mobileVerification"
                    ],
                    enabled: true,
                    scopes: {
                        create: [],
                        read: [],
                        update: [],
                        delete: []
                    }
                },
                security: {
                    disabledFeatures: [
                        "security.loginVerifyData.typingDNA"
                    ],
                    enabled: true,
                    scopes: {
                        create: [],
                        read: [],
                        update: [],
                        delete: []
                    }
                }
            },
            i18nConfigs: {
                showLanguageSwitcher: true
            },
            isCookieConsentBannerEnabled: true,
            isHeaderAvatarLabelAllowed: true,
            isProfileUsernameReadonly: false,
            privacyPolicyConfigs: {
                visibleOnFooter: true
            },
            productName: "WSO2 Identity Server",
            productVersionConfig: {
                allowSnapshot: true,
                textCase: "uppercase",
                labelColor: "primary"
            },
            theme: {
                name: "default"
            },
            disableMFAforSuperTenantUser: false
        }
    },
    global: {
        activeForm: null,
        alert: null,
        alertSystem: null,
        isGlobalLoaderVisible: false,
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
    loaders: {
        isProfileInfoLoading: true,
        isProfileSchemaLoading: false
    },
    profile: {
        completion: null,
        isSCIMEnabled: true,
        linkedAccounts: []
    }
};

export default ReduxStoreStateMock;
