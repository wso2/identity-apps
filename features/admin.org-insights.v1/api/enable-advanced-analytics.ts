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

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Enable Moesif (advanced) analytics for the current organisation.
 *
 * <p>Unlike the publisher enablement APIs (which call Identity Server directly), this calls the
 * user-management tenant API, which resolves the org's subscription tier and enables the appropriate
 * set of publishers (login/registration/token only on limited tiers, all publishers on higher tiers).</p>
 *
 * @returns A promise that resolves when analytics has been enabled.
 * @throws IdentityAppsApiException on non-2xx responses.
 */
export const enableAdvancedAnalytics = async (): Promise<void> => {

    const tenantDomain: string = store.getState()?.auth?.tenantDomain ?? "";

    // The user-mgt tenant API exposes /moesif/analytics alongside the already-configured
    // /moesif/dashboard-info endpoint; derive it from the latter to share the same base.
    const dashboardInfoEndpoint: string = `${ store.getState().config.endpoints.tenantMoesifDashboardInfo }`;
    const enableAnalyticsEndpoint: string = dashboardInfoEndpoint.replace("/dashboard-info", "/analytics");

    const response: { status: number } = await httpClient({
        headers: {
            "Accept": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ enableAnalyticsEndpoint }?domain=${ tenantDomain }`
    });

    if (response.status !== 200) {
        throw new IdentityAppsApiException(
            "Failed to enable Moesif advanced analytics.",
            null,
            response.status,
            null,
            response,
            null
        );
    }
};
