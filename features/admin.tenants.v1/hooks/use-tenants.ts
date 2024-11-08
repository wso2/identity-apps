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

import { useContext } from "react";
import TenantContext, { TenantContextProps } from "../context/tenant-context";

/**
 * Props interface of {@link useTenants}
 */
export type useTenantsInterface = TenantContextProps;

/**
 * Hook that provides access to the Tenant context.
 *
 * This hook allows components to access tenant-related data and functions
 * provided by the {@link TenantProvider}. It returns an object containing
 * the context values defined in {@link TenantContext}.
 *
 * @returns An object containing the context values of {@link TenantContext}.
 *
 * @throws Will throw an error if the hook is used outside of a TenantProvider.
 *
 * @example
 * ```tsx
 * const { isTenantListLoading, mutateTenantList, setTenantListLimit, tenantList } = useTenants();
 *
 * useEffect(() => {
 *     // Fetch tenants or perform other tenant-related operations
 * }, []);
 * ```
 */
const useTenants = (): useTenantsInterface => {
    const context: TenantContextProps = useContext(TenantContext);

    if (context === undefined) {
        throw new Error("useTenants must be used within a TenantProvider");
    }

    return context;
};

export default useTenants;
