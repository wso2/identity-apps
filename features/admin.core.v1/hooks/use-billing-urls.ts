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

import useGetTenantAssociation from "@wso2is/admin.tenants.v1/api/use-get-tenant-association";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { AppState } from "../store";
import { CommonUtils } from "../utils/common-utils";

/**
 * Billing links of the current tenant. Empty strings when the tenant has no billing portal, which
 * is how consumers decide whether to render the upgrade and billing entry points at all.
 */
export interface BillingURLsInterface {
    billingPortalURL: string;
    upgradeButtonURL: string;
}

const EMPTY_BILLING_URLS: BillingURLsInterface = {
    billingPortalURL: "",
    upgradeButtonURL: ""
};

interface ResolvedBillingURLsInterface {
    domain: string | undefined;
    urls: BillingURLsInterface;
}

const UNRESOLVED_BILLING_URLS: ResolvedBillingURLsInterface = {
    domain: undefined,
    urls: EMPTY_BILLING_URLS
};

/**
 * Resolve the billing portal and upgrade URLs of the current tenant.
 *
 * @param enabled - Whether billing links apply at all. Skips every request when false.
 * @returns The billing URLs, both empty until they resolve or if the tenant has no billing portal.
 */
const useBillingURLs: (_enabled?: boolean) => BillingURLsInterface = (
    enabled: boolean = true
): BillingURLsInterface => {

    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);

    const { data: association } = useGetTenantAssociation(tenantDomain, enabled);

    // Keyed by domain so an organization switch cannot show the previous tenant's links.
    const [ resolved, setResolved ] = useState<ResolvedBillingURLsInterface>(UNRESOLVED_BILLING_URLS);

    useEffect(() => {
        if (!enabled || !tenantDomain || !association) {
            setResolved(UNRESOLVED_BILLING_URLS);

            return;
        }

        let isActive: boolean = true;

        CommonUtils.buildBillingURLs(tenantDomain, [ association ])
            .then((urls: BillingURLsInterface) => {
                if (isActive) {
                    setResolved({ domain: tenantDomain, urls });
                }
            })
            .catch(() => {
                if (isActive) {
                    setResolved(UNRESOLVED_BILLING_URLS);
                }
            });

        return () => {
            isActive = false;
        };
    }, [ enabled, tenantDomain, association ]);

    return enabled && resolved.domain === tenantDomain ? resolved.urls : EMPTY_BILLING_URLS;
};

export default useBillingURLs;
