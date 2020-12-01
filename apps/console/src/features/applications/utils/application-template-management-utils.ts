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
import { CustomApplicationTemplate } from "../components";
import { getDefaultTemplateGroups } from "../meta";
import {
    ApplicationTemplateListInterface,
    ApplicationTemplateListItemInterface
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
     * @return {Promise<void>}
     */
    public static getApplicationTemplates = (skipGrouping: boolean = false): Promise<void> => {

        return getApplicationTemplateList()
            .then((response: ApplicationTemplateListInterface) => {

                const templates: ApplicationTemplateListItemInterface[] = ApplicationTemplateManagementUtils
                    .addCustomTemplates(response.templates, [ CustomApplicationTemplate ], true);

                // Group the templates if `skipGrouping` flag is false.
                if (!skipGrouping) {
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
     * @param {ApplicationTemplateListItemInterface[]} templates - App templates.
     * @return {ApplicationTemplateListItemInterface[]}
     */
    private static sortApplicationTemplates(
        templates: ApplicationTemplateListItemInterface[]): ApplicationTemplateListItemInterface[] {

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
     * @param {ApplicationTemplateListItemInterface[]} existingTemplates - Existing templates list.
     * @param {ApplicationTemplateListItemInterface[]} customTemplates - Set of custom templates to add.
     * @param {boolean} sort - Should the returning templates be sorted.
     * @return {ApplicationTemplateListItemInterface[]}
     */
    private static addCustomTemplates(existingTemplates: ApplicationTemplateListItemInterface[],
                                      customTemplates: ApplicationTemplateListItemInterface[],
                                      sort: boolean = true) {

        if (sort) {
            return this.sortApplicationTemplates(existingTemplates.concat(customTemplates));
        }

        return existingTemplates.concat(customTemplates);
    }

    /**
     * Group the application templates.
     *
     * @param {ApplicationTemplateListItemInterface[]} templates - Application templates.
     * @return {ApplicationTemplateListItemInterface[]}
     */
    private static groupTemplates = (
        templates: ApplicationTemplateListItemInterface[]): ApplicationTemplateListItemInterface[] => {

        const groupedTemplates: ApplicationTemplateListItemInterface[] = [];

        templates.forEach((template: ApplicationTemplateListItemInterface) => {
            if (!template.templateGroup) {
                groupedTemplates.push(template);
                return;
            }

            const group = getDefaultTemplateGroups()
                .find((group) => group.id === template.templateGroup);

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

        return groupedTemplates;
    };
}
