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

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { staticDecorator } from "../helpers";
import { AxiosHttpClientInstance, HttpClient, HttpClientStatic } from "../models";

/**
 * An Axios Http client to perform Http requests.
 *
 * @remarks
 * Typescript doesn't support static functions in interfaces. Therefore,
 * a decorator i.e `staticDecorator` was written to add static support.
 * Follow {@link https://github.com/Microsoft/TypeScript/issues/13462}
 * for more info.
 *
 * @example
 * Example usage.
 * ```
 * import { AxiosHttpClient } from "@wso2is/http";
 *
 * const httpClient = AxiosHttpClient.getInstance();
 * httpClient.init(true, onRequestStart, onRequestSuccess, onRequestError, onRequestFinish);
 * ```
 */
@staticDecorator<HttpClientStatic<AxiosHttpClientInstance>>()
export class AxiosHttpClient implements HttpClient<AxiosRequestConfig, AxiosResponse, AxiosError> {

    private static axiosInstance: AxiosHttpClientInstance;
    private static clientInstance: AxiosHttpClient;
    private static isHandlerEnabled: boolean;
    private requestStartCallback: (request: AxiosRequestConfig) => void;
    private requestSuccessCallback: (response: AxiosResponse) => void;
    private requestErrorCallback: (error: AxiosError) => void;
    private requestFinishCallback: () => void;
    private static readonly DEFAULT_HANDLER_DISABLE_TIMEOUT: number = 1000;

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    private constructor() {
        this.init = this.init.bind(this);
    }

    /**
     * Returns an aggregated instance of type `AxiosInstance` of `AxiosHttpClient`.
     *
     * @return {any}
     */
    public static getInstance(): AxiosHttpClientInstance {
        if (this.axiosInstance) {
            return this.axiosInstance;
        }

        this.axiosInstance = axios.create({
            withCredentials: true
        });

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

        // Add the missing helper methods from axios
        this.axiosInstance.all = axios.all;
        this.axiosInstance.spread = axios.spread;

        // Add the init method from the `AxiosHttpClient` instance.
        this.axiosInstance.init = this.clientInstance.init;

        // Add the handler enabling & disabling methods to the instance.
        this.axiosInstance.enableHandler = this.clientInstance.enableHandler;
        this.axiosInstance.disableHandler = this.clientInstance.disableHandler;
        this.axiosInstance.disableHandlerWithTimeout = this.clientInstance.disableHandlerWithTimeout;

        return this.axiosInstance;
    }

    /**
     * Intercepts all the requests.
     * If the `isHandlerEnabled` flag is set to true, fires the `requestStartCallback`
     * and retrieves the access token from the server and attaches it to the request.
     * Else, just returns the original request.
     *
     * @param {AxiosRequestConfig} request - Original request.
     * @return {AxiosRequestConfig}
     */
    public requestHandler(request: AxiosRequestConfig): AxiosRequestConfig {
        if (AxiosHttpClient.isHandlerEnabled) {
            if (this.requestStartCallback && typeof this.requestStartCallback === "function") {
                this.requestStartCallback(request);
            }
        }
        return request;
    }

    /**
     * Handles response errors.
     * If the `isHandlerEnabled` flag is set to true, fires the `requestErrorCallback`
     * and the `requestFinishCallback` functions. Else, just returns the original error.
     *
     * @param {AxiosError} error - Original error.
     * @return {AxiosError}
     */
    public errorHandler(error: AxiosError): AxiosError {
        if (AxiosHttpClient.isHandlerEnabled) {
            if (this.requestErrorCallback && typeof this.requestErrorCallback === "function") {
                this.requestErrorCallback(error);
            }
            if (this.requestFinishCallback && typeof this.requestFinishCallback === "function") {
                this.requestFinishCallback();
            }
        }
        throw error;
    }

    /**
     * Handles response success.
     * If the `isHandlerEnabled` flag is set to true, fires the `requestSuccessCallback`
     * and the `requestFinishCallback` functions. Else, just returns the original response.
     *
     * @param {AxiosResponse} response - Original response.
     * @return {AxiosResponse}
     */
    public successHandler(response: AxiosResponse): AxiosResponse {
        if (AxiosHttpClient.isHandlerEnabled) {
            if (this.requestSuccessCallback && typeof this.requestSuccessCallback === "function") {
                this.requestSuccessCallback(response);
            }
            if (this.requestFinishCallback && typeof this.requestFinishCallback === "function") {
                this.requestFinishCallback();
            }
        }
        return response;
    }

    /**
     * Initializes the Http client.
     *
     * @param isHandlerEnabled - Flag to toggle handler enablement.
     * @param requestStartCallback - Callback function to be triggered on request start.
     * @param requestSuccessCallback - Callback function to be triggered on request success.
     * @param requestErrorCallback - Callback function to be triggered on request error.
     * @param requestFinishCallback - Callback function to be triggered on request error.
     */
    public init(
        isHandlerEnabled = true,
        requestStartCallback: (request: AxiosRequestConfig) => void,
        requestSuccessCallback: (response: AxiosResponse) => void,
        requestErrorCallback: (error: AxiosError) => void,
        requestFinishCallback: () => void
    ): void {
        AxiosHttpClient.isHandlerEnabled = isHandlerEnabled;

        if (this.requestStartCallback
            && this.requestSuccessCallback
            && this.requestErrorCallback
            && this.requestFinishCallback) {
            return;
        }

        if (!this.requestStartCallback) {
            this.requestStartCallback = requestStartCallback;
        }
        if (!this.requestSuccessCallback) {
            this.requestSuccessCallback = requestSuccessCallback;
        }
        if (!this.requestErrorCallback) {
            this.requestErrorCallback = requestErrorCallback;
        }
        if (!this.requestFinishCallback) {
            this.requestFinishCallback = requestFinishCallback;
        }
    }

    /**
     * Enables the handler.
     */
    public enableHandler() {
        AxiosHttpClient.isHandlerEnabled = true;
    }

    /**
     * Disables the handler.
     */
    public disableHandler() {
        AxiosHttpClient.isHandlerEnabled = false;
    }

    /**
     * Disables the handler for a given period of time.
     *
     * @param {number} timeout - Timeout in milliseconds.
     */
    public disableHandlerWithTimeout(timeout: number = AxiosHttpClient.DEFAULT_HANDLER_DISABLE_TIMEOUT) {
        AxiosHttpClient.isHandlerEnabled = false;

        setTimeout(() => {
            AxiosHttpClient.isHandlerEnabled = true;
        }, (timeout));
    }
}
