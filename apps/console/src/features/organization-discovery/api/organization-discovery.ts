/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import {
    AsgardeoSPAClient,
    HttpClientInstance,
    HttpError,
    HttpRequestConfig,
    HttpResponse
} from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../core";
import {
    OrganizationDiscoveryAttributeDataInterface,
    OrganizationDiscoveryConfigInterface,
    OrganizationListInterface,
    OrganizationListWithDiscoveryInterface,
    OrganizationResponseInterface
} from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Get organization discovery configurations.
 *
 * @returns a promise containing the response
 */
export const getOrganizationDiscoveryConfig = (
): Promise<OrganizationDiscoveryConfigInterface> => {
    const config: HttpRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "GET",
        url: `${ store.getState().config.endpoints.organizations }/organization-configs/discovery`
    };

    return httpClient(config)
        .then((response: HttpResponse<OrganizationDiscoveryConfigInterface>) => {
            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Add organization discovery configurations
 *
 * @param properties - Data that needs to be updated.
 */
export const addOrganizationDiscoveryConfig = (
    properties: OrganizationDiscoveryConfigInterface
): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        data: properties,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.organizations }/organization-configs/discovery`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 201) {
                return Promise.reject(new Error("Failed to add organization discovery configs."));
            }

            return Promise.resolve(response?.data);
        }).catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Delete organization discovery configurations.
 *
 * @returns a promise containing the response
 */
export const deleteOrganizationDiscoveryConfig = (
): Promise<string> => {
    const config: HttpRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "DELETE",
        url: `${ store.getState().config.endpoints.organizations }/organization-configs/discovery`
    };

    return httpClient(config)
        .then((response: HttpResponse) => {
            if (response?.status !== 204) {
                return Promise.reject(new Error("Failed to delete organization discovery configs."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Get a list of organizations.
 *
 * @param filter - The filter query.
 * @param _offset - The maximum number of organizations to return.
 * @param _limit  - Number of records to skip for pagination.
 *
 * @returns a promise containing the response
 */
export const getOrganizationDiscovery = (
    filter?: string,
    _offset?: number,
    _limit?: number
): Promise< OrganizationListWithDiscoveryInterface> => {
    const config: HttpRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "GET",
        params: {
            filter
        },
        url: `${ store.getState().config.endpoints.organizations }/organizations/discovery`
    };

    return httpClient(config)
        .then((response: HttpResponse< OrganizationListWithDiscoveryInterface>) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get organizations with email domain attributes."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Get the organization discovery data with the given id.
 *
 * @param id - The organization id.
 *
 * @returns a promise containing the response
 */
export const getOrganizationDiscoveryAttributes = (id: string): 
Promise<OrganizationDiscoveryAttributeDataInterface> => {
    const config: HttpRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "GET",
        url: `${ store.getState().config.endpoints.organizations }/organizations/${ id }/discovery`
    };

    return httpClient(config)
        .then((response: HttpResponse<OrganizationDiscoveryAttributeDataInterface>) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get the organization."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: IdentityAppsApiException) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Update discovery attributes of an organization.
 *
 * @param properties - Data that needs to be updated.
 */
export const updateOrganizationDiscoveryAttributes = (
    id: string,
    properties: OrganizationDiscoveryAttributeDataInterface
): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        data: properties,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${ store.getState().config.endpoints.organizations }/organizations/${ id }/discovery`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update organization discovery attributes."));
            }

            return Promise.resolve(response?.data);
        }).catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

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
        url: `${ store.getState().config.endpoints.organizations }/organizations/${ id }`
    };

    return httpClient(config)
        .then((response: HttpResponse<OrganizationResponseInterface>) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get the organization."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: IdentityAppsApiException) => {
            return Promise.reject(error?.response?.data);
        });
};
