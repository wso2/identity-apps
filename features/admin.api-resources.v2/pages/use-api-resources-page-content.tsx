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
import React, { useEffect } from "react";
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
            isApiServer: true,
            isMcpServer: false,
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
            defaultSearchFilter: `type eq ${ APIResourcesConstants.BUSINESS }`,
            resourceSearchBarPlaceholder: "Search API resources by name",
            resourceEditBackButtonText: "Back to API Resources",
            resourceEditBackButtonLink: AppConstants.getPaths().get("API_RESOURCES"),
            resourceEditPath: AppConstants.getPaths().get("API_RESOURCE_EDIT"),
            createResourceWizard: {
                title: t("extensions:develop.apiResource.wizard.addApiResource.title"),
                description: t("extensions:develop.apiResource.wizard.addApiResource.subtitle"),
                identifierPlaceholder: t("extensions:develop.apiResource.wizard.addApiResource.steps.basic." +
                    "form.fields.identifier.placeholder"),
                displayNamePlaceholder: t("extensions:develop.apiResource.wizard.addApiResource.steps.basic.form." +
                    "fields.name.placeholder"),
                hiddenSteps: []
            },
        },
        [ResourceServerType.MCP]: {
            addNewResourceButtonText: "New MCP Server",
            isApiServer: false,
            isMcpServer: true,
            resourceServerListDescription:
                "Create and manage the APIs that define resource models and access scopes, enabling " +
                "fine-grained permission control for applications interacting with MCP servers.",
            resourceServerListPageTitle: "MCP Servers",
            resourceServerListTitle: "MCP Servers",
            defaultSearchFilter: "identifier sw mcp",
            resourceSearchBarPlaceholder: "Search MCP servers by name",
            resourceEditBackButtonText: "Back to MCP Servers",
            resourceEditBackButtonLink: AppConstants.getPaths().get("MCP_SERVERS"),
            resourceEditPath: AppConstants.getPaths().get("MCP_SERVER_EDIT"),
            createResourceWizard: {
                title: "Create an MCP server",
                description: "Create a new MCP server.",
                identifierPlaceholder: "mcp://my-mcp-server",
                displayNamePlaceholder: "My MCP Server",
                hiddenSteps: [
                    AddAPIResourceWizardStepsFormTypes.PERMISSIONS,
                    AddAPIResourceWizardStepsFormTypes.AUTHORIZATION
                ]
            }
        }
    };

    return content[resourceServerType];
};

export default useApiResourcesPageContent;
