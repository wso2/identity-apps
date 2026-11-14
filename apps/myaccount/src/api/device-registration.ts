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
import { getConfigPreferences } from "./preference";
import { DeviceRegistrationConstants } from "../constants/device-registration-constants";
import { FlowExecutionResponseInterface, HttpMethods } from "../models";
import { ConfigPreferenceResponseInterface } from "../models/push-authenticator";
import { store } from "../store";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Checks whether the device registration flow is enabled for the organization, from the flow config that the
 * config preferences API exposes to the user. Rejects when the config can't be read.
 *
 * @returns A promise resolving to true if the flow is enabled.
 */
export const isDeviceRegistrationFlowEnabled = (): Promise<boolean> => {
    return getConfigPreferences([
        {
            attributeNames: [ DeviceRegistrationConstants.FLOW_CONFIG_IS_ENABLED_ATTRIBUTE ],
            resourceName: DeviceRegistrationConstants.FLOW_CONFIG_RESOURCE_NAME,
            resourceType: DeviceRegistrationConstants.FLOW_CONFIG_RESOURCE_TYPE
        }
    ]).then((response: ConfigPreferenceResponseInterface[]) => {
        const resource: ConfigPreferenceResponseInterface | undefined = response?.find(
            (item: ConfigPreferenceResponseInterface) =>
                item.resourceName === DeviceRegistrationConstants.FLOW_CONFIG_RESOURCE_NAME
        );

        return resource?.attributeNames?.find(
            (attribute: { name: string; value: string }) =>
                attribute.name === DeviceRegistrationConstants.FLOW_CONFIG_IS_ENABLED_ATTRIBUTE
        )?.value === "true";
    });
};

/**
 * Starts the device registration flow for the authenticated user, who is identified by the ID token.
 *
 * @param idToken - ID token of the authenticated user.
 * @returns A promise resolving to the first step of the flow.
 */
export const startDeviceRegistrationFlow = (idToken: string): Promise<FlowExecutionResponseInterface> => {
    const requestConfig: HttpRequestConfig = {
        data: {
            flowType: DeviceRegistrationConstants.FLOW_TYPE,
            inputs: {
                token: idToken,
                tokenType: DeviceRegistrationConstants.ID_TOKEN_TYPE
            }
        },
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.flowExecute
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<FlowExecutionResponseInterface>) => response.data);
};
