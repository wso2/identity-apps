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
import { MoesifPublisherInterface, MoesifPublisherUpdateRequest } from "../models/moesif-analytics";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Updates the Moesif publisher configuration (API key + event publisher enablement flags).
 * Uses PATCH semantics — only the fields supplied in the request are updated; the API key
 * can be omitted to leave the existing value unchanged.
 *
 * @param request - The publisher configuration fields to update.
 * @returns A promise resolving to the updated publisher.
 * @throws IdentityAppsApiException on non-200 responses.
 */
export const updateMoesifPublisher = async (
    request: MoesifPublisherUpdateRequest
): Promise<MoesifPublisherInterface> => {
    const serverHost: string = store.getState()?.config?.deployment?.serverHost;
    const { moesifPublishers } = getAnalyticsResourceEndpoints(serverHost);

    const response: { data: MoesifPublisherInterface; status: number } = await httpClient({
        data: request,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: moesifPublishers
    });

    if (response.status !== 200) {
        throw new IdentityAppsApiException(
            "Failed to update Moesif publisher configuration.",
            null,
            response.status,
            null,
            response,
            null
        );
    }

    return response.data;
};
