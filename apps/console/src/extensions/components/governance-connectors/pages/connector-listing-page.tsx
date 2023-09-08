/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, ReferableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GridLayout, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Placeholder, Ref } from "semantic-ui-react";
import { AppState, FeatureConfigInterface, history } from "../../../../features/core";
import { PrivateKeyJWTConfig } from "../../../../features/private-key-jwt/pages/private-key-jwt-config";
import { ServerConfigurationsConstants } from "../../../../features/server-configurations";
import { getConnectorCategory } from "../../../../features/server-configurations/api";
import {
    GovernanceConnectorCategoryInterface,
    GovernanceConnectorInterface
} from "../../../../features/server-configurations/models";
import { ValidationConfigPage } from "../../../../features/validation/pages/validation-config";
import { serverConfigurationConfig } from "../../../configs";
import { EditConnector } from "../settings";

/**
 * Props for the Server Configurations page.
 */
type ConnectorListingPageInterface = TestableComponentInterface;

/**
 * `GovernanceConnectorInterface` type with `ref` attr.
 */
type GovernanceConnectorWithRef = GovernanceConnectorInterface & ReferableComponentInterface<HTMLDivElement>;

/**
 * Governance connector listing page.
 *
 * @param props - Props injected to the component.
 * @returns Governance connector listing page component.
 */
export const ConnectorListingPage: FunctionComponent<ConnectorListingPageInterface> = (
    props: ConnectorListingPageInterface
): ReactElement => {
    const { [ "data-testid" ]: testId } = props;

    const dispatch: Dispatch = useDispatch();
    const pageContextRef: MutableRefObject<any> = useRef(null);

    const path: string[] = history.location.pathname.split("/");
    const categoryIdPathParam: string = path[ path.length - 1 ];

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ connectorCategory, setConnectorCategory ] = useState<GovernanceConnectorCategoryInterface>({});
    const [ connectors, setConnectors ] = useState<GovernanceConnectorWithRef[]>([]);
    const [ selectedConnector, setSelectorConnector ] = useState<GovernanceConnectorWithRef>(null);

    const [ categoryId, setCategoryId ] = useState<string>(categoryIdPathParam);
    const [ isConnectorCategoryLoading, setConnectorCategoryLoading ] = useState<boolean>(true);

    useEffect(() => {

        // If Governance Connector read permission is not available, prevent from trying to load the connectors.
        if (!hasRequiredScopes(featureConfig?.governanceConnectors,
            featureConfig?.governanceConnectors?.scopes?.read,
            allowedScopes)) {

            return;
        }

        loadCategoryConnectors();
    }, []);

    const loadCategoryConnectors = () => {
        setConnectorCategoryLoading(true);

        getConnectorCategory(categoryId)
            .then((response: GovernanceConnectorCategoryInterface) => {

                setCategoryId(categoryId);
                response.connectors.map((connector: GovernanceConnectorWithRef) => {
                    connector.categoryId = categoryId;
                    connector.ref = React.createRef();
                });

                setConnectorCategory(response);
                setConnectors(response?.connectors as GovernanceConnectorWithRef[]);
                !selectedConnector && setSelectorConnector(response.connectors[ 0 ] as GovernanceConnectorWithRef);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "getConnector.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "getConnector.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "getConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "getConnector.genericError.message"
                            )
                        })
                    );
                }
            })
            .finally(() => {
                setConnectorCategoryLoading(false);
            });
    };

    const resolveConnectorCategoryTitle = (categoryId: string): string => {
        switch (categoryId) {
            case ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountRecovery.heading")
                );
            case ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.heading")
                );
            case ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.userOnboarding.heading")
                );
            default:
                return connectorCategory?.name;
        }
    };

    const resolveConnectorCategoryDescription = (categoryId: string): string => {
        switch (categoryId) {
            case ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountRecovery.subHeading")
                );
            case ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.subHeading")
                );
            case ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.userOnboarding.subHeading")
                );
            default:
                return (
                    connectorCategory?.description
                );
        }
    };

    /**
     * This function returns loading placeholder.
     */
    const renderLoadingPlaceholder = (): ReactElement => {
        return (
            <Grid.Row columns={ 1 }>
                <div>
                    <div 
                        className="ui card fluid settings-card"
                        data-testid={ `${testId}-loading-card` }
                    >
                        <div className="content no-padding">
                            <div className="header-section">
                                <Placeholder>
                                    <Placeholder.Header>
                                        <Placeholder.Line length="medium" />
                                        <Placeholder.Line length="full" />
                                    </Placeholder.Header>
                                </Placeholder>
                                <Divider hidden />
                            </div>
                        </div>
                        <div className="content extra extra-content">
                            <div className="action-button">
                                <Placeholder>
                                    <Placeholder.Line length="very short" />
                                </Placeholder>
                            </div>
                        </div>
                    </div>
                    <Divider hidden/>
                </div>
            </Grid.Row>
        );
    };

    return (
        <PageLayout
            pageTitle={ resolveConnectorCategoryTitle(categoryId) }
            title={ resolveConnectorCategoryTitle(categoryId) }
            description={
                resolveConnectorCategoryDescription(categoryId)
            }
            data-testid={ `${ testId }-${ categoryId }-page-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <GridLayout
                    showTopActionPanel={ false }
                >
                    { 
                        isConnectorCategoryLoading 
                            ? renderLoadingPlaceholder() 
                            : (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column width={ 12 }>
                                        {
                                            (connectors && Array.isArray(connectors) && connectors.length > 0)
                                                ? connectors.map(
                                                    (connector: GovernanceConnectorWithRef, index: number) => {
                                                        if (serverConfigurationConfig.connectorsToShow
                                                            .includes(connector?.name)) {
                                                            return (
                                                                <div ref={ connector.ref } key={ index }>
                                                                    <EditConnector
                                                                        connector={ connector }
                                                                        categoryID={ categoryId }
                                                                        data-testid={ `${testId}-` + connector?.id }
                                                                        onUpdate={ () => loadCategoryConnectors() }
                                                                        connectorToggleName={
                                                                            serverConfigurationConfig
                                                                                .connectorToggleName[connector?.name]
                                                                        }
                                                                    />
                                                                    <Divider hidden/>
                                                                </div>
                                                            );
                                                        }
                                                    })
                                                : null
                                        }
                                        { (categoryId === ServerConfigurationsConstants
                                            .LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID) && (
                                            <div>
                                                <ValidationConfigPage/>
                                                <Divider hidden/>
                                                <PrivateKeyJWTConfig/>
                                                <Divider hidden/>
                                            </div>
                                        ) }
                                    </Grid.Column>
                                </Grid.Row>
                            )
                    }
                </GridLayout>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ConnectorListingPage.defaultProps = {
    "data-testid": "governance-connectors-listing-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConnectorListingPage;
