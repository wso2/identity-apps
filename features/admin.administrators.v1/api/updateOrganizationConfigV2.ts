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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { OrganizationInterface } from "../models/organization";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().
    httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to update enterprise login enable config.
 *
 * @param isEnterpriseLoginEnabled - Enterpriselogin is enabled/disabled.
 *
 * @returns a promise containing the response.
 */
export const updateOrganizationConfigV2 = (isEnterpriseLoginEnabled: OrganizationInterface):
    Promise<OrganizationInterface> => {

    const requestConfig: AxiosRequestConfig = {
        data: isEnterpriseLoginEnabled,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.organizationPatchEndpointV2
    };

    return httpClient(requestConfig).then((response: AxiosResponse) => {
        return Promise.resolve(response.data);
    }).catch((error: AxiosError) => {
        return Promise.reject(error);
    });
};
