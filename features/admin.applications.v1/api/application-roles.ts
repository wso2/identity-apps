/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApplicationManagementConstants } from "../constants/application-management";
import {
    ShareApplicationWithAllOrganizationsDataInterface,
    ShareApplicationWithSelectedOrganizationsAndRolesDataInterface,
    ShareOrganizationsAndRolesPatchDataInterface,
    UnshareApplicationWithAllOrganizationsDataInterface,
    UnshareOrganizationsDataInterface
} from "../models/application";

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Share an application with all organizations with given roles.
 *
 * @param id - ID of the application.
 * @returns A promise containing the response.
 * @throws IdentityAppsApiException
 */
export const shareApplicationWithAllOrganizations = <T>(
    data: ShareApplicationWithAllOrganizationsDataInterface): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.applications }/share-with-all`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 202) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.APPLICATION_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.APPLICATION_STATUS_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * unshare an application with all organizations with given roles.
 *
 * @param id - ID of the application.
 * @returns A promise containing the response.
 * @throws IdentityAppsApiException
 */
export const unShareApplicationWithAllOrganizations = <T>(
    data: UnshareApplicationWithAllOrganizationsDataInterface): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.applications }/unshare-with-all`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 202) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.APPLICATION_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.APPLICATION_STATUS_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Share an application with selected organizations with selected roles.
 *
 * @param id - ID of the application.
 * @returns A promise containing the response.
 * @throws IdentityAppsApiException
 */
export const shareApplicationWithSelectedOrganizationsAndRoles = <T>(
    data: ShareApplicationWithSelectedOrganizationsAndRolesDataInterface): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.applications }/share`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 202) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.APPLICATION_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.APPLICATION_STATUS_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Add or remove roles from different organizations which the application is shared with.
 *
 * @param data - Data to be sent in the request body.
 * @returns A promise containing the response.
 * @throws IdentityAppsApiException
 */
export const editApplicationRolesOfExistingOrganizations = <T>(
    data: ShareOrganizationsAndRolesPatchDataInterface): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.applications }/share`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 202) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.APPLICATION_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.APPLICATION_STATUS_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Unshare an application from given organizations.
 *
 * @param id - ID of the application.
 * @returns A promise containing the response.
 * @throws IdentityAppsApiException
 */
export const unshareApplicationWithSelectedOrganizations = <T>(
    data: UnshareOrganizationsDataInterface): Promise<T> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.applications }/unshare`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 202) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.APPLICATION_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.APPLICATION_STATUS_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
