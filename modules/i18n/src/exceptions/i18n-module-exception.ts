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

import { IdentityAppsModuleException } from "@wso2is/core/exceptions";
import { I18nModuleConstants } from "../constants";

/**
 * Base exception class for all i18n module exceptions.
 */
export class I18nModuleException extends IdentityAppsModuleException {

    /**
     * Constructor.
     * @param {string} message - Message for the exception.
     * @param {string | Record<string, unknown>} stack - Stack trace.
     */
    constructor(message?: string, stack?: string | Record<string, unknown>) {
        super(message, stack, I18nModuleConstants.MODULE_NAME);
    }
}
