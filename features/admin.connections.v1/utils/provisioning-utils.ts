/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { getOutboundProvisioningConnectorsMetaData } from "../components/meta/connectors";
import { CommonAuthenticatorConstants } from "../constants/common-authenticator-constants";
import {
    OutboundProvisioningConnectorListItemInterface,
    OutboundProvisioningConnectorMetaDataInterface
} from "../models/connection";

/**
 * Filters deprecated connectors and enriches with UI metadata.
 *
 * @param connectorsList - Raw connector list from the API.
 * @param isLoading - Whether the connector list is still loading.
 * @returns Enriched list of connector metadata.
 */
export const getFilteredConnectorMetadataList = (
    connectorsList: OutboundProvisioningConnectorListItemInterface[],
    isLoading: boolean
): OutboundProvisioningConnectorMetaDataInterface[] => {
    if (isLoading || !connectorsList) {
        return [];
    }

    const filteredConnectorList: OutboundProvisioningConnectorListItemInterface[] =
        connectorsList.filter(
            (connector: OutboundProvisioningConnectorListItemInterface) =>
                connector?.connectorId !==
                CommonAuthenticatorConstants.DEPRECATED_SCIM1_PROVISIONING_CONNECTOR_ID
        );

    const knownConnectorsMetaData: OutboundProvisioningConnectorMetaDataInterface[] =
        getOutboundProvisioningConnectorsMetaData();

    return filteredConnectorList.map((connector: OutboundProvisioningConnectorListItemInterface) => {
        const metadata: OutboundProvisioningConnectorMetaDataInterface | undefined =
            knownConnectorsMetaData.find((meta: OutboundProvisioningConnectorMetaDataInterface) =>
                meta?.connectorId === connector?.connectorId
            );

        return {
            ...connector,
            ...(metadata ?? {})
        } as OutboundProvisioningConnectorMetaDataInterface;
    });
};
