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

import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { Claim } from "@wso2is/core/models";

/**
 * Transforms the claims to ensure the username claim is always included.
 * Sorts the claims by displayName alphabetically.
 *
 * @param claims - Array of claims to transform.
 * @returns Transformed and sorted array of claims with username claim included.
 */

const transformClaimsWithUsername = (claims: Claim[] | undefined): Claim[] => {

    if (!claims) {
        return [];
    }

    const usernameExists: boolean = claims.some(
        ((claim: Claim) => claim.claimURI === ClaimManagementConstants.USER_NAME_CLAIM_URI));

    let allClaims: Claim[];

    if (usernameExists) {
        allClaims = [ ...claims ];
    } else {
        allClaims = [
            {
                claimURI: ClaimManagementConstants.USER_NAME_CLAIM_URI,
                displayName: "Username"
            },
            ...claims
        ] as Claim[];
    }

    return allClaims.sort((a: Claim, b: Claim) => {
        const displayNameA: string = a?.displayName?.toLowerCase() ?? "";
        const displayNameB: string = b?.displayName?.toLowerCase() ?? "";

        return displayNameA.localeCompare(displayNameB);
    });
};

export { transformClaimsWithUsername };
