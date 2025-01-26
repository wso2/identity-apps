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

/**
 * Interface for the extension template common attributes.
 */
export interface ExtensionTemplateCommonInterface {
    /**
     * Unique identifier for the template.
     */
    id: string;
    /**
     * Version of the template.
     */
    version?: string;
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
    category: string;
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
 * Interface for the additional properties of the template.
 */
export interface CustomAttributeInterface {
    /**
     * Key of the property.
     */
    key: string;
    /**
     * Value of the property.
     */
    value: any;
}

/**
 * Interface for the extension template list specific attributes.
 */
export interface ExtensionTemplateListInterface extends ExtensionTemplateCommonInterface {
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
 * Interface for the extension template category details.
 */
export interface ExtensionTemplateCategoryInterface {
    /**
     * Unique identifier of the template category.
     */
    id: string;
    /**
     * Display name of the template category.
     */
    displayName: string;
    /**
     * Description of the template category.
     */
    description?: string;
    /**
     * Order in which the template category is displayed.
     */
    displayOrder: number;
}

/**
 * Interface for the categorized extension templates.
 */
export interface CategorizedExtensionTemplatesInterface extends ExtensionTemplateCategoryInterface {
    /**
     * Template associated with a specific category.
     */
    templates: ExtensionTemplateListInterface[];
}

/**
 * Types of resources supported by the Extension Management Service.
 */
export enum ResourceTypes {
    APPLICATIONS = "application",
    CONNECTIONS = "connection",
    NOTIFICATION_PROVIDERS = "notification-provider",
}
