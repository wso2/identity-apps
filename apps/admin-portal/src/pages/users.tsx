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

import { PrimaryButton } from "@wso2is/react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { deleteUser, getUsersList } from "../api";
import { AddUser, UserSearch, UsersList } from "../components/users";
import { AddUserWizard } from "../components/users/wizard/add-user-wizard";
import { ListLayout, PageLayout } from "../layouts";
import { AlertInterface, AlertLevels } from "../models";
import { UserListInterface } from "../models/user";
import { addAlert } from "../store/actions";

const DEFAULT_USER_LIST_ITEM_LIMIT: number = 10;

/**
 * Users info page.
 *
 * @return {JSX.Element}
 */
export const UsersPage: React.FunctionComponent<any> = (): JSX.Element => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ searchQuery, setSearchQuery ] = useState("");
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ usersList, setUsersList ] = useState<UserListInterface>({});

    const getList = (limit: number, offset: number) => {
        getUsersList(limit, offset)
            .then((response) => {
                setUsersList(response);
            });
    };

    useEffect(() => {
        setListItemLimit(DEFAULT_USER_LIST_ITEM_LIMIT);
    }, []);

    useEffect(() => {
        getList(listItemLimit, listOffset);
    }, [ listOffset, listItemLimit ]);

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Handles the `onFilter` callback action from the
     * users search component.
     *
     * @param {string} query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        setSearchQuery(query);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const handleUserDelete = (userId: string): void => {
        deleteUser(userId)
            .then(() => {
                handleAlerts({
                    description: t(
                        "views:components.users.notifications.deleteUser.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "views:components.users.notifications.deleteUser.success.message"
                    )
                });
            });
    };

    const options = [
        { key: "import", icon: "download", text: "Import users", value: "import" },
        { key: "export", icon: "upload", text: "Export users", value: "export" },
    ];

    return (
        <PageLayout
            title="Users page"
            description="Create and manage users, user access and user profiles."
            showBottomDivider={ true }
        >
            <ListLayout
                // TODO add sorting functionality.
                advancedSearch={ <UserSearch onFilter={ handleUserFilter }/> }
                currentListSize={ usersList.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                rightActionPanel={
                    (
                        <PrimaryButton onClick={ () => setShowWizard(true) }>
                            <Icon name="add"/>
                            Add User
                        </PrimaryButton>
                    )
                }
                showPagination={ true }
                totalPages={ Math.ceil(usersList.totalResults / listItemLimit) }
                totalListSize={ usersList.totalResults }
            >
                <UsersList usersList={ usersList } handleUserDelete={ handleUserDelete }/>
                {
                    showWizard && (
                    <AddUserWizard
                        closeWizard={ () => setShowWizard(false) }
                        listOffset={ listOffset }
                        listItemLimit={ listItemLimit }
                        getUserList={ getList }
                    />
                ) }
            </ListLayout>
        </PageLayout>
    );
};
