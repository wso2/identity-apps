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
import { AppState } from "@wso2is/admin.core.v1/store";
import { DocumentationLink, useDocumentation } from "@wso2is/react-components";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { APIResourcesConstants } from "../constants/api-resources-constants";
import { AddAPIResourceWizardStepsFormTypes, ResourceServerType } from "../models";

type CreateResourceWizard = {
    description: string;
    displayNameHint: string;
    displayNamePlaceholder: string;
    hiddenSteps: string[];
    identifierPlaceholder: string;
    title: string;
};

type DeleteResourceWizardContent = {
    buttonText: string;
    heading: string;
    subHeading: string;
};

type ScopesTabContent = {
    subHeading: string;
};

type ResourceServerConfig = {
    addNewResourceButtonText: string;
    createResourceWizard: CreateResourceWizard;
    defaultSearchFilter: string;
    deleteResourceWizardContent: DeleteResourceWizardContent;
    resourceEditBackButtonLink: string;
    resourceEditBackButtonText: string;
    resourceEditPageTitle: string;
    resourceEditPath: string;
    resourceSearchBarPlaceholder: string;
    resourceServerEmptyListSubtitle: string[];
    resourceServerListDescription: ReactNode;
    resourceServerListPageTitle: string;
    resourceServerListTitle: string;
    scopesTabContent: ScopesTabContent;
};

type ResourceServerConfigMap = {
    [key in ResourceServerType]: ResourceServerConfig;
};

const useApiResourcesPageContent = () => {

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const productName: string = useSelector((state: AppState) => state.config.ui.productName);

    const resourceServerType: ResourceServerType = window.location.pathname.includes("mcp-servers")
        ? ResourceServerType.MCP
        : ResourceServerType.API;

    function getResourceServerTypeDisplayName(resourceServerType: ResourceServerType) {
        switch(resourceServerType) {
            case ResourceServerType.API:
                return t("extensions:develop.apiResource.resourceTypes.api");
            case ResourceServerType.MCP:
                return t("extensions:develop.apiResource.resourceTypes.mcp");
        }
    }

    const content: Partial<ResourceServerConfigMap> = {
        [ResourceServerType.API]: {
            addNewResourceButtonText: t("extensions:develop.apiResource.addApiResourceButton"),
            createResourceWizard: {
                description: t("extensions:develop.apiResource.wizard.addApiResource.subtitle"),
                displayNameHint: t("extensions:develop.apiResource.wizard.addApiResource.steps.basic.form.fields." +
                                "name.hint", { productName }),
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
            resourceEditBackButtonLink: AppConstants.getPaths().get("API_RESOURCES"),
            resourceEditBackButtonText: "Back to API Resources",
            resourceEditPageTitle: t("extensions:develop.apiResource.tabs.title"),
            resourceEditPath: AppConstants.getPaths().get("API_RESOURCE_EDIT"),
            resourceSearchBarPlaceholder: "Search API resources by name",
            resourceServerEmptyListSubtitle: [ t("extensions:develop.apiResource.empty") ],
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
            addNewResourceButtonText: t("apiResources:mcpServers.newMcpServer"),
            createResourceWizard: {
                description: t("apiResources:mcpServers.wizards.addMcpServer.description"),
                displayNameHint: t("apiResources:mcpServers.wizards.addMcpServer.steps.general.fields" +
                    ".displayName.hint"),
                displayNamePlaceholder: t("apiResources:mcpServers.wizards.addMcpServer.steps.general.fields" +
                    ".displayName.placeholder"),
                hiddenSteps: [
                    AddAPIResourceWizardStepsFormTypes.AUTHORIZATION
                ],
                identifierPlaceholder: t(
                    "apiResources:mcpServers.wizards.addMcpServer.steps.general.fields" +
                    ".identifier.placeholder"),
                title: t("apiResources:mcpServers.wizards.addMcpServer.title")
            },
            defaultSearchFilter: `type eq ${ APIResourcesConstants.MCP }`,
            deleteResourceWizardContent: {
                buttonText: t("apiResources:mcpServers.deleteMcpServer.actionText"),
                heading: t("apiResources:mcpServers.deleteMcpServer.heading"),
                subHeading: t("apiResources:mcpServers.deleteMcpServer.subheading")
            },
            resourceEditBackButtonLink: AppConstants.getPaths().get("MCP_SERVERS"),
            resourceEditBackButtonText: t("apiResources:mcpServers.backButtonText"),
            resourceEditPageTitle: t("apiResources:mcpServers.editPageTitle"),
            resourceEditPath: AppConstants.getPaths().get("MCP_SERVER_EDIT"),
            resourceSearchBarPlaceholder: t("apiResources:mcpServers.searchBarPlaceholder"),
            resourceServerEmptyListSubtitle: [ t("apiResources:mcpServers.emptyListPlaceholderText") ],
            resourceServerListDescription: t("apiResources:mcpServers.description"),
            resourceServerListPageTitle: t("apiResources:mcpServers.title"),
            resourceServerListTitle: t("apiResources:mcpServers.title"),
            scopesTabContent: {
                subHeading: t("apiResources:mcpServers.scopes.subHeading")
            }
        }
    };

    return {
        resourceServerType,
        resourceServerTypeDisplayName: getResourceServerTypeDisplayName(resourceServerType),
        ...content[resourceServerType]
    };
};

export default useApiResourcesPageContent;
