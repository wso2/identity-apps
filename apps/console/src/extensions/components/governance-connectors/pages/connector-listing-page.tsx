/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, ReferableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GridLayout, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid, Ref } from "semantic-ui-react";
import { AppState, FeatureConfigInterface, UIConstants, history, useUIElementSizes } from "../../../../features/core";
import { ServerConfigurationsConstants } from "../../../../features/server-configurations";
import { getConnectorCategory } from "../../../../features/server-configurations/api";
import {
    GovernanceConnectorCategoryInterface,
    GovernanceConnectorInterface
} from "../../../../features/server-configurations/models";
import { EditConnector } from "../settings";
import { serverConfigurationConfig } from "../../../configs";

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
 * @param {ConnectorListingPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ConnectorListingPage: FunctionComponent<ConnectorListingPageInterface> = (
    props: ConnectorListingPageInterface
): ReactElement => {
    const { [ "data-testid" ]: testId } = props;

    const dispatch = useDispatch();
    const pageContextRef = useRef(null);

    const { t } = useTranslation();
    const { headerHeight, footerHeight } = useUIElementSizes();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ connectorCategory, setConnectorCategory ] = useState<GovernanceConnectorCategoryInterface>({});
    const [ connectors, setConnectors ] = useState<GovernanceConnectorWithRef[]>([]);
    const [ selectedConnector, setSelectorConnector ] = useState<GovernanceConnectorWithRef>(null);

    const ScrollTopPosition = headerHeight + UIConstants.PAGE_SCROLL_TOP_PADDING;

    const [ categoryId, setCategoryId ] = useState<string>(undefined);
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
        const path = history.location.pathname.split("/");
        const categoryId = path[ path.length - 1 ];


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
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.detail) {
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

    return (
        <PageLayout
            title={ resolveConnectorCategoryTitle(categoryId) }
            description={
                resolveConnectorCategoryDescription(categoryId)
            }
            data-testid={ `${ testId }-${ categoryId }-page-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <GridLayout
                    isLoading={ isConnectorCategoryLoading }
                    showTopActionPanel={ false }
                >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 12 }>
                            {
                                (connectors && Array.isArray(connectors) && connectors.length > 0)
                                    ? connectors.map((connector: GovernanceConnectorWithRef, index: number) => {
                                        if (serverConfigurationConfig.connectorsToShow.includes(connector?.name)) {
                                            return (
                                                <div ref={ connector.ref } key={ index }>
                                                    <EditConnector
                                                        connector={ connector }
                                                        categoryID={ categoryId }
                                                        data-testid={ `${testId}-` + connector?.id }
                                                        onUpdate={ () => loadCategoryConnectors() }
                                                        connectorToggleName={
                                                            serverConfigurationConfig.connectorToggleName[ connector?.name ]
                                                        }
                                                    />
                                                    <Divider hidden/>
                                                </div>
                                            );
                                        }
                                    })
                                    : null
                            }
                        </Grid.Column>
                    </Grid.Row>
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
