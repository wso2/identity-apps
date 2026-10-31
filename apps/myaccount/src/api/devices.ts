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

import { AsgardeoSPAClient, HttpClientInstance, HttpRequestConfig } from "@asgardeo/auth-react";
import { AxiosResponse } from "axios";
import { DeviceInterface, DevicePatchRequestInterface, HttpMethods } from "../models";
import { store } from "../store";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Updates the name and/or the status of a device registered to the authenticated user.
 *
 * @param deviceId - ID of the device.
 * @param patch - Fields to update.
 * @returns A promise resolving to the updated device.
 */
export const updateDevice = (
    deviceId: string,
    patch: DevicePatchRequestInterface
): Promise<DeviceInterface> => {
    const requestConfig: HttpRequestConfig = {
        data: patch,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.devices }/${ encodeURIComponent(deviceId) }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<DeviceInterface>) => response.data);
};

/**
 * Deletes a device registered to the authenticated user.
 *
 * @param deviceId - ID of the device.
 * @returns A promise that resolves once the device is deleted.
 */
export const deleteDevice = (deviceId: string): Promise<void> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.devices }/${ encodeURIComponent(deviceId) }`
    };

    return httpClient(requestConfig)
        .then((): void => undefined);
};
