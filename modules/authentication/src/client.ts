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
import { OAuth } from ".";
import { handleSignIn, handleSignOut } from "./actions";
import * as AUTHENTICATION_TYPES from "./constants";
import { ConfigInterface, CustomGrantRequestParams, OAuthInterface, ResponseModeTypes } from "./models";

/**
 * The login scope.
 * @constant
 * @type {string}
 * @default
 */
const LOGIN_SCOPE = "internal_login";

/**
 * Human task scope.
 * @constant
 * @type {string}
 * @default
 */
const HUMAN_TASK_SCOPE = "internal_humantask_view";

/**
 * Super Tenant Identifier.
 * @constant
 * @type {string}
 * @default
 */
const DEFAULT_SUPER_TENANT = "carbon.super";

/**
 * Default configurations.
 */
const DefaultConfig = {
    authorizationType: AUTHENTICATION_TYPES.AUTHORIZATION_CODE_TYPE,
    clientSecret: null,
    consentDenied: false,
    enablePKCE: true,
    responseMode: null,
    scope: [ LOGIN_SCOPE, HUMAN_TASK_SCOPE ],
    tenant: DEFAULT_SUPER_TENANT
};

const NOT_AVAILABLE_ERROR = "This is available only when the storage is set to \"webWorker\"";

/**
 * IdentityClient class constructor.
 *
 * @export
 * @class IdentityClient
 * @implements {ConfigInterface} - Configuration interface.
 */
export class IdentityClient implements ConfigInterface {
    public authorizationType!: string;
    public callbackURL: string;
    public clientHost: string;
    public clientID: string;
    public clientSecret!: string;
    public consentDenied!: boolean;
    public enablePKCE!: boolean;
    public responseMode!: ResponseModeTypes;
    public scope!: string[];
    public serverOrigin: string;
    public storage: AUTHENTICATION_TYPES.Storage;

    private static instance: IdentityClient;
    private client: OAuthInterface;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    public static getInstance() {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new IdentityClient();

        return this.instance;
    }

    public initialize(config: ConfigInterface) {
        this.storage = config?.storage ?? AUTHENTICATION_TYPES.Storage.SessionStorage;

        if (this.storage === AUTHENTICATION_TYPES.Storage.SessionStorage) {
            const resolve = (propertyName) => {
                if (Object.prototype.hasOwnProperty.call(config, propertyName)) {
                    return config[ propertyName ];
                }

                if (Object.prototype.hasOwnProperty.call(DefaultConfig, propertyName)) {
                    return DefaultConfig[ propertyName ];
                }

                throw new Error(
                    `"${ propertyName }" is missing in your configuration. Please fill all the mandatory properties`
                );
            };

            this.authorizationType = resolve("authorizationType");
            this.callbackURL = resolve("callbackURL");
            this.clientHost = resolve("clientHost");
            this.clientID = resolve("clientID");
            this.clientSecret = resolve("clientSecret");
            this.consentDenied = resolve("consentDenied");
            this.enablePKCE = resolve("enablePKCE");
            this.responseMode = resolve("responseMode");
            this.scope = resolve("scope");
            this.serverOrigin = resolve("serverOrigin");

            Object.assign(this, config);
            return Promise.resolve(true);
        } else {
            this.client = OAuth.getInstance();
            return this.client
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
        if (this.storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this.client.signIn();
        }
        return handleSignIn(this);
    }

    /**
     * Sign-out method.
     *
     * @param {() => void} [callback] - Callback method to run on successful sign-in
     * @returns {Promise<any>} promise.
     * @memberof IdentityClient
     */
    public async signOut(): Promise<any> {
        if (this.storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this.client.signOut();
        }
        return handleSignOut(this);
    }

    public async httpRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
        if (this.storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this.client.httpRequest(config);
        }

        return Promise.reject(NOT_AVAILABLE_ERROR);
    }

    public async httpRequestAll(config: AxiosRequestConfig[]): Promise<AxiosResponse[]> {
        if (this.storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this.client.httpRequestAll(config);
        }
        return Promise.reject(NOT_AVAILABLE_ERROR);
    }

    public async customGrant(requestParams: CustomGrantRequestParams): Promise<any> {
        if (this.storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this.client.customGrant(requestParams);
        }
        return Promise.reject(NOT_AVAILABLE_ERROR);
    }

    public async revokeToken(): Promise<any> {
        if (this.storage === AUTHENTICATION_TYPES.Storage.WebWorker) {
            return this.client.revokeToken();
        }
        return Promise.reject(NOT_AVAILABLE_ERROR);
    }
}
