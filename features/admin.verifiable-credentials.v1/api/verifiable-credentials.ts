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
import { AxiosError, AxiosResponse } from "axios";
import {
    VCCredentialConfiguration,
    VCCredentialConfigurationCreationModel,
    VCCredentialConfigurationUpdateModel
} from "../models/verifiable-credentials";

/**
 * Initialize an axios Http client.
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Add a new VC credential configuration.
 *
 * @param data - The configuration data to create.
 * @returns Promise with the created configuration.
 */
export const addVCCredentialConfiguration = (
    data: VCCredentialConfigurationCreationModel
): Promise<VCCredentialConfiguration> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.vcCredentialConfigurations
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get a single VC credential configuration by ID.
 *
 * @param configId - The ID of the configuration to retrieve.
 * @returns Promise with the configuration data.
 */
export const getVCCredentialConfiguration = (configId: string): Promise<VCCredentialConfiguration> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.vcCredentialConfigurations}/${configId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Update an existing VC credential configuration.
 *
 * @param configId - The ID of the configuration to update.
 * @param data - The updated configuration data.
 * @returns Promise with the updated configuration.
 */
export const updateVCCredentialConfiguration = (
    configId: string,
    data: VCCredentialConfigurationUpdateModel
): Promise<VCCredentialConfiguration> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${store.getState().config.endpoints.vcCredentialConfigurations}/${configId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Delete a VC credential configuration.
 *
 * @param configId - The ID of the configuration to delete.
 * @returns Promise with the response.
 */
export const deleteVCCredentialConfiguration = (configId: string): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.vcCredentialConfigurations}/${configId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Generate or regenerate a credential offer for a configuration.
 *
 * @param configId - The ID of the configuration.
 * @returns Promise with the updated configuration containing the offer.
 */
export const generateVCCredentialOffer = (configId: string): Promise<VCCredentialConfiguration> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${store.getState().config.endpoints.vcCredentialConfigurations}/${configId}/offer`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Revoke a credential offer for a configuration.
 *
 * @param configId - The ID of the configuration.
 * @returns Promise with the updated configuration (offerId set to null).
 */
export const revokeVCCredentialOffer = (configId: string): Promise<VCCredentialConfiguration> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.vcCredentialConfigurations}/${configId}/offer`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};
