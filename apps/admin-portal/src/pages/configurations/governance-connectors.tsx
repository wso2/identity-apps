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

import { TestableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { DynamicGovernanceConnector } from "../../components/governance-connectors/dynamic-governance-connector";
import { history } from "../../helpers";
import { GovernanceConnectorCategoryInterface } from "../../models";
import { getConnectorCategory } from "../../api";

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
            .then((response) => {
                setConnectorCategory(response);
            })
            .catch((error) => {
                // Todo handle error
                console.log(error)
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
