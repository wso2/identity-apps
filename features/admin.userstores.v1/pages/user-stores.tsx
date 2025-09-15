/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { Show } from "@wso2is/access-control";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { filterList } from "@wso2is/admin.core.v1/utils/filter-list";
import { sortList } from "@wso2is/admin.core.v1/utils/sort-list";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { RemoteUserStoreConstants } from "@wso2is/admin.remote-userstores.v1/constants/remote-user-stores-constants";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { useGetUserStores } from "../api/use-get-user-stores";
import { UserStoresList } from "../components";
import { UserStoreManagementConstants, UserStoreTypes } from "../constants";
import { UserStoreListItem } from "../models";

/**
 * Props for the Userstore page.
 */
type UserStoresPageInterface = TestableComponentInterface;

/**
 * This renders the Userstores page.
 *
 * @param props - Props injected to the component.
 *
 * @returns User Stores page.
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
    const SORT_BY: {
        key: number;
        text: string;
        value: string;
    }[] = [
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

    const [ userStores, setUserStores ] = useState<UserStoreListItem[]>([]);
    const [ offset, setOffset ] = useState(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ filteredUserStores, setFilteredUserStores ] = useState<UserStoreListItem[]>([]);
    const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const disabledFeatures: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.features?.userStores?.disabledFeatures);
    const systemReservedUserStores: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.systemReservedUserStores);

    const dispatch: Dispatch = useDispatch();

    const [ resetPagination, setResetPagination ] = useTrigger();

    const {
        data: fetchedUserStores,
        isLoading: isUserStoreGetRequestLoading,
        error: userStoreGetRequestError,
        mutate: fetchUserStores
    } = useGetUserStores(null, null, null, null);

    useEffect(() => {
        if (fetchedUserStores?.length > 0) {
            const visibleUserStores: UserStoreListItem[] = fetchedUserStores.filter(
                (userStore: UserStoreListItem) =>
                    !systemReservedUserStores?.includes(userStore?.name)
            );

            setUserStores(visibleUserStores);
            setFilteredUserStores(visibleUserStores);
        }
    }, [ fetchedUserStores ]);

    useEffect(() => {
        if (userStoreGetRequestError) {
            dispatch(addAlert(
                {
                    description: userStoreGetRequestError?.name
                        || t("userstores:notifications.fetchUserstores.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: userStoreGetRequestError?.message
                        || t("userstores:notifications.fetchUserstores.genericError.message")
                }
            ));
        }
    }, [ userStoreGetRequestError ]);

    useEffect(() => {
        setFilteredUserStores((sortList(filteredUserStores, sortBy.value, sortOrder)));
    }, [ sortBy, sortOrder ]);

    /**
     * This slices and returns a portion of the list.
     *
     * @param list - List to be paginated.
     * @param limit - Limit per page.
     * @param offset - Offset value.
     *
     * @returns Paginated list.
     */
    const paginate = (list: UserStoreListItem[], limit: number, offset: number): UserStoreListItem[] => {
        return list?.slice(offset, offset + limit);
    };

    /**
     * Handles the change in the number of items to display.
     *
     * @param event - Click event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    /**
     * This paginates.
     *
     * @param event - Click event.
     * @param data - Pagination data.
     */
    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Handles sort order change.
     *
     * @param isAscending - Sort order.
     */
    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    /**
     * Handle sort strategy change.
     *
     * @param event - Click event.
     * @param data - Dropdown data.
     */
    const handleSortStrategyChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setSortBy(SORT_BY.filter((option: {
            key: number;
            text: string;
            value: string;
        }) => option.value === data.value)[ 0 ]);
    };

    /**
     * Handles the `onFilter` callback action from the search component.
     *
     * @param query - Search query.
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

    const addUserDropdownTrigger: ReactElement = (
        <PrimaryButton
            data-componentid={ `${ testId }-add-user-store-button` }
            data-testid={ `${ testId }-add-user-store-button` }
        >
            <Icon name="add"/>
            { t("userstores:pageLayout.list.primaryAction") }
            <Icon name="dropdown" className="ml-3 mr-0"/>
        </PrimaryButton>
    );

    const getAddUserStoreOptions = (): DropdownItemProps[] => {
        const dropDownOptions: DropdownItemProps[] = [];

        dropDownOptions.push({
            "data-componentid": `${testId}-add-user-store-dropdown-item`,
            key: 1,
            text: t("userstores:pageLayout.list.newUserStoreDropdown.connectDirectly"),
            value: UserStoreTypes.DIRECT
        });
        dropDownOptions.push({
            "data-componentid": `${testId}-user-store-dropdown-item`,
            "data-testid": `${testId}-user-store-dropdown-item`,
            key: 2,
            text: t("userstores:pageLayout.list.newUserStoreDropdown.connectRemotely"),
            value: UserStoreTypes.REMOTE
        });

        return dropDownOptions;
    };

    const handleDropdownItemChange = (value: string | number | boolean): void => {
        switch (value) {
            case UserStoreTypes.DIRECT:
                history.push(AppConstants.getPaths().get("USERSTORE_TEMPLATES"));

                break;
            case UserStoreTypes.REMOTE:
                history.push(RemoteUserStoreConstants.getPaths().get("REMOTE_USER_STORE_CREATE"));

                break;
        }
    };

    return (
        <PageLayout
            action={
                (
                    isUserStoreGetRequestLoading
                    || !(
                        !searchQuery
                        && filteredUserStores?.length <= 0
                        && disabledFeatures?.includes(UserStoreManagementConstants.FEATURE_DICTIONARY
                            .get("USER_STORE_REMOTE"))
                    )
                ) && userstoresConfig.userstoreList.allowAddingUserstores
                && (
                    <Show
                        when={ featureConfig?.userStores?.scopes?.create }
                    >
                        { disabledFeatures?.includes(UserStoreManagementConstants.FEATURE_DICTIONARY
                            .get("USER_STORE_REMOTE"))
                            ? (
                                <PrimaryButton
                                    onClick={ () => {
                                        history.push(AppConstants.getPaths().get("USERSTORE_TEMPLATES"));
                                    } }
                                    data-testid={ `${ testId }-list-layout-add-button` }
                                >
                                    <Icon name="add"/>
                                    { t("userstores:pageLayout.list.primaryAction") }
                                </PrimaryButton>
                            ) : (
                                <Dropdown
                                    data-componentid={ `${ testId }-add-user-store-dropdown` }
                                    direction="left"
                                    floating
                                    icon={ null }
                                    trigger={ addUserDropdownTrigger }
                                >
                                    <Dropdown.Menu>
                                        { getAddUserStoreOptions().map((option: DropdownItemProps) => (
                                            <Dropdown.Item
                                                key={ option.value.toString() }
                                                onClick={ () => handleDropdownItemChange(option.value) }
                                                { ...option }
                                            />
                                        )) }
                                    </Dropdown.Menu>
                                </Dropdown>
                            )
                        }
                    </Show>
                )
            }
            isLoading={ isUserStoreGetRequestLoading }
            title={ t("userstores:pageLayout.list.title") }
            pageTitle={ t("userstores:pageLayout.list.title") }
            description={ t("userstores:pageLayout.list.description") }
            data-testid={ `${ testId }-page-layout` }
        >
            <ListLayout
                advancedSearch={
                    (<AdvancedSearchWithBasicFilters
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
                            t("userstores:advancedSearch.form.inputs" +
                                ".filterAttribute.placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("userstores:advancedSearch.form.inputs" +
                                ".filterCondition.placeholder")
                        }
                        filterValuePlaceholder={
                            t("userstores:advancedSearch.form.inputs" +
                                ".filterValue.placeholder")
                        }
                        placeholder={
                            t("userstores:advancedSearch.placeholder")
                        }
                        defaultSearchAttribute="name"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                        data-testid={ `${ testId }-advanced-search` }
                    />)
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
                showTopActionPanel={ isUserStoreGetRequestLoading ||
                    !(!searchQuery && filteredUserStores?.length <= 0) }
                totalPages={ Math.ceil(filteredUserStores?.length / listItemLimit) }
                totalListSize={ filteredUserStores?.length }
                isLoading={ isUserStoreGetRequestLoading }
                data-testid={ `${ testId }-list-layout` }
            >
                <UserStoresList
                    advancedSearch={
                        (<AdvancedSearchWithBasicFilters
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
                                t("userstores:advancedSearch.form.inputs" +
                                    ".filterAttribute.placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("userstores:advancedSearch.form.inputs" +
                                    ".filterCondition.placeholder")
                            }
                            filterValuePlaceholder={
                                t("userstores:advancedSearch.form.inputs" +
                                    ".filterValue.placeholder")
                            }
                            placeholder={
                                t("userstores:advancedSearch.placeholder")
                            }
                            defaultSearchAttribute="name"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                            data-testid={ `${ testId }-advanced-search` }
                        />)
                    }
                    list={ paginate(filteredUserStores, listItemLimit, offset) }
                    onEmptyListPlaceholderActionClick={
                        () => history.push(AppConstants.getPaths().get("USERSTORE_TEMPLATES"))
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
