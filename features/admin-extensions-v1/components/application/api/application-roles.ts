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
import { store } from "../../../../admin-core-v1";
import useRequest, { 
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../../../admin-core-v1/hooks/use-request";
import { 
    ApplicationRoleGroupsAPIResponseInterface,
    ApplicationRoleGroupsUpdatePayloadInterface,
    ApplicationRolesResponseInterface, 
    AuthorizedAPIListItemInterface, 
    CreateRolePayloadInterface, 
    DescendantDataInterface, 
    SharedApplicationAPIResponseInterface, 
    SharedApplicationDataInterface, 
    UpdateRolePayloadInterface
} from "../models";

/**
 * Initialize an axios Http client.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Get the application roles of the application.
 *
 * @param appId - Application ID.
 * @param before - Before link.
 * @param after - After link.
 * @param filter - Filter query.
 * @param limit - Limit.
 * 
 * @returns A promise containing the response.
 */
export const getApplicationRolesList = (
    appId: string,
    before: string,
    after: string,
    filter: string,
    limit: number
):Promise<ApplicationRolesResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        method: HttpMethods.GET,
        params: {
            after,
            before,
            filter,
            limit
        },
        url:  `${ store.getState().config.endpoints.authzEndpoint }/applications/${ appId }/roles`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data as ApplicationRolesResponseInterface);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get the authorized APIs of the application with authorized permissions.
 *
 * @param appId - Application ID.
 * 
 * @returns A promise containing the response.
 */
export const getAuthorizedAPIList = (appId: string):Promise<AuthorizedAPIListItemInterface[]> => {
    const requestConfig: AxiosRequestConfig = {
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.authzEndpoint }/applications/${ appId }/authorized-apis`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data as AuthorizedAPIListItemInterface[]);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Create an application roles for the application.
 *
 * @param appId - Application ID.
 * @param payload - Application role creation payload.
 * 
 * @returns A promise containing the response.
 */
export const createRole = (appId: string, payload: CreateRolePayloadInterface):Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        data: payload,
        method: HttpMethods.POST,
        url:  `${ store.getState().config.endpoints.authzEndpoint }/applications/${ appId }/roles`
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
 * Update the selected application role.
 *
 * @param appId - Application ID.
 * @param roleName - Selected role name.
 * @param payload - Application role creation payload.
 * 
 * @returns A promise containing the response.
 */
export const updateRolePermissions = ( 
    appId: string, 
    roleName: string, 
    payload: UpdateRolePayloadInterface
):Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        data: payload,
        method: HttpMethods.PATCH,
        url:  `${ store.getState().config.endpoints.authzEndpoint }/applications/${ appId }/roles/${ roleName }`
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
 * Delete the selected application role.
 *
 * @param appId - Application ID.
 * @param roleName - Selected role name.
 * 
 * @returns A promise containing the response.
 */
export const deleteRole = (appId: string, roleName: string):Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        method: HttpMethods.DELETE,
        url:  `${ store.getState().config.endpoints.authzEndpoint }/applications/${ appId }/roles/${ roleName }`
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
 * This get the shared application details of the parent app.
 *
 * @param appId - The application id
 * @param orgId - The current organization id
 * @returns the shared application details of a sub organization
 */
export const useSharedApplicationData = <Data = SharedApplicationAPIResponseInterface, 
    Error = RequestErrorInterface> (
        appId: string,
        orgId: string
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.organizations
        }/organizations/${ orgId }/applications/${ appId }/shared-apps`
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

/**
 * This will publish the created role to all shared applications via fluffy.
 *
 * @param appId - The application id
 * @param roleName - The application role name
 * @param sharedApplications - The shared applications list
 * @returns the promise containing the response
 */
export const createRoleInSharedApplications = (
    appId: string,
    roleName: string,
    sharedApplications: SharedApplicationDataInterface[]
): Promise<CreateRolePayloadInterface> => {
    const requestConfig: RequestConfigInterface = {
        data: {
            "shareTo": sharedApplications
        },
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.authzEndpoint }/applications/${ appId }/roles/${ roleName }/share`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * This get the mapped groups of an application role.
 *
 * @param appId - The application id
 * @param roleName - The application role name
 * @returns the role mapped groups of an application for a given role.
 */
export const useApplicationRoleMappedGroups = <Data = ApplicationRoleGroupsAPIResponseInterface, 
    Error = RequestErrorInterface> (
        appId: string,
        roleName: string
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.authzEndpoint
        }/applications/${ appId }/roles/${ roleName }/group-mapping`
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

/**
 * This get the invited user groups of an application role.
 *
 * @param appId - The application id
 * @param roleName - The application role name
 * @returns the role mapped groups of an application for a given role.
 */
export const useApplicationRoleInvitedUserGroups = <Data = ApplicationRoleGroupsAPIResponseInterface, 
    Error = RequestErrorInterface> (
        appId: string,
        roleName: string
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.authzEndpoint
        }/applications/${ appId }/roles/${ roleName }/cross-org-group-mapping`
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

/**
 * This will publish the created role to all shared applications via fluffy.
 *
 * @param appId - The application id
 * @param roleName - The application role name
 * @param applicationRoleGroupsPayload - The payload to update the mapped groups
 * @returns A promise containing the response.
 */
export const updateApplicationRoleMappedGroups = (
    appId: string,
    roleName: string,
    applicationRoleGroupsPayload: ApplicationRoleGroupsUpdatePayloadInterface
): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data: applicationRoleGroupsPayload,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.authzEndpoint
        }/applications/${ appId }/roles/${ roleName }/group-mapping`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * This get the identity providers of an application role.
 *
 * @param appId - The application id
 * @param roleName - The application role name
 * @param idpId - The identity provider id
 * @returns identity provider assigned groups
 */
export const useIdentityProviderAssignedGroups = <Data = ApplicationRoleGroupsAPIResponseInterface, 
    Error = RequestErrorInterface> (
        appId: string,
        roleName: string,
        idpId: string
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.authzEndpoint
        }/applications/${ appId }/roles/${ roleName }/identity-providers/${ idpId }/assigned-groups`
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

/**
 * This get the identity providers of an application role.
 *
 * @param appId - The application id
 * @param roleName - The application role name
 * @param idpId - The identity provider id
 * @param data - The payload to update the mapped groups
 * @returns identity provider assigned groups
 */
export const updateIdentityProviderAssignedGroups = (
    appId: string,
    roleName: string,
    idpId: string,
    data: ApplicationRoleGroupsUpdatePayloadInterface
): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data: data,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.authzEndpoint
        }/applications/${ appId }/roles/${ roleName }/identity-providers/${ idpId }/assigned-groups`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * This get the descendants of the sub organization.
 *
 * @returns descendants of the sub organization
 */
export const useDescendantsOfSubOrg = <Data = DescendantDataInterface[], 
    Error = RequestErrorInterface> (): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.breadcrumb
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};
