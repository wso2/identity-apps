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
import { Forms } from "@wso2is/forms";
import { Heading, SelectionCard } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { OutboundProvisioningConnectorListItemInterface } from "../../../../models";
import { OutboundConnectors } from "../../../meta";

/**
 * Interface for the outbound provisioning connectors props.
 */
interface OutboundProvisioningConnectorsPropsInterface extends TestableComponentInterface {
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    connectorList?: OutboundProvisioningConnectorListItemInterface[];
    initialSelection: string;
}

export const OutboundProvisioningConnectors: FunctionComponent<OutboundProvisioningConnectorsPropsInterface> = (
    props: OutboundProvisioningConnectorsPropsInterface
): ReactElement => {

    const {
        initialSelection,
        onSubmit,
        triggerSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [
        selectedConnector,
        setSelectedConnector
    ] = useState<OutboundProvisioningConnectorListItemInterface>(undefined);

    /**
     * Select the connector instance based on the initial selection.
     */
    useEffect(() => {

        if (!(OutboundConnectors && Array.isArray(OutboundConnectors) && OutboundConnectors.length > 0)) {
            return;
        }

        setSelectedConnector(OutboundConnectors.find((connector) => initialSelection === connector.connectorId));
    }, [ initialSelection ]);

    /**
     * Handles inbound protocol selection.
     * 
     * @param connector
     */
    const handleConnectorSelection = (connector: OutboundProvisioningConnectorListItemInterface): void => {
        setSelectedConnector(connector);
    };

    return (
        <Forms
            onSubmit={ (): void => {
                onSubmit({
                    connectorId: selectedConnector?.connectorId
                });
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Heading as="h4">
                            { t("console:develop.features.idp.wizards.addProvisioningConnector.steps." +
                                "connectorSelection.defaultSetup.title") }
                            <Heading subHeading as="h6">
                                { t("console:develop.features.idp.wizards.addProvisioningConnector.steps." +
                                    "connectorSelection.defaultSetup.subTitle") }
                            </Heading>
                        </Heading>
                            {
                                OutboundConnectors && OutboundConnectors.length > 0 ? (
                                    OutboundConnectors.map((connector, index: number) => {
                                        return (
                                            <SelectionCard
                                                inline
                                                key={ index }
                                                header={ connector.displayName }
                                                image={ connector.icon }
                                                onClick={ (): void => handleConnectorSelection(connector) }
                                                selected={
                                                    selectedConnector
                                                        ? selectedConnector.connectorId === connector.connectorId
                                                        : index === 0
                                                }
                                                size="small"
                                                data-testid={ `${ testId }-connector-${ index }` }
                                            />
                                        );
                                    })
                                ) : null
                            }
                        </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};
