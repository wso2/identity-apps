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

import { store } from "@wso2is/admin.core.v1/store";
import { DevicePoliciesResourceEndpointsInterface } from "../models/endpoints";

/**
 * Returns the device assurance policy resource endpoints.
 *
 * @param serverHost - The server host URL.
 * @returns The device policy resource endpoints.
 */
export const getDevicePoliciesResourceEndpoints = (
    serverHost?: string
): DevicePoliciesResourceEndpointsInterface => {
    const host: string = serverHost ?? store.getState().config.endpoints.serverHost ?? "";

    return {
        devicePolicies: `${ host }/api/server/v1/policies`,
        devicePolicyMetadata: `${ host }/api/server/v1/device-policies/metadata`
    };
};
