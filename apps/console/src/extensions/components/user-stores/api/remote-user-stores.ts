/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { store } from "../../../../features/core";
import { RegenerateTokenInterface } from "../models";

/**
 * The error code that is returned when there is no item in the list.
 */
const RESOURCE_NOT_FOUND_ERROR_MESSAGE = "Resource not found.";

/**
 * Initialize an axios Http client.
 *
 * @type { AxiosHttpClientInstance }
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches all user store agent connections.
 *
 * @param {string} userStoreId - User store ID
 * @return {Promise<any>} response.
 */
export const getAgentConnections = (userStoreId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.userStoreAgentConnection }/${userStoreId}`
    };
    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error?.response?.data?.message !== RESOURCE_NOT_FOUND_ERROR_MESSAGE) {
                return Promise.reject(error?.response?.data);
            }
        });
};

/**
 * Disconnect an agent connection.
 *
 * @param {string} userStoreId - User store ID
 * @param {string} agentConnectionId - Agent connection ID
 * @return {Promise<any>} response.
 */
export const disconnectAgentConnection = (userStoreId: string, agentConnectionId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.userStoreAgentConnection }/${userStoreId}/agent/${agentConnectionId}`
    };
    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 204) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error?.response?.data?.message !== RESOURCE_NOT_FOUND_ERROR_MESSAGE) {
                return Promise.reject(error?.response?.data);
            }
        });
};

/**
 * Generate access token for the agent.
 *
 * @return {Promise<any>} response.
 * @param data - User store ID.
 */
export const generateToken = (data: { userStoreId: string }): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        data,
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.userStoreAgentToken }`
    };
    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error?.response?.data?.message !== RESOURCE_NOT_FOUND_ERROR_MESSAGE) {
                return Promise.reject(error?.response?.data);
            }
        });
};

/**
 * Regenerate access token for the agent.
 *
 * @return {Promise<any>} response.
 * @param {RegenerateTokenInterface} data - Agent token details
 */
export const regenerateToken = (data: RegenerateTokenInterface): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        data,
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.userStoreAgentToken }/regenerate`
    };
    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error?.response?.data?.message !== RESOURCE_NOT_FOUND_ERROR_MESSAGE) {
                return Promise.reject(error?.response?.data);
            }
        });
};
