/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { history } from "@wso2is/admin.core.v1";
import { AppConstants, UIConstants } from "@wso2is/admin.core.v1/constants";
import { RoleBasicInterface } from "@wso2is/admin.extensions.v1/components/groups/models";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ChangeEvent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Header, Icon, Input, SemanticICONS } from "semantic-ui-react";

interface RolesListProps extends IdentifiableComponentInterface {
    rolesList: RoleBasicInterface[];
    appId: string;
}

const RolesList = (props: RolesListProps): ReactElement => {
    const {
        appId,
        rolesList,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ processedRolesList, setProcessedRolesList ] = useState<RoleBasicInterface[]>(rolesList);

    /**
     * Handles the change event of the search query input.
     * Return results that matches the search query.
     */
    const searchRoles = (query: string) => {
        setSearchQuery(query);

        if (query === "") {
            setProcessedRolesList(rolesList);

            return;
        }

        const filteredRolesList: RoleBasicInterface[] = rolesList.filter((role: RoleBasicInterface) => {
            return role.name.toLowerCase().includes(query.toLowerCase());
        });

        setProcessedRolesList(filteredRolesList);
    };

    /**
     * Redirects to the role edit page when the edit button is clicked.
     *
     * @param role - editing role.
     */
    const editRole = (role: RoleBasicInterface): void => {
        if (isSubOrg) {
            history.push({
                pathname: AppConstants.getPaths().get("APPLICATION_ROLES_EDIT_SUB")
                    .replace(":applicationId", appId)
                    .replace(":roleId", role.name)
            });
        } else {
            history.push({
                pathname: AppConstants.getPaths().get("APPLICATION_ROLES_EDIT")
                    .replace(":applicationId", appId)
                    .replace(":roleId", role.name)
            });
        }
    };

    const onSearchQueryClear = (): void => {
        setSearchQuery("");
        setProcessedRolesList(rolesList);
    };

    /**
     * Shows list placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && processedRolesList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ componentId }-search-empty-placeholder` }
                    action={ (
                        <LinkButton
                            data-testid={ `${ componentId }-search-empty-placeholder-clear-button` }
                            onClick={ onSearchQueryClear }
                        >
                            { t("roles:list.emptyPlaceholders.search.action") }
                        </LinkButton>
                    ) }
                    title={ t("roles:list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("roles:list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("roles:list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        return null;
    };


    /**
     * Resolves data table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (role: RoleBasicInterface): ReactNode => (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-testid={ `${ componentId }-item-heading` }
                    >
                        <Header.Content>
                            <div className="mt-1">{ role.name } </div>
                        </Header.Content>
                    </Header>
                ),
                title: null
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: null
            }
        ];
    };

    /**
     * Resolves data table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        const actions: TableActionsInterface[] = [
            {
                icon: (): SemanticICONS =>  "add",
                onClick: (e: SyntheticEvent, role: RoleBasicInterface): void =>
                    editRole(role),
                popupText: (): string => t("extensions:console.applicationRoles.assignGroupWizard.heading"),
                renderer: "semantic-icon"
            }
        ];

        return actions;
    };

    return (
        <>
            <Grid>
                <Grid.Row columns={ 1 } className="pb-0">
                    <Grid.Column width={ 10 }>
                        <Input
                            data-componentid={ `${ componentId }-application-list-search-input` }
                            icon={ <Icon name="search" /> }
                            iconPosition="left"
                            onChange={ (e: ChangeEvent<HTMLInputElement>) => searchRoles(e.target.value) }
                            value={ searchQuery }
                            placeholder={ "Search role" }
                            floated="left"
                            fluid
                            transparent
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 10 }>
                        <DataTable<RoleBasicInterface>
                            showHeader={ false }
                            loadingStateOptions={ {
                                count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                                imageType: "square"
                            } }
                            actions={ resolveTableActions() }
                            columns={ resolveTableColumns() }
                            data={ processedRolesList }
                            onRowClick={ (e: SyntheticEvent, role: RoleBasicInterface) => editRole(role) }
                            data-testid={ componentId }
                            placeholders={ showPlaceholders() }
                            transparent
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

export default RolesList;
