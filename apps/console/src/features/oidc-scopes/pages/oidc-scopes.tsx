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
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import sortBy from "lodash-es/sortBy";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownItemProps, DropdownProps, Icon, Input } from "semantic-ui-react";
import { AppState, FeatureConfigInterface, UIConstants, sortList } from "../../core";
import { useOIDCScopesList } from "../api";
import { OIDCScopeCreateWizard, OIDCScopeList } from "../components";
import { OIDCScopesListInterface } from "../models";

/**
 * Props for the OIDC scopes page.
 */
type OIDCScopesPageInterface = TestableComponentInterface;

/**
 * OIDC Scopes page.
 *
 * @param {OIDCScopesPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const OIDCScopesPage: FunctionComponent<OIDCScopesPageInterface> = (
    props: OIDCScopesPageInterface
): ReactElement => {


    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Sets the scopes by which the list can be sorted
     */
    const SORT_BY = [
        {
            key: 0,
            text: t("common:name"),
            value: "displayName"
        },
        {
            key: 1,
            text: t("console:manage.features.oidcScopes.forms.addScopeForm.inputs.scopeName.label"),
            value: "name"
        }
    ];

    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ filteredScopeList, setFilteredScopeList ] = useState<OIDCScopesListInterface[]>(undefined);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ listItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ sortOrder, setSortOrder ] = useState<"ASC" | "DESC">("ASC");
    const [ sortByStrategy, setSortByStrategy ] = useState<DropdownItemProps>(SORT_BY[ 0 ]);
    const [ searchQuery, setSearchQuery ] = useState<string>("");

    const {
        data: scopeList,
        isLoading: isScopeListFetchRequestLoading,
        error: scopeListFetchRequestError,
        mutate: mutateScopeListFetchRequest
    } = useOIDCScopesList(sortByStrategy.value as string, sortOrder);

    /**
     * Sort the list when the sort order and strategy changes.
     * NOTE: This is a fron-end level sort since the API does not support search.
     */
    useEffect(() => {
        setFilteredScopeList(sortList(filteredScopeList, sortByStrategy.value as string, sortOrder === "ASC"));
    }, [ sortOrder, sortByStrategy ]);

    /**
     * Filter the list when the seach query changes.
     * NOTE: This is a fron-end level search since the API does not support search.
     */
    useEffect(() => {
        if (searchQuery.length > 0) {
            const result = scopeList.filter((item) =>
                item.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);

            setFilteredScopeList(result);

            return;
        }

        setFilteredScopeList(undefined);
    }, [ searchQuery ]);

    /**
     * Show errors when the API request fails.
     */
    useEffect(() => {
        if (!scopeListFetchRequestError) {
            return;
        }

        if (scopeListFetchRequestError.response
            && scopeListFetchRequestError.response.data
            && scopeListFetchRequestError.response.data.description) {
            dispatch(addAlert({
                description: scopeListFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("console:develop.features.applications.notifications.fetchApplications.error." +
                    "message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:develop.features.applications.notifications.fetchApplications" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("console:develop.features.applications.notifications.fetchApplications.genericError." +
                "message")
        }));
    }, [ scopeListFetchRequestError ]);

    /**
     * Search the scope list.
     *
     * @param event
     */
    const searchScopeList = (event) => {
        setSearchQuery(event.target.value);
    };

    /**
    * Handles sort order change.
    *
    * @param {boolean} isAscending.
    */
    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending === true ? "ASC" : "DESC");
    };

    /**
    * Handle sort strategy change.
    *
    * @param {React.SyntheticEvent<HTMLElement>} event.
    * @param {DropdownProps} data.
    */
    const handleSortStrategyChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setSortByStrategy(SORT_BY.filter(option => option.value === data.value)[ 0 ]);
    };

    return (
        <PageLayout
            pageTitle="Scopes"
            action={
                hasRequiredScopes(
                    featureConfig?.applications, featureConfig?.applications?.scopes?.create,
                    allowedScopes
                )
                    ? (
                        <PrimaryButton
                            disabled={ isScopeListFetchRequestLoading }
                            loading={ isScopeListFetchRequestLoading }
                            onClick={ () => setShowWizard(true) }
                            data-testid={ `${ testId }-list-layout-add-button` }
                        >
                            <Icon name="add"/>
                            { t("console:manage.features.oidcScopes.buttons.addScope") }
                        </PrimaryButton>
                    )
                    : null
            }
            title={ t("console:manage.pages.oidcScopes.title") }
            description={ t("console:manage.pages.oidcScopes.subTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            <ListLayout
                showTopActionPanel={ (!isScopeListFetchRequestLoading && !(scopeList?.length == 0)) }
                listItemLimit={ listItemLimit }
                showPagination={ false }
                onPageChange={ () => null }
                totalPages={ Math.ceil(scopeList?.length / listItemLimit) }
                data-testid={ `${ testId }-list-layout` }
                leftActionPanel={ (
                    <div className="advanced-search-wrapper aligned-left fill-default">
                        <Input
                            className="advanced-search with-add-on"
                            data-testid={ `${ testId }-list-search-input` }
                            icon="search"
                            iconPosition="left"
                            value={ searchQuery }
                            onChange={ searchScopeList }
                            placeholder={ t("console:manage.features.oidcScopes.list.searchPlaceholder") }
                            floated="right"
                            size="small"
                        />
                    </div>
                ) }
                sortOptions={ SORT_BY }
                sortStrategy={ sortBy }
                onSortOrderChange={ handleSortOrderChange }
                onSortStrategyChange={ handleSortStrategyChange }
            >
                <OIDCScopeList
                    featureConfig={ featureConfig }
                    isLoading={ isScopeListFetchRequestLoading }
                    list={ filteredScopeList ?? scopeList }
                    onScopeDelete={ () => mutateScopeListFetchRequest() }
                    onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                    data-testid={ `${ testId }-list` }
                    searchResult={ filteredScopeList?.length }
                    getOIDCScopesList={  () => setSearchQuery("") }
                />
                {
                    showWizard && (
                        <OIDCScopeCreateWizard
                            data-testid="add-oidc-scope-wizard-modal"
                            closeWizard={ () => setShowWizard(false) }
                            onUpdate={ () => mutateScopeListFetchRequest() }
                        />
                    )
                }
            </ListLayout>
        </PageLayout>
    );
};

/**
 * Default proptypes for the OIDC scopes component.
 */
OIDCScopesPage.defaultProps = {
    "data-testid": "oidc-scopes"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OIDCScopesPage;
