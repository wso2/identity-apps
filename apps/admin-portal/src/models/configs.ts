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
interface CRUDPermissionsInterface {
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
 * Common config interface for high level features.
 */
interface FeatureConfigInterface<T = {}> {
    /**
     * CRUD permissions for the feature.
     */
    permissions: CRUDPermissionsInterface;
    /**
     * Sub features.
     */
    subFeatures?: T;
}

/**
 * Sub features in applications feature.
 */
interface ApplicationsSubFeaturesConfigInterface {
    /**
     * Application general settings configuration feature.
     */
    generalSettings: boolean;
    /**
     * Application access configuration feature.
     */
    accessConfiguration: boolean;
    /**
     * Application attribute mapping feature.
     */
    attributeMapping: boolean;
    /**
     * Application sign on methods feature.
     */
    signOnMethodConfiguration: boolean;
    /**
     * Advance settings feature.
     */
    advanceSettings: boolean;
}

/**
 * Application configuration interface.
 */
export interface AppConfigInterface {
    /**
     * Application management feature.
     */
    applications: FeatureConfigInterface<ApplicationsSubFeaturesConfigInterface>;
    /**
     * Claim management feature.
     */
    claims: FeatureConfigInterface;
    /**
     * Identity provider management feature.
     */
    identityProviders: FeatureConfigInterface;
    /**
     * Server configurations feature.
     */
    serverConfigurations: FeatureConfigInterface;
    /**
     * User store configurations feature.
     */
    userStores: FeatureConfigInterface;
    /**
     * User management feature.
     */
    users: FeatureConfigInterface;
    /**
     * Role management feature.
     */
    roles: FeatureConfigInterface;
}
