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
import { AlertLevels, ReferableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CommonUtils } from "@wso2is/core/utils";
import { EmphasizedSegment, PageLayout, useUIElementSizes } from "@wso2is/react-components";
import camelCase from "lodash-es/camelCase";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Menu, Rail, Ref, Sticky } from "semantic-ui-react";
import { serverConfigurationConfig } from "../../../extensions";
import { AppState, FeatureConfigInterface, UIConstants, history } from "../../core";
import { getConnectorCategory } from "../api";
import { DynamicGovernanceConnector } from "../components";
import { ServerConfigurationsConstants } from "../constants";
import { GovernanceConnectorCategoryInterface, GovernanceConnectorInterface } from "../models";

/**
 * Props for the Server Configurations page.
 */
type GovernanceConnectorsPageInterface = TestableComponentInterface;

/**
 * `GovernanceConnectorInterface` type with `ref` attr.
 */
type GovernanceConnectorWithRef = GovernanceConnectorInterface & ReferableComponentInterface<HTMLDivElement>;

/**
 * Governance connectors page.
 *
 * @param {GovernanceConnectorsPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const GovernanceConnectorsPage: FunctionComponent<GovernanceConnectorsPageInterface> = (
    props: GovernanceConnectorsPageInterface
): ReactElement => {
    const { [ "data-testid" ]: testId } = props;

    const dispatch = useDispatch();
    const pageContextRef = useRef(null);

    const { t } = useTranslation();
    const { headerHeight, footerHeight } = useUIElementSizes({
        footerHeight: UIConstants.DEFAULT_FOOTER_HEIGHT,
        headerHeight: UIConstants.DEFAULT_HEADER_HEIGHT,
        topLoadingBarHeight: UIConstants.AJAX_TOP_LOADING_BAR_HEIGHT
    });

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ connectorCategory, setConnectorCategory ] = useState<GovernanceConnectorCategoryInterface>({});
    const [ connectors, setConnectors ] = useState<GovernanceConnectorWithRef[]>([]);
    const [ selectedConnector, setSelectorConnector ] = useState<GovernanceConnectorWithRef>(null);

    const ScrollTopPosition = headerHeight + UIConstants.PAGE_SCROLL_TOP_PADDING;

    useEffect(() => {
        // If Governance Connector read permission is not available, prevent from trying to load the connectors.
        if (!hasRequiredScopes(featureConfig?.governanceConnectors,
            featureConfig?.governanceConnectors?.scopes?.read,
            allowedScopes)) {

            return;
        }

        loadCategoryConnectors();
    }, []);

    const path: string[] = history.location.pathname.split("/");
    const categoryId: string = (path.length > 0) ? path[ path.length - 1 ] : "";
    const loadCategoryConnectors = () => {

        getConnectorCategory(categoryId)
            .then((response: GovernanceConnectorCategoryInterface) => {

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
            });
    };

    return (
        <PageLayout
            title={ (serverConfigurationConfig.showPageHeading && connectorCategory?.name) && 
                t("console:manage.features.governanceConnectors.connectorCategories." 
                    + camelCase(connectorCategory?.name) + ".name") }
            pageTitle={ serverConfigurationConfig.showPageHeading && connectorCategory?.name }
            description={
                serverConfigurationConfig.showPageHeading && (connectorCategory?.description
                    ? connectorCategory.description
                    : connectorCategory?.name
                    && t("console:manage.features.governanceConnectors.connectorSubHeading", {
                        name: 
                        categoryId === ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID 
                            ? connectorCategory.name.split(" ")[0] 
                            : connectorCategory.name 
                    })
                )
            }
            data-testid={ `${testId}-page-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <Grid>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 12 }>
                            {
                                (connectors && Array.isArray(connectors) && connectors.length > 0)
                                    ? connectors.map((connector: GovernanceConnectorWithRef, index: number) => {
                                        if (serverConfigurationConfig.connectorsToShow.includes(connector.name)
                                            || serverConfigurationConfig.connectorsToShow.includes(
                                                ServerConfigurationsConstants.ALL) ) {
                                            const connectorElement = (
                                                <div ref={ connector.ref }>
                                                    <DynamicGovernanceConnector
                                                        connector={ connector }
                                                        data-testid={ `${testId}-` + connector?.id }
                                                        onUpdate={ () => loadCategoryConnectors() }
                                                    />
                                                </div>
                                            );

                                            return (
                                                serverConfigurationConfig.renderConnectorWithinEmphasizedSegment
                                                    ?
                                                    (<EmphasizedSegment key={ index } padded="very">
                                                        { connectorElement }
                                                    </EmphasizedSegment>)
                                                    : connectorElement
                                            );
                                        }
                                    })
                                    : null
                            }
                            { serverConfigurationConfig.showGovernanceConnectorCategories &&
                            (<Rail
                                className="non-emphasized"
                                position="right"
                                close="very"
                            >
                                <Sticky
                                    context={ pageContextRef }
                                    offset={ ScrollTopPosition }
                                    bottomOffset={ footerHeight }
                                >
                                    {
                                        (connectors && Array.isArray(connectors) && connectors.length > 0) && (
                                            <>
                                                <h5>
                                                    {
                                                        t("console:manage.features.governanceConnectors.categories")
                                                    }
                                                </h5>
                                                <Menu
                                                    secondary
                                                    vertical
                                                    className="governance-connector-categories">
                                                    {
                                                        connectors.map((
                                                            connector: GovernanceConnectorWithRef,
                                                            index: number) => (

                                                            <Menu.Item
                                                                as="a"
                                                                key={ index }
                                                                className={
                                                                    selectedConnector?.id === connector?.id
                                                                        ? "active"
                                                                        : ""
                                                                }
                                                                onClick={ () => {
                                                                    // Scroll to the selected connector.
                                                                    CommonUtils.scrollToTarget(
                                                                        connector?.ref?.current,
                                                                        ScrollTopPosition
                                                                    );

                                                                    setSelectorConnector(connector);
                                                                } }
                                                            >
                                                                { connector.friendlyName }
                                                            </Menu.Item>
                                                        ))
                                                    }
                                                </Menu>
                                            </>
                                        )
                                    }
                                </Sticky>
                            </Rail>)
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
GovernanceConnectorsPage.defaultProps = {
    "data-testid": "governance-connectors-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GovernanceConnectorsPage;
