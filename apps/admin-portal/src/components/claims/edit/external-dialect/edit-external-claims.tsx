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

import { AlertLevels, ClaimDialect, ExternalClaim } from "../../../../models";
import { ClaimsList, ExternalClaimsSearch, ListType } from "../../..";
import { Divider, DropdownProps, PaginationProps } from "semantic-ui-react";
import { filterList, sortList } from "../../../../utils";
import { getADialect, getAllExternalClaims } from "../../../../api";
import React, { ReactElement, useEffect, useState } from "react";
import { addAlert } from "@wso2is/core/store";
import { AddExternalClaims } from "../../add";
import { UserConstants } from "../../../../constants";
import { EmptyPlaceholder } from "../../../shared";
import { EmptyPlaceholderIllustrations } from "../../../../configs";
import { ListLayout } from "../../../../layouts";
import { useDispatch } from "react-redux";

interface EditExternalClaimsPropsInterface {
    /**
     * Dialect ID
     */
    dialectID: string;
}

/**
 * This lists the external claims.
 *
 * @param {EditExternalClaimsPropsInterface} props.
 *
 * @return {ReactElement}
 */
export const EditExternalClaims = (props: EditExternalClaimsPropsInterface): ReactElement => {

    /**
     * Attributes to sort the list by
     */
    const SORT_BY = [
        {
            key: 0,
            text: "Claim URI",
            value: "claimURI"
        },
        {
            key: 1,
            text: "Mapped Local Claim URI",
            value: "mappedLocalClaimURI"
        }
    ];

    const [ claims, setClaims ] = useState<ExternalClaim[]>(null);
    const [ offset, setOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ dialect, setDialect ] = useState<ClaimDialect>(null);
    const [ filteredClaims, setFilteredClaims ] = useState<ExternalClaim[]>(null);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(true);

    const dispatch = useDispatch();

    const { dialectID } = props;

    useEffect(() => {
        setListItemLimit(UserConstants.DEFAULT_USER_LIST_ITEM_LIMIT);
        setIsLoading(true);

        getADialect(dialectID).then(response => {
            setDialect(response);
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while fetching local dialect",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        });

    }, []);

    /**
     * Fetch external claims.
     *
     * @param {number} limit.
     * @param {number} offset.
     * @param {string} sort.
     * @param {string} filter.
     */
    const getExternalClaims = (limit?: number, offset?: number, sort?: string, filter?: string) => {
        dialectID && getAllExternalClaims(dialectID, {
            filter,
            limit,
            offset,
            sort
        }).then(response => {
            setClaims(response);
            setFilteredClaims(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while fetching the external claims",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        });
    }

    useEffect(() => {
        getExternalClaims();
    }, [ dialectID ]);

    useEffect(() => {
        setFilteredClaims(sortList(filteredClaims, sortBy.value, sortOrder));
    }, [ sortBy, sortOrder ]);

    /**
     * Slices and returns a portion of the list.
     *
     * @param {ExternalClaim[]} list.
     * @param {number} limit.
     * @param {number} offset.
     * 
     * @return {ExternalClaim[]}
     */
    const paginate = (list: ExternalClaim[], limit: number, offset: number): ExternalClaim[] => {
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
        setSortBy(SORT_BY.filter(option => option.value === data.value)[ 0 ]);
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
            <AddExternalClaims dialect={ dialect } update={ () => { getExternalClaims(null) } } />
            <Divider hidden/>
            {
                claims?.length > 0
                    ? (
                        <ListLayout
                            advancedSearch={ <ExternalClaimsSearch onFilter={ (query) => {
                                //TODO: getExternalClaims(null, null, null, query);
                                try {
                                    const filteredList: ExternalClaim[] = filterList(
                                        claims, query, sortBy.value, sortOrder
                                    );
                                    setFilteredClaims(filteredList);
                                } catch (error) {
                                    dispatch(addAlert({
                                        description: error?.message,
                                        level: AlertLevels.ERROR,
                                        message: "Filter query format incorrect"
                                    }));
                                }
                            } } /> }
                            currentListSize={ listItemLimit }
                            listItemLimit={ listItemLimit }
                            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                            onPageChange={ handlePaginationChange }
                            onSortStrategyChange={ handleSortStrategyChange }
                            onSortOrderChange={ handleSortOrderChange }
                            showPagination={ true }
                            sortOptions={ SORT_BY }
                            sortStrategy={ sortBy }
                            totalPages={ Math.ceil(filteredClaims?.length / listItemLimit) }
                            totalListSize={ filteredClaims?.length }
                        >
                            <ClaimsList
                                list={ paginate(filteredClaims, listItemLimit, offset) }
                                localClaim={ ListType.EXTERNAL }
                                update={ getExternalClaims }
                                dialectID={ dialectID }
                            />
                        </ListLayout>
                    )
                    : !isLoading && (
                        <EmptyPlaceholder
                            title="No External Claim"
                            subtitle={ [ "Currently, there is no external claim available for this dialect." ] }
                            image={ EmptyPlaceholderIllustrations.emptyList }
                            imageSize="tiny"
                        />
                    )
            }
        </>
    );
};
