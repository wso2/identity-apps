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
import { WebWorkerConfigInterface } from ".";
import { ServiceResourcesType } from "./endpoints";
import { SignInResponse, UserInfo } from "./message";

export interface WebWorkerClientInterface {
    httpRequest<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    httpRequestAll<T = any>(configs: AxiosRequestConfig[]): Promise<AxiosResponse<T>[]>;
    signOut(): Promise<boolean>;
    signIn(): Promise<UserInfo>;
    initialize(config: WebWorkerConfigInterface): Promise<boolean>;
    customGrant(requestParams: CustomGrantRequestParams): Promise<AxiosResponse | boolean | SignInResponse>;
    endUserSession(): Promise<boolean>;
    getServiceEndpoints(): Promise<ServiceResourcesType>;
    onHttpRequestSuccess(callback: (response: AxiosResponse) => void): void;
    onHttpRequestError(callback: (response: AxiosError) => void): void;

    onHttpRequestStart(callback: () => void): void;

    onHttpRequestFinish(callback: () => void): void;
    getUserInfo(): Promise<UserInfo>;
}

export interface WebWorkerSingletonClientInterface {
    getInstance(): WebWorkerClientInterface;
}

export interface CustomGrantRequestParams {
    id: string;
    data: any;
    signInRequired: boolean;
    attachToken: boolean;
    returnsSession: boolean;
    returnResponse: boolean;
}

export type SessionData = Map<string, string>;
