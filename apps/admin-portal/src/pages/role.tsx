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

import { AlertInterface, AlertLevels, RoleListInterface, SearchRoleInterface, RolesInterface } from "../models"
import { DropdownProps, Icon, PaginationProps, DropdownItemProps, Dropdown } from "semantic-ui-react";
import { ListLayout, PageLayout } from "../layouts";
import React, { ReactElement, useEffect, useState, SyntheticEvent } from "react";
import { deleteRoleById, getRolesList, searchRoleList, getUserStoreList } from "../api";

import { CreateRoleWizard } from "../components/roles/create-role-wizard";
import { DEFAULT_ROLE_LIST_ITEM_LIMIT } from "../constants";
import { PrimaryButton } from "@wso2is/react-components";
import { RoleList, RoleSearch } from "../components/roles";
import { addAlert } from "../store/actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import _ from "lodash";

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
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState(undefined);

    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(ROLES_SORTING_OPTIONS[ 0 ]);

    useEffect(() => {
        setListItemLimit(DEFAULT_ROLE_LIST_ITEM_LIMIT);
    }, []);

    useEffect(() => {
        getRoles();
    },[ listOffset, listItemLimit ]);

    useEffect(() => {
        getRoles();
        setListUpdated(false);
    }, [ isListUpdated ]);

    useEffect(() => {
        getUserStores();
    }, []);

    useEffect(() => {
        getRoles();
    }, [ userStore ]);

    const getRoles = () => {
        getRolesList(userStore).then((response)=> {
            if (response.status === 200) {
                setRoleList(response.data);
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
            filter: searchQuery,
        }

        searchRoleList(searchData).then(response => {
            if (response.status === 200) {
                setRoleList(response.data);
            }
        })
    }

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setUserStore(data.value as string);
    };

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
            description="Create and Manage Roles, Assign Permissions for Roles."
            showBottomDivider={ true } 
        >
            <ListLayout
                advancedSearch={ <RoleSearch onFilter={ handleUserFilter }/> }
                currentListSize={ roleList?.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                sortStrategy={ listSortingStrategy }
                rightActionPanel={
                    (
                        <PrimaryButton onClick={ () => setShowWizard(true) }>
                            <Icon name="add"/>
                            Add Role
                        </PrimaryButton>
                    )
                }
                leftActionPanel={
                    <Dropdown
                        selection
                        options={ userStoreOptions && userStoreOptions }
                        placeholder="Select user store"
                        value={ userStore && userStore }
                        onChange={ handleDomainChange }
                    />
                }
                showPagination={ true }
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
