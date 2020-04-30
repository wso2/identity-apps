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
import { useTrigger } from "@wso2is/forms";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, DropdownProps, Grid, Icon, Modal, PaginationProps } from "semantic-ui-react";
import { AddExternalClaims, ClaimsList, ListType } from "../../..";
import { EmptyPlaceholderIllustrations } from "../../../../configs";
import { UserConstants } from "../../../../constants";
import { ListLayout } from "../../../../layouts";
import { AlertLevels, ExternalClaim } from "../../../../models";
import { filterList, sortList } from "../../../../utils";
import { EmptyPlaceholder } from "../../../shared";
import { AdvancedSearchWithBasicFilters } from "../../../shared/advanced-search-with-basic-filters";

interface EditExternalClaimsPropsInterface {
    /**
     * Dialect ID
     */
    dialectID: string;
    /**
     * The list of external claims.
     */
    claims: ExternalClaim[];
    /**
     * Triggers an update.
     */
    update: () => void;
    /**
     * Sets to true if the list is being loaded.
     */
    isLoading: boolean;
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

    const [ offset, setOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ filteredClaims, setFilteredClaims ] = useState<ExternalClaim[]>([]);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ showAddExternalClaim, setShowAddExternalClaim ] = useState(false);
    const [ query, setQuery ] = useState("");

    const [ triggerAddExternalClaim, setTriggerAddExternalClaim ] = useTrigger();

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { dialectID, claims, update, isLoading } = props;

    useEffect(() => {
        setListItemLimit(UserConstants.DEFAULT_USER_LIST_ITEM_LIMIT);
    }, []);

    useEffect(() => {
        if (claims) {
            setFilteredClaims(claims);
        }
    }, [ claims ]);

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

    /**
     * Handles the `onFilter` callback action from the
     * advanced search component.
     *
     * @param {string} query - Search query.
     */
    const handleExternalClaimFilter = (query: string): void => {
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
    };

    return (
        <ListLayout
            advancedSearch={ <AdvancedSearchWithBasicFilters
                                    onFilter={ handleExternalClaimFilter  }
                                    filterAttributeOptions={ [
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
                                    ] }
                                    filterAttributePlaceholder={
                                        t("devPortal:components.claims.external.advancedSearch.form.inputs" +
                                            ".filterAttribute.placeholder")
                                    }
                                    filterConditionsPlaceholder={
                                        t("devPortal:components.claims.external.advancedSearch.form.inputs" +
                                            ".filterCondition.placeholder")
                                    }
                                    filterValuePlaceholder={
                                        t("devPortal:components.claims.external.advancedSearch.form.inputs" +
                                            ".filterValue.placeholder")
                                    }
                                    placeholder={ t("devPortal:components.claims.external.advancedSearch.placeholder") }
                                    defaultSearchAttribute="claimURI"
                                    defaultSearchOperator="co"
                                /> }
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
            rightActionPanel={
                <PrimaryButton
                    onClick={ (): void => {
                        setShowAddExternalClaim(true);
                    } }
                    disabled={ showAddExternalClaim }
                >
                    <Icon name="add" />
                            New External Claim
                        </PrimaryButton>
            }
        >
            {
                showAddExternalClaim && (
                    <Modal
                        open={ showAddExternalClaim }
                        onClose={ () => { setShowAddExternalClaim(false) } }
                        dimmer="blurring"
                        size="small"
                    >
                        <Modal.Header>
                            Add External Claim
                        </Modal.Header>
                        <Modal.Content>
                            <AddExternalClaims
                                dialectId={ dialectID }
                                update={ update }
                                externalClaims={ claims }
                                triggerSubmit={ triggerAddExternalClaim }
                                cancel={ () => { setShowAddExternalClaim(false) } }
                            />
                        </Modal.Content>
                        <Modal.Actions>
                            <LinkButton onClick={ () => { setShowAddExternalClaim(false) } }>
                                Cancel
                                    </LinkButton>
                            <PrimaryButton
                                onClick={ () => {
                                    setTriggerAddExternalClaim();
                                }
                                }
                            >
                                Save
                                    </PrimaryButton>
                        </Modal.Actions>
                    </Modal>
                )
            }
            <Grid columns={ 1 }>
                <Grid.Column width={ 16 }>
                    <Divider hidden />
                    {
                        filteredClaims?.length > 0
                            ? (
                                <ClaimsList
                                    list={ paginate(filteredClaims, listItemLimit, offset) }
                                    localClaim={ ListType.EXTERNAL }
                                    update={ () => update() }
                                    dialectID={ dialectID }
                                />
                            ) : !isLoading &&
                                (claims && claims?.length !== 0 && filteredClaims?.length === 0)
                                ? (
                                    <EmptyPlaceholder
                                        action={ (
                                            <LinkButton onClick={ () => {
                                                setFilteredClaims(claims);
                                            } }
                                            >
                                                Clear search query
                                            </LinkButton>
                                        ) }
                                        image={ EmptyPlaceholderIllustrations.emptySearch }
                                        imageSize="tiny"
                                        title={ "No results found" }
                                        subtitle={ [
                                            `We couldn't find any results for "${query}"`,
                                            "Please try a different search term."
                                        ] }
                                    />
                                )
                                : !isLoading && (
                                    <EmptyPlaceholder
                                        title="No External Claim"
                                        subtitle={ [ "Currently, there is no external claim " +
                                            "available for this dialect." ] }
                                        image={ EmptyPlaceholderIllustrations.emptyList }
                                        imageSize="tiny"
                                    />
                                )
                    }
                </Grid.Column>
            </Grid>
        </ListLayout>
    )
};

EditExternalClaims.defaultProps = {
    isLoading: true
};
