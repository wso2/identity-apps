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

import React, { useEffect, useState, ReactElement } from "react";
import { PageLayout, ListLayout } from "../layouts";
import { getGroupsList, deleteSelectedRole } from "../api";
import { RoleList } from "../components/users";
import { RoleListInterface, AlertInterface, AlertLevels } from "../models"
import { PrimaryButton } from "@wso2is/react-components";
import { Icon, PaginationProps, DropdownProps } from "semantic-ui-react";
import { DEFAULT_ROLE_LIST_ITEM_LIMIT } from "../constants";
import { useDispatch } from "react-redux";
import { addAlert } from "../store/actions";
import { useTranslation } from "react-i18next";

/**
 * React component to list User Roles.
 * 
 * @return {ReactElement}
 */
export const UserRoles = (): ReactElement => {
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

    useEffect(() => {
        getRoleList();
    },[ listOffset, listItemLimit ]);

    useEffect(() => {
        getRoleList();
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
    const handleOnDelete = (id: string) => {
        deleteSelectedRole(id).then((response) => {
            handleAlerts({
                description: t(
                    "views:components.roles.notifications.deleteRole.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "views:components.roles.notifications.deleteRole.success.message"
                )
            });
            setListUpdated(true);
        });
    };

    return (
        <PageLayout
            title="Users Roles page"
            description="Create and manage roles, assign permissions for roles."
            showBottomDivider={ true } 
        >
            <ListLayout
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
                <RoleList roleList={ roleList?.Resources } handleRoleDelete={ handleOnDelete } />
            </ListLayout>
        </PageLayout>
    );
}
