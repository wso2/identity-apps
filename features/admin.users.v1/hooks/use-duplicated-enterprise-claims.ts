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

import { getAllExternalClaims } from "@wso2is/admin.claims.v1/api/claims";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { ExternalClaim } from "@wso2is/core/models";
import { useEffect, useState } from "react";

/**
 * Interface for the return type of the `useDuplicatedEnterpriseClaims` hook.
 */
export interface UseDuplicatedEnterpriseClaimsInterface {
    /**
     * Enterprise schema claims that map to a local claim already exposed by the core User or System schema.
     */
    duplicatedClaims: ExternalClaim[];
    /**
     * Error thrown while fetching the claims, if any.
     */
    error: unknown;
    /**
     * Whether the claims are still being fetched.
     */
    isLoading: boolean;
}

/**
 * Hook that identifies Enterprise schema claims that are mapped to the same local claim as a claim in the
 * SCIM2 core User schema or the WSO2 System schema.
 *
 * These dual mappings occur only in migrated environments. Migrated tenants can keep Enterprise schema claims
 * that are exposed by the System schema after the SCIM2 schema restructuring introduced in
 * https://github.com/wso2/product-is/issues/20850 (e.g. `country`), or that are already exposed by the core
 * User schema (e.g. `firstName` mapped to `http://wso2.org/claims/givenname`, which is `name.givenName`).
 * Such Enterprise attributes duplicate the canonical attribute, so consumers should exclude them from the UI.
 *
 * If the claims cannot be fetched, an empty list is returned so that consumers fall back to their default behavior.
 *
 * @returns An object containing the duplicated Enterprise claims, the fetch error and the loading state.
 */
const useDuplicatedEnterpriseClaims = (): UseDuplicatedEnterpriseClaimsInterface => {
    const [ duplicatedClaims, setDuplicatedClaims ] = useState<ExternalClaim[]>([]);
    const [ error, setError ] = useState<unknown>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        let isMounted: boolean = true;

        const calculateDuplicatedClaims = async (): Promise<void> => {
            try {
                const [ enterpriseClaims, coreUserClaims, systemClaims ]: ExternalClaim[][] = await Promise.all([
                    getAllExternalClaims(
                        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_EXT_ENT_USER"),
                        null
                    ),
                    getAllExternalClaims(
                        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_CORE_USER"),
                        null
                    ),
                    getAllExternalClaims(
                        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_EXT_SYSTEM"),
                        null
                    )
                ]);

                const canonicalMappedClaimURIs: Set<string> = new Set(
                    [ ...coreUserClaims, ...systemClaims ]
                        .map((claim: ExternalClaim) => claim?.mappedLocalClaimURI)
                        .filter(Boolean)
                );

                const duplicates: ExternalClaim[] = enterpriseClaims.filter(
                    (claim: ExternalClaim) =>
                        claim?.mappedLocalClaimURI && canonicalMappedClaimURIs.has(claim.mappedLocalClaimURI)
                );

                if (isMounted) {
                    setDuplicatedClaims(duplicates);
                }
            } catch (fetchError) {
                // Fall back to the default behavior of the consumers when the claims cannot be fetched.
                if (isMounted) {
                    setDuplicatedClaims([]);
                    setError(fetchError);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        calculateDuplicatedClaims();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        duplicatedClaims,
        error,
        isLoading
    };
};

export default useDuplicatedEnterpriseClaims;
