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

import { addAlert } from "@wso2is/core/store";
import { PrimaryButton } from "@wso2is/react-components";
import _ from "lodash";
import React, { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { deleteRoleById, getRolesList, getUserStoreList, searchRoleList } from "../../api";
import { AdvancedSearchWithBasicFilters } from "../../components";
import { RoleList } from "../../components/roles";
import { CreateRoleWizard } from "../../components/roles/create-role-wizard";
import { UIConstants } from "../../constants";
import { ListLayout, PageLayout } from "../../layouts";
import { AlertInterface, AlertLevels, RoleListInterface, RolesInterface, SearchRoleInterface } from "../../models"

const ROLES_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: "Name",
        value: "name"
    },
    {
        key: 3,
        text: "Created date",
        value: "createdDate"
    },
    {
        key: 4,
        text: "Last updated",
        value: "lastUpdated"
    }
];

/**
 * React component to list User Groups.
 *
 * @return {ReactElement}
 */
export const GroupsPage = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // TODO: Check the usage and delete if not required.
    const [ roleList, setRoleList ] = useState<RoleListInterface>();
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isListUpdated, setListUpdated ] = useState(false);
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    // TODO: Check the usage and delete id not required.
    const [ isEmptyResults, setIsEmptyResults ] = useState<boolean>(false);
    const [ isGroupsListRequestLoading, setGroupsListRequestLoading ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const [ groupList, setGroupsList ] = useState<RolesInterface[]>([]);
    const [ paginatedGroups, setPaginatedGroups ] = useState<RolesInterface[]>([]);

    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(ROLES_SORTING_OPTIONS[ 0 ]);

    useEffect(() => {
        if(searchQuery == "") {
            getGroups();
        }
    },[ groupList.length != 0 ]);

    useEffect(() => {
        getGroups();
        setListUpdated(false);
    }, [ isListUpdated ]);

    useEffect(() => {
        getUserStores();
    }, []);

    useEffect(() => {
        getGroups();
    }, [ userStore ]);

    const getGroups = () => {
        setGroupsListRequestLoading(true);

        getRolesList(userStore)
            .then((response) => {
                if (response.status === 200) {
                    const roleResources = response.data.Resources;
                    if (roleResources && roleResources instanceof Array && roleResources.length !== 0) {
                        const updatedResources = roleResources.filter((role: RolesInterface) => {
                            return !role.displayName.includes("Application/")
                                && !role.displayName.includes("Internal/");
                        });
                        response.data.Resources = updatedResources;
                        setGroupsList(updatedResources);
                        setGroupsPage(0, listItemLimit, updatedResources);
                    } else {
                        setPaginatedGroups([]);
                        setIsEmptyResults(true);
                    }
                    setRoleList(response.data);
                }
            })
            .finally(() => {
                setGroupsListRequestLoading(false);
            });
    };

    /**
     * The following function fetch the user store list and set it to the state.
     */
    const getUserStores = () => {
        const storeOptions = [
                {
                    key: -2,
                    text: "All user stores",
                    value: null
                },
                {
                    key: -1,
                    text: "Primary",
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
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(_.find(ROLES_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    const searchRoleListHandler = (searchQuery: string) => {
        const searchData: SearchRoleInterface = {
            filter: searchQuery,
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
            ],
            startIndex: 1
        };

        setSearchQuery(searchQuery);

        searchRoleList(searchData).then(response => {
            if (response.status === 200) {
                const results = response.data.Resources;
                let updatedResults = [];
                if (results) {
                    updatedResults = results.filter((role: RolesInterface) => {
                        return !role.displayName.includes("Application/") && !role.displayName.includes("Internal/");
                    })
                }
                setGroupsList(updatedResults);
                setPaginatedGroups(updatedResults);
            }
        })
    };

    /**
     * Util method to paginate retrieved email template type list.
     *
     * @param offsetValue pagination offset value
     * @param itemLimit pagination item limit
     * @param list - Role list.
     */
    const setGroupsPage = (offsetValue: number, itemLimit: number, list: RolesInterface[]) => {
        setPaginatedGroups(list?.slice(offsetValue, itemLimit + offsetValue));
    };

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setUserStore(data.value as string);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;
        setListOffset(offsetValue);
        setGroupsPage(offsetValue, listItemLimit, groupList);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setGroupsPage(listOffset, data.value as number, groupList);
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
     * @param role - Role which needs to be deleted
     */
    const handleOnDelete = (role: RolesInterface): void => {
        deleteRoleById(role.id).then(() => {
            handleAlerts({
                description: t(
                    "devPortal:components.groups.notifications.deleteGroup.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "devPortal:components.groups.notifications.deleteGroup.success.message"
                )
            });
            setListUpdated(true);
        }).catch(error => {
            handleAlerts({
                description: t(
                    "devPortal:components.groups.notifications.deleteGroup.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "devPortal:components.groups.notifications.deleteGroup.error.message"
                )
            });
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
            getGroups();
            return;
        }

        searchRoleListHandler(query);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        getGroups();
    };

    return (
        <PageLayout
            title={ t("devPortal:pages.groups.title") }
            description={ t("devPortal:pages.groups.subTitle") }
            showBottomDivider={ true }
        >
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        data-testid="group-mgt-groups-list-advanced-search"
                        onFilter={ handleUserFilter  }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: "Name",
                                value: "displayName"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("devPortal:components.groups.advancedSearch.form.inputs.filterAttribute.placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("devPortal:components.groups.advancedSearch.form.inputs.filterCondition" +
                                ".placeholder")
                        }
                        filterValuePlaceholder={
                            t("devPortal:components.groups.advancedSearch.form.inputs.filterValue" +
                                ".placeholder")
                        }
                        placeholder={ t("devPortal:components.groups.advancedSearch.placeholder") }
                        defaultSearchAttribute="displayName"
                        defaultSearchOperator="sw"
                        triggerClearQuery={ triggerClearQuery }
                    />
                ) }
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                sortStrategy={ listSortingStrategy }
                rightActionPanel={
                    <PrimaryButton
                        data-testid="group-mgt-groups-list-add-button"
                        onClick={ () => setShowWizard(true) }
                    >
                        <Icon name="add"/>
                        { t("devPortal:components.roles.list.buttons.addButton", { type: "Group" }) }
                    </PrimaryButton>
                }
                leftActionPanel={
                    <Dropdown
                        data-testid="group-mgt-groups-list-stores-dropdown"
                        selection
                        options={ userStoreOptions && userStoreOptions }
                        placeholder={ t("devPortal:components.groups.list.storeOptions") }
                        value={ userStore && userStore }
                        onChange={ handleDomainChange }
                    />
                }
                showPagination={ paginatedGroups.length > 0  }
                showTopActionPanel={ isGroupsListRequestLoading || !(!searchQuery && paginatedGroups?.length <= 0) }
                totalPages={ Math.ceil(groupList?.length / listItemLimit) }
                totalListSize={ groupList?.length }
            >
                <RoleList
                    data-testid="group-mgt-groups-list"
                    handleRoleDelete={ handleOnDelete }
                    isGroup={ true }
                    isLoading={ isGroupsListRequestLoading }
                    onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                    onSearchQueryClear={ handleSearchQueryClear }
                    roleList={ paginatedGroups }
                    searchQuery={ searchQuery }
                />
            </ListLayout>
            {
                showWizard && (
                    <CreateRoleWizard
                        data-testid="group-mgt-create-group-wizard"
                        isAddGroup
                        closeWizard={ () => setShowWizard(false) }
                        updateList={ () => setListUpdated(true) }
                    />
                )
            }
        </PageLayout>
    );
};
