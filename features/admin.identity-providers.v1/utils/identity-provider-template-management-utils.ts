/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { I18n } from "@wso2is/i18n";
import { AxiosError } from "axios";
import groupBy from "lodash-es/groupBy";
import { store } from "../../admin.core.v1";
import { getIdentityProviderTemplateList } from "../api";
import { handleGetIDPTemplateListError } from "../components/utils/common-utils";
import { getIdPCapabilityIcons } from "../configs/ui";
import { TemplateConfigInterface, getIdentityProviderTemplatesConfig } from "../data/identity-provider-templates";
import ExpertModeIdPTemplate from "../data/identity-provider-templates/templates/expert-mode/expert-mode.json";
import {
    IdentityProviderTemplateCategoryInterface,
    IdentityProviderTemplateGroupInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateListItemInterface,
    IdentityProviderTemplateListResponseInterface,
    SupportedServices,
    SupportedServicesInterface
} from "../models";
import { setIdentityProviderTemplates } from "../store";

/**
 * Utility class for IDP Templates related operations.
 */
export class IdentityProviderTemplateManagementUtils {

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
     * @returns Identity provider template list.
     */
    public static getIdentityProviderTemplates = (useAPI: boolean = false,
        skipGrouping: boolean = false,
        sort: boolean = true
    ): Promise<void | IdentityProviderTemplateInterface[]> => {

        if (!useAPI) {
            return IdentityProviderTemplateManagementUtils.loadLocalFileBasedTemplates()
                /**
                 * TODO: check why type errors are appearing even if we pass down the
                 *       correct mapping interfaces. These compilation type errors are
                 *       identified during adding support for grouped idp templates.
                 *       This is why some of the types marked as `any` type.
                 */
                .then((response: any): any => {

                    let templates: IdentityProviderTemplateInterface[]
                        = IdentityProviderTemplateManagementUtils.resolveHelpContent(response);

                    if (!skipGrouping) {
                        IdentityProviderTemplateManagementUtils.groupIdentityProviderTemplates(templates)
                            .then((groups: IdentityProviderTemplateInterface[]) => {
                                if (sort) {
                                    templates = IdentityProviderTemplateManagementUtils
                                        .sortIdentityProviderTemplates(templates);
                                    groups = IdentityProviderTemplateManagementUtils
                                        .sortIdentityProviderTemplates(groups);
                                }
                                store.dispatch(setIdentityProviderTemplates(templates));
                                store.dispatch(setIdentityProviderTemplates(groups, true));

                                return Promise.resolve();
                            });

                        return Promise.resolve();
                    }

                    let templatesWithServices: IdentityProviderTemplateInterface[] =
                        IdentityProviderTemplateManagementUtils.interpretAvailableTemplates(templates);

                    if (sort) {
                        templatesWithServices =
                            IdentityProviderTemplateManagementUtils
                                .sortIdentityProviderTemplates(templatesWithServices);
                    }

                    store.dispatch(setIdentityProviderTemplates(templatesWithServices));

                    return Promise.resolve(templatesWithServices);
                });
        }

        return getIdentityProviderTemplateList()
            .then((response: IdentityProviderTemplateListResponseInterface) => {
                if (!response?.totalResults) {
                    return;
                }
                // sort templateList based on display Order
                response?.templates.sort(
                    (a: IdentityProviderTemplateListItemInterface, b: IdentityProviderTemplateListItemInterface) => (
                        a.displayOrder > b.displayOrder) ? 1 : -1);
                const availableTemplates: IdentityProviderTemplateInterface[] =
                    IdentityProviderTemplateManagementUtils.interpretAvailableTemplates(response?.templates);

                // Add expert mode template
                availableTemplates.unshift(ExpertModeIdPTemplate);

                store.dispatch(setIdentityProviderTemplates(availableTemplates));

                return Promise.resolve(availableTemplates);
            })
            .catch((error: AxiosError) => {
                handleGetIDPTemplateListError(error);
            });
    };

    /**
     * Retrieve the IDP template identified by the template ID from local files.
     *
     * @param templateId - ID of the template.
     * @param _skipGrouping - Skip grouping of templates.
     * @param sort - Should the returning templates be sorted.
     * @returns Identity provider template.
     */
    public static getIdentityProviderTemplate = (templateId: string, _skipGrouping: boolean = false,
        sort: boolean = true): Promise<IdentityProviderTemplateInterface> => {

        return IdentityProviderTemplateManagementUtils.loadLocalFileBasedTemplates()
            .then((response: any): any => {

                response = response.filter((template: IdentityProviderTemplateListItemInterface) => {
                    return template.id === templateId;
                });
                const templates: any = IdentityProviderTemplateManagementUtils
                    .resolveHelpContent(response);

                let templatesWithServices: IdentityProviderTemplateInterface[] =
                    IdentityProviderTemplateManagementUtils.interpretAvailableTemplates(templates);

                if (sort) {
                    templatesWithServices =
                        IdentityProviderTemplateManagementUtils.sortIdentityProviderTemplates(templatesWithServices);
                }

                return Promise.resolve(templatesWithServices[0]);
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
                        logo: getIdPCapabilityIcons()[SupportedServices.AUTHENTICATION],
                        name: SupportedServices.AUTHENTICATION
                    };
                case SupportedServices.PROVISIONING:
                    return {
                        displayName: I18n.instance.t(
                            "console:develop.pages.authenticationProviderTemplate.supportServices." +
                                "provisioningDisplayName"
                        ),
                        logo: getIdPCapabilityIcons()[SupportedServices.PROVISIONING],
                        name: SupportedServices.PROVISIONING
                    };
            }
        });
    };


    /**
     * Interpret available templates from the response templates.
     *
     * @param templates - List of response templates.
     * @returns List of templates.
     */
    public static interpretAvailableTemplates = (templates: any[]):
        IdentityProviderTemplateInterface[] => {
        return templates?.map((eachTemplate: any) => {
            if (eachTemplate?.services[ 0 ] === "") {
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
     * @param templates - App templates.
     * @returns Sorted templates.
     */
    private static sortIdentityProviderTemplates(
        templates: IdentityProviderTemplateInterface[]): IdentityProviderTemplateInterface[] {

        const identityProviderTemplates: IdentityProviderTemplateInterface[] = [ ...templates ];

        // Sort templates based on displayOrder.
        identityProviderTemplates.sort((a: IdentityProviderTemplateInterface, b: IdentityProviderTemplateInterface) =>
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
        templates: IdentityProviderTemplateInterface[]): Promise<void | IdentityProviderTemplateCategoryInterface[]> {

        let categorizedTemplates: IdentityProviderTemplateCategoryInterface[] = [];

        const groupedByCategory: Record<string, IdentityProviderTemplateInterface[]> = groupBy(templates, "category");

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
     * Group the identity provider templates.
     * @param templates - Identity provider templates.
     */
    private static async groupIdentityProviderTemplates(
        templates: IdentityProviderTemplateInterface[]
    ): Promise<IdentityProviderTemplateInterface[]> {

        const groupedTemplates: IdentityProviderTemplateInterface[] = [];

        return IdentityProviderTemplateManagementUtils
            .loadLocalFileBasedIdentityProviderTemplateGroups()
            .then((response: IdentityProviderTemplateGroupInterface[]) => {
                templates.forEach((template: IdentityProviderTemplateInterface) => {
                    if (!template.templateGroup) {
                        groupedTemplates.push(template);

                        return;
                    }
                    const group: IdentityProviderTemplateGroupInterface = response
                        .find((group: IdentityProviderTemplateGroupInterface) => {
                            return group.id === template.templateGroup;
                        });

                    if (!group) {
                        groupedTemplates.push(template);

                        return;
                    }
                    if (groupedTemplates.some((groupedTemplate: IdentityProviderTemplateInterface) =>
                        groupedTemplate.id === template.templateGroup)) {
                        groupedTemplates.forEach(
                            (editingTemplate: IdentityProviderTemplateInterface, index: number) => {
                                if (editingTemplate.id === template.templateGroup) {
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
     * {@link getIdentityProviderTemplatesConfig}
     */
    private static async loadLocalFileBasedIdentityProviderTemplateGroups():
        Promise<(IdentityProviderTemplateGroupInterface |
            Promise<IdentityProviderTemplateGroupInterface>)[]> {

        const groups: (IdentityProviderTemplateGroupInterface
            | Promise<IdentityProviderTemplateGroupInterface>)[] = [];

        getIdentityProviderTemplatesConfig().groups.forEach(
            async (config: TemplateConfigInterface<IdentityProviderTemplateGroupInterface>) => {
                if (!config.enabled) return;
                groups.push(
                    config.resource as (IdentityProviderTemplateGroupInterface |
                        Promise<IdentityProviderTemplateGroupInterface>)
                );
            }
        );

        return Promise.all([ ...groups ]);

    }

    /**
     * Loads local file based IDP templates.
     *
     * @returns Local file based IDP templates.
     */
    private static async loadLocalFileBasedTemplates(): Promise<(IdentityProviderTemplateInterface
        | Promise<IdentityProviderTemplateInterface>)[]> {

        const templates: (IdentityProviderTemplateInterface
            | Promise<IdentityProviderTemplateInterface>)[] = [];

        getIdentityProviderTemplatesConfig().templates
            .map(async (config: TemplateConfigInterface<IdentityProviderTemplateInterface>) => {
                if (!config.enabled) {
                    return;
                }

                templates.push(
                    config.resource as (IdentityProviderTemplateInterface
                        | Promise<IdentityProviderTemplateInterface>)
                );
            });

        return Promise.all([ ...templates ]);
    }

    /**
     * Loads local file based IDP template categories.
     *
     * @returns Local file based IDP template categories.
     */
    private static async loadLocalFileBasedTemplateCategories(): Promise<(IdentityProviderTemplateCategoryInterface
        | Promise<IdentityProviderTemplateCategoryInterface>)[]> {

        const categories: (IdentityProviderTemplateCategoryInterface
            | Promise<IdentityProviderTemplateCategoryInterface>)[] = [];

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
     * @param templates - Input templates.
     * @returns Help panel content.
     */
    private static resolveHelpContent(templates: any):
        IdentityProviderTemplateInterface[] {

        templates.map((template: IdentityProviderTemplateInterface) => {
            const config: TemplateConfigInterface<any> = getIdentityProviderTemplatesConfig().templates
                .find((config: TemplateConfigInterface<IdentityProviderTemplateInterface>) => {
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
