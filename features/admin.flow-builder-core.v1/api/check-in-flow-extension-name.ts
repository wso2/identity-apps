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
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosResponse } from "axios";
import { FlowExtensionNameCheckResponseInterface } from "../models/flow-extension";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Check if an Flow Extension name is available.
 *
 * @param name - The name to check.
 * @param excludeId - Optional extension ID to exclude (for rename uniqueness checks).
 * @returns Promise resolving to the name availability response.
 */
const checkFlowExtensionName = (
    name: string,
    excludeId?: string
): Promise<FlowExtensionNameCheckResponseInterface> => {

    const requestConfig: RequestConfigInterface = {
        data: { name, ...(excludeId && { excludeId }) },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.flowExtension }/check-name`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) =>
            Promise.resolve(response.data as FlowExtensionNameCheckResponseInterface)
        );
};

export default checkFlowExtensionName;
