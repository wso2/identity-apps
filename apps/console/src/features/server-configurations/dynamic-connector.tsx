/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Divider, Grid, Header, Image, Segment } from "semantic-ui-react";
import { updateGovernanceConnector } from "./api";
import { GovernanceConnectorUtils } from "./utils";
import { serverConfigurationConfig } from "../../extensions/configs/server-configuration";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "../server-configurations/models/governance-connectors";

/**
 * Interface of the prop types of the `ExtendedDynamicConnector`.
 */
interface DynamicConnectorPropsInterface extends TestableComponentInterface {
    connector: GovernanceConnectorInterface;
    connectorForm: ReactElement;
    connectorIllustration: string;
    connectorSubHeading: ReactNode;
    connectorToggleName: string;
}

/**
 * This component renders the connector settings.
 *
 * @param DynamicConnectorPropsInterface - props - Component props.
 */
export const ExtendedDynamicConnector: FunctionComponent<DynamicConnectorPropsInterface> = (
    props: DynamicConnectorPropsInterface
): ReactElement => {
    const { connector, connectorForm, connectorIllustration, connectorToggleName, [ "data-testid" ]: testId } = props;

    const [ showForm, setShowForm ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    /**
     * Update showForm state based on existing data.
     */
    useEffect(() => {
        if (connector) {
            const enableProperty: ConnectorPropertyInterface = connector.properties.find(
                (property: ConnectorPropertyInterface) => property.name === connectorToggleName
            );

            setShowForm(enableProperty?.value === "true");
        }
    }, [ connector ]);

    /**
     * This is called when the enable toggle changes.
     *
     * @param SyntheticEvent - e Event object
     * @param CheckboxProps - data The data object.
     */
    const handleToggle = (e: SyntheticEvent, data: CheckboxProps): void => {
        setShowForm(data.checked);

        const updateData: {
            operation: string;
            properties: any[];
        } = {
            operation: "UPDATE",
            properties: []
        };

        for (const property of connector.properties) {
            updateData.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(property.name),
                value: property.value
            });
        }

        if (
            serverConfigurationConfig.connectorToggleName[ connector?.name ] &&
            serverConfigurationConfig.autoEnableConnectorToggleProperty
        ) {
            updateData.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                    serverConfigurationConfig.connectorToggleName[ connector?.name ]
                ),
                value: data.checked.toString()
            });
        }

        updateGovernanceConnector(updateData, connector.categoryId, connector.id)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "governanceConnectors:notifications." +
                            "updateConnector.success.description",
                            { name: connector.friendlyName }
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "governanceConnectors:notifications." +
                            "updateConnector.success.message"
                        )
                    })
                );
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.genericError.message"
                            )
                        })
                    );
                }
            });
    };

    /**
     * This renders the enable toggle.
     */
    const connectorToggle = (): ReactElement => {
        return (
            <Checkbox
                label={ t("extensions:manage.serverConfigurations." +
                    "accountManagement.accountRecovery.toggleName") }
                toggle
                onChange={ handleToggle }
                checked={ showForm }
                data-testId={ `${ testId }-enable-toggle` }
            />
        );
    };

    return (
        <Segment padded className="governance-connector-banner">
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column computer={ 10 } tablet={ 16 } mobile={ 16 }>
                        <Header>
                            <span data-testId={ `${ testId }-header` }>
                                { t("extensions:manage.serverConfigurations." +
                                     "accountManagement.accountRecovery.heading") }
                            </span>
                            <Divider hidden />
                            <Header.Subheader data-testId={ `${ testId }-sub-header` }>
                                { t("extensions:manage.serverConfigurations." +
                                    "accountManagement.accountRecovery.subHeading") }
                            </Header.Subheader>
                        </Header>
                        <Divider hidden />
                        { connectorToggle() }
                    </Grid.Column>
                    <Grid.Column computer={ 6 } >
                        <Image src={ connectorIllustration } className="governance-connector-banner-image" />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            { showForm && (
                <>
                    <Divider hidden />
                    <Divider />
                    <Header as="h5">
                        { t("extensions:manage.serverConfigurations.additionalSettings") }
                    </Header>
                    { connectorForm }
                </>
            ) }
        </Segment>
    );
};

/**
 * Dynamic connector component default props.
 */
ExtendedDynamicConnector.defaultProps = {
    "data-testid": "governance-connector"
};
