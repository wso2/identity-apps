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

import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ACCESS_TOKEN, AUTHORIZATION_CODE_TYPE, Hooks, OIDC_SCOPE, Storage } from "./constants";
import { AxiosHttpClient, AxiosHttpClientInstance } from "./http-client";
import {
    ConfigInterface,
    CustomGrantRequestParams,
    ServiceResourcesType,
    UserInfo,
    WebWorkerClientInterface,
    WebWorkerConfigInterface,
    isWebWorkerConfig
} from "./models";
import {
    customGrant as customGrantUtil,
    endAuthenticatedSession,
    getServiceEndpoints,
    getSessionParameter,
    getUserInfo as getUserInfoUtil,
    handleSignIn,
    handleSignOut,
    resetOPConfiguration,
    sendRevokeTokenRequest
} from "./utils";
import { WebWorkerClient } from "./worker";

/**
 * Default configurations.
 */
const DefaultConfig = {
    authorizationType: AUTHORIZATION_CODE_TYPE,
    clientSecret: null,
    consentDenied: false,
    enablePKCE: true,
    responseMode: null,
    scope: [OIDC_SCOPE]
};

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
    private _storage: Storage;
    private _initialized: boolean;
    private _startedInitialize: boolean = false;
    private _onSignInCallback: (response: UserInfo) => void;
    private _onSignOutCallback: (response: any) => void;
    private _onEndUserSession: (response: any) => void;
    private _onInitialize: (response: boolean) => void;
    private _onCustomGrant: Map<string, (response: any) => void> = new Map();
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

    public initialize(config: ConfigInterface | WebWorkerConfigInterface): Promise<boolean> {
        this._storage = config.storage ?? Storage.SessionStorage;
        this._initialized = false;
        this._startedInitialize = true;

        const startCallback = (request: AxiosRequestConfig): void => {
            request.headers = {
                ...request.headers,
                Authorization: `Bearer ${getSessionParameter(ACCESS_TOKEN, config)}`
            };

            this._onHttpRequestStart && typeof this._onHttpRequestStart === "function" && this._onHttpRequestStart();
        };

        if (!isWebWorkerConfig(config)) {
            this._authConfig = { ...DefaultConfig, ...config };
            this._initialized = true;
            this._httpClient = AxiosHttpClient.getInstance();
            this._httpClient.init(
                true,
                startCallback,
                this._onHttpRequestSuccess,
                this._onHttpRequestError,
                this._onHttpRequestFinish
            );

            if (this._onInitialize) {
                this._onInitialize(true);
            }

            return Promise.resolve(true);
        } else {
            this._client = WebWorkerClient.getInstance();

            return this._client
                .initialize(config)
                .then(() => {
                    if (this._onInitialize) {
                        this._onInitialize(true);
                    }
                    this._initialized = true;

                    return Promise.resolve(true);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }
    }

    public getUserInfo(): Promise<UserInfo> {
        if (this._storage === Storage.WebWorker) {
            return this._client.getUserInfo();
        }

        return Promise.resolve(getUserInfoUtil(this._authConfig));
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
        if (!this._startedInitialize) {
            return Promise.reject("The object has not been initialized yet.");
        }

        let iterationToWait = 0;

        const sleep = (): Promise<any> => {
            return new Promise((resolve) => setTimeout(resolve, 500));
        };

        while (!this._initialized) {
            if (iterationToWait === 21) {
                // eslint-disable-next-line no-console
                console.warn("It is taking longer than usual for the object to be initialized");
            }
            await sleep();
            iterationToWait++;
        }

        if (this._storage === Storage.WebWorker) {
            return this._client
                .signIn()
                .then((response) => {
                    if (this._onSignInCallback) {
                        if (response.allowedScopes || response.displayName || response.email || response.username) {
                            this._onSignInCallback(response);
                        }
                    }

                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }

        return handleSignIn(this._authConfig)
            .then(() => {
                if (this._onSignInCallback) {
                    const userInfo = getUserInfoUtil(this._authConfig);
                    if (userInfo.allowedScopes || userInfo.displayName || userInfo.email || userInfo.username) {
                        this._onSignInCallback(getUserInfoUtil(this._authConfig));
                    }
                }

                return Promise.resolve(getUserInfoUtil(this._authConfig));
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    /**
     * Sign-out method.
     *
     * @param {() => void} [callback] - Callback method to run on successful sign-in
     * @returns {Promise<any>} promise.
     * @memberof IdentityClient
     */
    public async signOut(): Promise<any> {
        if (this._storage === Storage.WebWorker) {
            return this._client
                .signOut()
                .then((response) => {
                    if (this._onSignOutCallback) {
                        this._onSignOutCallback(response);
                    }

                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }

        return handleSignOut(this._authConfig)
            .then((response) => {
                if (this._onSignOutCallback) {
                    this._onSignOutCallback(response);
                }

                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    public async httpRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
        if (this._storage === Storage.WebWorker) {
            return this._client.httpRequest(config);
        }

        return this._httpClient.request(config);
    }

    public async httpRequestAll(config: AxiosRequestConfig[]): Promise<AxiosResponse[]> {
        if (this._storage === Storage.WebWorker) {
            return this._client.httpRequestAll(config);
        }

        const requests: Promise<AxiosResponse<any>>[] = [];
        config.forEach((request) => {
            requests.push(this._httpClient.request(request));
        });

        return this._httpClient.all(requests);
    }

    public async customGrant(requestParams: CustomGrantRequestParams): Promise<any> {
        if (!requestParams.id) {
            throw Error("No ID specified for the custom grant.");
        }

        if (this._storage === Storage.WebWorker) {
            return this._client
                .customGrant(requestParams)
                .then((response) => {
                    if (this._onCustomGrant.get(requestParams.id)) {
                        this._onCustomGrant.get(requestParams.id)(response);
                    }

                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }

        return customGrantUtil(requestParams, this._authConfig)
            .then((response) => {
                if (this._onCustomGrant.get(requestParams.id)) {
                    this._onCustomGrant.get(requestParams.id)(response);
                }

                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    public async endUserSession(): Promise<any> {
        if (this._storage === Storage.WebWorker) {
            return this._client
                .endUserSession()
                .then((response) => {
                    if (this._onEndUserSession) {
                        this._onEndUserSession(response);

                        return Promise.resolve(response);
                    }
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }

        return sendRevokeTokenRequest(this._authConfig, getSessionParameter(ACCESS_TOKEN, this._authConfig))
            .then((response) => {
                resetOPConfiguration(this._authConfig);
                endAuthenticatedSession(this._authConfig);

                if (this._onEndUserSession) {
                    this._onEndUserSession(response);

                    return Promise.resolve(true);
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    public async getServiceEndpoints(): Promise<ServiceResourcesType> {
        if (this._storage === Storage.WebWorker) {
            return this._client.getServiceEndpoints();
        }

        return Promise.resolve(getServiceEndpoints(this._authConfig));
    }

    public getHttpClient(): AxiosHttpClientInstance {
        if (this._initialized) {
            return this._httpClient;
        }

        throw Error("Identity Client has not been initialized yet");
    }

    public on(hook: Hooks.CustomGrant, callback: (response?: any) => void, id: string): void;
    public on(
        hook:
            | Hooks.EndUserSession
            | Hooks.HttpRequestError
            | Hooks.HttpRequestFinish
            | Hooks.HttpRequestStart
            | Hooks.HttpRequestSuccess
            | Hooks.Initialize
            | Hooks.SignIn
            | Hooks.SignOut,
        callback: (response?: any) => void
    );
    public on(hook: Hooks, callback: (response?: any) => void, id?: string): void {
        if (callback && typeof callback === "function") {
            switch (hook) {
                case Hooks.SignIn:
                    this._onSignInCallback = callback;
                    break;
                case Hooks.SignOut:
                    this._onSignOutCallback = callback;
                    break;
                case Hooks.EndUserSession:
                    this._onEndUserSession = callback;
                    break;
                case Hooks.Initialize:
                    this._onInitialize = callback;
                    break;
                case Hooks.HttpRequestError:
                    if (this._storage === Storage.WebWorker) {
                        this._client.onHttpRequestError(callback);
                    }

                    this._onHttpRequestError = callback;
                    break;
                case Hooks.HttpRequestFinish:
                    if (this._storage === Storage.WebWorker) {
                        this._client.onHttpRequestFinish(callback);
                    }

                    this._onHttpRequestFinish = callback;
                    break;
                case Hooks.HttpRequestStart:
                    if (this._storage === Storage.WebWorker) {
                        this._client.onHttpRequestStart(callback);
                    }

                    this._onHttpRequestStart = callback;
                    break;
                case Hooks.HttpRequestSuccess:
                    if (this._storage === Storage.WebWorker) {
                        this._client.onHttpRequestSuccess(callback);
                    }

                    this._onHttpRequestSuccess = callback;
                    break;
                case Hooks.CustomGrant:
                    this._onCustomGrant.set(id, callback);
                    break;
                default:
                    throw Error("No such hook found");
            }
        } else {
            throw Error("The callback function is not a valid function.");
        }
    }
}
