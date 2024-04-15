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
    isLegacyRuntimeEnabled: boolean;
    organizationType: string;
}
