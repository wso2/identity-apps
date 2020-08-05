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
import { IdentityClient } from ".";
import { STORAGE } from "./constants";
import { ConfigInterface, CustomGrantRequestParams, OAuthInterface, WebWorkerConfigInterface } from "./models";
import { OAuth } from "./oauth";

const isWorker = (client: IdentityClient | OAuthInterface, storage: STORAGE): client is OAuthInterface => {
    return storage === STORAGE.webWorker;
};

const NOT_AVAILABLE_ERROR = 'This is available only when the storage is set to "webWorker"';

export class Authenticate {
    public storage: STORAGE;
    private authenticatingClient: IdentityClient | OAuthInterface;

    constructor(storage: STORAGE) {
        this.storage = storage;
    }

    public async initialize(config: ConfigInterface | WebWorkerConfigInterface) {
        if (this.storage === STORAGE.sessionStorage) {
            this.authenticatingClient = new IdentityClient(config);
            return Promise.resolve(true);
        } else {
            this.authenticatingClient = OAuth.getInstance();
            this.authenticatingClient
                .initialize(config)
                .then(() => {
                    return Promise.resolve(true);
                })
                .catch(() => {
                    return Promise.reject(false);
                });
        }
    }

    public async signIn(): Promise<any> {
        if (isWorker(this.authenticatingClient, this.storage)) {
            return this.authenticatingClient.signIn();
        } else {
            return this.authenticatingClient.signIn();
        }
    }
    public async signOut(): Promise<any> {
        if (isWorker(this.authenticatingClient, this.storage)) {
            return this.authenticatingClient.signOut();
        } else {
            return this.authenticatingClient.signOut();
        }
    }
    public async httpRequest<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        if (isWorker(this.authenticatingClient, this.storage)) {
            return this.authenticatingClient.httpRequest(config);
        } else {
            return Promise.reject(NOT_AVAILABLE_ERROR);
        }
    }

    public async httpRequestAll<T = any>(config: AxiosRequestConfig[]): Promise<AxiosResponse<T>[]> {
        if (isWorker(this.authenticatingClient, this.storage)) {
            return this.authenticatingClient.httpRequestAll(config);
        } else {
            return Promise.reject(NOT_AVAILABLE_ERROR);
        }
    }

    public async customGrant(requestParams: CustomGrantRequestParams): Promise<any> {
        if (isWorker(this.authenticatingClient, this.storage)) {
            return this.authenticatingClient.customGrant(requestParams);
        } else {
            return Promise.reject(NOT_AVAILABLE_ERROR);
        }
    }

    public async revokeToken(): Promise<any> {
        if (isWorker(this.authenticatingClient, this.storage)) {
            return this.authenticatingClient.revokeToken();
        } else {
            return Promise.reject(NOT_AVAILABLE_ERROR);
        }
    }

    public async getScope(): Promise<string> {
        if (isWorker(this.authenticatingClient, this.storage)) {
            return this.authenticatingClient.getScope();
        } else {
            return Promise.reject(NOT_AVAILABLE_ERROR);
        }
    }
}
