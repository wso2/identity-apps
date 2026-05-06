/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

/**
 * Enum for HTTP methods.
 *
 * @readonly
 * @enum {string}
 */
export enum HttpMethods {
    /**
     * Value for `GET` requests.
     *
     * @type {string}
     */
    GET = "GET",
    /**
     * Value for `POST` requests.
     *
     * @type {string}
     */
    POST = "POST",
    /**
     * Value for `PUT` requests.
     *
     * @type {string}
     */
    PUT = "PUT",
    /**
     * Value for `PATCH` requests.
     *
     * @type {string}
     */
    PATCH = "PATCH",
    /**
     * Value for `DELETE` requests.
     *
     * @type {string}
     */
    DELETE = "DELETE",
    /**
     * Value for `HEAD` requests.
     *
     * @type {string}
     */
    HEAD = "HEAD"
}

/**
 * Enum for `Accept` HTTP header.
 *
 * @readonly
 * @enum {string}
 */
export enum AcceptHeaderValues {
    APP_JSON = "application/json"
}

/**
 * Enum for `Content-Type` entity HTTP header.
 *
 * @readonly
 * @enum {string}
 */
export enum ContentTypeHeaderValues {
    APP_JSON = "application/json"
}

/**
 * HTTP Response Codes.
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses
 */
export enum HttpCodes {
    CREATED = 201,
    OK = 200,
    NO_CONTENT = 204,
}

/**
 * Schema of the error response body returned by Identity Server REST APIs.
 * Used as the generic type parameter for AxiosError<HttpErrorResponseDataInterface>.
 */
export interface HttpErrorResponseDataInterface {
    code?: string;
    description?: string;
    detail?: string;
    message?: string;
    scimType?: string;
    status?: string;
    traceId?: string;
}
