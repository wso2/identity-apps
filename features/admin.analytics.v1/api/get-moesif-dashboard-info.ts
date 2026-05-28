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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { getAnalyticsResourceEndpoints } from "../configs/endpoints";
import { MoesifDashboardInfoInterface } from "../models/moesif-analytics";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches Moesif dashboard info — token, org ID and app ID — from the IS server.
 *
 * @returns A promise resolving to { token, moesifOrgId, moesifAppId }.
 * @throws IdentityAppsApiException on non-200 responses.
 */
export const getMoesifDashboardInfo = async (): Promise<MoesifDashboardInfoInterface> => {

    const tenantDomain: string = store.getState()?.auth?.tenantDomain ?? "";

    const moesifDashboardInfo: string = `${ store.getState().config.endpoints.tenantMoesifDashboardInfo }`;

    const response: { data: MoesifDashboardInfoInterface; status: number } = await httpClient({
        headers: {
            "Accept": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ moesifDashboardInfo }?domain=${ tenantDomain }`
    });

    if (response.status !== 200) {
        throw new IdentityAppsApiException(
            "Failed to fetch Moesif dashboard info.",
            null,
            response.status,
            null,
            response,
            null
        );
    }

    return response.data;
};
