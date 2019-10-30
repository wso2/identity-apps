/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 *
 */

import { AuthenticateSessionUtil } from "@wso2is/authenticate";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class AxiosHttpClient {

    private static axiosInstance: AxiosInstance;
    private static clientInstance: AxiosHttpClient;

    /**
     * Private constructor to avoid object instantiation.
     */
    // tslint:disable-next-line:no-empty
    private constructor() {}

    public static getInstance(): AxiosInstance & any {
        if (!this.axiosInstance) {
            this.axiosInstance = axios.create();
        }

        if (!this.clientInstance) {
            this.clientInstance = new AxiosHttpClient();
        }

        // Register request interceptor
        this.axiosInstance.interceptors.request.use(
            (request) => this.clientInstance.requestHandler(request)
        );

        // Register response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => this.clientInstance.successHandler(response),
            (error) => this.clientInstance.errorHandler(error)
        );

        return { ...this.axiosInstance, ...this.clientInstance };
    }

    public requestHandler(request: AxiosRequestConfig): AxiosRequestConfig {
        return AuthenticateSessionUtil.getAccessToken()
            .then((token) => {
                request.headers.Authorization = `Bearer ${ token }`;
                return request;
            })
            .catch((error) => {
                return Promise.reject(`Failed to retrieve the access token: ${ error }`);
            });
    }

    public errorHandler(error: AxiosError): AxiosError {
        return error;
    }

    public successHandler(response: AxiosResponse): AxiosResponse {
        return response;
    }
}
