/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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
import { OrganizationType } from "@wso2is/common";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../../../features/core/store";
import { getTenantResourceEndpoints } from "../configs";
import { TenantRequestResponse } from "../models";

export const getDomainQueryParam = (): string => {
    const tenantDomain: string = store.getState().auth.tenantDomain;

    return `?domain=${ tenantDomain }`;
};

const isPrivilegedUser = (): boolean => {
    const isPrivileged: boolean = store.getState()?.auth?.isPrivilegedUser ?? false;

    return isPrivileged;
};

/**
 * Initialize an axios Http client.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());


/**
 * Create new tenant.
 *
 * @param tenantName - new tenant name
 */
export const addNewTenant = (tenantName: string): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        data: {
            domain: tenantName
        },
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientOrigin,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: getTenantResourceEndpoints().tenantManagementApi + getDomainQueryParam()
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
 * Make a tenant the user's default tenant.
 *
 * @param tenantName - new tenant name
 */
export const makeTenantDefault = (tenantName: string): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost
        },
        method: HttpMethods.PUT,
        url: getTenantResourceEndpoints().tenantManagementApi + "/default/" + tenantName + getDomainQueryParam()
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
 * Check whether the new tenant already exists in the system.
 *
 * @param tenantName - new tenant name
 */
export const checkDuplicateTenants = (tenantName: string): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientOrigin
        },
        method: HttpMethods.HEAD,
        url: getTenantResourceEndpoints().tenantManagementApi + "/" + tenantName + getDomainQueryParam()
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
 * Get the tenants associated with the current user.
 *
 * @returns - A promise that resolves with the tenant request response object.
 */
export const getAssociatedTenants = (): Promise<TenantRequestResponse> => {
    const orgType: OrganizationType = store.getState().organization.organizationType;

    // If the user is a privileged user or the function is being called inside a suborganization,
    // return an empty response.
    if (isPrivilegedUser() || orgType === OrganizationType.SUBORGANIZATION) {
        return Promise.resolve({
            associatedTenants: [],
            count: 0,
            startIndex: 0,
            totalResults: 0
        });
    }

    const requestConfig: AxiosRequestConfig = {
        method: HttpMethods.GET,
        url: getTenantResourceEndpoints().tenantAssociationApi + getDomainQueryParam()
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};
