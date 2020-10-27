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

import { AlertLevels, ReferableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Menu } from "semantic-ui-react";
import { history } from "../../core";
import { getConnectorCategory } from "../api";
import { DynamicGovernanceConnector } from "../components";
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

    const { t } = useTranslation();

    const [ connectorCategory, setConnectorCategory ] = useState<GovernanceConnectorCategoryInterface>({});
    const [ connectors, setConnectors ] = useState<GovernanceConnectorWithRef[]>([]);
    const [ selectedConnector, setSelectorConnector ] = useState<GovernanceConnectorWithRef>(null);

    useEffect(() => {
        loadCategoryConnectors();
    }, []);

    const loadCategoryConnectors = () => {
        const path = history.location.pathname.split("/");
        const categoryId = path[ path.length - 1 ];

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
                                "adminPortal:components.governanceConnectors.notifications." +
                                "getConnector.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "adminPortal:components.governanceConnectors.notifications." +
                                "getConnector.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "adminPortal:components.governanceConnectors.notifications." +
                                "getConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "adminPortal:components.governanceConnectors.notifications." +
                                "getConnector.genericError.message"
                            )
                        })
                    );
                }
            });
    };

    return (
        <PageLayout
            title={ connectorCategory?.name }
            description={
                connectorCategory?.description
                    ?? t("adminPortal:components.governanceConnectors.connectorSubHeading",
                    { name: connectorCategory?.name })
            }
            data-testid={ `${ testId }-page-layout` }
        >
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 12 }>
                        {
                            (connectors && Array.isArray(connectors) && connectors.length > 0)
                                ? connectors.map((connector: GovernanceConnectorWithRef, index: number) => (
                                    <EmphasizedSegment key={ index }>
                                        <div ref={ connector.ref }>
                                            <DynamicGovernanceConnector
                                                connector={ connector }
                                                data-testid={ `${ testId }-` + connector?.id }
                                                onUpdate={ () => loadCategoryConnectors() }
                                            />
                                        </div>
                                    </EmphasizedSegment>
                                ))
                                : null
                        }
                    </Grid.Column>
                    <Grid.Column width={ 4 }>
                        {
                            (connectors && Array.isArray(connectors) && connectors.length > 0) && (
                                <>
                                    <h5>{ t("adminPortal:components.governanceConnectors.categories") }</h5>
                                    <Menu secondary vertical className="governance-connector-categories">
                                        {
                                            connectors.map((connector: GovernanceConnectorWithRef, index: number) => (
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
                                                        connector?.ref?.current?.scrollIntoView({
                                                            behavior: "smooth", block: "center"
                                                        });

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
                    </Grid.Column>
                </Grid.Row>
            </Grid>
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
