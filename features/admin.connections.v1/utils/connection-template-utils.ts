/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import SIWEIdPTemplate from "@wso2is/admin.extensions.v1/identity-provider-templates/templates/swe/swe.json";
import { I18n } from "@wso2is/i18n";
import groupBy from "lodash-es/groupBy";
import { getConnectionTemplatesConfig } from "../configs/templates";
import { getConnectionCapabilityIcons } from "../configs/ui";
import {
    ConnectionTemplateCategoryInterface,
    ConnectionTemplateGroupInterface,
    ConnectionTemplateInterface,
    SupportedServices,
    SupportedServicesInterface,
    TemplateConfigInterface
} from "../models/connection";

/**
 * Utility class for IDP Templates related operations.
 */
export class ConnectionTemplateManagementUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    /**
     * Retrieve IDP template list from local files or API and sets it in redux state.
     *
     * @param skipGrouping - Skip grouping of templates.
     * @param useAPI - Flag to determine whether to use API or local files.
     * @param sort - Should the returning templates be sorted.
     * @returns Reordered connection templates.
     */
    public static reorderConnectionTemplates = (
        templates: ConnectionTemplateInterface[]
    ): Promise<ConnectionTemplateInterface[]> => {

        return ConnectionTemplateManagementUtils.groupConnectionTemplates(templates)
            .then((groupedTemplate: ConnectionTemplateInterface[]) => {
                templates = ConnectionTemplateManagementUtils
                    .sortConnectionTemplates(groupedTemplate);

                return templates;
            });
    };

    /**
     * Build supported services from the given service identifiers.
     *
     * @param serviceIdentifiers - Set of service identifiers.
     */
    public static buildSupportedServices = (serviceIdentifiers: string[]): SupportedServicesInterface[] => {
        return serviceIdentifiers?.map((serviceIdentifier: string): SupportedServicesInterface => {
            switch (serviceIdentifier) {
                case SupportedServices.AUTHENTICATION:
                    return {
                        displayName: I18n.instance.t(
                            "console:develop.pages.authenticationProviderTemplate.supportServices." +
                                "authenticationDisplayName"
                        ),
                        logo: getConnectionCapabilityIcons()[SupportedServices.AUTHENTICATION],
                        name: SupportedServices.AUTHENTICATION
                    };
                case SupportedServices.PROVISIONING:
                    return {
                        displayName: I18n.instance.t(
                            "console:develop.pages.authenticationProviderTemplate.supportServices." +
                                "provisioningDisplayName"
                        ),
                        logo: getConnectionCapabilityIcons()[SupportedServices.PROVISIONING],
                        name: SupportedServices.PROVISIONING
                    };
            }
        });
    };

    /**
     * Sort the IDP templates based on display order.
     *
     * @param templates - App templates.
     * @returns Sorted connection templates.
     */
    public static sortConnectionTemplates(
        templates: ConnectionTemplateInterface[]): ConnectionTemplateInterface[] {

        const identityProviderTemplates: ConnectionTemplateInterface[] = [ ...templates ];

        // Sort templates based on displayOrder.
        identityProviderTemplates.sort((a: ConnectionTemplateInterface, b: ConnectionTemplateInterface) =>
            (a.displayOrder !== -1 ? a.displayOrder : Infinity) - (b.displayOrder !== -1 ? b.displayOrder : Infinity));

        return identityProviderTemplates;
    }

    /**
     * Categorize the IDP templates.
     *
     * @param templates - Templates list.
     * @returns Categorized templates.
     */
    public static categorizeTemplates(
        templates: ConnectionTemplateInterface[]): Promise<void | ConnectionTemplateCategoryInterface[]> {

        let categorizedTemplates: ConnectionTemplateCategoryInterface[] = [];

        const groupedByCategory: Record<string, ConnectionTemplateInterface[]> = groupBy(templates, "category");

        return this.loadLocalFileBasedTemplateCategories()
            .then((categories: ConnectionTemplateCategoryInterface[]) => {

                categorizedTemplates = [ ...categories ];

                categorizedTemplates.forEach((category: ConnectionTemplateCategoryInterface) => {
                    if (Object.prototype.hasOwnProperty.call(groupedByCategory, category.id)) {
                        category.templates = groupedByCategory[ category.id ];
                    }
                });

                return categorizedTemplates;
            })
            .catch(() => {
                return categorizedTemplates;
            });
    }

    /**
     * Group the identity provider templates.
     * @param templates - Templates list to be grouped.
     */
    private static async groupConnectionTemplates(
        templates: ConnectionTemplateInterface[]
    ): Promise<ConnectionTemplateInterface[]> {

        const groupedTemplates: ConnectionTemplateInterface[] = [];

        return ConnectionTemplateManagementUtils
            .loadLocalFileBasedIdentityProviderTemplateGroups()
            .then((response: ConnectionTemplateGroupInterface[]) => {
                templates.forEach((template: ConnectionTemplateInterface) => {
                    if (!template?.templateGroup) {
                        groupedTemplates.push(template);

                        return;
                    }

                    const group: ConnectionTemplateGroupInterface = response
                        .find((group: ConnectionTemplateGroupInterface) => {
                            return group.id === template?.templateGroup;
                        });

                    if (!group) {
                        groupedTemplates.push(template);

                        return;
                    }
                    if (groupedTemplates.some((groupedTemplate: ConnectionTemplateInterface) =>
                        groupedTemplate?.id === template.templateGroup)) {
                        groupedTemplates.forEach((editingTemplate: ConnectionTemplateInterface, index: number) => {
                            if (editingTemplate?.id === template?.templateGroup) {
                                groupedTemplates[ index ] = {
                                    ...group,
                                    subTemplates: [ ...editingTemplate.subTemplates, template ]
                                };

                                return;
                            }
                        });

                        return;
                    }
                    groupedTemplates.push({
                        ...group,
                        subTemplates: [ template ]
                    });
                });

                return groupedTemplates;
            });

    }

    /**
     * Once called it will return the available groups from the
     * {@link getConnectionTemplatesConfig}
     */
    private static async loadLocalFileBasedIdentityProviderTemplateGroups():
        Promise<(ConnectionTemplateGroupInterface |
            Promise<ConnectionTemplateGroupInterface>)[]> {

        const groups: (ConnectionTemplateGroupInterface
            | Promise<ConnectionTemplateGroupInterface>)[] = [];

        getConnectionTemplatesConfig().groups.forEach(
            async (config: TemplateConfigInterface<ConnectionTemplateGroupInterface>) => {
                if (!config.enabled) return;
                groups.push(
                    config.resource as (ConnectionTemplateGroupInterface |
                        Promise<ConnectionTemplateGroupInterface>)
                );
            }
        );

        return Promise.all([ ...groups ]);

    }

    /**
     * Loads local file based IDP template categories.
     */
    private static async loadLocalFileBasedTemplateCategories(): Promise<(ConnectionTemplateCategoryInterface
        | Promise<ConnectionTemplateCategoryInterface>)[]> {

        const categories: (ConnectionTemplateCategoryInterface
                | Promise<ConnectionTemplateCategoryInterface>)[] = [];

        getConnectionTemplatesConfig().categories
            .forEach(async (config: TemplateConfigInterface<ConnectionTemplateCategoryInterface>) => {
                if (!config.enabled) {
                    return;
                }

                categories.push(
                        config.resource as (
                            ConnectionTemplateCategoryInterface
                            | Promise<ConnectionTemplateCategoryInterface>)
                );
            });

        return Promise.all([ ...categories ]);
    }
}

export const getCertificateOptionsForTemplate = (templateId: string): { JWKS: boolean; PEM: boolean } | undefined => {
    if (templateId === SIWEIdPTemplate.templateId) {
        return {
            JWKS: false,
            PEM: false
        };
    }

    return undefined;
};
