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

import React, { useEffect, useState } from "react";
import { PageLayout } from "../layouts";
import { ListLayout } from "../layouts";
import { PrimaryButton, EmptyPlaceholder } from "@wso2is/react-components";
import { Icon, DropdownProps, PaginationProps } from "semantic-ui-react";
import { UserStoresSearch, AddUserStore } from "../components";
import { AlertLevels, QueryParams, UserStoreListItem } from "../models";
import { getUserStores } from "../api";
import { DEFAULT_USER_LIST_ITEM_LIMIT } from "../constants";
import { useDispatch } from "react-redux";
import { addAlert } from "../store/actions";
import { UserStoresList } from "../components";
import { EmptyPlaceholderIllustrations } from "../configs";

export const UserStores = (): React.ReactElement => {

    const [userStores, setUserStores] = useState<UserStoreListItem[]>(null);
    const [offset, setOffset] = useState(0);
    const [listItemLimit, setListItemLimit] = useState<number>(0);
    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch();

    const fetchUserStores = (limit?: number, sort?: string, offset?: number, filter?: string) => {
        const params: QueryParams = {
            limit: limit || null,
            sort: sort || null,
            offset: offset || null,
            filter: filter || null
        };

        getUserStores(params).then(response => {
            setUserStores(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "An error occurred while fetching user stores",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        });
    };

    useEffect(() => {
        setListItemLimit(DEFAULT_USER_LIST_ITEM_LIMIT);
        fetchUserStores(null, null, null, null);
    }, []);

    const paginate = (list: UserStoreListItem[], limit: number, offset: number): UserStoreListItem[] => {
        return list?.slice(offset, offset + limit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    return (
        <>
            {
                openModal
                    ? <AddUserStore
                        open={ openModal }
                        onClose={ ()=>{setOpenModal(false)} }
                />
                : null
            }
            <PageLayout
                title="User Stores"
                description="View, edit and add User Stores"
                showBottomDivider={ true }
            >
                {
                    userStores?.length > 0
                        ? (<ListLayout
                            advancedSearch={
                                <UserStoresSearch
                                    onFilter={ (query) => {
                                        fetchUserStores(null, null, null, query);
                                    } }
                                />
                            }
                            currentListSize={ listItemLimit }
                            listItemLimit={ listItemLimit }
                            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                            onPageChange={ handlePaginationChange }
                            onSortStrategyChange={ null }
                            rightActionPanel={
                                (
                                    <PrimaryButton
                                        onClick={ () => {
                                            setOpenModal(true);
                                        } }
                                    >
                                        <Icon name="add" />Add a User Store
                                    </PrimaryButton>
                                )
                            }
                            leftActionPanel={ null }
                            showPagination={ true }
                            sortOptions={ null }
                            sortStrategy={ null }
                            totalPages={ Math.ceil(userStores?.length / listItemLimit) }
                            totalListSize={ userStores?.length }
                        >
                            <UserStoresList
                                list={ paginate(userStores, listItemLimit, offset) }
                                update={ fetchUserStores }
                            />
                        </ListLayout>
                        )
                        : (
                            <EmptyPlaceholder
                                action={
                                    <PrimaryButton
                                        onClick={ () => {
                                            setOpenModal(true);
                                        } }
                                    >
                                        <Icon name="add" /> Add a User Store
                                </PrimaryButton>
                                }
                                title="Create a User Store"
                                subtitle={ ["Currently, there are no User Stores available."] }
                                image={ EmptyPlaceholderIllustrations.emptyList }
                                imageSize="tiny"
                            />
                        )
                }
            </PageLayout>
        </>
    );
};
