/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { InitOptions } from "i18next";

/**
 * Model for locale meta information.
 */
export interface LocaleMeta {
    /**
     * ISO language code.
     */
    code: string;
    /**
     * Flag to be used on the switcher.
     */
    flag?: any;
    /**
     * Display name for the language.
     */
    name: string;
    /**
     * Set of available namespaces
     */
    namespaces: string[];
    /**
     * Set of namespace paths.
     */
    paths?: NamespacePathInterface;
}

/**
 * Namespace path interface.
 */
interface NamespacePathInterface {
    [ ns: string ]: string;
}

/**
 * Model for locale bundle.
 */
export interface LocaleBundle {
    /**
     * Meta information regarding the locale.
     */
    meta: LocaleMeta;
    /**
     * Resource bundle for the locale.
     */
    resources: any;
}

/**
 * Model for set of locale bundle.
 */
export interface LocaleBundles {
    [ language: string ]: LocaleBundle;
}

/**
 * Model for supported languages metadata.
 */
export interface SupportedLanguagesMeta {
    [ language: string ]: LocaleMeta;
}

/**
 * Type for i18n module init options.
 */
export type I18nModuleInitOptions = InitOptions

/**
 * Model for defining i18n module options.
 */
export interface I18nModuleOptionsInterface {
    initOptions?: I18nModuleInitOptions;
    langAutoDetectEnabled?: boolean;
    namespaceDirectories?: Map<string, string>;
    overrideOptions?: boolean;
    resourcePath?: string;
    xhrBackendPluginEnabled?: boolean;
}
