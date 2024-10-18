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
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { TenantListResponse } from "../models/tenants";

/**
 * Hook to get the list of tenants.
 *
 * This function calls the GET method of the following endpoint to get the list of tenants.
 * - `https://{serverUrl}/t/{tenantDomain}/api/server/v1/tenants`
 * For more details, refer to the documentation:
 * {@link https://is.docs.wso2.com/en/latest/apis/tenant-management-rest-api/#tag/Tenants/operation/retrieveTenants}
 *
 * @param params - Additional parameters for pagination, sorting, and filtering.
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetTenants = <Data = TenantListResponse, Error = RequestErrorInterface>(
    params?: {
        limit?: number;
        offset?: number;
        sortOrder?: "asc" | "desc";
        sortBy?: string;
        filter?: string;
    },
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter: params?.filter,
            limit: params?.limit,
            offset: params?.offset,
            sortBy: params?.sortBy,
            sortOrder: params?.sortOrder
        },
        url: store.getState().config.endpoints.tenants
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        shouldFetch ? requestConfig : null
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetTenants;
