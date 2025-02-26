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
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { Payload } from "@wso2is/admin.flow-builder-core.v1/models/api";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import RegistrationFlowBuilderConstants from "../constants/registration-flow-builder-constants";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Add a new tenant.
 *
 * This function calls the POST method of the following endpoint to update the tenant status.
 *  - `https://{serverUrl}/t/{tenantDomain}/api/server/v1/tenants`
 * - TODO: Fill this
 * For more details, refer to the documentation:
 * {@link https://TODO:<fillthis>)}
 *
 * @param payload - Request payload.
 * @returns A promise that resolves when the operation is complete.
 * @throws Error - Throws an error if the operation fails.
 */
const configureRegistrationFlow = (payload: Payload): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        data: payload,
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.registrationFlow
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    RegistrationFlowBuilderConstants.FLOW_CONFIG_INVALID_STATUS_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                RegistrationFlowBuilderConstants.FLOW_CONFIG_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export default configureRegistrationFlow;
