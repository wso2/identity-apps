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
import groupBy from "lodash-es/groupBy";
import { getConnectionTemplatesConfig } from "../configs/templates";
import { CommonAuthenticatorConstants } from "../constants/common-authenticator-constants";
import { ConnectionUIConstants } from "../constants/connection-ui-constants";
import {
    ConnectionTemplateCategoryInterface,
    ConnectionTemplateGroupInterface,
    ConnectionTemplateInterface,
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

        return this.groupConnectionTemplates(templates)
            .then((groupedTemplate: ConnectionTemplateInterface[]) => {
                templates = ConnectionTemplateManagementUtils
                    .sortConnectionTemplates(groupedTemplate);

                return templates;
            });
    };

    /**
     * Sort the IDP templates based on display order.
     *
     * @param templates - App templates.
     * @returns Sorted connection templates.
     */
    private static sortConnectionTemplates(
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

/**
 * Utility function to load local file based connection template groups.
 *
 * @returns Array of connection template groups.
 */
const loadLocalFileBasedConnectionTemplateGroups = (): ConnectionTemplateGroupInterface[] => {

    return getConnectionTemplatesConfig().groups.map(
        (groupConfig: TemplateConfigInterface<ConnectionTemplateGroupInterface>) => {
            if (groupConfig.enabled) {
                return groupConfig.resource as ConnectionTemplateGroupInterface;
            }
        });
};

/**
 * Utility function to group connection templates based on local file based groups.
 *
 * @param templates - Templates list to be grouped.
 * @returns A list of grouped templates.
 */
export const groupConnectionTemplates = (
    templates: ConnectionTemplateInterface[]): ConnectionTemplateInterface[] => {

    // Connection templates are grouped based on local file based groups.
    const localFileBasedConnectionTemplateGroups: ConnectionTemplateGroupInterface[]
        = loadLocalFileBasedConnectionTemplateGroups();

    let _templates: ConnectionTemplateInterface[] = [ ...templates ];
    const groupedTemplates: ConnectionTemplateInterface[] = [];

    for (const group of localFileBasedConnectionTemplateGroups) {
        const updatedGroup: ConnectionTemplateGroupInterface = { ...group };

        /**
         * OIDC and SAML are grouped under "Enterprise Protocols".
         */
        if (group.id === ConnectionUIConstants.CONNECTION_TEMPLATE_GROUPS.ENTERPRISE_PROTOCOLS) {
            const subTemplateIds: string[] = [
                CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.OIDC,
                CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.SAML
            ];

            updatedGroup.subTemplates = _templates
                .filter((template: ConnectionTemplateInterface) => {
                    return subTemplateIds.includes(template.id);
                });
            // Remove grouped sub templates from main template list.
            _templates = _templates.filter((template: ConnectionTemplateInterface) => {
                return !subTemplateIds.includes(template.id);
            });
        }

        /**
         * Custom authenticators are grouped under "Custom Authentication".
         */
        if (group.id === ConnectionUIConstants.CONNECTION_TEMPLATE_GROUPS.CUSTOM_AUTHENTICATION) {
            const subTemplateIds: string[] = [
                CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.EXTERNAL_CUSTOM_AUTHENTICATION,
                CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.INTERNAL_CUSTOM_AUTHENTICATION
            ];

            updatedGroup.subTemplates = _templates
                .filter((template: ConnectionTemplateInterface) => {
                    return subTemplateIds.includes(template.id);
                });

            // Remove grouped sub templates from main template list.
            _templates = _templates.filter((template: ConnectionTemplateInterface) => {
                return !subTemplateIds.includes(template.id);
            });
        }

        groupedTemplates.push(updatedGroup);
    }

    return [ ...groupedTemplates, ..._templates ];
};

