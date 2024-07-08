/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { ResponseMode, Storage } from "@asgardeo/auth-react";
import {
    ApplicationTemplateLoadingStrategies,
    ApplicationsResourceEndpointsInterface
} from "@wso2is/admin.applications.v1/models";
import { BrandingPreferenceResourceEndpointsInterface } from "@wso2is/admin.branding.v1/models/endpoints";
import { CertificatesResourceEndpointsInterface } from "@wso2is/admin.certificates.v1";
import { ClaimResourceEndpointsInterface } from "@wso2is/admin.claims.v1/models/endpoints";
import { ConnectionResourceEndpointsInterface } from "@wso2is/admin.connections.v1";
import { ConsoleSettingsResourceEndpointsInterface } from "@wso2is/admin.console-settings.v1/models/endpoints";
import { GroupsResourceEndpointsInterface } from "@wso2is/admin.groups.v1";
import { IdentityProviderTemplateLoadingStrategies }
    from "@wso2is/admin.identity-providers.v1/models/identity-provider";
import { ScopesResourceEndpointsInterface } from "@wso2is/admin.oidc-scopes.v1";
import { OrganizationResourceEndpointsInterface } from "@wso2is/admin.organizations.v1/models";
import { JWTAuthenticationServiceEndpointsInterface } from "@wso2is/admin.private-key-jwt.v1/models";
import { RolesResourceEndpointsInterface } from "@wso2is/admin.roles.v2/models/endpoints";
import { SecretsManagementEndpoints } from "@wso2is/admin.secrets.v1/models/endpoints";
import { ServerConfigurationsResourceEndpointsInterface } from "@wso2is/admin.server-configurations.v1";
import { TenantResourceEndpointsInterface } from "@wso2is/admin.tenants.v1/models/endpoints";
import { UsersResourceEndpointsInterface } from "@wso2is/admin.users.v1/models/endpoints";
import { UserstoreResourceEndpointsInterface } from "@wso2is/admin.userstores.v1/models/endpoints";
import { ValidationServiceEndpointsInterface } from "@wso2is/admin.validation.v1/models";
import {
    CommonConfigInterface,
    CommonDeploymentConfigInterface,
    CommonUIConfigInterface,
    FeatureAccessConfigInterface
} from "@wso2is/core/models";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";

export type ConfigInterface = CommonConfigInterface<
    DeploymentConfigInterface,
    ServiceResourceEndpointsInterface,
    FeatureConfigInterface,
    I18nModuleOptionsInterface,
    UIConfigInterface>;


interface ConnectionConfigInterface extends FeatureAccessConfigInterface {
    /**
     * Connection templates.
     */
    templates?: Record<string, any>[];
}

/**
 * Application configuration interface.
 */
export interface FeatureConfigInterface {
    /**
     * Admin user management feature.
     */
    administrators?: FeatureAccessConfigInterface;
    /**
     * Analytics feature.
     */
    analytics?: FeatureAccessConfigInterface;
    /**
     * API resources feature.
     */
    apiResources?: FeatureAccessConfigInterface;
    /**
     * Application management feature.
     */
    applications?: FeatureAccessConfigInterface;
    /**
     * Application roles feature.
     */
    applicationRoles?: FeatureAccessConfigInterface;
    /**
     * Workflow approvals feature.
     */
    approvals?: FeatureAccessConfigInterface;
    /**
     * Attribute dialects(Claim dialects) feature.
     */
    attributeDialects?: FeatureAccessConfigInterface;
    /**
     * Branding configurations feature.
     */
    branding?: FeatureAccessConfigInterface;
    /**
     * Certificates configurations feature.
     */
    certificates?: FeatureAccessConfigInterface;
    /**
     * Email providers feature.
     */
    emailProviders?: FeatureAccessConfigInterface;
    /**
     * Getting started feature.
     */
    gettingStarted?: FeatureAccessConfigInterface;
    /**
     * SMS providers feature.
     */
    smsProviders?: FeatureAccessConfigInterface;
    /**
     * Notification channels feature.
     */
    notificationChannels?: FeatureAccessConfigInterface;
    /**
     * Email templates feature.
     */
    emailTemplates?: FeatureAccessConfigInterface;
    /**
     * General Configuration settings feature.
     */
    governanceConnectors?: FeatureAccessConfigInterface;
    /**
     * Groups feature.
     */
    groups?: FeatureAccessConfigInterface;
    /**
     * Guest User Feature
     */
    guestUser?: FeatureAccessConfigInterface;
    /**
     * Parent User Invite Feature
     */
    parentUserInvitation?: FeatureAccessConfigInterface;
    /**
     * Identity provider management feature.
     */
    identityProviders?: FeatureAccessConfigInterface;
    /**
     * Identity provider groups feature.
     */
    identityProviderGroups?: FeatureAccessConfigInterface;
    /**
     * Identity verification provider management feature.
     */
    identityVerificationProviders?: FeatureAccessConfigInterface;
    /**
     * Login and Registration feature.
     */
    loginAndRegistration?: FeatureAccessConfigInterface;
    /**
     * OIDC Scope management feature.
     */
    oidcScopes?: FeatureAccessConfigInterface;
    /**
     * Organization management feature.
     */
    organizations?: FeatureAccessConfigInterface;
    /**
     * Organization discovery feature.
     */
    organizationDiscovery?: FeatureAccessConfigInterface;
    /**
     * Organization role management feature.
     */
    organizationsRoles?: FeatureAccessConfigInterface;
    /**
     * Remote Fetch Config management feature.
     */
    remoteFetchConfig?: FeatureAccessConfigInterface;
    /**
     * Resident IDP Config management feature.
     */
    server?: FeatureAccessConfigInterface;
    /**
     * Role management feature.
     */
    roles?: FeatureAccessConfigInterface;
    /**
     * Saml2 Configurations feature.
     */
    saml2Configuration?: FeatureAccessConfigInterface;
    /**
     * Session management Configurations feature
     */
    sessionManagement?: FeatureAccessConfigInterface;
    /**
     * User store configurations feature.
     */
    userStores?: FeatureAccessConfigInterface;
    /**
     * User management feature.
     */
    users?: FeatureAccessConfigInterface;
    /**
     * User roles feature.
     */
    userRoles?: FeatureAccessConfigInterface;
    /**
     * Secret Management Feature UI Access Scopes.
     */
    secretsManagement?: FeatureAccessConfigInterface;
    /**
     * Try It feature
     */
    tryIt?: FeatureAccessConfigInterface;
    /**
     * Event Management feature
     */
    eventPublishing?: FeatureAccessConfigInterface;
    /**
     * Organization insights feature
     */
    insights?: FeatureAccessConfigInterface
    /**
     * Diagnostic Logs feature.
     */
    diagnosticLogs?: FeatureAccessConfigInterface
    /**
     * Audit Logs feature.
     */
    auditLogs?: FeatureAccessConfigInterface
    /**
     * Event Configurations feature
     */
    eventConfiguration?: FeatureAccessConfigInterface;
    /**
     * Bulk Import Feature
     */
    bulkUserImport?: FeatureAccessConfigInterface;
    /**
     * WS Federation Configurations feature
     */
    wsFedConfiguration?: FeatureAccessConfigInterface;
    /**
     * Resident Outbound Provisioning feature
     */
    residentOutboundProvisioning?: FeatureAccessConfigInterface;
    /**
     * Connection management feature.
     */
    connections?: ConnectionConfigInterface;
}

/**
 * Portal Deployment config interface inheriting the common configs from core module.
 */
export interface DeploymentConfigInterface extends CommonDeploymentConfigInterface<ResponseMode, Storage> {
    /**
     * Configs of the Admin app.
     */
    adminApp: ExternalAppConfigInterface;
    /**
     * Configs of the myaccount app.
     */
    accountApp: ExternalAppConfigInterface;
    /**
     * Configs of the developer app.
     */
    developerApp: ExternalAppConfigInterface;
    /**
     * Configs for extensions.
     */
    extensions: Record<string, unknown>;
    /**
     * URL of the help center.
     */
    helpCenterURL?: string;
    /**
     * URL of the doc site.
     */
    docSiteURL?: string;
    /**
     * Configs of multiple application protocol.
     */
    allowMultipleAppProtocols?: boolean;
}

/**
 * Interface for defining settings and configs of an external app.
 */
interface ExternalAppConfigInterface {
    /**
     * App base path. ex: `/account`, `/admin` etc.
     */
    basePath: string;
    /**
     * Display name for the app.
     */
    displayName: string;
    /**
     * Access path/URL for the app.
     */
    path: string;
    /**
     * Access path/URL for the consumer account app.
     */
    tenantQualifiedPath: string;
}

type GovernanceConnectorsFeatureConfig = Record<string, {
    disabledFeatures: string[]
}>

/**
 * Portal UI config interface inheriting the common configs from core module.
 */
export interface UIConfigInterface extends CommonUIConfigInterface<FeatureConfigInterface> {
    /**
     * How should the application templates be loaded.
     * If `LOCAL` is selected, app will resort to in app templates.
     * `REMOTE` will fetch templates from the template management REST API.
     */
    applicationTemplateLoadingStrategy?: ApplicationTemplateLoadingStrategies;
    /**
     * Connection resources URL.
     */
    connectionResourcesUrl?: string;
    /**
     * Configuration to enable Google One Tap for specific tenants.
     */
    googleOneTapEnabledTenants?: string[];
    /**
     * Set of authenticators to be hidden in application sign on methods.
     */
    hiddenAuthenticators?: string[];
    /**
     * Set of connections to be hidden.
     */
    hiddenConnectionTemplates?: string[];
    /**
     * Configurations for IDP templates.
     */
    identityProviderTemplates: IdentityProviderTemplatesConfigInterface;
    /**
     * How should the IDP templates be loaded.
     * If `LOCAL` is selected, app will resort to in-app templates.
     * `REMOTE` will fetch templates from the template management REST API.
     */
    identityProviderTemplateLoadingStrategy?: IdentityProviderTemplateLoadingStrategies;
    /**
     * Should default dialects be allowed for editing.
     */
    isDefaultDialectEditingEnabled?: boolean;
    /**
     * Should dialects addition be allowed.
     */
    isDialectAddingEnabled?: boolean;
    /**
     * Flag to check if the `OAuth.EnableClientSecretHash` is enabled in the `identity.xml`.
     */
    isClientSecretHashEnabled?: boolean;
    /**
     * Flag to check if the feature gate should be enabled.
     */
    isFeatureGateEnabled?: boolean;
    /**
     * Enable roles and groups separation.
     */
    isGroupAndRoleSeparationEnabled?: boolean;
    /**
     * Is Request path section enabled in applications.
     */
    isRequestPathAuthenticationEnabled?: boolean;
    /**
     * Flag to check whether to list all the attribute dialects
     */
    listAllAttributeDialects?: boolean;
    /**
     * Flag to check whether to enable the identity claims.
     */
    enableIdentityClaims?: boolean;
    /**
     * Flag to check whether email as a username feature is enabled.
     */
    enableEmailDomain?: boolean;
    /**
     * Should show/hide marketing consent banner.
     */
    isMarketingConsentBannerEnabled: boolean;
    /**
     * Whether a SAAS deployment or not.
     */
    isSAASDeployment: boolean;
    /**
     * Enable/Disable custom email template feature
     */
    enableCustomEmailTemplates: boolean;
    /**
     * Enable signature validation certificate alias.
     */
    isSignatureValidationCertificateAliasEnabled?: boolean;
    /**
     * Enable/Disable the custom claim mapping feature.
     */
    isCustomClaimMappingEnabled?: boolean;
    /**
     * Enable/Disable the custom claim mapping merge feature.
     */
    isCustomClaimMappingMergeEnabled?: boolean;
    /**
     * Self app name.
     */
    selfAppIdentifier: string;
    /**
     * System apps list.
     */
    systemAppsIdentifiers: string[];
    /**
     * Is editing system roles allowed
     */
    isEditingSystemRolesAllowed: boolean;
    /**
     * Show App Switch button in the Header.
     */
    showAppSwitchButton?: boolean;
    /**
     * Show Label for the features introduced with new authz runtime.
     */
    showStatusLabelForNewAuthzRuntimeFeatures?: boolean;
    /**
     * Hidden userstores
     */
    hiddenUserStores: string[];
    /**
     * App Logos
     */
    appLogo: {
        defaultLogoPath: string;
        defaultWhiteLogoPath: string;
    };
    /**
     * Email templates
     */
    emailTemplates: {
        defaultLogoUrl: string;
        defaultWhiteLogoUrl: string;
    };
    /**
     * is XACML connector enabled.
     */
    isXacmlConnectorEnabled?: boolean;
    /**
     * Display name of the console administrator role.
     */
    administratorRoleDisplayName?: string;
    /**
     * Whether to consider the role claim as the group claim.
     */
    useRoleClaimAsGroupClaim?: boolean;
    /**
     * Feature configs related to governance connectors.
     */
    governanceConnectors?: GovernanceConnectorsFeatureConfig;

    /**
     * Configurations for IDP templates.
     */
    connectionTemplates?: any;
    /**
     * Config if beta tag should be displayed for sms otp for password recovery feature.
     */
    showSmsOtpPwdRecoveryFeatureStatusChip?: boolean;
}

/**
 * Interface for IDP template configurations.
 */
interface IdentityProviderTemplatesConfigInterface {
    /**
     * Apple template config.
     */
    apple: IdentityProviderTemplateConfigInterface;
    /**
     * Enterprise OIDC template config.
     */
    enterpriseOIDC: IdentityProviderTemplateConfigInterface;
    /**
     * Enterprise SAML template config.
     */
    enterpriseSAML: IdentityProviderTemplateConfigInterface;
    /**
     * Facebook template config.
     */
    facebook: IdentityProviderTemplateConfigInterface;
    /**
     * Google template config.
     */
    google: IdentityProviderTemplateConfigInterface;
    /**
     * GitHub template config.
     */
    github: IdentityProviderTemplateConfigInterface;
    /**
     * Microsoft template config.
     */
    microsoft: IdentityProviderTemplateConfigInterface;
}

/**
 * Interface for IDP template config.
 */
interface IdentityProviderTemplateConfigInterface {
    /**
     * Is the IDP enabled.
     */
    enabled: boolean;
}

/**
 * Service resource endpoints config.
 */
export interface ServiceResourceEndpointsInterface extends ClaimResourceEndpointsInterface,
    CertificatesResourceEndpointsInterface,
    GroupsResourceEndpointsInterface,
    ServerConfigurationsResourceEndpointsInterface,
    UsersResourceEndpointsInterface,
    UserstoreResourceEndpointsInterface,
    RolesResourceEndpointsInterface,
    ApplicationsResourceEndpointsInterface,
    ConnectionResourceEndpointsInterface,
    ScopesResourceEndpointsInterface,
    SecretsManagementEndpoints,
    OrganizationResourceEndpointsInterface,
    TenantResourceEndpointsInterface,
    ValidationServiceEndpointsInterface,
    JWTAuthenticationServiceEndpointsInterface,
    BrandingPreferenceResourceEndpointsInterface,
    ConsoleSettingsResourceEndpointsInterface {

    CORSOrigins: string;
    // TODO: Remove this endpoint and use ID token to get the details
    me: string;
    saml2Meta: string;
    wellKnown: string;
}

export interface ResourceEndpointsInterface {
    [key: string]: string;
}
