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

import { MainApplicationInterface } from "@wso2is/admin.applications.v1/models/application";
import { DynamicFormInterface } from "@wso2is/admin.template-core.v1/models/dynamic-fields";
import { ExtensionTemplateCommonInterface } from "@wso2is/admin.template-core.v1/models/templates";

/**
 * Interface for the application template.
 */
export interface ApplicationTemplateInterface extends ExtensionTemplateCommonInterface {
    /**
     * Create form payload parameters.
     */
    payload: MainApplicationInterface;
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
 * Interface for the application template metadata.
 */
export interface ApplicationTemplateMetadataInterface {
    /**
     * Application creation related metadata.
     */
    create?: {
        /**
         * Dynamic input fields should be rendered in the application create wizard.
         */
        form?: DynamicFormInterface;
        /**
         * Application creation guide metadata.
         */
        guide?: string[];
    }
    /**
     * Application editing section related metadata.
     */
    edit?: {
        /**
         * The metadata for tabs needs to be rendered on the edit page.
         */
        tabs: ApplicationEditTabMetadataInterface[],
        /**
         * Tab id of the default active tab.
         */
        defaultActiveTabId?: string;
    }
}

/**
 * Possible Content Types for application editing tabs.
 */
export enum ApplicationEditTabContentType {
    FORM = "form",
    GUIDE = "guide"
}

/**
 * Interface to generate a tab in the application editing section.
 */
export interface ApplicationEditTabMetadataInterface {
    /**
     * Unique identifier for the tab.
     */
    id: string;
    /**
     * Display name of the tab.
     */
    displayName?: string;
    /**
     * Content Types for current tab.
     */
    contentType?: ApplicationEditTabContentType;
    /**
     * Dynamic input fields which should be rendered in the current tab.
     */
    form?: DynamicFormInterface;
    /**
     * Guide content for application editing section.
     */
    guide?: string;
    /**
     * Component IDs that need to be hidden from a predefined tab.
     * This is only effective if the `contentType` is not defined.
     */
    hiddenComponents?: string[];
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
 * Supported application feature status list.
 */
export enum ApplicationTemplateFeatureStatus {
    NEW = "new",
    COMING_SOON = "comingSoon"
}
