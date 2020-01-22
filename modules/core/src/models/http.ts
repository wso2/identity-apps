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
    DELETE = "DELETE"
}

/**
 * Enum for `Accept` HTTP header.
 *
 * @readonly
 * @enum {string}
 */
export enum AcceptHeaderValues {
    /**
     * Value for JSON type Accept header.
     *
     * @type {string}
     */
    APP_JSON = "application/json",
    /**
     * Value for XML type Accept header.
     *
     * @type {string}
     */
    APP_XML = "application/xml",
    /**
     * Value for javascript type Accept header.
     *
     * @type {string}
     */
    APP_JAVASCRIPT = "application/javascript",
    /**
     * Value for form type Accept header.
     *
     * @type {string}
     */
    APP_FORM = "application/x-www-form-urlencoded",
    /**
     * Value for SCIM type Accept header.
     *
     * @type {string}
     */
    APP_SCIM = "application/scim+json"
}

/**
 * Enum for `Content-Type` entity HTTP header.
 *
 * @readonly
 * @enum {string}
 */
export enum ContentTypeHeaderValues {
    /**
     * Value for JSON type content type entity header.
     *
     * @type {string}
     */
    APP_JSON = "application/json",
    /**
     * Value for XML type content type entity header.
     *
     * @type {string}
     */
    APP_XML = "application/xml",
    /**
     * Value for javascript type content type entity header.
     *
     * @type {string}
     */
    APP_JAVASCRIPT = "application/javascript",
    /**
     * Value for form type content type entity header.
     *
     * @type {string}
     */
    APP_FORM = "application/x-www-form-urlencoded",
    /**
     * Value for SCIM type content type entity header.
     *
     * @type {string}
     */
    APP_SCIM = "application/scim+json"
}
