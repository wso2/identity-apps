/**
 * Copyright (c) 2024-2026, WSO2 LLC. (https://www.wso2.com).
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
import { HttpMethods,
    HttpErrorResponseDataInterface
} from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../admin.core.v1/store";
import { ApplicationsSettingsFormValuesInterface, DCRConfigUpdateType } from "../models/applications-settings";
import { CimdOAuth2InboundConfigInterface } from "../utils/cimd/models";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Updates the DCR Configurations.
 *
 * @returns A promise containing the response.
 */
export const updateDCRConfigurations = (
    updateData: Array<DCRConfigUpdateType>
): Promise<ApplicationsSettingsFormValuesInterface | void> => {

    const requestConfig: AxiosRequestConfig = {
        data: updateData,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.dcrConfiguration
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update DCR Configuration."));
            }

            return Promise.resolve(response.data as ApplicationsSettingsFormValuesInterface);
        }).catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            return Promise.reject(error);
        });
};

/**
 * Updates the organization's OAuth2 inbound configuration.
 *
 * @param updateData - OAuth2 inbound configuration values to update.
 * @returns A promise that resolves once the configuration is updated.
 */
export const updateOAuth2InboundConfig = (
    updateData: CimdOAuth2InboundConfigInterface
): Promise<void> => {

    const requestConfig: AxiosRequestConfig = {
        data: updateData,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.serverConfigurations }/authentication/inbound/oauth2`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update the OAuth2 inbound configuration."));
            }

            return Promise.resolve();
        }).catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            return Promise.reject(error);
        });
};
