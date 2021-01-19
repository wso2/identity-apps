/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 *
 */

import { I18n } from "@wso2is/i18n";
import { Dictionary } from "lodash";
import groupBy from "lodash/groupBy";
import { store } from "../../core";
import {
    getIdentityProviderTemplateList
} from "../api";
import { TemplateConfigInterface, getIdentityProviderTemplatesConfig } from "../data/identity-provider-templates";
import {
    IdentityProviderTemplateCategoryInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateListItemInterface,
    IdentityProviderTemplateListResponseInterface,
    SupportedServices,
    SupportedServicesInterface
} from "../models";
import { setIdentityProviderTemplates } from "../store";
import { getIdPCapabilityIcons } from "../configs";
import { ExpertModeTemplate } from "../components/meta";
import { handleGetIDPTemplateListError } from "../components/utils";

/**
 * Utility class for IDP Templates related operations.
 */
export class IdentityProviderTemplateManagementUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    private constructor() { }

    /**
     * Retrieve IDP template list from local files or API and sets it in redux state.
     *
     * @param {boolean} skipGrouping - Skip grouping of templates.
     * @param {boolean} useAPI - Flag to determine whether to use API or local files.
     * @param {boolean} sort - Should the returning templates be sorted.
     * @return {Promise<void>}
     */
    public static getIdentityProviderTemplates = (useAPI: boolean = false, skipGrouping: boolean = false,
                                             sort: boolean = true): Promise<void> => {

        if (!useAPI) {
            return IdentityProviderTemplateManagementUtils.loadLocalFileBasedTemplates()
                .then((response: IdentityProviderTemplateListItemInterface[]) => {

                    const templates: IdentityProviderTemplateListItemInterface[] = IdentityProviderTemplateManagementUtils
                        .resolveHelpContent(response);

                    let templatesWithServices: IdentityProviderTemplateInterface[] =
                        IdentityProviderTemplateManagementUtils.interpretAvailableTemplates(templates);

                    if (sort) {
                        templatesWithServices =
                            IdentityProviderTemplateManagementUtils.sortIdentityProviderTemplates(templatesWithServices);
                    }

                    store.dispatch(setIdentityProviderTemplates(templatesWithServices));

                    return Promise.resolve();
                });
        }

        return getIdentityProviderTemplateList()
            .then((response: IdentityProviderTemplateListResponseInterface) => {
                if (!response?.totalResults) {
                    return;
                }
                // sort templateList based on display Order
                response?.templates.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);
                const availableTemplates: IdentityProviderTemplateInterface[] = 
                    IdentityProviderTemplateManagementUtils.interpretAvailableTemplates(response?.templates);

                // Add expert mode template
                availableTemplates.unshift(ExpertModeTemplate);

                store.dispatch(setIdentityProviderTemplates(availableTemplates));
                return Promise.resolve();
            })
            .catch((error) => {
                handleGetIDPTemplateListError(error);
            });
    };
    /**
     * Build supported services from the given service identifiers.
     *
     * @param serviceIdentifiers Set of service identifiers.
     */
    public static buildSupportedServices = (serviceIdentifiers: string[]): SupportedServicesInterface[] => {
        return serviceIdentifiers?.map((serviceIdentifier: string): SupportedServicesInterface => {
            switch (serviceIdentifier) {
                case SupportedServices.AUTHENTICATION:
                    return {
                        displayName: I18n.instance.t("console:develop.pages.idpTemplate.supportServices." +
                            "authenticationDisplayName"),
                        logo: getIdPCapabilityIcons()[SupportedServices.AUTHENTICATION],
                        name: SupportedServices.AUTHENTICATION
                    };
                case SupportedServices.PROVISIONING:
                    return {
                        displayName: I18n.instance.t("console:develop.pages.idpTemplate.supportServices." +
                            "provisioningDisplayName"),
                        logo: getIdPCapabilityIcons()[SupportedServices.PROVISIONING],
                        name: SupportedServices.PROVISIONING
                    };
            }
        });
    };


    /**
     * Interpret available templates from the response templates.
     *
     * @param templates List of response templates.
     * @return List of templates.
     */
    public static interpretAvailableTemplates = (templates: IdentityProviderTemplateListItemInterface[]):
        IdentityProviderTemplateInterface[] => {
        return templates?.map(eachTemplate => {
            if (eachTemplate?.services[0] === "") {
                return {
                    ...eachTemplate,
                    services: []
                };
            } else {
                return {
                    ...eachTemplate,
                    services: IdentityProviderTemplateManagementUtils.buildSupportedServices(eachTemplate?.services)
                };
            }
        });
    };

    /**
     * Sort the IDP templates based on display order.
     *
     * @param {IdentityProviderTemplateInterface[]} templates - App templates.
     * @return {IdentityProviderTemplateInterface[]}
     */
    private static sortIdentityProviderTemplates(
        templates: IdentityProviderTemplateInterface[]): IdentityProviderTemplateInterface[] {

        const identityProviderTemplates = [ ...templates ];

        // Sort templates based on displayOrder.
        identityProviderTemplates.sort((a, b) =>
            (a.displayOrder !== -1 ? a.displayOrder : Infinity) - (b.displayOrder !== -1 ? b.displayOrder : Infinity));

        return identityProviderTemplates;
    }

    /**
     * Categorize the IDP templates.
     *
     * @param {IdentityProviderTemplateInterface[]} templates - Templates list.
     * @return {Promise<void | IdentityProviderTemplateCategoryInterface[]>}
     */
    public static categorizeTemplates(
        templates: IdentityProviderTemplateInterface[]): Promise<void | IdentityProviderTemplateCategoryInterface[]> {

        let categorizedTemplates: IdentityProviderTemplateCategoryInterface[] = [];

        const groupedByCategory: Dictionary<IdentityProviderTemplateInterface[]> = groupBy(templates, "category");

        return this.loadLocalFileBasedTemplateCategories()
            .then((categories: IdentityProviderTemplateCategoryInterface[]) => {

                categorizedTemplates = [ ...categories ];

                categorizedTemplates.forEach((category: IdentityProviderTemplateCategoryInterface) => {
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
     * Loads local file based IDP templates.
     *
     * @return {Promise<(IdentityProviderTemplateInterface | Promise<IdentityProviderTemplateInterface>)[]>}
     */
    private static async loadLocalFileBasedTemplates(): Promise<(IdentityProviderTemplateListItemInterface
        | Promise<IdentityProviderTemplateListItemInterface>)[]> {

        const templates: (IdentityProviderTemplateListItemInterface | Promise<IdentityProviderTemplateListItemInterface>)[] = [];

        getIdentityProviderTemplatesConfig().templates
            .map(async (config: TemplateConfigInterface<IdentityProviderTemplateListItemInterface>) => {
                if (!config.enabled) {
                    return;
                }

                templates.push(
                    config.resource as (IdentityProviderTemplateListItemInterface | Promise<IdentityProviderTemplateListItemInterface>)
                );
            });

        return Promise.all([ ...templates ]);
    }

    /**
     * Loads local file based IDP template categories.
     *
     * @return {Promise<(IdentityProviderTemplateCategoryInterface | Promise<IdentityProviderTemplateCategoryInterface>)[]>}
     */
    private static async loadLocalFileBasedTemplateCategories(): Promise<(IdentityProviderTemplateCategoryInterface
        | Promise<IdentityProviderTemplateCategoryInterface>)[]> {

        const categories: (IdentityProviderTemplateCategoryInterface | Promise<IdentityProviderTemplateCategoryInterface>)[] = [];

        getIdentityProviderTemplatesConfig().categories
            .forEach(async (config: TemplateConfigInterface<IdentityProviderTemplateCategoryInterface>) => {
                if (!config.enabled) {
                    return;
                }

                categories.push(
                    config.resource as (
                        IdentityProviderTemplateCategoryInterface
                        | Promise<IdentityProviderTemplateCategoryInterface>)
                );
            });

        return Promise.all([ ...categories ]);
    }

    /**
     * Resolves the help content for the respective template.
     *
     * @param {IdentityProviderTemplateInterface[]} templates - Input templates.
     * @return {IdentityProviderTemplateInterface[]}
     */
    private static resolveHelpContent(templates: IdentityProviderTemplateListItemInterface[]): IdentityProviderTemplateListItemInterface[] {

        templates.map((template: IdentityProviderTemplateListItemInterface) => {
            const config = getIdentityProviderTemplatesConfig().templates
                .find((config: TemplateConfigInterface<IdentityProviderTemplateListItemInterface>) => {
                    return config.id === template.id;
                });

            if (!config?.content) {
                return;
            }

            template.content = config.content;
        });

        return templates;
    }
}
