/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";

import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    filterList,
    history,
    sortList
} from "../../../../features/core";
import { QueryParams, UserStoreListItem } from "../../../../features/userstores";
import { getUserStores } from "../../../../features/userstores/api";
import { UserStoresList } from "../../../../features/userstores/components";
import { RemoteUserStoreConstants } from "../constants";

/**
 * Props for the Userstore page.
 */
type UserStoresPageInterface = TestableComponentInterface;

/**
 * This renders the Userstores page.
 *
 * @param {UserStoresPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const UserStores: FunctionComponent<UserStoresPageInterface> = (
    props: UserStoresPageInterface
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
            text: t("common:name"),
            value: "name"
        },
        {
            key: 1,
            text: t("common:description"),
            value: "description"
        }
    ];

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ userStores, setUserStores ] = useState<UserStoreListItem[]>([]);
    const [ offset, setOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ filteredUserStores, setFilteredUserStores ] = useState<UserStoreListItem[]>([]);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const dispatch = useDispatch();

    const [ resetPagination, setResetPagination ] = useTrigger();

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
            filter: filter || null,
            limit: limit || null,
            offset: offset || null,
            sort: sort || null
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
                    description: error?.description
                        || t("console:manage.features.userstores.notifications.fetchUserstores.genericError" +
                            ".description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("console:manage.features.userstores.notifications.fetchUserstores.genericError.message")
                }
            ));
        });
    };

    useEffect(() => {
        fetchUserStores(null, null, null, null);
    }, []);

    useEffect(() => {
        setFilteredUserStores((sortList(filteredUserStores, sortBy.value, sortOrder)));
    }, [ sortBy, sortOrder ]);

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
        setSortBy(SORT_BY.filter(option => option.value === data.value)[ 0 ]);
    };

    /**
     * Handles the `onFilter` callback action from the search component.
     *
     * @param {string} query - Search query.
     */
    const handleUserstoreFilter = (query: string): void => {
        // TODO: Implement once the API is ready
        // fetchUserStores(null, null, null, query);
        setFilteredUserStores(filterList(userStores, query, "name", true));
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
        setFilteredUserStores(userStores);
    };

    return (
        <PageLayout
            action={
                (isLoading || !(!searchQuery && filteredUserStores?.length <= 0) && userStores?.length < 2)
                && (
                    <PrimaryButton
                        data-testid={ `${ testId }-add-user-store-button` }
                        onClick={ () => {
                            history.push(RemoteUserStoreConstants.getPaths().get("REMOTE_USER_STORE_CREATE"));
                        } }
                    >
                        <Icon name="add"/>
                        { t("extensions:manage.features.userStores.create.pageLayout.actions.connectUserStore") }
                    </PrimaryButton>
                )
            }
            isLoading={ isLoading }
            title={ t("extensions:manage.features.userStores.list.title") }
            description={ t("extensions:manage.features.userStores.list.subTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            <ListLayout
                advancedSearch={
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleUserstoreFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "name"
                            },
                            {
                                key: 1,
                                text: t("common:description"),
                                value: "description"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("console:manage.features.userstores.advancedSearch.form.inputs" +
                                ".filterAttribute.placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("console:manage.features.userstores.advancedSearch.form.inputs" +
                                ".filterCondition.placeholder")
                        }
                        filterValuePlaceholder={
                            t("console:manage.features.userstores.advancedSearch.form.inputs" +
                                ".filterValue.placeholder")
                        }
                        placeholder={
                            t("console:manage.features.userstores.advancedSearch.placeholder")
                        }
                        defaultSearchAttribute="name"
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
                leftActionPanel={ null }
                showPagination={ true }
                sortOptions={ SORT_BY }
                sortStrategy={ sortBy }
                showTopActionPanel={ isLoading || !(!searchQuery && filteredUserStores?.length <= 0) }
                totalPages={ Math.ceil(filteredUserStores?.length / listItemLimit) }
                totalListSize={ filteredUserStores?.length }
                data-testid={ `${ testId }-list-layout` }
            >
                <UserStoresList
                    advancedSearch={
                        <AdvancedSearchWithBasicFilters
                            onFilter={ handleUserstoreFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t("common:name"),
                                    value: "name"
                                },
                                {
                                    key: 1,
                                    text: t("common:description"),
                                    value: "description"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("console:manage.features.userstores.advancedSearch.form.inputs" +
                                    ".filterAttribute.placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("console:manage.features.userstores.advancedSearch.form.inputs" +
                                    ".filterCondition.placeholder")
                            }
                            filterValuePlaceholder={
                                t("console:manage.features.userstores.advancedSearch.form.inputs" +
                                    ".filterValue.placeholder")
                            }
                            placeholder={
                                t("console:manage.features.userstores.advancedSearch.placeholder")
                            }
                            defaultSearchAttribute="name"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                            data-testid={ `${ testId }-advanced-search` }
                        />
                    }
                    isLoading={ isLoading }
                    list={ paginate(filteredUserStores, listItemLimit, offset) }
                    onEmptyListPlaceholderActionClick={
                        () => history.push(AppConstants.getPaths().get("REMOTE_USER_STORE_CREATE"))
                    }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    update={ fetchUserStores }
                    featureConfig={ featureConfig }
                    data-testid={ `${ testId }-list` }
                />
            </ListLayout>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
UserStores.defaultProps = {
    "data-testid": "userstores"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default UserStores;
