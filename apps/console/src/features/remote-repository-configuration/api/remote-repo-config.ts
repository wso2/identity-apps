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

import { IdentityClient } from "@wso2is/authentication";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../core";
import {
    InterfaceConfigDetails,
    InterfaceEditDetails,
    InterfaceRemoteRepoConfigDetails,
    InterfaceRemoteRepoListResponse } from "../models";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}.
 */
const httpClient = IdentityClient.getInstance().httpRequest.bind(IdentityClient.getInstance());

export const getRemoteRepoConfigList = (): Promise<AxiosResponse<InterfaceRemoteRepoListResponse>> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.remoteRepoConfig
    };
    return httpClient<InterfaceRemoteRepoListResponse>(requestConfig)
        .then((response: AxiosResponse<InterfaceRemoteRepoListResponse>) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

export const getRemoteRepoConfig = (id: string): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.remoteRepoConfig + "/" + id
    };
    return httpClient<InterfaceRemoteRepoListResponse>(requestConfig)
        .then((response: AxiosResponse<InterfaceRemoteRepoListResponse>) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

export const triggerConfigDeployment = (id: string): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.remoteRepoConfig + "/" + id + "/trigger"
    };
    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

export const getConfigDeploymentDetails = (id: string): Promise<AxiosResponse<InterfaceConfigDetails>> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.remoteRepoConfig + "/" + id + "/status"
    };
    return httpClient<InterfaceConfigDetails>(requestConfig)
        .then((response: AxiosResponse<InterfaceConfigDetails>) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

export const createRemoteRepoConfig = (configObj: InterfaceRemoteRepoConfigDetails): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        data: configObj,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.remoteRepoConfig
    };
    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

export const updateRemoteRepoConfig = (id: string, configObj: InterfaceEditDetails): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        data: configObj,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.remoteRepoConfig + "/" + id
    };
    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

export const deleteRemoteRepoConfig = (id: string): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.remoteRepoConfig + "/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}
