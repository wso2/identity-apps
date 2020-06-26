import {  InterfaceRemoteRepoListResponse, InterfaceRemoteRepoConfigDetails } from "../models";
import { store } from "../store";
import { HttpMethods } from "@wso2is/core/dist/src/models";
import { AxiosHttpClient } from "@wso2is/http";
import { AxiosResponse, AxiosRequestConfig } from "axios";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}.
 */
const httpClient = AxiosHttpClient.getInstance();


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
    return httpClient.request<InterfaceRemoteRepoListResponse>(requestConfig)
        .then((response: AxiosResponse<InterfaceRemoteRepoListResponse>) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

export const createRemoteRepoConfig = (configObj: InterfaceRemoteRepoConfigDetails): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        data: configObj,
        url: store.getState().config.endpoints.remoteRepoConfig
    };
    return httpClient.request<InterfaceRemoteRepoListResponse>(requestConfig)
        .then((response: AxiosResponse<InterfaceRemoteRepoListResponse>) => {
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

    return httpClient.request(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}
