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

import useGetAllLocalClaims from "@wso2is/admin.claims.v1/api/use-get-all-local-claims";
import {
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import useAuthenticationFlowBuilderCore from
    "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import { transformClaimsWithUsername } from "@wso2is/admin.flows.v1/utils/claim-utils";
import { ClaimsGetParams } from "@wso2is/core/models";
import { useMemo } from "react";
import { Attribute } from "../models/attributes";

const params: ClaimsGetParams = {
    "exclude-hidden-claims": true,
    "exclude-identity-claims": true,
    filter: null,
    limit: null,
    offset: null,
    sort: null
};

/**
 * Hook to get the list of supported profile attributes (local claims).
 *
 * This hook uses useGetAllLocalClaims to fetch local claims with specific filters,
 * then transforms the data to ensure the username claim is included and sorts
 * the claims alphabetically by displayName.
 *
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetSupportedProfileAttributes = <Data = Attribute[], Error = RequestErrorInterface>(
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const { metadata } = useAuthenticationFlowBuilderCore();

    const shouldFetchClaims = shouldFetch && !!metadata?.attributeProfile;

    const { data, error, isLoading, isValidating, mutate } = useGetAllLocalClaims<Data, Error>(
        params,
        shouldFetchClaims
    );

    /**
     * Transform the claims to ensure the username claim is always included.
     * Sort the claims by displayName alphabetically.
     */
    const getSortedAttributesWithUsername: Attribute[] = useMemo(() => {
        return transformClaimsWithUsername(data as Attribute[]);
    }, [ data ]);

    return {
        data: getSortedAttributesWithUsername as Data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetSupportedProfileAttributes;
