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
    OutboundProvisioningAuthenticationMode,
    SCIM2_AUTH_PROPERTIES,
    SCIM2_CONNECTOR_NAME
} from "../constants/outbound-provisioning-constants";
import {
    CommonPluggableComponentMetaPropertyInterface,
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

/**
 * Determines if a field should be required based on the current authentication mode.
 * For SCIM2 connectors, this overrides the metadata's isMandatory for authentication credential fields.
 *
 * @param propertyKey - The key of the property to check.
 * @param propertyMetadata - The metadata of the property.
 * @param connectorName - The name of the connector (e.g., "scim2").
 * @param currentAuthMode - The currently selected authentication mode.
 * @returns Whether the field should be required.
 */
export const isFieldRequiredForAuthMode = (
    propertyKey: string | undefined,
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
    connectorName: string | undefined,
    currentAuthMode: string | undefined
): boolean => {
    // For non-SCIM2 connectors or non-auth properties, use metadata's isMandatory
    const isScim2: boolean = connectorName?.toLowerCase() === SCIM2_CONNECTOR_NAME;

    if (!isScim2) {
        return propertyMetadata.isMandatory || false;
    }

    // Check if this is an authentication property
    const isAuthProperty: boolean = !!propertyKey && Object.values(SCIM2_AUTH_PROPERTIES).includes(propertyKey);

    if (!isAuthProperty) {
        return propertyMetadata.isMandatory || false;
    }

    // Authentication mode field itself uses metadata's isMandatory
    if (propertyKey === SCIM2_AUTH_PROPERTIES.AUTHENTICATION_MODE) {
        return propertyMetadata.isMandatory || false;
    }

    // For authentication credential fields, determine requirement based on selected auth mode
    switch (currentAuthMode) {
        case OutboundProvisioningAuthenticationMode.BASIC:
            return propertyKey === SCIM2_AUTH_PROPERTIES.USERNAME
                || propertyKey === SCIM2_AUTH_PROPERTIES.PASSWORD;

        case OutboundProvisioningAuthenticationMode.BEARER:
            return propertyKey === SCIM2_AUTH_PROPERTIES.ACCESS_TOKEN;

        case OutboundProvisioningAuthenticationMode.API_KEY:
            return propertyKey === SCIM2_AUTH_PROPERTIES.API_KEY_HEADER
                || propertyKey === SCIM2_AUTH_PROPERTIES.API_KEY_VALUE;

        case OutboundProvisioningAuthenticationMode.NONE:
            // No auth credentials required when mode is NONE
            return false;

        default:
            // Fallback to metadata's isMandatory
            return propertyMetadata.isMandatory || false;
    }
};
