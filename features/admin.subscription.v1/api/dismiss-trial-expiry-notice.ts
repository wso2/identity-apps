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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { TrialExpiryNoticeDismissalRequestInterface } from "../models/trial-expiry";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Records that the post trial expiry notice has been dismissed for the current tenant. The
 * dismissal is tracked per organization, so the notice is hidden for every administrator once
 * any one of them dismisses it.
 *
 * @param trialId - Id of the trial the notice is about.
 * @returns Promise resolving with the API response.
 */
export const dismissTrialExpiryNotice = (trialId: number): Promise<AxiosResponse> => {
    const tenantDomain: string = store.getState().auth.tenantDomain;
    const data: TrialExpiryNoticeDismissalRequestInterface = { trialId };

    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${store.getState().config.endpoints.tenantManagementApi}`
            + `/${tenantDomain}/trial/expiry-notice/dismiss?domain=${tenantDomain}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error: unknown) => {
            return Promise.reject(error);
        });
};
