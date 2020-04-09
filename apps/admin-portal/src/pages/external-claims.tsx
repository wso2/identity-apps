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

import { AddExternalClaims, ClaimsList, EditExternalClaims, ExternalClaimsSearch, ListType } from "../components";
import { AlertLevels, AppConfigInterface, ClaimDialect, ExternalClaim } from "../models";
import { AppConfig, history } from "../helpers";
import { CLAIM_DIALECTS_PATH, UserConstants } from "../constants";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { filterList, sortList } from "../utils";
import { getADialect, getAllExternalClaims } from "../api";
import React, { useContext, useEffect, useState } from "react";

import { addAlert } from "../store/actions";
import { EmptyPlaceholder } from "../components/shared";
import { EmptyPlaceholderIllustrations } from "../configs";
import { ListLayout } from "../layouts";
import { PageLayout } from "../layouts";
import { PrimaryButton } from "@wso2is/react-components";
import { useDispatch } from "react-redux";

/**
 * This lists the external claims.
 *
 * @param props.
 *
 * @return {React.ReactElement}
 */
export const ExternalClaimsPage = (props): React.ReactElement => {

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
    const [ addClaim, setAddClaim ] = useState(false);
    const [ editClaim, setEditClaim ] = useState(false);
    const [ editClaimID, setEditClaimID ] = useState("");
    const [ filteredClaims, setFilteredClaims ] = useState<ExternalClaim[]>(null);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(false);

    const dispatch = useDispatch();

    const appConfig: AppConfigInterface = useContext(AppConfig);

    const dialectID = props.match.params.id;

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
            { addClaim
                ? <AddExternalClaims
                    open={ addClaim }
                    onClose={ () => { setAddClaim(false) } }
                    dialect={ dialect }
                    update={ getExternalClaims }
                />
                : null
            }
            {
                editClaim
                    ? <EditExternalClaims
                        open={ editClaim }
                        onClose={ () => {
                            setEditClaim(false);
                            setEditClaimID("");
                        } }
                        update={ getExternalClaims }
                        claimID={ editClaimID }
                        dialectID={ dialect?.id }
                    />
                    : null
            }
            <PageLayout
                title="External Claims"
                description={ "View, edit and add claims of " + dialect?.dialectURI }
                showBottomDivider={ true }
                backButton={ {
                    onClick: () => { history.push(CLAIM_DIALECTS_PATH) },
                    text: "Go back to Claim Dialects"
                } }
            >
                { claims?.length > 0
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
                            rightActionPanel={
                                appConfig?.claimDialects?.features?.externalClaims?.permissions?.create && (
                                    <PrimaryButton
                                        onClick={ () => {
                                            setAddClaim(true);
                                        } }
                                    >
                                        <Icon name="add" />Add a claim
                                    </PrimaryButton>
                                )
                            }
                            showPagination={ true }
                            sortOptions={ SORT_BY }
                            sortStrategy={ sortBy }
                            totalPages={ Math.ceil(filteredClaims?.length / listItemLimit) }
                            totalListSize={ filteredClaims?.length }
                        >
                            <ClaimsList
                                list={ paginate(filteredClaims, listItemLimit, offset) }
                                localClaim={ ListType.EXTERNAL }
                                openEdit={ (claimID: string) => {
                                    setEditClaim(true);
                                    setEditClaimID(claimID);
                                } }
                                update={ getExternalClaims }
                                dialectID={ dialectID }
                            />
                        </ListLayout>
                    )
                    : !isLoading && (
                        <EmptyPlaceholder
                            action={
                                <PrimaryButton
                                    onClick={ () => {
                                        setAddClaim(true);
                                    } }
                                >
                                    <Icon name="add" /> Add an External Claim
                                </PrimaryButton>
                            }
                            title="Create an External Claim"
                            subtitle={ [ "Currently, there is no External Claim available for this dialect." ] }
                            image={ EmptyPlaceholderIllustrations.emptyList }
                            imageSize="tiny"
                        />
                    ) }
            </PageLayout>
        </>
    );
};
