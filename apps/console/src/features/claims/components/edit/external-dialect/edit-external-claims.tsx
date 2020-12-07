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

import { AlertLevels, ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { LinkButton, ListLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, DropdownProps, Grid, Icon, Modal, PaginationProps } from "semantic-ui-react";
import { AddExternalClaims, ClaimsList, ListType } from "../../";
import { AdvancedSearchWithBasicFilters, UIConstants, filterList, sortList } from "../../../../core";

interface EditExternalClaimsPropsInterface extends TestableComponentInterface {
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
 * @param {EditExternalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const EditExternalClaims: FunctionComponent<EditExternalClaimsPropsInterface> = (
    props: EditExternalClaimsPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Attributes to sort the list by
     */
    const SORT_BY = [
        {
            key: 0,
            text: t("console:manage.features.claims.external.attributes.attributeURI"),
            value: "claimURI"
        },
        {
            key: 1,
            text: t("console:manage.features.claims.external.attributes.mappedClaim"),
            value: "mappedLocalClaimURI"
        }
    ];

    const [ offset, setOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ filteredClaims, setFilteredClaims ] = useState<ExternalClaim[]>([]);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ showAddExternalClaim, setShowAddExternalClaim ] = useState(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const [ triggerAddExternalClaim, setTriggerAddExternalClaim ] = useTrigger();
    const [ resetPagination, setResetPagination ] = useTrigger();

    const dispatch = useDispatch();

    const { dialectID, claims, update, isLoading } = props;

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
            setSearchQuery(query);
            setOffset(0);
            setResetPagination();
        } catch (error) {
            dispatch(addAlert({
                description: error?.message,
                level: AlertLevels.ERROR,
                message: t("console:manage.features.claims.external.advancedSearch.error")
            }));
        }
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setFilteredClaims(claims);
    };

    return (
        <ListLayout
            advancedSearch={ (
                <AdvancedSearchWithBasicFilters
                    onFilter={ handleExternalClaimFilter }
                    filterAttributeOptions={ [
                        {
                            key: 0,
                            text: t("console:manage.features.claims.external.attributes.attributeURI"),
                            value: "claimURI"
                        },
                        {
                            key: 1,
                            text: t("console:manage.features.claims.external.attributes.mappedClaim"),
                            value: "mappedLocalClaimURI"
                        }
                    ] }
                    filterAttributePlaceholder={
                        t("console:manage.features.claims.external.advancedSearch.form.inputs" +
                            ".filterAttribute.placeholder")
                    }
                    filterConditionsPlaceholder={
                        t("console:manage.features.claims.external.advancedSearch.form.inputs" +
                            ".filterCondition.placeholder")
                    }
                    filterValuePlaceholder={
                        t("console:manage.features.claims.external.advancedSearch.form.inputs" +
                            ".filterValue.placeholder")
                    }
                    placeholder={ t("console:manage.features.claims.external.advancedSearch.placeholder") }
                    defaultSearchAttribute="claimURI"
                    defaultSearchOperator="co"
                    triggerClearQuery={ triggerClearQuery }
                    data-testid={ `${ testId }-list-advanced-search` }
                />
            ) }
            currentListSize={ listItemLimit }
            listItemLimit={ listItemLimit }
            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
            onPageChange={ handlePaginationChange }
            onSortStrategyChange={ handleSortStrategyChange }
            onSortOrderChange={ handleSortOrderChange }
            resetPagination={ resetPagination }
            showPagination={ true }
            sortOptions={ SORT_BY }
            sortStrategy={ sortBy }
            showTopActionPanel={ isLoading || !(!searchQuery && filteredClaims?.length <= 0) }
            totalPages={ Math.ceil(filteredClaims?.length / listItemLimit) }
            totalListSize={ filteredClaims?.length }
            rightActionPanel={
                <PrimaryButton
                    onClick={ (): void => {
                        setShowAddExternalClaim(true);
                    } }
                    disabled={ showAddExternalClaim }
                    data-testid={ `${ testId }-list-layout-add-button` }
                >
                    <Icon name="add" />
                    { t("console:manage.features.claims.external.pageLayout.edit.primaryAction") }
                </PrimaryButton>
            }
            data-testid={ `${ testId }-list-layout` }
        >
            {
                showAddExternalClaim && (
                    <Modal
                        open={ showAddExternalClaim }
                        onClose={ () => { setShowAddExternalClaim(false); } }
                        dimmer="blurring"
                        size="small"
                        data-testid={ `${ testId }-add-external-claim-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <Modal.Header>
                            { t("console:manage.features.claims.external.pageLayout.edit.header") }
                        </Modal.Header>
                        <Modal.Content>
                            <AddExternalClaims
                                dialectId={ dialectID }
                                update={ update }
                                externalClaims={ claims }
                                triggerSubmit={ triggerAddExternalClaim }
                                cancel={ () => { setShowAddExternalClaim(false); } }
                                data-testid={ `${ testId }-add-external-claims` }
                            />
                        </Modal.Content>
                        <Modal.Actions>
                            <LinkButton
                                onClick={ () => { setShowAddExternalClaim(false); } }
                                data-testid={ `${ testId }-add-external-claim-modal-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                            <PrimaryButton
                                onClick={ () => {
                                    setTriggerAddExternalClaim();
                                } }
                                data-testid={ `${ testId }-add-external-claim-modal-save-button` }
                            >
                                { t("common:save") }
                            </PrimaryButton>
                        </Modal.Actions>
                    </Modal>
                )
            }
            <Grid columns={ 1 }>
                <Grid.Column width={ 16 }>
                    <Divider hidden />
                    <ClaimsList
                        advancedSearch={ (
                            <AdvancedSearchWithBasicFilters
                                onFilter={ handleExternalClaimFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: t("console:manage.features.claims.external.attributes.attributeURI"),
                                        value: "claimURI"
                                    },
                                    {
                                        key: 1,
                                        text: t("console:manage.features.claims.external.attributes.mappedClaim"),
                                        value: "mappedLocalClaimURI"
                                    }
                                ] }
                                filterAttributePlaceholder={
                                    t("console:manage.features.claims.external.advancedSearch.form.inputs" +
                                        ".filterAttribute.placeholder")
                                }
                                filterConditionsPlaceholder={
                                    t("console:manage.features.claims.external.advancedSearch.form.inputs" +
                                        ".filterCondition.placeholder")
                                }
                                filterValuePlaceholder={
                                    t("console:manage.features.claims.external.advancedSearch.form.inputs" +
                                        ".filterValue.placeholder")
                                }
                                placeholder={ t("console:manage.features.claims.external.advancedSearch.placeholder") }
                                defaultSearchAttribute="claimURI"
                                defaultSearchOperator="co"
                                triggerClearQuery={ triggerClearQuery }
                                data-testid={ `${ testId }-list-advanced-search` }
                            />
                        ) }
                        isLoading={ isLoading }
                        list={ paginate(filteredClaims, listItemLimit, offset) }
                        localClaim={ ListType.EXTERNAL }
                        update={ () => update() }
                        dialectID={ dialectID }
                        onEmptyListPlaceholderActionClick={ () => setShowAddExternalClaim(true) }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                        data-testid={ `${ testId }-list` }
                    />
                </Grid.Column>
            </Grid>
        </ListLayout>
    );
};

/**
 * Default props for the component.
 */
EditExternalClaims.defaultProps = {
    "data-testid": "edit-external-claims",
    isLoading: true
};
