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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import { HttpMethods, RoleListInterface } from "@wso2is/core/models";
import { useSelector } from "react-redux";

/**
 * Hook to retrieve the list of roles.
 *
 * @param count - Number of records to fetch.
 * @param startIndex - Index of the first record to fetch.
 * @param filter - Search filter.
 * @param excludedAttributes - Attributes to exclude from the response.
 * @param shouldFetch - Should fetch the data.
 *
 * @returns The object containing the roles list.
 */
const useGetRolesList = <Data = RoleListInterface, Error = RequestErrorInterface>(
    count?: number,
    startIndex?: number,
    filter?: string,
    excludedAttributes?: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const rolesEndpoint: string = userRolesV3FeatureEnabled
        ? store.getState().config.endpoints.rolesV3
        : store.getState().config.endpoints.rolesV2;

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            count,
            excludedAttributes,
            filter,
            startIndex
        },
        url: rolesEndpoint
    };

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
        response
    } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
        response
    };
};

export default useGetRolesList;
