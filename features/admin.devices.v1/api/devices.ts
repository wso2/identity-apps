/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { DevicePatchRequestInterface, DeviceResponseInterface } from "../models/devices";

const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Updates the display name of a registered device.
 *
 * @param deviceId - UUID of the device.
 * @param payload - Patch request body.
 * @returns The updated device.
 */
export const updateDeviceName = (
    deviceId: string,
    payload: DevicePatchRequestInterface
): Promise<DeviceResponseInterface> => {
    const requestConfig: RequestConfigInterface = {
        data: payload,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.devices }/${ deviceId }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<DeviceResponseInterface>) => Promise.resolve(response.data))
        .catch((error: unknown) => Promise.reject(error));
};

/**
 * Fetches a single registered device by ID.
 *
 * @param deviceId - UUID of the device.
 * @returns The device.
 */
export const getDeviceById = (deviceId: string): Promise<DeviceResponseInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.devices }/${ deviceId }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<DeviceResponseInterface>) => Promise.resolve(response.data))
        .catch((error: unknown) => Promise.reject(error));
};

/**
 * Deletes a registered device by ID.
 *
 * @param deviceId - UUID of the device.
 * @returns Resolved on 204 No Content.
 */
export const deleteDevice = (deviceId: string): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.devices }/${ deviceId }`
    };

    return httpClient(requestConfig)
        .then(() => Promise.resolve())
        .catch((error: unknown) => Promise.reject(error));
};
