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

import { AxiosRequestConfig, AxiosResponse } from "axios";
import * as AUTHENTICATION_TYPES from "./constants";
import {
    ConfigInterface,
    CustomGrantRequestParams,
    WebWorkerClientInterface,
    WebWorkerConfigInterface
} from "./models";
import {
    customGrant as customGrantUtil,
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

const NOT_AVAILABLE_ERROR = "This is available only when the storage is set to \"webWorker\"";

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
                .catch(() => {
                    return Promise.reject(false);
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

    public getAccessToken() {
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
            return this._client.signIn();
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
}
