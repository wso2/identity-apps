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

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Deletes the Moesif publisher configuration, disabling all event publishing
 * and clearing governance configs.
 *
 * @returns A promise that resolves when the delete is successful.
 * @throws IdentityAppsApiException on non-204 responses.
 */
export const deleteMoesifPublisher = async (): Promise<void> => {
    const serverHost: string = store.getState()?.config?.deployment?.serverHost;
    const { moesifPublishers } = getAnalyticsResourceEndpoints(serverHost);

    const response: { status: number } = await httpClient({
        headers: {
            "Accept": "application/json"
        },
        method: HttpMethods.DELETE,
        url: moesifPublishers
    });

    if (response.status !== 204) {
        throw new IdentityAppsApiException(
            "Failed to delete Moesif publisher configuration.",
            null,
            response.status,
            null,
            response,
            null
        );
    }
};
