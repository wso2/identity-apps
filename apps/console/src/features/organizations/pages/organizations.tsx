/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import {
    DocumentationLink,
    GridLayout,
    ListLayout,
    PageLayout,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import find from "lodash-es/find";
import React, { FunctionComponent, MouseEvent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    UIConstants
} from "../../core";
import { getOrganizations } from "../api";
import { OrganizationList } from "../components";
import { OrganizationListInterface } from "../models";

const ORGANIZATIONS_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
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
 * Props for the Organizations page.
 */
type OrganizationsPageInterface = TestableComponentInterface;

/**
 * Organizations page.
 *
 * @param {OrganizationsPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const OrganizationsPage: FunctionComponent<OrganizationsPageInterface> = (
    props: OrganizationsPageInterface
): ReactElement => {
    const { [ "data-testid" ]: testId } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ organizationList, setOrganizationList ] = useState<OrganizationListInterface>(null);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        ORGANIZATIONS_LIST_SORTING_OPTIONS[ 0 ]
    );
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ isOrganizationListRequestLoading, setOrganizationListRequestLoading ] = useState<boolean>(false);
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isOrganizationsNextPageAvailable, setIsOrganizationsNextPageAvailable ] = useState<boolean>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Called on every `listOffset` & `listItemLimit` change.
     */
    useEffect(() => {
        if (searchQuery) {
            getOrganizationLists(listItemLimit, listOffset, searchQuery);
        } else {
            getOrganizationLists(listItemLimit, listOffset, null);
        }
    }, [ listOffset, listItemLimit ]);

    /**
     * Retrieves the list of organizations.
     *
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     */
    const getOrganizationLists = (limit: number, offset: number, filter: string): void => {
        setOrganizationListRequestLoading(true);

        getOrganizations(filter, limit, null, null)
            .then((response) => {
                handleNextButtonVisibility(response);
                setOrganizationList(response);
            })
            .catch((error) => {
                if (error?.description) {
                    dispatch(
                        addAlert({
                            description: error.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:develop.features.organizations.notifications." +
                                "fetchOrganizations.error.message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "console:develop.features.organizations.notifications.fetchOrganizations" +
                            ".genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:develop.features.organizations.notifications." +
                            "fetchOrganizations.genericError.message"
                        )
                    })
                );
            })
            .finally(() => {
                setOrganizationListRequestLoading(false);
                setLoading(false);
            });
    };

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(
            find(ORGANIZATIONS_LIST_SORTING_OPTIONS, (option) => {
                return data.value === option.value;
            })
        );
    };

    /**
     *
     * Sets the Next button visibility.
     *
     * @param appList - List of organizations.
     */
    const handleNextButtonVisibility = (appList: any): void => {
        if (appList.startIndex + appList.count === appList.totalResults + 1) {
            setIsOrganizationsNextPageAvailable(false);
        } else {
            setIsOrganizationsNextPageAvailable(true);
        }
    };

    /**
     * Handles the `onFilter` callback action from the
     * application search component.
     *
     * @param {string} query - Search query.
     */
    const handleOrganizationFilter = (query: string): void => {
        setSearchQuery(query);
        getOrganizationLists(listItemLimit, listOffset, query);
    };

    /**
     * Handles the pagination change.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {PaginationProps} data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    /**
     * Handles per page dropdown page.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles application delete action.
     */
    const handleOrganizationDelete = (): void => {
        getOrganizationLists(listItemLimit, listOffset, null);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        getOrganizationLists(listItemLimit, listOffset, null);
        setTriggerClearQuery(!triggerClearQuery);
    };

    return (
        <PageLayout
            action={
                !isLoading &&
                !(!searchQuery /* && appList?.totalResults <= 0 */) && (
                    <Show when={ AccessControlConstants.ORGANIZATION_WRITE }>
                        <PrimaryButton
                            disabled={ isOrganizationListRequestLoading }
                            loading={ isOrganizationListRequestLoading }
                            onClick={ (): void => {
                                eventPublisher.publish("application-click-new-application-button");
                            } }
                            data-testid={ `${ testId }-list-layout-add-button` }
                        >
                            <Icon name="add" />
                            { t("console:develop.features.organizations.list.actions.add") }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={ t("console:develop.pages.organizations.title") }
            description={
                (<p>
                    { t("console:develop.pages.organizations.subTitle") }
                    <DocumentationLink link={ getLink("develop.organizations.learnMore") }>
                        { t("common:learnMore") }
                    </DocumentationLink>
                </p>)
            }
            data-testid={ `${ testId }-page-layout` }
        >
            { !isLoading ? (
                <>
                    <ListLayout
                        advancedSearch={
                            (<AdvancedSearchWithBasicFilters
                                onFilter={ handleOrganizationFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: t("common:name"),
                                        value: "name"
                                    }
                                ] }
                                filterAttributePlaceholder={ t(
                                    "console:develop.features.organizations.advancedSearch.form" +
                                    ".inputs.filterAttribute.placeholder"
                                ) }
                                filterConditionsPlaceholder={ t(
                                    "console:develop.features.organizations.advancedSearch.form" +
                                    ".inputs.filterCondition.placeholder"
                                ) }
                                filterValuePlaceholder={ t(
                                    "console:develop.features.organizations.advancedSearch.form.inputs.filterValue" +
                                    ".placeholder"
                                ) }
                                placeholder={ t("console:develop.features.organizations.advancedSearch.placeholder") }
                                defaultSearchAttribute="name"
                                defaultSearchOperator="co"
                                triggerClearQuery={ triggerClearQuery }
                                data-testid={ `${ testId }-list-advanced-search` }
                            />)
                        }
                        currentListSize={ organizationList?.organizations.length }
                        listItemLimit={ listItemLimit }
                        onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                        onPageChange={ handlePaginationChange }
                        onSortStrategyChange={ handleListSortingStrategyOnChange }
                        showPagination={ true }
                        showTopActionPanel={
                            isOrganizationListRequestLoading || !(!searchQuery /* && appList?.totalResults <= 0 */)
                        }
                        sortOptions={ ORGANIZATIONS_LIST_SORTING_OPTIONS }
                        sortStrategy={ listSortingStrategy }
                        totalPages={ Math.ceil(organizationList?.organizations.length / listItemLimit) }
                        totalListSize={ organizationList?.organizations.length }
                        paginationOptions={ {
                            disableNextButton: !isOrganizationsNextPageAvailable
                        } }
                        data-testid={ `${ testId }-list-layout` }
                    >
                        <OrganizationList
                            advancedSearch={
                                (<AdvancedSearchWithBasicFilters
                                    onFilter={ handleOrganizationFilter }
                                    filterAttributeOptions={ [
                                        {
                                            key: 0,
                                            text: t("common:name"),
                                            value: "name"
                                        }
                                    ] }
                                    filterAttributePlaceholder={ t(
                                        "console:develop.features.organizations.advancedSearch." +
                                        "form.inputs.filterAttribute.placeholder"
                                    ) }
                                    filterConditionsPlaceholder={ t(
                                        "console:develop.features.organizations.advancedSearch." +
                                        "form.inputs.filterCondition.placeholder"
                                    ) }
                                    filterValuePlaceholder={ t(
                                        "console:develop.features.organizations.advancedSearch." +
                                        "form.inputs.filterValue.placeholder"
                                    ) }
                                    placeholder={
                                        t("console:develop.features.organizations.advancedSearch.placeholder") }
                                    defaultSearchAttribute="name"
                                    defaultSearchOperator="co"
                                    triggerClearQuery={ triggerClearQuery }
                                    data-testid={ `${ testId }-list-advanced-search` }
                                />)
                            }
                            featureConfig={ featureConfig }
                            isLoading={ isOrganizationListRequestLoading }
                            list={ organizationList }
                            onOrganizationDelete={ handleOrganizationDelete }
                            onEmptyListPlaceholderActionClick={ () => {
                                console.log();
                            } }
                            onSearchQueryClear={ handleSearchQueryClear }
                            searchQuery={ searchQuery }
                            data-testid={ `${ testId }-list` }
                            data-componentid="application"
                        />
                    </ListLayout>
                    { showWizard &&
                    {
                        /* <MinimalOrganizationCreateWizard
                        title={ CustomOrganizationTemplate?.name }
                        subTitle={ CustomOrganizationTemplate?.description }
                        closeWizard={ (): void => setShowWizard(false) }
                        template={ CustomOrganizationTemplate }
                        showHelpPanel={ true }
                        subTemplates={ CustomOrganizationTemplate?.subTemplates }
                        subTemplatesSectionTitle={ CustomOrganizationTemplate?.subTemplatesSectionTitle }
                        addProtocol={ false }
                        templateLoadingStrategy={
                            config.ui.applicationTemplateLoadingStrategy
                        ?? OrganizationManagementConstants.DEFAULT_APP_TEMPLATE_LOADING_STRATEGY
                        }
                    /> */
                    } }
                </>
            ) : (
                <GridLayout isLoading={ isLoading } />
            ) }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
OrganizationsPage.defaultProps = {
    "data-testid": "organizations"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OrganizationsPage;
