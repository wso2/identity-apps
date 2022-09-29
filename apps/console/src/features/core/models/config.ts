/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
    CommonConfigInterface,
    CommonDeploymentConfigInterface,
    CommonUIConfigInterface,
    FeatureAccessConfigInterface
} from "@wso2is/core/models";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";
import {
    ApplicationTemplateLoadingStrategies,
    ApplicationsResourceEndpointsInterface
} from "../../applications/models";
import { CertificatesResourceEndpointsInterface } from "../../certificates";
import { ClaimResourceEndpointsInterface } from "../../claims";
import { GroupsResourceEndpointsInterface } from "../../groups";
import { IDPResourceEndpointsInterface, IdentityProviderTemplateLoadingStrategies } from "../../identity-providers";
import { ScopesResourceEndpointsInterface } from "../../oidc-scopes";
import { OrganizationResourceEndpointsInterface } from "../../organizations/models";
import { RolesResourceEndpointsInterface } from "../../roles";
import { SecretsManagementEndpoints } from "../../secrets/models/endpoints";
import { ServerConfigurationsResourceEndpointsInterface } from "../../server-configurations";
import { UsersResourceEndpointsInterface } from "../../users";
import { UserstoreResourceEndpointsInterface } from "../../userstores";

export type ConfigInterface = CommonConfigInterface<
    DeploymentConfigInterface,
    ServiceResourceEndpointsInterface,
    FeatureConfigInterface,
    I18nModuleOptionsInterface,
    UIConfigInterface>;

/**
 * Application configuration interface.
 */
export interface FeatureConfigInterface {
    /**
     * Application management feature.
     */
    applications?: FeatureAccessConfigInterface;
    /**
     * Workflow approvals feature.
     */
    approvals?: FeatureAccessConfigInterface;
    /**
     * Attribute dialects(Claim dialects) feature.
     */
    attributeDialects?: FeatureAccessConfigInterface;
    /**
     * Certificates configurations feature.
     */
    certificates?: FeatureAccessConfigInterface;
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
     * Identity provider management feature.
     */
    identityProviders?: FeatureAccessConfigInterface;
    /**
     * OIDC Scope management feature.
     */
    oidcScopes?: FeatureAccessConfigInterface;
    /**
     * Organization management feature.
     */
    organizations?: FeatureAccessConfigInterface;
    /**
     * Organization role management feature.
     */
    organizationsRoles?: FeatureAccessConfigInterface;
    /**
     * Remote Fetch Config management feature.
     */
    remoteFetchConfig?: FeatureAccessConfigInterface;
    /**
     * Role management feature.
     */
    roles?: FeatureAccessConfigInterface;
    /**
     * User store configurations feature.
     */
    userStores?: FeatureAccessConfigInterface;
    /**
     * User management feature.
     */
    users?: FeatureAccessConfigInterface;
    /**
     * Secret Management Feature UI Access Scopes.
     */
    secretsManagement?: FeatureAccessConfigInterface;
    /**
     * Try It feature
     */
    tryIt?: FeatureAccessConfigInterface;
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
     * Set of authenticators to be hidden in application sign on methods.
     */
    hiddenAuthenticators?: string[];
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
     * Enable signature validation certificate alias.
     */
    isSignatureValidationCertificateAliasEnabled?: boolean;
    /**
     * Self app name.
     */
    selfAppIdentifier: string;
    /**
     * System apps list.
     */
    systemAppsIdentifiers: string[];
    /**
     * Show App Switch button in the Header.
     */
    showAppSwitchButton?: boolean;
    /**
     * Hidden userstores
     */
    hiddenUserStores: string[];
}

/**
 * Interface for IDP template configurations.
 */
interface IdentityProviderTemplatesConfigInterface {
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
    IDPResourceEndpointsInterface,
    ScopesResourceEndpointsInterface,
    SecretsManagementEndpoints,
    OrganizationResourceEndpointsInterface {

    CORSOrigins: string;
    // TODO: Remove this endpoint and use ID token to get the details
    me: string;
    saml2Meta: string;
    wellKnown: string;
}
