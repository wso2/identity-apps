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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AnimatedAvatar, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AppConstants, history } from "../../core";
import { getOIDCScopeDetails } from "../api";
import { EditOIDCScope } from "../components";
import { OIDCScopesListInterface } from "../models";

/**
 * Proptypes for the OIDC scopes edit page component.
 */
type OIDCScopesEditPageInterface = TestableComponentInterface;

/**
 * OIDC Scopes Edit page component.
 *
 * @param {OIDCScopesEditPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const OIDCScopesEditPage: FunctionComponent<OIDCScopesEditPageInterface> = (
    props: OIDCScopesEditPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ scope, setScope ] = useState<OIDCScopesListInterface>({});
    const [ isScopeRequestLoading, setScopeRequestLoading ] = useState<boolean>(false);

    /**
     * Fetch the scope details on initial component load.
     */
    useEffect(() => {
        const path = history.location.pathname.split("/");
        const scope = path[ path.length - 1 ];

        getScope(scope);
    }, []);

    /**
     * Retrieves scope details from the API.
     *
     * @param scopeName - name of the scope.
     */
    const getScope = (scopeName: string): void => {
        setScopeRequestLoading(true);

        getOIDCScopeDetails(scopeName)
            .then((response: OIDCScopesListInterface) => {
                setScope(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.oidcScopes.notifications.fetchOIDCScope.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:manage.features.oidcScopes.notifications.fetchOIDCScope" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.oidcScopes.notifications.fetchOIDCScope.genericError." +
                        "message")
                }));
            })
            .finally(() => {
                setScopeRequestLoading(false);
            });
    };


    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("OIDC_SCOPES"));
    };

    return (
        <PageLayout
            isLoading={ isScopeRequestLoading }
            title={ t("console:manage.pages.oidcScopesEdit.title", { name: scope.name }) }
            contentTopMargin={ true }
            description={ t("console:manage.pages.oidcScopesEdit.subTitle") }
            image={
                <AnimatedAvatar
                    name={ scope.name }
                    size="tiny"
                    floated="left"
                />
            }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("console:manage.pages.oidcScopesEdit.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >
            <EditOIDCScope
                scope={ scope }
                isLoading={ isScopeRequestLoading }
                onUpdate={ getScope }
                data-testid={ testId }
            />
        </PageLayout>
    );
};

/**
 * Default proptypes for the application edit page component.
 */
OIDCScopesEditPage.defaultProps = {
    "data-testid": "oidc-scopes-edit"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OIDCScopesEditPage;
