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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import { AppState, FeatureConfigInterface } from "../../core";
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

    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ scopeList, setScopeList ] = useState<OIDCScopesListInterface[]>([]);
    const [ isScopesListRequestLoading, setScopesListRequestLoading ] = useState<boolean>(false);
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

        getOIDCScopesList<OIDCScopesListInterface[]>()
            .then((response: OIDCScopesListInterface[]) => {
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
            action={
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
            title={ t("devPortal:pages.oidcScopes.title") }
            description={ t("devPortal:pages.oidcScopes.subTitle") }
            data-testid={ `${ testId }-page-layout` }
        >
            <ListLayout
                showTopActionPanel={ false }
                onPageChange={ () => null }
                showPagination={ false }
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
