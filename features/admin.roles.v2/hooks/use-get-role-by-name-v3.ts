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
import { RolesV2ResponseInterface } from "../models/roles";

export const useGetRoleByNameV3 = <Data = RolesV2ResponseInterface, Error = RequestErrorInterface>(
    audienceId: string,
    roleName: string,
    before: string,
    after: string,
    limit: number,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const filter: string = `audience.value eq ${ audienceId } and displayName eq ${ roleName }`;

    const requestConfig: RequestConfigInterface = {
        method: HttpMethods.GET,
        params: {
            after,
            before,
            filter,
            limit
        },
        url: store.getState().config.endpoints.rolesV3
    };

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
        response
    } = useRequest<Data, Error>(
        (audienceId && roleName && shouldFetch) ? requestConfig : null
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
        response
    };
};

export default useGetRoleByNameV3;
