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
import { MoesifPublisherInterface } from "../models/moesif-analytics";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches the Moesif publisher configuration from the IS API.
 *
 * @returns A promise resolving to the Moesif publisher details, or null if not configured (404).
 * @throws IdentityAppsApiException on non-200/404 responses.
 */
export const getMoesifPublisher = async (): Promise<MoesifPublisherInterface | null> => {
    const serverHost: string = store.getState()?.config?.deployment?.serverHost;
    const { moesifPublishers } = getAnalyticsResourceEndpoints(serverHost);

    const response: { data: MoesifPublisherInterface; status: number } = await httpClient({
        headers: {
            "Accept": "application/json"
        },
        method: HttpMethods.GET,
        url: moesifPublishers
    });

    if (response.status === 404) {
        return null;
    }

    if (response.status !== 200) {
        throw new IdentityAppsApiException(
            "Failed to fetch Moesif publisher configuration.",
            null,
            response.status,
            null,
            response,
            null
        );
    }

    return response.data;
};
