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
import { Storage } from "./constants";
import { ConfigInterface, CustomGrantRequestParams, OAuthInterface, WebWorkerConfigInterface } from "./models";
import { OAuth } from "./oauth";

const isWorker = (client: IdentityClient | OAuthInterface, storage: Storage): client is OAuthInterface => {
    return storage === Storage.webWorker;
};

const NOT_AVAILABLE_ERROR = 'This is available only when the storage is set to "webWorker"';

export class Authenticate {
    private storage: Storage;
    private authenticatingClient: IdentityClient | OAuthInterface;
    private static instance: Authenticate;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance(): Authenticate {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new Authenticate();

        return this.instance;
    }

    public async initialize(config: ConfigInterface | WebWorkerConfigInterface) {
        this.storage = config?.storage ?? Storage.sessionStorage;

        if (this.storage === Storage.sessionStorage) {
            this.authenticatingClient = new IdentityClient(config);
            return Promise.resolve(true);
        } else {
            this.authenticatingClient = OAuth.getInstance();
            return this.authenticatingClient
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
        return this.authenticatingClient.signIn();
    }

    public async signOut(): Promise<any> {
        return this.authenticatingClient.signOut();
    }

    public async httpRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
        if (isWorker(this.authenticatingClient, this.storage)) {
            return this.authenticatingClient.httpRequest(config);
        }

        return Promise.reject(NOT_AVAILABLE_ERROR);
    }

    public async httpRequestAll(config: AxiosRequestConfig[]): Promise<AxiosResponse[]> {
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
}
