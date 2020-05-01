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
import { EmptyPlaceholder, LinkButton, PrimaryButton } from "@wso2is/react-components";
import _ from "lodash";
import React, { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { deleteRoleById, getRolesList, getUserStoreList, searchRoleList } from "../api";
import { AdvancedSearchWithBasicFilters } from "../components";
import { RoleList } from "../components/roles";
import { CreateRoleWizard } from "../components/roles/create-role-wizard";
import { EmptyPlaceholderIllustrations } from "../configs";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN, UserConstants } from "../constants";
import { ListLayout, PageLayout } from "../layouts";
import { AlertInterface, AlertLevels, RolesInterface, SearchRoleInterface } from "../models"

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

const filterOptions: DropdownItemProps[] = [
    {
        key: "all",
        text: "Show All",
        value: "all"
    },
    {
        key: APPLICATION_DOMAIN,
        text: "Application Domain",
        value: APPLICATION_DOMAIN
    },
    {
        key: INTERNAL_DOMAIN,
        text: "Internal Domain",
        value: INTERNAL_DOMAIN
    }
];

/**
 * React component to list User Roles.
 * 
 * @return {ReactElement}
 */
export const RolesPage = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isListUpdated, setListUpdated ] = useState(false);
    // TODO: Check the usage and delete id not required.
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState(undefined);
    const [ filterBy, setFilterBy ] = useState<string>("all");
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    // TODO: Check the usage and delete id not required.
    const [ isEmptyResults, setIsEmptyResults ] = useState<boolean>(false);
    const [ isRoleListRequestLoading, setRoleListRequestLoading ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState(false);

    const [ initialRolList, setInitialRoleList ] = useState<RolesInterface[]>([]);
    const [ paginatedRoles, setPaginatedRoles ] = useState<RolesInterface[]>([]);

    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(ROLES_SORTING_OPTIONS[ 0 ]);

    useEffect(() => {
        setListItemLimit(UserConstants.DEFAULT_ROLE_LIST_ITEM_LIMIT);
    }, []);

    useEffect(() => {
        if (searchQuery == "") {
            getRoles();
        }
    },[ initialRolList.length != 0 ]);

    useEffect(() => {
        getRoles();
        setListUpdated(false);
    }, [ isListUpdated ]);

    useEffect(() => {
        getUserStores();
    }, []);

    useEffect(() => {
        getRoles();
    }, [ filterBy ]);

    useEffect(() => {
        getRoles();
    }, [ userStore ]);

    const getRoles = () => {
        setRoleListRequestLoading(true);

        getRolesList(userStore)
            .then((response) => {
                if (response.status === 200) {
                    const roleResources = response.data.Resources;

                    if (roleResources && roleResources instanceof Array) {
                        const updatedResources = roleResources.filter((role: RolesInterface) => {
                            if (filterBy === "all") {
                                return role.displayName.includes(APPLICATION_DOMAIN) ||
                                    role.displayName.includes(INTERNAL_DOMAIN);
                            } else if (APPLICATION_DOMAIN === filterBy) {
                                return role.displayName.includes(APPLICATION_DOMAIN);
                            } else if (INTERNAL_DOMAIN === filterBy) {
                                return role.displayName.includes(INTERNAL_DOMAIN);
                            }
                        });
                        response.data.Resources = updatedResources;
                        setInitialRoleList(updatedResources);
                        setRolesPage(0, listItemLimit, updatedResources);
                    }
                }
            })
            .finally(() => {
                setRoleListRequestLoading(false);
            });
    };

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
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
            ],
            startIndex: 1,
            filter: searchQuery
        };

        setSearchQuery(searchQuery);

        searchRoleList(searchData).then(response => {
            if (response.status === 200) {
                const results = response.data.Resources;
                let updatedResults = [];
                if (results) {
                    updatedResults = results.filter((role: RolesInterface) => {
                        return role.displayName.includes(APPLICATION_DOMAIN) || 
                            role.displayName.includes(INTERNAL_DOMAIN);
                    })
                }
                setInitialRoleList(updatedResults);
                setPaginatedRoles(updatedResults);
            }
        })
    };

    /**
     * Util method to paginate retrieved email template type list.
     * 
     * @param offsetValue pagination offset value
     * @param itemLimit pagination item limit
     */
    const setRolesPage = (offsetValue: number, itemLimit: number, roleList: RolesInterface[]) => {
        setPaginatedRoles(roleList?.slice(offsetValue, itemLimit + offsetValue));
    };

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setUserStore(data.value as string);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;
        setListOffset(offsetValue);
        setRolesPage(offsetValue, listItemLimit, initialRolList);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setRolesPage(listOffset, data.value as number, initialRolList);
    };

    const handleFilterChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setFilterBy(data.value as string);
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
     * @param role - Role ID which needs to be deleted
     */
    const handleOnDelete = (role: RolesInterface): void => {
        deleteRoleById(role.id).then(() => {
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
            getRoles();
            return;
        }

        searchRoleListHandler(query);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery(null);
        getRoles();
    };

    /**
     * Shows list placeholders.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {

        if (isRoleListRequestLoading) {
            return null;
        }

        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleSearchQueryClear }>Clear search query</LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title={ "No results found" }
                    subtitle={ [
                        `We couldn't find any results for ${ searchQuery }`,
                        "Please try a different search term."
                    ] }
                />
            );
        }

        if (paginatedRoles?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <PrimaryButton onClick={ () => setShowWizard(true) }>
                            <Icon name="add"/>
                            New Role
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={ "Add a new role" }
                    subtitle={ [
                        "There are currently no roles available.",
                        "You can add a new role easily by following the",
                        "steps in the role creation wizard."
                    ] }
                />
            );
        }

        return null;
    };

    return (
        <PageLayout
            title="Roles"
            description="Create and manage roles, assign permissions for roles."
            showBottomDivider={ true } 
        >
            {
                !isEmptyResults &&
                <ListLayout
                    advancedSearch={ (
                        <AdvancedSearchWithBasicFilters
                            onFilter={ handleUserFilter  }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: "Name",
                                    value: "displayName"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("devPortal:components.roles.advancedSearch.form.inputs.filterAttribute.placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("devPortal:components.roles.advancedSearch.form.inputs.filterCondition" +
                                    ".placeholder")
                            }
                            filterValuePlaceholder={
                                t("devPortal:components.roles.advancedSearch.form.inputs.filterValue" +
                                    ".placeholder")
                            }
                            placeholder={ t("devPortal:components.roles.advancedSearch.placeholder") }
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
                        (
                            <PrimaryButton onClick={ () => setShowWizard(true) }>
                                <Icon name="add"/>
                                New Role
                            </PrimaryButton>
                        )
                    }
                    leftActionPanel={
                        (
                            <Dropdown
                                selection
                                options={ filterOptions }
                                placeholder="Filter by"
                                onChange={ handleFilterChange }
                            />
                        )
                    }
                    showPagination={ paginatedRoles?.length > 0 }
                    showTopActionPanel={ !(!searchQuery && paginatedRoles?.length <= 0) }
                    totalPages={ Math.ceil(initialRolList?.length / listItemLimit) }
                    totalListSize={ initialRolList?.length }
                >
                    {
                        paginatedRoles.length > 0
                            ? (
                                <RoleList
                                    isGroup={ false }
                                    roleList={ paginatedRoles }
                                    handleRoleDelete={ handleOnDelete }
                                />
                            )
                            : showPlaceholders()
                    }
                </ListLayout>
            }
            {
                showWizard && (
                    <CreateRoleWizard
                        isAddGroup={ false }
                        closeWizard={ () => setShowWizard(false) }
                        updateList={ () => setListUpdated(true) }
                    />
                ) 
            }
        </PageLayout>
    );
};
