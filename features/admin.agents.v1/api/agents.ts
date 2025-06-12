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

import { PatchRoleDataInterface } from "@wso2is/admin.roles.v2/models/roles";
import { addUser, deleteUser, updateUserInfo } from "@wso2is/admin.users.v1/api/users";
import { UserDetailsInterface } from "@wso2is/admin.users.v1/models/user";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AxiosError, AxiosResponse } from "axios";

/**
 * Add an agent.
 *
 * @param data - Adds this data.
 *
 * @returns response.
 */
export const addAgent = (data: UserDetailsInterface): Promise<any> => {
    return addUser(data).then((response: AxiosResponse) => {
        if (response.status !== 201) {
            throw new IdentityAppsApiException(
                "Error when creating the agent",
                null,
                response.status,
                response.request
            );
        }

        return Promise.resolve(response?.data);
    }).catch((error: AxiosError) => {
        return Promise.reject(error?.response?.data);
    });
};

/**
 * Updates an agent.
 *
 * @param data - Updated agent information
 *
 * @returns response.
 */
export const updateAgent = (agentId: string, data: PatchRoleDataInterface): Promise<any> => {
    return updateUserInfo(agentId, data);
};

/**
 * Deletes an agent.
 *
 * @param data - Adds this data.
 *
 * @returns response.
 */
export const deleteAgent = (agentId: string): Promise<AxiosResponse> => {
    return deleteUser(agentId).then((response: AxiosResponse) => {
        if (response.status !== 204) {
            throw new IdentityAppsApiException(
                "Error when deleting the agent",
                null,
                response.status,
                response.request
            );
        }

        return Promise.resolve(response);
    }).catch((error: AxiosError) => {
        return Promise.reject(error?.response?.data);
    });
};
