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

import { StringUtils } from "@wso2is/core/utils";
import { InitOptions, Resource } from "i18next";
import { I18nModuleConstants } from "./constants";
import { I18nModuleOptionsInterface, LocaleBundles, MetaI18N, SupportedLanguagesMeta } from "./models";

/**
 * Generate the i18n options.
 *
 * @param {i18next.InitOptions} options - Options override.
 * @param {boolean} override - Should the passed in options replace the default.
 * @param {boolean} useBackend - XHR back end plugin is used or not. If false, static resources will be loaded.
 * @param {boolean} debug - Debug enabled flag.
 * @param {LocaleBundles} defaultTranslations - Set of translations packed by default.
 * @return {InitOptions} Init options config.
 */
export const generateI18nOptions = (options: InitOptions,
    override: boolean,
    useBackend: boolean,
    debug: boolean,
    defaultTranslations?: LocaleBundles): InitOptions => {

    const DEFAULT_INIT_OPTIONS: InitOptions = {
        contextSeparator: "_",
        debug: false,
        defaultNS: I18nModuleConstants.COMMON_NAMESPACE,
        fallbackLng: I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE,
        interpolation: {
            escapeValue: false
        },
        keySeparator: ".",
        ns: defaultTranslations && getNamespacesSupportedByDefault(defaultTranslations),
        nsSeparator: ":",
        pluralSeparator: "_",
        resources: !useBackend
            ? defaultTranslations && getResourcesSupportedByDefault(defaultTranslations)
            : undefined
    };

    if (override) {
        return {
            ...options,
            debug
        };
    }

    return {
        ...DEFAULT_INIT_OPTIONS,
        debug,
        ...options
    };
};

/**
 * Load the namespaces from the default bundle which is inside the module.
 *
 * @param {LocaleBundles} defaultTranslations - Set of translations packed by default.
 * @return {string[]} Namespace array.
 */
export const getNamespacesSupportedByDefault = (defaultTranslations: LocaleBundles): string[] => {

    const namespaces: string[] = [];

    for (const value of Object.values(defaultTranslations)) {
        for (const namespace of value.meta.namespaces) {
            if (!namespaces.includes(namespace)) {
                namespaces.push(namespace);
            }
        }
    }

    return namespaces;
};

/**
 * Load the default resource bundle available inside the module.
 *
 * @param {LocaleBundles} defaultTranslations - Set of translations packed by default.
 * @return {i18next.Resource} Resource bundle.
 */
export const getResourcesSupportedByDefault = (defaultTranslations: LocaleBundles): Resource => {

    let resources: Resource = {};

    for (const locale of Object.values(defaultTranslations)) {
        // Try to find the namespace resource file based on the namespaces array declared in meta.
        for(const resource of Object.values(locale.resources)) {
            resources = {
                ...resources,
                [ locale.meta.code ]: {
                    ...resources[ locale.meta.code ],
                    ...resource as Record<string, unknown>
                }
            };
        }
    }

    return resources;
};

/**
 * Get the supported list of languages that are supported by default.
 * i.e. The languages that are packed by default.
 *
 * @param {LocaleBundles} defaultTranslations - Set of translations packed by default.
 * @return {string[]} Supported languages.
 */
export const getLanguagesSupportedByDefault = (defaultTranslations: LocaleBundles): string[] => {

    const languages: string[] = [];

    for (const value of Object.values(defaultTranslations)) {
        languages.push(value.meta.code);
    }

    return languages;
};

/**
 * Checks if a passed in language is supported or not.
 *
 * @param {string} detectedLanguage - Detected language.
 * @param {string[]} supportedLanguages - Supported languages.
 * @param {SupportedLanguagesMeta} meta - Meta file.
 * @param {LocaleBundles} defaultTranslations - Set of translations packed by default.
 * @return {boolean} Returns true if supported, else returns false.
 */
export const isLanguageSupported = (detectedLanguage: string,
    supportedLanguages?: string[],
    meta?: SupportedLanguagesMeta,
    defaultTranslations?: LocaleBundles): boolean => {

    let languages: string[] = defaultTranslations
        ? getLanguagesSupportedByDefault(defaultTranslations)
        : [];

    if (supportedLanguages && supportedLanguages instanceof Array && supportedLanguages.length > 0) {
        languages = supportedLanguages;
    } else if (meta) {
        languages = Object.keys(meta);
    }

    for (const lang of languages) {
        if (lang === detectedLanguage) {
            return true;
        }
    }

    return false;
};

/**
 * Generates the paths for the XHR backend plugin.
 * Required to fetch namespaces when they are placed in multiple folders.
 *
 * Ex. `resources/i18n/en-US/docs/licence.json`
 *     `resources/i18n/en-US/portals/common.json`
 *
 * @param {string[]} language - Language code.
 * @param {string[]} namespace - Namespace.
 * @param {string} appBaseName - Application basename under which the distribution files are placed.
 * @param {I18nModuleOptionsInterface} i18nBundleOptions - I18n module options.
 * @return {string} Resolved path.
 */
export const generateBackendPaths = (language: string[],
    namespace: string[],
    appBaseName: string,
    i18nBundleOptions: I18nModuleOptionsInterface,
    metaFile: MetaI18N): string => {

    // If `appBaseName` is "", avoids adding a forward slash.
    const resolvedAppBaseName: string = StringUtils.removeSlashesFromPath(appBaseName)
        ? `${StringUtils.removeSlashesFromPath(appBaseName)}/`
        : "";

    const fullResourcePath = `${ resolvedAppBaseName }${
        StringUtils.removeSlashesFromPath(i18nBundleOptions?.resourcePath) }`;

    const fileNames = metaFile[ language[ 0 ] ]?.paths[ namespace[ 0 ] ]?.split("/");
    const fileName = fileNames ? fileNames[ fileNames?.length - 1 ] : "";

    if (i18nBundleOptions?.namespaceDirectories.has(namespace[0])) {
        return `/${ fullResourcePath }/${ language[0] }/${ i18nBundleOptions.namespaceDirectories.get(namespace[0]) }/${
            fileName}`;
    }

    return `/${ fullResourcePath }/${ language[0] }/${ namespace[0] }.json`;
};
