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

import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar, AppAvatar, DataTable, EmptyPlaceholder, PrimaryButton, TableActionsInterface, TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { deleteAgent } from "../api/agents";

interface AgentListProps extends IdentifiableComponentInterface {
    advancedSearch: ReactNode;
    isLoading: boolean;
    mutateAgentList: any;
    list: any[];
    setShowAgentAddWizard: () => void;
}

interface AgentListItemInterface {
    id: string;
    name: string;
}

export default function AgentList ({
    advancedSearch,
    isLoading,
    list,
    mutateAgentList,
    setShowAgentAddWizard,
    [ "data-componentid" ]: componentId
}: AgentListProps) {
    const dispatch: any = useDispatch();

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
                onClick: (_e: SyntheticEvent, _agent: UserBasicInterface): void => {
                    deleteAgent(_agent.id).then(() => {
                        dispatch(addAlert({
                            description: "Agent deleted successfully.",
                            level: AlertLevels.SUCCESS,
                            message: "Deleted successfully"
                        }));
                        mutateAgentList();
                    }).catch((_error: any) => {
                        dispatch(addAlert({
                            description: "An error occurred when deleting agent information.",
                            level: AlertLevels.ERROR,
                            message: "Something went wrong"
                        }));
                    });
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
                render: (agent: UserBasicInterface): ReactNode => {
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
                                        name={ agent?.["urn:scim:wso2:agent:schema"]?.DisplayName ?? "Agent" }
                                        size="mini"
                                        data-testid={ `${componentId}-item-display-name-avatar` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-testid={ `${componentId}-item-display-name` }
                            />

                            <Header.Content>
                                { agent?.["urn:scim:wso2:agent:schema"]?.DisplayName }
                                <Header.Subheader>{ agent.id }</Header.Subheader>
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

    /**
     * Resolve the relevant placeholder.
     *
     * @returns React element.
     */
    const showPlaceholders = (): ReactElement => {
        if (!list || list?.length === 0) {
            return (
                <EmptyPlaceholder
                    className="list-placeholder mr-0"
                    action={
                        (<PrimaryButton
                            data-testid={ `${ componentId }-empty-placeholder-add-agent-button` }
                            onClick={ () => setShowAgentAddWizard() }
                        >
                            <Icon name="add" />
                             New Agent
                        </PrimaryButton>)
                    }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [
                        "There are no agents available at the moment"
                    ] }
                    data-testid={ `${ componentId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (

        <DataTable<AgentListItemInterface>
            className="agents-table"
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
