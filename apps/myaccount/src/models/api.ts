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
 */

import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * A collection of interfaces which can be used to map HTTP request
 * related payloads, responses, errors etc.
 */

/**
 * Interface to map HTTP request configs. Extends `AxiosRequestConfig`
 * interface from Axios library.
 */
export interface HttpRequestConfig extends AxiosRequestConfig {
    dispatcher?: string;
    onSuccess?: string;
    onError?: string;
}

/**
 * Interface to handle HTTP responses. Extends `AxiosResponse` interface
 * from Axios library.
 */
/* eslint-disable @typescript-eslint/no-empty-interface */
export interface HttpResponse extends AxiosResponse {}

/**
 * Interface to handle HTTP errors. Extends `AxiosError` interface
 * from Axios library.
 */
/* eslint-disable @typescript-eslint/no-empty-interface */
export interface HttpError extends AxiosError {}

/**
 * Enum for HTTP methods.
 * @readonly
 * @enum {string}
 */
export enum HttpMethods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}
