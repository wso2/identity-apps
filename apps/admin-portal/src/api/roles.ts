/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AxiosHttpClient } from "@wso2is/http";
import { ServiceResourcesEndpoint } from "../configs";
import { HttpMethods, CreateRoleInterface, SearchRoleInterface, PatchRoleDataInterface } from "../models";
import { store } from "../store";

/**
 * Initialize an axios Http client.
 * @type { AxiosHttpClientInstance }
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Retrieve the list of groups that are currently in the system.
 *
 * @returns {Promise<BasicProfileInterface>} a promise containing the user list.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getRolesList = (domain: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            domain
        },
        url: ServiceResourcesEndpoint.groups
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Retrive Role details for a give role id.
 *
 * @param roleId role id to retrive role details
 */
export const getRoleById = (roleId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.groups + "/" + roleId
    };

    return httpClient.request(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error);
    });
}

/**
 * Update Data of the matched ID or the role
 *
 * @param roleId role id to update role details
 * @param roleData Data that needs to be updated.
 */
export const updateRoleDetails = (roleId: string, roleData: PatchRoleDataInterface): Promise<any> => {
    const requestConfig = {
        data: roleData,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: ServiceResourcesEndpoint.groups + "/" + roleId
    };

    return httpClient.request(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error);
    });
}

/**
 * Retrieve a list of matched roles according to the search query.
 *
 * @param searchData - search query data
 */
export const searchRoleList = (searchData: SearchRoleInterface): Promise<any> => {
    const requestConfig = {
        data: searchData,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.groups + "/.search"
    };

    return httpClient.request(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error)
    })
}

/**
 * Delete a selected role with a given role ID.
 *
 * @param roleId - Id of the role which needs to be deleted.
 * @returns {Promise<any>} a promise containing the status of the delete.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteRoleById = (roleId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: ServiceResourcesEndpoint.groups + "/" + roleId
    };

    return httpClient.request(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error)
    })
}

/**
 * Create a role in the system with role data given by user.
 *
 * @param data - data object used to create the role
 */
export const createRole = (data: CreateRoleInterface): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.groups
    };

    return httpClient.request(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error)
    });
}

/**
 * Add or Update permission for the given Role using the role ID.
 *
 * @param roleId - ID of the role which needs to be updated
 * @param data - Permission data of the role
 */
export const updateRolePermissions = (roleId: string, data: any): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: ServiceResourcesEndpoint.groups + "/" + roleId + "/permissions"
    };

    return httpClient.request(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error)
    });
}

/**
 * Retrieve a list of all the permissions from the system.
 *
 * @returns {Promise<any>} a promise containing the permission list
 */
export const getPermissionList = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.permission
    };

    return httpClient.request(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error);
    });
}

/**
 * Retrieve the list of permissions available for a given Role Id.
 *
 * @param roleId Role Id to retrieve relevent permissions
 */
export const getPermissionsForRole = (roleId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.groups + "/" + roleId + "/permissions"
    };

    return httpClient.request(requestConfig).then((response) => {
        return Promise.resolve(response);
    }).catch((error) => {
        return Promise.reject(error);
    });
}
