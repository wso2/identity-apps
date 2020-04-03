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

import { EmptyPlaceholder, PrimaryButton } from "@wso2is/react-components";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { getUserStores } from "../api";
import { AddUserStore, UserStoresList, UserStoresSearch } from "../components";
import { EmptyPlaceholderIllustrations } from "../configs";
import { UserConstants } from "../constants";
import { ListLayout, PageLayout } from "../layouts";
import { AlertLevels, AppConfigInterface, QueryParams, UserStoreListItem } from "../models";
import { addAlert } from "../store/actions";
import { filterList, sortList } from "../utils";
import { AppConfig } from "../helpers";

/**
 * This renders the Userstores page.
 *
 * @return {React.ReactElement}
 */
export const UserStores = (): React.ReactElement => {

    /**
     * Sets the attributes by which the list can be sorted.
     */
    const SORT_BY = [
        {
            key: 0,
            text: "Name",
            value: "name"
        },
        {
            key: 1,
            text: "Description",
            value: "description"
        }
    ];

    const [userStores, setUserStores] = useState<UserStoreListItem[]>(null);
    const [offset, setOffset] = useState(0);
    const [listItemLimit, setListItemLimit] = useState<number>(0);
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredUserStores, setFilteredUserStores] = useState<UserStoreListItem[]>(null);
    const [sortBy, setSortBy] = useState(SORT_BY[0]);
    const [sortOrder, setSortOrder] = useState(true);

    const dispatch = useDispatch();

    const appConfig: AppConfigInterface = useContext(AppConfig);

    /**
     * Fetches all userstores.
     *
     * @param {number} limit.
     * @param {string} sort.
     * @param {number} offset.
     * @param {string} filter.
     */
    const fetchUserStores = (limit?: number, sort?: string, offset?: number, filter?: string) => {
        const params: QueryParams = {
            limit: limit || null,
            sort: sort || null,
            offset: offset || null,
            filter: filter || null
        };
        setIsLoading(true);
        getUserStores(params).then(response => {
            setUserStores(response);
            setFilteredUserStores(response);
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            dispatch(addAlert(
                {
                    description: error?.description || "An error occurred while fetching userstores",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        });
    };

    useEffect(() => {
        setListItemLimit(UserConstants.DEFAULT_USER_LIST_ITEM_LIMIT);
        fetchUserStores(null, null, null, null);
    }, []);

    useEffect(() => {
        setFilteredUserStores((sortList(filteredUserStores, sortBy.value, sortOrder)));
    }, [sortBy, sortOrder]);

    /**
     * This slices and returns a portion of the list.
     *
     * @param {number} list.
     * @param {number} limit.
     * @param {number} offset.
     *
     * @return {UserStoreListItem[]} Paginated list.
     */
    const paginate = (list: UserStoreListItem[], limit: number, offset: number): UserStoreListItem[] => {
        return list?.slice(offset, offset + limit);
    };

    /**
     * Handles the change in the number of items to display.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event.
     * @param {DropdownProps} data.
     */
    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    /**
     * This paginates.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event.
     * @param {PaginationProps} data.
     */
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Handles sort order change.
     *
     * @param {boolean} isAscending.
     */
    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    /**
     * Handle sort strategy change.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event.
     * @param {DropdownProps} data.
     */
    const handleSortStrategyChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setSortBy(SORT_BY.filter(option => option.value === data.value)[0]);
    };

    return (
        <>
            {
                openModal
                    && (
                        <AddUserStore
                            open={ openModal }
                            onClose={ () => {
                                setOpenModal(false)
                            } }
                        />
                    )
            }
            <PageLayout
                title="Userstores"
                description="View, edit, and add userstores"
                showBottomDivider={ true }
            >
                {
                    filteredUserStores?.length > 0
                        ? (<ListLayout
                                advancedSearch={
                                    <UserStoresSearch
                                        onFilter={ (query) => {
                                            // TODO: Implement once the API is ready
                                            //  fetchUserStores(null, null, null, query);
                                            setFilteredUserStores(
                                                filterList(userStores, query, "name", true)
                                            );

                                        } }
                                    />
                                }
                                currentListSize={ listItemLimit }
                                listItemLimit={ listItemLimit }
                                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                                onPageChange={ handlePaginationChange }
                                onSortStrategyChange={ handleSortStrategyChange }
                                onSortOrderChange={ handleSortOrderChange }
                                rightActionPanel={
                                   appConfig?.userStores?.permissions?.create &&  (
                                        <PrimaryButton
                                            onClick={ () => {
                                                setOpenModal(true);
                                            } }
                                        >
                                            <Icon name="add"/>Add Userstore
                                        </PrimaryButton>
                                    )
                                }
                                leftActionPanel={ null }
                                showPagination={ true }
                                sortOptions={ SORT_BY }
                                sortStrategy={ sortBy }
                                totalPages={ Math.ceil(filteredUserStores?.length / listItemLimit) }
                                totalListSize={ filteredUserStores?.length }
                            >
                                <UserStoresList
                                    list={ paginate(filteredUserStores, listItemLimit, offset) }
                                    update={ fetchUserStores }
                                />
                            </ListLayout>
                        )
                        : !isLoading && (
                        <EmptyPlaceholder
                            action={
                                <PrimaryButton
                                    onClick={ () => {
                                        setOpenModal(true);
                                    } }
                                >
                                    <Icon name="add"/> Add Userstore
                                </PrimaryButton>
                            }
                            title="Add Userstore"
                            subtitle={ ["Currently, there are no Userstores available."] }
                            image={ EmptyPlaceholderIllustrations.emptyList }
                            imageSize="tiny"
                        />
                    )
                }
            </PageLayout>
        </>
    );
};
