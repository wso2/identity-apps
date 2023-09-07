/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods, ProfileInfoInterface } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../core/hooks/use-request";
import { store } from "../../core/store";
import { PatchRoleDataInterface } from "../../roles/models";
import { UserManagementConstants } from "../constants";
import { UserDetailsInterface, UserListInterface, UserSessionsInterface } from "../models";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Retrieve the list of users that are currently in the system.
 *
 * @returns a promise containing the user list.
 */
export const getUsersList = (
    count: number, 
    startIndex: number, 
    filter: string, 
    attributes: string, 
    domain: string,
    excludedAttributes?: string
):
    Promise<UserListInterface> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            attributes,
            count,
            domain,
            excludedAttributes,
            filter,
            startIndex
        },
        url: store.getState().config.endpoints.users
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data as UserListInterface);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Hook to get the users list with limit and offset.
 *
 * @param count - The number of users to be returned. 
 * @param startIndex - The index of the first user to be returned.
 * @param filter - The filter to be applied to the users.
 * @param attributes - The attributes to be returned. 
 * @param domain - The domain of the users.
 * @param excludedAttributes - The attributes to be excluded. 
 * @returns users list.
 */
export const useUsersList = (
    count: number, 
    startIndex: number, 
    filter: string, 
    attributes: string, 
    domain: string,
    excludedAttributes?: string,
    shouldFetch: boolean = true
): RequestResultInterface<UserListInterface, RequestErrorInterface> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            attributes,
            count,
            domain,
            excludedAttributes,
            filter,
            startIndex
        },
        url: store.getState().config.endpoints.users
    };

    const {
        data,
        error,
        isValidating,
        mutate
    } = useRequest<UserListInterface, RequestErrorInterface>(shouldFetch ? requestConfig : null);

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

/**
 * Add new user.
 *
 * @param data - request payload
 *
 * @returns a promise containing the response.
 */
export const addUser = (data: UserDetailsInterface): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.users
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
 * Delete user.
 *
 * @param user - id
 *
 * @returns a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteUser = (userId: string): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.users + "/" + userId
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
 * Add role to new user.
 *
 * @param groupId - Group ID.
 * @param data - Request payload
 * @returns a promise containing the response.
 */
export const addUserRole = (data: object, groupId: string): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.groups + "/" + groupId
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
 * Retrieve the user information through user id.
 *
 * @returns a promise containing the response.
 */
export const getUserDetails = (id: string, attributes: string): Promise<ProfileInfoInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            attributes
        },
        url: store.getState().config.endpoints.users + "/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data as ProfileInfoInterface);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(`Failed to retrieve user information - ${error}`);
        });
};

/**
 * Update the required details of the user profile.
 *
 * @param userId - User ID.
 * @param data - Data to be updated.
 * @returns a promise containing the response.
 */
export const updateUserInfo = (userId: string, data: PatchRoleDataInterface): Promise<ProfileInfoInterface> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.users + "/" + userId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data as ProfileInfoInterface);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                UserManagementConstants.USER_INFO_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Retrieves information related to the active sessions of a user identified by the user-id.
 *
 * @param userId - User ID.
 * @returns a promise containing the response.
 */
export const getUserSessions = (userId: string): Promise<AxiosResponse<UserSessionsInterface>> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.userSessions.replace("{0}", userId)
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<UserSessionsInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    UserManagementConstants.GET_USER_SESSIONS_REQUEST_INVALID_STATUS_CODE_ERROR,
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
                UserManagementConstants.GET_USER_SESSIONS_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Terminates a specific user session of a user.
 *
 * @param userId - User ID.
 * @param sessionId - ID of the session.
 * @returns a promise containing the response.
 */
export const terminateUserSession = (userId: string, sessionId: string): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.userSessions.replace("{0}", userId) + `/${ sessionId }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<UserSessionsInterface>) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    UserManagementConstants.TERMINATE_USER_SESSION_REQUEST_INVALID_STATUS_CODE_ERROR,
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
                UserManagementConstants.TERMINATE_USER_SESSION_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Terminates all the user session of a user.
 *
 * @param userId - User ID.
 * @returns a promise containing the response.
 */
export const terminateAllUserSessions = (userId: string): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.userSessions.replace("{0}", userId)
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<UserSessionsInterface>) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    UserManagementConstants.TERMINATE_ALL_USER_SESSIONS_REQUEST_INVALID_STATUS_CODE_ERROR,
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
                UserManagementConstants.TERMINATE_ALL_USER_SESSIONS_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
