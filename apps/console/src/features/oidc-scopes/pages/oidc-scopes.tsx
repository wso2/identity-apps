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
import { getOIDCScopesList } from "../api";
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

    const [ scopeList, setScopeList ] = useState<OIDCScopesListInterface[]>([]);
    const [ tempScopeList, setTempScopeList ] = useState<OIDCScopesListInterface[]>([]);
    const [ isScopesListRequestLoading, setScopesListRequestLoading ] = useState<boolean>(true);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ sortOrder, setSortOrder ] = useState(true);
    const [ sortByStrategy, setSortByStrategy ] = useState<DropdownItemProps>(SORT_BY[ 0 ]);

    const initialRender = useRef(true);

    /**
     * Called on every `listOffset` & `listItemLimit` change.
     */
    useEffect(() => {
        getOIDCScopes();
    }, []);

    /**
     * Updates the scope list on change.
     */
    useEffect(() => {
        setScopeList(scopeList);
        setTempScopeList(scopeList);
    }, [ scopeList ]);

    /**
     * Retrieves the list of OIDC scopes.
     */
    const getOIDCScopes = (): void => {
        setScopesListRequestLoading(true);

        getOIDCScopesList<OIDCScopesListInterface[]>()
            .then((response: OIDCScopesListInterface[]) => {
                const sorted = sortBy(response, "displayName");
                setScopeList(sorted);
                setTempScopeList(sorted);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
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
            })
            .finally(() => {
                setScopesListRequestLoading(false);
            });
    };

    /**
     * Search the scope list.
     *
     * @param event
     */
    const searchScopeList = (event) => {
        const changeValue = event.target.value;

        if (changeValue.length > 0) {
            const result = scopeList.filter((item) =>
                item.name.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
            setTempScopeList(result);
        } else {
            setTempScopeList(scopeList);
        }
    };

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            setTempScopeList(sortList(tempScopeList, sortByStrategy.value as string, sortOrder));
        }
    }, [ sortBy, sortOrder ]);

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
        setSortByStrategy(SORT_BY.filter(option => option.value === data.value)[ 0 ]);
    };

    return (
        <PageLayout
            pageTitle="Scopes"
            action={
                (hasRequiredScopes(
                    featureConfig?.applications, featureConfig?.applications?.scopes?.create, allowedScopes))
                    ? (
                        <PrimaryButton
                            disabled={ isScopesListRequestLoading }
                            loading={ isScopesListRequestLoading }
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
                showTopActionPanel={ (!isScopesListRequestLoading && !(scopeList?.length == 0)) }
                listItemLimit={ listItemLimit }
                showPagination={ false }
                onPageChange={ () => null }
                totalPages={ Math.ceil(scopeList?.length / listItemLimit) }
                data-testid={ `${ testId }-list-layout` }
                leftActionPanel={
                    <div className="advanced-search-wrapper aligned-left fill-default">
                        <Input
                            className="advanced-search with-add-on"
                            data-testid={ `${ testId }-list-search-input` }
                            icon="search"
                            iconPosition="left"
                            onChange={ searchScopeList }
                            placeholder={ t("console:manage.features.oidcScopes.list.searchPlaceholder") }
                            floated="right"
                            size="small"
                        />
                    </div>
                }
                sortOptions={ SORT_BY }
                sortStrategy={ sortBy }
                onSortOrderChange={ handleSortOrderChange }
                onSortStrategyChange={ handleSortStrategyChange }
            >
                <OIDCScopeList
                    featureConfig={ featureConfig }
                    isLoading={ isScopesListRequestLoading }
                    list={ tempScopeList }
                    onScopeDelete={ getOIDCScopes }
                    onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                    data-testid={ `${ testId }-list` }
                    searchResult={ tempScopeList?.length }
                    getOIDCScopesList={ getOIDCScopes }
                />
                {
                    showWizard && (
                        <OIDCScopeCreateWizard
                            data-testid="add-oidc-scope-wizard-modal"
                            closeWizard={ () => setShowWizard(false) }
                            onUpdate={ getOIDCScopes }
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
