/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import useRequest, { 
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface,
    SWRConfig 
} from "../../../../features/core/hooks/use-request";
import { store } from "../../../../features/core/store";
import { OrganizationInterface } from "../../users/models/organization";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().
    httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to get enterprise login enable config.
 *
 * @param organization - Organization name.
 * @param revalidateIfStale - Revalidate if stale.
 *
 * @returns the organization config.
 */
export const useOrganizationConfig =
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
            url: store.getState().config.endpoints.organizationEndpoint.replace("{organization}", organization)
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

/**
 * Hook to update enterprise login enable config.
 *
 * @param isEnterpriseLoginEnabled - Enterpriselogin is enabled/disabled.
 * 
 * @returns a promise containing the response.
 */
export const updateOrganizationConfig = (isEnterpriseLoginEnabled: OrganizationInterface): Promise<any> => {
    
    const requestConfig: AxiosRequestConfig = {
        data: isEnterpriseLoginEnabled,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.organizationPatchEndpoint
    };

    return httpClient(requestConfig).then((response: AxiosResponse) => {
        return Promise.resolve(response);
    }).catch((error: AxiosError) => {
        return Promise.reject(error);
    });
};
