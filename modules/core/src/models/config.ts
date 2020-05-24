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

import { DocumentationProviders, DocumentationStructureFileTypes } from "./documentation";

/**
 * Common interface for configs.
 */
export interface CommonConfigInterface<T, S, U, V, W> {
    /**
     * Deployment related configurations.
     */
    deployment?: T;
    /**
     * Resource endpoints.
     */
    endpoints?: S;
    /**
     * Feature configurations.
     */
    features?: U;
    /**
     * I18n configurations.
     */
    i18n?: V;
    /**
     * UI configurations.
     */
    ui?: W;
}

/**
 * Common config interface for deployment settings.
 */
export interface CommonDeploymentConfigInterface {
    /**
     * Base name of the application (tenant qualified).
     * ex: `/t/wos2.com/developer-portal`
     */
    appBaseName: string;
    /**
     * Base name without tenant.
     * ex: `/developer-portal`
     */
    appBaseNameWithoutTenant: string;
    /**
     * Home path of the application.
     * ex: `/overview`
     */
    appHomePath: string;
    /**
     * Login path of the application.
     * ex: `/login`
     */
    appLoginPath: string;
    /**
     * Name of the application.
     * ex: `DEVELOPER PORTAL`
     */
    applicationName: string;
    /**
     * Host of the client application.
     * ex: `https://localhost:9001`
     */
    clientHost: string;
    /**
     * Client ID of the client application.
     */
    clientID: string;
    /**
     * Origin of the client application. Usually same as `clientHost`.
     */
    clientOrigin: string;
    /**
     * Portal Documentation configs.
     */
    documentation?: DocumentationInterface;
    /**
     * Callback to directed on successful login.
     * ex: `/developer-portal/login`
     */
    loginCallbackUrl: string;
    /**
     * Product version.
     */
    productVersion: ProductVersionInterface;
    /**
     * Host of the Identity Sever.
     * ex: https://localhost:9443
     */
    serverHost: string;
    /**
     * Server origin. Usually same as `serverHost`.
     */
    serverOrigin: string;
    /**
     * Tenant domain.
     * ex: `wso2.com`
     */
    tenant: string;
    /**
     * Tenant path.
     * ex: `/t/`
     */
    tenantPath: string;
}

/**
 * Portal documentation configs interface.
 */
export interface DocumentationInterface {
    /**
     * Endpoint base URL.
     */
    baseURL: string;
    /**
     * Content base URL.
     */
    contentBaseURL: string;
    /**
     * Github API options.
     */
    githubOptions: GithubDocumentationOptionsInterface;
    /**
     * URL prefix for image assets.
     */
    imagePrefixURL: string;
    /**
     * Content provider.
     */
    provider: DocumentationProviders;
    /**
     * Structure file type.
     */
    structureFileType: DocumentationStructureFileTypes;
    /**
     * Structure file URL.
     */
    structureFileURL: string;
}

/**
 * Github served documentation options interface.
 */
export interface GithubDocumentationOptionsInterface {
    /**
     * Github branch.
     */
    branch: string;
}

/**
 * Product version config interface.
 */
export interface ProductVersionInterface {
    /**
     * Release type.
     */
    releaseType?: "milestone" | "alpha" | "beta" | "rc" | string;
    /**
     * Product version number.
     */
    versionNumber?: string;
    /**
     * Milestone version number.
     */
    milestoneNumber?: string;
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
     * Set of disabled features.
     */
    disabledFeatures?: string[];
}

/**
 * Interface for Scopes related to CRUD permission.
 */
export interface CRUDScopesInterface {
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

/**
 * Interface to extend when scope based access control should be enabled for a component.
 */
export interface SBACInterface<T> {
    /**
     * Feature config.
     */
    featureConfig?: T;
}
