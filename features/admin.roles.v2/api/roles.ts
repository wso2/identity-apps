/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { RoleConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods, RoleListInterface, RolesInterface } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { RoleAudienceTypes } from "../constants/role-constants";
import { APIResourceInterface, APIResourceListInterface, AuthorizedAPIListItemInterface } from "../models/apiResources";
import {
    CreateRoleInterface,
    PatchRoleDataInterface,
    RolesV2ResponseInterface,
    SearchRoleInterface
} from "../models/roles";

/**
 * Initialize an axios Http client.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Get the application roles by audience.
 *
 * @param audience - audience.
 * @param before - Before link.
 * @param after - After link.
 * @param limit - Limit.
 *
 * @returns A promise containing the response.
 */
export const getApplicationRolesByAudience = (
    audience: string,
    appId: string,
    before: string,
    after: string,
    limit: number,
    excludedAttributes?: string
):Promise<RolesV2ResponseInterface> => {

    const filter: string = audience === RoleAudienceTypes.APPLICATION
        ? `audience.value eq ${ appId }`
        : `audience.type eq ${ audience.toLowerCase() }`;

    const requestConfig: RequestConfigInterface = {
        method: HttpMethods.GET,
        params: {
            after,
            before,
            excludedAttributes,
            filter,
            limit
        },
        url:  `${ store.getState().config.endpoints.rolesV2 }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data as RolesV2ResponseInterface);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get the roles by name.
 *
 * @param audienceId - Organization ID or Application ID.
 * @param roleName - Role name.
 * @param before - Before link.
 * @param after - After link.
 * @param limit - Limit.
 *
 * @returns A promise containing the response.
 */
export const getRoleByName = (
    audienceId: string,
    roleName: string,
    before: string,
    after: string,
    limit: number
):Promise<RolesV2ResponseInterface> => {

    const filter: string = `audience.value eq ${ audienceId } and displayName eq ${ roleName }`;

    const requestConfig: RequestConfigInterface = {
        method: HttpMethods.GET,
        params: {
            after,
            before,
            filter,
            limit
        },
        url:  `${ store.getState().config.endpoints.rolesV2 }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data as RolesV2ResponseInterface);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve Role details for a give role id.
 *
 * @param roleId - role id to retrieve role details
 * @deprecated Use `useGetRoleById` instead.
 */
export const getRoleById = (roleId: string): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.rolesV2 + "/" + roleId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve Role details for a give role id using SCIM2 Roles V3 API.
 *
 * @param roleId - role id to retrieve role details
 */
export const getRoleByIdV3 = (roleId: string): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.rolesV3 + "/" + roleId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve Role details for a given role id.
 *
 * @param roleId - role id to retrieve role details
 */
export const useGetRoleById = <Data = RolesInterface, Error = RequestErrorInterface>(
    roleId: string
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.rolesV2}/${roleId}`
    };

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
        response
    } = useRequest<Data, Error>(roleId ? requestConfig : null);

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
        response
    };
};

/**
 * Retrieves API resource details for the given API resource IDs.
 *
 * @param apiResourceIds - ids of the API resources
 * @returns `Promise<APIResourceInterface[]>`
 * @throws `IdentityAppsApiException`
 */
export const getAPIResourceDetailsBulk = (apiResourceIds: string[]): Promise<APIResourceInterface[]> => {
    // send the request for each ID and return the response.
    return Promise.all(apiResourceIds.map((apiResourceId: string) => {
        return getAPIResourceDetails(apiResourceId);
    }));
};

/**
 * Update Data of the matched ID or the role
 *
 * @param roleId - role id to update role details
 * @param roleData - Data that needs to be updated.
 */
export const updateRoleDetails = (roleId: string, roleData: PatchRoleDataInterface): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data: roleData,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.rolesV2 + "/" + roleId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Update Data of the matched ID or the role using SCIM2 Roles V3 API.
 *
 * @param roleId - role id to update role details
 * @param roleData - Data that needs to be updated.
 */
export const updateRoleDetailsUsingV3Api = (roleId: string, roleData: PatchRoleDataInterface): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data: roleData,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.rolesV3 + "/" + roleId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Assign/de-assign groups to a role uaing SCIM2 Roles API V3.
 *
 * @param roleId - role id to update role details
 * @param roleData - Data that needs to be updated.
 */
export const assignGroupstoRoles = (roleId: string, roleData: PatchRoleDataInterface): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data: roleData,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.rolesV3 + "/" + roleId + "/Groups"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Assign/de-assign Users to a role uaing SCIM2 Roles API V3.
 *
 * @param roleId - role id to update role details
 * @param roleData - Data that needs to be updated.
 */
export const updateUsersForRole = (roleId: string, roleData: PatchRoleDataInterface): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data: roleData,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.rolesV3 + "/" + roleId + "/Users"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve a list of matched roles according to the search query.
 *
 * @param searchData - search query data
 */
export const searchRoleList = (searchData: SearchRoleInterface): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data: searchData,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store?.getState()?.config?.endpoints?.rolesV2 + "/.search"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Delete a selected role with a given role ID.
 * TODO:ROLEV2 Need to update the url once the API is ready.
 *
 * @param roleId - Id of the role which needs to be deleted.
 * @returns A promise containing the status of the delete.
 */
export const deleteRoleById = (roleId: string): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.rolesV2 + "/" + roleId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Delete a selected role with a given role ID.
 *
 * @param roleId - Id of the role which needs to be deleted.
 * @returns A promise containing the status of the delete.
 */
export const deleteRoleByIdV3 = (roleId: string): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.rolesV3 + "/" + roleId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Create a role in the system with role data given by user.
 * TODO:ROLEV2 Need to update the url once the API is ready.
 *
 * @param data - data object used to create the role
 */
export const createRole = (data: CreateRoleInterface): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.rolesV2
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Create a roles using SCIM2 Roles V3 API.
 *
 * @param data - data object used to create the role
 */
export const createRoleUsingV3Api = (data: CreateRoleInterface): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.rolesV3
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Add or Update permission for the given Role using the role ID.
 *
 * @param roleId - ID of the role which needs to be updated
 * @param data - Permission data of the role
 */
export const updateRolePermissions = (roleId: string, data: unknown): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.groups + "/" + roleId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve a list of all the permissions from the system.
 *
 * @returns A promise containing the permission list
 */
export const getPermissionList = (): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.permission
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve the list of permissions available for a given Role Id.
 *
 * @param roleId - Role Id to retrieve relevant permissions
 */
export const getPermissionsForRole = (roleId: string): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.groups + "/" + roleId + "/permissions"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieves API resource details for the given API resource ID.
 *
 * @param apiResourceId - id of the API resource
 * @returns `Promise<APIResourceInterface>`
 * @throws `IdentityAppsApiException`
 */
export const getAPIResourceDetails = (apiResourceId: string): Promise<APIResourceInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.apiResources}/${apiResourceId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<APIResourceInterface>) => {
            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Update roles for given role IDs.
 *
 * @param roleIds - Ids of the Roles to be updated
 * @returns `Promise<APIResourceInterface[]>`
 * @throws `IdentityAppsApiException`
 */
export const updateRolesBulk = (roleIds: string[], roleData: PatchRoleDataInterface): Promise<any[]> => {
    // send the request for each ID and return the response.
    return Promise.all(roleIds.map((roleId: string) => {
        return updateRoleDetails(roleId, roleData);
    }));
};

/**
 * Retrieve the list of groups that are currently in the system.
 * TODO: Return `response.data` rather than `response` and stop returning any.
 *
 * @param domain - User store domain.
 * @param filter - Search filter.
 * @returns A promise containing the roles list.
 * @throws `IdentityAppsApiException`
 */
export const getRolesList = (domain: string, filter?: string): Promise<RoleListInterface | any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            domain,
            filter
        },
        url: store.getState().config.endpoints.rolesV2
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    RoleConstants.ROLES_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                RoleConstants.ROLES_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

export const getRolesListUsingV3Api = (domain: string, filter?: string): Promise<RoleListInterface | any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            domain,
            filter
        },
        url: store.getState().config.endpoints.rolesV3
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    RoleConstants.ROLES_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                RoleConstants.ROLES_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Hook to get the retrieve the list of API resources that are currently in the system.
 *
 * @param domain - User store domain.
 * @param filter - Search filter.
 * @returns The object containing the roles list.
 * @deprecated This is a temporary hook until the API resource feature moved to the features folder.
 */
export const useAPIResourcesList = <Data = APIResourceListInterface, Error = RequestErrorInterface>(
    filter?: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter
        },
        url: store.getState().config.endpoints.apiResources
    };

    const {
        data,
        error,
        isValidating,
        mutate,
        response
    } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate,
        response
    };
};

/**
 *
 * @param apiResourceId - id of the API resource
 * @returns `Promise<APIResourceInterface>`
 * @throws `IdentityAppsApiException`
 * @deprecated This is a temporary hook until the API resource feature moved to the features folder.
 */
export const useAPIResourceDetails = <Data = APIResourceInterface, Error = RequestErrorInterface>(
    apiResourceId: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.apiResources}/${apiResourceId}`
    };

    /**
     * Pass `null` if the `apiResourceId` is not available. This will prevent the request from being called.
     */
    const { data, error, isValidating, mutate } = useRequest<Data, Error>((apiResourceId && shouldFetch)
        ? requestConfig : null);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Get the authorized APIs of the application with authorized permissions.
 *
 * @param appId - Application ID.
 *
 * @returns A promise containing the response.
 * @deprecated This is a temporary hook until the API resource feature moved to the features folder.
 */
export const useGetAuthorizedAPIList = <Data = AuthorizedAPIListItemInterface[], Error = RequestErrorInterface>(
    applicationId: string
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.applications }/${ applicationId }/authorized-apis`
    };

    /**
     * Pass `null` if the `apiResourceId` is not available. This will prevent the request from being called.
     */
    const { data, error, isValidating, mutate } = useRequest<Data, Error>(applicationId ? requestConfig : null);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};
