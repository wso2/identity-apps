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
import DeviceRegistrationFlowBuilderConstants from "../constants/device-registration-flow-builder-constants";
import { DeviceRegistrationFlowPayloadInterface } from "../models/flow";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Updates the device registration flow configuration via an HTTP PUT request.
 *
 * @param payload - The configuration data to be sent to the server.
 * @returns A Promise resolving with the response data if the update is successful.
 *
 * @throws IdentityAppsApiException - If the server responds with a non-200 status code
 *                                    or if the request fails.
 *
 */
const configureDeviceRegistrationFlow = (
    payload: DeviceRegistrationFlowPayloadInterface
): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        data: payload,
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.deviceRegistrationFlow
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    DeviceRegistrationFlowBuilderConstants.FLOW_CONFIG_INVALID_STATUS_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                DeviceRegistrationFlowBuilderConstants.FLOW_CONFIG_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export default configureDeviceRegistrationFlow;
