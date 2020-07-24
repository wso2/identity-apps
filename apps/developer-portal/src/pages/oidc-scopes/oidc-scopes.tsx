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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownItemProps, Icon } from "semantic-ui-react";
import { getOIDCScopesList } from "../../api";
import { OIDCScopeList } from "../../components/oidc-scopes";
import { OIDCScopeCreateWizard } from "../../components/oidc-scopes/wizards";
import { AdvancedSearchWithBasicFilters } from "../../components/shared";
import { FeatureConfigInterface, OIDCScopesListInterface } from "../../models";
import { AppState } from "../../store";

const OIDC_SCOPE_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
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

    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        OIDC_SCOPE_LIST_SORTING_OPTIONS[ 0 ]
    );

    const [ scopeList, setScopeList ] = useState<OIDCScopesListInterface>({});
    const [ isScopesListRequestLoading, setScopesListRequestLoading ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);

    /**
     * Called on every `listOffset` & `listItemLimit` change.
     */
    useEffect(() => {
        getOIDCScopes();
    }, []);

    /**
     * Retrieves the list of OIDC scopes.
     */
    const getOIDCScopes = (): void => {
        setScopesListRequestLoading(true);

        getOIDCScopesList()
            .then((response) => {
                setScopeList(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.applications.notifications.fetchApplications.error." +
                            "message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.applications.notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.applications.notifications.fetchApplications.genericError." +
                        "message")
                }));
            })
            .finally(() => {
                setScopesListRequestLoading(false);
            });
    };

    return (
        <PageLayout
            title={ t("devPortal:pages.oidcScopes.title") }
            description={ t("devPortal:pages.oidcScopes.subTitle") }
            showBottomDivider={ true }
            data-testid={ `${ testId }-page-layout` }
        >
            <ListLayout
                advancedSearch={
                    <AdvancedSearchWithBasicFilters
                        onFilter={ null }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "name"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("devPortal:components.applications.advancedSearch.form.inputs.filterAttribute" +
                                ".placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("devPortal:components.applications.advancedSearch.form.inputs.filterCondition" +
                                ".placeholder")
                        }
                        filterValuePlaceholder={
                            t("devPortal:components.applications.advancedSearch.form.inputs.filterValue" +
                                ".placeholder")
                        }
                        placeholder="Search by scope name"
                        defaultSearchAttribute="name"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                        data-testid={ `${ testId }-list-advanced-search` }
                    />
                }
                onPageChange={ null }
                onSortStrategyChange={ null }
                rightActionPanel={
                    (hasRequiredScopes(
                        featureConfig?.applications, featureConfig?.applications?.scopes?.create, allowedScopes))
                        ? (
                            <PrimaryButton
                                onClick={ () => setShowWizard(true) }
                                data-testid={ `${ testId }-list-layout-add-button` }
                            >
                                <Icon name="add"/>
                                { t("devPortal:components.oidcScopes.buttons.addScope") }
                            </PrimaryButton>
                        )
                        : null
                }
                showPagination={ false }
                sortOptions={ OIDC_SCOPE_LIST_SORTING_OPTIONS }
                sortStrategy={ listSortingStrategy }
                totalPages={ null }
                data-testid={ `${ testId }-list-layout` }
            >
                <OIDCScopeList
                    featureConfig={ featureConfig }
                    isLoading={ isScopesListRequestLoading }
                    list={ scopeList }
                    onScopeDelete={ getOIDCScopes }
                    onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                    onSearchQueryClear={ null }
                    searchQuery={ null }
                    data-testid={ `${ testId }-list` }
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
