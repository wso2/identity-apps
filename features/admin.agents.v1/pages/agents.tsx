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

import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";
import AgentList from "../components/agent-list";
import AddAgentWizard from "../components/wizards/add-agent-wizard";
import useGetAgents from "../hooks/use-get-agents";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { useApplicationList } from "@wso2is/admin.applications.v1/api/application";

interface AgentPageProps extends IdentifiableComponentInterface {

}

export default function Agents ({
    "data-componentid": componentId
}: AgentPageProps) {
    const [ isAddAgentWizardOpen,setIsAddAgentWizardOpen ] = useState(false);
    const [ trigger, setTrigger ] = useState(false);

    const { t } = useTranslation();

    const listItemLimit: number = 10;

    const {
        data: agentList,
        isLoading: isAgentListLoading
    } = useGetAgents(trigger);

    const {
        data: applicationListData,
        isLoading: isApplicationListRequestLoading,
        error: applicationListFetchRequestError
    } = useApplicationList(
        null,
        null,
        null,
        null,
        true,
        true
    );

    useEffect(() => {
        if (!localStorage.getItem("agents")) {
            localStorage.setItem("agents", JSON.stringify([]));
        }

        if (applicationListData) {
            if(!localStorage.getItem("agent_application")) {
                const agentApp = applicationListData?.applications.find(application => application.name === "Agent Application")
    
                localStorage.setItem("agent_application", agentApp?.id);
            }
        }

    }, [applicationListData])

    return (
        <PageLayout
            pageTitle={ "Agents" }
            title={ "Agents" }
            description={ "Configure and manage AI agent identities for your organizaton" }
            data-componentid={ `${componentId}-page-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
            action={ (<PrimaryButton
                onClick={ () => {
                    setIsAddAgentWizardOpen(true);
                } }>
                <Icon name="add" />
                Create Agent
            </PrimaryButton>) }
        >
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ () => {} }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "name"
                            },
                            {
                                key: 1,
                                text: t("common:clientId"),
                                value: "clientId"
                            },
                            {
                                key: 2,
                                text: t("common:issuer"),
                                value: "issuer"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("applications:advancedSearch.form" +
                                    ".inputs.filterAttribute.placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("applications:advancedSearch.form" +
                                    ".inputs.filterCondition.placeholder")
                        }
                        filterValuePlaceholder={
                            t("applications:advancedSearch.form.inputs.filterValue" +
                                    ".placeholder")
                        }
                        placeholder={ "Search agents by name or ID" }
                        style={ { minWidth: "425px" } }
                        defaultSearchAttribute="name"
                        defaultSearchOperator="co"
                        predefinedDefaultSearchStrategy={
                            "name co %search-value% or clientId co %search-value% or issuer co %search-value%"
                        }
                        triggerClearQuery={ false }
                        data-testid={ `${ componentId }-list-advanced-search` }
                    />
                ) }
                currentListSize={ agentList?.count }
                isLoading={ isAgentListLoading }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ () => {} }
                onPageChange={ () => {} }
                onSortStrategyChange={ () => {} }
                showPagination={ true }
                showTopActionPanel={ true }
                sortOptions={ null }
                sortStrategy={ null }
                totalPages={ Math.ceil(agentList?.totalResults / listItemLimit) }
                totalListSize={ agentList?.totalResults }
                paginationOptions={ {
                    disableNextButton: true
                } }
                data-testid={ `${ componentId }-list-layout` }
            >
                <AgentList
                    onDelete={ () => setTrigger(!trigger) }
                    advancedSearch={ (
                        <AdvancedSearchWithBasicFilters
                            onFilter={ () => {} }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t("common:name"),
                                    value: "name"
                                },
                                {
                                    key: 1,
                                    text: t("common:clientId"),
                                    value: "clientId"
                                },
                                {
                                    key: 2,
                                    text: t("common:issuer"),
                                    value: "issuer"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("applications:advancedSearch." +
                                        "form.inputs.filterAttribute.placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("applications:advancedSearch." +
                                        "form.inputs.filterCondition.placeholder")
                            }
                            filterValuePlaceholder={
                                t("applications:advancedSearch." +
                                        "form.inputs.filterValue.placeholder")
                            }
                            placeholder={
                                t("applications:advancedSearch.placeholder")
                            }
                            style={ { minWidth: "425px" } }
                            defaultSearchAttribute="name"
                            defaultSearchOperator="co"
                            predefinedDefaultSearchStrategy={
                                "name co %search-value% or clientId co %search-value% or " +
                                    "issuer co %search-value%"
                            }
                            triggerClearQuery={ false }
                            data-testid={ `${ componentId }-list-advanced-search` }
                        />
                    ) }
                    isLoading={ isAgentListLoading }
                    list={ agentList?.Resources }
                />
            </ListLayout>

            <AddAgentWizard
                isOpen={ isAddAgentWizardOpen }
                onClose={ (id: string) => {
                    setTrigger(!trigger);
                    setIsAddAgentWizardOpen(false);
                    history.push(AppConstants.getPaths().get("AGENT_EDIT").replace(":id", id))
                } }
            />
        </PageLayout>
    );
}
