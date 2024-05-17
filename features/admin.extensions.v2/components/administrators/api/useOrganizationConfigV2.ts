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

import { HttpMethods } from "@wso2is/core/models";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface,
    SWRConfig
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { OrganizationInterface } from "@wso2is/admin.extensions.v1/components/administrators/models";

/**
 * Hook to get enterprise login enable config.
 *
 * @param organization - Organization name.
 * @param revalidateIfStale - Revalidate if stale.
 *
 * @returns the organization config.
 */
export const useOrganizationConfigV2 =
    <Data = OrganizationInterface, Error = RequestErrorInterface>
    (
        organization: string, requestOptions: SWRConfig<Data, Error>,
        shouldFetch: boolean = true
    ) : RequestResultInterface<Data, Error> => {
        const requestConfig: RequestConfigInterface = {
            headers: {
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url: store.getState().config.endpoints.organizationEndpointV2.replace("{organization}", organization)
        };

        const { data, error, isValidating, mutate } = useRequest<Data, Error>(
            shouldFetch ? requestConfig : null, requestOptions);

        return {
            data,
            error: error,
            isLoading: !error && !data,
            isValidating,
            mutate: mutate
        };
    };
