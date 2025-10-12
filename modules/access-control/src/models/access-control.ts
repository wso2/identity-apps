/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

export interface AccessControlConfigInterface {
    permissions: PermissionsInterface
}

export interface PermissionsInterface {
    [key: string]: boolean;
}

/**
 * Interface to extent in-order to enable scope based access control.
 */
export interface FeatureAccessConfigInterface {
    /**
     * CRUD scopes for the feature.
     */
    scopes: CRUDScopesInterface;
    /**
     * Set of deprecated features.
     */
    deprecatedFeaturesToShow?: DeprecatedFeatureInterface[];
    /**
     * Set of disabled features.
     */
    disabledFeatures?: string[];
    /**
     * Enable the feature.
     */
    enabled?: boolean;
    /**
     * Enable the tour option
     */
    tryittourenabled?: boolean;
    /**
     * Sub features of the feature.
     */
    subFeatures?: {
        [key: string]: Omit<FeatureAccessConfigInterface, "subFeatures">;
    };
}

export interface DeprecatedFeatureInterface {
    /**
     * Name of the deprecated feature.
     */
    name?: string;
    /**
     * An array of deprecated properties.
     */
    deprecatedProperties?: string[];
}

/**
 * Interface for Scopes related to CRUD permission.
 */
export interface CRUDScopesInterface {
    /**
     * Feature wise scopes array.
     */
    feature: string[];
    /**
     * Create permission scopes array.
     */
    create: string[];
    /**
     * Read permission scopes array.
     */
    read: string[];
    /**
     * Update permission scopes array.
     */
    update: string[];
    /**
     * Delete permission scopes array.
     */
    delete: string[];
}

export enum OrganizationType {
    SUBORGANIZATION = "SUBORGANIZATION",
    TENANT = "TENANT",
    FIRST_LEVEL_ORGANIZATION = "FIRST_LEVEL_ORGANIZATION",
    SUPER_ORGANIZATION= "SUPER_ORGANIZATION"
}

export interface AccessControlContextPropsInterface {
    allowedScopes: string;
    organizationType: string;
}

/**
 * Application configuration interface.
 * This interface replaces the deprecated FeatureConfigInterface from @wso2is/core.
 */
export interface FeatureConfigInterface {
    /**
     * Action management feature.
     */
    actions?: FeatureAccessConfigInterface;
    /**
     * Agent management feature.
     */
    agents?: FeatureAccessConfigInterface;
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
     * Attribute verification feature.
     */
    attributeVerification?: FeatureAccessConfigInterface;
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
     * Flow orchestration feature.
     */
    flows?: FeatureAccessConfigInterface;
    /**
     * Getting started feature.
     */
    gettingStarted?: FeatureAccessConfigInterface;
    /**
     * SMS providers feature.
     */
    smsProviders?: FeatureAccessConfigInterface;
    /**
     * Push providers feature.
     */
    pushProviders?: FeatureAccessConfigInterface;
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
     * SMS templates feature.
     */
    smsTemplates?: FeatureAccessConfigInterface;
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
    insights?: FeatureAccessConfigInterface;
    /**
     * Diagnostic Logs feature.
     */
    diagnosticLogs?: FeatureAccessConfigInterface;
    /**
     * Audit Logs feature.
     */
    auditLogs?: FeatureAccessConfigInterface;
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
     * Rule based password expiry feature
     */
    ruleBasedPasswordExpiry?: FeatureAccessConfigInterface;
    /**
     * Connection management feature.
     */
    connections?: FeatureAccessConfigInterface;
    /**
     * Notification sending feature.
     */
    internalNotificationSending?: FeatureAccessConfigInterface;
    /**
     * Registration flow builder feature.
     */
    registrationFlowBuilder?: FeatureAccessConfigInterface;
    /**
     * Workflow instances feature.
     */
    workflowInstances?: FeatureAccessConfigInterface;
    /**
     * Workflow feature.
     */
    approvalWorkflows?: FeatureAccessConfigInterface;
    /**
     * User roles V3 feature.
     */
    userRolesV3?: FeatureAccessConfigInterface;
}