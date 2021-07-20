/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * Base error class for the identity apps.
 */
export class IdentityAppsError {

    public code: number | string;
    public description: string;
    public message: string;
    public traceId: number | string;

    /**
     * Constructor.
     * @param {string} message - Message for the error.
     * @param {number | string} code - Error status code.
     * @param {string} description - Description of the error.
     * @param {number | string} traceId - Trace ID of the error.
     */
    constructor(code: number | string, description: string, message?: string, traceId?: number | string) {
        this.code = code;
        this.description = description;
        this.message = message;
        this.traceId = traceId;
    }

    public getErrorCode(): string | number {
        return this.code;
    }

    public getErrorDescription(): string {
        return this.description;
    }

    public getErrorMessage(): string {
        return this.message;
    }

    public getErrorTraceId(): string | number {
        return this.traceId;
    }
}
