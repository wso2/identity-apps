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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { UserListInterface } from "@wso2is/admin.users.v1/models/user";
import { HttpMethods } from "@wso2is/core/models";

/**
 * Hook to get the users list with limit and offset.
 *
 * @param count - The number of users to be returned.
 * @param startIndex - The index of the first user to be returned.
 * @param filter - The filter to be applied to the users.
 * @param attributes - The attributes to be returned.
 * @returns `RequestResultInterface<Data, Error>`
 */
export const useGetAgents = (
    count: number,
    startIndex: number,
    filter: string,
    attributes: string,
    shouldFetch: boolean = true
): RequestResultInterface<UserListInterface, RequestErrorInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            attributes,
            count,
            excludedAttributes: "roles,groups",
            filter,
            startIndex
        },
        url: store.getState().config.endpoints.agents
    };

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    } = useRequest<UserListInterface, RequestErrorInterface>(shouldFetch ? requestConfig : null);

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate: mutate
    };
};
