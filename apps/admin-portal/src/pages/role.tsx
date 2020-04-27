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

import { PrimaryButton, EmptyPlaceholder } from "@wso2is/react-components";
import _ from "lodash";
import React, { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps, Popup, Button, Dropdown, Grid } from "semantic-ui-react";
import { deleteRoleById, getRolesList, getUserStoreList, searchRoleList } from "../api";

import { RoleList, RoleSearch } from "../components/roles";
import { CreateRoleWizard } from "../components/roles/create-role-wizard";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN, UserConstants } from "../constants";
import { ListLayout, PageLayout } from "../layouts";
import { AlertInterface, AlertLevels, RolesInterface, SearchRoleInterface } from "../models"
import { addAlert } from "../store/actions";
import { EmptyPlaceholderIllustrations } from "../configs";

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
        key: 'all',
        text: 'Show All',
        value: 'all'
    },
    {
        key: APPLICATION_DOMAIN,
        text: 'Application Domain',
        value: APPLICATION_DOMAIN
    },
    {
        key: INTERNAL_DOMAIN,
        text: 'Internal Domain',
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
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState(undefined);
    const [ filterBy, setFilterBy ] = useState<string>('all');
    const [ searchQuery, setSearchQuery ] = useState<string>('');
    const [ isEmptyResults, setIsEmptyResults ] = useState<boolean>(false);

    const [ initialRolList, setInitialRoleList ] = useState<RolesInterface[]>([]);
    const [ paginatedRoles, setPaginatedRoles ] = useState<RolesInterface[]>([]);

    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(ROLES_SORTING_OPTIONS[ 0 ]);

    useEffect(() => {
        setListItemLimit(UserConstants.DEFAULT_ROLE_LIST_ITEM_LIMIT);
    }, []);

    useEffect(() => {
        if (searchQuery == '') {
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
        getRolesList(userStore).then((response)=> {
            if (response.status === 200) {
                const roleResources = response.data.Resources

                if (roleResources && roleResources instanceof Array) {
                    const updatedResources = roleResources.filter((role: RolesInterface) => {
                        if (filterBy === 'all') {
                            return role.displayName.includes(APPLICATION_DOMAIN) || 
                                role.displayName.includes(INTERNAL_DOMAIN);
                        } else if (APPLICATION_DOMAIN === filterBy) {
                            return role.displayName.includes(APPLICATION_DOMAIN);
                        } else if (INTERNAL_DOMAIN === filterBy) {
                            return role.displayName.includes(INTERNAL_DOMAIN);
                        }
                    })
                    response.data.Resources = updatedResources;
                    setInitialRoleList(updatedResources);
                    setRolesPage(0, listItemLimit, updatedResources);
                }
            }
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
        }

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
    }

    /**
     * Util method to paginate retrieved email template type list.
     * 
     * @param offsetValue pagination offset value
     * @param itemLimit pagination item limit
     */
    const setRolesPage = (offsetValue: number, itemLimit: number, roleList: RolesInterface[]) => {
        setPaginatedRoles(roleList?.slice(offsetValue, itemLimit + offsetValue));
    }

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
    }

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



    return (
        <PageLayout
            title="Roles"
            description="Create and manage roles, assign permissions for roles."
            showBottomDivider={ true } 
        >
            {
                !isEmptyResults &&
                <ListLayout
                    advancedSearch={ <RoleSearch isGroup={ false } onFilter={ handleUserFilter }/> }
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
                    showPagination={ true }
                    totalPages={ Math.ceil(initialRolList?.length / listItemLimit) }
                    totalListSize={ initialRolList?.length }
                >
                    {
                        paginatedRoles.length > 0 ?
                            <RoleList 
                                isGroup={ false }
                                roleList={ paginatedRoles }
                                handleRoleDelete={ handleOnDelete }
                            />
                        :
                        <Grid.Column width={ 16 }>
                            {
                                searchQuery !== '' &&
                                <EmptyPlaceholder
                                    action={ (
                                        <Button
                                            className="link-button"
                                            onClick={ () => getRoles() }
                                        >
                                            { t("devPortal:placeholders.emptySearchResult.action") }
                                        </Button>
                                    ) }
                                    image={ EmptyPlaceholderIllustrations.search }
                                    title={ t("devPortal:placeholders.emptySearchResult.title") }
                                    subtitle={ [
                                        t("devPortal:placeholders.emptySearchResult.subtitles.0",
                                            { query: searchQuery }),
                                        t("devPortal:placeholders.emptySearchResult.subtitles.1")
                                    ] }
                                />
                            }
                        </Grid.Column>
                    }
                </ListLayout>
            }
            {
                isEmptyResults &&
                <EmptyPlaceholder
                    action={
                        <PrimaryButton
                            onClick={ () => {
                                setShowWizard(true);
                            } }
                        >
                            <Icon name="add"/> New Role
                        </PrimaryButton>
                    }
                    title="Add Role"
                    subtitle={ ["Currently, there are no roles available."] }
                    image={ EmptyPlaceholderIllustrations.emptyList }
                    imageSize="tiny"
                />
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
}
