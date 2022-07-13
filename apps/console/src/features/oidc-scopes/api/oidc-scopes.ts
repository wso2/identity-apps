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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import useRequest, { RequestErrorInterface, RequestResultInterface } from "../../core/hooks/use-request";
import { store } from "../../core/store";
import { sortList } from "../../core/utils";
import { OIDCScopesManagementConstants } from "../constants";
import { OIDCScopesListInterface } from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Get the OIDC scopes in the system.
 *
 * @return {Promise<T>} Promise of type T.
 * @throws {IdentityAppsApiException}
 */
export const getOIDCScopesList = <T = {}>(): Promise<T> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.oidcScopes
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    OIDCScopesManagementConstants.OIDC_SCOPES_FETCH_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                OIDCScopesManagementConstants.OIDC_SCOPES_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Hook to get the OIDC scopes list.
 *
 * @param {string} sortBy - Sort by attribute.
 * @param {"ASC" | "DESC"} sortOrder - Sort order.
 * @returns {RequestResultInterface<Data, Error>}
 */
export const useOIDCScopesList = <Data = OIDCScopesListInterface, Error = RequestErrorInterface>(
    sortBy?: string,
    sortOrder?: "ASC" | "DESC"
): RequestResultInterface<Data[], Error> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.oidcScopes
    };

    const { data: rawData, error, isValidating, mutate } = useRequest<Data[], Error>(requestConfig);

    const moderatedData = (sortBy && sortOrder)
        ? sortList(rawData, sortBy, sortOrder === "ASC")
        : rawData;

    return {
        data: moderatedData,
        error,
        isLoading: !error && !moderatedData,
        isValidating,
        mutate
    };
};

/**
 * Get the details of an OIDC scope.
 *
 * @param scope - name of the scope
 *
 * @return {Promise<T>} Promise of type T.
 * @throws {IdentityAppsApiException}
 */
export const getOIDCScopeDetails = <T>(scope: string): Promise<T> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.oidcScopes + "/" + scope
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    OIDCScopesManagementConstants.OIDC_SCOPE_DETAILS_FETCH_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                OIDCScopesManagementConstants.OIDC_SCOPE_DETAILS_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Create new OIDC scope.
 *
 * @param data
 *
 * @return {Promise<T>} Promise of type T.
 * @throws {IdentityAppsApiException}
 */
export const createOIDCScope = <T>(data: OIDCScopesListInterface): Promise<T> => {
    const requestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.oidcScopes
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 201) {
                throw new IdentityAppsApiException(
                    OIDCScopesManagementConstants.OIDC_SCOPE_CREATE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                OIDCScopesManagementConstants.OIDC_SCOPE_CREATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update the details of an OIDC scope.
 *
 * @param scopeName
 * @param data
 *
 * @return {Promise<T>} Promise of type T.
 * @throws {IdentityAppsApiException}
 */
export const updateOIDCScopeDetails = <T>(scopeName: string, data: OIDCScopesListInterface): Promise<T> => {
    const requestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.oidcScopes + "/" + scopeName
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    OIDCScopesManagementConstants.OIDC_SCOPE_UPDATE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                OIDCScopesManagementConstants.OIDC_SCOPE_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Deletes an OIDC scope.
 *
 * @param scope - name of the scope
 *
 * @return {Promise<T>} Promise of type T.
 * @throws {IdentityAppsApiException}
 */
export const deleteOIDCScope = <T>(scope: string): Promise<T> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.oidcScopes + "/" + scope
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    OIDCScopesManagementConstants.OIDC_SCOPE_DELETE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as T);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                OIDCScopesManagementConstants.OIDC_SCOPE_DELETE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
