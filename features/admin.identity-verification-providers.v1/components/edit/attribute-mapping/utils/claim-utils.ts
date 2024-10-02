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

import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, Claim } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { IdVPLocalClaimInterface } from "../../../../models/identity-verification-providers";

/**
 * Given a local claim it will test whether it contains `identity` in the claim attribute.
 *
 * @param claim - Local claim.
 * @returns Whether the claim is an identity claim.
 */
const isLocalIdentityClaim = (claim: string): boolean => {
    return /identity/.test(claim);
};

/**
 * Extracts the local claims from the response.
 *
 * @param response - Response from the get all local claims call.
 * @param hideIdentityClaimAttributes - Whether to hide identity claim attributes.
 * @returns Array of extracted local claims
 */
const extractLocalClaimsFromResponse = (
    response: Claim[],
    hideIdentityClaimAttributes: boolean
): IdVPLocalClaimInterface[] => {
    return response
        ?.filter((claim: Claim) => {
            return hideIdentityClaimAttributes ? !isLocalIdentityClaim(claim.claimURI) : true;
        })
        ?.map((claim: Claim) => {
            return {
                displayName: claim.displayName,
                id: claim.id,
                uri: claim.claimURI
            } as IdVPLocalClaimInterface;
        });
};

/**
 * Fetches all the local claims.
 *
 * @param hideIdentityClaimAttributes - Whether to hide identity claim attributes.
 * @param setAvailableLocalClaims - Setter for the available local claims.
 * @param setIsLocalClaimsLoading - Setter for the local claims loading state.
 * @returns void
 */
export const fetchAllLocalClaims = (
    hideIdentityClaimAttributes: boolean,
    setAvailableLocalClaims: (arg: IdVPLocalClaimInterface[]) => void,
    setIsLocalClaimsLoading: (boolean) => void
): void => {

    setIsLocalClaimsLoading(true);
    getAllLocalClaims(null)
        .then((response: Claim[]) => {
            const localClaims: IdVPLocalClaimInterface[] = extractLocalClaimsFromResponse(response,
                hideIdentityClaimAttributes);

            setAvailableLocalClaims(localClaims);
        })
        .catch((error: IdentityAppsApiException) => {
            store.dispatch(addAlert({
                description: error?.response?.data?.description
                    ?? I18n.instance.t("idvp:notifications.getAllLocalClaims.genericError.description"
                    ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("idvp:notifications.getAllLocalClaims.genericError.message")
            }));
        })
        .finally(() => {
            setIsLocalClaimsLoading(false);
        });
};
