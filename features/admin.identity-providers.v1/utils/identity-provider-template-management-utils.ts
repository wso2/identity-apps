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
import { ConnectionTemplateCategoryInterface, ConnectionTemplateGroupInterface } from "@wso2is/admin.connections.v1";
import { store } from "@wso2is/admin.core.v1";
import { I18n } from "@wso2is/i18n";
import { AxiosError } from "axios";
import groupBy from "lodash-es/groupBy";
import { getIdentityProviderTemplateList } from "../api";
import { handleGetIDPTemplateListError } from "../components/utils/common-utils";
import { getIdPCapabilityIcons } from "../configs/ui";
import { TemplateConfigInterface, getIdentityProviderTemplatesConfig } from "../data/identity-provider-templates";
import ExpertModeIdPTemplate from "../data/identity-provider-templates/templates/expert-mode/expert-mode.json";
import {
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateListItemInterface,
    IdentityProviderTemplateListResponseInterface,
    SupportedServices,
    SupportedServicesInterface
} from "../models";
import { setIdentityProviderTemplates } from "../store";
import { ConnectionTemplateManagementUtils } from "@wso2is/admin.connections.v1/utils/connection-template-utils";

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
                        ConnectionTemplateManagementUtils.groupConnectionTemplates(templates)
                            .then((groups: IdentityProviderTemplateInterface[]) => {
                                if (sort) {
                                    templates = ConnectionTemplateManagementUtils
                                        .sortConnectionTemplates(templates);
                                    groups = ConnectionTemplateManagementUtils
                                        .sortConnectionTemplates(groups);
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
                            ConnectionTemplateManagementUtils
                                .sortConnectionTemplates(templatesWithServices);
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
     * Interpret available templates from the response templates.
     *
     * @param templates - List of response templates.
     * @returns List of templates.
     */
    private static interpretAvailableTemplates = (templates: any[]):
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
                    services: ConnectionTemplateManagementUtils.buildSupportedServices(eachTemplate?.services)
                };
            }
        });
    };

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
