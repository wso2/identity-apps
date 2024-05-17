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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { Claim, ClaimsGetParams } from "@wso2is/core/models";
import { useEffect, useState } from "react";
import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { ClaimURI } from "../models/claim-uri";

const useUserClaims = (): {
    claimURI: ClaimURI[] | null;
    error: IdentityAppsApiException | null;
} => {
    const [ claims, setClaims ] = useState<{ claimURI: ClaimURI[] | null, error: IdentityAppsApiException | null }>({
        claimURI: null,
        error: null
    });

    useEffect(() => {
        const params: ClaimsGetParams = {
            "exclude-identity-claims": false,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };

        getAllLocalClaims(params)
            .then((response: Claim[]) => {
                const claimURI: {
                    claimURI: string;
                    description: string;
                }[] = response.map((claim: Claim) => ({
                    claimURI: claim.claimURI,
                    description: claim.description
                }));

                setClaims({ claimURI, error: null });
            })
            .catch((error: IdentityAppsApiException) => {
                setClaims({ claimURI: null, error });
            });
    }, []);

    return claims;
};

export default useUserClaims;
