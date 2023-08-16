/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Class containing i18n module constants.
 */
export class I18nModuleConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Name of the i18n module.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly MODULE_NAME: string = "@wso2is/i18n";

    /**
     * Common namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly COMMON_NAMESPACE: string = "common";

    /**
     * User portal namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly MY_ACCOUNT_NAMESPACE: string = "myAccount";

    /**
     * Console portal namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly CONSOLE_PORTAL_NAMESPACE: string = "console";

    /**
     * Extensions namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly EXTENSIONS_NAMESPACE: string = "extensions";

    /**
     * Default fallback language.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly DEFAULT_FALLBACK_LANGUAGE: string = "en-US";

    /**
     * Metadata file name.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly META_FILENAME: string = "meta.json";
}
