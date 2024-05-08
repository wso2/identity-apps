/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Forms } from "@wso2is/forms";
import { GenericIcon, Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "semantic-ui-react";
import {
    OutboundProvisioningConnectorListItemInterface,
    OutboundProvisioningConnectorMetaDataInterface
} from "../../../models/connection";

/**
 * Interface for the outbound provisioning connectors props.
 */
interface OutboundProvisioningConnectorsPropsInterface extends TestableComponentInterface {
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    initialSelection: string;
    connectorList: OutboundProvisioningConnectorMetaDataInterface[];
}

export const OutboundProvisioningConnectors: FunctionComponent<OutboundProvisioningConnectorsPropsInterface> = (
    props: OutboundProvisioningConnectorsPropsInterface
): ReactElement => {

    const {
        initialSelection,
        onSubmit,
        triggerSubmit,
        connectorList,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Initial selected connector.
     */
    const initialSelectedConnector: OutboundProvisioningConnectorListItemInterface = useMemo(() => {
        return connectorList?.find(
            (connector: OutboundProvisioningConnectorMetaDataInterface) => initialSelection === connector.connectorId);
    }, [ connectorList, initialSelection ]);

    const [
        selectedConnector,
        setSelectedConnector
    ] = useState<OutboundProvisioningConnectorListItemInterface>(initialSelectedConnector);

    /**
     * Handles inbound protocol selection.
     *
     * @param connector - Selected connector.
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
            <Heading as="h4">
                { t("authenticationProvider:wizards." +
                    "addProvisioningConnector.steps." +
                    "connectorSelection.defaultSetup.title") }
                <Heading subHeading as="h6">
                    { t("authenticationProvider:" +
                        "wizards.addProvisioningConnector.steps." +
                        "connectorSelection.defaultSetup.subTitle") }
                </Heading>
            </Heading>
            <Card.Group className="authenticators-grid mt-3">
                {
                    connectorList?.map((connector: OutboundProvisioningConnectorMetaDataInterface, index: number) => {
                        return (
                            <Card
                                key={ index }
                                onClick={ (): void => handleConnectorSelection(connector) }
                                selected={
                                    selectedConnector
                                        ? selectedConnector?.connectorId === connector?.connectorId
                                        : index === 0
                                }
                                className={
                                    selectedConnector?.connectorId === connector?.connectorId
                                        ? "selection-info-card selected"
                                        : "selection-info-card"
                                }
                                size="small"
                                data-testid={ `${ testId }-connector-${ index }` }
                            >
                                <Card.Content className="p-4">
                                    <GenericIcon
                                        icon={ connector.icon }
                                        size="micro"
                                        floated="left"
                                        shape="square"
                                        className="theme-icon hover-rounded card-image"
                                        inline
                                        transparent
                                    />
                                    <Card.Header
                                        textAlign="left"
                                        className="card-header ellipsis pt-1"
                                    >
                                        { connector.displayName ?? connector.name }
                                    </Card.Header>
                                    <Card.Description
                                        className="card-description"
                                    >
                                        { connector.description }
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        );
                    })
                }
            </Card.Group>
        </Forms>
    );
};
