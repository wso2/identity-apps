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

/**
 * CRUD permissions interface.
 */
export interface CRUDPermissionsInterface {
    /**
     * Create permission.
     */
    create: boolean;
    /**
     * Read permission.
     */
    read: boolean;
    /**
     * Update permission.
     */
    update: boolean;
    /**
     * Delete permission.
     */
    delete: boolean;
}

/**
 * Common config interface for features.
 */
export interface FeatureConfigInterface<T = {}> {
    /**
     * If the feature is enabled or not.
     */
    enabled: boolean;
    /**
     * CRUD permissions for the feature.
     */
    permissions?: CRUDPermissionsInterface;
    /**
     * Sub features.
     */
    features?: T;
}

/**
 * Common config interface for deployment settings.
 */
export interface CommonDeploymentConfigInterface {
    /**
     * Base name of the application (tenant qualified).
     * ex: `/t/wos2.com/admin-portal`
     */
    appBaseName: string;
    /**
     * Base name without tenant.
     * ex: `/admin-portal`
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
     * Debug mode toggle.
     */
    debug: boolean;
    /**
     * Callback to directed on successful login.
     * ex: `/admin-portal/login`
     */
    loginCallbackUrl: string;
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
