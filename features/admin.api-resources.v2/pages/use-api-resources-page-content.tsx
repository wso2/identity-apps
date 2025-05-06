/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { DocumentationLink, useDocumentation } from "@wso2is/react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { APIResourcesConstants } from "../constants/api-resources-constants";
import { AddAPIResourceWizardStepsFormTypes, ResourceServerType } from "../models";

const useApiResourcesPageContent = () => {

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const resourceServerType: ResourceServerType = window.location.pathname.includes("mcp-servers")
        ? ResourceServerType.MCP
        : ResourceServerType.API;

    const content: any = {
        [ResourceServerType.API]: {
            addNewResourceButtonText: t("extensions:develop.apiResource.addApiResourceButton"),
            createResourceWizard: {
                description: t("extensions:develop.apiResource.wizard.addApiResource.subtitle"),
                displayNamePlaceholder: t("extensions:develop.apiResource.wizard.addApiResource.steps.basic.form." +
                    "fields.name.placeholder"),
                hiddenSteps: [],
                identifierPlaceholder: t("extensions:develop.apiResource.wizard.addApiResource.steps.basic." +
                        "form.fields.identifier.placeholder"),
                title: t("extensions:develop.apiResource.wizard.addApiResource.title")
            },
            defaultSearchFilter: `type eq ${ APIResourcesConstants.BUSINESS }`,
            deleteResourceWizardContent: {
                buttonText: t("extensions:develop.apiResource.tabs.general.dangerZoneGroup" +
                    ".deleteApiResource.button"),
                heading: t("extensions:develop.apiResource.tabs.general.dangerZoneGroup" +
                    ".deleteApiResource.header"),
                subHeading: t("extensions:develop.apiResource.tabs.general.dangerZoneGroup" +
                    ".deleteApiResource.subHeading")
            },
            isApiServer: true,
            isMcpServer: false,
            resourceEditBackButtonLink: AppConstants.getPaths().get("API_RESOURCES"),
            resourceEditBackButtonText: "Back to API Resources",
            resourceEditPath: AppConstants.getPaths().get("API_RESOURCE_EDIT"),
            resourceSearchBarPlaceholder: "Search API resources by name",
            resourceServerListDescription: (
                <>
                    { t("extensions:develop.apiResource.pageHeader.description") }
                    <DocumentationLink
                        link={ getLink("develop.apiResources.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>
            ),
            resourceServerListPageTitle: t("extensions:develop.apiResource.pageHeader.title"),
            resourceServerListTitle: t("extensions:develop.apiResource.pageHeader.title"),





            scopesTabContent: {
                subHeading: t("apiResources:tabs.scopes.subTitle")
            }

        },
        [ResourceServerType.MCP]: {
            addNewResourceButtonText: "New MCP Server",
            createResourceWizard: {
                displayNamePlaceholder: "My MCP Server",
                hiddenSteps: [
                    AddAPIResourceWizardStepsFormTypes.PERMISSIONS,
                    AddAPIResourceWizardStepsFormTypes.AUTHORIZATION
                ],
                identifierPlaceholder: "mcp://my-mcp-server"
            },
            defaultSearchFilter: "identifier sw mcp",
            deleteResourceWizardContent: {
                buttonText: "Delete MCP Server",
                heading: "Delete MCP Server",
                subHeading: "This action will permanently delete the MCP server. Please be certain before you proceed"
            },
            isApiServer: false,
            isMcpServer: true,
            resourceEditBackButtonLink: AppConstants.getPaths().get("MCP_SERVERS"),
            resourceEditBackButtonText: "Back to MCP Servers",
            resourceEditPath: AppConstants.getPaths().get("MCP_SERVER_EDIT"),
            resourceSearchBarPlaceholder: "Search MCP servers by name",
            resourceServerListDescription:
                "Create and manage the APIs that define resource models and access scopes, enabling " +
                "fine-grained permission control for applications interacting with MCP servers.",
            resourceServerListPageTitle: "MCP Servers",
            resourceServerListTitle: "MCP Servers",




            scopesTabContent: {
                subHeading: "Scopes the MCP server uses to verify the user's permissions."
            }

        }
    };

    return content[resourceServerType];
};

export default useApiResourcesPageContent;
