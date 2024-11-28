/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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
import { store } from "@wso2is/admin.core.v1";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { GenerateTokenResponseInterface, RegenerateTokenRequestPayloadInterface } from "../models/remote-user-stores";

/**
 * The error code that is returned when there is no item in the list.
 */
const RESOURCE_NOT_FOUND_ERROR_MESSAGE: string = "Resource not found.";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches all user store agent connections.
 *
 * @param userStoreId - User store ID
 * @returns agent connections
 */
export const getAgentConnections = (userStoreId: string): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.onPremUserStoreAgentConnection }/${userStoreId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            if (error?.response?.data?.message !== RESOURCE_NOT_FOUND_ERROR_MESSAGE) {
                return Promise.reject(error?.response?.data);
            }
        });
};

/**
 * Disconnect an agent connection.
 *
 * @param userStoreId - User store ID.
 * @param agentConnectionId - Agent connection ID.
 * @param userStoreManager - User store manager type.
 * @returns response for disconnecting agent connection.
 */
export const disconnectAgentConnection = (
    userStoreId: string,
    agentConnectionId: string,
    userStoreManager: RemoteUserStoreManagerType
): Promise<any> => {
    const url: string = userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager
        ? `${
            store.getState().config.endpoints.remoteUserStoreAgentConnection
        }/${userStoreId}/agent/${agentConnectionId}`
        : `${
            store.getState().config.endpoints.onPremUserStoreAgentConnection
        }/${userStoreId}/agent/${agentConnectionId}`;

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            if (error?.response?.data?.message !== RESOURCE_NOT_FOUND_ERROR_MESSAGE) {
                return Promise.reject(error?.response?.data);
            }
        });
};

/**
 * Generate access token for the agent.
 *
 * @param userStoreId - User store ID.
 * @param userStoreManager - User store manager type.
 * @returns response.
 */
export const generateToken = (
    userStoreId: string,
    userStoreManager: RemoteUserStoreManagerType
): Promise<GenerateTokenResponseInterface> => {
    const url: string = userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager
        ? `${store.getState().config.endpoints.remoteUserStoreAgentToken}/${userStoreId}`
        : store.getState().config.endpoints.onPremUserStoreAgentToken;

    const requestConfig: RequestConfigInterface = {
        data: userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager ? {} : { userStoreId },
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            if (error?.response?.data?.message !== RESOURCE_NOT_FOUND_ERROR_MESSAGE) {
                return Promise.reject(error?.response?.data);
            }
        });
};

/**
 * Regenerate access token for the agent.
 *
 * @param existingTokenId - Existing token ID.
 * @param userStoreId - User store ID.
 * @param userStoreManager - User store manager type.
 * @returns response.
 */
export const regenerateToken = (
    existingTokenId: string,
    userStoreId: string,
    userStoreManager: RemoteUserStoreManagerType
): Promise<GenerateTokenResponseInterface> => {
    const url: string = userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager
        ? `${store.getState().config.endpoints.remoteUserStoreAgentToken}/${userStoreId}/regenerate`
        : `${ store.getState().config.endpoints.onPremUserStoreAgentToken }/regenerate`;

    const payload: RegenerateTokenRequestPayloadInterface = userStoreManager ===
        RemoteUserStoreManagerType.RemoteUserStoreManager
        ? { existingTokenId }
        : { existingTokenId, userStoreId };

    const requestConfig: RequestConfigInterface = {
        data: payload,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            if (error?.response?.data?.message !== RESOURCE_NOT_FOUND_ERROR_MESSAGE) {
                return Promise.reject(error?.response?.data);
            }
        });
};
