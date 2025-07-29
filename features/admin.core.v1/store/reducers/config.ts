/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { CommonConfigReducerStateInterface } from "@wso2is/core/models";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";
import {
    DeploymentConfigInterface,
    FeatureConfigInterface,
    ServiceResourceEndpointsInterface,
    UIConfigInterface
} from "../../models/config";

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
            __experimental__platformIdP: null,
            accountApp: {
                basePath: "",
                centralAppPath: "",
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
            centralDeploymentEnabled: undefined,
            clientHost: "",
            clientID: "",
            clientOrigin: "",
            clientOriginWithTenant: "",
            customServerHost: "",
            developerApp: {
                basePath: "",
                displayName: "",
                path: "",
                tenantQualifiedPath: ""
            },
            docSiteURL: "",
            extensions: null,
            helpCenterURL: "",
            idpConfigs: null,
            loginCallbackUrl: "",
            organizationPrefix: "",
            regionSelectionEnabled: undefined,
            serverHost: "",
            serverOrigin: "",
            superTenant: "",
            tenant: "",
            tenantContext: null,
            tenantPath: "",
            tenantPrefix: ""
        },
        endpoints: {
            CORSOrigins: "",
            accountDisabling: "",
            accountLocking: "",
            accountRecovery: "",
            actions: "",
            adminAdvisoryBanner: "",
            apiRoot: "",
            applicationTemplate: "",
            applicationTemplateMetadata: "",
            applications: "",
            asyncStatus: "",
            authenticatorTags: "",
            authenticators: "",
            brandingPreference: "",
            brandingPreferenceSubOrg: "",
            brandingTextPreference: "",
            brandingTextPreferenceSubOrg: "",
            breadcrumb: "",
            bulk: "",
            captchaForSSOLogin: "",
            certificates: "",
            claims: "",
            clientCertificates: "",
            createSecret: "",
            createSecretType: "",
            customAuthenticators: "",
            dcrConfiguration: "",
            deleteSecret: "",
            deleteSecretType: "",
            deploymentUnits: "",
            entitlementPoliciesApi: "",
            entitlementPolicyCombiningAlgorithmApi: "",
            entitlementPolicyPublishApi: "",
            extensionTemplates: "",
            extensions: "",
            externalClaims: "",
            fidoConfigs: "",
            flowMeta: "",
            getSecret: "",
            getSecretList: "",
            getSecretType: "",
            governanceConnectorCategories: "",
            groupMetadata: "",
            groups: "",
            guests: "",
            guestsList: "",
            identityProviders: "",
            impersonationConfigurations: "",
            localAuthenticators: "",
            localClaims: "",
            loginPolicies: "",
            me: "",
            multiFactorAuthenticators: "",
            myAccountConfigMgt: "",
            oidcScopes: "",
            organizations: "",
            passiveStsConfigurations: "",
            passwordExpiry: "",
            passwordHistory: "",
            passwordPolicies: "",
            passwordPoliciesUpdate: "",
            passwordPolicy: "",
            permission: "",
            publicCertificates: "",
            remoteLogPublishEndpoint: "",
            remoteLogging: "",
            requestPathAuthenticators: "",
            resendCode: "",
            resourceTypes: "",
            roles: "",
            rolesV2: "",
            rolesV3: "",
            rolesWithoutOrgPath: "",
            rootOrganization: "",
            rootUsersOrganization: "",
            rulesMetaData: "",
            saml2Configurations: "",
            saml2Meta: "",
            schemas: "",
            selfSignUp: "",
            serverConfigurations: "",
            serverSupportedSchemas: "",
            smsTemplates: "",
            tenantAssociationApi: "",
            tenantManagementApi: "",
            tenantSubscriptionApi: "",
            tenants: "",
            updateSecret: "",
            updateSecretType: "",
            userSessions: "",
            userStores: "",
            users: "",
            usersOrganization: "",
            usersSuperOrganization: "",
            validationServiceMgt: "",
            validationServiceMgtSubOrg: "",
            wellKnown: "",
            workflowAssociations: "",
            workflows: ""
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
            appLogo: {
                defaultLogoPath: "",
                defaultWhiteLogoPath: ""
            },
            appName: "",
            appTitle: "",
            applicationTemplateLoadingStrategy: undefined,
            asyncOperationStatusPollingInterval: null,
            connectionResourcesUrl: "",
            cookiePolicyUrl: "",
            customContent: {},
            emailTemplates: {
                defaultLogoUrl: "",
                defaultWhiteLogoUrl: ""
            },
            enableCustomEmailTemplates: undefined,
            enableOldUIForEmailProvider: undefined,
            features: {
                applications: null,
                approvals: null,
                attributeDialects: null,
                attributeVerification: null,
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
            isAdminDataSeparationNoticeEnabled: undefined,
            isClaimUniquenessValidationEnabled: undefined,
            isClientSecretHashEnabled: undefined,
            isCookieConsentBannerEnabled: undefined,
            isCustomClaimMappingEnabled: undefined,
            isCustomClaimMappingMergeEnabled: undefined,
            isDefaultDialectEditingEnabled: undefined,
            isDialectAddingEnabled: undefined,
            isEditingSystemRolesAllowed: undefined,
            isGroupAndRoleSeparationEnabled: undefined,
            isHeaderAvatarLabelAllowed: undefined,
            isLeftNavigationCategorized: undefined,
            isMarketingConsentBannerEnabled: undefined,
            isPasswordInputValidationEnabled: undefined,
            isRequestPathAuthenticationEnabled: undefined,
            isSAASDeployment: undefined,
            isSignatureValidationCertificateAliasEnabled: undefined,
            isTrustedAppConsentRequired: undefined,
            listAllAttributeDialects: undefined,
            multiTenancy: {
                isTenantDomainDotExtensionMandatory: true,
                tenantDomainIllegalCharactersRegex: "",
                tenantDomainRegex: ""
            },
            passwordPolicyConfigs: null,
            primaryUserStoreDomainName: "",
            privacyPolicyConfigs: null,
            productName: "",
            productVersionConfig: null,
            routes: {
                organizationEnabledRoutes: []
            },
            selfAppIdentifier: "",
            showAppSwitchButton: undefined,
            showSmsOtpPwdRecoveryFeatureStatusChip: undefined,
            showStatusLabelForNewAuthzRuntimeFeatures: undefined,
            systemAppsIdentifiers: [],
            systemReservedUserStores: [],
            theme: {
                name: "",
                path: "",
                styleSheets: null
            }
        }
    };
