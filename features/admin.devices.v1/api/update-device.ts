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
import { DeviceInterface, DeviceUpdateRequestInterface } from "../models/devices";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Update the name of a device.
 *
 * @param deviceId - ID of the device.
 * @param device - New name of the device.
 * @returns A promise that resolves with the updated device.
 * @throws Throws an IdentityAppsApiException if the request fails.
 */
const updateDevice = (deviceId: string, device: DeviceUpdateRequestInterface): Promise<DeviceInterface> => {
    const requestConfig: RequestConfigInterface = {
        data: device,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.devices }/${ deviceId }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<DeviceInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    "Failed to update the device.",
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
                error.message,
                error.stack,
                error.response?.status,
                error.request,
                error.response,
                error.config
            );
        });
};

export default updateDevice;
