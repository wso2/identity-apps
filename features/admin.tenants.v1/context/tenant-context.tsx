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

import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { Context, Dispatch, createContext } from "react";
import { Tenant, TenantListResponse } from "../models/tenants";

/**
 * Props interface of {@link TenantContext}
 */
export interface TenantContextProps {
    /**
     * Trigger a delete action on a tenant.
     * @param tenant - Tenant to be deleted.
     */
    deleteTenant: (tenant: Tenant) => void;
    /**
     * Trigger a disable action on a tenant.
     * @param tenant - Tenant to be disabled.
     */
    disableTenant: (tenant: Tenant) => void;
    /**
     * Trigger a enable action on a tenant.
     * @param tenant - Tenant to be enabled.
     */
    enableTenant: (tenant: Tenant) => void;
    /**
     * Flag to indicate if the initial rendering is complete.
     */
    isInitialRenderingComplete: boolean;
    /**
     * Flag to indicate if the tenant list is loading.
     */
    isTenantListLoading: boolean;
    /**
     * Function to mutate the tenant list.
     */
    mutateTenantList: () => void;
    /**
     * Navigate to the tenant console.
     * @param tenant  - Tenant to navigate to.
     */
    navigateToTenantConsole: (tenant: Tenant) => void;
    /**
     * The search query.
     */
    searchQuery: string;
    /**
     * Trigger to clear the search query.
     */
    searchQueryClearTrigger: boolean;
    /**
     * Sets the search query from outside.
     */
    setSearchQuery: Dispatch<any>;
    /**
     * Sets the search query clear trigger from outside.
     */
    setSearchQueryClearTrigger: Dispatch<any>;
    /**
     * Set tenant list limit from outside.
     */
    setTenantListLimit: Dispatch<any>;
    /**
     * Tenant list response.
     */
    tenantList: TenantListResponse;
    /**
     * Tenant list limit.
     */
    tenantListLimit: number;
}

/**
 * Context object for managing the Tenant context.
 */
const TenantContext: Context<TenantContextProps> = createContext<null | TenantContextProps>({
    deleteTenant: () => null,
    disableTenant: () => null,
    enableTenant: () => null,
    isInitialRenderingComplete: false,
    isTenantListLoading: false,
    mutateTenantList: () => null,
    navigateToTenantConsole: () => null,
    searchQuery: "",
    searchQueryClearTrigger: false,
    setSearchQuery: () => null,
    setSearchQueryClearTrigger: () => null,
    setTenantListLimit: () => null,
    tenantList: null,
    tenantListLimit: UIConstants.DEFAULT_RESOURCE_GRID_ITEM_LIMIT
});

TenantContext.displayName = "TenantContext";

export default TenantContext;
