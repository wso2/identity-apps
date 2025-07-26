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
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import useAuthenticationFlowBuilderCore from
    "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import { HttpMethods } from "@wso2is/core/models";
import { useMemo } from "react";
import { Attribute } from "../models/attributes";

/**
 * Hook to get the list of tenants.
 *
 * This function calls the GET method of the following endpoint to get the list of tenants.
 * - `https://{serverUrl}/t/{tenantDomain}/api/server/v1/tenants`
 * For more details, refer to the documentation:
 * {@link https://is.docs.wso2.com/en/latest/apis/tenant-management-rest-api/#tag/Tenants/operation/retrieveTenants}
 *
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetSupportedProfileAttributes = <Data = Attribute[], Error = RequestErrorInterface>(
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const { metadata } = useAuthenticationFlowBuilderCore();

    const requestConfig: RequestConfigInterface = useMemo(() => {
        if (!metadata?.attributeProfile) {
            return null;
        }

        return {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            params: {
                "exclude-hidden-claims": true,
                "exclude-identity-claims": true,
                filter: null,
                limit: null,
                offset: null,
                profile: metadata?.attributeProfile,
                sort: null
            },
            url: store.getState().config.endpoints.localClaims
        };
    }, [ metadata?.attributeProfile ]);

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        shouldFetch ? requestConfig : null
    );

    /**
     * Transform the claims to ensure the username claim is always included.
     */
    const supportedAttributes: Attribute[] = useMemo(() => {
        const claims: Attribute[] = data as Attribute[];

        if (!claims) {
            return [];
        }

        const usernameExists: boolean = claims.some(
            ((attribute: Attribute) => attribute.claimURI === ClaimManagementConstants.USER_NAME_CLAIM_URI));

        if (usernameExists) {
            return claims;
        }

        return [
            {
                claimURI: ClaimManagementConstants.USER_NAME_CLAIM_URI,
                displayName: "Username"
            },
            ...claims
        ] as Attribute[];
    }, [ data ]);

    return {
        data: supportedAttributes as Data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetSupportedProfileAttributes;
