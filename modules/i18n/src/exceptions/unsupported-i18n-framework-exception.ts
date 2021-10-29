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

import { I18nModuleException } from "./i18n-module-exception";

/**
 * Exception class to handle unsupported i18n frameworks on module initialization.
 */
export class UnsupportedI18nFrameworkException extends I18nModuleException {

    public framework: string;

    /**
     * Constructor.
     * @param {string} framework - Requested framework.
     * @param {string | Record<string, unknown>} stack - Stack trace.
     */
    constructor(framework?: string, stack?: string | Record<string, unknown>) {
        super(`The requested i18n framework (${ framework }) is currently not supported`, stack);
        this.framework = framework;
    }
}
