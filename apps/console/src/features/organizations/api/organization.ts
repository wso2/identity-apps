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
import { HttpMethods } from "@wso2is/core/src/models";
import { store } from "../../core";
import {
    AddOrganizationInterface,
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
 * @param {string} filter The filter query.
 * @param {number} limit The maximum number of organizations to return.
 * @param {string} after The previous range of data to be returned.
 * @param {string} before The next range of data to be returned.
 *
 * @returns {Promise<OrganizationListInterface>}
 */
export const getOrganizations = (
    filter: string,
    limit: number,
    after: string,
    before: string,
    recursive: boolean
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
        url: `${ store.getState().config.endpoints.organizations }/organizations`
    };

    console.log(config.url);

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
 * @param {AddOrganizationInterface} organization The organization to be added.
 *
 * @returns {Promise<AddOrganizationResponseInterface>}
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
 * @param {string} id The organization id.
 * @param {boolean} showChildren Specifies if the child organizations should be returned.
 *
 * @returns {Promise<OrganizationResponseInterface>}
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
 * @param {UpdateOrganizationInterface} organization The organization object to update the organization with.
 *
 * @returns {OrganizationResponseInterface}
 */
export const updateOrganization = (
    organization: UpdateOrganizationInterface
): Promise<OrganizationResponseInterface> => {
    const config: HttpRequestConfig = {
        data: organization,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "PUT",
        url: `${ store.getState().config.endpoints.organizations }/organizations/`
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
 * @param { string } organizationId - Organization ID which needs to be updated
 * @param { OrganizationPatchData[] } patchData - Data to be updated in the PatchData format
 *
 * @returns { OrganizationResponseInterface }
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
 * @param {string} id The organization id.
 *
 * @returns {Promise<string>}
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
