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
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AGENT_USERSTORE_ID } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem } from "@wso2is/admin.userstores.v1/models/user-stores";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, EmphasizedSegment, EmptyPlaceholder,
    ListLayout, PageLayout, PrimaryButton, useDocumentation } from "@wso2is/react-components";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Icon } from "semantic-ui-react";
import AgentList from "../components/agent-list";
import { AgentSecretShowModal } from "../components/edit/agent-secret-show-modal";
import AddAgentWizard from "../components/wizards/add-agent-wizard";
import { useGetAgents } from "../hooks/use-get-agents";
import "./agents.scss";

type AgentPageProps = IdentifiableComponentInterface;

export default function Agents ({
    "data-componentid": componentId
}: AgentPageProps) {
    const [ newAgent, setNewAgent ] = useState<any>(null);

    const dispatch: Dispatch = useDispatch();

    const isSAASDeployment: boolean = useSelector((state: AppState) => state?.config?.ui?.isSAASDeployment);

    const [ isAddAgentWizardOpen,setIsAddAgentWizardOpen ] = useState(false);
    const [ isAgentCredentialWizardOpen, setIsAgentCredentialWizardOpen ] = useState(false);

    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ startIndex, setStartIndex ] = useState<number>(1);
    const [ listItemLimit, setListItemLimit ] = useState<number>(
        UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT
    );

    const { getLink } = useDocumentation();

    const {
        isLoading: isUserStoresListFetchRequestLoading,
        userStoresList
    } = useUserStores();

    const isAgentManagementEnabledForOrg: boolean = useMemo((): boolean => {
        return userStoresList?.some((userStore: UserStoreListItem) => userStore.id === AGENT_USERSTORE_ID);
    }, [ userStoresList ]);

    const { t } = useTranslation();

    const {
        data: agentList,
        isLoading: isAgentListLoading,
        mutate: mutateAgentList
    } = useGetAgents(
        listItemLimit,
        startIndex,
        searchQuery,
        null,
        isAgentManagementEnabledForOrg
    );

    const handleUserFilter = (query: string): void => {
        setSearchQuery(query);
        setStartIndex(1);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    return (
        <PageLayout
            pageTitle={ t("agents:title") }
            title={ t("agents:pageTitle") }
            description={
                (<>
                    { t("agents:description") }
                    <DocumentationLink
                        link={
                            getLink("develop.agents.learnMore")
                        }
                        showEmptyLink={ false }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>)
            }
            data-componentid={ `${componentId}-page-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
            action={ agentList?.Resources?.length > 0 && !isAgentListLoading && (<PrimaryButton
                onClick={ () => {
                    setIsAddAgentWizardOpen(true);
                } }>
                <Icon name="add" />
                { t("agents:new.action.title") }
            </PrimaryButton>) }
        >
            { !isUserStoresListFetchRequestLoading && !isAgentManagementEnabledForOrg ? (
                <EmphasizedSegment className="agent-feature-unavailable-notice">
                    <EmptyPlaceholder
                        action={ null }
                        image={ null }
                        imageSize="tiny"
                        subtitle={ [
                            t("agents:list.featureUnavailable.subtitle.0"),
                            isSAASDeployment
                                ? t("agents:list.featureUnavailable.subtitle.1.saas")
                                : t("agents:list.featureUnavailable.subtitle.1.onprem")
                        ] }
                        title={ t("agents:list.featureUnavailable.title") }
                    />
                </EmphasizedSegment>
            ) :             (<ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleUserFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "name"
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
                            "urn:scim:wso2:agent:schema.DisplayName co %search-value%"
                        }
                        triggerClearQuery={ false }
                        data-testid={ `${ componentId }-list-advanced-search` }
                    />
                ) }
                currentListSize={ agentList?.totalResults }
                isLoading={ isAgentListLoading }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ () => {} }
                onSortStrategyChange={ () => {} }
                showPagination={ true }
                showTopActionPanel={ true }
                sortOptions={ null }
                sortStrategy={ null }
                totalPages={ Math.ceil(agentList?.totalResults / listItemLimit ) }
                totalListSize={ agentList?.totalResults }
                paginationOptions={ {
                    disableNextButton: true
                } }
                data-testid={ `${ componentId }-list-layout` }
            >
                <AgentList
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
                    mutateAgentList={ mutateAgentList }
                    isLoading={ isAgentListLoading }
                    list={ agentList?.Resources }
                    setShowAgentAddWizard={ () => {
                        setIsAddAgentWizardOpen(true);
                    } }
                />
            </ListLayout>) }

            <AddAgentWizard
                isOpen={ isAddAgentWizardOpen }
                onClose={ (newCreatedAgent: any) => {
                    if (newCreatedAgent) {
                        setNewAgent(newCreatedAgent);
                        setIsAgentCredentialWizardOpen(true);
                    }

                    setIsAddAgentWizardOpen(false);
                } }
            />

            <AgentSecretShowModal
                title={ t("agents:new.title") }
                agentId={ newAgent?.id }
                agentSecret={ newAgent?.password }
                isOpen={ isAgentCredentialWizardOpen }
                onClose={ () => {
                    dispatch(
                        addAlert({
                            description: t("agents:new.alerts.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("agents:new.alerts.success.message")
                        })
                    );
                    if (newAgent?.id) {
                        history.push(
                            AppConstants.getPaths().get("AGENT_EDIT").replace(":id", newAgent?.id )
                        );
                    }
                } }

            />

        </PageLayout>
    );
}
