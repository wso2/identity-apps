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

import { getDialects } from "@wso2is/core/api";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, ClaimDialect, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { AnimatedAvatar, EmphasizedSegment, ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, DropdownProps, Grid, Icon, Image, List, PaginationProps, Popup } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    filterList,
    history,
    sortList
} from "../../core";
import { AddDialect, ClaimsList, ListType } from "../components";

/**
 * Props for the Claim Dialects page.
 */
type ClaimDialectsPageInterface = TestableComponentInterface

/**
 * This displays a list fo claim dialects.
 *
 * @param {ClaimDialectsPageInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
const ClaimDialectsPage: FunctionComponent<ClaimDialectsPageInterface> = (
    props: ClaimDialectsPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Sets the attributes by which the list can be sorted.
     */
    const SORT_BY = [
        {
            key: 0,
            text: t("console:manage.features.claims.dialects.attributes.dialectURI"),
            value: "dialectURI"
        }
    ];

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ dialects, setDialects ] = useState<ClaimDialect[]>(null);
    const [ offset, setOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ addEditClaim, setAddEditClaim ] = useState(false);
    const [ filteredDialects, setFilteredDialects ] = useState<ClaimDialect[]>(null);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ localURI, setLocalURI ] = useState("");
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ isLoading, setIsLoading ] = useState(true);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const [ resetPagination, setResetPagination ] = useTrigger();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const dispatch = useDispatch();

    /**
     * Fetches all the dialects.
     *
     * @param {number} limit.
     * @param {number} offset.
     * @param {string} sort.
     * @param {string} filter.
     */
    const getDialect = (limit?: number, offset?: number, sort?: string, filter?: string): void => {
        setIsLoading(true);
        getDialects({
            filter,
            limit,
            offset,
            sort
        }).then((response: ClaimDialect[]) => {
            const filteredDialect: ClaimDialect[] = response.filter((claim: ClaimDialect) => {
                if (claim.id === "local") {
                    setLocalURI(claim.dialectURI);
                }
                return claim.id !== "local";
            });

            setDialects(filteredDialect);
            setFilteredDialects(filteredDialect);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.response?.data?.description
                        || t("console:manage.features.claims.dialects.notifications.fetchDialects" +
                            ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("console:manage.features.claims.dialects.notifications.fetchDialects" +
                            ".genericError.message")
                }
            ));
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        getDialect();
    }, []);

    useEffect(() => {
        setFilteredDialects(sortList(filteredDialects, sortBy.value, sortOrder));
    }, [ sortBy, sortOrder ]);

    /**
     * This slices a portion of the list to display.
     *
     * @param {ClaimDialect[]} list.
     * @param {number} limit.
     * @param {number} offset.
     *
     * @return {ClaimDialect[]} Paginated List.
     */
    const paginate = (list: ClaimDialect[], limit: number, offset: number): ClaimDialect[] => {
        return list?.slice(offset, offset + limit);
    };

    /**
     * Handles change in the number of items to show.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event.
     * @param {data} data.
     */
    const handleItemsPerPageDropdownChange = (
        event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps
    ): void => {
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
     * dialect search component.
     *
     * @param {string} query - Search query.
     */
    const handleDialectFilter = (query: string): void => {
        const filteredDialects = filterList(dialects, query, sortBy.value, sortOrder);
        setFilteredDialects(filteredDialects);
        setSearchQuery(query);
        setOffset(0);
        setResetPagination();

    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setFilteredDialects(dialects);
    };

    return (
        <>
            { addEditClaim &&
                (
                    <AddDialect
                        open={ addEditClaim }
                        onClose={ () => {
                            setAddEditClaim(false);
                        } }
                        update={ getDialect }
                        data-testid={ `${ testId }-add-dialect-wizard` }
                    />
                )
            }
            <PageLayout
                action={
                    (isLoading || !(!searchQuery && filteredDialects?.length <= 0))
                    && (
                        <PrimaryButton
                            onClick={ () => {
                                setAddEditClaim(true);
                            } }
                            data-testid={ `${ testId }-list-layout-add-button` }
                        >
                            <Icon name="add"/>
                            { t("console:manage.features.claims.dialects.pageLayout.list.primaryAction") }
                        </PrimaryButton>
                    )
                }
                isLoading={ isLoading }
                title={ t("console:manage.features.claims.dialects.pageLayout.list.title") }
                description={ t("console:manage.features.claims.dialects.pageLayout.list.description") }
                data-testid={ `${ testId }-page-layout` }
            >
                {
                    hasRequiredScopes(
                        featureConfig?.attributeDialects,
                        featureConfig?.attributeDialects?.scopes?.read,
                        allowedScopes) && (
                        <EmphasizedSegment data-testid={ `${ testId }-local-dialect-container` } >
                            <List>
                                <List.Item>
                                    <Grid>
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 12 }>
                                                <Image
                                                    floated="left"
                                                    verticalAlign="middle"
                                                    rounded
                                                    centered
                                                    size="mini"
                                                >
                                                    <AnimatedAvatar primary />
                                                    <span className="claims-letter">
                                                        L
                                                    </span>
                                                </Image>
                                                <List.Header>
                                                    { t("console:manage.features.claims.dialects.localDialect") }
                                                </List.Header>
                                                <List.Description data-testid={ `${ testId }-local-dialect` }>
                                                    { localURI }
                                                </List.Description>
                                            </Grid.Column>
                                            <Grid.Column width={ 4 } verticalAlign="middle" textAlign="right">
                                                <Popup
                                                    inverted
                                                    trigger={
                                                        <span
                                                            className="local-dialect-direct"
                                                            onClick={ () => {
                                                                history.push(
                                                                    AppConstants.getPaths().get("LOCAL_CLAIMS")
                                                                );
                                                            } }
                                                            data-testid={ `${ testId }-local-dialect-view-button` }
                                                        >
                                                            <Icon
                                                                name="arrow right"
                                                            />
                                                        </span>
                                                    }
                                                    position="top center"
                                                    content={ t("console:manage.features.claims.dialects" +
                                                        ".pageLayout.list.view") }
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </List.Item>
                            </List>
                        </EmphasizedSegment>
                    )
                }
                <Divider hidden />
                <ListLayout
                    advancedSearch={
                        <AdvancedSearchWithBasicFilters
                            onFilter={ handleDialectFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t("console:manage.features.claims.dialects.attributes.dialectURI"),
                                    value: "dialectURI"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("console:manage.features.claims.dialects.advancedSearch.form.inputs.filterAttribute" +
                                    ".placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("console:manage.features.claims.dialects.advancedSearch.form.inputs.filterCondition" +
                                    ".placeholder")
                            }
                            filterValuePlaceholder={
                                t("console:manage.features.claims.dialects.advancedSearch.form.inputs.filterValue" +
                                    ".placeholder")
                            }
                            placeholder={ t("console:manage.features.claims.dialects.advancedSearch.placeholder") }
                            defaultSearchAttribute="dialectURI"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                            data-testid={ `${ testId }-advanced-search` }
                        />
                    }
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
                    showTopActionPanel={ isLoading || !(!searchQuery && filteredDialects?.length <= 0) }
                    totalPages={ Math.ceil(filteredDialects?.length / listItemLimit) }
                    totalListSize={ filteredDialects?.length }
                >
                    <ClaimsList
                        advancedSearch={
                            <AdvancedSearchWithBasicFilters
                                onFilter={ handleDialectFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: t("console:manage.features.claims.dialects.attributes.dialectURI"),
                                        value: "dialectURI"
                                    }
                                ] }
                                filterAttributePlaceholder={
                                    t("console:manage.features.claims.dialects.advancedSearch.form.inputs" +
                                        ".filterAttribute.placeholder")
                                }
                                filterConditionsPlaceholder={
                                    t("console:manage.features.claims.dialects.advancedSearch.form.inputs" +
                                        ".filterCondition.placeholder")
                                }
                                filterValuePlaceholder={
                                    t("console:manage.features.claims.dialects.advancedSearch.form.inputs" +
                                        ".filterValue.placeholder")
                                }
                                placeholder={
                                    t("console:manage.features.claims.dialects.advancedSearch.placeholder")
                                }
                                defaultSearchAttribute="dialectURI"
                                defaultSearchOperator="co"
                                triggerClearQuery={ triggerClearQuery }
                                data-testid={ `${ testId }-advanced-search` }
                            />
                        }
                        isLoading={ isLoading }
                        list={ paginate(filteredDialects, listItemLimit, offset) }
                        localClaim={ ListType.DIALECT }
                        update={ getDialect }
                        onEmptyListPlaceholderActionClick={ () => setAddEditClaim(true) }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                        data-testid={ `${ testId }-list` }
                    />
                </ListLayout>
            </PageLayout>
        </>
    );
};

/**
 * Default props for the component.
 */
ClaimDialectsPage.defaultProps = {
    "data-testid": "attribute-dialects"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ClaimDialectsPage;
