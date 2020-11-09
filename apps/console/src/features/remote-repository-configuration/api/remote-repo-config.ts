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

import { IdentityClient } from "@asgardio/oidc-js";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../core";
import { RemoteFetchConstants } from "../constants";
import {
    InterfaceConfigDetails,
    InterfaceEditDetails,
    InterfaceRemoteConfigDetails,
    InterfaceRemoteRepoConfigDetails,
    InterfaceRemoteRepoListResponse
} from "../models";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}.
 */
const httpClient = IdentityClient.getInstance().httpRequest.bind(IdentityClient.getInstance());

/**
 * Fetch repo config list.
 *
 * @return {Promise<AxiosResponse<InterfaceRemoteRepoListResponse>>}
 * @throws {IdentityAppsApiException}
 */
export const getRemoteRepoConfigList = (): Promise<AxiosResponse<InterfaceRemoteRepoListResponse>> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.remoteFetchConfig
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<InterfaceRemoteRepoListResponse>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    RemoteFetchConstants.GET_REPO_CONFIG_LIST_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                RemoteFetchConstants.GET_REPO_CONFIG_LIST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Fetch repo config details.
 *
 * @param {string} id - Repo config ID
 * @return {Promise<AxiosResponse<InterfaceRemoteConfigDetails>>}
 * @throws {IdentityAppsApiException}
 */
export const getRemoteRepoConfig = (id: string): Promise<AxiosResponse<InterfaceRemoteConfigDetails>> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.remoteFetchConfig + "/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<InterfaceRemoteRepoListResponse>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    RemoteFetchConstants.GET_REPO_CONFIG_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                RemoteFetchConstants.GET_REPO_CONFIG_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Triggers a repo config deployment.
 *
 * @param {string} id - Repo config id.
 * @return {Promise<AxiosResponse>}
 * @throws {IdentityAppsApiException}
 */
export const triggerConfigDeployment = (id: string): Promise<AxiosResponse> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.remoteFetchConfig + "/" + id + "/trigger"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 202) {
                throw new IdentityAppsApiException(
                    RemoteFetchConstants.TRIGGER_CONFIG_DEPLOYMENT_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                RemoteFetchConstants.TRIGGER_CONFIG_DEPLOYMENT_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Get remote repo deployment details.
 *
 * @param {string} id - Repo config id.
 * @return {Promise<AxiosResponse<InterfaceConfigDetails>>}
 * @throws {IdentityAppsApiException}
 */
export const getConfigDeploymentDetails = (id: string): Promise<AxiosResponse<InterfaceConfigDetails>> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.remoteFetchConfig + "/" + id + "/status"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<InterfaceConfigDetails>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    RemoteFetchConstants.GET_CONFIG_DEPLOYMENT_DETAILS_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }
            return Promise.resolve(response);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                RemoteFetchConstants.GET_CONFIG_DEPLOYMENT_DETAILS_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Creates a repo config using the REST API.
 *
 * @param {InterfaceRemoteRepoConfigDetails} configObj - Configuration object.
 * @return {Promise<AxiosResponse>}
 * @throws {IdentityAppsApiException}
 */
export const createRemoteRepoConfig = (configObj: InterfaceRemoteRepoConfigDetails): Promise<AxiosResponse> => {

    const requestConfig: AxiosRequestConfig = {
        data: configObj,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.remoteFetchConfig
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 201) {
                throw new IdentityAppsApiException(
                    RemoteFetchConstants.CREATE_REPO_CONFIG_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                RemoteFetchConstants.CREATE_REPO_CONFIG_CREATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update remote repo config.
 *
 * @param {string} id - Repo config id.
 * @param {InterfaceEditDetails} configObj
 * @return {Promise<AxiosResponse>}
 * @throws {IdentityAppsApiException}
 */
export const updateRemoteRepoConfig = (id: string, configObj: InterfaceEditDetails): Promise<AxiosResponse> => {

    const requestConfig: AxiosRequestConfig = {
        data: configObj,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.remoteFetchConfig + "/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                RemoteFetchConstants.UPDATE_REPO_CONFIG_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Delete remote repo config.
 *
 * @param {string} id - Repo config id.
 * @return {Promise<AxiosResponse>}
 * @throws {IdentityAppsApiException}
 */
export const deleteRemoteRepoConfig = (id: string): Promise<AxiosResponse> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.remoteFetchConfig + "/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                RemoteFetchConstants.DELETE_REPO_CONFIG_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
