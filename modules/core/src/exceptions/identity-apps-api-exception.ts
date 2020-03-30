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

import { IdentityAppsException } from "./identity-apps-exception";

/**
 * Exception class for the identity apps API exceptions.
 */
export class IdentityAppsApiException extends IdentityAppsException {

    public code: number | string;
    public request: any;
    public response: any;
    public config: any;

    /**
     * Constructor.
     * @param {string} message - Message for the exception.
     * @param {any} stack - Stack trace for the error.
     * @param {number | string} code - Error status code.
     * @param request - Sent Request object.
     * @param response - Received response object.
     * @param config - Request config object.
     */
    constructor(message?: string, stack?: any, code?: number | string, request?: any, response?: any, config?: any) {
        super(message, stack);
        this.code = code;
        this.request = request;
        this.response = response;
        this.config = config;
    }
}
