/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "@wso2is/admin.core.v1";
import { ApplicationRoleInterface, GroupRoleAssignPayloadInterface } from "../models/application-roles";

/**
 * Initialize an axios Http client.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Get the application roles assigned to the group.
 *
 * @param group - Group name.
 * 
 * @returns A promise containing the response.
 */
export const getAssignedApplicationRolesList = (group: string):Promise<ApplicationRoleInterface[]> => {
    const requestConfig: AxiosRequestConfig = {
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.authzEndpoint }/groups/${ group }/role-mapping`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data.app_roles as ApplicationRoleInterface[]);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get all the application roles in the organization.
 *
 * @returns A promise containing the response.
 */
export const getAllApplicationRolesList = ():Promise<ApplicationRoleInterface[]> => {
    const requestConfig: AxiosRequestConfig = {
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.authzEndpoint }/roles`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data.app_roles as ApplicationRoleInterface[]);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Update the application roles assigned to the group.
 *
 * @param group - Group name.
 * @param payload - Group role assign payload.
 * 
 * @returns A promise containing the response.
 */
export const updateGroupRoleMapping = (group: string, payload: GroupRoleAssignPayloadInterface):Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        data: payload,
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.authzEndpoint }/groups/${ group }/role-mapping`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};
