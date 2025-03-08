/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import {
    TemplateConfigInterface,
    TemplateContentInterface
} from "@wso2is/admin.applications.v1/data/application-templates/application-templates-config";
import {
    ApplicationTemplateCategoryInterface,
    ApplicationTemplateGroupInterface,
    ApplicationTemplateInterface
} from "@wso2is/admin.applications.v1/models/application";
import {
    ConnectionTemplateCategoryInterface,
    ConnectionTemplateGroupInterface
} from "@wso2is/admin.connections.v1/models/connection";
import {
    IdentityProviderTemplateListItemInterface
} from "@wso2is/admin.identity-providers.v1/models";
import isObject from "lodash-es/isObject";
import { lazy } from "react";
import { ExtensionsConfig } from "./config";
import {
    ApplicationTemplateExtensionsConfigInterface,
    ExtensionsConfigInterface,
    IdentityProviderTemplateExtensionsConfigInterface
} from "./models";

/**
 * Class to manage extensions.
 */
export class ExtensionsManager {

    private static instance: ExtensionsManager = new ExtensionsManager();

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    /**
     *
     * @returns an instance of the class.
     */
    public static getInstance(): ExtensionsManager {

        return this.instance;
    }

    /**
     *
     * @returns the extensions config.
     */
    public static getConfig(): ExtensionsConfigInterface {

        return ExtensionsConfig();
    }

    /**
     * Builds and returns the application template config.
     *
     * @returns the application template config.
     */
    public getApplicationTemplatesConfig(): ApplicationTemplateExtensionsConfigInterface {

        const config: ApplicationTemplateExtensionsConfigInterface = ExtensionsManager.getConfig()
            .templateExtensions?.applications;

        if (!config) {
            return {
                categories: [],
                groups: [],
                templates: []
            };
        }

        // If categories exists, try to resolve the category config by lazy loading the resource etc.
        if (config.categories && Array.isArray(config.categories) && config.categories.length > 0) {
            config.categories = config.categories
                .map((category: TemplateConfigInterface<ApplicationTemplateCategoryInterface>) => {
                    return ExtensionsManager.lazyLoadTemplateResources<ApplicationTemplateCategoryInterface>(category);
                });
        }

        // If groups exists, try to resolve the group config by lazy loading the resource etc.
        if (config.groups && Array.isArray(config.groups) && config.groups.length > 0) {
            config.groups = config.groups
                .map((group: TemplateConfigInterface<ApplicationTemplateGroupInterface>) => {
                    return ExtensionsManager.lazyLoadTemplateResources<ApplicationTemplateGroupInterface>(group);
                });
        }

        // If templates exists, try to resolve the group config by lazy loading the resource etc.
        if (config.templates && Array.isArray(config.templates) && config.templates.length > 0) {
            config.templates = config.templates
                .map((template: TemplateConfigInterface<ApplicationTemplateInterface>) => {
                    return ExtensionsManager.lazyLoadTemplateResources<ApplicationTemplateGroupInterface>(template);
                });
        }

        return config;
    }


    /**
     * Builds and returns the IDP template config.
     *
     * @returns the IDP template config.
     */
    public getIdentityProviderTemplatesConfig(): IdentityProviderTemplateExtensionsConfigInterface {

        const config: IdentityProviderTemplateExtensionsConfigInterface = ExtensionsManager.getConfig()
            .templateExtensions?.identityProviders;

        if (!config) {
            return {
                categories: [],
                groups: [],
                templates: []
            };
        }

        // If categories exists, try to resolve the category config by lazy loading the resource etc.
        if (config.categories && Array.isArray(config.categories) && config.categories.length > 0) {
            config.categories = config.categories
                .map((category: TemplateConfigInterface<ConnectionTemplateCategoryInterface>) => {
                    return ExtensionsManager
                        .lazyLoadTemplateResources<ConnectionTemplateCategoryInterface>(category);
                });
        }

        // If groups exists, try to resolve the group config by lazy loading the resource etc.
        if (config.groups && Array.isArray(config.groups) && config.groups.length > 0) {
            config.groups = config.groups
                .map((group: TemplateConfigInterface<ConnectionTemplateGroupInterface>) => {
                    return ExtensionsManager.
                        lazyLoadTemplateResources<IdentityProviderTemplateListItemInterface>(group);
                });
        }

        // If templates exists, try to resolve the group config by lazy loading the resource etc.
        if (config.templates && Array.isArray(config.templates) && config.templates.length > 0) {
            config.templates = config.templates
                .map((template: TemplateConfigInterface<IdentityProviderTemplateListItemInterface>) => {
                    return ExtensionsManager.
                        lazyLoadTemplateResources<IdentityProviderTemplateListItemInterface>(template);
                });
        }

        return config;
    }

    /**
     * Tries to resolve the template resources, lazy loading whenever necessary.
     *
     * @param templateConfig - Template config.
     * @returns the resolved template config.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    private static lazyLoadTemplateResources<T = {}>(
        templateConfig: TemplateConfigInterface<T>): TemplateConfigInterface<T> {

        // Dynamically lazy loads the content.
        const loadContent = (content: TemplateContentInterface): TemplateContentInterface => {

            if (!content && !isObject(content)) {
                return null;
            }

            for (const [ key, value ] of Object.entries(content)) {

                // Strip the prefix './application-templates/', './identity-provider-templates/`
                // and the '.tsx' extension to overcome rollup limitation
                //https://www.npmjs.com/package/@rollup/plugin-dynamic-import-vars
                if (value.includes("application-templates")) {
                    const valueStripped: string = value
                        .replace(/^\.\/application-templates\//, "")
                        .replace(/\.tsx$/, "");

                    content[ key ] = lazy(() => import(`./application-templates/${ valueStripped }.tsx`));
                } else if (value.includes("identity-provider-templates")) {
                    const valueStripped: string = value
                        .replace(/^\.\/identity-provider-templates\//, "")
                        .replace(/\.tsx$/, "");

                    content[ key ] = lazy(() => import(`./identity-provider-templates/${ valueStripped }.tsx`));
                }
            }

            return content;
        };

        // Lazy loads the resource.
        const loadResource = (resource: any) => {

            if (typeof resource !== "string") {
                return resource;
            }

            // Strip the prefix './application-templates/', './identity-provider-templates/`
            // and the '.json' extension to overcome rollup limitation
            //https://www.npmjs.com/package/@rollup/plugin-dynamic-import-vars
            if (resource.includes("application-templates")) {
                const resourceStripped: string = resource
                    .replace(/^\.\/application-templates\//, "")
                    .replace(/\.json$/, "");

                return import(`./application-templates/${resourceStripped}.json`).then((module: any) => module.default);
            }

            if (resource.includes("identity-provider-templates")) {
                const resourceStripped: string = resource
                    .replace(/^\.\/identity-provider-templates\//, "")
                    .replace(/\.json$/, "");

                return import(`./identity-provider-templates/${resourceStripped}.json`).then(
                    (module: any) => module.default
                );
            }
        };

        return {
            ...templateConfig,
            content: loadContent(templateConfig?.content),
            resource: loadResource(templateConfig?.resource)
        };
    }
}
