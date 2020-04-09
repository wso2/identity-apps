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

import { AlertLevels, AppConfigInterface, Claim, ClaimsGetParams } from "../models";
import { AppConfig, history } from "../helpers";
import { CLAIM_DIALECTS_PATH, UserConstants } from "../constants";
import { ClaimsList, ListType, LocalClaimsSearch } from "../components";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { filterList, sortList } from "../utils";
import { getADialect, getAllLocalClaims } from "../api";
import React, { useContext, useEffect, useState } from "react";

import { addAlert } from "../store/actions";
import { AddLocalClaims } from "../components";
import { ListLayout } from "../layouts";
import { PageLayout } from "../layouts";
import { PrimaryButton } from "@wso2is/react-components";
import { useDispatch } from "react-redux";

/**
 * This returns the list of local claims.
 *
 * @return {React.ReactElement}
 */
export const LocalClaimsPage = (): React.ReactElement => {

    /**
     * Sets the attributes by which the list can be sorted
     */
    const SORT_BY = [
        {
            key: 0,
            text: "Name",
            value: "displayName"
        },
        {
            key: 1,
            text: "Claim URI",
            value: "claimURI"
        }
    ];

    const [claims, setClaims] = useState<Claim[]>(null);
    const [offset, setOffset] = useState(0);
    const [listItemLimit, setListItemLimit] = useState<number>(0);
    const [openModal, setOpenModal] = useState(false);
    const [claimURIBase, setClaimURIBase] = useState("");
    const [filteredClaims, setFilteredClaims] = useState<Claim[]>(null);
    const [sortBy, setSortBy] = useState<DropdownItemProps>(SORT_BY[0]);
    const [sortOrder, setSortOrder] = useState(true);

    const dispatch = useDispatch();

    const appConfig: AppConfigInterface = useContext(AppConfig);

    /**
    * Fetches all the local claims.
     *
    * @param {number} limit.
    * @param {number} offset.
    * @param {string} sort.
    * @param {string} filter.
    */
    const getLocalClaims = (limit?: number, sort?: string, offset?: number, filter?: string) => {
        const params: ClaimsGetParams = {
            filter: filter || null,
            limit: limit || null,
            offset: offset || null,
            sort: sort || null
        };

        getAllLocalClaims(params).then(response => {
            setClaims(response);
            setFilteredClaims(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while fetching the local claims",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        });
    };

    useEffect(() => {
        setFilteredClaims(sortList(filteredClaims, sortBy.value as string, sortOrder));
    }, [sortBy, sortOrder]);

    useEffect(() => {
        setListItemLimit(UserConstants.DEFAULT_USER_LIST_ITEM_LIMIT);
        getLocalClaims(null, null, null, null);
        getADialect("local").then((response) => {
            setClaimURIBase(response.dialectURI);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while fetching the local dialect",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        });
    }, []);

    /**
    * This slices a portion of the list to display.
     *
    * @param {ClaimDialect[]} list.
    * @param {number} limit.
    * @param {number} offset.
     *
    * @return {ClaimDialect[]} Paginated List.
    */
    const paginate = (list: Claim[], limit: number, offset: number): Claim[] => {
        return list?.slice(offset, offset + limit);
    };

    /**
    * Handles change in the number of items to show.
     *
    * @param {React.MouseEvent<HTMLAnchorElement>} event.
    * @param {data} data.
    */
    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    /**
    * Paginates.
     *
    * @param {React.MouseEvent<HTMLAnchorElement>} event.
    * @param {PaginationProps} data.
    */
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
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

    /**
    * Handles sort order change.
     *
    * @param {boolean} isAscending.
    */
    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    return (
        <>
            {
                openModal
                    ? <AddLocalClaims
                        open={ openModal }
                        onClose={ () => { setOpenModal(false) } }
                        update={ getLocalClaims }
                        claimURIBase={ claimURIBase }
                    />
                    : null
            }
            <PageLayout
                title="Local Claims"
                description="View, edit and add the local claims"
                showBottomDivider={ true }
                backButton={ {
                    onClick: () => { history.push(CLAIM_DIALECTS_PATH) },
                    text: "Go back to Claim Dialects"
                } }
            >
                <ListLayout
                    advancedSearch={
                        <LocalClaimsSearch
                            onFilter={ (query) => {
                                //TODO: getLocalClaims(null, null, null, query);
                                try {
                                    const filteredClaims = filterList(
                                        claims, query, sortBy.value as string, sortOrder
                                    );
                                    setFilteredClaims(filteredClaims);
                                } catch (error) {
                                    dispatch(addAlert({
                                        description: error?.message,
                                        level: AlertLevels.ERROR,
                                        message: "Filter query format incorrect"
                                    }));
                                }
                            } }
                            claimURIBase={ claimURIBase }
                        />
                    }
                    currentListSize={ listItemLimit }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ handleSortStrategyChange }
                    rightActionPanel={
                        appConfig?.claimDialects?.features?.localClaims?.permissions?.create && (
                            <PrimaryButton
                                onClick={ () => {
                                    setOpenModal(true);
                                } }
                            >
                                <Icon name="add" />Add a Local Claim
                            </PrimaryButton>
                        )
                    }
                    leftActionPanel={ null }
                    showPagination={ true }
                    sortOptions={ SORT_BY }
                    sortStrategy={ sortBy }
                    totalPages={ Math.ceil(filteredClaims?.length / listItemLimit) }
                    totalListSize={ filteredClaims?.length }
                    onSortOrderChange={ handleSortOrderChange }
                >
                    <ClaimsList
                        list={ paginate(filteredClaims, listItemLimit, offset) }
                        localClaim={ ListType.LOCAL }
                        update={ getLocalClaims }
                    />
                </ListLayout>
            </PageLayout>
        </>
    );
};
