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

import { FunctionComponent, ReactElement, useState } from "react";
import * as React from "react";
import { OutboundProvisioningConnectorListItemInterface } from "../../../../../models";
import { Heading, SelectionCard } from "@wso2is/react-components";
import { Grid } from "semantic-ui-react";
import { OutboundConnectors } from "../../../meta";
import { Forms } from "@wso2is/forms";

/**
 * Interface for the outbound provisioning connectors props.
 */
interface OutboundProvisioningConnectorsPropsInterface {
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    connectorList?: OutboundProvisioningConnectorListItemInterface[];
    initialSelection: string;
}

export const OutboundProvisioningConnectors: FunctionComponent<OutboundProvisioningConnectorsPropsInterface> = (
    props: OutboundProvisioningConnectorsPropsInterface
): ReactElement => {

    const { onSubmit, triggerSubmit } = props;

    const [
        selectedConnector,
        setSelectedConnector
    ] = useState<OutboundProvisioningConnectorListItemInterface>(undefined);

    /**
     * Handles inbound protocol selection.
     *
     * @param {IdentityProviderInterface} template - Selected protocol.
     */
    const handleConnectorSelection = (connector: OutboundProvisioningConnectorListItemInterface): void => {
        setSelectedConnector(connector);
    };

    return (
        <Forms
            onSubmit={ (): void => {
                onSubmit({
                    connectorId: selectedConnector?.connectorId
                })
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Heading as="h4">
                            Connector Types
                            <Heading subHeading as="h6">
                                Select the type of the new outbound provisioning connector
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
                                                selected={ selectedConnector?.connectorId === connector.connectorId }
                                                size="small"
                                            />
                                        )
                                    })
                                ) : null
                            }
                        </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};
