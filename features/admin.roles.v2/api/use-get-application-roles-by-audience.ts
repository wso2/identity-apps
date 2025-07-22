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
import { HttpMethods } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import { RoleAudienceTypes } from "../constants/role-constants";
import { RolesV2ResponseInterface } from "../models/roles";

/**
 * Hook to retrieve the list of application roles by audience.
 *
 * @param audience - The audience type (e.g., "APPLICATION", "ORGANIZATION").
 * @param appId - The application ID.
 * @param before - The pagination token for the start of the list.
 * @param after - The pagination token for the end of the list.
 * @param limit - The maximum number of roles to retrieve.
 * @param excludedAttributes - Comma-separated list of attributes to exclude from the response.
 * @param shouldFetch - Flag to determine whether to fetch the data immediately.
 *
 * @returns The object containing the roles list.
 */
const useGetApplicationRolesByAudience = <Data = RolesV2ResponseInterface, Error = RequestErrorInterface>(
    audience: string,
    appId: string,
    searchQuery: string,
    before: string,
    after: string,
    limit: number,
    excludedAttributes?: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    let filter: string = audience === RoleAudienceTypes.APPLICATION
        ? `audience.value eq ${ appId }`
        : `audience.type eq ${ audience.toLowerCase() }`;

    if (!isEmpty(searchQuery)) {
        filter = `${ filter } and ${ searchQuery }`;
    }

    const requestConfig: RequestConfigInterface = {
        method: HttpMethods.GET,
        params: {
            after,
            before,
            excludedAttributes,
            filter,
            limit
        },
        url: `${ store.getState().config.endpoints.rolesV2 }`
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

export default useGetApplicationRolesByAudience;
