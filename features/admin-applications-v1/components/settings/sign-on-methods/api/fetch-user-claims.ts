import { useState } from "react";
import { Claim, ClaimsGetParams } from "@wso2is/core/models";
import { getAllLocalClaims } from "../../../../../admin-claims-v1/api";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { ClaimURIs } from '../models/claim-uris';

const fetchUserClaims = (): Promise<{ claimURIs: ClaimURIs[]; error: IdentityAppsApiException }> => {

    return new Promise((resolve, reject) => {
        // Set params
        const params: ClaimsGetParams = {
            "exclude-identity-claims": false,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };

        getAllLocalClaims(params)
            .then((response: Claim[]) => {

                // extract the claim URIs from the response.
                const claimURIs = response.map((claim: Claim) => ({
                    description: claim.description,
                    claimURI: claim.claimURI
                }));

                resolve({ claimURIs, error: null });
            })
            .catch((error: IdentityAppsApiException) => {
                reject({ claimURIs: null, error });
            });
    });
};

export default fetchUserClaims;
