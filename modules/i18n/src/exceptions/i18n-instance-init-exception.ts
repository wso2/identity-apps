/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { I18nModuleException } from "./i18n-module-exception";

/**
 * Exception class to handle i18n instance init failure.
 */
export class I18nInstanceInitException extends I18nModuleException {

    /**
     * Constructor.
     * @param {string | Record<string, unknown>} stack - Stack trace.
     */
    constructor(stack?: string | Record<string, unknown>) {
        super("Failed to initialize the i18n instance", stack);
    }
}
