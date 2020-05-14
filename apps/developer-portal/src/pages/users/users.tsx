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

import { AuthenticateSessionUtil, AuthenticateUserKeys } from "@wso2is/authentication";
import { CommonHelpers } from "@wso2is/core/helpers";
import { addAlert } from "@wso2is/core/store";
import { LocalStorageUtils } from "@wso2is/core/utils";
import { Button, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownProps, Icon, PaginationProps, Popup } from "semantic-ui-react";
import { deleteUser, getUserStoreList, getUsersList } from "../../api";
import { AddUserWizard, AdvancedSearchWithBasicFilters, UsersList, UsersListOptionsComponent } from "../../components";
import { UIConstants, UserConstants } from "../../constants";
import { ListLayout, PageLayout } from "../../layouts";
import { AlertInterface, AlertLevels, UserListInterface } from "../../models";
import { store } from "../../store";

/**
 * Users info page.
 *
 * @return {React.ReactElement}
 */
export const UsersPage: FunctionComponent<any> = (): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ usersList, setUsersList ] = useState<UserListInterface>({});
    const [ rolesList ] = useState([]);
    const [ isListUpdated, setListUpdated ] = useState(false);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState(undefined);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ isUserListRequestLoading, setUserListRequestLoading ] = useState<boolean>(false);

    const username = AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME);
    const tenantName = store.getState().config.deployment.tenant;
    const tenantSettings = JSON.parse(LocalStorageUtils.getValueFromLocalStorage(tenantName));

    const getList = (limit: number, offset: number, filter: string, attribute: string, domain: string) => {
        setUserListRequestLoading(true);

        getUsersList(limit, offset, filter, attribute, domain)
            .then((response) => {
                setUsersList(response);
            })
            .finally(() => {
                setUserListRequestLoading(false);
            });
    };

    useEffect(() => {
        if(CommonHelpers.lookupKey(tenantSettings, username) !== null) {
            const userSettings = CommonHelpers.lookupKey(tenantSettings, username);
            const userPreferences = userSettings[1];
            const tempColumns = new Map<string, string> ();

            if (userPreferences.identityAppsSettings.userPreferences.userListColumns.length < 1) {
                const metaColumns = UserConstants.DEFAULT_USER_LIST_ATTRIBUTES;
                setUserMetaColumns(metaColumns);
                metaColumns.map((column) => {
                    if (column === "id") {
                        tempColumns.set(column, "");
                    } else {
                        tempColumns.set(column, column);
                    }
                });
                setUserListMetaContent(tempColumns);
            }
            userPreferences.identityAppsSettings.userPreferences.userListColumns.map((column) => {
                tempColumns.set(column, column);
            });
            setUserListMetaContent(tempColumns);
        }
    }, []);

    /**
     * The following function fetch the userstore list and set it to the state.
     */
    const getUserStores = () => {
        const storeOptions = [
                {
                    key: -2,
                    text: t("devPortal:components.users.userstores.userstoreOptions.all"),
                    value: "all"
                },
                {
                    key: -1,
                    text: t("devPortal:components.users.userstores.userstoreOptions.primary"),
                    value: "primary"
                }
            ];

        let storeOption = {
            key: null,
            text: "",
            value: ""
        };

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
     * Fetch the list of available userstores.
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
     * The following method set the user preferred columns to the local storage.
     *
     * @param metaColumns - string[]
     */
    const setUserMetaColumns = (metaColumns: string[]) => {
        if(CommonHelpers.lookupKey(tenantSettings, username) !== null) {
            const userSettings = CommonHelpers.lookupKey(tenantSettings, username);
            const userPreferences = userSettings[1];

            const newUserSettings = {
                ...tenantSettings,
                [ username ]: {
                    ...userPreferences,
                    identityAppsSettings: {
                        ...userPreferences.identityAppsSettings,
                        userPreferences: {
                            ...userPreferences.identityAppsSettings.userPreferences,
                            userListColumns: metaColumns
                        }
                    }
                }
            };

            LocalStorageUtils.setValueInLocalStorage(tenantName, JSON.stringify(newUserSettings));
        }
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        getList(listItemLimit, listOffset, null, null, null);
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
        metaColumns.push("profileUrl");
        const tempColumns = new Map<string, string> ();
        setUserMetaColumns(metaColumns);

        metaColumns.map((column) => {
            tempColumns.set(column, column)
        });
        setUserListMetaContent(tempColumns);
        setListUpdated(true);
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
            getList(listItemLimit, listOffset, null, attributes, userStore);
            return;
        }

        setSearchQuery(query);
        getList(listItemLimit, listOffset, query, attributes, userStore);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        if (data.value === "all") {
            setUserStore(null);
        } else {
            setUserStore(data.value as string);
        }
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
            title={ t("devPortal:pages.users.title") }
            description={ t("devPortal:pages.users.subTitle") }
            showBottomDivider={ true }
        >
            <ListLayout
                // TODO add sorting functionality.
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleUserFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("devPortal:components.users.advancedSearch.form.dropdown." +
                                    "filterAttributeOptions.username"),
                                value: "userName"
                            },
                            {
                                key: 1,
                                text: t("devPortal:components.users.advancedSearch.form.dropdown." +
                                    "filterAttributeOptions.email"),
                                value: "emails"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("devPortal:components.users.advancedSearch.form.inputs.filterAttribute.placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("devPortal:components.users.advancedSearch.form.inputs.filterCondition" +
                                ".placeholder")
                        }
                        filterValuePlaceholder={
                            t("devPortal:components.users.advancedSearch.form.inputs.filterValue" +
                                ".placeholder")
                        }
                        placeholder={ t("devPortal:components.users.advancedSearch.placeholder") }
                        defaultSearchAttribute="userName"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                    />
                ) }
                currentListSize={ usersList.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-testid="user-mgt-user-list-layout"
                onPageChange={ handlePaginationChange }
                rightActionPanel={
                    (
                        <PrimaryButton
                            data-testid="user-mgt-user-list-add-user-button"
                            onClick={ () => setShowWizard(true) }
                        >
                            <Icon name="add"/>
                            { t("devPortal:components.users.buttons.addNewUserBtn") }
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
                                content={
                                    <UsersListOptionsComponent
                                        data-testid="user-mgt-user-list-meta-columns"
                                        handleMetaColumnChange={ handleMetaColumnChange }
                                        userListMetaContent={ userListMetaContent }
                                    />
                                }
                                position="bottom left"
                                on='click'
                                pinned
                                trigger={
                                    <Button
                                        data-testid="user-mgt-user-list-meta-columns-button"
                                        className="meta-columns-button"
                                        basic
                                    >
                                        <Icon name="columns"/>
                                        { t("devPortal:components.users.buttons.metaColumnBtn") }
                                    </Button>
                                }
                            />
                            <Dropdown
                                data-testid="user-mgt-user-list-userstore-dropdown"
                                selection
                                options={ userStoreOptions && userStoreOptions }
                                onChange={ handleDomainChange }
                                defaultValue="primary"
                            />
                        </>
                    )
                }
                showPagination={ true }
                showTopActionPanel={ isUserListRequestLoading || !(!searchQuery && usersList?.totalResults <= 0) }
                totalPages={ Math.ceil(usersList.totalResults / listItemLimit) }
                totalListSize={ usersList.totalResults }
            >
                <UsersList
                    usersList={ usersList }
                    handleUserDelete={ handleUserDelete }
                    userMetaListContent={ userListMetaContent }
                    isLoading={ isUserListRequestLoading }
                    onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    data-testid="user-mgt-user-list"
                />
                {
                    showWizard && (
                    <AddUserWizard
                        data-testid="user-mgt-add-user-wizard-modal"
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
