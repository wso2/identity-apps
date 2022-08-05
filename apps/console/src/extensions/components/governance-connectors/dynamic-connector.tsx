/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Checkbox, CheckboxProps, Divider, Header, Segment, Image, Grid } from "semantic-ui-react";
import {
    GovernanceConnectorInterface,
    GovernanceConnectorUtils,
    updateGovernanceConnector
} from "../../../features/server-configurations";
import { serverConfigurationConfig } from "../../configs/server-configuration";

/**
 * Interface of the prop types of the `ExtendedDynamicConnector`.
 */
interface DynamicConnectorPropsInterface extends TestableComponentInterface {
    connector: GovernanceConnectorInterface;
    connectorForm: ReactElement;
    connectorIllustration: string;
    connectorSubHeading: string;
    connectorToggleName: string;
}

/**
 * This component renders the connector settings.
 *
 * @param {DynamicConnectorPropsInterface} props - Component props.
 */
export const ExtendedDynamicConnector: FunctionComponent<DynamicConnectorPropsInterface> = (
    props: DynamicConnectorPropsInterface
): ReactElement => {
    const { connector, connectorForm, connectorIllustration, connectorToggleName, [ "data-testid" ]: testId } = props;

    const [ showForm, setShowForm ] = useState<boolean>(false);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    /**
     * Update showForm state based on existing data.
     */
    useEffect(() => {
        if (connector) {
            const enableProperty = connector.properties.find((property) => property.name === connectorToggleName);

            setShowForm(enableProperty?.value === "true");
        }
    }, [ connector ]);

    /**
     * This is called when the enable toggle changes.
     *
     * @param {SyntheticEvent} e Event object
     * @param {CheckboxProps} data The data object.
     */
    const handleToggle = (e: SyntheticEvent, data: CheckboxProps): void => {
        setShowForm(data.checked);

        const updateData = {
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
                            "console:manage.features.governanceConnectors.notifications." +
                            "updateConnector.success.description",
                            { name: connector.friendlyName }
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.governanceConnectors.notifications." +
                            "updateConnector.success.message"
                        )
                    })
                );
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "updateConnector.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "updateConnector.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "updateConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.governanceConnectors.notifications." +
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
