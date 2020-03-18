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
import { PrimaryButton } from "@wso2is/react-components";
import { Icon, DropdownProps, PaginationProps } from "semantic-ui-react";
import { ClaimsList, ListType } from "../components";
import { ClaimDialect, AlertLevels } from "../models";
import { getDialects } from "../api";
import { DEFAULT_USER_LIST_ITEM_LIMIT } from "../constants";
import { AddEditDialect, DialectSearch } from "../components";
import { useDispatch } from "react-redux";
import { addAlert } from "../store/actions";
import { filterList, sortList } from "../utils";

export const ClaimDialectsPage = (): React.ReactElement => {

    const SORT_BY = [
        {
            key: 0,
            text: "Dialect URI",
            value: "dialectURI"
            
        }
    ];

    const [dialects, setDialects] = useState<ClaimDialect[]>(null);
    const [offset, setOffset] = useState(0);
    const [listItemLimit, setListItemLimit] = useState<number>(0);
    const [addEditClaim, setAddEditClaim] = useState(false);
    const [dialectID, setDialectID] = useState<string>(null);
    const [filteredDialects, setFilteredDialects] = useState<ClaimDialect[]>(null);
    const [sortBy, setSortBy] = useState(SORT_BY[0]);
    const [sortOrder, setSortOrder] = useState(true);

    const dispatch = useDispatch();

    const getDialect = (limit?: number, offset?: number, sort?: string, filter?: string, ) => {
        getDialects({
            limit, offset, sort, filter
        }).then((response: ClaimDialect[]) => {

            const filteredDialect: ClaimDialect[] = response.filter((claim: ClaimDialect) => {
                return claim.id !== "local";
            });
			setDialects(filteredDialect);
            setFilteredDialects(filteredDialect);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while getting the dialects",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        })
    }

    useEffect(() => {
        setListItemLimit(DEFAULT_USER_LIST_ITEM_LIMIT);
        getDialect();
    }, []);

    useEffect(() => {
        setFilteredDialects(sortList(filteredDialects, sortBy.value, sortOrder));
    }, [sortBy, sortOrder]);

    const paginate = (list: ClaimDialect[], limit: number, offset: number): ClaimDialect[] => {
        return list?.slice(offset, offset + limit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleSortStrategyChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setSortBy(SORT_BY.filter(option => option.value === data.value)[0]);
    };

    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    return (
        <>
            <AddEditDialect
                open={ addEditClaim }
                onClose={ () => {
                    setAddEditClaim(false);
                    setDialectID(null);
                } }
                update={ getDialect }
                edit={ dialectID ? true : false }
                dialectID={ dialectID }
            />
            <PageLayout
                title="Claim Dialects"
                description="View, edit and add Claim Dialects"
                showBottomDivider={ true }
            >
                <ListLayout
                    advancedSearch={
                        <DialectSearch onFilter={ (query) => {
                            // getDialect(null, null, null, query);
                            try {
                                const filteredDialects = filterList(dialects, query,sortBy.value, sortOrder);
                                setFilteredDialects(filteredDialects);
                            } catch (error) {
                                dispatch(addAlert({
                                    message: "Filter query format incorrect",
                                    description: error,
                                    level: AlertLevels.ERROR
                                }));
                            }
                        } } />
                    }
                    currentListSize={ listItemLimit }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ handleSortStrategyChange }
                    onSortOrderChange={ handleSortOrderChange }
                    rightActionPanel={
                        (
                            <PrimaryButton
                                onClick={ () => {
                                    setAddEditClaim(true);
                                } }
                            >
                                <Icon name="add" />Add a dialect
                            </PrimaryButton>
                        )
                    }
                    showPagination={ true }
                    sortOptions={ SORT_BY }
                    sortStrategy={ sortBy }
                    totalPages={ Math.ceil(filteredDialects?.length / listItemLimit) }
                    totalListSize={ filteredDialects?.length }
                >
                    <ClaimsList
                        list={ paginate(filteredDialects, listItemLimit, offset) }
                        localClaim={ ListType.DIALECT }
                        openEdit={
                            (id: string) => {
                                setDialectID(id);
                                setAddEditClaim(true);
                            }
                        }
                        update={ getDialect }
                    />
                </ListLayout>
            </PageLayout>
        </>
    );

};
