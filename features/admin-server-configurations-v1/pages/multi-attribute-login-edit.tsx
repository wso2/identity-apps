/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, PageLayout } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Ref } from "semantic-ui-react";
import { AppConstants, AppState, FeatureConfigInterface, history } from "../../core";
import { getConnectorDetails } from "../api/governance-connectors";
import { DynamicGovernanceConnector } from "../components/governance-connectors/dynamic-governance-connector";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import { GovernanceConnectorInterface } from "../models/governance-connectors";

/**
 * Props for the Server Configurations page.
 */
type GovernanceConnectorsPageInterface = TestableComponentInterface;

/**
 * Multi Attribute Login connector edit page.
 *
 * @param props - Props injected to the component.
 * @returns Multi Attribute Login connector edit page.
 */
export const MultiAttributeLoginEdit: FunctionComponent<GovernanceConnectorsPageInterface> = (
    props: GovernanceConnectorsPageInterface
): ReactElement => {
    const { [ "data-testid" ]: testId } = props;

    const dispatch: Dispatch = useDispatch();
    const pageContextRef: MutableRefObject<HTMLElement> = useRef(null);

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const categoryId: string = ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID;
    const connectorId: string = ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID;

    const [ connector, setConnector ] = useState<GovernanceConnectorInterface>(undefined);
    const [ isConnectorRequestLoading, setConnectorRequestLoading ] = useState<boolean>(false);

    useEffect(() => {
        // If Governance Connector read permission is not available, prevent from trying to load the connectors.
        if (!hasRequiredScopes(featureConfig?.governanceConnectors,
            featureConfig?.governanceConnectors?.scopes?.read,
            allowedScopes)) {

            return;
        }

        loadConnectorDetails();
    }, []);

    /**
     * Load multi attribute login connector.
     */
    const loadConnectorDetails = () => {

        setConnectorRequestLoading(true);

        getConnectorDetails(
            categoryId,
            connectorId
        )
            .then((response: GovernanceConnectorInterface) => {
                response.categoryId = categoryId;
                setConnector(response);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "getConnector.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "getConnector.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "getConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "getConnector.genericError.message"
                            )
                        })
                    );
                }
            })
            .finally(() => {
                setConnectorRequestLoading(false);
            });
    };

    const onBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    if (isConnectorRequestLoading && !connector) {
        return <ContentLoader />;
    }

    return (
        <PageLayout
            title={ connector?.friendlyName }
            pageTitle={ connector?.friendlyName }
            description={
                t("governanceConnectors:connectorSubHeading", {
                    name: connector?.friendlyName
                })
            }
            backButton={ {
                onClick: () => onBackButtonClick(),
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            data-testid={ `${testId}-page-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <Grid>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 16 }>
                            <Grid>
                                <Grid.Row>
                                    <DynamicGovernanceConnector
                                        connector={ connector }
                                        data-testid={ `${testId}-` + connector?.id }
                                        onUpdate={ () => loadConnectorDetails() }
                                    />
                                </Grid.Row>
                            </Grid>
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
MultiAttributeLoginEdit.defaultProps = {
    "data-testid": "multi-attribute-login-edit"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default MultiAttributeLoginEdit;
