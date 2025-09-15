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

import { AppState } from "@wso2is/admin.core.v1/store";
import { useSelector } from "react-redux";
import { Tenant } from "../models/tenants";

/**
 * Hook to generate the console URL for a given tenant.
 *
 * This hook generates the console URL for a specified tenant by replacing the
 * tenant domain in the client host URL. It uses the `clientHost` value from
 * the Redux store and replaces the existing tenant domain with the provided
 * tenant's domain.
 *
 * @param tenant - The tenant object containing the domain to be used in the URL.
 * @returns The console URL for the specified tenant, or `undefined` if the tenant domain is not provided.
 *
 * @example
 * ```tsx
 * const tenant: Tenant = { domain: "example.com" };
 * const consoleURL = useTenantConsoleURL(tenant);
 * console.log(consoleURL); // Outputs the console URL for the specified tenant
 * ```
 */
const useTenantConsoleURL = (tenant: Tenant): string | undefined => {
    const clientHost: string = useSelector((state: AppState) => state.config?.deployment?.clientHost);
    const tenantPrefix: string = useSelector((state: AppState) => state.config?.deployment?.tenantPrefix);

    if (!tenant?.domain) {
        return undefined;
    }

    return clientHost.replace(new RegExp(`/${tenantPrefix}/[^/]+/`), `/${tenantPrefix}/${tenant.domain}/`);
};

export default useTenantConsoleURL;
