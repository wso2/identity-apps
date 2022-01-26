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

import { I18nModuleConstants } from "@wso2is/i18n";

/**
 * Class containing portal specific i18n constants.
 */
export class I18nConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Common namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly COMMON_NAMESPACE: string = I18nModuleConstants.COMMON_NAMESPACE;

    /**
     * Console portal namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly CONSOLE_PORTAL_NAMESPACE: string = I18nModuleConstants.CONSOLE_PORTAL_NAMESPACE;

    /**
     * Extensions namespace.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly EXTENSIONS_NAMESPACE: string = I18nModuleConstants.EXTENSIONS_NAMESPACE;

    /**
     * Locations of the I18n namespaces.
     * @constant
     * @type {Map<string, string>}
     * @default
     */
    public static readonly BUNDLE_NAMESPACE_DIRECTORIES: Map<string, string> = new Map<string, string>([
        [ I18nConstants.COMMON_NAMESPACE, "portals" ],
        [ I18nConstants.CONSOLE_PORTAL_NAMESPACE, "portals" ],
        [ I18nConstants.EXTENSIONS_NAMESPACE, "portals" ]
    ]);

    /**
     * I18n init options override flag. The default options in the module will be overridden if set to true.
     * @constant
     * @type {boolean}
     * @default
     */
    public static readonly INIT_OPTIONS_OVERRIDE: boolean = false;

    /**
     * If the language detector plugin should be enabled or not.
     * @constant
     * @type {boolean}
     * @default
     */
    public static readonly LANG_AUTO_DETECT_ENABLED: boolean = true;

    /**
     * If the xhr backend plugin should be enabled or not.
     * @constant
     * @type {boolean}
     * @default
     */
    public static readonly XHR_BACKEND_PLUGIN_ENABLED: boolean = true;

    /**
     * Default fallback language.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly DEFAULT_FALLBACK_LANGUAGE: string = I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE;
}
