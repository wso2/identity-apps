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
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar, AppAvatar, DataTable, TableActionsInterface, TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactNode, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { Header, SemanticICONS } from "semantic-ui-react";

interface AgentListProps extends IdentifiableComponentInterface {
    advancedSearch: ReactNode;
    isLoading: boolean;
    list: any[];
    onDelete: any;
}

interface AgentListItemInterface {
    id: string;
    name: string;
}

export default function AgentList ({
    advancedSearch,
    isLoading,
    list,
    onDelete,
    [ "data-componentid" ]: componentId
}: AgentListProps) {
    const { t } = useTranslation();

    const resolveTableActions = (): TableActionsInterface[] => {
        return [
            {
                "data-testid": `${ componentId }-item-edit-button`,
                hidden: (): boolean => false,
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (_e: SyntheticEvent, agent: AgentListItemInterface): void =>
                    history.push(AppConstants.getPaths().get("AGENT_EDIT").replace(":id", agent.id )),
                popupText: (_agent: AgentListItemInterface): string => {
                    return t("common:edit");
                },
                renderer: "semantic-icon"
            },
            {
                "data-testid": `${ componentId }-item-delete-button`,
                hidden: (_agent: AgentListItemInterface) => {

                    return false;
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (_e: SyntheticEvent, _agent: AgentListItemInterface): void => {
                    console.log("dd")
                    const agents: any = JSON.parse(localStorage.getItem("agents"));

                    const updatedAgentList: any = agents.filter((agent: any) => agent.id !== _agent.id);

                    localStorage.setItem("agents", JSON.stringify(updatedAgentList));

                    onDelete();
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolves data table columns.
     *
     * @returns TableColumnInterface[]
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (agent: AgentListItemInterface): ReactNode => {
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${ componentId }-item-heading` }
                        >
                            <AppAvatar
                                image={ (
                                    <AnimatedAvatar
                                        name={ agent?.name }
                                        size="mini"
                                        data-testid={ `${componentId}-item-display-name-avatar` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-testid={ `${componentId}-item-display-name` }
                            />

                            <Header.Content>
                                { agent.name }


                            </Header.Content>
                        </Header>
                    );
                },
                title: t("applications:list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("applications:list.columns.actions")
            }
        ];
    };

    const showPlaceholders = () => {
        return <p>Add new agent</p>;
    };

    return (

        <DataTable<AgentListItemInterface>
            className="applications-table"
            externalSearch={ advancedSearch }
            isLoading={ isLoading }
            actions={ resolveTableActions() }
            columns={ resolveTableColumns() }
            data={ list }
            onRowClick={ (_e: SyntheticEvent, agent: AgentListItemInterface): void => {
                history.push(AppConstants.getPaths().get("AGENT_EDIT").replace(":id", agent.id ));
            } }
            placeholders={ showPlaceholders() }
            selectable={ true }
            showHeader={ false }
            transparent={
                !(isLoading)
                        && (showPlaceholders() !== null)
            }
            data-testid={ componentId }
        />


    );
}
