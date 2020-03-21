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

import { InitOptions, Resource } from "i18next";
import { I18nModuleConstants } from "./constants";
import * as LOCALES from "./translations";
import { SupportedLanguages } from "./models";

/**
 * Generate the i18n options.
 *
 * @param {i18next.InitOptions} options - Options override.
 * @param {boolean} override - Should the passed in options replace the default.
 * @param {boolean} debug - Debug enabled flag.
 * @return {InitOptions} Init options config.
 */
export const generateI18nOptions = (options: InitOptions, override: boolean, debug: boolean): InitOptions => {

    const DEFAULT_INIT_OPTIONS: InitOptions = {
        contextSeparator: "_",
        debug: false,
        defaultNS: I18nModuleConstants.DEFAULT_NAMESPACE,
        fallbackLng: I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE,
        interpolation: {
            escapeValue: false
        },
        keySeparator: ".",
        ns: loadDefaultNamespaces(),
        nsSeparator: ":",
        pluralSeparator: "_",
        resources: loadDefaultResources()
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
 * @return {string[]} Namespace array.
 */
const loadDefaultNamespaces = (): string[] => {

    const namespaces: string[] = [];

    for (const value of Object.values(LOCALES)) {
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
 * @return {i18next.Resource} Resource bundle.
 */
const loadDefaultResources = (): Resource => {

    let resources: Resource = {};

    for (const locale of Object.values(LOCALES)) {
        // Try to find the namespace resource file based on the namespaces array declared in meta.
        for(const resource of Object.values(locale.resources)) {
            resources = {
                ...resources,
                [ locale.meta.code ]: {
                    ...resources[ locale.meta.code ],
                    ...resource as object
                }
            };
        }
    }

    return resources;
};

/**
 * Custom backend to fetch resources at runtime.
 *
 * @param {SupportedLanguages} meta - Meta information.
 * @param {string} bundleLocation - Resource bundle path.
 * @return {Promise<i18next.Resource>} Resources as a promise.
 */
export const loadResourcesAtRuntime = async (meta: SupportedLanguages, bundleLocation: string): Promise<Resource> => {

    let resources: Resource = {};

    for (const locale of Object.values(meta)) {
        for (const [ nsKey, nsPath ] of Object.entries(locale.paths)) {
            try {
                const response = await fetch(`${ bundleLocation }/${ nsPath }`);
                const payload = await response.json();

                resources = {
                    ...resources,
                    [ locale.code ]: {
                        ...resources[ locale.code ],
                        [ nsKey ]: payload as any
                    }
                }
            } catch (e) {
                // Handle error.
            }
        }
    }

    return resources;
};

/**
 * Get the supported list of languages.
 *
 * @return {SupportedLanguages} Supported languages.
 */
export const getSupportedLanguages = (): SupportedLanguages => {

    let meta = {};

    for (const value of Object.values(LOCALES)) {
        meta = {
            ...meta,
            [ value.meta.code ]: value.meta
        };
    }

    return meta;
};
