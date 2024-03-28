/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout, PrimaryButton } from "@wso2is/react-components";
import sortBy from "lodash-es/sortBy";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, DropdownProps, Icon, Input } from "semantic-ui-react";
import { AccessControlConstants } from "../../admin-access-control-v1/constants/access-control";
import { ClaimManagementConstants } from "../../admin-claims-v1/constants";
import { AppConstants, AppState, FeatureConfigInterface, UIConstants, history, sortList } from "../../admin-core-v1";
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
 * @param props - Props injected to the component.
 *
 * @returns OIDCScopesPage Component.
 */
const OIDCScopesPage: FunctionComponent<OIDCScopesPageInterface> = (
    props: OIDCScopesPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Sets the scopes by which the list can be sorted.
     */
    const SORT_BY: DropdownItemProps[] = [
        {
            key: 0,
            text: t("common:name"),
            value: "displayName"
        },
        {
            key: 1,
            text: t("oidcScopes:forms.addScopeForm.inputs.scopeName.label"),
            value: "name"
        }
    ];

    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

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
                message: t("applications:notifications.fetchApplications.error." +
                    "message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchApplications" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications.fetchApplications.genericError." +
                "message")
        }));
    }, [ scopeListFetchRequestError ]);

    /**
    * Handles sort order change.
    *
    * @param isAscending - Sort order.
    */
    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending === true ? "ASC" : "DESC");
    };

    /**
    * Handle sort strategy change.
    *
    * @param event - Dropdown change event.
    * @param data - Selected dropdown option.
    */
    const handleSortStrategyChange = (_event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setSortByStrategy(SORT_BY.filter(
            (option: { key: number; text: string; value: string; }) => option.value === data.value)[ 0 ]);
    }; 

    /**
     * This the the function which is called when the user types 
     * in the search box and hits enter.
     * 
     * @param event - Keyboard event of the search input.
     */
    const handleEnterKeyInSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
          
            if (searchQuery.length > 0) {
                const result: OIDCScopesListInterface[] = scopeList.filter((item: OIDCScopesListInterface) =>
                    item.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);

                setFilteredScopeList(result);

                return;
            }

            setFilteredScopeList(undefined);
        }
    };

    return (
        <PageLayout
            pageTitle="Scopes"
            action={
                !isScopeListFetchRequestLoading &&
                (
                    <Show
                        when={ AccessControlConstants.APPLICATION_WRITE }
                    >
                        <PrimaryButton
                            disabled={ isScopeListFetchRequestLoading }
                            loading={ isScopeListFetchRequestLoading }
                            onClick={ () => setShowWizard(true) }
                            data-testid={ `${ testId }-list-layout-add-button` }
                        >
                            <Icon name="add"/>
                            { t("oidcScopes:buttons.addScope") }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={ t("pages:oidcScopes.title") }
            description={ t("pages:oidcScopes.subTitle") }
            data-testid={ `${ testId }-page-layout` }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("ATTRIBUTE_MAPPINGS")
                        .replace(":type", ClaimManagementConstants.OIDC)
                        .replace(":customAttributeMappingID", "")
                    );
                },
                text: t("claims:local.pageLayout.local.back")
            } }
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
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value) }
                            placeholder={ t("oidcScopes:list.searchPlaceholder") }
                            floated="right"
                            size="small"
                            onKeyPress={ (e: React.KeyboardEvent<HTMLInputElement>) => handleEnterKeyInSearch(e) }
                        />
                    </div>
                ) }
                sortOptions={ SORT_BY }
                sortStrategy={ sortBy }
                onSortOrderChange={ handleSortOrderChange }
                onSortStrategyChange={ handleSortStrategyChange }
                isLoading={ isScopeListFetchRequestLoading }
            >
                <OIDCScopeList
                    featureConfig={ featureConfig }
                    list={ filteredScopeList ?? scopeList }
                    onScopeDelete={ () => mutateScopeListFetchRequest() }
                    onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                    data-testid={ `${ testId }-list` }
                    searchResult={ filteredScopeList?.length }
                    clearSearchQuery={ () => { 
                        setSearchQuery(""); 
                        setFilteredScopeList(undefined);
                    } }
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
