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

import {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse
} from "axios";
import * as AUTHENTICATION_TYPES from "./constants";
import { AxiosHttpClient, AxiosHttpClientInstance } from "./http-client";
import {
    ConfigInterface,
    CustomGrantRequestParams,
    ServiceResourcesType,
    WebWorkerClientInterface,
    WebWorkerConfigInterface
} from "./models";
import {
    customGrant as customGrantUtil,
    getServiceEndpoints,
    getSessionParameter,
    handleSignIn,
    handleSignOut,
    sendRevokeTokenRequest
} from "./utils";
import { WebWorkerClient } from "./worker";

/**
 * Default configurations.
 */
const DefaultConfig = {
    authorizationType: AUTHENTICATION_TYPES.AUTHORIZATION_CODE_TYPE,
    clientSecret: null,
    consentDenied: false,
    enablePKCE: true,
    responseMode: null,
    scope: [AUTHENTICATION_TYPES.OIDC_SCOPE]
};

const NOT_AVAILABLE_ERROR = "This is available only when the storage is set to \"WebWorker\"";

/**
 * IdentityClient class constructor.
 *
 * @export
 * @class IdentityClient
 * @implements {ConfigInterface} - Configuration interface.
 */
export class IdentityClient {
    private _authConfig: ConfigInterface | WebWorkerConfigInterface;
    private static _instance: IdentityClient;
    private _client: WebWorkerClientInterface;
    private _storage: AUTHENTICATION_TYPES.Storage;
    private _initialized: boolean;
    private _onSignInCallback: () => void;
    private _onHttpRequestStart: () => void;
    private _onHttpRequestSuccess: (response: AxiosResponse) => void;
    private _onHttpRequestFinish: () => void;
    private _onHttpRequestError: (error: AxiosError) => void;
    private _httpClient: AxiosHttpClientInstance;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new IdentityClient();

        return this._instance;
    }

    public initialize(config: ConfigInterface) {
        this._storage = config.storage ?? AUTHENTICATION_TYPES.Storage.SessionStorage;
        this._initialized = true;

        const startCallback = (request: AxiosRequestConfig): void => {
            request.headers = {
                ...request.headers,
                Authorization: `Bearer ${getSessionParameter(AUTHENTICATION_TYPES.ACCESS_TOKEN,config)}`
            };

            this._onHttpRequestStart && typeof this._onHttpRequestStart === "function" && this._onHttpRequestStart();
        };

        this._httpClient = AxiosHttpClient.getInstance();
        this._httpClient.init(
            true,
            startCallback,
            this._onHttpRequestSuccess,
            this._onHttpRequestError,
            this._onHttpRequestFinish
        );

        if (config.storage === AUTHENTICATION_TYPES.Storage.SessionStorage) {
            this._authConfig = { ...DefaultConfig, ...config };

            return Promise.resolve(true);
        } else {
            this._client = WebWorkerClient.getInstance();

            return this._client
                .initialize(config)
                .then(() => {
                    return Promise.resolve(true);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }
    }

    public getUserInfo() {
        // TODO: Implement
        return;
    }

    public validateAuthentication() {
        // TODO: Implement
        return;
    }

    /**
     * Sign-in method.
     *
     * @param {() => void} [callback] - Callback method to run on successful sign-in
     * @returns {Promise<any>} promise.
     * @memberof IdentityClient
     */
    public async signIn(): Promise<any> {
        if (this._storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this._client.signIn().then(response => {
                if (this._onSignInCallback && typeof this._onSignInCallback === "function") {
                    this._onSignInCallback();
                }

                return Promise.resolve(response);
            }).catch(error => {
                return Promise.reject(error);
            });
        }

        return handleSignIn(this._authConfig);
    }

    /**
     * Sign-out method.
     *
     * @param {() => void} [callback] - Callback method to run on successful sign-in
     * @returns {Promise<any>} promise.
     * @memberof IdentityClient
     */
    public async signOut(): Promise<any> {
        if (this._storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this._client.signOut();
        }

        return handleSignOut(this._authConfig);
    }

    public async httpRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
        if (this._storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this._client.httpRequest(config);
        }

        return Promise.reject(NOT_AVAILABLE_ERROR);
    }

    public async httpRequestAll(config: AxiosRequestConfig[]): Promise<AxiosResponse[]> {
        if (this._storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this._client.httpRequestAll(config);
        }

        return Promise.reject(NOT_AVAILABLE_ERROR);
    }

    public async customGrant(requestParams: CustomGrantRequestParams): Promise<any> {
        if (this._storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this._client.customGrant(requestParams);
        }

        return customGrantUtil(requestParams, this._authConfig);
    }

    public async endUserSession(): Promise<any> {
        if (this._storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this._client.endUserSession();
        }

        return sendRevokeTokenRequest(
            this._authConfig,
            getSessionParameter(AUTHENTICATION_TYPES.ACCESS_TOKEN, this._authConfig)
        );
    }

    public async getServiceEndpoints(): Promise<ServiceResourcesType> {
        if (this._storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this._client.getServiceEndpoints();
        }

        return Promise.resolve(getServiceEndpoints(this._authConfig));
    }

    public onHttpRequestSuccess = (callback: (response: AxiosResponse) => void): void => {
        if (callback && typeof callback === "function") {
            if (this._storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
                this._client.onHttpRequestSuccess(callback);
            }

            this._onHttpRequestSuccess = callback;
        }
    };

    public onHttpRequestError = (callback: (response: AxiosError) => void): void => {
        if (callback && typeof callback === "function") {
            if (this._storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
                this._client.onHttpRequestError(callback);
            }

            this._onHttpRequestError = callback;
        }
    };

    public onHttpRequestStart = (callback: () => void): void => {
        if (callback && typeof callback === "function") {
            if (this._storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
                this._client.onHttpRequestStart(callback);
            }

            this._onHttpRequestStart = callback;
        }
    };

    public onHttpRequestFinish = (callback: () => void): void => {
        if (callback && typeof callback === "function") {
            if (this._storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
                this._client.onHttpRequestFinish(callback);
            }

            this._onHttpRequestFinish = callback;
        }
    };

    public onSignIn = (callback: () => void): void => {
        this._onSignInCallback = callback;
    }

    public getHttpClient(): AxiosHttpClientInstance{
        if (this._initialized) {
            return this._httpClient;
        }

        throw Error("Identity Client has not been initialized yet");
    }
}
