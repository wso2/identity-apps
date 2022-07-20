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
import { OrganizationRoleListResponseInterface, PatchOrganizationRoleDataInterface } from "../models";

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
 * @param {number} count The maximum number of organizations to return.
 * @param {string} cursor Cursor string for pagination
 *
 * @returns {Promise<OrganizationListInterface>}
 */
export const getOrganizationRoles = (
    organizationId: string,
    filter: string,
    count: number,
    cursor: string
): Promise<OrganizationRoleListResponseInterface> => {
    const config: HttpRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            count,
            cursor,
            filter
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

/**
 * Update Data of the matched ID or the role
 *
 * @param organizationId Organization id
 * @param roleId role id to update role details
 * @param roleData Data that needs to be updated.
 */
export const updateRole = (
    organizationId: string,
    roleId: string,
    roleData: PatchOrganizationRoleDataInterface
): Promise<any> => {
    const requestConfig = {
        data: roleData,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${ store.getState().config.endpoints.organizations }/organizations/${ organizationId }/roles/${roleId}`
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Update Data of the matched ID or the role
 *
 * @param organizationId Organization id
 * @param roleId role id to update role details
 * @param roleData Data that needs to be updated.
 */
export const patchOrganizationRoleDetails = (
    organizationId: string,
    roleId: string,
    roleData: PatchOrganizationRoleDataInterface
): Promise<any> => {
    const requestConfig = {
        data: roleData,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.organizations }/organizations/${ organizationId }/roles/${roleId}`
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve Organization Role details for a give role id.
 *
 * @param organizationId organization id
 * @param roleId role id to retrieve role details
 */
export const getOrganizationRoleById = (organizationId: string, roleId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.organizations }/organizations/${ organizationId }/roles/${roleId}`
    };

    return httpClient(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Getter for Organization Permission List
 * ToDo - This is hardcoded in the FE for now since we don't have the needed backend API for this as of now.
 * Need to change this to a real API once the BE is ready
 */
export const getOrganizationPermissions = (): Promise<any> => {
    return new Promise((resolve) => {
        resolve({
            data: [
                {
                    "displayName": "All Permissions",
                    "resourcePath": "/permission/"
                },
                {
                    "displayName": "Admin",
                    "resourcePath": "/permission/admin"
                },
                {
                    "displayName": "Manage",
                    "resourcePath": "/permission/admin/manage"
                },
                {
                    "displayName": "Identity",
                    "resourcePath": "/permission/admin/manage/identity"
                },
                {
                    "displayName": "Authentication",
                    "resourcePath": "/permission/admin/manage/identity/authentication"
                },
                {
                    "displayName": "Claim Management",
                    "resourcePath": "/permission/admin/manage/identity/claimmgt"
                },
                {
                    "displayName": "CORS Management",
                    "resourcePath": "/permission/admin/manage/identity/cors"
                },
                {
                    "displayName": "Governance",
                    "resourcePath": "/permission/admin/manage/identity/governance"
                },
                {
                    "displayName": "Group Management",
                    "resourcePath": "/permission/admin/manage/identity/groupmgt"
                },
                {
                    "displayName": "Role Management",
                    "resourcePath": "/permission/admin/manage/identity/rolemgt"
                },
                {
                    "displayName": "Organization Management",
                    "resourcePath": "/permission/admin/manage/identity/organizationmgt"
                },
                {
                    "displayName": "User Management",
                    "resourcePath": "/permission/admin/manage/identity/usermgt"
                },
                {
                    "displayName": "Identity Providers",
                    "resourcePath": "/permission/admin/manage/identity/idpmgt"
                },
                {
                    "displayName": "Applications",
                    "resourcePath": "/permission/admin/manage/identity/applicationmgt"
                },
                {
                    "displayName": "Userstores",
                    "resourcePath": "/permission/admin/manage/identity/userstore"
                },
                {
                    "displayName": "Userstores Config",
                    "resourcePath": "/permission/admin/manage/identity/userstore/config"
                },
                {
                    "displayName": "Sessions",
                    "resourcePath": "/permission/admin/manage/identity/authentication/session"
                },
                {
                    "displayName": "CORS Origins",
                    "resourcePath": "/permission/admin/manage/identity/cors/origins"
                },
                {
                    "displayName": "Roles view",
                    "resourcePath": "/permission/admin/manage/identity/rolemgt/view"
                },
                {
                    "displayName": "Roles create",
                    "resourcePath": "/permission/admin/manage/identity/rolemgt/create"
                },
                {
                    "displayName": "Roles update",
                    "resourcePath": "/permission/admin/manage/identity/rolemgt/update"
                },
                {
                    "displayName": "Roles delete",
                    "resourcePath": "/permission/admin/manage/identity/rolemgt/delete"
                },
                {
                    "displayName": "Organizations view",
                    "resourcePath": "/permission/admin/manage/identity/organizationmgt/view"
                },
                {
                    "displayName": "Organizations create",
                    "resourcePath": "/permission/admin/manage/identity/organizationmgt/create"
                },
                {
                    "displayName": "Organizations update",
                    "resourcePath": "/permission/admin/manage/identity/organizationmgt/update"
                },
                {
                    "displayName": "Organizations delete",
                    "resourcePath": "/permission/admin/manage/identity/organizationmgt/delete"
                },
                {
                    "displayName": "Users view",
                    "resourcePath": "/permission/admin/manage/identity/usermgt/view"
                },
                {
                    "displayName": "Users list",
                    "resourcePath": "/permission/admin/manage/identity/usermgt/list"
                },
                {
                    "displayName": "Users create",
                    "resourcePath": "/permission/admin/manage/identity/usermgt/create"
                },
                {
                    "displayName": "Users update",
                    "resourcePath": "/permission/admin/manage/identity/usermgt/update"
                },
                {
                    "displayName": "Users delete",
                    "resourcePath": "/permission/admin/manage/identity/usermgt/delete"
                },
                {
                    "displayName": "Identity Providers view",
                    "resourcePath": "/permission/admin/manage/identity/idpmgt/view"
                },
                {
                    "displayName": "Identity Providers list",
                    "resourcePath": "/permission/admin/manage/identity/idpmgt/list"
                },
                {
                    "displayName": "Identity Providers create",
                    "resourcePath": "/permission/admin/manage/identity/idpmgt/create"
                },
                {
                    "displayName": "Identity Providers update",
                    "resourcePath": "/permission/admin/manage/identity/idpmgt/update"
                },
                {
                    "displayName": "Identity Providers delete",
                    "resourcePath": "/permission/admin/manage/identity/idpmgt/delete"
                },
                {
                    "displayName": "Applications view",
                    "resourcePath": "/permission/admin/manage/identity/applicationmgt/view"
                },
                {
                    "displayName": "Applications list",
                    "resourcePath": "/permission/admin/manage/identity/applicationmgt/list"
                },
                {
                    "displayName": "Applications create",
                    "resourcePath": "/permission/admin/manage/identity/applicationmgt/create"
                },
                {
                    "displayName": "Applications update",
                    "resourcePath": "/permission/admin/manage/identity/applicationmgt/update"
                },
                {
                    "displayName": "Applications delete",
                    "resourcePath": "/permission/admin/manage/identity/applicationmgt/delete"
                },
                {
                    "displayName": "Userstore view",
                    "resourcePath": "/permission/admin/manage/identity/userstore/config/view"
                },
                {
                    "displayName": "Userstore list",
                    "resourcePath": "/permission/admin/manage/identity/userstore/config/list"
                },
                {
                    "displayName": "Userstore create",
                    "resourcePath": "/permission/admin/manage/identity/userstore/config/create"
                },
                {
                    "displayName": "Userstore update",
                    "resourcePath": "/permission/admin/manage/identity/userstore/config/update"
                },
                {
                    "displayName": "Userstore delete",
                    "resourcePath": "/permission/admin/manage/identity/userstore/config/delete"
                },
                {
                    "displayName": "Group view",
                    "resourcePath": "/permission/admin/manage/identity/groupmgt/view"
                },
                {
                    "displayName": "Governance view",
                    "resourcePath": "/permission/admin/manage/identity/governance/view"
                },
                {
                    "displayName": "CORS Origins view",
                    "resourcePath": "/permission/admin/manage/identity/cors/origins/view"
                },
                {
                    "displayName": "Claim Metadata",
                    "resourcePath": "/permission/admin/manage/identity/claimmgt/metadata"
                },
                {
                    "displayName": "Claim Metadata view",
                    "resourcePath": "/permission/admin/manage/identity/claimmgt/metadata/view"
                },
                {
                    "displayName": "Session view",
                    "resourcePath": "/permission/admin/manage/identity/authentication/session/view"
                }
            ],
            status: 200
        });
    });
};
