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

import { Button, EmptyPlaceholder, PrimaryButton } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
    Dropdown,
    DropdownProps,
    Grid,
    Icon,
    PaginationProps,
    Popup
} from "semantic-ui-react";
import { deleteUser, getUsersList, getUserStoreList } from "../api";
import { UserSearch, UsersList } from "../components/users";
import { AddUserWizard } from "../components/users/wizard/add-user-wizard";
import { ListLayout, PageLayout } from "../layouts";
import { AlertInterface, AlertLevels } from "../models";
import { UserListInterface } from "../models/user";
import { addAlert } from "../store/actions";
import { EmptyPlaceholderIllustrations } from "../configs";
import { DEFAULT_USER_LIST_ITEM_LIMIT } from "../constants";
import { UsersListOptionsComponent } from "../components/users/users-list-options";


/**
 * Users info page.
 *
 * @return {JSX.Element}
 */
export const UsersPage: React.FunctionComponent<any> = (): ReactElement => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ searchQuery, setSearchQuery ] = useState("");
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ usersList, setUsersList ] = useState<UserListInterface>({});
    const [ rolesList, setRolesList ] = useState([]);
    const [ isListUpdated, setListUpdated ] = useState(false);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState(undefined);

    const getList = (limit: number, offset: number, filter: string, attribute: string, domain: string) => {
        getUsersList(limit, offset, filter, attribute, domain)
            .then((response) => {
                setUsersList(response);
            });
    };

    useEffect(() => {
        setListItemLimit(DEFAULT_USER_LIST_ITEM_LIMIT);
        setUserListMetaContent(new Map<string, string>([
            ["name", "name"],
            ["emails", "emails"],
            ["name", "name"],
            ["userName", "userName"],
            ["id", ""],
            ["profileUrl", "profileUrl"],
            ["meta.lastModified", "meta.lastModified"],
            ["meta.created", ""]
        ]));
    }, []);

    /**
     * The following function fetch the user store list and set it to the state.
     */
    const getUserStores = () => {
        const storeOptions = [
                { text: "All user stores", key: -2, value: null },
                { text: "Primary", key: -1, value: "primary" }
            ];
        let storeOption = { text: "", key: null, value: "" };
        getUserStoreList()
            .then((response) => {
                if (storeOptions === []) {
                    storeOptions.push(storeOption);
                }
                response.data.map((store, index) => {
                        storeOption = {
                            key: index,
                            text: store.name,
                            value: store.name
                        };
                        storeOptions.push(storeOption);
                    }
                );
                setUserStoresList(storeOptions);
            });

        setUserStoresList(storeOptions);
    };

    /**
     * The following method accepts a Map and returns the values as a string.
     *
     * @param attributeMap - IterableIterator<string>
     * @return string
     */
    const generateAttributesString = (attributeMap: IterableIterator<string>) => {
        const attArray = [];
        const iterator1 = attributeMap[Symbol.iterator]();

        for (const attribute of iterator1) {
            if (attribute !== "") {
                attArray.push(attribute);
            }
        }

        return attArray.toString();
    };

    /**
     * Fetch the list of available user stores.
     */
    useEffect(() => {
        getUserStores();
    }, []);

    useEffect(() => {
        const attributes = userListMetaContent ? generateAttributesString(userListMetaContent.values()) : null;
        getList(listItemLimit, listOffset, null, attributes, userStore);
    }, [ userStore ]);

    useEffect(() => {
        if (userListMetaContent) {
            const attributes = generateAttributesString(userListMetaContent.values());
            getList(listItemLimit, listOffset, null, attributes, "primary");
        }
    }, [ listOffset, listItemLimit ]);

    useEffect(() => {
        if (!isListUpdated) {
            return;
        }
        const attributes = generateAttributesString(userListMetaContent.values());
        getList(listItemLimit, listOffset, null, attributes, userStore);
        setListUpdated(false);
    }, [ isListUpdated ]);

    /**
     * Shows list placeholders.
     * @return {JSX.Element}
     */
    const showPlaceholders = (): JSX.Element => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <Button
                            className="link-button"
                            onClick={ () => getList(listItemLimit, listOffset, null, null, null) }
                        >
                            { t("devPortal:placeholders.emptySearchResult.action") }
                        </Button>
                    ) }
                    image={ EmptyPlaceholderIllustrations.search }
                    title={ t("devPortal:placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("devPortal:placeholders.emptySearchResult.subtitles.0",
                            { query: searchQuery }),
                        t("devPortal:placeholders.emptySearchResult.subtitles.1"),
                    ] }
                />
            );
        }
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
     * The following method set the list of columns selected by the user to
     * the state.
     *
     * @param metaColumns - string[]
     */
    const handleMetaColumnChange = (metaColumns: string[]) => {
        const tempColumns = new Map<string, string> ();
        metaColumns.map((column) => {
            tempColumns.set(column, column)
        });
        setUserListMetaContent(tempColumns);
    };

    /**
     * Handles the `onFilter` callback action from the
     * users search component.
     *
     * @param {string} query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        const attributes = generateAttributesString(userListMetaContent.values());
        if (query === "userName sw ") {
            getList(null, null, null, attributes, userStore);
            return;
        }

        setSearchQuery(query);
        getList(null, null, query, attributes, userStore);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setUserStore(data.value as string);
    };

    const handleUserDelete = (userId: string): void => {
        deleteUser(userId)
            .then(() => {
                handleAlerts({
                    description: t(
                        "devPortal:components.users.notifications.deleteUser.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "devPortal:components.users.notifications.deleteUser.success.message"
                    )
                });
                setListUpdated(true);
            });
    };

    return (
        <PageLayout
            title="Users"
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
                leftActionPanel={
                    (
                        <>
                            <Popup
                                className={ "list-options-popup" }
                                flowing
                                basic
                                content={ <UsersListOptionsComponent
                                    handleMetaColumnChange={ handleMetaColumnChange }
                                    userListMetaContent={ userListMetaContent }
                                /> }
                                position="bottom left"
                                on='click'
                                pinned
                                trigger={
                                    <Button basic><Icon name="columns"/>Columns</Button>
                                }
                            />
                            <Dropdown
                                selection
                                options={ userStoreOptions && userStoreOptions }
                                placeholder="Select user store"
                                value={ userStore && userStore }
                                onChange={ handleDomainChange }
                            />
                        </>
                    )
                }
                showPagination={ true }
                totalPages={ Math.ceil(usersList.totalResults / listItemLimit) }
                totalListSize={ usersList.totalResults }
            >
                {
                    (usersList.Resources && usersList.Resources.length > 0) ?
                        (
                            <UsersList
                                usersList={ usersList }
                                handleUserDelete={ handleUserDelete }
                                userMetaListContent={ userListMetaContent }
                            />
                        ) :
                        (
                            <Grid.Column width={ 16 }>
                                { showPlaceholders() }
                            </Grid.Column>
                        )
                }
                {
                    showWizard && (
                    <AddUserWizard
                        closeWizard={ () => setShowWizard(false) }
                        listOffset={ listOffset }
                        listItemLimit={ listItemLimit }
                        updateList={ () => setListUpdated(true) }
                        rolesList={ rolesList }
                    />
                    )
                }
            </ListLayout>
        </PageLayout>
    );
};
