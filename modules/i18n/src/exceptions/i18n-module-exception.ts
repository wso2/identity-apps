/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
