/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { I18nModuleConstants } from "@wso2is/i18n";

/**
 * Class containing dev portal specific i18n constants.
 */
export class I18nConstants {

    /**
     * Namespace for the dev portal. Use these when loading translations.
     */
    public static readonly PORTAL_NAMESPACE: string = I18nModuleConstants.MY_ACCOUNT_NAMESPACE;

    /**
     * Common namespace. Use these when loading translations.
     */
    public static readonly COMMON_NAMESPACE: string = I18nModuleConstants.COMMON_NAMESPACE;

    /**
     * Users namespace common to applications.
     */
    public static readonly COMMON_USERS_NAMESPACE: string = I18nModuleConstants.COMMON_USERS_NAMESPACE;

    /**
     * Locations of the I18n namespaces.
     */
    public static readonly BUNDLE_NAMESPACE_DIRECTORIES: Map<string, string> = new Map<string, string>([
        [ I18nConstants.COMMON_NAMESPACE, "portals" ],
        [ I18nConstants.PORTAL_NAMESPACE, "portals" ],
        [ I18nConstants.COMMON_USERS_NAMESPACE, "portals" ]
    ]);

    /**
     * I18n init options override flag. The default options in the module will be overridden if set to true.
     */
    public static readonly INIT_OPTIONS_OVERRIDE: boolean = false;

    /**
     * If the language detector plugin should be enabled or not.
     */
    public static readonly LANG_AUTO_DETECT_ENABLED: boolean = true;

    /**
     * If the xhr backend plugin should be enabled or not.
     */
    public static readonly XHR_BACKEND_PLUGIN_ENABLED: boolean = true;

    /**
     * Default fallback language.
     */
    public static readonly DEFAULT_FALLBACK_LANGUAGE: string = I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE;
}
