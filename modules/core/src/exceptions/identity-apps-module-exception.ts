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
 * Base exception class for the identity apps modules.
 */
export class IdentityAppsModuleException extends IdentityAppsException {

    public module: string;

    /**
     * Constructor.
     * @param {string} message - Message for the exception.
     * @param {string | Record<string, unknown>} stack - Stack trace.
     * @param {string} module - Name of the module which threw the exception.
     */
    constructor(message?: string, stack?: string | Record<string, unknown>, module?: string) {
        super(message, stack);
        this.module = module;
    }
}
