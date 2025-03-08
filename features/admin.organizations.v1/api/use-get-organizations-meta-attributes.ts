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

import { store } from "@wso2is/admin.core.v1/store";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { HttpMethods } from "@wso2is/core/models";
import { OrganizationsMetaAttributesListInterface } from "../models";

/**
 * Hook to get a list of organizations' meta attributes.
 *
 * @param filter - The filter query.
 * @param limit - The maximum number of meta attributes to return.
 * @param after - The previous range of data to be returned.
 * @param before - The next range of data to be returned.
 * @param recursive - Whether we need to do a recursive search.
 * @param isRoot - Whether the organization is the root
 *
 * @returns Organizations Meta Attributes GET hook.
 */
export const useGetOrganizationsMetaAttributes =
    <Data = OrganizationsMetaAttributesListInterface, Error = RequestErrorInterface>(
        filter?: string,
        limit?: number,
        after?: string,
        before?: string,
        recursive: boolean = false,
        isRoot: boolean = false
    ): RequestResultInterface<Data, Error> => {
        const requestConfig: RequestConfigInterface = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            params: {
                after,
                before,
                filter,
                limit,
                recursive
            },
            url: (isRoot
                ? store.getState().config.endpoints.rootOrganization
                : store.getState().config.endpoints.organizations) + "/organizations/meta-attributes"
        };

        const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
            requestConfig,
            { revalidateIfStale: false }
        );

        return {
            data,
            error,
            isLoading,
            isValidating,
            mutate
        };
    };
