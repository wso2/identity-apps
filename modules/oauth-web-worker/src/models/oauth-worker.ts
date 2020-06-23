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
import { ConfigInterface } from "./client";
import { Message, SignInResponse, UserInfo } from "./message";
import { CustomGrantRequestParams } from "./oauth";

export interface OAuthWorkerInterface {
    setIsOpConfigInitiated(status: boolean): void;
    isSignedIn(): boolean;
    doesTokenExist(): boolean;
    setAuthorizationCode(authCode: string): void;
    initOPConfiguration(forceInit?: boolean): Promise<any>;
    setPkceCodeVerifier(pkce: string): void;
    generateAuthorizationCodeRequestURL(): string;
    sendSignInRequest(): Promise<SignInResponse>;
    refreshAccessToken(): Promise<boolean>;
    signOut(): Promise<string>;
    httpRequest(config: AxiosRequestConfig): Promise<AxiosResponse>;
    httpRequestAll(configs: AxiosRequestConfig[]): Promise<AxiosResponse[]>;
    customGrant(requestParams: CustomGrantRequestParams): Promise<AxiosResponse | boolean | SignInResponse>;
    getUserInfo(): UserInfo;
    revokeToken(): Promise<boolean>;
}

export interface OAuthWorkerSingletonInterface {
    getInstance(config: ConfigInterface): OAuthWorkerInterface;
}

interface OAuthEvent<T> extends MessageEvent {
    data: Message<T>;
}

export class OAuthWorker<T> extends Worker {
    public onmessage: (this: OAuthWorker<T>, event: OAuthEvent<T>) => void;
}
