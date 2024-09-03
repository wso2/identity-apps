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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Authorize an API to application.
 *
 * @param appId - application ID.
 * @param apiId - API ID.
 * @param addedScopes - added scopes.
 * @returns `Promise<null | IdentityAppsApiException>`
 * @throws `IdentityAppsApiException`
 */
export const authorizeAPI = (appId: string, apiId: string, scopes: string[], policyIdentifier: string)
    : Promise<null | IdentityAppsApiException> => {

    const requestConfig: AxiosRequestConfig = {
        data: {
            id: apiId,
            policyIdentifier: policyIdentifier,
            scopes: scopes
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.applications }/${ appId }/authorized-apis`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    response.data.description,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Remove authorized API in application.
 *
 * @param appId - application ID.
 * @param apiId - API ID.
 * @returns `Promise<null | IdentityAppsApiException>`
 * @throws `IdentityAppsApiException`
 */
export const removeAuthorizedAPI = (appId: string, apiId: string): Promise<null | IdentityAppsApiException> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.applications }/${ appId }/authorized-apis/${ apiId }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    response.data.description,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update authorized scopes in an authorized API.
 *
 * @param appId - application ID.
 * @param apiId - API ID.
 * @returns `Promise<null | IdentityAppsApiException>`
 * @throws `IdentityAppsApiException`
 */
export const patchScopesOfAuthorizedAPI = (appId: string, apiId: string, addedScopes: string[], deletedScopes: string[])
    : Promise<null | IdentityAppsApiException> => {

    const requestConfig: AxiosRequestConfig = {
        data: {
            addedScopes: addedScopes,
            removedScopes: deletedScopes
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.applications }/${ appId }/authorized-apis/${ apiId }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    response.data.description,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
