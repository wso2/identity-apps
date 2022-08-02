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

import { CommonConfigReducerStateInterface } from "@wso2is/core/models";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";
import {
    DeploymentConfigInterface,
    FeatureConfigInterface,
    ServiceResourceEndpointsInterface,
    UIConfigInterface
} from "../../models";

/**
 * Initial state for the common config reducer.
 */
export const commonConfigReducerInitialState: CommonConfigReducerStateInterface<
    DeploymentConfigInterface,
    ServiceResourceEndpointsInterface,
    FeatureConfigInterface,
    I18nModuleOptionsInterface,
    UIConfigInterface> = {

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
            accountDisabling: "",
            accountLocking: "",
            accountRecovery: "",
            applications: "",
            authenticatorTags: "",
            authenticators: "",
            bulk: "",
            captchaForSSOLogin: "",
            certificates: "",
            claims: "",
            clientCertificates: "",
            createSecret: "",
            createSecretType: "",
            deleteSecret: "",
            deleteSecretType: "",
            externalClaims: "",
            getSecret: "",
            getSecretList: "",
            getSecretType: "",
            governanceConnectorCategories: "",
            groups: "",
            identityProviders: "",
            localAuthenticators: "",
            localClaims: "",
            loginPolicies: "",
            me: "",
            multiFactorAuthenticators: "",
            oidcScopes: "",
            organizations: "",
            passwordHistory: "",
            passwordPolicies: "",
            passwordPolicy: "",
            permission: "",
            publicCertificates: "",
            requestPathAuthenticators: "",
            roles: "",
            rolesWithoutOrgPath: "",
            rootOrganization: "",
            saml2Meta: "",
            schemas: "",
            selfSignUp: "",
            serverConfigurations: "",
            serverSupportedSchemas: "",
            updateSecret: "",
            updateSecretType: "",
            userSessions: "",
            userStores: "",
            users: "",
            wellKnown: ""
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
            applicationTemplateLoadingStrategy: undefined,
            isGOTEnabledForSuperTenantOnly: true,
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
            gravatarConfig: {
                defaultImage: "",
                fallback: null,
                size: null
            },
            hiddenAuthenticators: [],
            hiddenUserStores: [],
            i18nConfigs: null,
            identityProviderTemplateLoadingStrategy: null,
            identityProviderTemplates: {
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
                }
            },
            isClientSecretHashEnabled: undefined,
            isCookieConsentBannerEnabled: undefined,
            isDefaultDialectEditingEnabled: undefined,
            isDialectAddingEnabled: undefined,
            isGroupAndRoleSeparationEnabled: undefined,
            isHeaderAvatarLabelAllowed: undefined,
            isLeftNavigationCategorized: undefined,
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
