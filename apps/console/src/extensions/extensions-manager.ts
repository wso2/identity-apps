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

import { ExtensionsConfig } from "./config";
import { ApplicationTemplateExtensionsConfigInterface, ExtensionsConfigInterface } from "./models";
import { TemplateConfigInterface } from "../features/applications/data/application-templates";
import {
    ApplicationTemplateCategoryInterface,
    ApplicationTemplateGroupInterface,
    ApplicationTemplateInterface
} from "../features/applications/models";

/**
 * Class to manage extensions.
 */
export class ExtensionsManager {

    private static instance = new ExtensionsManager();
    private static readonly APPLICATION_TEMPLATES_FOLDER_RELATIVE_PATH: string = "./";

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    private constructor() { }

    /**
     * Returns an instance of the class.
     *
     * @return {ExtensionsManager}
     */
    public static getInstance(): ExtensionsManager {

        return this.instance;
    }

    /**
     * Returns the extensions config.
     *
     * @return {ExtensionsConfigInterface}
     */
    public getConfig(): ExtensionsConfigInterface {

        return ExtensionsConfig;
    }

    /**
     * Builds and returns the application template config.
     *
     * @return {ApplicationTemplateExtensionsConfigInterface}
     */
    public getApplicationTemplatesConfig(): ApplicationTemplateExtensionsConfigInterface {

        const config: ApplicationTemplateExtensionsConfigInterface = this.getConfig()?.templateExtensions?.applications;

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
     * Tries to resolve the template resources, lazy loading whenever necessary.
     *
     * @param {TemplateConfigInterface<T>} templateConfig - Template config.
     * @return {TemplateConfigInterface<T>}
     */
    private static lazyLoadTemplateResources<T = {}>(
        templateConfig: TemplateConfigInterface<T>): TemplateConfigInterface<T> {

        if (typeof templateConfig.resource !== "string") {

            return templateConfig;
        }

        return {
            ...templateConfig,
            resource: import(`${
                ExtensionsManager.APPLICATION_TEMPLATES_FOLDER_RELATIVE_PATH
                }${ templateConfig.resource }`).then(module => module.default)
        };
    }
}
