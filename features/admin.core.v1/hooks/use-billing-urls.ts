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

import type { TenantInfo } from "@wso2is/admin.tenants.v1/models/tenant";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { AppState } from "../store";
import { CommonUtils } from "../utils/common-utils";
import { getTenantAssociation } from "../utils/tenant-association-utils";

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

/**
 * Billing links together with the tenant domain they were built for.
 */
interface ResolvedBillingURLsInterface {
    domain: string;
    urls: BillingURLsInterface;
}

const UNRESOLVED_BILLING_URLS: ResolvedBillingURLsInterface = {
    domain: undefined,
    urls: EMPTY_BILLING_URLS
};

/**
 * In-flight and resolved associations, keyed by tenant domain.
 *
 * Several components ask for the billing links on the same page — the header, the feature locked
 * banner, the free trial banner and the trial expiry wizard. Sharing the promise keeps that to a
 * single walk of `tenant/me` instead of one per consumer.
 */
const tenantAssociationCache: Map<string, Promise<TenantInfo | undefined>> = new Map();

/**
 * Resolve a tenant's association, reusing an in-flight or settled lookup for the same domain.
 *
 * @param tenantDomain - Domain of the tenant to resolve.
 * @param knownAssociation - The association already held in the store, if any.
 * @returns The association, or `undefined` if the user has none for that domain.
 */
const resolveTenantAssociation = (
    tenantDomain: string,
    knownAssociation: TenantInfo
): Promise<TenantInfo | undefined> => {
    // An association from the store costs nothing and is authoritative, so it supersedes whatever
    // is cached — including the `undefined` an earlier failed lookup left behind.
    if (knownAssociation) {
        const known: Promise<TenantInfo> = Promise.resolve(knownAssociation);

        tenantAssociationCache.set(tenantDomain, known);

        return known;
    }

    if (tenantAssociationCache.has(tenantDomain)) {
        return tenantAssociationCache.get(tenantDomain);
    }

    const pending: Promise<TenantInfo | undefined> = getTenantAssociation(tenantDomain)
        .catch(() => {
            // Drop a failed lookup so a later render can try again. A lookup that succeeded and
            // found nothing stays cached: that answer does not change within a session, and
            // retrying it on every render would put the duplicate traffic back.
            tenantAssociationCache.delete(tenantDomain);

            return undefined;
        });

    tenantAssociationCache.set(tenantDomain, pending);

    return pending;
};

/**
 * Resolve the billing portal and upgrade URLs of the current tenant.
 *
 * The tenant association carries the tenant id the URLs are built from, so it has to be in hand
 * before anything can be rendered. `state.auth.tenants` holds it for most users, but it is only
 * ever filled with the first page of the association list, so a user with many tenants can be
 * working in one that is not there. In that case the association is fetched on its own.
 *
 * @param enabled - Whether billing links apply at all. Skips every request when false.
 * @returns The billing URLs, both empty until they resolve or if the tenant has no billing portal.
 */
const useBillingURLs: (_enabled?: boolean) => BillingURLsInterface = (
    enabled: boolean = true
): BillingURLsInterface => {

    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const associatedTenants: TenantInfo[] = useSelector((state: AppState) => state?.auth?.tenants);

    // The domain is kept with the URLs so that an organization switch, which swaps `tenantDomain`
    // under a mounted header, cannot leave the previous tenant's links on screen while the new
    // association is still being resolved.
    const [ resolved, setResolved ] = useState<ResolvedBillingURLsInterface>(UNRESOLVED_BILLING_URLS);

    useEffect(() => {
        if (!enabled || !tenantDomain) {
            setResolved(UNRESOLVED_BILLING_URLS);

            return;
        }

        let isActive: boolean = true;

        const knownAssociation: TenantInfo = Array.isArray(associatedTenants)
            ? associatedTenants.find((tenant: TenantInfo) => tenant?.domain === tenantDomain)
            : undefined;

        resolveTenantAssociation(tenantDomain, knownAssociation)
            .then((association: TenantInfo | undefined) =>
                CommonUtils.buildBillingURLs(tenantDomain, association ? [ association ] : [])
            )
            .then((urls: BillingURLsInterface) => {
                if (isActive) {
                    setResolved({ domain: tenantDomain, urls });
                }
            });

        return () => {
            isActive = false;
        };
    }, [ enabled, tenantDomain, associatedTenants ]);

    return enabled && resolved.domain === tenantDomain ? resolved.urls : EMPTY_BILLING_URLS;
};

export default useBillingURLs;
