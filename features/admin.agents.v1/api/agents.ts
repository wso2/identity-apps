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
import { AgentScimSchema } from "../models/agents";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: HttpClientInstance
    = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Add an agent.
 *
 * @param data - Adds this data.
 *
 * @returns response.
 */
export const addAgent = (data: AgentScimSchema): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.agents
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
 * Updates an agent.
 *
 * @param data - Updated agent information
 *
 * @returns response.
 */
export const updateAgent = (agentId: string, data: AgentScimSchema): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.agents + `/${agentId}`
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
 * Deletes an agent.
 *
 * @param data - Adds this data.
 *
 * @returns response.
 */
export const deleteAgent = (agentId: string): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.agents + `/${agentId}`
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
 * Deletes an agent.
 *
 * @param data - Adds this data.
 *
 * @returns response.
 */
export const updateAgentLockStatus = (agentId: string, isLocked: boolean): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        data: {
            Operations: [
                {
                    op: "replace",
                    value: {
                        "urn:scim:wso2:schema": {
                            "accountLocked": isLocked
                        }
                    }
                }
            ],
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:PatchOp"
            ]
        },
        headers: {
            "Content-Type": "application/json"
        },

        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.agents + `/${agentId}`
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
 * Updates an agent's password.
 *
 * @param agentId - ID of the agent.
 * @param newPassword - New password to set.
 *
 * @returns response.
 */
export const updateAgentPassword = (agentId: string, newPassword: string): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        data: {
            Operations: [
                {
                    op: "replace",
                    value: {
                        password: newPassword
                    }
                }
            ],
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:PatchOp"
            ]
        },
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.agents + `/${agentId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};
