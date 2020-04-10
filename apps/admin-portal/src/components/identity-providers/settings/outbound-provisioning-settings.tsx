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

import { ContentLoader, Heading } from "@wso2is/react-components";
import {
    getOutboundProvisioningConnector,
    getOutboundProvisioningConnectorMetadata,
    updateOutboundProvisioningConnector
} from "../../../api";
import {
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorMetaInterface,
    OutboundProvisioningConnectorsInterface
} from "../../../models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { Divider } from "semantic-ui-react";
import { OutboundProvisioningConnectorFormFactory } from "../forms";
import { useDispatch } from "react-redux";

/**
 * Proptypes for the provisioning settings component.
 */
interface ProvisioningSettingsPropsInterface {
    /**OutboundProvisioningConnectorsInterface
     * Currently editing idp id.
     */
    idpId: string;

    /**
     * Outbound connector details of the IDP
     */
    outboundConnectors: OutboundProvisioningConnectorsInterface;
    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

/**
 *  Identity Provider provisioning settings component.
 *
 * @param { ProvisioningSettingsPropsInterface } props - Props injected to the component.
 * @return { ReactElement }
 */
export const OutboundProvisioningSettings: FunctionComponent<ProvisioningSettingsPropsInterface> = (
    props: ProvisioningSettingsPropsInterface
): ReactElement => {

    const {
        idpId,
        outboundConnectors,
        isLoading,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const [connectorMeta, setConnectorMeta] = useState<OutboundProvisioningConnectorMetaInterface>({
        blockingEnabled: false,
        connectorId: "",
        displayName: "",
        name: "",
        properties: [],
        rulesEnabled: false
    });

    const [connectorDetails, setConnectorDetails] = useState<OutboundProvisioningConnectorInterface>({
        blockingEnabled: false,
        connectorId: "",
        isDefault: false,
        isEnabled: false,
        properties: [],
        rulesEnabled: false
    });

    /**
     * Handles the connector config form submit action.
     *
     * @param values - Form values.
     */
    const handleConnectorConfigFormSubmit = (values: OutboundProvisioningConnectorInterface): void => {
        updateOutboundProvisioningConnector(idpId, values)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the outbound provisioning connector.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(idpId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating the outbound provisioning connector.",
                    level: AlertLevels.ERROR,
                    message: "Update error"
                }));
            });
    };

    useEffect(() => {
        if (outboundConnectors.defaultConnectorId) {
            getOutboundProvisioningConnector(idpId, outboundConnectors.defaultConnectorId)
                .then(response => {
                    setConnectorDetails(response);
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: "Retrieval error"
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: "An error occurred retrieving the outbound provisioning connector details.",
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));
                });

            getOutboundProvisioningConnectorMetadata(outboundConnectors.defaultConnectorId)
                .then(response => {
                    setConnectorMeta(response);
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: "Retrieval error"
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: "An error occurred retrieving the outbound provisioning connector metadata.",
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));
                });
        }
    }, [props]);

    return (
        (!isLoading)
            ? (
                <div className="default-provisioning-connector-section">
                    {
                        (
                            <>
                                <Heading as="h4">{connectorMeta?.name}</Heading>
                                {
                                    outboundConnectors.defaultConnectorId &&
                                    <OutboundProvisioningConnectorFormFactory
                                        metadata={ connectorMeta }
                                        initialValues={ connectorDetails }
                                        onSubmit={ handleConnectorConfigFormSubmit }
                                        type={ connectorMeta?.name }
                                    />
                                }
                                <Divider hidden/>
                            </>
                        )}
                </div>
            )
            : <ContentLoader/>
    );
};
