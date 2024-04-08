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

import { MainApplicationInterface } from "./application";
import { DynamicFieldInterface } from "./dynamic-fields";

export interface ApplicationTemplateCommonInterface {
    /**
     * Unique identifier for the template.
     */
    id: string;
    /**
     * Name of the template.
     */
    name: string;
    /**
     * Description of the template.
     */
    description: string;
    /**
     * Image of the template.
     */
    image: string;
    /**
     * Order in which the template is displayed.
     */
    displayOrder: number;
    /**
     * Category of the template.
     */
    category: ApplicationTemplateCategories;
    /**
     * Tags associated with the template.
     */
    tags: string[];
    /**
     * Type of the template.
     */
    type: string;
}

/**
 * Interface for the application template list specific attributes.
 */
export interface ApplicationTemplateListInterface extends ApplicationTemplateCommonInterface {
    /**
     * URL to the template data.
     */
    self?: string;
    /**
     * Additional properties of the template.
     */
    customAttributes?: CustomAttributeInterface[];
}

/**
 * Interface for the application template.
 */
export interface ApplicationTemplateInterface extends ApplicationTemplateCommonInterface {
    /**
     * Create form payload parameters.
     */
    payload: MainApplicationInterface;
}

/**
 * Interface for the application template metadata.
 */
export interface ApplicationTemplateMetadataInterface {
    /**
     * Application creation related metadata.
     */
    create: {
        /**
         * Dynamic input fields should be rendered in the application create wizard.
         */
        form: {
            fields: DynamicFieldInterface[];
        };
        /**
         * Application creation guide metadata.
         */
        guide: {
            /**
             * Application creation guide content.
             */
            content: string;
            /**
             * Application creation guide content type.
             */
            contentType: "md" | "html" | string;
        }[];
    }
}

/**
 * Interface for the additional properties of the template.
 */
export interface CustomAttributeInterface {
    /**
     * Key of the property.
     */
    key: string,
    /**
     * Value of the property.
     */
    value: any
}

/**
 * Enum for application template categories.
 *
 * @readonly
 */
export enum ApplicationTemplateCategories {
    /**
     * Templates supported by default.
     * ex: Web Application, SPA etc.
     */
    DEFAULT = "DEFAULT",
    /**
     * SSO Integration templates.
     * ex: Zoom, Salesforce etc.
     */
    SSO_INTEGRATION = "SSO-INTEGRATION",
}

/**
 * Interface for the application template category details.
 */
export interface ApplicationTemplateCategoryInterface {
    /**
     * Unique identifier of the application template category.
     */
    id: string,
    /**
     * Display name of the application template category.
     */
    displayName: string,
    /**
     * Description of the application template category.
     */
    description?: string,
    /**
     * Order in which the application template category is displayed.
     */
    displayOrder: number
}

/**
 * Supported technology metadata interface.
 */
export interface SupportedTechnologyMetadataInterface {
    /**
     * Display name of the technology.
     */
    displayName: string;
    /**
     * URL of the technology logo.
     */
    logo?: string;
}

/**
 * Interface for the categorized application templates.
 */
export interface CategorizedApplicationTemplatesInterface extends ApplicationTemplateCategoryInterface {
    /**
     * Template associated with a specific category.
     */
    templates: ApplicationTemplateListInterface[]
}

/**
 * Supported technology metadata interface.
 */
export interface SupportedTechnologyMetadataInterface {
    /**
     * Display name of the technology.
     */
    displayName: string;
    /**
     * URL of the technology logo.
     */
    logo?: string;
}
