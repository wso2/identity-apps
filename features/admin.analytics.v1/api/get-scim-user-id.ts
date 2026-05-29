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

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches the current user's SCIM2 UUID from the /scim2/Me endpoint.
 *
 * @returns The SCIM2 user UUID string.
 */
export const getScimUserId = async (): Promise<string> => {
    const meEndpoint: string = store.getState()?.config?.endpoints?.me;

    if (!meEndpoint) {
        return "";
    }

    const response: { data: { id?: string } } = await httpClient({
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.GET,
        url: meEndpoint
    });

    return response?.data?.id ?? "";
};
