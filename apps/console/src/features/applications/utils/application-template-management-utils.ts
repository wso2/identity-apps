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
 *
 */

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { store } from "../../core";
import {
    getApplicationTemplateList
} from "../api";
import { TemplateConfigInterface, getApplicationTemplatesConfig } from "../data/application-templates";
import CustomApplicationTemplate
    from "../data/application-templates/templates/custom-application/custom-application.json";
import {
    ApplicationTemplateGroupInterface,
    ApplicationTemplateInterface,
    ApplicationTemplateListInterface
} from "../models";
import { setApplicationTemplates } from "../store";

/**
 * Utility class for Application Templates related operations.
 */
export class ApplicationTemplateManagementUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    private constructor() { }

    /**
     * Retrieve Application template list form the API and sets it in redux state.
     *
     * @param {boolean} skipGrouping - Skip grouping of templates.
     * @param {boolean} useAPI - Flag to determine whether the usage of REST API is necessary.
     * @return {Promise<void>}
     */
    public static getApplicationTemplates = (skipGrouping: boolean = false,
                                             useAPI: boolean = false): Promise<void> => {

        if (!useAPI) {
            return ApplicationTemplateManagementUtils.loadLocalFileBasedTemplates()
                .then((response: ApplicationTemplateInterface[]) => {

                    const templates:  ApplicationTemplateInterface[] = ApplicationTemplateManagementUtils
                        .resolveHelpContent(response);

                    // Group the templates if `skipGrouping` flag is false.
                    if (!skipGrouping) {
                        // Set the templates without grouping. Used to quickly search through to get the template name.
                        store.dispatch(setApplicationTemplates(templates));
                        // Set the templates with grouping.
                        store.dispatch(
                            setApplicationTemplates(ApplicationTemplateManagementUtils.groupTemplates(templates),
                                true)
                        );

                        return Promise.resolve();
                    }

                    store.dispatch(setApplicationTemplates(templates));

                    return Promise.resolve();
                });
        }

        return getApplicationTemplateList()
            .then((response: ApplicationTemplateListInterface) => {

                const templates: ApplicationTemplateInterface[] = ApplicationTemplateManagementUtils
                    .addCustomTemplates(response.templates, [ CustomApplicationTemplate ], true);

                // Group the templates if `skipGrouping` flag is false.
                if (!skipGrouping) {
                    // Set the templates without grouping. Used to quickly search through to get the template name.
                    store.dispatch(setApplicationTemplates(templates));
                    // Set the templates with grouping.
                    store.dispatch(setApplicationTemplates(ApplicationTemplateManagementUtils.groupTemplates(templates),
                        true));

                    return;
                }

                store.dispatch(setApplicationTemplates(templates));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    store.dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("devPortal:components.applications.notifications.fetchTemplates" +
                            ".error.message")
                    }));

                    return;
                }

                store.dispatch(addAlert({
                    description: I18n.instance.t("devPortal:components.applications.notifications.fetchTemplates" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("devPortal:components.applications.notifications.fetchTemplates" +
                        ".genericError.message")
                }));
            });
    };

    /**
     * Sort the application templates based on display order.
     *
     * @param {ApplicationTemplateInterface[]} templates - App templates.
     * @return {ApplicationTemplateInterface[]}
     */
    private static sortApplicationTemplates(
        templates: ApplicationTemplateInterface[]): ApplicationTemplateInterface[] {

        const applicationTemplates = [ ...templates ];

        // Sort templates based  on displayOrder.
        applicationTemplates.sort(
            (a, b) =>
                (a.displayOrder > b.displayOrder) ? 1 : -1);

        return applicationTemplates;
    }

    /**
     * Append any custom templates to the existing templates list.
     *
     * @param {ApplicationTemplateInterface[]} existingTemplates - Existing templates list.
     * @param {ApplicationTemplateInterface[]} customTemplates - Set of custom templates to add.
     * @param {boolean} sort - Should the returning templates be sorted.
     * @return {ApplicationTemplateInterface[]}
     */
    private static addCustomTemplates(existingTemplates: ApplicationTemplateInterface[],
                                      customTemplates: ApplicationTemplateInterface[],
                                      sort: boolean = true) {

        if (sort) {
            return this.sortApplicationTemplates(existingTemplates.concat(customTemplates));
        }

        return existingTemplates.concat(customTemplates);
    }

    /**
     * Group the application templates.
     *
     * @param {ApplicationTemplateInterface[]} templates - Application templates.
     * @return {ApplicationTemplateInterface[]}
     */
    private static groupTemplates = (
        templates: ApplicationTemplateInterface[]): ApplicationTemplateInterface[] => {

        const groupedTemplates: ApplicationTemplateInterface[] = [];

        templates.forEach((template: ApplicationTemplateInterface) => {
            if (!template.templateGroup) {
                groupedTemplates.push(template);
                return;
            }

            ApplicationTemplateManagementUtils.loadLocalFileBasedTemplateGroups()
                .then((response: ApplicationTemplateGroupInterface[]) => {
                    const group: ApplicationTemplateGroupInterface = response
                        .find((group: ApplicationTemplateGroupInterface) => {
                            return group.id === template.templateGroup;
                    });

                    if (!group) {
                        groupedTemplates.push(template);
                        return;
                    }

                    if (groupedTemplates.some((groupedTemplate) =>
                        groupedTemplate.id === template.templateGroup)) {

                        groupedTemplates.forEach((editingTemplate, index) => {
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
        });

        return groupedTemplates;
    };

    /**
     * Loads local file based application templates.
     *
     * @return {Promise<(ApplicationTemplateInterface | Promise<ApplicationTemplateInterface>)[]>}
     */
    private static async loadLocalFileBasedTemplates(): Promise<(ApplicationTemplateInterface
        | Promise<ApplicationTemplateInterface>)[]> {

        const templates: (ApplicationTemplateInterface | Promise<ApplicationTemplateInterface>)[] = [];

        getApplicationTemplatesConfig().templates
            .map(async (config: TemplateConfigInterface<ApplicationTemplateInterface>) => {
                if (!config.enabled) {
                    return;
                }

                templates.push(
                    config.resource as (ApplicationTemplateInterface | Promise<ApplicationTemplateInterface>)
                );
            });

        return Promise.all([ ...templates ]);
    }

    /**
     * Loads local file based application template groups.
     *
     * @return {Promise<(ApplicationTemplateGroupInterface | Promise<ApplicationTemplateGroupInterface>)[]>}
     */
    private static async loadLocalFileBasedTemplateGroups(): Promise<(ApplicationTemplateGroupInterface
            | Promise<ApplicationTemplateGroupInterface>)[]> {

        const groups: (ApplicationTemplateGroupInterface | Promise<ApplicationTemplateGroupInterface>)[] = [];

        getApplicationTemplatesConfig().groups
            .forEach(async (config: TemplateConfigInterface<ApplicationTemplateGroupInterface>) => {
                if (!config.enabled) {
                    return;
                }

                groups.push(
                    config.resource as (ApplicationTemplateGroupInterface | Promise<ApplicationTemplateGroupInterface>)
                );
            });

        return Promise.all([ ...groups ]);
    }

    /**
     * Resolves the help content for the respective template.
     *
     * @param {ApplicationTemplateInterface[]} templates - Input templates.
     * @return {ApplicationTemplateInterface[]}
     */
    private static resolveHelpContent(templates: ApplicationTemplateInterface[]): ApplicationTemplateInterface[] {

        templates.map((template: ApplicationTemplateInterface) => {
            const config = getApplicationTemplatesConfig().templates
                .find((config: TemplateConfigInterface<ApplicationTemplateInterface>) => {
                    return config.id === template.id;
                });

            if (!config.wizardHelp) {
                return;
            }

            template.wizardHelp = config.wizardHelp;
        });

        return templates;
    }
}
