/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
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

import { AsgardeoSPAClient, HttpError, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { store } from "../../core";
import useRequest, { RequestResultInterface } from "../../core/hooks/use-request";
import {
    AddOrganizationInterface,
    OrganizationInterface,
    OrganizationListInterface,
    OrganizationPatchData,
    OrganizationResponseInterface,
    UpdateOrganizationInterface
} from "../models";

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
 * @param filter - The filter query.
 * @param limit - The maximum number of organizations to return.
 * @param after - The previous range of data to be returned.
 * @param before - The next range of data to be returned.
 * @param recursive - Whether we need to do a recursive search
 * @param isRoot - Whether the organization is the root
 *
 * @returns a promise containing the response
 */
export const getOrganizations = (
    filter: string,
    limit: number,
    after: string,
    before: string,
    recursive: boolean,
    isRoot: boolean = false
): Promise<OrganizationListInterface> => {
    const config: HttpRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "GET",
        params: {
            after,
            before,
            filter,
            limit,
            recursive
        },
        url: `${ isRoot
            ? store.getState().config.endpoints.rootOrganization
            : store.getState().config.endpoints.organizations }/organizations`
    };

    return httpClient(config)
        .then((response: HttpResponse<OrganizationListInterface>) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get organizations."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Create an organization.
 *
 * @param organization - The organization to be added.
 *
 * @returns a promise containing the response
 */
export const addOrganization = (organization: AddOrganizationInterface): Promise<OrganizationResponseInterface> => {
    const config: HttpRequestConfig = {
        data: organization,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        url: `${ store.getState().config.endpoints.organizations }/organizations`
    };

    return httpClient(config)
        .then((response: HttpResponse<OrganizationResponseInterface>) => {
            if (response.status !== 201) {
                return Promise.reject(new Error("Failed to create organization."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Get the organization with the given id.
 *
 * @param id - The organization id.
 * @param showChildren - Specifies if the child organizations should be returned.
 *
 * @returns a promise containing the response
 */
export const getOrganization = (id: string, showChildren?: boolean): Promise<OrganizationResponseInterface> => {
    const config: HttpRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "GET",
        params: {
            showChildren
        },
        url: `${store.getState().config.endpoints.organizations}/organizations/${id}`
    };

    return httpClient(config)
        .then((response: HttpResponse<OrganizationResponseInterface>) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get the organization."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Update an organization.
 *
 * @param organizationId - Identifier of the organization needs to be updated.
 * @param organization - The organization object to update the organization with.
 *
 * @returns OrganizationResponseInterface
 */
export const updateOrganization = (
    organizationId: string,
    organization: UpdateOrganizationInterface
): Promise<OrganizationResponseInterface> => {
    const config: HttpRequestConfig = {
        data: organization,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "PUT",
        url: `${ store.getState().config.endpoints.organizations }/organizations/${organizationId}`
    };

    return httpClient(config)
        .then((response: HttpResponse<OrganizationResponseInterface>) => {
            if (response?.status !== 200) {
                return Promise.reject(new Error("Failed to update the organization."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Patch update an organization
 *
 * @param organizationId - Organization ID which needs to be updated
 * @param patchData - Data to be updated in the PatchData format
 *
 * @returns OrganizationResponseInterface
 */
export const patchOrganization = (
    organizationId: string,
    patchData: OrganizationPatchData[]
): Promise<OrganizationResponseInterface> => {
    const config: HttpRequestConfig = {
        data: patchData,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.organizations }/organizations/${organizationId}`
    };

    return httpClient(config)
        .then((response: HttpResponse<OrganizationResponseInterface>) => {
            if (response?.status !== 200) {
                return Promise.reject(new Error("Failed to update the organization."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Delete an organization.
 *
 * @param id - The organization id.
 *
 * @returns a promise containing the response
 */
export const deleteOrganization = (id: string): Promise<string> => {
    const config: HttpRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "DELETE",
        url: `${ store.getState().config.endpoints.organizations }/organizations/${ id }`
    };

    return httpClient(config)
        .then((response: HttpResponse) => {
            if (response?.status !== 204) {
                return Promise.reject(new Error("Failed to delete the organization."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Creates a new application.
 *
 * @param currentOrganizationId - Current Organization Id
 * @param applicationId - ID of the application to be shared
 * @param organizationIds - ID of the organization which the app needs to be shared with
 * 
 * @returns a promise containing the response
 */
export const shareApplication = (
    currentOrganizationId: string,
    applicationId: string,
    organizationIds: Array<string>
): Promise<any> => {
    const requestConfig = {
        data: organizationIds,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${store.getState().config.endpoints.organizations}/organizations/${currentOrganizationId}/applications/` +
            `${applicationId}/share`
    };

    return httpClient(requestConfig)
        .then((response) => {
            if ((response.status !== 200)) {
                return Promise.reject(new Error("Failed to share the application."));
            }

            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Delete / Stop sharing an application to an organization by providing its ID
 */
export const stopSharingApplication = (
    currentOrganizationId: string,
    applicationId: string,
    sharedOrganizationId: string
): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.organizations}/organizations/${currentOrganizationId}/applications/` +
            `${applicationId}/share/${sharedOrganizationId}`
    };

    return httpClient(requestConfig)
        .then((response) => {
            if ((response.status !== 204)) {
                return Promise.reject(new Error("Failed to remove the application sharing."));
            }

            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get the list of organizations given app is shared with.
 */
export const getSharedOrganizations = (
    currentOrganizationId: string,
    applicationId: string
): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.organizations}/organizations/${currentOrganizationId}/applications/` +
            `${applicationId}/share`
    };

    return httpClient(requestConfig)
        .then((response) => {
            if ((response.status !== 200)) {
                return Promise.reject(new Error("Failed to get the list of shared organizations of this application."));
            }

            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the super organization of the current user.
 *
 * @returns The super organization of the user.
 */
export const useGetUserSuperOrganization = (): RequestResultInterface<OrganizationInterface, Error> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.usersSuperOrganization
    };

    return useRequest<OrganizationInterface, Error>(requestConfig);
};
