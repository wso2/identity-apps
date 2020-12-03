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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import _ from "lodash";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { 
    DropdownItemProps, 
    DropdownProps,
    Icon,
    PaginationProps
} from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    history
} from "../../core";
import { RemoteFetchStatus } from "../../remote-repository-configuration";
import { getApplicationList } from "../api";
import { ApplicationList } from "../components";
import { ApplicationListInterface } from "../models";

const APPLICATIONS_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: I18n.instance.t("common:name"),
        value: "name"
    },
    {
        key: 2,
        text: I18n.instance.t("common:type"),
        value: "type"
    },
    {
        key: 3,
        text: I18n.instance.t("common:createdOn"),
        value: "createdDate"
    },
    {
        key: 4,
        text: I18n.instance.t("common:lastUpdatedOn"),
        value: "lastUpdated"
    }
];

/**
 * Props for the Applications page.
 */
type ApplicationsPageInterface = TestableComponentInterface;

/**
 * Applications page.
 *
 * @param {ApplicationsPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const ApplicationsPage: FunctionComponent<ApplicationsPageInterface> = (
    props: ApplicationsPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        APPLICATIONS_LIST_SORTING_OPTIONS[ 0 ]
    );
    const [ appList, setAppList ] = useState<ApplicationListInterface>({});
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ isApplicationListRequestLoading, setApplicationListRequestLoading ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    /**
     * Called on every `listOffset` & `listItemLimit` change.
     */
    useEffect(() => {
        getAppLists(listItemLimit, listOffset, null);
    }, [ listOffset, listItemLimit ]);

    /**
     * Retrieves the list of applications.
     *
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     */
    const getAppLists = (limit: number, offset: number, filter: string): void => {
        setApplicationListRequestLoading(true);

        getApplicationList(limit, offset, filter)
            .then((response) => {
                setAppList(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.fetchApplications.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.fetchApplications.genericError.message")
                }));
            })
            .finally(() => {
                setApplicationListRequestLoading(false);
            });
    };

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>,
                                               data: DropdownProps): void => {
        setListSortingStrategy(_.find(APPLICATIONS_LIST_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    /**
     * Handles the `onFilter` callback action from the
     * application search component.
     *
     * @param {string} query - Search query.
     */
    const handleApplicationFilter = (query: string): void => {
        setSearchQuery(query);
        getAppLists(listItemLimit, listOffset, query);
    };

    /**
     * Handles the pagination change.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {PaginationProps} data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Handles per page dropdown page.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>,
                                              data: DropdownProps): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles application delete action.
     */
    const handleApplicationDelete = (): void => {
        getAppLists(listItemLimit, listOffset, null);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        getAppLists(listItemLimit, listOffset, null);
        setTriggerClearQuery(!triggerClearQuery);
    };

    /**
     * Renders the Remote Fetch status bar.
     *
     * @return {React.ReactElement}
     */
    const renderRemoteFetchStatus = (): ReactElement => {
        
        if (!hasRequiredScopes(featureConfig?.remoteFetchConfig,
            featureConfig?.remoteFetchConfig?.scopes?.read,
            allowedScopes)) {
            
            return null;
        }
        
        return <RemoteFetchStatus data-testid={ "remote-fetch" } />;
    };

    return (
        <PageLayout
            action={
                (isApplicationListRequestLoading || !(!searchQuery && appList?.totalResults <= 0))
                && (hasRequiredScopes(featureConfig?.applications, featureConfig?.applications?.scopes?.create,
                    allowedScopes))
                && (
                    <PrimaryButton
                        onClick={ (): void => {
                            history.push(AppConstants.getPaths().get("APPLICATION_TEMPLATES"));
                        } }
                        data-testid={ `${ testId }-list-layout-add-button` }
                    >
                        <Icon name="add"/>
                        { t("console:develop.features.applications.list.actions.add") }
                    </PrimaryButton>
                )
            }
            title={ t("console:develop.pages.applications.title") }
            description={ t("console:develop.pages.applications.subTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            { renderRemoteFetchStatus() }
            <ListLayout
                advancedSearch={
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleApplicationFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "name"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("console:develop.features.applications.advancedSearch.form.inputs.filterAttribute" +
                                ".placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("console:develop.features.applications.advancedSearch.form.inputs.filterCondition" +
                                ".placeholder")
                        }
                        filterValuePlaceholder={
                            t("console:develop.features.applications.advancedSearch.form.inputs.filterValue" +
                                ".placeholder")
                        }
                        placeholder={ t("console:develop.features.applications.advancedSearch.placeholder") }
                        defaultSearchAttribute="name"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                        data-testid={ `${ testId }-list-advanced-search` }
                    />
                }
                currentListSize={ appList.count }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                showPagination={ appList?.totalResults !== 0 }
                showTopActionPanel={ isApplicationListRequestLoading || !(!searchQuery && appList?.totalResults <= 0) }
                sortOptions={ APPLICATIONS_LIST_SORTING_OPTIONS }
                sortStrategy={ listSortingStrategy }
                totalPages={ Math.ceil(appList.totalResults / listItemLimit) }
                totalListSize={ appList.totalResults }
                data-testid={ `${ testId }-list-layout` }
            >
                <ApplicationList
                    advancedSearch={
                        <AdvancedSearchWithBasicFilters
                            onFilter={ handleApplicationFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t("common:name"),
                                    value: "name"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("console:develop.features.applications.advancedSearch.form.inputs.filterAttribute" +
                                    ".placeholder")
                            }
                            filterConditionsPlaceholder={
                                t("console:develop.features.applications.advancedSearch.form.inputs.filterCondition" +
                                    ".placeholder")
                            }
                            filterValuePlaceholder={
                                t("console:develop.features.applications.advancedSearch.form.inputs.filterValue" +
                                    ".placeholder")
                            }
                            placeholder={ t("console:develop.features.applications.advancedSearch.placeholder") }
                            defaultSearchAttribute="name"
                            defaultSearchOperator="co"
                            triggerClearQuery={ triggerClearQuery }
                            data-testid={ `${ testId }-list-advanced-search` }
                        />
                    }
                    featureConfig={ featureConfig }
                    isLoading={ isApplicationListRequestLoading }
                    list={ appList }
                    onApplicationDelete={ handleApplicationDelete }
                    onEmptyListPlaceholderActionClick={
                        () => history.push(AppConstants.getPaths().get("APPLICATION_TEMPLATES"))
                    }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    data-testid={ `${ testId }-list` }
                />
            </ListLayout>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ApplicationsPage.defaultProps = {
    "data-testid": "applications"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ApplicationsPage;
