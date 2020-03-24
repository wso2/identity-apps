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
 */

import { AlertInterface, AlertLevels, RoleListInterface, SearchRoleInterface } from "../models"
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { ListLayout, PageLayout } from "../layouts";
import React, { ReactElement, useEffect, useState } from "react";
import { deleteSelectedRole, getGroupsList, searchRoleList } from "../api";

import { CreateRoleWizard } from "../components/roles/create-role-wizard";
import { DEFAULT_ROLE_LIST_ITEM_LIMIT } from "../constants";
import { PrimaryButton } from "@wso2is/react-components";
import { RoleList, RoleSearch } from "../components/roles";
import { addAlert } from "../store/actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

/**
 * React component to list User Roles.
 * 
 * @return {ReactElement}
 */
export const RolesPage = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [ roleList, setRoleList ] = useState<RoleListInterface>();
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isListUpdated, setListUpdated ] = useState(false);

    useEffect(() => {
        setListItemLimit(DEFAULT_ROLE_LIST_ITEM_LIMIT);
    }, []);

    const getRoleList = () => {
        getGroupsList(null).then((response)=> {
            if (response.status === 200) {
                setRoleList(response.data);
            }
        });
    };

    const searchRoleListHandler = (searchQuery: string) => {
        const searchData: SearchRoleInterface = {
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
            ],
            startIndex: 1,
            filter: searchQuery,
        }

        searchRoleList(searchData).then(response => {
            if (response.status === 200) {
                setRoleList(response.data);
            }
        })
    }

    useEffect(() => {
        getRoleList();
    },[ listOffset, listItemLimit ]);

    useEffect(() => {
        getRoleList();
        setListUpdated(false);
    }, [ isListUpdated ]);

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle role deletion action.
     * 
     * @param id - Role ID which needs to be deleted
     */
    const handleOnDelete = (id: string): void => {
        deleteSelectedRole(id).then(() => {
            handleAlerts({
                description: t(
                    "devPortal:components.roles.notifications.deleteRole.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "devPortal:components.roles.notifications.deleteRole.success.message"
                )
            });
            setListUpdated(true);
        });
    };

    /**
     * Handles the `onFilter` callback action from the
     * roles search component.
     *
     * @param {string} query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        if (query === null || query === "displayName sw ") {
            getRoleList();
            return;
        }

        searchRoleListHandler(query);
    };

    return (
        <PageLayout
            title="Roles"
            description="Create and manage roles, assign permissions for roles."
            showBottomDivider={ true } 
        >
            <ListLayout
                advancedSearch={ <RoleSearch onFilter={ handleUserFilter }/> }
                currentListSize={ roleList?.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                rightActionPanel={
                    (
                        <PrimaryButton onClick={ () => setShowWizard(true) }>
                            <Icon name="add"/>
                            Add Role
                        </PrimaryButton>
                    )
                }
                showPagination={ roleList?.totalResults >= DEFAULT_ROLE_LIST_ITEM_LIMIT }
                totalPages={ Math.ceil(roleList?.totalResults / listItemLimit) }
                totalListSize={ roleList?.totalResults }
            >
                <RoleList 
                    roleList={ roleList?.Resources }
                    handleRoleDelete={ handleOnDelete }
                />
                {
                    showWizard && (
                        <CreateRoleWizard
                            closeWizard={ () => setShowWizard(false) }
                            updateList={ () => setListUpdated(true) }
                        />
                    ) 
                }
            </ListLayout>
        </PageLayout>
    );
}
