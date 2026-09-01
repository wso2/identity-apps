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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { IdPShareListResponseInterface } from "../models/identity-provider-sharing";

/**
 * Arguments for the {@link useGetIdpShare} hook.
 */
interface UseGetIdpShareParamsInterface {
    /**
     * ID of the identity provider.
     */
    identityProviderId: string;
    /**
     * Should fetch the data.
     */
    shouldFetch: boolean;
    /**
     * Whether to fetch recursively.
     */
    recursive?: boolean;
    /**
     * Search/filter query.
     */
    filter?: string;
    /**
     * Pagination limit.
     */
    limit?: number;
    /**
     * Pagination after cursor.
     */
    after?: string;
    /**
     * Pagination before cursor.
     */
    before?: string;
    /**
     * Attributes to include in the response.
     */
    attributes?: string;
}

/**
 * Hook to get the list of organizations which the identity provider is shared with.
 *
 * The response mirrors the application share response:
 * - `sharingMode.policy` is present when the identity provider is shared with all organizations.
 * - `organizations` holds the selectively shared organizations (each with its own `sharingMode.policy`).
 *
 * @param params - Request parameters. See {@link UseGetIdpShareParamsInterface}.
 * @returns SWR response object containing the data, error, isValidating, mutate.
 */
const useGetIdpShare = <
    Data = IdPShareListResponseInterface,
    Error = RequestErrorInterface>(
        {
            identityProviderId,
            shouldFetch,
            recursive = true,
            filter,
            limit,
            after,
            before,
            attributes
        }: UseGetIdpShareParamsInterface
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            after,
            attributes,
            before,
            filter,
            limit,
            recursive
        },
        url: `${ store.getState().config.endpoints.identityProviders }/${ identityProviderId }/share`
    };

    const {
        data,
        error,
        isValidating,
        isLoading,
        mutate
    } = useRequest<Data, Error>(shouldFetch ? requestConfig : null, {
        shouldRetryOnError: false
    });

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetIdpShare;
