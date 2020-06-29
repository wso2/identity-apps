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
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { getConnectorCategory } from "../../api";
import { DynamicGovernanceConnector } from "../../components";
import { history } from "../../helpers";
import { GovernanceConnectorCategoryInterface } from "../../models";

/**
 * Props for the Server Configurations page.
 */
type GovernanceConnectorsPageInterface = TestableComponentInterface;

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

    const {
        ["data-testid"]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ connectorCategory, setConnectorCategory ] = useState<GovernanceConnectorCategoryInterface>({});

    useEffect(() => {
        const path = history.location.pathname.split("/");
        const categoryId = path[ path.length - 1 ];

        loadCategoryConnectors(categoryId);
    }, []);

    const loadCategoryConnectors = (categoryId: string) => {
        getConnectorCategory(categoryId)
            .then((response: GovernanceConnectorCategoryInterface) => {
                response.connectors.map(connector => {
                    connector.categoryId = categoryId;
                });
                setConnectorCategory(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(addAlert({
                        description: t("adminPortal:components.governanceConnectors.notifications." +
                            "getConnector.error.description", { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("adminPortal:components.governanceConnectors.notifications." +
                            "getConnector.error.message")
                    }));
                } else {
                    // Generic error message
                    dispatch(addAlert({
                        description: t("adminPortal:components.governanceConnectors.notifications." +
                            "getConnector.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("adminPortal:components.governanceConnectors.notifications." +
                            "getConnector.genericError.message")
                    }));
                }
            });
    };

    return (
        <PageLayout
            title={ connectorCategory?.name }
            description={ connectorCategory?.description }
            showBottomDivider={ true }
            data-testid={ `${ testId }-page-layout` }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 10 }>
                        {
                            connectorCategory?.connectors?.map((connector, index) => {
                                return (
                                    <>
                                        <DynamicGovernanceConnector
                                            connector={ connector }
                                            key={ index }
                                            data-testid={ `${ testId }-` + connector.id }
                                        />
                                        <Divider hidden={ true }/>
                                    </>
                                )
                            })
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
