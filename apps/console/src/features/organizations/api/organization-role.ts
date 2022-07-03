/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AsgardeoSPAClient, HttpError, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { store } from "../../core";
import { CreateRoleInterface } from "../../roles";
import { OrganizationRoleListResponseInterface } from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Get a list of organizations.
 *
 * @param {string} organizationId Identifier of the organization
 * @param {string} filter The filter query.
 * @param {number} limit The maximum number of organizations to return.
 * @param {string} after The previous range of data to be returned.
 * @param {string} before The next range of data to be returned.
 *
 * @returns {Promise<OrganizationListInterface>}
 */
export const getOrganizationRoles = (
    organizationId: string,
    filter: string,
    limit: number,
    after: string,
    before: string
): Promise<OrganizationRoleListResponseInterface> => {
    const config: HttpRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            after,
            before,
            filter,
            limit
        },
        url: `${ store.getState().config.endpoints.organizations }/organizations/${organizationId}/roles`
    };

    return httpClient(config)
        .then((response: HttpResponse<OrganizationRoleListResponseInterface>) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get organization roles."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Delete an organization role.
 *
 * @param {string} id The organization role id.
 *
 * @returns {Promise<string>}
 */
export const deleteOrganizationRole = (organizationId: string, roleId: string): Promise<string> => {
    const config: HttpRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.organizations }/organizations/${ organizationId }/roles/${ roleId }`
    };

    return httpClient(config)
        .then((response: HttpResponse) => {
            if (response?.status !== 204) {
                return Promise.reject(new Error("Failed to delete the organization role."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Create a role in the organization.
 *
 * @param organizationId - The organization identifier.
 * @param data - data object used to create the role
 */
export const createOrganizationRole = (organizationId: string, data: CreateRoleInterface): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.organizations }/organizations/${ organizationId }/roles`
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};
