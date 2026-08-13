/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Interface to represent permission scopes.
 */
export interface PermissionScopeInterface {
    /**
     * Name of the permission.
     */
    value: string;
}


/**
 * Interface to represent selected permissions.
 */
export interface SelectedPermissionsInterface {
    /**
     * Set of tenant level permissions.
     */
    tenant: {
        [key: string]: SelectedPermissionCategoryInterface;
    };
    /**
     * Set of system level permissions.
     */
    organization: {
        [key: string]: SelectedPermissionCategoryInterface;
    };
}

/**
 * Interface to represent selected permission category.
 *
 * In the legacy (non-granular) mode only `read`, `write`, and `permissions` are populated.
 * In the granular mode `write` is always `false` and the individual `create`, `update`,
 * and `delete` flags are used instead.
 */
export interface SelectedPermissionCategoryInterface {
    /**
     * Indicates that the read permission level is selected.
     */
    read: boolean;
    /**
     * Indicates that the write permission level is selected.
     */
    write: boolean;
    /**
     * Indicates that the create permission level is selected.
     */
    create?: boolean;
    /**
     * Indicates that the update permission level is selected.
     */
    update?: boolean;
    /**
     * Indicates that the delete permission level is selected.
     */
    delete?: boolean;
    /**
     * Flat list of permission scope values that are currently active for this collection.
     */
    permissions: PermissionScopeInterface[];
}
