/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { RouteInterface } from "@wso2is/core/models";
import { ApplicationTemplatesConfigInterface } from "../admin-applications-v1/data/application-templates";
import {
    IdentityProviderTemplatesConfigInterface
} from "../admin-identity-providers-v1/data/identity-provider-templates";

/**
 * Interface for the core extensions config.
 */
export interface ExtensionsConfigInterface {
    sections: SectionExtensionsConfigInterface;
    templateExtensions: TemplateExtensionsConfigInterface;
}

/**
 * Interface for routes extensions.
 */
export interface ExtensionRoutesInterface {
    auth?: RouteInterface[];
    default?: RouteInterface[];
    develop?: RouteInterface[];
    fullscreen?: RouteInterface[];
    manage?: RouteInterface[];
}

/**
 * Interface for the section extensions config.
 */
export interface SectionExtensionsConfigInterface {
    components: SectionComponentExtensionsConfigInterface;
}

/**
 * Interface for the section component extensions config.
 */
export interface SectionComponentExtensionsConfigInterface {
    [ key: string ]: string;
}

/**
 * Interface for the template extensions config.
 */
export interface TemplateExtensionsConfigInterface {
    applications: ApplicationTemplateExtensionsConfigInterface;
    identityProviders: IdentityProviderTemplateExtensionsConfigInterface;
}

/**
 * Interface for the application template extensions config.
 */
export type ApplicationTemplateExtensionsConfigInterface = ApplicationTemplatesConfigInterface;

/**
 * Interface for the application template extensions config.
 */
export type IdentityProviderTemplateExtensionsConfigInterface = IdentityProviderTemplatesConfigInterface;
