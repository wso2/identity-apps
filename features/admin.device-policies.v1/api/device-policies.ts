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
import {
    DevicePolicyResponseInterface,
    PolicyRequestInterface
} from "../models/device-policy";

const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Creates a new device policy.
 *
 * @param payload - Policy request body.
 * @returns The created device policy.
 */
export const createDevicePolicy = (
    payload: PolicyRequestInterface
): Promise<DevicePolicyResponseInterface> => {
    const requestConfig: RequestConfigInterface = {
        data: payload,
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.devicePolicies
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<DevicePolicyResponseInterface>) => Promise.resolve(response.data))
        .catch((error: unknown) => Promise.reject(error));
};

/**
 * Updates an existing device policy.
 *
 * @param policyId - ID of the device policy.
 * @param payload - Policy request body.
 * @returns The updated device policy.
 */
export const updateDevicePolicy = (
    policyId: string,
    payload: PolicyRequestInterface
): Promise<DevicePolicyResponseInterface> => {
    const requestConfig: RequestConfigInterface = {
        data: payload,
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.PUT,
        url: `${ store.getState().config.endpoints.devicePolicies }/${ policyId }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<DevicePolicyResponseInterface>) => Promise.resolve(response.data))
        .catch((error: unknown) => Promise.reject(error));
};

/**
 * Deletes a device policy by ID.
 *
 * @param policyId - ID of the device policy.
 */
export const deleteDevicePolicy = (policyId: string): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.devicePolicies }/${ policyId }`
    };

    return httpClient(requestConfig)
        .then(() => Promise.resolve())
        .catch((error: unknown) => Promise.reject(error));
};
