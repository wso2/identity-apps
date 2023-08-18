/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RouteInterface } from "@wso2is/core/models";
import { ApplicationTemplatesConfigInterface } from "../features/applications/data/application-templates";
import {
    IdentityProviderTemplatesConfigInterface
} from "../features/identity-providers/data/identity-provider-templates";

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
