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
import * as LOCALES from "./content";
import { SupportedLanguages } from "./models";

export const generateI18nOptions = (options: InitOptions, override: boolean, debug: boolean) => {

    const DEFAULT_INIT_OPTIONS: InitOptions = {
        contextSeparator: "_",
        debug: false,
        defaultNS: I18nModuleConstants.DEFAULT_NAMESPACE,
        fallbackLng: I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE,
        interpolation: {
            escapeValue: false
        },
        keySeparator: ".",
        ns: readNamespaces(),
        nsSeparator: ":",
        pluralSeparator: "_",
        resources: loadResources()
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

export const readNamespaces = (): string[] => {

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

export const loadResources = (): Resource => {

    let resources: Resource = {};

    for (const value of Object.values(LOCALES)) {
        resources = {
            ...resources,
            [ value.meta.code ]: value.resources
        };
    }

    return resources;
};

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
