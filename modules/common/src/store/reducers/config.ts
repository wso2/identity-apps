/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Initial state for the common config reducer.
 */
export const commonConfigReducerInitialState = {

        deployment: {
            accountApp: {
                basePath: "",
                displayName: "",
                path: "",
                tenantQualifiedPath: ""
            },
            adminApp: {
                basePath: "",
                displayName: "",
                path: "",
                tenantQualifiedPath: ""
            },
            allowMultipleAppProtocols: undefined,
            appBaseName: "",
            appBaseNameWithoutTenant: "",
            appHomePath: "",
            appLoginPath: "",
            appLogoutPath: "",
            clientHost: "",
            clientID: "",
            clientOrigin: "",
            customServerHost: "",
            developerApp: {
                basePath: "",
                displayName: "",
                path: "",
                tenantQualifiedPath: ""
            },
            docSiteURL: "",
            documentation: null,
            extensions: null,
            helpCenterURL: "",
            idpConfigs: null,
            loginCallbackUrl: "",
            serverHost: "",
            serverOrigin: "",
            superTenant: "",
            tenant: "",
            tenantPath: "",
            tenantPrefix: ""
        },
        endpoints: {
            CORSOrigins: "",
            identityProviders: ""
        },
        features: {
            applications: null,
            approvals: null,
            attributeDialects: null,
            certificates: null,
            emailTemplates: null,
            governanceConnectors: null,
            groups: null,
            guestUser: null,
            identityProviders: null,
            oidcScopes: null,
            remoteFetchConfig: null,
            roles: null,
            secretsManagement: null,
            userStores: null,
            users: null
        },
        i18n: null,
        ui: {
            announcements: [],
            appCopyright: "",
            appName: "",
            appTitle: "",
            features: {
                applications: null,
                approvals: null,
                attributeDialects: null,
                certificates: null,
                emailTemplates: null,
                governanceConnectors: null,
                groups: null,
                guestUser: null,
                identityProviders: null,
                oidcScopes: null,
                remoteFetchConfig: null,
                roles: null,
                secretsManagement: null,
                userStores: null,
                users: null
            },
            googleOneTapEnabledTenants: [],
            gravatarConfig: {
                defaultImage: "",
                fallback: null,
                size: null
            },
            hiddenAuthenticators: [],
            hiddenConnectionTemplates: [],
            hiddenUserStores: [],
            i18nConfigs: null,
            identityProviderTemplates: {
                apple: {
                    enabled: false
                },
                enterpriseOIDC: {
                    enabled: false
                },
                enterpriseSAML: {
                    enabled: false
                },
                facebook: {
                    enabled: false
                },
                github: {
                    enabled: false
                },
                google: {
                    enabled: false
                },
                microsoft: {
                    enabled: false
                }
            },
            connectionResourcesUrl: "",
            isClientSecretHashEnabled: undefined,
            isCookieConsentBannerEnabled: undefined,
            isDefaultDialectEditingEnabled: undefined,
            isDialectAddingEnabled: undefined,
            isGroupAndRoleSeparationEnabled: undefined,
            isHeaderAvatarLabelAllowed: undefined,
            isLeftNavigationCategorized: undefined,
            isMarketingConsentBannerEnabled: undefined,
            isRequestPathAuthenticationEnabled: undefined,
            isSignatureValidationCertificateAliasEnabled: undefined,
            listAllAttributeDialects: undefined,
            privacyPolicyConfigs: null,
            productName: "",
            productVersionConfig: null,
            selfAppIdentifier: "",
            showAppSwitchButton: undefined,
            systemAppsIdentifiers: [],
            theme: {
                name: "",
                path: "",
                styleSheets: null
            }
        }
    };
