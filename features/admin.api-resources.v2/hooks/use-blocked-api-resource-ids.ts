/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { APIResourceBlockEntryInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * Hook that resolves the set of API resource IDs that are blocked for the current tenant.
 *
 * A resource is blocked when its ID is configured under
 * `apiResourceManagement.blockedAPIResources` and the current tenant is NOT listed in that
 * entry's `allowed_tenants`. Entries with an empty/omitted `allowed_tenants` block all tenants.
 *
 * @returns Set of blocked API resource IDs for the current tenant.
 */
const useBlockedAPIResourceIds = (): Set<string> => {

    const blockedAPIResourceEntries: APIResourceBlockEntryInterface[] = useSelector(
        (state: AppState) => state?.config?.ui?.apiResourceManagement?.blockedAPIResources
    );
    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);

    return useMemo(() => {
        const ids: Set<string> = new Set<string>();

        blockedAPIResourceEntries?.forEach((entry: APIResourceBlockEntryInterface) => {
            if (!entry?.api_id) {
                return;
            }
            if (entry.allowed_tenants?.includes(tenantDomain)) {
                return;
            }
            ids.add(entry.api_id);
        });

        return ids;
    }, [ blockedAPIResourceEntries, tenantDomain ]);
};

export default useBlockedAPIResourceIds;
