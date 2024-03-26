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
 * Class containing portal specific i18n constants.
 */
export class I18nConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Common namespace.
     */
    public static readonly COMMON_NAMESPACE: string = I18nModuleConstants.COMMON_NAMESPACE;

    /**
     * Console portal namespace.
     */
    public static readonly CONSOLE_PORTAL_NAMESPACE: string = I18nModuleConstants.CONSOLE_PORTAL_NAMESPACE;

    /**
     * Extensions namespace.
     */
    public static readonly EXTENSIONS_NAMESPACE: string = I18nModuleConstants.EXTENSIONS_NAMESPACE;

    /**
     * insights namespace.
     */
    public static readonly INSIGHTS_NAMESPACE: string = I18nModuleConstants.INSIGHTS_NAMESPACE;

    /**
     * SMS Providers namespace.
     */
    public static readonly SMS_PROVIDERS_NAMESPACE: string = I18nModuleConstants.SMS_PROVIDERS_NAMESPACE;
  
    /**
     * Claims namespace.
     */
    public static readonly CLAIMS_NAMESPACE: string = I18nModuleConstants.CLAIMS_NAMESPACE;

    /**
     * Email locale namespace.
     */
    public static readonly EMAIL_LOCALE_NAMESPACE: string = I18nModuleConstants.EMAIL_LOCALE_NAMESPACE;
  
    /**
     * Help Panel namespace.
     */
    public static readonly HELP_PANEL_NAMESPACE: string = I18nModuleConstants.HELP_PANEL_NAMESPACE;
  
    /**
     * suborganizations namespace.
     */
    public static readonly SUBORGANIZATIONS_NAMESPACE: string = I18nModuleConstants.SUBORGANIZATIONS_NAMESPACE;
  
    /**
     * console settings namespace.
     */
    public static readonly CONSOLE_SETTINGS_NAMESPACE: string = I18nModuleConstants.CONSOLE_SETTINGS_NAMESPACE;
  
    /**
     * Secrets namespace.
     */
    public static readonly SECRETS_NAMESPACE: string = I18nModuleConstants.SECRETS_NAMESPACE;
  
    /**
     * Branding namespace.
     */
    public static readonly BRANDING_NAMESPACE: string = I18nModuleConstants.BRANDING_NAMESPACE;
  
    /**
     * emailTemplates namespace.
     */
    public static readonly EMAIL_TEMPLATES_NAMESPACE: string = I18nModuleConstants.EMAIL_TEMPLATES_NAMESPACE;

    /**
     * Certificates namespace.
     */
    public static readonly CERTIFICATES_NAMESPACE: string = I18nModuleConstants.CERTIFICATES_NAMESPACE;
  
    /**
     * authenticationProvider namespace.
     */
    public static readonly AUTHENTICATION_PROVIDER_NAMESPACE: string =
      I18nModuleConstants.AUTHENTICATION_PROVIDER_NAMESPACE;

    /**
     * Locations of the I18n namespaces.
     */
    public static readonly BUNDLE_NAMESPACE_DIRECTORIES: Map<string, string> = new Map<string, string>([
        [ I18nConstants.COMMON_NAMESPACE, "portals" ],
        [ I18nConstants.CONSOLE_PORTAL_NAMESPACE, "portals" ],
        [ I18nConstants.EXTENSIONS_NAMESPACE, "portals" ],
        [ I18nConstants.INSIGHTS_NAMESPACE, "portals" ],
        [ I18nConstants.SMS_PROVIDERS_NAMESPACE, "portals" ],
        [ I18nConstants.CLAIMS_NAMESPACE, "portals" ],
        [ I18nConstants.EMAIL_LOCALE_NAMESPACE, "portals" ],
        [ I18nConstants.HELP_PANEL_NAMESPACE, "portals" ],
        [ I18nConstants.SUBORGANIZATIONS_NAMESPACE, "portals" ],
        [ I18nConstants.CONSOLE_SETTINGS_NAMESPACE, "portals" ],
        [ I18nConstants.SECRETS_NAMESPACE, "portals" ],
        [ I18nConstants.BRANDING_NAMESPACE, "portals" ],
        [ I18nConstants.EMAIL_TEMPLATES_NAMESPACE, "portals" ],
        [ I18nConstants.CERTIFICATES_NAMESPACE, "portals" ],
        [ I18nConstants.AUTHENTICATION_PROVIDER_NAMESPACE, "portals" ]
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
