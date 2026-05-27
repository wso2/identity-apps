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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpErrorResponseDataInterface, HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import {
    FlowExtensionResponseInterface,
    FlowExtensionUpdateRequestInterface
} from "../models/flow-extension";
import { serializeAccessConfig } from "../utils/access-config-path";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Update an Flow Extension by ID via the flow management API.
 *
 * @param extensionId - ID of the Flow Extension to update.
 * @param body - Update request body (all fields optional).
 * @returns Promise resolving to the updated Flow Extension.
 */
const updateFlowExtension = (
    extensionId: string,
    body: FlowExtensionUpdateRequestInterface
): Promise<FlowExtensionResponseInterface> => {

    const payload: FlowExtensionUpdateRequestInterface = {
        ...body,
        ...(body.accessConfig !== undefined && { accessConfig: serializeAccessConfig(body.accessConfig) })
    };

    const requestConfig: RequestConfigInterface = {
        data: payload,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.flowExtension }/${ extensionId }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    "Invalid status code received when updating Flow Extension.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return Promise.resolve(response.data as FlowExtensionResponseInterface);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export default updateFlowExtension;
