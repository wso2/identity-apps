/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { TenantInfo } from "../tenant";

/**
 * Interface for tenant list.
 */
export interface TenantListInterface {
    /**
     * Associated tenants of the current user.
     */
    associatedTenants?: TenantInfo | TenantInfo[];
    /**
     * Default tenant of the current user.
     */
    defaultTenant?: TenantInfo;
}

/**
 * Interface for tenant associations.
 */
export interface TenantAssociationsInterface extends TenantListInterface {
    /**
     * Username of the current user.
     */
    username: string;
    /**
     * Current tenant of the current user.
     */
    currentTenant?: TenantInfo;
    /**
     * Indicates whether the current user is a privileged user.
     */
    isPrivilegedUser?: boolean;
    /**
     * Full name of the current user.
     */
    fullName?: string;
}
